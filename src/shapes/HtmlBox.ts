import * as BABYLON from '@babylonjs/core'
import * as ADDONS from '@babylonjs/addons'
import { Utilities, Axis } from '../utilities';

export class HtmlBox {
    mesh:  BABYLON.Mesh;
    faces: BABYLON.Mesh[] = [];
    size:  number = 2;
    location: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    canMove: boolean = true;
    
    constructor(scene: BABYLON.Scene,
        htmlElements: HTMLElement[]
    ) {
        const htmlMeshRenderer = new ADDONS.HtmlMeshRenderer(scene);

        scene.onDisposeObservable.addOnce(() => {
            console.log("Scene disposed");
            htmlMeshRenderer.dispose();
        });

        this.mesh = BABYLON.MeshBuilder.CreateBox("box", { size: this.size }, scene);
        this.mesh.position.y = this.size / 2;
        this.mesh.isVisible = false;

        this.setFaces(scene, htmlElements);

        this.addCornerX('c01', new BABYLON.Vector3( 0,  1,  1));
        this.addCornerX('c02', new BABYLON.Vector3( 0,  1, -1));
        this.addCornerX('c03', new BABYLON.Vector3( 0, -1,  1));
        this.addCornerX('c04', new BABYLON.Vector3( 0, -1, -1));

        this.addCornerY('c05', new BABYLON.Vector3( 1,  0,  1));
        this.addCornerY('c06', new BABYLON.Vector3( 1,  0, -1));
        this.addCornerY('c07', new BABYLON.Vector3(-1,  0,  1));
        this.addCornerY('c08', new BABYLON.Vector3(-1,  0, -1));

        this.addCornerZ('c09', new BABYLON.Vector3( 1,  1,  0));
        this.addCornerZ('c10', new BABYLON.Vector3( 1, -1,  0));
        this.addCornerZ('c11', new BABYLON.Vector3(-1,  1,  0));
        this.addCornerZ('c12', new BABYLON.Vector3(-1, -1,  0));
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

    private setFaces(scene: BABYLON.Scene,
        htmlElements: HTMLElement[])
    {
        const setFaceFunctions = [
            setFront  (this.size / 2),
            setRight  (this.size / 2),
            setBack   (this.size / 2),
            setLeft   (this.size / 2),
            setTop    (this.size / 2),
            setBottom (this.size / 2),
        ];

        for (let i = 0; i < 6; i++)
        {
            let mesh: BABYLON.Mesh;

            if (i < htmlElements.length)
            {
                const htmlMesh = new ADDONS.HtmlMesh(scene, `${i}`, {
                    captureOnPointerEnter: true,
                    isCanvasOverlay: false
                });
                htmlMesh.setContent(htmlElements[i], this.size, this.size);
                mesh = htmlMesh;
            }
            else
            {
                mesh = BABYLON.MeshBuilder.CreatePlane(`${i}`, {
                    size: 1 * this.size
                });
                mesh.material = getEmptyMaterial();
            }

            setFaceFunctions[i](mesh);
            mesh.parent = this.mesh;

            this.faces.push(mesh);
        }
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
