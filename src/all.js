(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/***
This file is going to contain all the main code to build levels for the game.
-Garrett
***/

//Prototype for a new map.  Will contain all the data that a map for a level will need.
function MapProto(){

}
//Prototype for a new room.  Will contain all the data for an individual room.
function RoomProto(){

}
//An associative array that contains all of the prototypes for the tile types.
var TileProtos = {

};
//This is used to connect two points with hallways
function makeCorridor(startx,starty,endx,endy){

}
//This takes care of room creation.
function makeRooms(){

}
//Add all of the tiles to a container to be rendered.
function renderMap(){
	for (var r = 0; r <= map.tiles.length; r++) {
        if (map.tiles[r] !== undefined) {
            for (var b = 0; b <= map.tiles[r].length; b++) {
                if (map.tiles[r][b] !== undefined) {
                    map.tiles[r][b].image.x = r * map.tileSize;
                    map.tiles[r][b].image.y = b * map.tileSize;
                    map.container.addChild(map.tiles[r][b].image);
                }
            }
        }
    }
}
//This function will take care of all the map generating.
module.exports.generateMap = function() {

};
},{}],2:[function(require,module,exports){
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
},{"./buildmap.js":1,"./gameobjects.js":3}],3:[function(require,module,exports){

},{}]},{},[2])