import * as BABYLON from '@babylonjs/core';

export class Edges {
    front:  BABYLON.Mesh;
    right:  BABYLON.Mesh;
    back:  BABYLON.Mesh;
    left:  BABYLON.Mesh;

    constructor(front: BABYLON.Mesh,
        right: BABYLON.Mesh,
        back: BABYLON.Mesh,
        left: BABYLON.Mesh
    )
    {
        this.front = front;
        this.right = right;
        this.back = back;
        this.left = left;
    }
}