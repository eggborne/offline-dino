var gStartedGame = false
var cactii = []
$(function(){
	dino = new Dino()
	cact = new Cactus()
	document.onkeydown = function(event) {
		event.preventDefault();
		if (event.keyCode == 32) {
			if (!gStartedGame) {
				console.log("satrtr")
				startGame()
			}
			dino.jump()
		}
	};
	var touchStart = function(event) {
		if (!gStartedGame) {
			startGame()
		}
		dino.jump()
	}
	document.body.addEventListener('touchstart',touchStart,true)
});
function startGame() {
	gStartedGame = true
	dino.startWalking()
}
function Dino() {
	this.div = $('#dino')
	this.canJump = true
	this.foot = "left"
	this.divID = "cactus-"+cactii.length
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
				self.canJump = true;
			},500);
		}
	}
	this.startWalking = function() {
		cactii[0].pass(1800)
		console.log("walking?")
		var self = this;

		this.walkCycle = setInterval(function(){
			if (self.foot === "left") {
				console.log("add?")
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
}
function Cactus(type) {
	this.html = `<div class="cactus" id=`+this.divID+`></div>`;
	this.pass = function(speed) {
		$('#'+this.divID).css({
			'animation-duration': speed + 'ms',
			'animation-play-state': 'running'
		})
	}
	$('#stage').append(this.html)
	cactii.push(this)
}
var gameLoop = function() {
	console.log("loop " +counter)
}
