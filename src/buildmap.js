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
                    findNeighborTiles(map,r,b);
                    //Potentially can calculate this ahead of time, instead of on the fly
                    //findViewableTiles(map.tiles[r][b],map);
                }
					
			}
		}
	}
}
//This function will find every valid tile's adjacent tiles to help with AI pathfinding eventually
function findNeighborTiles(map,xCoOrd, yCoOrd){
    var north = yCoOrd - 1;
    var south = yCoOrd + 1;
    var east = xCoOrd + 1;
    var west = xCoOrd - 1;

    
    if(isValidNeighbor(map.tiles[xCoOrd][south]))
        map.tiles[xCoOrd][yCoOrd].neighborTiles.push(map.tiles[xCoOrd][south]);
    if(isValidNeighbor(map.tiles[xCoOrd][north]))
        map.tiles[xCoOrd][yCoOrd].neighborTiles.push(map.tiles[xCoOrd][north]);
    if(isValidNeighbor(map.tiles[east][yCoOrd]))
        map.tiles[xCoOrd][yCoOrd].neighborTiles.push(map.tiles[east][yCoOrd]);
    if(isValidNeighbor(map.tiles[west][yCoOrd]))
        map.tiles[xCoOrd][yCoOrd].neighborTiles.push(map.tiles[west][yCoOrd]);
    if(isValidNeighbor(map.tiles[east][south]))
        map.tiles[xCoOrd][yCoOrd].neighborTiles.push(map.tiles[east][south]);
    if(isValidNeighbor(map.tiles[west][south]))
        map.tiles[xCoOrd][yCoOrd].neighborTiles.push(map.tiles[west][south]);
    if(isValidNeighbor(map.tiles[east][north]))
        map.tiles[xCoOrd][yCoOrd].neighborTiles.push(map.tiles[east][north]);
    if(isValidNeighbor(map.tiles[west][north]))
        map.tiles[xCoOrd][yCoOrd].neighborTiles.push(map.tiles[west][north]);
    //return whether current tile is a valid neighbor
    function isValidNeighbor(currentTile){
        if(currentTile !== undefined){
            if(currentTile.isPassable){
                return true;
            } else return false;
        }else return false;
    }
}
//This function is of stuff I haven't figured out a good way to do yet
//Was going to use to calculate viewable area from each tile on map load rather than on the fly
function findViewableTiles(povTile,map){
    /*
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

    
*/

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