function EE_SpriteManager(game) {
	this._game = game;
	this.spritesTotal = 0;
	this.spritesLoaded = 0;
	this.done = false;
	this._sprites = {};
}

EE_SpriteManager.prototype._imageLoaded = function() {
	if (++this.spritesLoaded == this.spritesTotal) this.done = true;
};

EE_SpriteManager.prototype.loadSprites = function loadSprites(sprites, progressListener) {
	this.spritesTotal = 0;
	this.spritesLoaded = 0;
	this.done = false;

	var sm = this;

	// update progress and call listener if necessary
	if (typeof progressListener == 'function') {
		var ol = function() {
			sm._imageLoaded();
			progressListener(sm);
		};
	} else {
		var ol = function() {
			sm._imageLoaded();
		};
	}

	// process & count the sprites
	for (var n in sprites) {
		if (typeof sprites[n]['frames'] != 'number') sprites[n]['frames'] = 1;
		if (typeof sprites[n]['fps'] != 'number') sprites[n]['fps'] = 30;
		if (typeof sprites[n]['playOnce'] != 'boolean') sprites[n]['playOnce'] = false;

		sprites[n]['width2'] = Math.round(sprites[n]['width'] / 2);
		sprites[n]['height2'] = Math.round(sprites[n]['height'] / 2);

		sprites[n]['msPerFrame'] = Math.round((1/sprites[n]['fps'])*1000);

		this.spritesTotal++;
	}

	this._sprites = sprites;

	for (var n in sprites) {
		var img = new Image();
		img.onload = ol;
		img.src = sprites[n]['url'];
	}
};

EE_SpriteManager.prototype.getSprite = function getSprite(n) {
	return this._sprites[n];
}

// since you made it all this way, I'd love to hear your thoughts on how you would make
// this code and / or game better. get in touch at jiri@rocketpack.fi!