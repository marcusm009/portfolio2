import * as BABYLON from '@babylonjs/core'
import * as ADDONS from '@babylonjs/addons'
import { Utilities, Axis, Orientation, Face } from '../utilities';
import type { IFace } from './faces/IFace';
import { HtmlFace } from './faces/HtmlFace';
import { PlaneFace } from './faces/PlaneFace';

export class HtmlRectangularPrism {
    mesh:  BABYLON.Mesh;
    edgeThickness:  number;
    faces: IFace[] = [];
    canMove: boolean = true;
    width: number;
    height: number;
    depth: number;
    
    constructor(scene: BABYLON.Scene,
        htmlElements: HTMLElement[],
        width: number,
        height: number,
        depth: number,
        edgeThickness: number = 0.1,
        position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
        rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
        id: string = crypto.randomUUID().toString()
    ) {
        const htmlMeshRenderer = new ADDONS.HtmlMeshRenderer(scene);

        scene.onDisposeObservable.addOnce(() => {
            console.log("Scene disposed");
            htmlMeshRenderer.dispose();
        });

        this.mesh = BABYLON.MeshBuilder.CreateBox(id, {
            width: width,
            height: height,
            depth: depth,
        }, scene);
        this.mesh.position = position;
        this.mesh.rotation = rotation;
        this.mesh.isVisible = false;

        this.edgeThickness = edgeThickness;

        this.assignFace(scene,
            'front',
            htmlElements.pop(),
            width,
            height,
            new BABYLON.Vector3(0, 0, (-depth / 2)+this.edgeThickness),
            BABYLON.Vector3.Zero()
        );

        this.assignFace(scene,
            'left',
            htmlElements.pop(),
            depth,
            height,
            new BABYLON.Vector3((width / 2)-this.edgeThickness, 0, 0),
            new BABYLON.Vector3(0, -Math.PI / 2, 0),
        );

        this.assignFace(scene,
            'back',
            htmlElements.pop(),
            width,
            height,
            new BABYLON.Vector3(0, 0, (depth / 2)-this.edgeThickness),
            new BABYLON.Vector3(0, Math.PI, 0),
        );

        this.assignFace(scene,
            'right',
            htmlElements.pop(),
            depth,
            height,
            new BABYLON.Vector3((-width / 2)+this.edgeThickness, 0, 0),
            new BABYLON.Vector3(0, Math.PI / 2, 0),
        );

        this.assignFace(scene,
            'top',
            htmlElements.pop(),
            width,
            depth,
            new BABYLON.Vector3(0, (height / 2)-this.edgeThickness, 0),
            new BABYLON.Vector3(Math.PI / 2, 0, 0),
        );

        this.assignFace(scene,
            'bottom',
            htmlElements.pop(),
            width,
            depth,
            new BABYLON.Vector3(0, (-height / 2)+this.edgeThickness, 0),
            new BABYLON.Vector3(-Math.PI / 2, 0, 0),
        );

        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    private assignFace(scene: BABYLON.Scene,
        name : string,
        htmlElement: HTMLElement | undefined,
        width: number,
        height: number,
        position: BABYLON.Vector3,
        rotation: BABYLON.Vector3
    )
    {
        const face = htmlElement
            ? new HtmlFace(scene,
                htmlElement,
                width - this.edgeThickness,
                height - this.edgeThickness,
                this.edgeThickness,
                position,
                rotation,
                this.mesh,
                `${this.mesh.id}-${name}`
            )
            : new PlaneFace(scene,
                width - this.edgeThickness,
                height - this.edgeThickness,
                this.edgeThickness,
                position,
                rotation,
                this.mesh,
                `${this.mesh.id}-${name}`
            );

        this.faces.push(face);
    }

    public async moveXPos()
    {
        this.move(Axis.X, true);
    }

    public async moveXNeg()
    {
        this.move(Axis.X, false);
    }

    public async moveZPos()
    {
        this.move(Axis.Z, true);
    }

    public async moveZNeg()
    {
        this.move(Axis.Z, false);
    }

    private getRotationX(axis: Axis, isPositiveDirection: boolean) : number
    {
        const ortn = this.getOrientation();
        
        let distance: number;
        
        if (!this.mesh.rotationQuaternion)
            distance = this.width;
        // else if (this.mesh.rotationQuaternion)
        
        const sign = Utilities.toSign(isPositiveDirection);
        const transformedSign = sign * Utilities.getRotationSign(axis);

        return sign * (this.width / 2);
    }

    private getRotationZ(axis: Axis, isPositiveDirection: boolean) : number
    {
        const sign = Utilities.toSign(isPositiveDirection);
        const transformedSign = sign * Utilities.getRotationSign(axis);

        return transformedSign * (this.depth / 2);
    }

    public async move(axis: Axis,
        isPositiveDirection: boolean,
        steps: number = 20,
        stepDurationInMs: number = 10)
    {
        // todo: replace with move buffer
        if (!this.canMove)
            return;
        this.canMove = false;

        console.log(`position: ${this.mesh.position}`)
        console.log(`rot-quat: ${this.mesh.rotationQuaternion}`)

        const sign = Utilities.toSign(isPositiveDirection);
        const transformedSign = sign * Utilities.getRotationSign(axis);
        
        const rotationPoint = new BABYLON.Vector3(
            this.mesh.position.x + this.getRotationX(axis, isPositiveDirection),
            0,
            this.mesh.position.z + this.getRotationZ(axis, isPositiveDirection));

        for(let i = 0; i < steps; i++)
        {
            await Utilities.sleep(stepDurationInMs);
            this.mesh.rotateAround(rotationPoint,
                Utilities.getRotationVector(axis),
                (transformedSign * Math.PI) / (2 * steps));
        }

        // const scale = sign * (axis == Axis.X ? this.width : this.depth);
        // const movement = Utilities.getIdentityVector(axis).scale(scale);
        // this.mesh.position.addInPlace(movement);

        this.roundPosition();

        // console.log(`width: ${this.width}`);
        // console.log(`depth: ${this.depth}`);
        // console.log(`height: ${this.height}`);
        
        // console.log(`moving ${isPositiveDirection ? '+' : '-'}${axis}`);

        // console.log(`position: ${this.mesh.position}`);
        console.log(`rot-quat: ${this.mesh.rotationQuaternion}`);

        console.log(`bottom: ${this.getOrientation().faceOnFloor}`);
        console.log(`bottom-rot: ${this.getOrientation().rotation}`);
        console.log(`bottom-dim: ${this.getBottomFaceDimensions()}`);

        this.canMove = true;
    }

    private async roundPosition()
    {
        this.mesh.position.x = Math.round(this.mesh.position.x * 10) / 10;
        this.mesh.position.y = Math.round(this.mesh.position.y * 10) / 10;
        this.mesh.position.z = Math.round(this.mesh.position.z * 10) / 10;
    }

    private getOrientation() : Orientation
    {
        return Utilities.quaternionToOrientation(this.mesh.rotationQuaternion);
    }

    private getBottomFaceDimensions() : BABYLON.Vector2
    {
        const ortn = this.getOrientation();
        let dim: BABYLON.Vector2;

        switch (ortn.faceOnFloor)
        {
            case (Face.BOTTOM):
            case (Face.TOP):
                dim = new BABYLON.Vector2(this.width, this.depth);
                break;
            case (Face.RIGHT):
            case (Face.LEFT):
                dim = new BABYLON.Vector2(this.width, this.height);
                break;
            case (Face.FRONT):
            case (Face.BOTTOM):
            default:
                dim = new BABYLON.Vector2(this.height, this.depth);
                break;
        }

        // todo: rotate
        return dim;
    }
}