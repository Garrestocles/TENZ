(function () {
	"use strict";
    var RIGHT_KEY_CODE = 68;
    var LEFT_KEY_CODE = 65;
    var UP_KEY_CODE = 87;
    var DOWN_KEY_CODE = 83;
    //var	KEYCODE_LEFT = 37; //left arrow
    //var	KEYCODE_RIGHT = 39; //right arrow

    function MapObj() {
        this.container = new createjs.Container();
        this.width = 2000;
        this.height = 1000;
        this.container.x = this.container.y = 0;
        this.tileSize = 20;

        this.tiles = new Array(this.width / this.tileSize); //currently 100
        for (var i = 0; i <= this.width / this.tileSize; i++)
        this.tiles[i] = new Array(this.height / this.tileSize); //currently 50


    }
    var map = new MapObj();

    var tileObjs = {
        floor: function () {
            this.name = "floor";
            this.isPassable = true;
            this.image = new createjs.Bitmap("sprite_sheets/floor.png");
        },
        wall: function () {
            this.name = "wall";
            this.isPassable = false;
            this.image = new createjs.Bitmap("sprite_sheets/wall.png");
        },
        blank: function () {
            this.name = "thevoid";
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

        var currentTile = function (x, y) {
            var tilex = Math.round(x / 20);
            var tiley = Math.round(y / 20);


              return {
                    tile: map.tiles[tilex][tiley],
                    x: tilex,
                    y: tiley
                };  
            
        };

        this.update = function () {
            var prevX = this.sprite.x;
            var prevY = this.sprite.y;
            if (this.keysPressed[RIGHT_KEY_CODE]) this.sprite.x += 2;
            if (this.keysPressed[LEFT_KEY_CODE]) this.sprite.x -= 2;
            if (this.keysPressed[UP_KEY_CODE]) this.sprite.y -= 2;
            if (this.keysPressed[DOWN_KEY_CODE]) this.sprite.y += 2;
            if (currentTile(this.sprite.x, this.sprite.y).tile !== undefined)
            if (!currentTile(this.sprite.x, this.sprite.y).tile.isPassable) {
                this.sprite.x = prevX;
                this.sprite.y = prevY;
            }
        };
    }
    Actor.prototype = new GameObject();
    Player.prototype = new Actor();

    document.addEventListener('DOMContentLoaded', function () {
        game();
    });

    function game() {

        var stage = new createjs.Stage("gamewindow");

        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener('tick', tick);

        var VIEW_WIDTH = parseInt(document.getElementById("gamewindow").getAttributeNode("width").value);
        var VIEW_HEIGHT = parseInt(document.getElementById("gamewindow").getAttributeNode("height").value);

        buildmaparray();
        buildmap();

        var player = new Player();

        map.container.addChild(player.sprite);

        document.addEventListener('keydown', keyDown, false);
        document.addEventListener('keyup', keyUp, false);

        stage.addChild(map.container);

        function buildmaparray() {

            //Draw a room
            function getRandomInt(min, max) {
              return Math.floor(Math.random() * (max - min + 1) + min);
            }

            var roomTLCornerX = getRandomInt(0,map.tiles.length-75);
            var roomTLCornerY = getRandomInt(0,map.tiles[0].length-30);
            var maxWidth, maxHeight;

            if(roomTLCornerX > map.tiles.length - 25){
                maxWidth = map.tiles.length - roomTLCornerX;
            } else maxWidth = 25;
            if(roomTLCornerY > map.tiles[0].length - 25){
                maxHeight = map.tiles[0].length - roomTLCornerY;
            } else maxHeight = 25;

            var roomWidth = getRandomInt(5,maxWidth);
            var roomHeight = getRandomInt(5,maxHeight);

            console.log("roomTLCornerX: "+roomTLCornerX + " roomTLCornerY: " + roomTLCornerY +" width: "+ roomWidth + " height " + roomHeight);

            for(var x = 0; x < map.tiles.length; x++){
                for (var y = 0; y < map.tiles[x].length; y++){
                    if (x >= roomTLCornerX && x <= roomTLCornerX + roomWidth && y >= roomTLCornerY && y <= roomTLCornerY + roomHeight ){
                        console.log("Outer IF X: " + x + " Y: " + y);
                        if ( x == roomTLCornerX || x == roomTLCornerX + roomWidth || y == roomTLCornerY || y == roomTLCornerY + roomHeight ){
                            console.log("Inner IF X: " + x + " Y: " + y);
                            map.tiles[x][y] = new tileObjs.wall();
                        }else map.tiles[x][y] = new tileObjs.floor();
                    }else map.tiles[x][y] = undefined;
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

        function tick(event) {

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
}());