import { App } from './App';

console.log(`main.ts starting ${App.name}`);
window.addEventListener('DOMContentLoaded', async () => {
    let canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    let app = new App(canvas);
    await app.run();
});