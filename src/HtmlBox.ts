import * as BABYLON from '@babylonjs/core'
import * as ADDONS from '@babylonjs/addons'

export class HtmlBox {
    boxMesh: BABYLON.Mesh;
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

        this.boxMesh = BABYLON.MeshBuilder.CreateBox("box", { size: this.size }, scene);
        this.boxMesh.position.y = this.size;
        this.boxMesh.isVisible = false;

        const rotationFunctions = [
            HtmlBox.setFront  (this.size / 2),
            HtmlBox.setRight  (this.size / 2),
            HtmlBox.setBack   (this.size / 2),
            HtmlBox.setLeft   (this.size / 2),
            HtmlBox.setTop    (this.size / 2),
            HtmlBox.setBottom (this.size / 2),
        ];
        
        const emptyDiv = document.createElement('div');
        emptyDiv.style.backgroundColor = 'black';

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
            }

            rotationFunctions[i](mesh);
            mesh.parent = this.boxMesh;

            this.sides.push(mesh);
        }
        
        console.log(this.sides);
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