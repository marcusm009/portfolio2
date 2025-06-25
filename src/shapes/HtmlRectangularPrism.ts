import * as BABYLON from '@babylonjs/core'
import * as ADDONS from '@babylonjs/addons'
import { Utilities, Axis, Orientation, Face } from '../Utilities';
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

    public async moveXPos(): Promise<BABYLON.Vector3>
    {
        return this.move(Axis.X, true);
    }

    public async moveXNeg(): Promise<BABYLON.Vector3>
    {
        return this.move(Axis.X, false);
    }

    public async moveZPos(): Promise<BABYLON.Vector3>
    {
        return this.move(Axis.Z, true);
    }

    public async moveZNeg(): Promise<BABYLON.Vector3>
    {
        return this.move(Axis.Z, false);
    }

    public async move(axis: Axis,
        isPositiveDirection: boolean,
        steps: number = 20,
        stepDurationInMs: number = 10): Promise<BABYLON.Vector3>
    {
        // todo: replace with move buffer
        if (!this.canMove)
            return BABYLON.Vector3.Zero();
        this.canMove = false;

        const initialPosition = this.mesh.position.clone();

        const sign = Utilities.toSign(isPositiveDirection);
        const transformedSign = sign * Utilities.getRotationSign(axis);
        
        let relativeRotationPoint = BABYLON.Vector3.Zero();

        if (axis == Axis.X)
            relativeRotationPoint.x = sign * this.getBottomFaceDimensions().x / 2;

        if (axis == Axis.Z)
            relativeRotationPoint.z = sign * this.getBottomFaceDimensions().y / 2;

        const rotationPoint = this.mesh.position.add(relativeRotationPoint);
        rotationPoint.y = 0;

        for(let i = 0; i < steps; i++)
        {
            await Utilities.sleep(stepDurationInMs);
            this.mesh.rotateAround(rotationPoint,
                Utilities.getRotationVector(axis),
                (transformedSign * Math.PI) / (2 * steps));
        }

        this.roundPosition();

        this.canMove = true;

        return this.mesh.position.subtract(initialPosition);
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

        if (Math.abs(ortn.rotation) % Math.PI != 0)
        {
            const temp = dim.x;
            dim.x = dim.y;
            dim.y = temp;
        }

        // todo: rotate
        return dim;
    }
}