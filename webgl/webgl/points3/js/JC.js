(function(root){
	root.JC = root.JC||{};

	JC.log = function() { console.log.apply( console, arguments ); }
	JC.warn = function() { console.warn.apply( console, arguments ); }
	JC.error = function() { console.error.apply( console, arguments ); }

	JC.Math = {
		generateUUID: function () {
			// http://www.broofa.com/Tools/Math.uuid.htm
			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
			var uuid = new Array( 36 );
			var rnd = 0, r;
			return function () {
				for ( var i = 0; i < 36; i ++ ) {
					if ( i == 8 || i == 13 || i == 18 || i == 23 ) {
						uuid[ i ] = '-';
					} else if ( i == 14 ) {
						uuid[ i ] = '4';
					} else {
						if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
						r = rnd & 0xf;
						rnd = rnd >> 4;
						uuid[ i ] = chars[ ( i == 19 ) ? ( r & 0x3 ) | 0x8 : r ];
					}
				}
				return uuid.join( '' );
			};
		}(),
		clamp: function ( x, a, b ) {
			return ( x < a ) ? a : ( ( x > b ) ? b : x );
		},
		clampBottom: function ( x, a ) {
			return x < a ? a : x;
		},
		// Linear mapping from range <a1, a2> to range <b1, b2>
		mapLinear: function ( x, a1, a2, b1, b2 ) {
			return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );
		},
		smoothstep: function ( x, min, max ) {
			if ( x <= min ) return 0;
			if ( x >= max ) return 1;
			x = ( x - min ) / ( max - min );
			return x * x * ( 3 - 2 * x );
		},
		smootherstep: function ( x, min, max ) {
			if ( x <= min ) return 0;
			if ( x >= max ) return 1;
			x = ( x - min ) / ( max - min );
			return x * x * x * ( x * ( x * 6 - 15 ) + 10 );
		},
		// Random float from <0, 1> with 16 bits of randomness
		// (standard Math.random() creates repetitive patterns when applied over larger space)
		random16: function () {
			return ( 65280 * Math.random() + 255 * Math.random() ) / 65535;
		},
		// Random integer from <low, high> interval
		randInt: function ( low, high ) {
			return Math.floor( this.randFloat( low, high ) );
		},
		// Random float from <low, high> interval
		randFloat: function ( low, high ) {
			return low + Math.random() * ( high - low );
		},
		// Random float from <-range/2, range/2> interval
		randFloatSpread: function ( range ) {
			return range * ( 0.5 - Math.random() );
		},
		degToRad: function () {
			var degreeToRadiansFactor = Math.PI / 180;
			return function ( degrees ) {
				return degrees * degreeToRadiansFactor;
			};
		}(),
		radToDeg: function () {
			var radianToDegreesFactor = 180 / Math.PI;
			return function ( radians ) {
				return radians * radianToDegreesFactor;
			};
		}(),
		isPowerOfTwo: function ( value ) {
			return ( value & ( value - 1 ) ) === 0 && value !== 0;
		},
		nextPowerOfTwo: function ( value ) {
			value --;
			value |= value >> 1;
			value |= value >> 2;
			value |= value >> 4;
			value |= value >> 8;
			value |= value >> 16;
			value ++;
			return value;
		}
	};
	JC.MatrixOperation = {
		create: function(){
			return new Float32Array([
					1.0, 0.0, 0.0, 0.0,
					0.0, 1.0, 0.0, 0.0,
					0.0, 0.0, 1.0, 0.0,
					0.0, 0.0, 0.0, 1.0
				]);
		},
		identity: function(dest){
			dest[0]  = 1; dest[1]  = 0; dest[2]  = 0; dest[3]  = 0;
			dest[4]  = 0; dest[5]  = 1; dest[6]  = 0; dest[7]  = 0;
			dest[8]  = 0; dest[9]  = 0; dest[10] = 1; dest[11] = 0;
			dest[12] = 0; dest[13] = 0; dest[14] = 0; dest[15] = 1;
			return dest;
		},
		multiply: function(mat1, mat2, dest){
			var a = mat1[0],  b = mat1[1],  c = mat1[2],  d = mat1[3],
				e = mat1[4],  f = mat1[5],  g = mat1[6],  h = mat1[7],
				i = mat1[8],  j = mat1[9],  k = mat1[10], l = mat1[11],
				m = mat1[12], n = mat1[13], o = mat1[14], p = mat1[15],

				A = mat2[0],  B = mat2[1],  C = mat2[2],  D = mat2[3],
				E = mat2[4],  F = mat2[5],  G = mat2[6],  H = mat2[7],
				I = mat2[8],  J = mat2[9],  K = mat2[10], L = mat2[11],
				M = mat2[12], N = mat2[13], O = mat2[14], P = mat2[15];

			dest[0] = A * a + B * e + C * i + D * m;
			dest[1] = A * b + B * f + C * j + D * n;
			dest[2] = A * c + B * g + C * k + D * o;
			dest[3] = A * d + B * h + C * l + D * p;
			dest[4] = E * a + F * e + G * i + H * m;
			dest[5] = E * b + F * f + G * j + H * n;
			dest[6] = E * c + F * g + G * k + H * o;
			dest[7] = E * d + F * h + G * l + H * p;
			dest[8] = I * a + J * e + K * i + L * m;
			dest[9] = I * b + J * f + K * j + L * n;
			dest[10] = I * c + J * g + K * k + L * o;
			dest[11] = I * d + J * h + K * l + L * p;
			dest[12] = M * a + N * e + O * i + P * m;
			dest[13] = M * b + N * f + O * j + P * n;
			dest[14] = M * c + N * g + O * k + P * o;
			dest[15] = M * d + N * h + O * l + P * p;
			return dest;
		},
		scale: function(mat, vec, dest){
			dest[0]  = mat[0]  * vec[0];
			dest[1]  = mat[1]  * vec[0];
			dest[2]  = mat[2]  * vec[0];
			dest[3]  = mat[3]  * vec[0];
			dest[4]  = mat[4]  * vec[1];
			dest[5]  = mat[5]  * vec[1];
			dest[6]  = mat[6]  * vec[1];
			dest[7]  = mat[7]  * vec[1];
			dest[8]  = mat[8]  * vec[2];
			dest[9]  = mat[9]  * vec[2];
			dest[10] = mat[10] * vec[2];
			dest[11] = mat[11] * vec[2];
			dest[12] = mat[12];
			dest[13] = mat[13];
			dest[14] = mat[14];
			dest[15] = mat[15];
			return dest;
		},
		translate: function(mat, vec, dest){
			dest[0] = mat[0]; dest[1] = mat[1]; dest[2]  = mat[2];  dest[3]  = mat[3];
			dest[4] = mat[4]; dest[5] = mat[5]; dest[6]  = mat[6];  dest[7]  = mat[7];
			dest[8] = mat[8]; dest[9] = mat[9]; dest[10] = mat[10]; dest[11] = mat[11];
			dest[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8]  * vec[2] + mat[12];
			dest[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9]  * vec[2] + mat[13];
			dest[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
			dest[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
			return dest;
		},
		rotate: function(mat, angle, axis, dest){
			var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
			if(!sq){return null;}
			var a = axis[0], b = axis[1], c = axis[2];
			if(sq != 1){sq = 1 / sq; a *= sq; b *= sq; c *= sq;}
			var d = Math.sin(angle), e = Math.cos(angle), f = 1 - e,
				g = mat[0],  h = mat[1], i = mat[2],  j = mat[3],
				k = mat[4],  l = mat[5], m = mat[6],  n = mat[7],
				o = mat[8],  p = mat[9], q = mat[10], r = mat[11],
				s = a * a * f + e,
				t = b * a * f + c * d,
				u = c * a * f - b * d,
				v = a * b * f - c * d,
				w = b * b * f + e,
				x = c * b * f + a * d,
				y = a * c * f + b * d,
				z = b * c * f - a * d,
				A = c * c * f + e;
			if(angle){
				if(mat != dest){
					dest[12] = mat[12]; dest[13] = mat[13];
					dest[14] = mat[14]; dest[15] = mat[15];
				}
			} else {
				dest = mat;
			}
			dest[0] = g * s + k * t + o * u;
			dest[1] = h * s + l * t + p * u;
			dest[2] = i * s + m * t + q * u;
			dest[3] = j * s + n * t + r * u;
			dest[4] = g * v + k * w + o * x;
			dest[5] = h * v + l * w + p * x;
			dest[6] = i * v + m * w + q * x;
			dest[7] = j * v + n * w + r * x;
			dest[8] = g * y + k * z + o * A;
			dest[9] = h * y + l * z + p * A;
			dest[10] = i * y + m * z + q * A;
			dest[11] = j * y + n * z + r * A;
			return dest;
		},
		lookAt: function(eye, center, up, dest){
			var eyeX    = eye[0],    eyeY    = eye[1],    eyeZ    = eye[2],
				upX     = up[0],     upY     = up[1],     upZ     = up[2],
				centerX = center[0], centerY = center[1], centerZ = center[2];
			if(eyeX == centerX && eyeY == centerY && eyeZ == centerZ){return this.identity(dest);}
			var x0, x1, x2, y0, y1, y2, z0, z1, z2, l;
			z0 = eyeX - center[0]; z1 = eyeY - center[1]; z2 = eyeZ - center[2];
			l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
			z0 *= l; z1 *= l; z2 *= l;
			x0 = upY * z2 - upZ * z1;
			x1 = upZ * z0 - upX * z2;
			x2 = upX * z1 - upY * z0;
			l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
			if(!l){
				x0 = 0; x1 = 0; x2 = 0;
			} else {
				l = 1 / l;
				x0 *= l; x1 *= l; x2 *= l;
			}
			y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0;
			l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
			if(!l){
				y0 = 0; y1 = 0; y2 = 0;
			} else {
				l = 1 / l;
				y0 *= l; y1 *= l; y2 *= l;
			}
			dest[0] = x0; dest[1] = y0; dest[2]  = z0; dest[3]  = 0;
			dest[4] = x1; dest[5] = y1; dest[6]  = z1; dest[7]  = 0;
			dest[8] = x2; dest[9] = y2; dest[10] = z2; dest[11] = 0;
			dest[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
			dest[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
			dest[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
			dest[15] = 1;
			return dest;
		},
		perspective: function(fovy, aspect, near, far, dest){
			var t = near * Math.tan(fovy * Math.PI / 360);
			var r = t * aspect;
			var a = r * 2, b = t * 2, c = far - near;
			dest[0] = near * 2 / a;
			dest[1] = 0;
			dest[2] = 0;
			dest[3] = 0;
			dest[4] = 0;
			dest[5] = near * 2 / b;
			dest[6] = 0;
			dest[7] = 0;
			dest[8] = 0;
			dest[9] = 0;
			dest[10] = -(far + near) / c;
			dest[11] = -1;
			dest[12] = 0;
			dest[13] = 0;
			dest[14] = -(far * near * 2) / c;
			dest[15] = 0;
			return dest;
		},
		transpose: function(mat, dest){
			dest[0]  = mat[0];  dest[1]  = mat[4];
			dest[2]  = mat[8];  dest[3]  = mat[12];
			dest[4]  = mat[1];  dest[5]  = mat[5];
			dest[6]  = mat[9];  dest[7]  = mat[13];
			dest[8]  = mat[2];  dest[9]  = mat[6];
			dest[10] = mat[10]; dest[11] = mat[14];
			dest[12] = mat[3];  dest[13] = mat[7];
			dest[14] = mat[11]; dest[15] = mat[15];
			return dest;
		},
		inverse: function(mat, dest){
			var a = mat[0],  b = mat[1],  c = mat[2],  d = mat[3],
				e = mat[4],  f = mat[5],  g = mat[6],  h = mat[7],
				i = mat[8],  j = mat[9],  k = mat[10], l = mat[11],
				m = mat[12], n = mat[13], o = mat[14], p = mat[15],
				q = a * f - b * e, r = a * g - c * e,
				s = a * h - d * e, t = b * g - c * f,
				u = b * h - d * f, v = c * h - d * g,
				w = i * n - j * m, x = i * o - k * m,
				y = i * p - l * m, z = j * o - k * n,
				A = j * p - l * n, B = k * p - l * o,
				ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
			dest[0]  = ( f * B - g * A + h * z) * ivd;
			dest[1]  = (-b * B + c * A - d * z) * ivd;
			dest[2]  = ( n * v - o * u + p * t) * ivd;
			dest[3]  = (-j * v + k * u - l * t) * ivd;
			dest[4]  = (-e * B + g * y - h * x) * ivd;
			dest[5]  = ( a * B - c * y + d * x) * ivd;
			dest[6]  = (-m * v + o * s - p * r) * ivd;
			dest[7]  = ( i * v - k * s + l * r) * ivd;
			dest[8]  = ( e * A - f * y + h * w) * ivd;
			dest[9]  = (-a * A + b * y - d * w) * ivd;
			dest[10] = ( m * u - n * s + p * q) * ivd;
			dest[11] = (-i * u + j * s - l * q) * ivd;
			dest[12] = (-e * z + f * x - g * w) * ivd;
			dest[13] = ( a * z - b * x + c * w) * ivd;
			dest[14] = (-m * t + n * r - o * q) * ivd;
			dest[15] = ( i * t - j * r + k * q) * ivd;
			return dest;
		}
	};
	JC.MO = JC.MatrixOperation;


	JC.Vector3 = function( x,y,z ){
		this.x = x || 0.0;
		this.y = y || 0.0;
		this.z = z || 0.0;
	};
	JC.Vector3.prototype = {
		constructor: JC.Vector3,
		set: function ( x, y, z ) {
			this.x = x || this.x;
			this.y = y || this.y;
			this.z = z || this.z;
			return this;
		},
		setX: function ( x ) {
			this.x = x;
			return this;
		},
		setY: function ( y ) {
			this.y = y;
			return this;
		},
		setZ: function ( z ) {
			this.z = z;
			return this;
		}
	};

	JC.Color = function ( color ){
		if ( arguments.length === 3 ) {
			return this.setRGB( arguments[ 0 ], arguments[ 1 ], arguments[ 2 ] );
		}
		return this.set( color );
	};
	JC.Color.prototype = {
		constructor: JC.Color,
		setRGB: function ( r, g, b ) {
			this.r = r;
			this.g = g;
			this.b = b;
			return this;
		},
		set: function ( value ) {
			if ( value instanceof JC.Color ) {
				this.copy( value );
			} else if ( typeof value === 'number' ) {
				this.setHex( value );
			} else if ( typeof value === 'string' ) {
				this.setStyle( value );
			}
			return this;
		},
		setHex: function ( hex ) {
			hex = Math.floor( hex );
			this.r = ( hex >> 16 & 255 ) / 255;
			this.g = ( hex >> 8 & 255 ) / 255;
			this.b = ( hex & 255 ) / 255;
			return this;
		},
		setHSL: function ( h, s, l ) {
			if ( s === 0 ) {
				this.r = this.g = this.b = l;
			} else {
				var hue2rgb = function ( p, q, t ) {
					if ( t < 0 ) t += 1;
					if ( t > 1 ) t -= 1;
					if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
					if ( t < 1 / 2 ) return q;
					if ( t < 2 / 3 ) return p + ( q - p ) * 6 * ( 2 / 3 - t );
					return p;
				};
				var p = l <= 0.5 ? l * ( 1 + s ) : l + s - ( l * s );
				var q = ( 2 * l ) - p;
				this.r = hue2rgb( q, p, h + 1 / 3 );
				this.g = hue2rgb( q, p, h );
				this.b = hue2rgb( q, p, h - 1 / 3 );
			}
			return this;
		},
		setStyle: function ( style ) {
			if ( /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.test( style ) ) {
				var color = /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.exec( style );
				this.r = Math.min( 255, parseInt( color[ 1 ], 10 ) ) / 255;
				this.g = Math.min( 255, parseInt( color[ 2 ], 10 ) ) / 255;
				this.b = Math.min( 255, parseInt( color[ 3 ], 10 ) ) / 255;
				return this;
			}
			if ( /^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.test( style ) ) {
				var color = /^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.exec( style );
				this.r = Math.min( 100, parseInt( color[ 1 ], 10 ) ) / 100;
				this.g = Math.min( 100, parseInt( color[ 2 ], 10 ) ) / 100;
				this.b = Math.min( 100, parseInt( color[ 3 ], 10 ) ) / 100;
				return this;
			}
			if ( /^\#([0-9a-f]{6})$/i.test( style ) ) {
				var color = /^\#([0-9a-f]{6})$/i.exec( style );
				this.setHex( parseInt( color[ 1 ], 16 ) );
				return this;
			}
			if ( /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test( style ) ) {
				var color = /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec( style );
				this.setHex( parseInt( color[ 1 ] + color[ 1 ] + color[ 2 ] + color[ 2 ] + color[ 3 ] + color[ 3 ], 16 ) );
				return this;
			}
		},
		getRGBA: function ( alpha ) {
			var a = alpha || 0.0;
			this.r = r;
			this.g = g;
			this.b = b;
			return [this.r,this.g,this.b,a];
		}
	};

	JC.Object3D = function (){
		this.uuid = JC.Math.generateUUID();
		this.translate = new JC.Vector3();
		this.position = new JC.Vector3();
		this.rotate = new JC.Vector3();
		this.rotateW = new JC.Vector3();
		this.scale = new JC.Vector3();
		this.PRGID = '';

		this.matrix = JC.MO.create();
	};
	JC.Object3D.prototype.updateMatrix = function(){
		this.UPRotate();    // 设置自身旋转
		this.UPTranslate(); // 设置偏移量
		this.UPRotate(true);    // 设置绕中心的旋转
		this.UPPosition(true);  // 设置世界坐标位置
		this.UPScale();     // 设置物体缩放
	};
	JC.Object3D.prototype.UPRotate = function(isW){
		var xR = JC.Math.degToRad(isW?this.rotateW.x:this.rotate.x),
			yR = JC.Math.degToRad(isW?this.rotateW.y:this.rotate.y),
			zR = JC.Math.degToRad(isW?this.rotateW.z:this.rotate.z);
		var MX = new Float32Array( [
							1.0, 0.0         , 0.0         , 0.0,
							0.0, Math.cos(xR), Math.sin(xR), 0.0,
							0.0,-Math.sin(xR), Math.cos(xR), 0.0,
							0.0, 0.0         , 0.0         , 1.0
						] );
		var MY = new Float32Array( [
							Math.cos(yR), 0.0, Math.sin(yR), 0.0,
							0.0         , 1.0, 0.0         , 0.0,
						   -Math.sin(yR), 0.0, Math.cos(yR), 0.0,
							0.0         , 0.0,          0.0, 1.0
						] );
		var MZ = new Float32Array( [
							Math.cos(zR),-Math.sin(zR), 0.0, 0.0,
							Math.sin(zR), Math.cos(zR), 0.0, 0.0,
							0.0         , 0.0         , 1.0, 0.0,
							0.0         , 0.0         , 0.0, 1.0
						] );
		this.MATRIX.multiply(MX);
		this.MATRIX.multiplys(MY,MZ);
	};
	JC.Object3D.prototype.UPTranslate = function(){
		var x = isPos?this.position.x:this.translate.x,
			y = isPos?this.position.y:this.translate.y,
			z = isPos?this.position.z:this.translate.z;
		var MXYZ = new Float32Array( [
							1.0, 0.0, 0.0,  x ,
							0.0, 1.0, 0.0,  y ,
							0.0, 0.0, 1.0,  z ,
							0.0, 0.0, 0.0, 1.0
						] );
		this.MATRIX.multiply(MXYZ);
	};
	JC.Object3D.prototype.UPScale = function(){
		var x = this.scale.x,
			y = this.scale.y,
			z = this.scale.z;
		var MXYZ = new Float32Array( [
							 x , 0.0, 0.0, 0.0,
							0.0,  y , 0.0, 0.0,
							0.0, 0.0,  z , 0.0,
							0.0, 0.0, 0.0, 1.0
						] );
		this.MATRIX.multiply(MXYZ);
	};



	JC.Points = function (json){
		this.vertexs = {
						data: json.vertexs||[0.0,0.0,0.0],
						vbo: null,
						length: 3
					};
		this.normal = {
						data: json.normal||[0.0,1.0,0.0],
						vbo: null,
						length: 3
					};
		this.alpha = 1.0;
		this.color = {
						data: new JC.Color(json.color)||[0.0,0.0,1.0,this.alpha],
						vbo: null,
						length: 3
					};
	};
	JC.Points.prototype = new JC.Object3D();
	JC.Points.prototype.constructor = JC.Points;
	JC.Points.prototype.render = function(session){
		
		GL.drawArrays(GL.POINTS, 0, LL);
	};
	JC.Points.prototype.bindVBO = function(GL){
		this.VBO = GL.createBuffer();
		GL.bindBuffer(GL.ARRAY_BUFFER, this.VBO);
		GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertexs.data), GL.STATIC_DRAW);
		GL.bindBuffer(GL.ARRAY_BUFFER, null);
	};
	JC.Points.prototype.setAttr = function(GL){
		GL.bindBuffer(GL.ARRAY_BUFFER, vbo[i]);
		GL.enableVertexAttribArray(attL[i]);
		GL.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
	};




	JC.PerspectiveCamera = function ( fov, aspect, near, far ){
		this.position = new JC.Vector3(0.0, 0.0, 20.0);
		this.lookPoint = new JC.Vector3(0.0, 0.0, 0.0);
		this.cameraUp = new JC.Vector3(0.0, 1.0, 0.0);

		this.zoom = 1;

		this.fov = fov !== undefined ? fov : 50;
		this.aspect = aspect !== undefined ? aspect : 1;
		this.near = near !== undefined ? near : 0.1;
		this.far = far !== undefined ? far : 2000;

		this.matrix = JC.MO.create();
		this.PerMatrix = JC.MO.create();
		this.viewMatrix = JC.MO.create();

		this.MVPisDirty = true;
	};
	JC.PerspectiveCamera.prototype.putCamera = function ( eye,center ){
		eye = eye||[0.0,0.0,20.0];
		this.position.set( eye[0],eye[1],eye[2] );
		center&&this.lookAt(center);
		this.MVPisDirty = true;
	};
	JC.PerspectiveCamera.prototype.lookAt = function ( center ){
		this.lookPoint.set( center[0],center[1],center[2] );
		this.MVPisDirty = true;
	};
	JC.PerspectiveCamera.prototype.upTo = function ( up ){
		this.cameraUp.set( up[0],up[1],up[2] );
		this.MVPisDirty = true;
	};
	JC.PerspectiveCamera.prototype.updateMatrix = function (){
		if(!this.MVPisDirty){
			this.MVPisDirty = false;
			return;
		}
		JC.MO.lookAt(this.position, this.lookPoint, this.cameraUp, this.viewMatrix);
		JC.MO.perspective(this.fov, this.aspect, this.near, this.far, this.PerMatrix);
		JC.MO.multiply(this.viewMatrix, this.PerMatrix, this.matrix);
	};

	JC.Renderer = function (json){
		this.DOM = document.getElementById(json.id) || document.createElement('canvas');
		this.GL = this.DOM.getContext('webgl') || this.DOM.getContext('experimental-webgl');
		this.PRG = {};
		this.CPID = null;
		this.clearColor = new JC.Color(json.color||0x000000);
		this.alpha = 1.0;
		this.clearDepth = 1.0;
	};
	JC.Renderer.prototype.setClearColor = function(aC,alpha){
		this.clearColor = aC;
		this.alpha = (alpha!==null)?alpha:this.alpha;
	};
	JC.Renderer.prototype.setSize = function(w,h){
		this.DOM.width = w;
		this.DOM.height = h;
	};
	JC.Renderer.prototype.render = function( scene,camera ){
		camera.updateMatrix();
		var session = {
				GL: this.GL,
				VPM: camera.matrix
			},cC = this.clearColor,gl = this.GL,cd = scene.childs;

		gl.clearColor(cC[0], cC[1], cC[2], this.alpha);
		gl.clearDepth(this.clearDepth);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		for(var i=0,l=cd.length;i<l;i++){
			if(cd[i].isVisible()){
				this.upProgram(cd[i].PRGID);
				cd[i].render(session);
			}
		}
	};
	JC.Renderer.prototype.upProgram = function(id){
		if(this.CPID != id){
			this.GL.useProgram(this.PRG[id]);
			this.CPID = id;
		}
	};
	JC.Renderer.prototype.upFunc = function(){
		this.GL.blendFunc(this.GL.SRC_ALPHA, this.GL.ONE);
		this.GL.enable(this.GL.BLEND);
	};
	JC.Renderer.prototype.bakePrograme = function (json){
		var vs,fs,gl=this.GL,program;

			vs = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(vs, json.VS);
			gl.compileShader(vs);
			if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){
				JC.error(gl.getShaderInfoLog(vs));
				return false;
			}

			fs = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(fs, json.FS);
			gl.compileShader(fs);
			if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)){
				JC.error(gl.getShaderInfoLog(fs));
				return false;
			}

			program = gl.createProgram();
			gl.attachShader(program, vs);
			gl.attachShader(program, fs);
			gl.linkProgram(program);
			if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
				// gl.useProgram(program);
				JC.error(gl.getProgramInfoLog(program));
				return false;
			}

		this.PRG[json.id] = program;
	};


	JC.Scene = function (){
		this.childs = [];
	};
	JC.Scene.prototype.adds = function(c){
		if (c == null) { return c; }
		var l = arguments.length;
		if (l > 1) {
			for (var i=0; i<l; i++) { this.adds(arguments[i]); }
			return arguments[l-1];
		}
		this.childs.push(c);
	};

})(this)




// birdAttributes = {
// 	// index: { type: 'i', value: [] },
// 	birdColor: { type: 'c', value: null },
// 	reference: { type: 'v2', value: null },
// 	birdVertex: { type: 'f', value: null }
// };

// // For Vertex and Fragment
// birdUniforms = {

// 	color: { type: "c", value: new THREE.Color( 0xff2200 ) },
// 	texturePosition: { type: "t", value: null },
// 	textureVelocity: { type: "t", value: null },
// 	time: { type: "f", value: 1.0 },
// 	delta: { type: "f", value: 0.0 },

// };

// // ShaderMaterial
// var shaderMaterial = new THREE.ShaderMaterial( {

// 	uniforms: 		birdUniforms,
// 	attributes:     birdAttributes,
// 	vertexShader:   document.getElementById( 'birdVS' ).textContent,
// 	fragmentShader: document.getElementById( 'birdFS' ).textContent,
// 	side: THREE.DoubleSide

// });