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