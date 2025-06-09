import * as BABYLON from '@babylonjs/core'
import { HtmlBox } from './shapes/HtmlBox';
import { HtmlRectangularPrism } from './shapes/HtmlRectangularPrism';
import { HtmlFace } from './shapes/HtmlFace';
import { PlaneFace } from './shapes/PlaneFace';

export class App {
    canvas: HTMLCanvasElement;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;
    isDebugMode: boolean = true;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = this.createEngine();
        this.scene = createScene(this.engine);

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        // Add key listener for Q to toggle debug mode
        window.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === 'q') {
                this.toggleDebug(!this.isDebugMode);
            }
        });
    }

    public run() {
        this.toggleDebug(this.isDebugMode);
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    private toggleDebug(debugOn: boolean) {
        this.isDebugMode = debugOn;
        if (debugOn) {
            // this.scene.debugLayer.show({ overlay: true });
            this.scene.activeCamera?.attachControl(true);
        } else {
            // this.scene.debugLayer.hide();
            this.scene.activeCamera?.detachControl();
        }
    }

    private createEngine() {
        return new BABYLON.Engine(this.canvas, true);
      }
}

function createScene(engine: BABYLON.Engine): BABYLON.Scene {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogDensity = 0.02;

    var camera = new BABYLON.ArcRotateCamera("camera",
        1, // longitudinal axis
        1, // latitudinal axis
        4, // radius
        new BABYLON.Vector3(0, 1, 0), // target
        scene
    );
    camera.wheelDeltaPercentage = .01;
    camera.checkCollisions = true;
    camera.lowerRadiusLimit = 2.75;
    camera.upperRadiusLimit = 10;

    var light = new BABYLON.HemisphericLight("light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    light.intensity = 0.7;

    // var box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
    // box.position.y = 2;

    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 60, height: 60 }, scene);
    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = BABYLON.Color3.Teal();
    ground.material = groundMaterial;
    groundMaterial.bumpTexture = new BABYLON.Texture("./normal.jpg", scene);

    // var redMaterial = new BABYLON.StandardMaterial("redMaterial", scene);
    // redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); 
    // box.material = redMaterial;

    const box = createHtmlBox(scene);

    console.log(box);

    // box.moveXPos();
    // box.moveZPos();

    // moveMany(box);

    window.addEventListener('keydown', async (event) => {
        if (event.key.toLowerCase() === 'w')
            await box.moveXNeg();
    });
    window.addEventListener('keydown', async (event) => {
        if (event.key.toLowerCase() === 'a')
            await box.moveZNeg();
    });
    window.addEventListener('keydown', async (event) => {
        if (event.key.toLowerCase() === 's')
            await box.moveXPos();
    });
    window.addEventListener('keydown', async (event) => {
        if (event.key.toLowerCase() === 'd')
            await box.moveZPos();
    });

    return scene;
};

function moveMany(box: HtmlBox, movesRemaining: number = 10)
{
    let movements = [box.moveXPos, box.moveXNeg, box.moveZPos, box.moveZNeg];
    
    setTimeout(() => {
        const movementFunction = getRandomFunction(movements);

        movementFunction.call(box);
        console.log(box);
        if (movesRemaining > 1)
            moveMany(box, movesRemaining - 1);
    }, 2000)
}

function createHtmlBox(scene: BABYLON.Scene): HtmlRectangularPrism {

    // FRONT
    const iframeSite = document.createElement('iframe');
    const siteUrl = 'https://www.babylonjs.com/';
    iframeSite.src = siteUrl;
    iframeSite.width = '480px';
    iframeSite.height = '360px';

    // RIGHT
    const iframePdf = document.createElement('iframe');
    const pdfUrl = 'https://cdn.glitch.com/3da1885b-3463-4252-8ded-723332b5de34%2FNew_Horizons.pdf#zoom=200?v=1599831745689'
    iframePdf.src = pdfUrl;
    iframePdf.width = '480px';
    iframePdf.height = '360px';

    // BACK
    const div = document.createElement('div');
    div.innerHTML = `
        <form style="padding: 10px; transform: scale(4); transform-origin: 0 0;">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required><br><br>
            
            <label for="country">Country:</label>
            <select id="country" name="country">
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                <option value="Australia">Australia</option>
            </select><br><br>
            
            <label for="hobbies">Hobbies:</label><br>
            <input type="checkbox" id="hobby1" name="hobbies" value="Reading">
            <label for="hobby1">Reading</label><br>
            <input type="checkbox" id="hobby2" name="hobbies" value="Gaming">
            <label for="hobby2">Gaming</label><br>
            <input type="checkbox" id="hobby3" name="hobbies" value="Sports">
            <label for="hobby3">Sports</label><br><br>
        </form>
    `;
    div.style.backgroundColor = 'white';
    div.style.width = '480px';
    div.style.height = '360px';

    // LEFT
    const iframeVideo = document.createElement('iframe');
    const videoId = 'zELYw2qEUjI';
    const videoUrl = [ 'https://www.youtube.com/embed/', videoId, '?rel=0&enablejsapi=1&disablekb=1&controls=0&fs=0&modestbranding=1' ].join( '' );
    iframeVideo.src = videoUrl;
    iframeVideo.width = '480px';
    iframeVideo.height = '360px';

    // const box = new HtmlRectangularPrism(scene, [iframeSite, iframePdf, div, iframeVideo]);
    const box = new HtmlRectangularPrism(scene, []);

    // const face = new HtmlFace(scene,
    //     iframeSite,
    //     2,
    //     2,
    //     0.1,
    //     new BABYLON.Vector3(1, 2, 3)
    // );

    const face = new PlaneFace(scene,
        2,
        2,
        0.1,
        new BABYLON.Vector3(1, 2, 3)
    );

    return box;
}

function getRandomFunction(array: Array<Function>) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }