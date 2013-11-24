var leapMotion = require('leapjs');
var arduino = require('johnny-five');

/*--ARDUINO--*/

var board = new arduino.Board();

board.on("ready", function() {

	setupComponents();
	setupLeap();
});

/*--LEAP MOTION--*/

var initialFrame = null;

function setupLeap() {

	var leapController = new leapMotion.Controller({enableGestures: true});

	leapController.on("frame", function(frame) {

		receivedFrame(frame);
	});

	leapController.connect();
}

function receivedFrame(frame) {

	if (!initialFrame) {

		initialFrame = frame;
	}
	else {

		interactWithComponents(frame);
	}
}

/*--COMPONENTS--*/

function setupComponents() {

	setupServos();
}

function interactWithComponents(frame) {

	moveServos(frame);
}

/*--SERVO--*/

var horizontalServo, verticalServo;

function setupServos() {

	horizontalServo = new arduino.Servo(9);
	verticalServo = new arduino.Servo(10);

	board.repl.inject({

		servo: horizontalServo,
		servo: verticalServo
	});

	horizontalServo.center();
	verticalServo.center();
}

function moveServos(frame) {

	if (frame.hands.length) {

		var horizontalMove = frame.translation(initialFrame)[0];
		var verticalMove = frame.translation(initialFrame)[1] * -1;

		horizontalServo.move(horizontalMove);
		verticalServo.move(verticalMove);
	}
}