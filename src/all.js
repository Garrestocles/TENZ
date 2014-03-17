(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/***
This file is going to contain all the main code to build levels for the game.
-Garrett
***/
var utils = require("./utils.js");
//Prototype for a new map.  Will contain all the data that a map for a level will need.
function MapProto(){
	//A container to drop all of the map in
    this.container = new createjs.Container();
    //Number of pixels in the map based on height and width
    this.width = 3000;
    this.height = 3000;
    //arbitrary starting x/y location
    this.container.x = this.container.y = 0;
    //The height and width of tiles.
    this.tileSize = 30;
    //A 2d array that will contain all of the actual map tiles
    this.tiles = new Array(this.width / this.tileSize); //currently 100
    for (var i = 0; i <= this.width / this.tileSize; i++)
        this.tiles[i] = new Array(this.height / this.tileSize); //currently 50
    this.rooms = [];
    this.openTiles = [];
    //A function that will tell what tile the given X,Y are in.
    this.getLocation = function(x, y) {  
    	var tileX = Math.floor(x / this.tileSize);
        var tileY = Math.floor(y / this.tileSize);

        return  this.tiles[tileX][tileY];
	};
    this.randomOpenTile = function(){
        return this.openTiles[utils.getRandomInt(0,this.openTiles.length)];
    };
}
//Prototype for a new room.  Will contain all the data for an individual room.
function RoomProto(map){
	//pick a random x,y coordinate for the room's top left corner that's not too close to the edge.
    this.roomTLCornerX = utils.getRandomInt(0,(map.tiles.length-7));
    this.roomTLCornerY = utils.getRandomInt(0,(map.tiles[0].length-7));
    //stuff
    var maxWidth, maxHeight;
    this.width;
    this.height;
    //Set maximum width and height for the room
    if(this.roomTLCornerX > map.tiles.length - 25){
        maxWidth = map.tiles.length - this.roomTLCornerX+1;
    } else maxWidth = 25;
    if(this.roomTLCornerY > map.tiles[0].length - 25){
        maxHeight = map.tiles[0].length - this.roomTLCornerY+1;
    } else maxHeight = 25;
    //Randomly select a width and height for the room within the given bounds
    this.roomWidth = utils.getRandomInt(5,maxWidth);
    this.roomHeight = utils.getRandomInt(5,maxHeight);
    //Iterate through all the maximum values and create walls, and fill in the rest with floor.
    for(var x = 0; x < map.tiles.length; x++){
        for (var y = 0; y < map.tiles[x].length; y++){
            if (x >= this.roomTLCornerX && x <= this.roomTLCornerX + this.roomWidth && y >= this.roomTLCornerY && y <= this.roomTLCornerY + this.roomHeight ){
                if ( x == this.roomTLCornerX || x == this.roomTLCornerX + this.roomWidth || y == this.roomTLCornerY || y == this.roomTLCornerY + this.roomHeight ){
                    map.tiles[x][y] = new TileProtos.Wall();
                }else map.tiles[x][y] = new TileProtos.Floor();
            }
        }
    }

}
//An associative array that contains all of the prototypes for the tile types.
var TileProtos = {
	Generic: function(){
		this.name = "none";
		this.isPassable = false;
		this.blocksVision = false;
		this.image = null;
		this.mapX;
		this.mapY;
		this.neighborTiles = [];
        this.viewableTiles = [];
	},
	Floor: function(){
		this.name = "floor";
        this.isPassable = true;
        this.blocksVision = false;
        this.image = new createjs.Bitmap("sprite_sheets/floor.png");
	},
	Wall: function(){
		this.name = "wall";
        this.isPassable = false;
        this.blocksVision = true;
        this.image = new createjs.Bitmap("sprite_sheets/wall.png");
	}
};
TileProtos.Floor.prototype = new TileProtos.Generic();
TileProtos.Wall.prototype = new TileProtos.Generic();
//This is used to connect two points with hallways
function makeCorridor(map,startx,starty,endx,endy){
	var r;

    if(startx < endx){
        for(r = startx; r <= endx; r++){
            map.tiles[r][starty] = new TileProtos.Floor();
            if(map.tiles[r+1][starty+1] === undefined)
                map.tiles[r+1][starty+1] = new TileProtos.Wall();
            if(map.tiles[r+1][starty-1] === undefined)
                map.tiles[r+1][starty-1] = new TileProtos.Wall();
        }
    }else {
       for(r = endx; r <= startx; r++){
            map.tiles[r][starty] = new TileProtos.Floor();
            if(map.tiles[r-1][starty+1] === undefined)
                map.tiles[r-1][starty+1] = new TileProtos.Wall();
            if(map.tiles[r-1][starty-1] === undefined)
                map.tiles[r-1][starty-1] = new TileProtos.Wall();
        } 
    }
    if(starty < endy){
        for(r = starty; r <= endy; r++){
            map.tiles[endx][r] = new TileProtos.Floor();
            if(map.tiles[endx+1][r-1] === undefined)
                map.tiles[endx+1][r-1] = new TileProtos.Wall();
            if(map.tiles[endx-1][r-1] === undefined)
                map.tiles[endx-1][r-1] = new TileProtos.Wall();
        }
    }else {
       for(r = endy; r <= starty; r++){
            map.tiles[endx][r] = new TileProtos.Floor();
            if(map.tiles[endx+1][r+1] === undefined)
                map.tiles[endx+1][r+1] = new TileProtos.Wall();
            if(map.tiles[endx-1][r+1] === undefined)
                map.tiles[endx-1][r+1] = new TileProtos.Wall();
        } 
    }

}
//Add all of the tiles to a container to be rendered.
function renderMap(map){
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
//This function will fine all of the tile's x & y Coordinates
function findTileMapCoord(map){
	var r,b; //iterators

	for(r = 0; r < map.tiles.length; r++){
		for(b=0; b < map.tiles[r].length; b++){
			if(map.tiles[r][b] !== undefined){
				map.tiles[r][b].mapX = r;
				map.tiles[r][b].mapY = b;
                map.tiles[r][b].image.alpha = 0;

				if(map.tiles[r][b].isPassable){
                    map.openTiles.push(map.tiles[r][b]);
                    //Potentially can calculate this ahead of time, instead of on the fly
                    //findViewableTiles(map.tiles[r][b],map);
                }
					
			}
		}
	}
}
//This function will find every valid tile's adjacent tiles to help with AI pathfinding eventually
function findNeighborTiles(tiles){

}
//This function is of stuff I haven't figured out a good way to do yet
//Was going to use to calculate viewable area from each tile on map load rather than on the fly
function findViewableTiles(povTile,map){
    var viewDistTiles = 10;
    var viewDist = viewDistTiles*10;
    var viewPolygonTiles = [];
    var viewPolygonPoints = [];

    var viewTLCornerX = povTile.mapX - viewDistTiles;
    viewTLCornerX = (viewTLCornerX < 0)? 0 : viewTLCornerX;
    var viewTLCornerY = povTile.mapY - viewDistTiles;
    viewTLCornerY = (viewTLCornerY < 0)? 0 : viewTLCornerY;

    var lineOfSight = function(povTile,map,degree,viewDist){
        var nextX = Math.cos(degree * (Math.PI / 180));
        var nextY = Math.sin(degree * (Math.PI / 180));
        var currentX = povTile.image.x;
        var currentY = povTile.image.y;
        var currentTile = map.getLocation(currentX,currentY);
        //var counter = 0;
        //var viewDist = 260;
        var currentDist = 0;
        var done = false;

        while(!done){
            
            //povTile.viewableTiles.push(currentTile);
            if(currentTile.blocksVision)
                return currentTile;
            currentX += nextX;
            currentY += nextY;
            if(map.getLocation(currentX,currentY) === undefined){
                return currentTile;
            }else{
               currentTile = map.getLocation(currentX,currentY); 
            }
            currentDist = Math.sqrt(Math.pow(currentX-povTile.image.x,2)+Math.pow(currentY-povTile.image.y,2));
            if(currentDist > viewDist) 
                return currentTile;

        }
    };

    //update it with the newly seen tiles
    for (var r = 0; r < 360; r++){ 
        var endTile = lineOfSight(povTile,map, r,viewDist);
        if (r == 0 || endTile !== viewPolygonTiles[viewPolygonTiles.length-1])
            viewPolygonTiles.push(endTile);
    }
    for (var b = 0; b < viewPolygonTiles.length; b++){
        viewPolygonPoints.push({x:viewPolygonTiles[b].mapX, y:viewPolygonTiles[b].mapY});
    }
    for (var testX = viewTLCornerX; testX < viewTLCornerX+viewDistTiles*2; testX++){
        for (var testY = viewTLCornerY; testY < viewTLCornerY+viewDistTiles*2; testY++){
            if(map.tiles[testX][testY] !== undefined){
               var testPoint = {
                    x : testX,
                    y : testY
                }
                if(utils.pointInPolygon(viewPolygonPoints, testPoint)){
                    povTile.viewableTiles.push(map.tiles[testX][testY]);
                } 
            }
            

        }
    }

    
    

}
//This function will take care of all the map generating.
module.exports.generateMap = function() {
	var map = new MapProto();
	//Randomly decide the number of rooms
    var numRooms = utils.getRandomInt(10,20);
    //Make the rooms
    for (var r=0; r < numRooms; r++)
        map.rooms.push(new RoomProto(map));
    //Connect the rooms
    var corridorStartX,corridorStartY,corridorEndX,corridorEndY;
    for (var b=1; b < numRooms; b++){
    	corridorStartX = Math.floor(map.rooms[b-1].roomTLCornerX+map.rooms[b-1].roomWidth/2);
    	corridorStartY = Math.floor(map.rooms[b-1].roomTLCornerY+map.rooms[b-1].roomHeight/2);
    	corridorEndX = Math.floor(map.rooms[b].roomTLCornerX+map.rooms[b].roomWidth/2);
    	corridorEndY = Math.floor(map.rooms[b].roomTLCornerY+map.rooms[b].roomHeight/2);

        makeCorridor(map, corridorStartX, corridorStartY, corridorEndX, corridorEndY);
    }
    //Add all these shnazzy new tiles to the map container
    renderMap(map);
    //Now we find all of the tile's meta data. 
    findTileMapCoord(map);
    //Cache the map, once I figure out a way to do that with line of sight
    //map.container.cache(0,0,map.width,map.height);
    //Send back the shiny new map
    return map;
};
},{"./utils.js":4}],2:[function(require,module,exports){
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


},{"./buildmap.js":1,"./gameobjects.js":3,"./utils.js":4}],3:[function(require,module,exports){
//A prototype for a generic game object (non-topography/tile)
function GameObject() {
    var spriteSheetData = {};
    var spriteSheet;
    this.sprite;
}
//A prototype for a game object with some form of intelligence
function Actor() {
    this.going = {
        north: false,
        south: false,
        east: false,
        west: false
    };

    this.dex = 10;
    this.maxSpeed = 15 * this.dex;
    this.speed = this.maxSpeed;

    this.moveAbout = function(delta){
        if(this.going.north || this.going.south){
                if(this.going.west || this.going.east){
                    this.speed = Math.sqrt(Math.pow(this.maxSpeed,2)/2);
                }else this.speed = this.maxSpeed;
            }else this.speed = this.maxSpeed;
            //Find out where we're going and in that direction
            if (this.going.east && !this.going.west){
               this.sprite.x += (delta)/1000 * this.speed; 
               this.sprite.gotoAndPlay("right");
            } 
            if (this.going.west && !this.going.east){
                this.sprite.x -= (delta)/1000 * this.speed;
                this.sprite.gotoAndPlay("left");
            } 
            if (this.going.north && !this.going.south) {
                this.sprite.y -= (delta)/1000 * this.speed;
                this.sprite.gotoAndPlay("up");
            }
            if (this.going.south && !this.going.north) {
                this.sprite.y += (delta)/1000 * this.speed;
                this.sprite.gotoAndPlay("down");
            }
    };
    
}
Actor.prototype = new GameObject();
//A prototype for a game object for the player that in theory has some form of intelligence
Player = function(startingTile,mapTileSize,spriteContainer,canvasWidth, canvasHeight) {
    spritesheetdata ={
        framerate: 1,
        images: ["./sprite_sheets/player.png"],
        frames: {width:40,height:40,count:4,regx:20,regy:20},
        animations:{
            standing: 0,
            down: 0,
            up: 2,
            right: 1,
            left: 3
        }
    };
    spritesheet = new createjs.SpriteSheet(spritesheetdata);
    //Create a sprite for the player and set the initial x,y coord
    this.sprite = new createjs.Sprite(spritesheet);
    this.sprite.gotoAndStop("standing");
    //Save the size of the tiles
    var tileSize = mapTileSize;

    this.viewWidth = canvasWidth;
    this.viewHeight = canvasHeight;

    //Set the initial current tile
    this.currentTile = startingTile;
    //Set the starting location
    this.sprite.x = this.currentTile.mapX*tileSize-tileSize/2;
    this.sprite.y = this.currentTile.mapY*tileSize-tileSize/2;
    this.container = spriteContainer;
    this.container.x = this.viewWidth/2-this.sprite.x;
    this.container.y = this.viewHeight/2-this.sprite.y;

    this.lineOfSight = function(startx, starty, degree, map){
        var nextX = Math.cos(degree * (Math.PI / 180));
        var nextY = Math.sin(degree * (Math.PI / 180));
        var currX = startx;
        var currY = starty;
        var counter = 0;
        var viewDist = 260;
        var currentDist = 0;

        while (map.getLocation(currX,currY) !== undefined && counter < 10){
            map.getLocation(currX,currY).image.alpha = 1;
            if (!map.getLocation(currX,currY).image.visible) 
                map.getLocation(currX,currY).image.visible = true;
            if (map.getLocation(currX,currY).blocksVision) counter++;
            currX += nextX;
            currY += nextY;
            if (currY/map.tileSize > map.numTilesY) currY = currY-(currY-(map.numTilesY*map.tileSize));
            if (currX < 0) currX = 0;

            currentDist = Math.sqrt(Math.pow(currX-startx,2)+Math.pow(currY-starty,2));
            if(currentDist > viewDist) break;
            

        }
        currX += map.container.x;
        currY += map.container.y;

    };

    this.fieldOfVision = function(map){
        //get rid of the currently seen tiles
            for (var r = 0; r <= map.openTiles.length; r++) {
                if (map.openTiles[r] !== undefined) {
                    if(Math.abs(this.sprite.x -  map.openTiles[r].image.x) > 1500
                        || Math.abs(this.sprite.y -  map.openTiles[r].image.y) > 1500){
                        map.openTiles[r].image.visible = false;
                    }else{
                        map.openTiles[r].image.visible = true;
                    }
                    if (map.openTiles[r].image.alpha !== 0) {
                        map.openTiles[r].image.alpha = .3;
                    }
                }
            }
            //update it with the newly seen tiles
            for (var r = 0; r < 360; r+=3){ 
                this.lineOfSight(this.sprite.x+20, this.sprite.y+30, r,map);
            }
            //map.container.updateCache();
    };

    this.update = function(delta,map){
        var oldX = this.sprite.x;
        var oldY = this.sprite.y;

        this.moveAbout(delta);
        var newCurrentTile = map.getLocation(this.sprite.x+20,this.sprite.y+37);
        if(this.currentTile !== newCurrentTile){
            if(newCurrentTile.isPassable){
                this.currentTile = newCurrentTile;
                this.fieldOfVision(map);

            }else{
                this.sprite.x = oldX;
                this.sprite.y = oldY;
            }
        }

        this.container.x = this.viewWidth/2-this.sprite.x;
        this.container.y = this.viewHeight/2-this.sprite.y;

    };
    

}
Player.prototype = new Actor();

module.exports.createPlayer = function(startingTile,mapTileSize,spriteContainer,viewWidth, viewHeight){
    return new Player(startingTile,mapTileSize,spriteContainer,viewWidth, viewHeight);
}
},{}],4:[function(require,module,exports){
//Get's a randome int
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//Finds if a given point is within a polygon.
module.exports.getRandomInt = getRandomInt;
var pointInPolygon = function(polygonPoints, testPoint){
	var r;
	var b= polygonPoints.length - 1;
	var isIn = false;

	for(r=0; r < polygonPoints.length; r++){
		if((polygonPoints[r].y < testPoint.y && polygonPoints[b].y >= testPoint.y
			|| polygonPoints[b].y < testPoint.y && polygonPoints[r].y >= testPoint.y)
			&& (polygonPoints[r].x <= testPoint.x || polygonPoints[b]<=testPoint.x)){
			if(polygonPoints[r].x+(testPoint.y - polygonPoints[r].y)/(polygonPoints[b].y-polygonPoints[r].y)*(polygonPoints[b].x-polygonPoints[r].x) < testPoint.x){
				isIn = true;
			}
		}
		b=r;
	}
}
module.exports.pointInPolygon = pointInPolygon;
},{}]},{},[2])