import * as BABYLON from '@babylonjs/core'
import type { Tile } from './tile'

export class TileGrid {
    private tiles: Map<string, Tile> = new Map();
    private scene: BABYLON.Scene;
    private tileSize: number = 1;
    private tileHeight: number = 0.1;

    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
    }

    private getTileKey(x: number, z: number): string {
        return `${x},${z}`;
    }

    public setTile(x: number, z: number, height: number = 0.1, material?: BABYLON.Material): void {
        const key = this.getTileKey(x, z);
        this.tiles.set(key, { x, z, height, material });
    }

    public removeTile(x: number, z: number): void {
        const key = this.getTileKey(x, z);
        this.tiles.delete(key);
    }

    public hasTile(x: number, z: number): boolean {
        const key = this.getTileKey(x, z);
        return this.tiles.has(key);
    }

    public getTile(x: number, z: number): Tile | undefined {
        const key = this.getTileKey(x, z);
        return this.tiles.get(key);
    }

    public createPattern(pattern: (number | null)[][], startX: number = 0, startZ: number = 0): void {
        pattern.forEach((row, z) => {
            row.forEach((height, x) => {
                if (height !== null) {
                    this.setTile(startX + x, startZ + z, height);
                }
            });
        });
    }

    public build(): void {
        // Clear existing tiles
        this.tiles.forEach((tile, key) => {
            const mesh = this.scene.getMeshByName(`tile_${key}`);
            if (mesh) {
                mesh.dispose();
            }
        });

        // Create new tiles
        this.tiles.forEach((tile, key) => {
            const mesh = BABYLON.MeshBuilder.CreateBox(`tile_${key}`, {
                width: this.tileSize,
                height: tile.height,
                depth: this.tileSize
            }, this.scene);

            mesh.position = new BABYLON.Vector3(
                tile.x * this.tileSize,
                -tile.height / 2,
                tile.z * this.tileSize
            );

            if (tile.material) {
                mesh.material = tile.material;
            } else {
                // Default material
                const material = new BABYLON.StandardMaterial(`tileMaterial_${key}`, this.scene);
                material.diffuseColor = BABYLON.Color3.Teal();
                material.bumpTexture = new BABYLON.Texture("./normal.jpg", this.scene);
                mesh.material = material;
            }
        });
    }
}