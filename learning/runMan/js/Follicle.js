
function SpringAngleConstraint( particleA, particleB, strength, angle ) {
  this.particleA = particleA;
  this.particleB = particleB;
  this.strength = strength;
  if ( angle === undefined ) {
    var delta = Vector.subtract( particleB.position, particleA.position );
    this.angle = delta.angle;
  } else {
    this.angle = angle;
  }
}

SpringAngleConstraint.prototype.update = function() {
  var positionA = this.particleA.position;
  var positionB = this.particleB.position;
  var delta = Vector.subtract( positionB, positionA );
  var deltaAngle = delta.angle;
  var angleDiff = normalizeAngle( this.angle - deltaAngle );
  angleDiff = angleDiff > Math.PI ? angleDiff - Math.PI * 2 : angleDiff;
  var springAngle = deltaAngle + Math.PI / 2;
  var springForce = new Vector( Math.cos( springAngle ), Math.sin( springAngle ) );
  springForce.scale( angleDiff * this.strength * Math.PI * 2 );
  this.particleB.position.add( springForce );
};

SpringAngleConstraint.prototype.render = function( ctx ) {
  var end = Vector.addDistance( this.particleA.position, 50, this.angle );
  ctx.strokeStyle = 'hsla(0, 0%, 50%, 0.5)';
  line( ctx, this.particleA.position, end );
};




// --------------------------  -------------------------- //

function StickConstraint( particleA, particleB, distance ) {
  this.particleA = particleA;
  this.particleB = particleB;
  if ( distance ) {
    this.distance = distance;
  } else {
    var delta = Vector.subtract( particleA.position, particleB.position );
    this.distance = delta.magnitude;
  }

  this.distanceSqrd = this.distance * this.distance;
}

StickConstraint.prototype.update = function() {
  var delta = Vector.subtract( this.particleA.position, this.particleB.position );
  var mag = delta.magnitude;
  var scale = ( this.distance - mag ) / mag * 0.5;
  delta.scale( scale );
  this.particleA.position.add( delta );
  this.particleB.position.subtract( delta );
};

StickConstraint.prototype.render = function( ctx ) {
  ctx.strokeStyle = 'hsla(200, 100%, 50%, 0.5)';
  ctx.lineWidth = 2;
  line( ctx, this.particleA.position, this.particleB.position );
};



// --------------------------  -------------------------- //


// x, y
// angle
// springStrength
// curl
// segmentLength
// friction
// gravity
// movementStrength
function Follicle( props ) {
  extend( this, props );
  delete this.x;
  delete this.y;
  this.particleA = new Particle( props.x, props.y );
  var positionB = Vector.addDistance( this.particleA.position, this.segmentLength, this.angle );
  this.particleB = new Particle( positionB.x, positionB.y );
  this.stick0 = new StickConstraint( this.particleA, this.particleB );
  this.springAngle0 = new SpringAngleConstraint( this.particleA, this.particleB, this.springStrength, this.angle );

  var angle1 = this.angle + this.curl;
  var positionC =  Vector.addDistance( this.particleB.position, this.segmentLength, angle1 );
  this.particleC = new Particle( positionC.x, positionC.y );
  this.stick1 = new StickConstraint( this.particleB, this.particleC );
  this.springAngle1 = new SpringAngleConstraint( this.particleB, this.particleC, this.springStrength, angle1 );

  this.controlPoint = new Vector( props.x, props.y );
  this.pin = new PinConstraint( this.particleA, this.controlPoint );
}

Follicle.prototype.update = function() {
  this.particleA.update( this.friction, this.gravity );
  this.particleB.update( this.friction, this.gravity );
  this.particleC.update( this.friction, this.gravity );
  this.stick0.update();
  this.springAngle0.update();
  // update springAngle1's angle
  var delta = Vector.subtract( this.particleB.position, this.particleA.position );
  this.springAngle1.angle = delta.angle + this.curl;

  this.pin.update();
  this.stick1.update();
  this.springAngle1.update();
};

Follicle.prototype.move = function( movement ) {
  movement = Vector.copy( movement );
  this.controlPoint.add( movement );
  movement.x *= this.movementStrength.x;
  movement.y *= this.movementStrength.y;
  // movement.scale( this.movementStrength );
  this.particleB.position.add( movement );
  this.particleC.position.add( movement );
  this.particleB.previousPosition.add( movement );
  this.particleC.previousPosition.add( movement );
};

Follicle.prototype.render = function( ctx ) {

  ctx.lineWidth = 46;
  // ctx.strokeStyle = 'hsla(0, 100%, 50%, 0.4)';
  ctx.strokeStyle = '#433';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo( this.particleA.position.x, this.particleA.position.y );
  ctx.quadraticCurveTo( this.particleB.position.x, this.particleB.position.y,
    this.particleC.position.x, this.particleC.position.y );
  ctx.stroke();
  ctx.closePath();
  // reset line props
  ctx.lineCap = 'butt';
  ctx.lineWidth = 1;

};
