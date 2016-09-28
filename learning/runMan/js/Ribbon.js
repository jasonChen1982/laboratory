function PinConstraint( particle, position ) {
  this.particle = particle;
  this.position = position;
}

PinConstraint.prototype.update = function() {
  this.particle.position.set( this.position );
};

PinConstraint.prototype.render = function() {};

// --------------------------  -------------------------- //

function ChainLinkConstraint( particleA, particleB, distance, shiftEase ) {
  this.particleA = particleA;
  this.particleB = particleB;
  this.distance = distance;
  this.distanceSqrd = distance * distance;
  this.shiftEase = shiftEase === undefined ? 0.85 : shiftEase;
}

// --------------------------  -------------------------- //

ChainLinkConstraint.prototype.update = function() {
  var delta = Vector.subtract( this.particleA.position, this.particleB.position );
  var deltaMagSqrd = delta.x * delta.x + delta.y * delta.y;

  if ( deltaMagSqrd <= this.distanceSqrd ) {
    return;
  }
  var newPosition = Vector.addDistance( this.particleA.position, this.distance, delta.angle + Math.PI );
  var shift = Vector.subtract( newPosition, this.particleB.position );
  shift.scale( this.shiftEase );
  this.particleB.previousPosition.add( shift );
  this.particleB.position.set( newPosition );
};

ChainLinkConstraint.prototype.render = function( ctx ) {
  ctx.strokeStyle = 'hsla(200, 100%, 50%, 0.5)';
  ctx.lineWidth = 2;
  line( ctx, this.particleA.position, this.particleB.position );
};

// --------------------------  -------------------------- //

function Ribbon( props ) {
  extend( this, props );

  // create particles

  this.particles = [];
  this.constraints = [];

  this.controlParticle = new Particle( this.controlPoint.x, this.controlPoint.y );
  var pin = new PinConstraint( this.controlParticle, this.controlPoint );
  this.constraints.push( pin );

  var x = this.controlPoint.x;
  for ( var i=0; i < this.sections; i++ ) {
    var y = this.controlPoint.y + this.sectionLength * i;
    var particle = new Particle( x, y );
    this.particles.push( particle );
    // create links
    var linkParticle = i === 0 ? this.controlParticle : this.particles[ i-1 ];
    var link = new ChainLinkConstraint( linkParticle, particle, this.sectionLength, this.chainLinkShiftEase );
    this.constraints.push( link );
  }
}

Ribbon.prototype.update = function() {
  var i, len;
  for ( i=0, len = this.particles.length; i < len; i++ ) {
    this.particles[i].update( this.friction, this.gravity );
  }

  for ( i=0, len = this.constraints.length; i < len; i++ ) {
    this.constraints[i].update();
  }
};

Ribbon.prototype.addBreeze = function( v ) {
  for ( var i=0, len = this.particles.length; i < len; i++ ) {
    this.particles[i].position.add( v );
  }
};

Ribbon.prototype.render = function( ctx ) {
  ctx.strokeStyle = '#B19';
  ctx.lineWidth = this.width;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo( this.controlParticle.x, this.controlParticle.y );
  for ( var i=0, len = this.particles.length; i < len; i++ ) {
    var particle = this.particles[i];
    ctx.lineTo( particle.position.x, particle.position.y );
  }
  ctx.stroke();
  ctx.closePath();
  ctx.lineWidth = 1;
};







// --------------------------  -------------------------- //
