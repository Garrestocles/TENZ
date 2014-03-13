var buildmap = require('./buildmap.js');
var gameobj = require('./gameobjects.js');

var RIGHT_KEY_CODE = 68; //letter d
var LEFT_KEY_CODE = 65; //letter a
var UP_KEY_CODE = 87; //letter w
var DOWN_KEY_CODE = 83; //letter s
var KEYCODE_LEFT = 37; //left arrow
var KEYCODE_RIGHT = 39; //right arrow

document.addEventListener('DOMContentLoaded', function () {
    init();
});
//Actually listen for key press events
document.addEventListener('keydown', keyDown, false);
document.addEventListener('keyup', keyUp, false);

function init() {
    //Create a stage and bind it to the canvas
    var stage = new createjs.Stage("gamewindow");
	//Tell it to use requestAnimationFrame API and set function to be called as game loop
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener('tick', tick);
    //Get dimensions of canvas
    var VIEW_WIDTH = parseInt(document.getElementById("gamewindow").getAttributeNode("width").value);
    var VIEW_HEIGHT = parseInt(document.getElementById("gamewindow").getAttributeNode("height").value);
    //Set up a thing to track the player's map coordinants
	var ptile = new createjs.Text("Player's Map Coord: --", "20px Arial", "#F00");
    ptile.x = 10;
    ptile.y = 30;
    stage.addChild(ptile);
    //Set up a FPS counter
    var fps = new createjs.Text("FPS: --", "20px Arial", "#F00");
    fps.x = fps.y = 10;
    stage.addChild(fps);

    function tick(event) {
	    //Update the FPS counter
	    fps.text = "FPS: "+Math.round(createjs.Ticker.getMeasuredFPS());
	    //Update the player's coordinants
	    //ptile.text = "Player's Coord: "+currentTile(player.sprite.x,player.sprite.y).x+","+currentTile(player.sprite.x,player.sprite.y).y;
	    //Update the player
	    //player.update(event.delta);
	    //Update the pet
	    //pet.update();
	    //Redraw the screen
	    stage.update();
	}

}

//What to do if a button is pressed
function keyDown(e) {
    //if (e.keyCode in player.keysPressed) player.keysPressed[e.keyCode] = true;
}
//What to do if a button is released
function keyUp(e) {
    //if (e.keyCode in player.keysPressed) player.keysPressed[e.keyCode] = false;
}