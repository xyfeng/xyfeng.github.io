// point is a data structure
// point.x: mouse X pos
// point.y: mouse Y pos

// lines is an array
var points; // points is an array of point
var numbers;

function preload() {
  numbers = [];
  for(var i=0; i<9; i++){
  	var fileName = (i+1) + ".json";
    numbers[i] = loadJSON(fileName);
  }
}

function setup() {
  createCanvas(600, 450);
  // frameRate(60);
  for (var n in numbers) {
    var lines = numbers[n];
  }
}

// redraw the drawing
function draw() {
  // clear the background
  background(255);

  for (var n in numbers) {
    var lines = numbers[n];
    var totalFrame = 300;//getLastFrame(lines);

    push();
    var posX = (n % 3) * 400;
    var posY = int(n / 3) * 300;
    scale(0.5);
    translate(posX, posY);
    // loop through all lines
    for (var l in lines) {
      var one_line = lines[l];
      // basicBrush(one_line, frameCount % totalFrame);
      // lineMeshBrush(one_line, frameCount % totalFrame);
      // triangleBrush(one_line, frameCount % totalFrame);
      markerBrush(one_line, frameCount % totalFrame);
    }
    pop();
  }
}

function basicBrush(path, frame) {
  strokeWeight(6);
  noFill();
  beginShape();
  for (var i in path) {
    var one_point = path[i];
    if (one_point.t > frame) {
      break;
    }
    curveVertex(one_point.x, one_point.y);
  }
  endShape();
}

function lineMeshBrush(path, frame) {
  if (path.length < 1) {
    return;
  }
  noFill();
  for (var i = 1; i < path.length; i++) {
    var pre_point = path[i - 1];
    var one_point = path[i];
    if (one_point.t > frame) {
      break;
    }
    strokeWeight(1);
    line(pre_point.x, pre_point.y, one_point.x, one_point.y);

    for (var j = 1; j < path.length; j++) {
      var another_point = path[j];
      var distance = dist(one_point.x, one_point.y, another_point.x, another_point.y);
      // Adjust the stroke weight according to the distance
      strokeWeight(1 / distance);

      // Draw a line from the current point to 
      // the other point if the distance is less than 25
      if (distance < 25 && j % 4 === 0) {
        line(one_point.x, one_point.y, another_point.x, another_point.y);
      }
    }
  }
}

function triangleBrush(path, frame) {
  if (path.length < 3) {
    return;
  }
  fill(0);
  strokeWeight(6);
  strokeJoin(ROUND);
  for (var i = 2; i < path.length; i++) {
    if (path[i].t > frame) {
      break;
    }
    triangle(path[i].x, path[i].y, path[i - 1].x, path[i - 1].y, path[i - 2].x, path[i - 2].y);
  }
}

function markerBrush(path, frame) {
  if (path.length < 1) {
    return;
  }
  strokeWeight(6);
  fill(0);
  var drawingPath = [];
  var prevPoint = createVector(path[0].x, path[0].y);
  drawingPath.push(prevPoint);
  for (var i = 1; i < path.length; i++) {
    var currPoint = createVector(path[i].x, path[i].y);
    if (path[i].t > frame) {
      break;
    }
    var delta = p5.Vector.sub(currPoint, prevPoint);
    var midPoint = p5.Vector.add(currPoint, prevPoint).div(2);
    var step = delta.div(10);
    step.rotate(0.75);
    var top = p5.Vector.add(midPoint, step);
    var bottom = p5.Vector.sub(midPoint, step);
    drawingPath.push(top);
    drawingPath.unshift(bottom);
    prevPoint = currPoint;
  }

  beginShape();
  for (var j = 0; j < drawingPath.length; j++) {
    curveVertex(drawingPath[j].x, drawingPath[j].y);
  }
  endShape(CLOSE);
}

function getLastFrame(lines) {
  if (lines.length > 0) {
    var last_line = lines[lines.length - 1];
    if (last_line.length > 0) {
      var last_point = last_line[last_line.length - 1];
      return int(last_point.t * 1.2);
    }
  }
  return 0;
}