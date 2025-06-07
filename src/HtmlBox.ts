import * as BABYLON from '@babylonjs/core'
import * as ADDONS from '@babylonjs/addons'

export class HtmlBox {
    boxMesh: BABYLON.Mesh;
    htmlMeshes: ADDONS.HtmlMesh[];
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

        const rotationFunctions = [
            HtmlBox.setFront(this.size),
            HtmlBox.setRight(this.size),
            HtmlBox.setBack(this.size),
            HtmlBox.setLeft(this.size),
        ];
        
        this.htmlMeshes = [];
        htmlElements.forEach((element, idx) => {
            
            const htmlMesh = new ADDONS.HtmlMesh(scene, `${idx}`);
            htmlMesh.setContent(element, 4, 3);
            rotationFunctions[idx](htmlMesh);
            htmlMesh.parent = this.boxMesh;

            this.htmlMeshes.push(htmlMesh);
        });
    }

    private static setFront(size: number)
    {
        return (htmlMesh: ADDONS.HtmlMesh) => {
            htmlMesh.position.z = -size;
            htmlMesh.rotation.y = 0;
        }
    }

    private static setRight(size: number)
    {
        return (htmlMesh: ADDONS.HtmlMesh) => {
            htmlMesh.position.z = size;
            htmlMesh.rotation.y = Math.PI;
        }
    }

    private static setBack(size: number)
    {
        return (htmlMesh: ADDONS.HtmlMesh) => {
            htmlMesh.position.x = -size;
            htmlMesh.rotation.y = Math.PI/2;
        }
    }

    private static setLeft(size: number)
    {
        return (htmlMesh: ADDONS.HtmlMesh) => {
            htmlMesh.position.x = size;
            htmlMesh.rotation.y = -Math.PI/2;
        }
    }
}