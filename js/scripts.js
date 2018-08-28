debug = true;

var game = new Game()
$(function () {
	game.initialize()
	setInputs()
});
function Game() {
	this.started = false;
	this.cactii = [];
	this.counter = 0;
	this.restartedAt = -1;
	this.dino;
	this.pixelSize = (1 / window.devicePixelRatio);
	if (this.pixelSize < 1) {
		this.pixelSize = parseFloat(this.pixelSize.toPrecision(2));
	}
	this.gravityForce = this.pixelSize*1.5;
	this.masterSpeed = this.pixelSize*8;
	this.initialize = function() {
		document.body.style.setProperty('--pixel-size',this.pixelSize);
		var dino = new Dino();
		this.dino = dino;
		$('#ground').animate({
			'opacity':'1'
		},400)
		dino.div.animate({
			'top': dino.groundY + 'px',
			'opacity': '1'
		},800,function(){
			dino.canJump = true;
		}).animate({
			'opacity': '1'
		},400);
	}
	this.startScrolling = function() {
		this.started = true;
		this.dino.startWalking();
		requestAnimationFrame(gameLoop);
	}
	this.restart = function() {
		this.started = false;
		this.counter = 0;
		this.cactii.length = 0;
		$('.cactus').remove();
		this.dino.revive();
		this.restartedAt = this.counter;
	}
}
function Dino() {
	this.div = $('#dino');
	this.xSpot = this.div.position().left + (this.div.width()*0.75);
	this.canJump = false;
	this.foot = "left";
	this.diedAt = -1;
	this.width = this.div.width();
	this.height = this.div.height();
	this.jumpForce = game.pixelSize*24
	this.y = function() {
		return this.div.position().top;
	}
	this.velocity = {x:0, y:0};
	this.terminalVelocity = game.pixelSize*24;
	this.groundY = this.div.position().top;
	this.applyVelocity = function() {
		if (this.y() < this.groundY || this.velocity.y) {
			var currentY = this.y()
			if (this.y() !== this.groundY && (this.velocity.y + game.gravityForce) < this.terminalVelocity) {
				this.velocity.y += game.gravityForce;
			}
			if ((this.y()+this.velocity.y) <= this.groundY) {
				this.div.css({
					'top' : currentY+this.velocity.y+'px'
				})
			} else {
				this.div.css({
					'top' : this.groundY+'px'
				})
				this.velocity.y = 0;
				if (!this.div.hasClass('dead')) {
					this.canJump = true;
				}
			}
		}
	}
	this.leap = function() {
		if (this.canJump && $('#restart-button').css("opacity")==='0') {
			this.canJump = false;
			this.velocity.y = -this.jumpForce;
		}
	}
	this.startWalking = function() {
		var self = this;
		this.walkCycle = setInterval(function(){
			if (self.foot === "left") {
				self.div.addClass('walk-0');
				self.div.removeClass('walk-1');
				self.foot = "right";
			} else {
				self.div.addClass('walk-1');
				self.div.removeClass('walk-0');
				self.foot = "left";
			}
		},150);
	}
	this.stopWalking = function() {
		clearInterval(this.walkCycle);
	}
	this.die = function() {
		this.diedAt = game.counter;
		this.velocity.y = this.terminalVelocity;
		clearInterval(this.walkCycle);
		this.div.addClass('dead');
	}
	this.revive = function() {
		this.foot = "left";
		this.diedAt = -1;
		this.div.removeClass('walk-0');
		this.div.removeClass('walk-1');
		this.div.removeClass('dead');
		this.div.addClass('standing');
		var self = this;
		setTimeout(function(){
			self.canJump = true;
		},500)
	}
	this.div.css({
		'top' : -this.height
	})
}
function Cactus(speed) {
	this.html = `<div class="cactus" id="cactus-`+game.cactii.length+`"></div>`;
	$('#stage').append(this.html);
	this.div = $("#cactus-"+game.cactii.length);
	this.speed = speed * game.pixelSize;
	this.spent = false;
	this.width = this.div.width();
	this.height = this.div.height();
	this.x = function(){
		return this.div.position().left;
	}
	this.y = function(){
		return this.div.position().top;
	}
	this.moveLeft = function() {
		var currentX = this.div.position().left;
		var moveSpeed = this.speed + game.masterSpeed
		var newX = currentX-moveSpeed;
		this.div.css({
			'left': newX+'px'
		})
		if (newX <= -this.width) { // if offscreen left
			this.div.remove();
			this.spent = true;
		}
	}
	game.cactii.push(this);
}
Cactus.prototype.touchingDino = function () {
	var dino = game.dino;
	var touching = false;
	var toRight = this.x() > (dino.xSpot-(dino.width/2));
	var dinoX = dino.xSpot;
	var dinoBottom = dino.y() + (dino.height/1.75);
	if (toRight && this.x()-this.speed < dinoX && this.y()<dinoBottom) {
		touching = true;
	}
	return touching;
}
Number.prototype.mod = function(num) {
	return this % num === 0;
}
function randomInt(min,max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}