// our sprites only have one animation per sprite
function EE_Sprite() { }

EE_Sprite.prototype.init = function init(elem) {
	this._elem = elem;
	this._style = elem.style;
	this._active = false;
}

EE_Sprite.prototype.setup = function setup(data) {
	this.playOnce = data.playOnce;
	this.frames = data.frames;
	this.msPerFrame = data.msPerFrame;
	this.frame = 0;
	this.msSinceUpdate = 0;
	this.width = data.width;
	this.height = data.height;
	this.width2 = data.width2;
	this.height2 = data.height2;

	this.x = 0;
	this.y = 0;

	this._style.width = data.width+'px';
	this._style.height = data.height+'px';
	this._style.backgroundImage = "url('"+data.url+"')";
	this._style.backgroundPosition = '0 0';

	this._refresh = true;
	this._active = true;
}

EE_Sprite.prototype.inactivate = function inactivate() {
	this._elem.style.display = 'none';
	this._active = false;
}

EE_Sprite.prototype.moveTo = function moveTo(x, y) {
	if (typeof x == 'number' && x != this.x) {
		this.x = x;
		this._refresh = true;
	}
	if (typeof y == 'number' && y != this.y) {
		this.y = y;
		this._refresh = true;
	}
}

EE_Sprite.prototype.moveBy = function moveBy(x, y) {
	if (typeof x == 'number' && x != 0) {
		this.x += x;
		this._refresh = true;
	}
	if (typeof y == 'number' && y != 0) {
		this.y += y;
		this._refresh = true;
	}
}

EE_Sprite.prototype.collidesWith = function collidesWith(other) {
	return (this.x+this.width) >= other.x && this.x <= (other.x + other.width) && (this.y+this.height) >= other.y && this.y <= (other.y + other.height);
}

// returns false if sprite should be removed
EE_Sprite.prototype.update = function update(delta) {
	if (!this._active) {
		return false;
	}

	// update location, scale & position if necessary
	if (this._refresh) {
		this._style.display = 'block';
		this._style.left = Math.round(this.x)+'px'; // fractional positions can result in slow scaling
		this._style.top = Math.round(this.y)+'px';
		this._refresh = false;
	}

	// only one frame, no need to animate
	if (this.frames == 1) return true;

	this.msSinceUpdate += delta;

	// too early to update
	if (this.msSinceUpdate < this.msPerFrame) return true;

	// figure out which frame to show
	var ms = this.msSinceUpdate;
	while (ms > this.msPerFrame) {
		ms -= this.msPerFrame;
		this.frame++;

		// if we've went past the last frame, figure out what to do
		if (this.frame == this.frames) { 
			if (this.playOnce) return false;
			this.frame = 0;
		}
	}

	this._style.backgroundPosition = (-this.frame*this.width)+'px 0';

	this.msSinceUpdate = ms;

	return true;
}