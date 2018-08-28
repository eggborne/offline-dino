function Touch(touchEvent) {
	this.identifier = touchEvent.identifier;
	this.startTime = game.counter;
	this.x = touchEvent.clientX;
	this.y = touchEvent.clientY;
	this.startSpot = { x: this.x, y: this.y };
	this.endSpot = {};
	this.moveDuration = function () {
		return game.counter - this.startTime;
	}
	this.moveDistance = function () {
		var distance = {};
		distance.x = this.x - this.startSpot.x;
		distance.y = this.y - this.startSpot.y;
		return distance
	}
}
var currentTouches = []
function touchStart(event) {
	// event.preventDefault();
	for (var i=0; i<event.changedTouches.length; i++) {
		var newTouch = event.changedTouches[i]
		currentTouches.push(new Touch(newTouch));
		debug ? $('#debug').append(`<span id="touch-` + newTouch.identifier + `">` + newTouch.identifier + `</span>`) : false;
  }
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
				//...replace it with the new one
				currentTouches[j] = touchObject;
				debug ? $(`#touch-` + currentTouches[j].identifier).css({ 'color': 'green' }) : false;
			}
		});
	});
}
function touchEnd(event) {
	// event.preventDefault();
	for (var i=0; i<event.changedTouches.length; i++) {
		currentTouches.push(copyTouch(event.changedTouches[i]));
		debug ? $(`#touch-` + currentTouches[i].identifier).remove() : false;
  }
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
	document.body.addEventListener('touchstart',spaceAction,true)
	document.body.addEventListener('mousedown',spaceAction,true);
	document.body.addEventListener('touchstart',spaceAction,touchStart,true);
	document.body.addEventListener('touchmove',spaceAction,touchMove,true);
	document.body.addEventListener('touchend',spaceAction,touchEnd,true);
	$('#restart-button').click(function(){
		$(this).addClass('hidden')
		$('#restart-button').css({
			'transform': 'scale(0.8)'
		})
		game.restart()
	})
}