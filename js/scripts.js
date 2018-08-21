var canJump = true;
var startedGame = false
var dinoFoot = "left"
$(function(){
	dino = $('#dino')
	document.onkeydown = function(event) {
		event.preventDefault()
		if (!startedGame) {
			startedGame = true
			dino.addClass('walk-0')
		}
		if (canJump && event.keyCode == 32) {
			dino.css({
				'animation-play-state' : "running"
			})
			canJump = false;
			setTimeout(function(){
				dino.css({
					'animation-play-state' : "paused"
				});
				canJump = true;
			},500)
			
		};
	};
	document.onkeyup = function(event) {
		if (event.keyCode == 32) {
				
		};
	};
	document.getElementById('dino').addEventListener("animationend",function(){
		console.log("done jumping!!")
	});
});
var walkCycle = setInterval(function(){
	console.log("walking")
	console.log(dino)
	if (dino.hasClass('walk-1')) {
		$('#dino').addClass('walk-0')
		$('#dino').removeClass('walk-1')
		dinoFoot = "right"
	} else if (dino.hasClass('walk-0')) {
		$('#dino').addClass('walk-1')
		$('#dino').removeClass('walk-0')
		dinoFoot = "left"
	}
},150)

// touchStart = function(event) {
// 	touchingDPad = true
// 	var touch = {
// 			id: event.changedTouches[0].identifier || 0,
// 			pos: {x:event.changedTouches[0].clientX,y:event.changedTouches[0].clientY}
// 	}
// 	touches.push(touch);
// }
// touchMove = function(event) {
// 	if (touches.length) {
// 			touches[0].pos = {x:event.changedTouches[0].clientX,y:event.changedTouches[0].clientY}
// 	}
// }
// touchEnd = function(event) {
// 	var touch = {x:event.changedTouches[0].clientX,y:event.changedTouches[0].clientY}
// 	touches.splice(touches.indexOf(touch),1)
// }
// document.body.addEventListener('touchstart',touchStart,true)
// document.body.addEventListener('touchmove',touchMove,true)
// document.body.addEventListener('touchend',touchEnd,true)