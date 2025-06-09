import * as BABYLON from '@babylonjs/core'

export interface IFace {
    mesh:  BABYLON.Mesh;
    face:  BABYLON.Mesh;
    edges: BABYLON.Mesh[];
}