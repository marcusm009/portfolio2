import * as BABYLON from '@babylonjs/core'
import * as ADDONS from '@babylonjs/addons'

export class HtmlBox {
    mesh:  BABYLON.Mesh;
    faces: BABYLON.Mesh[] = [];
    size:  number = 2;
    sides: BABYLON.Vector3[] = [
        new BABYLON.Vector3(1, 0, 1)
    ];
    location: BABYLON.Vector3 = new BABYLON.Vector3(1, 0, 1);
    
    constructor(scene: BABYLON.Scene,
        htmlElements:  HTMLElement[]
    ) {
        const htmlMeshRenderer = new ADDONS.HtmlMeshRenderer(scene);

        scene.onDisposeObservable.addOnce(() => {
            console.log("Scene disposed");
            htmlMeshRenderer.dispose();
        });

        this.mesh = BABYLON.MeshBuilder.CreateBox("box", { size: this.size }, scene);
        this.mesh.position.y = this.size / 2;
        this.mesh.isVisible = false;

        const rotationFunctions = [
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

            rotationFunctions[i](mesh);
            mesh.parent = this.mesh;

            this.faces.push(mesh);
        }
        
        console.log(this.sides);
    }

    public rotateXPos()
    {
        this.mesh.rotateAround(this.location,
            new BABYLON.Vector3(1, 0, 0),
            Math.PI / 2);

        this.location.x++;
        this.location.z += 2;
    }

    // public rotateXNeg()
    // {
    //     this.mesh.rotateAround(this.location,
    //         new BABYLON.Vector3(1, 0, 0),
    //         -Math.PI / 2);

    //     this.location.x--;
    //     this.location.z -= 2;
    // }
}

function getEmptyMaterial() : BABYLON.Material
{
    const myMaterial = new BABYLON.StandardMaterial("myMaterial");

    myMaterial.diffuseColor  = new BABYLON.Color3(1, 0, 1);
    myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    myMaterial.ambientColor  = new BABYLON.Color3(0.23, 0.98, 0.53);

    myMaterial.wireframe = true;

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