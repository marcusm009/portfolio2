import * as BABYLON from '@babylonjs/core'
import * as ADDONS from '@babylonjs/addons'
import type { IFace } from './IFace';

export class HtmlFace implements IFace {
    mesh: BABYLON.Mesh;
    face: ADDONS.HtmlMesh;
    edges: BABYLON.Mesh[] = [];
    
    constructor(scene: BABYLON.Scene,
        htmlElement: HTMLElement,
        width: number,
        height: number,
        depth: number = 0.1, // edgeThickness
        position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
        rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
        parent?: BABYLON.Mesh,
        id: string = crypto.randomUUID().toString()
    ) {
        this.mesh = BABYLON.MeshBuilder.CreateBox(id, {
            width: width,
            height: height,
            depth: depth
        }, scene);
        this.mesh.position = position;
        this.mesh.rotation = rotation;
        this.mesh.isVisible = false;
        
        this.face = new ADDONS.HtmlMesh(scene, id, {
            captureOnPointerEnter: true,
            isCanvasOverlay: false
        })
        this.face.setContent(htmlElement, width - depth, height - depth);
        this.face.parent = this.mesh;

        const topEdge = BABYLON.MeshBuilder.CreateBox(`${id}-top`,
        {
            width:  width,
            height: depth,
            depth:  depth,
        });
        topEdge.parent = this.mesh;
        topEdge.position = new BABYLON.Vector3(0, height/2, 0);
        this.edges.push(topEdge);

        const bottomEdge = BABYLON.MeshBuilder.CreateBox(`${id}-bottom`,
        {
            width:  width,
            height: depth,
            depth:  depth,
        });
        bottomEdge.parent = this.mesh;
        bottomEdge.position = new BABYLON.Vector3(0, -height/2, 0);
        this.edges.push(bottomEdge);

        const leftEdge = BABYLON.MeshBuilder.CreateBox(`${id}-left`,
        {
            width:  depth,
            height: height,
            depth:  depth,
        });
        leftEdge.parent = this.mesh;
        leftEdge.position = new BABYLON.Vector3(width/2, 0, 0);
        this.edges.push(leftEdge);

        const rightEdge = BABYLON.MeshBuilder.CreateBox(`${id}-right`,
        {
            width:  depth,
            height: height,
            depth:  depth,
        });
        rightEdge.parent = this.mesh;
        rightEdge.position = new BABYLON.Vector3(-width/2, 0, 0);
        this.edges.push(rightEdge);

        if (parent != undefined)
            this.mesh.parent = parent;
    }
}