import { Application, Graphics } from 'pixi.js';
import scss from './style.scss';

const app = new Application({
	autoResize: true,
  resolution: devicePixelRatio 
});

document.body.appendChild(app.view);

// Let's draw a red square at the bottom right
const square = new Graphics()
	.beginFill(0xff0000)
  .drawRect(-100, -100, 100, 100); // Offset -100, -100 // Size 100, 100
  
// Add it to the stage
app.stage.addChild(square);

// Listen for window resize events


// Function to call when the app is resized
function resize() {
	// Resize the renderer
	app.renderer.resize(window.innerWidth, window.innerHeight);
  
  // Move the square (remember: the square is offset by -100, -100, so we can just put it at the bottom right)
  square.position.set(app.screen.width, app.screen.height);
}
window.addEventListener('resize', resize);
resize();