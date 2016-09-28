function handleClick(cb) {
  debug = cb.checked;
}

var mouse = {
  x: 0,
  y: 0
};
canvas.addEventListener('mousemove', function(e) {
  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
}, false);

var utils = {
  randomInt: function(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  },
  randomRange: function(min, max) {
    return min + Math.random() * (max - min + 1);
  },
}
    colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
      '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
      '#FF5722'
    ];
colors2 = [
  '#e91e63', '#03a9f4'
];
function randomForce(value) {

  this.goal = 0;
  this.value = value;
  this.sens = null;

  this.calculerLeSens = function() {

    // regarder dans quel sens va la force + / -

    if (this.value < this.goal) {
      this.sens = "+";
    }
    if (this.value > this.goal) {
      this.sens = "-";
    }

  }
  this.display = function(x, y, value) {
    ctx.fillStyle="silver";
    ctx.textAlign = "left";
    ctx.font = "20px arial";
    ctx.fillText(value + " " + this.value.toFixed(2) + " goal "  +this.goal.toFixed(2), x, y);

  }

  this.update = function() {

    if (this.sens === null) {
      this.calculerLeSens();
    } else if (this.sens === "+") {

      this.value += .005;

      if (this.value > this.goal) {
        this.goal = utils.randomRange(-10, 10) / 50;
        this.sens = null;

      }

    } else if (this.sens === "-") {

      this.value -= .005;
      if (this.value < this.goal) {
        this.goal = utils.randomRange(-10, 10) / 50;
        this.sens = null;

      }

    }

  }

}

wind = new randomForce(.1);

function distance(p0, p1) {
  var dx = p1.x - p0.x,
    dy = p1.y - p0.y;
  return Math.sqrt(dx * dx + dy * dy);
}

canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
W = canvas.width = 500;
H = canvas.height = 500;

function point(x, y) {
  this.x = x;
  this.y = y;
  this.oldx = x;
  this.oldy = y;
}

function verlet(x, y) {

  this.x = x;
  this.y = y;

  this.points = [];
  this.sticks = [];
  this.bounce = 0.9;
  this.gravity = 0.9;
  this.wind = 0;
  this.antig = false;
  this.friction = 0.95;

  this.addPoint = function(x, y) {

    this.points.push(new point(x + this.x, y + this.y));

  }

  this.renderPoints = function() {
    for (var i = 0; i < this.points.length; i++) {
      var p = this.points[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  this.renderSticks = function() {
    ctx.beginPath();
    for (var i = 0; i < this.sticks.length; i++) {
      var s = this.sticks[i];
      ctx.moveTo(s.p0.x, s.p0.y);
      ctx.lineTo(s.p1.x, s.p1.y);
    }
    ctx.stroke();
  }

  this.updatePoints = function() {
    for (var i = 0; i < this.points.length; i++) {
      var p = this.points[i],
        vx = (p.x - p.oldx) * this.friction;
      vy = (p.y - p.oldy) * this.friction;
      if (!p.pinned) {
        p.oldx = p.x;
        p.oldy = p.y;
        p.x += vx;
        p.y += vy;

        if (p.antig) {

          p.y -= this.gravity * p.antig[1];

        } else {
          p.y += this.gravity;

        }
        p.x += wind.value;
        var vx = (p.x - p.oldx) * this.friction,
          vy = (p.y - p.oldy) * this.friction;

        if (p.x > W) {
          p.x = W;
          p.oldx = p.x + vx * this.bounce;
        } else if (p.x < 0) {
          p.x = 0;
        }
        if (p.y > H) {
          p.y = H;
        } else if (p.y < 0) {
          p.y = 0;
        }

      }
    }
  }

  this.updateSticks = function() {
    for (var i = 0; i < this.sticks.length; i++) {
      var s = this.sticks[i],
        dx = s.p1.x - s.p0.x,
        dy = s.p1.y - s.p0.y,
        distance = Math.sqrt(dx * dx + dy * dy),
        difference = s.length - distance,
        percent = difference / distance / 1.5,
        offsetX = dx * percent,
        offsetY = dy * percent;

      if (!s.p0.pinned) {
        s.p0.x -= offsetX;
        s.p0.y -= offsetY;
      }
      if (!s.p1.pinned) {
        s.p1.x += offsetX;
        s.p1.y += offsetY;
      }
    }
  }

}

verlet.prototype.calcul = function() {

  this.updatePoints();
  for (var i = 0; i < 2; i++) {
    this.updateSticks();
  }

}

verlet.prototype.draw = function() {

  this.renderSticks();
  this.renderPoints();

}

function corde(x, y, [longueur, ecart]) {
  this.color = colors[utils.randomInt(0, colors.length - 1)];
  this.body = new verlet(x, y);
  this.points = [];
  this.width = 4;
  this.longueur = longueur;

  // créer les points de la corde

  for (var i = 0; i < longueur; i++) {
    this.body.addPoint(0, i * ecart);
  }
  this.body.points[0].pinned = true;

  for (var i = 0; i < longueur - 1; i++) {
    this.body.sticks.push({
      p0: this.body.points[0 + i],
      p1: this.body.points[1 + i],
      length: distance(this.body.points[0 + i], this.body.points[1 + i])
    });
  }

  this.body.points[this.body.points.length - 1].antig = [true, this.longueur];

  this.getPoints = function() {

    this.points = this.body.points;

  }

}

var debug = false;

corde.prototype.draw = function() {
  this.body.calcul();
  this.getPoints();

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "silver";
  ctx.fillStyle = this.color;
  ctx.lineCap = "round";
  ctx.beginPath();

  ctx.moveTo(this.points[0].x, this.points[0].y);
  for (i = 1; i < this.longueur - 2; i++) {
    var xc = (this.points[i].x + this.points[i + 1].x) / 2;
    var yc = (this.points[i].y + this.points[i + 1].y) / 2;
    ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
  }
  ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y);
  ctx.stroke();

  ctx.globalAlpha = .9;
  ctx.beginPath();
  ctx.arc(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y, 30, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
  ctx.globalAlpha = 1;

  if (debug) {

    ctx.lineWidth = 1;

    ctx.strokeStyle = "#222";

    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (i = 1; i < this.longueur - 1; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }

    ctx.lineTo(this.points[i].x, this.points[i].y);
    ctx.stroke();

    ctx.fillStyle = "silver";

    for (var i = 0; i < this.longueur; i++) {
      ctx.beginPath();
      ctx.arc(this.points[i].x, this.points[i].y, 1, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();

    }
    ctx.fillStyle = "#222";

  }

}
stockCorde = [];

for (var i = 0; i < 10; i++) {
  stockCorde.push(new corde(W - 150, H - 50, [utils.randomInt(5, 20), 20]));
}
for (var i = 0; i < 2; i++) {
  stockCorde.push(new corde(150, H - 50, [utils.randomInt(5, 20), 20]));
}

function addBalloon() {

  stockCorde.push(new corde(W - 150, H - 50, [utils.randomInt(5, 20), 20]));

}

function deleteBalloon() {
  if (stockCorde.length > 1) {

    stockCorde.splice(0, 1);

  }

}

function release() {

  for (var i = 0; i < stockCorde.length; i++) {
    stockCorde[i].body.points[0].pinned = false;

  }

}

var followAll = false;

function followMouse() {
  
if(followAll){
  followAll = false;
}else{
  followAll = true;
}
  
}


this.collision = function(p1, p2) {

  var dist,
    dx = p1.body.points[p1.body.points.length - 1].x - p2.body.points[p2.body.points.length - 1].x;
  dy = p1.body.points[p1.body.points.length - 1].y - p2.body.points[p2.body.points.length - 1].y;
  dist = Math.sqrt(dx * dx + dy * dy);
  p1.radius = 30;
  p2.radius = 30;

  l = p1.radius + p2.radius;

  if (dist < l) {
    f = (1 - dist / l) * this.radius * 2;
    t = Math.atan2(dy, dx);
    p2.body.points[p2.body.points.length - 1].oldx += Math.cos(t) * 1;
    p2.body.points[p2.body.points.length - 1].oldy += Math.sin(t) * 1;
  }

}

update();

function update() {
  ctx.clearRect(0, 0, W, H);

  for (var i = 0; i < stockCorde.length; i++) {
    stockCorde[i].draw();
    var p = stockCorde[i];

    for (var j = i + 1; j < stockCorde.length; j++) {
      var p2 = stockCorde[j];
      collision(p, p2);
    }

  }

  if (mouse.x) {
    
    if(followAll){
  for (var i = 0; i < stockCorde.length; i++) {
    stockCorde[i].body.points[0].x = mouse.x;
    stockCorde[i].body.points[0].y = mouse.y; 
  }
      
    }else{
    stockCorde[0].body.points[0].x = mouse.x;
    stockCorde[0].body.points[0].y = mouse.y; 
      
    }
    

    
    
    
  }
  
  
  wind.update();
  wind.display(20,30,"wind");
  
  
  requestAnimationFrame(update);
}