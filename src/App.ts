import * as BABYLON from '@babylonjs/core'
import { HtmlRectangularPrism } from './shapes/HtmlRectangularPrism';
import { TileGrid } from './ground/TileGrid';

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

    // Create tile grid instead of ground
    const tileGrid = new TileGrid(scene);
    
    // Example: Create a simple pattern of tiles
    // You can configure this pattern or add tiles individually
    const tilePattern = [
        [0.1, 0.1, 0.1, 0.1, 0.1],
        [0.1, 0.1, 0.1, 0.1, 0.1],
        [0.1, 0.1, 0.1, 0.1, 0.1],
        [0.1, 0.1, 0.1, null, 0.1],
        [0.1, 0.1, 0.1, 0.1, 0.1]
    ];
    
    // Create tiles from pattern (null values create empty spaces)
    tileGrid.createPattern(tilePattern, -2, -2);
    
    // Build the tile grid
    tileGrid.build();

    const box = createHtmlBox(scene);

    console.log(box);

    camera.lockedTarget = box.mesh;

    window.addEventListener('keydown', async (event) => {
        let movement = BABYLON.Vector3.Zero();
        
        switch (event.key.toLowerCase())
        {
            case 'w':
                movement = await box.moveXPos();
                break;
            case 'a':
                movement = await box.moveZPos();
                break;
            case 's':
                movement = await box.moveXNeg();
                break;
            case 'd':
                movement = await box.moveZNeg();
        }

        console.log(box.mesh.position);
    });

    return scene;
};

function createHtmlBox(scene: BABYLON.Scene): HtmlRectangularPrism {

    // FRONT
    const iframeSite = document.createElement('iframe');
    const siteUrl = 'https://www.babylonjs.com/';
    iframeSite.src = siteUrl;
    iframeSite.width = '480px';
    iframeSite.height = '360px';

    // LEFT
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

    // RIGHT
    const youtubeVideo = document.createElement('iframe');
    const videoId = 'zELYw2qEUjI';
    const videoUrl = [ 'https://www.youtube.com/embed/', videoId, '?rel=0&enablejsapi=1&disablekb=1&controls=0&fs=0&modestbranding=1' ].join( '' );
    youtubeVideo.src = videoUrl;
    youtubeVideo.width = '480px';
    youtubeVideo.height = '360px';

    const width  = 1; // x
    const height = 2; // y
    const depth  = 1; // z
    const edgeThickness = 0.05;
    const startingY = height / 2;
    
    const box = new HtmlRectangularPrism(scene,
        [iframeSite, iframePdf, div, youtubeVideo],
        width,
        height,
        depth,
        edgeThickness,
        new BABYLON.Vector3(0, startingY, 0));

    return box;
}

function getRandomFunction(array: Array<Function>) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }