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