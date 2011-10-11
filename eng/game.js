/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 */

if ( !window.requestAnimationFrame ) {

	window.requestAnimationFrame = ( function() {

		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
			window.setTimeout( function() { callback(+new Date); }, 1000 / 60 ); // modified to give timestamp
		};
	} )();
}

// get rid of console warnings on IE8
if (!window.console) console = {log: function() {}};


///////////////////////////////////////////////////////////////////////////////


function EE_Game() {
	this._container = null;
	this._spriteLayers = [];
	this._spriteLayerCount = 0;
	this._paused = true;

	this.spriteManager = null;
}

EE_Game.prototype.init = function init(id) {
	this._container = document.getElementById(id);
	this.spriteManager = new EE_SpriteManager(this);
}

EE_Game.prototype.resume = function resume() {
	if (!this._paused) return;
	this._paused = false;

	console.log('resuming game');

	var tm = this;
	var lastFrame = +new Date;

	function loop(t) {
		if (tm._paused) {
			console.log('stopping loop');
			return false;
		}
		
		requestAnimationFrame(loop);
		tm.update(t-lastFrame);
		lastFrame = t;
	}

	loop(lastFrame);
}

EE_Game.prototype.pause = function pause() {
	this._paused = true;

	console.log('pausing game');
}

EE_Game.prototype.update = function update(delta) {
	if (this._paused) return;
	
	if (typeof this.gameLoop == 'function') {
		this.gameLoop(delta/1000);
	}

	for (var i = 0; i < this._spriteLayerCount; i++) {
		this._spriteLayers[i].update(delta);
	}
}

EE_Game.prototype.createSpriteLayer = function createSpriteLayer() {
	var elem = document.createElement('div');
	elem.style.position = 'absolute';
	elem.style.zIndex = this._spriteLayerCount;

	this._container.appendChild(elem);
		
	var nLayer = this._spriteLayers[this._spriteLayerCount] = new EE_SpriteLayer(this);
	nLayer.init(elem);

	this._spriteLayerCount++;

	return nLayer;
}