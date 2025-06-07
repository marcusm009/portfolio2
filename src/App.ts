import * as BABYLON from 'babylonjs'

export class App {
    engine?: BABYLON.Engine;
    scene?: BABYLON.Scene;
    private isDebugMode: boolean = false;

    constructor(readonly canvas: HTMLCanvasElement) {
        window.addEventListener('resize', () => {
            this.engine?.resize();
        });

        // Add key listener for Q to toggle debug mode
        window.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === 'q') {
                this.toggleDebug();
            }
        });
    }

    async run() {
        // Initialize engine with WebGPU support
        this.engine = await this.createEngine();
        this.scene = createScene(this.engine, this.canvas);
        
        this.debug(false);
        this.engine?.runRenderLoop(() => {
            this.scene?.render();
        });
    }

    debug(debugOn: boolean = true) {
        this.isDebugMode = debugOn;
        if (debugOn) {
            this.scene?.debugLayer.show({ overlay: true });
            this.scene?.activeCamera?.attachControl(this.canvas, true);
        } else {
            this.scene?.debugLayer.hide();
            this.scene?.activeCamera?.detachControl(this.canvas);
        }
    }

    private async createEngine() {
        const webGPUSupported = await BABYLON.WebGPUEngine.IsSupportedAsync;
        if (false) {
          const engine = new BABYLON.WebGPUEngine(this.canvas);
          await engine.initAsync();
          return engine;
        }
        return new BABYLON.Engine(this.canvas, true);
      }

    private toggleDebug() {
        this.debug(!this.isDebugMode);
    }
}

var createScene = function (engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
    
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(4, 3.5, 1.5), scene);

    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(.5, 2, -.0625));

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // Set WASD keys for movement
    camera.keysUp = [87]; // W
    camera.keysDown = [83]; // S
    camera.keysLeft = [65]; // A
    camera.keysRight = [68]; // D

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'box' shape.
    var box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
    // Move the box upward 1/2 its height
    box.position.y = 2;

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.8, 0.5); // RGB for a greenish color
    ground.material = groundMaterial;
    groundMaterial.bumpTexture = new BABYLON.Texture("./normal.jpg", scene);

    var redMaterial = new BABYLON.StandardMaterial("redMaterial", scene);
    redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // RGB for red
    box.material = redMaterial;

    return scene;
};