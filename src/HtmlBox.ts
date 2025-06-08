import * as BABYLON from '@babylonjs/core'
import * as ADDONS from '@babylonjs/addons'

export class HtmlBox {
    mesh: BABYLON.Mesh;
    sides: BABYLON.Mesh[];
    size: number = 2;
    
    constructor(scene: BABYLON.Scene,
        htmlElements:  HTMLElement[]
    ) {
        const htmlMeshRenderer = new ADDONS.HtmlMeshRenderer(scene);

        scene.onDisposeObservable.addOnce(() => {
            console.log("Scene disposed");
            htmlMeshRenderer.dispose();
        });

        this.mesh = BABYLON.MeshBuilder.CreateBox("box", { size: this.size }, scene);
        this.mesh.position.y = this.size;
        this.mesh.isVisible = false;

        const rotationFunctions = [
            HtmlBox.setFront  (this.size / 2),
            HtmlBox.setRight  (this.size / 2),
            HtmlBox.setBack   (this.size / 2),
            HtmlBox.setLeft   (this.size / 2),
            HtmlBox.setTop    (this.size / 2),
            HtmlBox.setBottom (this.size / 2),
        ];

        this.sides = [];
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
                mesh.material = HtmlBox.getEmptyMaterial();
            }

            rotationFunctions[i](mesh);
            mesh.parent = this.mesh;

            this.sides.push(mesh);
        }
        
        console.log(this.sides);
    }

    private static getEmptyMaterial() : BABYLON.Material
    {
        const myMaterial = new BABYLON.StandardMaterial("myMaterial");

        myMaterial.diffuseColor  = new BABYLON.Color3(1, 0, 1);
        myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        myMaterial.ambientColor  = new BABYLON.Color3(0.23, 0.98, 0.53);

        myMaterial.wireframe = true;

        return myMaterial;
    }

    private static setFront(size: number)
    {
        return (htmlMesh: BABYLON.Mesh) => {
            htmlMesh.position.z = -size;
            htmlMesh.rotation.y = 0;
        }
    }

    private static setRight(size: number)
    {
        return (htmlMesh: BABYLON.Mesh) => {
            htmlMesh.position.z = size;
            htmlMesh.rotation.y = Math.PI;
        }
    }

    private static setBack(size: number)
    {
        return (htmlMesh: BABYLON.Mesh) => {
            htmlMesh.position.x = -size;
            htmlMesh.rotation.y = Math.PI/2;
        }
    }

    private static setLeft(size: number)
    {
        return (htmlMesh: BABYLON.Mesh) => {
            htmlMesh.position.x = size;
            htmlMesh.rotation.y = -Math.PI/2;
        }
    }

    private static setTop(size: number)
    {
        return (htmlMesh: BABYLON.Mesh) => {
            htmlMesh.position.y = size;
            htmlMesh.rotation.x = Math.PI/2;
        }
    }

    private static setBottom(size: number)
    {
        return (htmlMesh: BABYLON.Mesh) => {
            htmlMesh.position.y = -size;
            htmlMesh.rotation.x = -Math.PI/2;
        }
    }
}