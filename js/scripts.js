var gStartedGame = false;
var cactii = [];
var loop;
var gMasterSpeed = 3;
var gravityForce = 0;
var counter = 0;
var pixelSize = 1;
var restartedAt = -1
$(function(){
	pixelSize = (1/window.devicePixelRatio);
	if (pixelSize < 1) {
		pixelSize = pixelSize.toPrecision(2)
	}
	document.body.style.setProperty('--pixel-size',pixelSize);
	gravityForce = pixelSize*1.5;
	gMasterSpeed *= pixelSize
	dino = new Dino();
	dino.div.animate({
		'top':dino.groundY+'px'
	},800,function(){
		dino.canJump = true;
	})
	var spaceAction = function() {
		if (!gStartedGame) {
			startGame();
		}
		dino.leap();
	}
	document.onkeydown = function(event) {
		if (event.keyCode == 32) {
			spaceAction()
		}
		event.preventDefault();
	};
	document.body.addEventListener('touchstart',spaceAction,true);
	// document.body.addEventListener('mousedown',spaceAction,true);
	$('#restart-button').click(function(){
		$(this).addClass('hidden')
		$('#restart-button').css({
			'transform': 'scale(0.8)'
		})
		gStartedGame = false;
		counter = 0
		cactii.length = 0;
		$('.cactus').remove()
		dino.revive()
		restartedAt = counter
	})
	
});
function startGame() {
	requestAnimationFrame(gameLoop);
	gStartedGame = true;
	dino.startWalking();
}
function spaceAction() {
	if (!gStartedGame && dino.diedAt < 0) {
		startGame();
	} else if (dino.y()===dino.groundY) {
		dino.leap();
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
	this.jumpForce = pixelSize*24
	this.y = function() {
		return this.div.position().top;
	}
	this.velocity = {x:0, y:0};
	this.terminalVelocity = pixelSize*24;
	this.groundY = this.div.position().top;
	this.applyVelocity = function() {
		if (this.y() < this.groundY || this.velocity.y) {
			var currentY = this.y()
			if (dino.y() !== dino.groundY && (this.velocity.y + gravityForce) < this.terminalVelocity) {
				this.velocity.y += gravityForce;
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
		this.diedAt = counter;
		this.velocity.y = this.terminalVelocity;
		clearInterval(this.walkCycle);
		this.div.addClass('dead');
		loop = undefined;
	}
	this.revive = function() {
		this.foot = "left";
		this.diedAt = -1;
		this.div.removeClass('walk-0');
		this.div.removeClass('walk-1');
		this.div.removeClass('dead');
		this.div.addClass('standing');
		setTimeout(function(){
			dino.canJump = true;
		},500)
	}
	this.div.css({
		'top' : -this.height
	})
}
function Cactus(type,speed) {
	this.html = `<div class="cactus" id="cactus-`+cactii.length+`"></div>`;
	$('#stage').append(this.html);
	this.div = $("#cactus-"+cactii.length);
	this.speed = speed*pixelSize;
	this.spent = false;
	this.width = this.div.width();
	this.height = this.div.height();
	this.x = function(){
		return this.div.position().left;
	}
	this.y = function(){
		return this.div.position().top;
	}
	this.moveLeft = function(speed){
		var currentX = this.div.position().left;
		this.div.css({
			'left': (currentX-this.speed) +'px'
		},this)
		if ((currentX-this.speed) <= -this.width) { // if offscreen left
			this.div.remove();
			this.spent = true;
		}
	}
	cactii.push(this);
}
Cactus.prototype.touchingDino = function() {
	var touching = false;
	var toRight = this.x() > (dino.xSpot-(dino.width/2));
	var dinoX = dino.xSpot;
	var dinoBottom = dino.y() + (dino.height/1.75);
	if (toRight && this.x()-this.speed < dinoX && this.y()<dinoBottom) {
		touching = true;
	}
	return touching;
}
function gameLoop(time) {
	dino.applyVelocity();
	if (gStartedGame && dino.diedAt < 0) {
		for (var i=0; i<cactii.length; i++) {
			var cactus = cactii[i];
			if (!cactus.spent) {
				cactus.moveLeft(gMasterSpeed+cactus.speed)
				if (cactus.touchingDino()) {
					dino.die();
					$('#restart-button').removeClass('hidden')
					$('#restart-button').css({
						'transform': 'scale(1)'
					})
				}
			}
		}
		if (randomInt(0,2) && counter.mod(43)) {
			new Cactus("tall",12);
		}
		if (counter.mod(480)) {
			gMasterSpeed++;
		}
		
	} else {
		if (restartedAt===counter) {
			return
		}
	}
	
	counter++
	requestAnimationFrame(gameLoop);
}
Number.prototype.mod = function(num) {
	return this % num === 0;
}
function randomInt(min,max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}