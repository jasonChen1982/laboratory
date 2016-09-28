
// ----- utils ----- //

// extends objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

function modulo( num, div ) {
  return ( ( num % div ) + div ) % div;
}

function normalizeAngle( angle ) {
  return modulo( angle, Math.PI * 2 );
}

function getDegrees( angle ) {
  return angle * ( 180 / Math.PI );
}

// --------------------------  -------------------------- //

var TAU = Math.PI * 2;
var PI = Math.PI;


// --------------------------  -------------------------- //

function line( ctx, a, b ) {
  ctx.beginPath();
  ctx.moveTo( a.x, a.y );
  ctx.lineTo( b.x, b.y );
  ctx.stroke();
  ctx.closePath();
}

function dot( ctx, v ) {
  ctx.beginPath();
  ctx.arc( v.x, v.y, 5, 0, Math.PI * 2 );
  ctx.fill();
  ctx.closePath();
}

function fillCircle( ctx, v, radius ) {
  ctx.beginPath();
  ctx.arc( v.x, v.y, radius, 0, TAU );
  ctx.fill();
  ctx.closePath();
}


// -------------------------- vector -------------------------- //

function Vector( x, y ) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector.prototype.set = function( v ) {
  this.x = v.x;
  this.y = v.y;
};

Vector.prototype.setCoords = function( x, y ) {
  this.x = x;
  this.y = y;
}

Vector.prototype.add = function( v ) {
  this.x += v.x;
  this.y += v.y;
};

Vector.prototype.subtract = function( v ) {
  this.x -= v.x;
  this.y -= v.y;
};

Vector.prototype.scale = function( s )  {
  this.x *= s;
  this.y *= s;
};

Vector.prototype.multiply = function( v ) {
  this.x *= v.x;
  this.y *= v.y;
};

// custom getter whaaaaaaat
Object.defineProperty( Vector.prototype, 'magnitude', {
  get: function() {
    return Math.sqrt( this.x * this.x  + this.y * this.y );
  }
});

Vector.prototype.equals = function ( v ) {
  return this.x == v.x && this.y == v.y;
};

Vector.prototype.zero = function() {
  this.x = 0;
  this.y = 0;
};

Vector.prototype.block = function( size ) {
  this.x = Math.floor( this.x / size );
  this.y = Math.floor( this.y / size );
};

Object.defineProperty( Vector.prototype, 'angle', {
  get: function() {
    return normalizeAngle( Math.atan2( this.y, this.x ) );
  }
});

// ----- class functions ----- //
// return new vectors

Vector.subtract = function( a, b ) {
  return new Vector( a.x - b.x, a.y - b.y );
};

Vector.add = function( a, b ) {
  return new Vector( a.x + b.x, a.y + b.y );
};

Vector.copy = function( v ) {
  return new Vector( v.x, v.y );
};

Vector.isSame = function( a, b ) {
  return a.x == b.x && a.y == b.y;
};

Vector.getDistance = function( a, b ) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt( dx * dx + dy * dy );
};

Vector.addDistance = function( vector, distance, angle ) {
  var x = vector.x + Math.cos( angle ) * distance;
  var y = vector.y + Math.sin( angle ) * distance;
  return new Vector( x, y );
};

// --------------------------  -------------------------- //
