var gStartedGame = false;
var cactii = [];
var loop;
var gMasterSpeed = 3
var gravityForce = 0
var counter = 0;
var pixelSize = 1;
$(function(){
	pixelSize = (1/window.devicePixelRatio);
	gravityForce = pixelSize*1.5
	document.body.style.setProperty('--pixel-size',pixelSize);
	console.log("pixel = " + pixelSize)
	gMasterSpeed *= pixelSize
	dino = new Dino();
	document.onkeydown = function(event) {
		if (event.keyCode == 32) {
			if (!gStartedGame && dino.diedAt < 0) {
				startGame();
			}
			dino.leap();
		}
		event.preventDefault();
	};
	var touchStart = function(event) {
		if (!gStartedGame) {
			startGame();
		}
		dino.leap();
		event.preventDefault();
	}
	document.body.addEventListener('touchstart',touchStart,true);
	$('body').css({
		'opacity': '1',
	})
});
function startGame() {
	gStartedGame = true;
	loop = gameLoop();
	dino.startWalking();
}
function Dino() {
	this.div = $('#dino');
	this.xSpot = this.div.position().left + (this.div.width()*0.75);
	this.canJump = true;
	this.foot = "left";
	this.diedAt = -1;
	this.width = this.div.width();
	this.height = this.div.height();
	this.jumpForce = pixelSize*24
	this.y = function() {
		return this.div.position().top;
	}
	this.velocity = {x:0, y:0}
	this.terminalVelocity = pixelSize*24
	this.groundY = this.y();
	this.applyVelocity = function() {
		var currentY = this.div.position().top
		console.log(this.velocity.y)
		console.log(this.velocity.y * 0.99)
		if (this.velocity.y + gravityForce < this.terminalVelocity) {
			this.velocity.y += gravityForce
		}
		this.div.css({
			'top' : currentY+this.velocity.y+'px'
		})
		if (this.y() > this.groundY) {
			this.div.css({
				'top' : this.groundY+'px'
			})
			this.velocity.y = 0
		}
	}
	this.leap = function() {
		this.velocity.y = -this.jumpForce
		console.log("-------LEAP-------")
		console.log(this.velocity.y)
		console.log("--------------")
	}
	this.startWalking = function() {
		var self = this;
		this.walkCycle = setInterval(function(){
			if (self.foot === "left") {
				self.div.addClass('walk-0')
				self.div.removeClass('walk-1')
				self.foot = "right"
			} else {
				self.div.addClass('walk-1')
				self.div.removeClass('walk-0')
				self.foot = "left"
			}
		},150)
	}
	this.stopWalking = function() {
		clearInterval(this.walkCycle)
	}
	this.die = function() {
		this.diedAt = counter
		clearInterval(this.walkCycle)
		this.div.css({
			'animation-play-state' : 'paused',
		}).addClass('dead');
		gStartedGame = false
	}
}
function Cactus(type,speed) {
	this.html = `<div class="cactus" id="cactus-`+cactii.length+`"></div>`;
	$('#stage').append(this.html)
	this.div = $("#cactus-"+cactii.length)
	this.speed = speed*pixelSize
	this.spent = false
	this.width = this.div.width()
	this.height = this.div.height()
	this.x = function(){
		return this.div.position().left
	}
	this.y = function(){
		return this.div.position().top
	}
	this.moveLeft = function(speed){
		var currentX = this.div.position().left
		this.div.css({
			'left': (currentX-this.speed) +'px'
		},this)
		if ((currentX-this.speed) <= -this.width) { // if offscreen left
			this.div.remove()
			this.spent = true
		}
	}
	cactii.push(this)
}
Cactus.prototype.touchingDino = function() {
	var touching = false
	var toRight = this.x() > (dino.xSpot-(dino.width/2))
	var dinoX = dino.xSpot
	var dinoBottom = dino.y() + (dino.height/1.75)
	if (toRight && this.x()-this.speed < dinoX && this.y()<dinoBottom) {
		touching = true
	}
	return touching
}
function gameLoop(time) {
	if (gStartedGame && dino.diedAt < 0) {
		dino.applyVelocity()
		for (var i=0; i<cactii.length; i++) {
			var cactus = cactii[i]
			if (!cactus.spent) {
				cactus.moveLeft(gMasterSpeed+cactus.speed)
				if (cactus.touchingDino()) {
					dino.die()
				}
			}
		}
		if (randomInt(0,2) && counter.mod(32)) {
			new Cactus("tall",12)
		}
		if (counter.mod(480)) {
			gMasterSpeed++
		}
		
	} else {
		dino.die() // stop walk cycle, stop jump anim, change to death image
	}
	counter++
	requestAnimationFrame(gameLoop)
}
Number.prototype.mod = function(num) {
	return this % num === 0
}
function randomInt(min,max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};