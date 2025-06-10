import * as BABYLON from '@babylonjs/core'
import * as ADDONS from '@babylonjs/addons'
import { Utilities, Axis } from '../utilities';
import type { IFace } from './faces/IFace';
import { HtmlFace } from './faces/HtmlFace';
import { PlaneFace } from './faces/PlaneFace';

export class HtmlRectangularPrism {
    mesh:  BABYLON.Mesh;
    faces: IFace[] = [];
    size:  number = 2;
    location: BABYLON.Vector3 = BABYLON.Vector3.Zero();
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

        // for (let i = 0; i < 6; i++)
        // {
        //     if (i < htmlElements.length)
        //     {

        //     }
        // }

        const frontFace = new HtmlFace(scene,
            htmlElements[0],
            width,
            height,
            edgeThickness,
            new BABYLON.Vector3(0, 0, -depth / 2),
            BABYLON.Vector3.Zero(),
            this.mesh,
            `${id}-front`
        );

        const leftFace = new HtmlFace(scene,
            htmlElements[1],
            depth,
            height,
            edgeThickness,
            new BABYLON.Vector3(-width / 2, 0, 0),
            new BABYLON.Vector3(0, Math.PI / 2, 0),
            this.mesh,
            `${id}-left`
        );

        const backFace = new HtmlFace(scene,
            htmlElements[2],
            width,
            height,
            edgeThickness,
            new BABYLON.Vector3(0, 0, depth / 2),
            new BABYLON.Vector3(0, Math.PI, 0),
            this.mesh,
            `${id}-back`
        );

        const rightFace = new HtmlFace(scene,
            htmlElements[3],
            depth,
            height,
            edgeThickness,
            new BABYLON.Vector3(width / 2, 0, 0),
            new BABYLON.Vector3(0, -Math.PI / 2, 0),
            this.mesh,
            `${id}-right`
        );

        const topFace = new PlaneFace(scene,
            width,
            depth,
            edgeThickness,
            new BABYLON.Vector3(0, height / 2, 0),
            new BABYLON.Vector3(Math.PI / 2, 0, 0),
            this.mesh,
            `${id}-top`
        );

        const bottomFace = new PlaneFace(scene,
            width,
            depth,
            edgeThickness,
            new BABYLON.Vector3(0, -height / 2, 0),
            new BABYLON.Vector3(-Math.PI / 2, 0, 0),
            this.mesh,
            `${id}-bottom`
        );
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

    public async move(axis: Axis,
        isPositiveDirection: boolean,
        steps: number = 20,
        stepDurationInMs: number = 10)
    {
        // todo: replace with move buffer
        if (!this.canMove)
            return;
        this.canMove = false;

        const sign = Utilities.toSign(isPositiveDirection);
        const transformedSign = sign * Utilities.getRotationSign(axis);
        
        const rotationPoint = new BABYLON.Vector3(
            this.location.x + (sign * (this.size / 2)),
            this.location.y,
            this.location.z + (transformedSign * (this.size / 2)));

        for(let i = 0; i < steps; i++)
        {
            await Utilities.sleep(stepDurationInMs);
            this.mesh.rotateAround(rotationPoint,
                Utilities.getRotationVector(axis),
                (transformedSign * Math.PI) / (2 * steps));
        }

        const movement = Utilities.getIdentityVector(axis).scale(sign * this.size)
        this.location.addInPlace(movement);

        this.canMove = true;
    }

    private addCornerX(name: string,
        position: BABYLON.Vector3,
        thinness: number = 128)
    {
        const corner = BABYLON.MeshBuilder.CreateBox(name,
            {
                width:  this.size,
                height: this.size / thinness,
                depth:  this.size / thinness,
            });
        corner.position = position.scaleInPlace(this.size / 2);
        corner.parent = this.mesh;
    }

    private addCornerY(name: string,
        position: BABYLON.Vector3,
        thinness: number = 128)
    {
        const corner = BABYLON.MeshBuilder.CreateBox(name,
            {
                width:  this.size / thinness,
                height: this.size,
                depth:  this.size / thinness,
            });
        corner.position = position.scaleInPlace(this.size / 2);
        corner.parent = this.mesh;
    }

    private addCornerZ(name: string,
        position: BABYLON.Vector3,
        thinness: number = 128)
    {
        const corner = BABYLON.MeshBuilder.CreateBox(name,
            {
                width:  this.size / thinness,
                height: this.size / thinness,
                depth:  this.size,
            });
        corner.position = position.scaleInPlace(this.size / 2);
        corner.parent = this.mesh;
    }
}

function getEmptyMaterial() : BABYLON.Material
{
    const myMaterial = new BABYLON.StandardMaterial("myMaterial");

    myMaterial.diffuseColor  = new BABYLON.Color3(1, 0, 1);
    myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    myMaterial.ambientColor  = new BABYLON.Color3(0.23, 0.98, 0.53);

    // myMaterial.wireframe = true;

    return myMaterial;
}

function setFront(size: number)
{
    return (htmlMesh: BABYLON.Mesh) => {
        htmlMesh.position.z = -size;
        htmlMesh.rotation.y = 0;
    }
}

function setRight(size: number)
{
    return (htmlMesh: BABYLON.Mesh) => {
        htmlMesh.position.z = size;
        htmlMesh.rotation.y = Math.PI;
    }
}

function setBack(size: number)
{
    return (htmlMesh: BABYLON.Mesh) => {
        htmlMesh.position.x = -size;
        htmlMesh.rotation.y = Math.PI/2;
    }
}

function setLeft(size: number)
{
    return (htmlMesh: BABYLON.Mesh) => {
        htmlMesh.position.x = size;
        htmlMesh.rotation.y = -Math.PI/2;
    }
}

function setTop(size: number)
{
    return (htmlMesh: BABYLON.Mesh) => {
        htmlMesh.position.y = size;
        htmlMesh.rotation.x = Math.PI/2;
    }
}

function setBottom(size: number)
{
    return (htmlMesh: BABYLON.Mesh) => {
        htmlMesh.position.y = -size;
        htmlMesh.rotation.x = -Math.PI/2;
    }
}
