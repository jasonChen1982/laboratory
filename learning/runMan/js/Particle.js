
// -------------------------- Particle -------------------------- //

function Particle( x, y ) {
  this.position = new Vector( x, y );
  this.previousPosition = new Vector( x, y );
}

Particle.prototype.update = function( friction, gravity ) {
  var velocity = Vector.subtract( this.position, this.previousPosition );
  // friction
  velocity.scale( friction );
  this.previousPosition.set( this.position );
  this.position.add( velocity );
  this.position.add( gravity );
};

// --------------------------  -------------------------- //

Particle.prototype.render = function( ctx ) {
  // big circle
  ctx.fillStyle = 'hsla(0, 0%, 10%, 0.5)';
  circle( ctx, this.position.x, this.position.y, 4 );
  // dot
  // ctx.fillStyle = 'hsla(0, 100%, 50%, 0.5)';
  // circle( this.position.x, this.position.y, 5  );
};

function circle( ctx, x, y, radius ) {
  ctx.beginPath();
  ctx.arc( x, y, radius, 0, Math.PI * 2 );
  ctx.fill();
  ctx.closePath();
}
