var gStartedGame = false;
var gMasterSpeed = 3;
var cactii = [];
var loop;
var counter = 0
$(function(){
	dino = new Dino()
	document.onkeydown = function(event) {
		if (event.keyCode == 32) {
			if (!gStartedGame && dino.diedAt < 0) {
				startGame()
			}
			dino.jump()
		}
		event.preventDefault();
	};
	var touchStart = function(event) {
		if (!gStartedGame) {
			startGame()
		}
		dino.jump()
		event.preventDefault();
	}
	document.body.addEventListener('touchstart',touchStart,true)
});
function startGame() {
	gStartedGame = true
	loop = gameLoop()
	dino.startWalking()
}
function Dino() {
	this.div = $('#dino')
	this.xSpot = this.div.position().left + (this.div.width()*0.75)
	this.canJump = true
	this.foot = "left"
	this.diedAt = -1
	this.width = this.div.width()
	this.height = this.div.height()
	this.jump = function() {
		if (this.canJump) {
			this.div.css({
				'animation-play-state' : "running",
			});
			this.canJump = false;
			var self = this;
			setTimeout(function(){
				self.div.css({
					'animation-play-state' : "paused",
					'top' : '415px'
				});
				setTimeout(function(){
					self.canJump = true;
				},20 	)
				
			},600);
		}
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
			'animation-play-state' : "paused",
		}).addClass('dead');
		gStartedGame = false
	}
}
function Cactus(type) {
	this.html = `<div class="cactus" id="cactus-`+cactii.length+`"></div>`;
	
	$('#stage').append(this.html)
	this.div = $("#cactus-"+cactii.length)
	this.speed = 6
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
			'left': (currentX-speed) +'px'
		},this)
		if ((currentX-speed) <= -this.width) { // if offscreen left
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
	var dinoBottom = dino.div.position().top+(dino.height/1.75)
	if (toRight && this.x()-this.speed < dinoX && this.y()<dinoBottom) {
		touching = true
	}
	return touching
}
function gameLoop(time) {
	if (gStartedGame && dino.diedAt < 0) {
		for (var i=0; i<cactii.length; i++) { // for loop required for i manipulation
			var cactus = cactii[i]
			if (!cactus.spent) {
				cactus.moveLeft(gMasterSpeed+cactus.speed)
				if (cactus.touchingDino()) {
					dino.die()
				}
			}
		}
		if (randomInt(0,2) && counter.mod(45)) {
			new Cactus()
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