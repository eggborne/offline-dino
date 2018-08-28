var gestureRules = {
	swipe: {
		north: {
			distance: (-220*game.pixelSize),
			duration: 15
		},
		south: {
			distance: (220*game.pixelSize),
			duration: 15
		},
		west: {
			distance: (-180*game.pixelSize),
			duration: 15
		},
		east: {
			distance: (180*game.pixelSize),
			duration: 15
		}
	}
}
function Touch(touchEvent) {
	this.identifier = touchEvent.identifier;
	this.startTime = game.counter;
	this.x = touchEvent.pageX;
	this.y = touchEvent.pageY;
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
		if (distance.y <= gestureRules.swipe.north.distance && duration <= gestureRules.swipe.north.duration) {
			fullSwipe += "north";
		}
		if (distance.y >= gestureRules.swipe.south.distance && duration <= gestureRules.swipe.south.duration) {
			fullSwipe += "south";
		}
		if (distance.x <= gestureRules.swipe.west.distance && duration <= gestureRules.swipe.west.duration) {
			fullSwipe += "west";
		}
		if (distance.x >= gestureRules.swipe.east.distance && duration <= gestureRules.swipe.east.duration) {
			fullSwipe += "east";
		}
		if (fullSwipe) {
			$('#debug-swipe').html("swiped " + fullSwipe.toUpperCase() + " in " + this.getDuration() + "!");
			setTimeout(function () {
				$('#debug-swipe').html("&nbsp;")
				game.dino.canSwipe = true
			}, 600);
		}
		
		return fullSwipe;
	}
}
var currentTouches = []
function touchStart(event) {
	// event.preventDefault();
	for (var i=0; i<event.changedTouches.length; i++) {
		var newTouch = event.changedTouches[i]
		currentTouches.push(new Touch(newTouch));
	}
	spaceAction()
}
function touchMove(event) {
	// event.preventDefault();
	var movingTouches = [];
	for (var i=0; i<event.changedTouches.length; i++) {
    movingTouches.push(copyTouch(event.changedTouches[i]));
	}
	movingTouches.forEach(function (touchEvent, i) {
		var touchObject = new Touch(touchEvent);
		// take each touch that moved...
		currentTouches.forEach(function (existingTouch, j) {
			//...find it in the list...
			if (touchObject.identifier === existingTouch.identifier) {
				//...replace the old {x,y} with the new one
				currentTouches[j].x = touchObject.x;
				currentTouches[j].y = touchObject.y;
				if (game.dino.canSwipe && currentTouches[j].getSwipe()) {
					game.dino.canSwipe = false
					
				}
			}
		});
	});
}
function touchEnd(event) {
	// event.preventDefault();
	Array.from(event.changedTouches).forEach(function (touch, i) {
		currentTouches.splice(i, 1);
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
	};
	document.body.addEventListener('mousedown',spaceAction,true);
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
	currentTouches.forEach(function(touch, i) {
		if (touch.x) {
			$('#debug-touches').append("x: " + touch.x + " | y: " + touch.y + "<br />startTime: " + touch.startTime + "<br />duration: " + touch.getDuration());
			if (i < currentTouches.length - 1) {
				$('#debug-touches').append(", <br />")
			}
		}
	});
}