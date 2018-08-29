function Touch(touchEvent) {
	this.identifier = touchEvent.identifier;
	this.startTime = game.counter;
	this.x = Math.round(touchEvent.pageX);
	this.y = Math.round(touchEvent.pageY);
	this.startSpot = { x: this.x, y: this.y };
	this.endSpot = {};
	this.getDuration = function () {
		return game.counter - this.startTime;
	}
	this.getDistance = function () {
		var distance = {};
		distance.x = this.x - this.startSpot.x;
		distance.y = this.y - this.startSpot.y;
		return distance
	}
	this.getSwipe = function () {
		var fullSwipe = ""
		var duration = this.getDuration();
		var distance = this.getDistance();
		
		if (distance.y <= game.gestureRules.swipe.north.distance && duration <= game.gestureRules.swipe.north.duration) {
			fullSwipe += "north";
		}
		if (distance.y >= game.gestureRules.swipe.south.distance && duration <= game.gestureRules.swipe.south.duration) {
			fullSwipe += "south";
		}
		if (distance.x <= game.gestureRules.swipe.west.distance && duration <= game.gestureRules.swipe.west.duration) {
			fullSwipe += "west";
		}
		if (distance.x >= game.gestureRules.swipe.east.distance && duration <= game.gestureRules.swipe.east.duration) {
			fullSwipe += "east";
		}
		if (fullSwipe) {
			return fullSwipe;
			// do something with swipeActions[fullSwipe]
			$('#debug-swipe').html("swiped " + fullSwipe.toUpperCase() + " in " + this.getDuration() + "!");
			setTimeout(function () {
				$('#debug-swipe').html("&nbsp;")
			}, 800);
		}
	}
}
function touchStart(event) {
	for (var i=0; i<event.changedTouches.length; i++) {
		var newTouch = event.changedTouches[i]
		game.currentTouches.push(new Touch(newTouch));
	}
	if (!game.started) {
		game.startScrolling();
	}
	// spaceAction()
}
function touchMove(event) {
	var movingTouches = [];
	for (var i=0; i<event.changedTouches.length; i++) {
    movingTouches.push(copyTouch(event.changedTouches[i]));
	}
	movingTouches.forEach(function(touchEvent, i) {
		var touchObject = new Touch(touchEvent);
		// take each touch that moved...
		game.currentTouches.forEach(function (existingTouch, j) {
			//...find it in the list...
			if (touchObject.identifier === existingTouch.identifier) {
				//...replace the old {x,y} with the new one
				game.currentTouches[j].x = touchObject.x;
				game.currentTouches[j].y = touchObject.y;
				// check if it has completed a swipe
				var swiped = game.currentTouches[j].getSwipe()
				if (swiped && game.dino.canSwipe) {
					game.dino.canSwipe = false
					setTimeout(function () {
						game.dino.canSwipe = true;
					}, 400);
					game.swipeActions[swiped]()
				}
			}
		});
	});
}
function touchEnd(event) {
	Array.from(event.changedTouches).forEach(function(touch, i) {
		var duration = game.currentTouches[i].getDuration();
		var distance = game.currentTouches[i].getDistance();
		if (duration <= game.tapTime 
			&& distance.x <= game.tapDistance && distance.y < game.tapDistance) {
				// spaceAction()
		}
		game.currentTouches.splice(i, 1);
	});
	
}
function copyTouch(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}
function spaceAction() {
	if (!game.started) {
		game.startScrolling();
	}
	game.dino.leap();
}
function setInputs() {
	document.onkeydown = function (event) {
		event.preventDefault();
		if (event.keyCode == 32) {
			spaceAction()
		}
		// arrow keys for swipe actions?
	};
	// document.body.addEventListener('mousedown',spaceAction,true);
	document.body.addEventListener('touchstart',touchStart,true);
	document.body.addEventListener('touchmove',touchMove,true);
	document.body.addEventListener('touchend',touchEnd,true);
	$('#restart-button').click(function(){
		$(this).addClass('hidden')
		$('#restart-button').css({
			'transform': 'scale(0.8)'
		})
		game.restart()
	})
}
function postToDebug() {
	$('#debug-touches').html("")
	game.currentTouches.forEach(function(touch, i) {
		if (touch.x) {
			$('#debug-touches').append("x: " + touch.x + " | y: "
				+ touch.y + "<br />duration: " + touch.getDuration());
			if (i < game.currentTouches.length - 1) {
				$('#debug-touches').append(", <br />")
			}
		}
	});
}