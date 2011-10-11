function EE_SpriteLayer(game) {
	this._game = game;
	this._container = null;
	this._spritePool = [];
	this._activeSpriteCount = 0;
	this._spritePoolLength = 0;
	this._incrementPoolBy = 10;
}

EE_SpriteLayer.prototype.init = function init(element) {
	this._container = element;
	this._increasePoolSize();
}

EE_SpriteLayer.prototype._increasePoolSize = function _increasePoolSize() {
	var newLen = this._spritePoolLength + this._incrementPoolBy;

	var frag = document.createDocumentFragment();

	for (var i = this._activeSpriteCount; i < newLen; i++) {
		this._spritePool[i] = new EE_Sprite();

		var elem = document.createElement('div');
		elem.style.position = 'absolute';
		elem.style.overflow = 'hidden';
		elem.style.width = 0;
		elem.style.height = 0;

		frag.appendChild(elem);
		this._spritePool[i].init(elem);
	}

	this._container.appendChild(frag);

	this._spritePoolLength = newLen;

	return newLen;
}

EE_SpriteLayer.prototype.spriteFromData = function spriteFromData(n) {
	return this.createSprite(this._game.spriteManager.getSprite(n));
}

EE_SpriteLayer.prototype.createSprite = function createSprite(data) {
	if (this._activeSpriteCount >= this._spritePoolLength) this._increasePoolSize();

	var spr = this._spritePool[this._activeSpriteCount++];

	// this shouldn't happen. if you find out why it's happening, how about emailing jiri@rocketpack.fi?
	if (!spr) {
		console.log('error getting sprite at index '+this._activeSpriteCount+'. pool size '+this._spritePoolLength);
		return {};
	}

	spr.setup(data);
	return spr;
}


EE_SpriteLayer.prototype.removeSpriteAtIndex = function removeSpriteAtIndex(ind) {
	var rep = this._spritePool[this._activeSpriteCount];
	var spr = this._spritePool[ind];

	this._activeSpriteCount--;

	this._spritePool[ind] = this._spritePool[this._activeSpriteCount]
	this._spritePool[this._activeSpriteCount] = rep;
	this._spritePool[this._activeSpriteCount+1] = spr;

	// tell sprite to hide itself
	spr.inactivate();
}

EE_SpriteLayer.prototype.update = function update(delta) {
	for (var i = 0; i < this._activeSpriteCount; i++) {
		if (!this._spritePool[i]) continue; // this shouldn't happen, but...
		if (!this._spritePool[i].update(delta)) {
			this.removeSpriteAtIndex(i);
			i--;
		}
	}
}