// 'Public' methods to generate and interact with color palette
function getColorForCanvasEvent(event) { return getColor(getNormalisedPosition(event.offsetX, event.offsetY)); }
function attachOnClick(func) { document.getElementById(canvasId).onclick = func; }
function addColorPalette(divID) {
	let paletteDiv = document.getElementById(divID);
	let canvas = document.createElement("canvas");
	canvas.id = canvasId;
	canvas.height = 255;
	canvas.width = 255;
	canvas.style.width  = "100%";
	canvas.style.height = "100%";
	canvas.style.padding = "0px";
	canvas.style.border = "1px solid"
	paletteDiv.append(canvas);
	paintCanvas();
}

// 'Private' methods
const canvasId = "paletteCanvas";
const hexHelper = [0,1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F"];

function toHex(i){ return hexHelper[Math.floor(i/16)] + "" + hexHelper[i % 16]; }
function atLeastZero(i) { return i < 0 ? 0 : i; }

function CanvasPosition(x,y){
	this.x = x;
	this.y = y;
	
	this.toString = function(){ return "{ X: " + x + ", Y: " + y + "}"};
}

function Color(r,g,b) {
	this.r = r;
	this.g = g;
	this.b = b;

	this.toString = function() { return "rgb(" + [r,g,b].join(",") + ")"; };
	this.toHex = function(){ return "#" + toHex(r) + toHex(g) + toHex(b); };
}

function paintCanvas(){
	paletteCanvas = document.getElementById(canvasId);
	paletteContext = paletteCanvas.getContext("2d");
	
	let pixelData = paletteContext.createImageData(1, 1);
	let position = null;
	let color = null;
	
	for (var x = 0; x <= paletteCanvas.width; x++) {
		for (var y = 0; y <= paletteCanvas.height; y++) {
			position = getNormalisedCanvasPosition(x,y);
			color = getColor(position);
			pixelData.data[0] = color.r;
			pixelData.data[1] = color.g;
			pixelData.data[2] = color.b;
			pixelData.data[3] = 255;
			paletteContext.putImageData(pixelData, x, y);
		}
	}
}

function getNormalisedCanvasPosition(x,y){
	let paletteCanvas = document.getElementById(canvasId);
	let canvasHeight = paletteCanvas.height;
	let canvasWidth = paletteCanvas.width;
	
	let normalisedX = Math.round(x * (255.0 / canvasWidth));
	let normalisedY = Math.round(y * (255.0 / canvasHeight));
	
	return(new CanvasPosition(normalisedX, normalisedY));
}

function getNormalisedPosition(x,y){
	let paletteCanvas = document.getElementById(canvasId);
	let canvasHeight = paletteCanvas.clientHeight;
	let canvasWidth = paletteCanvas.clientWidth;
	
	let normalisedX = Math.round(x * (255.0 / canvasWidth));
	let normalisedY = Math.round(y * (255.0 / canvasHeight));
	
	return(new CanvasPosition(normalisedX, normalisedY));
}

function getColor(position) {
	let r = g = b = 0;
	let x = position.x;
	let y = position.y;
	
	let x_diff = Math.round(x % 42) * 6;
	switch (Math.floor(x / 42)){
		case 0:
			r = 252;
			g = x_diff;
			break;
		case 1:
			r = 252 - x_diff;
			g = 252;
			break;
		case 2:
			g = 252;
			b = x_diff;
			break;
		case 3:
			g = 252 - x_diff;
			b = 252;
			break;
		case 4:
			b = 252;
			r = x_diff;
			break;
		case 5:
			b = 252 - x_diff;
			r = 252;
			break;	
		default:
			r = 252;
	}

	r = Math.min(r+y, 255);
	g = Math.min(g+y, 255);
	b = Math.min(b+y, 255);

	return new Color(r,g,b);
}
