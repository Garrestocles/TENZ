var mapStuff = require('./buildmap.js');
var gameObj = require('./gameobjects.js');
var utils = require('./utils.js');

var RIGHT_KEY_CODE = 68; //letter d
var LEFT_KEY_CODE = 65; //letter a
var UP_KEY_CODE = 87; //letter w
var DOWN_KEY_CODE = 83; //letter s
var KEYCODE_LEFT = 37; //left arrow
var KEYCODE_RIGHT = 39; //right arrow

document.addEventListener('DOMContentLoaded', function () {
    game();
});

function game() {
    //Create a stage and bind it to the canvas
    var stage = new createjs.Stage("gamewindow");
	//Tell it to use requestAnimationFrame API and set function to be called as game loop
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    //createjs.Ticker.setFPS(20);
	createjs.Ticker.addEventListener('tick', tick);
    //Get dimensions of canvas
    var VIEW_WIDTH = parseInt(document.getElementById("gamewindow").getAttributeNode("width").value);
    var VIEW_HEIGHT = parseInt(document.getElementById("gamewindow").getAttributeNode("height").value);

    var map = mapStuff.generateMap();
    //Need this to update the cache once the images load.
    var ticks = 0;

    var spriteContainer = new createjs.Container();

    var player = gameObj.createPlayer(map.randomOpenTile(), map.tileSize, spriteContainer,VIEW_WIDTH,VIEW_HEIGHT);
    spriteContainer.addChild(player.sprite);


    stage.addChild(map.container);
    stage.addChild(spriteContainer);

    //Set up a thing to track the player's map coordinants
    var ptile = new createjs.Text("Player's Map Coord: --", "20px Arial", "#F00");
    ptile.x = 10;
    ptile.y = 30;
    stage.addChild(ptile);
    //Set up a FPS counter
    var fps = new createjs.Text("FPS: --", "20px Arial", "#F00");
    fps.x = fps.y = 10;
    stage.addChild(fps);

    //Actually listen for key press events
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    //What to do if a button is pressed
    function keyDown(e) {
        switch(e.keyCode){
            case UP_KEY_CODE:
                player.going.north = true;
                break;
            case DOWN_KEY_CODE:
                player.going.south = true;
                break;
            case RIGHT_KEY_CODE:
                player.going.east = true;
                break;
            case LEFT_KEY_CODE:
                player.going.west = true;
                break;
        }
    }
    //What to do if a button is released
    function keyUp(e) {
        switch(e.keyCode){
            case UP_KEY_CODE:
                player.going.north = false;
                break;
            case DOWN_KEY_CODE:
                player.going.south = false;
                break;
            case RIGHT_KEY_CODE:
                player.going.east = false;
                break;
            case LEFT_KEY_CODE:
                player.going.west = false;
                break;
        }
    }

    function tick(event) {
    	if (ticks <= 10){
    		//if (ticks == 10) map.container.updateCache();
            player.fieldOfVision(map);
    		ticks++;
    	}
    	
    	map.container.x = spriteContainer.x;
        map.container.y = spriteContainer.y;
	    //Update the FPS counter
	    fps.text = "FPS: "+Math.round(createjs.Ticker.getMeasuredFPS());
	    //Update the player's coordinants
	    ptile.text = "Player's Coord: "+player.currentTile.mapX+","+player.currentTile.mapY;
	    //Update the player
	    player.update(event.delta, map);
	    //Redraw the screen
	    stage.update();
	}

}

