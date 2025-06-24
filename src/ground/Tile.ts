import * as BABYLON from '@babylonjs/core'

export interface Tile {
    x: number;
    z: number;
    height: number;
    material?: BABYLON.Material;
}