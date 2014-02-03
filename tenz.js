(function () {
	//"use strict";
    var RIGHT_KEY_CODE = 68;
    var LEFT_KEY_CODE = 65;
    var UP_KEY_CODE = 87;
    var DOWN_KEY_CODE = 83;
    //var	KEYCODE_LEFT = 37; //left arrow
    //var	KEYCODE_RIGHT = 39; //right arrow

    var shape = new createjs.Shape();

    function MapProto() {
        this.container = new createjs.Container();
        this.width = 2000;
        this.height = 1000;
        this.container.x = this.container.y = 0;
        this.tileSize = 20;

        this.tiles = new Array(this.width / this.tileSize); //currently 100
        for (var i = 0; i <= this.width / this.tileSize; i++)
            this.tiles[i] = new Array(this.height / this.tileSize); //currently 50

        this.rooms = new Array();


    }
    var map = new MapProto();

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function RoomProto(){

        this.roomTLCornerX = getRandomInt(0,map.tiles.length-7);
        this.roomTLCornerY = getRandomInt(0,map.tiles[0].length-7);
        var maxWidth, maxHeight;

        if(this.roomTLCornerX > map.tiles.length - 26){
            maxWidth = map.tiles.length - this.roomTLCornerX;
        } else maxWidth = 25;
        if(this.roomTLCornerY > map.tiles[0].length - 26){
            maxHeight = map.tiles[0].length - this.roomTLCornerY;
        } else maxHeight = 25;

        this.roomWidth = getRandomInt(5,maxWidth);
        this.roomHeight = getRandomInt(5,maxHeight);

        for(var x = 0; x < map.tiles.length; x++){
            for (var y = 0; y < map.tiles[x].length; y++){
                if (x >= this.roomTLCornerX && x <= this.roomTLCornerX + this.roomWidth && y >= this.roomTLCornerY && y <= this.roomTLCornerY + this.roomHeight ){
                    if ( x == this.roomTLCornerX || x == this.roomTLCornerX + this.roomWidth || y == this.roomTLCornerY || y == this.roomTLCornerY + this.roomHeight ){
                        map.tiles[x][y] = new tileProtos.Wall();
                    }else map.tiles[x][y] = new tileProtos.Floor();
                }
            }
        }

    }

    var tileProtos = {
        Floor: function () {
            this.name = "floor";
            this.isPassable = true;
            this.blocksVision = false;
            this.image = new createjs.Bitmap("sprite_sheets/floor.png");
        },
        Wall: function () {
            this.name = "wall";
            this.isPassable = false;
            this.blocksVision = true;
            this.image = new createjs.Bitmap("sprite_sheets/wall.png");
        },
        Blank: function () {
            this.name = "thevoid";
            this.blocksVision = true;
            this.isPassable = false;
            this.image = null;
        }
    };

    function GameObject() {

    }

    function Actor() {

    }

    function Player() {
        this.sprite = new createjs.Text("@", "30px Courier", "#FFF");
        this.sprite.x = this.sprite.y = 50;

        this.keysPressed = [];
        this.keysPressed[RIGHT_KEY_CODE] = false;
        this.keysPressed[LEFT_KEY_CODE] = false;
        this.keysPressed[UP_KEY_CODE] = false;
        this.keysPressed[DOWN_KEY_CODE] = false;

        this.update = function () {
            var prevX = this.sprite.x;
            var prevY = this.sprite.y;
            var mapPrevX = map.container.x;
            var mapPrevY = map.container.y;

            if (this.keysPressed[RIGHT_KEY_CODE]){
               this.sprite.x += 2; 
               map.container.x -= 2;
            } 
            if (this.keysPressed[LEFT_KEY_CODE]){
                this.sprite.x -= 2;
                map.container.x += 2;
            } 
            if (this.keysPressed[UP_KEY_CODE]) {
                this.sprite.y -= 2;
                map.container.y += 2;
            }
            if (this.keysPressed[DOWN_KEY_CODE]) {
                this.sprite.y += 2;
                map.container.y -= 2;
            }
            if (currentTile(this.sprite.x, this.sprite.y).tile !== undefined)
            if (!currentTile(this.sprite.x, this.sprite.y).tile.isPassable) {
                this.sprite.x = prevX;
                this.sprite.y = prevY;
                map.container.x = mapPrevX;
                map.container.y = mapPrevY;
            }
            if (currentTile(this.sprite.x, this.sprite.y).tile === undefined){
                this.sprite.x = prevX;
                this.sprite.y = prevY;
                map.container.x = mapPrevX;
                map.container.y = mapPrevY;
            }

            var viewshape = new Array();
            for (var r = 0; r < 360; r+=3)
                viewshape.push(castARay(this.sprite.x, this.sprite.y, r));
            
            shape.graphics = new createjs.Graphics().beginStroke("rgba(255,255,255,1)").moveTo(viewshape[0].x,viewshape[0].y);
            for(var b = 1; b < viewshape.length; b++)
                shape.graphics.lineTo(viewshape[b].x,viewshape[b].y);
            shape.graphics.closePath();
            //console.log(viewshape);
        };

    }
    Actor.prototype = new GameObject();
    Player.prototype = new Actor();

    document.addEventListener('DOMContentLoaded', function () {
        game();
    });

    function game() {

        stage = new createjs.Stage("gamewindow");

        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener('tick', tick);

        var VIEW_WIDTH = parseInt(document.getElementById("gamewindow").getAttributeNode("width").value);
        var VIEW_HEIGHT = parseInt(document.getElementById("gamewindow").getAttributeNode("height").value);

        buildmaparray();
        buildmap();

        var player = new Player();
        player.sprite.x = map.rooms[0].roomTLCornerX*map.tileSize + 30;
        player.sprite.y = map.rooms[0].roomTLCornerY*map.tileSize + 30;

        map.container.addChild(player.sprite);
        map.container.x += Math.floor(VIEW_WIDTH/2) - player.sprite.x - 15;
        map.container.y += Math.floor(VIEW_HEIGHT/2) - player.sprite.y - 15;
        

        document.addEventListener('keydown', keyDown, false);
        document.addEventListener('keyup', keyUp, false);

        shape = new createjs.Shape();
        //shape.graphics = new createjs.Graphics().beginStroke("rgba(255,255,255,1)").drawCircle(player.sprite.x+map.container.x+10, player.sprite.y+map.container.y+15, 200).endStroke();

        var translateX = player.sprite.x+map.container.x+10;
        var translateY = player.sprite.y+map.container.y+15;
        var testsize = 100;

        //shape.graphics = new createjs.Graphics().beginStroke("rgba(255,255,255,1)").moveTo(translateX-testsize,translateY-testsize).lineTo(translateX-testsize,translateY+testsize).lineTo(translateX+testsize,translateY+testsize).lineTo(translateX+testsize,translateY-testsize).closePath();

        //map.container.mask = shape;

        stage.addChild(map.container);
        

        function buildmaparray() {

            map.rooms[0] = new RoomProto();
            map.rooms[1] = new RoomProto();
            map.rooms[2] = new RoomProto();
            map.rooms[3] = new RoomProto();
            makeCorridor(Math.floor(map.rooms[0].roomTLCornerX+map.rooms[0].roomWidth/2),Math.floor(map.rooms[0].roomTLCornerY+map.rooms[0].roomHeight/2),Math.floor(map.rooms[1].roomTLCornerX+map.rooms[1].roomWidth/2),Math.floor(map.rooms[1].roomTLCornerY+map.rooms[1].roomHeight/2));
            makeCorridor(Math.floor(map.rooms[1].roomTLCornerX+map.rooms[1].roomWidth/2),Math.floor(map.rooms[1].roomTLCornerY+map.rooms[1].roomHeight/2),Math.floor(map.rooms[2].roomTLCornerX+map.rooms[2].roomWidth/2),Math.floor(map.rooms[2].roomTLCornerY+map.rooms[2].roomHeight/2));
            makeCorridor(Math.floor(map.rooms[3].roomTLCornerX+map.rooms[3].roomWidth/2),Math.floor(map.rooms[3].roomTLCornerY+map.rooms[3].roomHeight/2),Math.floor(map.rooms[2].roomTLCornerX+map.rooms[2].roomWidth/2),Math.floor(map.rooms[2].roomTLCornerY+map.rooms[2].roomHeight/2));

            function makeCorridor(startx,starty,endx,endy){
                //map.tiles[startx][starty] = new tileProtos.Floor();
                //map.tiles[endx][endy] = new tileProtos.Floor();
                var r;

                //console.log("values:" + startx +","+starty+" to " + endx + ":" + endy);

                if(startx < endx){
                    for(r = startx; r <= endx; r++){
                        map.tiles[r][starty] = new tileProtos.Floor();
                    }
                }else {
                   for(r = endx; r <= startx; r++){
                        map.tiles[r][starty] = new tileProtos.Floor();
                    } 
                }
                if(starty < endy){
                    for(r = starty; r <= endy; r++){
                        map.tiles[endx][r] = new tileProtos.Floor();
                    }
                }else {
                   for(r = endy; r <= starty; r++){
                        map.tiles[endx][r] = new tileProtos.Floor();
                    } 
                }
            }
        }

        function buildmap() {
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
        var fps = new createjs.Text("FPS: --", "48px Arial", "#F00");
            fps.x = fps.y = 10;
            stage.addChild(fps);
        function tick(event) {

            for (var r = 0; r <= map.tiles.length; r++) {
                if (map.tiles[r] !== undefined) {
                    for (var b = 0; b <= map.tiles[r].length; b++) {
                        if (map.tiles[r][b] !== undefined) {
                            map.tiles[r][b].image.alpha = .3;
                        }
                    }
                }
            }
            fps.text = "FPS: "+Math.round(createjs.Ticker.getMeasuredFPS());
            //console.log(createjs.Ticker.getMeasuredFPS());
            player.update();
            stage.update();
        }

        function keyDown(e) {
            if (e.keyCode in player.keysPressed) player.keysPressed[e.keyCode] = true;
        }

        function keyUp(e) {
            if (e.keyCode in player.keysPressed) player.keysPressed[e.keyCode] = false;
        }


    }

    


    function castARay(startx, starty, degree){
        //var degree = direction;
        var nextX = Math.cos(degree * (Math.PI / 180)) * 2;
        var nextY = Math.sin(degree * (Math.PI / 180)) * 2;
        var currX = startx;
        var currY = starty;
        var counter = 0;
        //var viewDist = 50;


        while (currentTile(currX,currY).tile !== undefined && counter < 10){
            currentTile(currX,currY).tile.image.alpha = 1;
            if (currentTile(currX,currY).tile.blocksVision) counter++;
            currX += nextX;
            currY += nextY;
            if (currY/20 > 50) currY = currY-(currY-(50*20));
            if (currX < 0) currX = 0;

        }
        currX += map.container.x;
        currY += map.container.y;

        return{ x: currX,
            y: currY};

    }
    function currentTile(x, y) {
        var tilex = Math.floor(x / 20);
        var tiley = Math.floor(y / 20);



        return {
            tile: map.tiles[tilex][tiley],
            x: tilex,
            y: tiley
        };  
        
    };
}());