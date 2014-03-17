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