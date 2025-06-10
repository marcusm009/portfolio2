import * as BABYLON from '@babylonjs/core'
import * as ADDONS from '@babylonjs/addons'
import { Utilities, Axis } from '../utilities';
import type { IFace } from './faces/IFace';
import { HtmlFace } from './faces/HtmlFace';
import { PlaneFace } from './faces/PlaneFace';

export class HtmlRectangularPrism {
    mesh:  BABYLON.Mesh;
    edgeThickness:  number;
    faces: IFace[] = [];
    canMove: boolean = true;
    
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
            new BABYLON.Vector3(0, 0, -depth / 2),
            BABYLON.Vector3.Zero()
        );

        this.assignFace(scene,
            'left',
            htmlElements.pop(),
            depth,
            height,
            new BABYLON.Vector3(-width / 2, 0, 0),
            new BABYLON.Vector3(0, Math.PI / 2, 0),
        );

        this.assignFace(scene,
            'back',
            htmlElements.pop(),
            width,
            height,
            new BABYLON.Vector3(0, 0, depth / 2),
            new BABYLON.Vector3(0, Math.PI, 0),
        );

        this.assignFace(scene,
            'right',
            htmlElements.pop(),
            depth,
            height,
            new BABYLON.Vector3(width / 2, 0, 0),
            new BABYLON.Vector3(0, -Math.PI / 2, 0),
        );

        this.assignFace(scene,
            'top',
            htmlElements.pop(),
            width,
            depth,
            new BABYLON.Vector3(0, height / 2, 0),
            new BABYLON.Vector3(Math.PI / 2, 0, 0),
        );

        this.assignFace(scene,
            'bottom',
            htmlElements.pop(),
            width,
            depth,
            new BABYLON.Vector3(0, -height / 2, 0),
            new BABYLON.Vector3(-Math.PI / 2, 0, 0),
        );
    }

    public getBottomMesh(): BABYLON.Mesh | undefined
    {
        for (let i = 0; i < this.faces.length; i++)
        {
            if (this.faces[i].isBottom())
                return this.faces[i].mesh;
        }

        return undefined;
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
                width,
                height,
                this.edgeThickness,
                position,
                rotation,
                this.mesh,
                `${this.mesh.id}-${name}`
            )
            : new PlaneFace(scene,
                width,
                height,
                this.edgeThickness,
                position,
                rotation,
                this.mesh,
                `${this.mesh.id}-${name}`
            );

        this.faces.push(face);
    }

    // public async moveXPos()
    // {
    //     this.move(Axis.X, true);
    // }

    // public async moveXNeg()
    // {
    //     this.move(Axis.X, false);
    // }

    // public async moveZPos()
    // {
    //     this.move(Axis.Z, true);
    // }

    // public async moveZNeg()
    // {
    //     this.move(Axis.Z, false);
    // }

    // public async move(axis: Axis,
    //     isPositiveDirection: boolean,
    //     steps: number = 20,
    //     stepDurationInMs: number = 10)
    // {
    //     // todo: replace with move buffer
    //     if (!this.canMove)
    //         return;
    //     this.canMove = false;

    //     const sign = Utilities.toSign(isPositiveDirection);
    //     const transformedSign = sign * Utilities.getRotationSign(axis);
        
    //     const rotationPoint = new BABYLON.Vector3(
    //         this.location.x + (sign * (this.size / 2)),
    //         this.location.y,
    //         this.location.z + (transformedSign * (this.size / 2)));

    //     for(let i = 0; i < steps; i++)
    //     {
    //         await Utilities.sleep(stepDurationInMs);
    //         this.mesh.rotateAround(rotationPoint,
    //             Utilities.getRotationVector(axis),
    //             (transformedSign * Math.PI) / (2 * steps));
    //     }

    //     const movement = Utilities.getIdentityVector(axis).scale(sign * this.size)
    //     this.location.addInPlace(movement);

    //     this.canMove = true;
    // }
}