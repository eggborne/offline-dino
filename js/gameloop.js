function gameLoop() {
	game.dino.applyVelocity();
	if (game.started && game.dino.diedAt < 0) { // started, not dead
		for (var i=0; i<game.cactii.length; i++) {
			var cactus = game.cactii[i];
			if (!cactus.spent) {
				cactus.moveLeft()
				if (cactus.touchingDino()) {
					game.dino.die();
					$('#restart-button').removeClass('hidden')
					$('#restart-button').css({
						'transform': 'scale(1)'
					});
				}
			}
		}
		if (randomInt(0,5) && game.counter.mod(45)) {
			new Cactus(3);
		}
	} else { // dead but haven't clicked restart
		if (game.restartedAt===game.counter) {
			return // breaks out of loop
		}
	}
	if (debug) {postToDebug()};
	game.counter++;
	requestAnimationFrame(gameLoop);
}