(function (root) {
	root.JC3D = root.JC3D || {};



	JC3D.Math = {
		randInt: function ( low, high ) {
			return Math.floor( this.randFloat( low, high ) );
		},
		randFloat: function ( low, high ) {
			return low + Math.random() * ( high - low );
		},
		degToRad: function () {
			var degreeToRadiansFactor = Math.PI / 180;
			return function ( degrees ) {
				return degrees * degreeToRadiansFactor;
			};
		}()
	};


	JC3D.Matrix = function(){
	};
	JC3D.Matrix.prototype = {
		constructor: JC3D.Matrix,
		create: function(){
			return new Float32Array(16);
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
	JC3D.M = new JC3D.Matrix();


	JC3D.Vector3 = function(x,y,z){
	    this._x = x||0;
	    this._y = y||0;
	    this._z = z||0;
	};
	JC3D.Vector3.prototype = {
		constructor: JC3D.Vector3,
		get x () {
			return this._x;
		},
		set x ( value ) {
			this._x = value;
			this.onChangeCallback();
		},
		get y () {
			return this._y;
		},
		set y ( value ) {
			this._y = value;
			this.onChangeCallback();
		},
		get z () {
			return this._z;
		},
		set z ( value ) {
			this._z = value;
			this.onChangeCallback();
		},
		get order () {
			return this._order;
		},
		set order ( value ) {
			this._order = value;
			this.onChangeCallback();
		},
		onChange: function ( callback ) {
			this.onChangeCallback = callback;
			return this;
		},
		onChangeCallback: function () {}
	};

	JC3D.Object3D = function(){
		this.matrixNeedsUpdate = true;
		this.matrixWorldNeedsUpdate = true;

		this.position = new JC3D.Vector3();
		this.scale = new JC3D.Vector3(1,1,1);
		this.rotation = new JC3D.Vector3();
		this.matrix = JC3D.M.create();

		var This = this;
		var matrixDirty = function(){
			This.matrixNeedsUpdate = true;
		}

		this.position.onChange( matrixDirty );
		this.scale.onChange( matrixDirty );
		this.rotation.onChange( matrixDirty );

		this.translate = new JC3D.Vector3();
		this.scaleO = new JC3D.Vector3(1,1,1);
		this.rotationO = new JC3D.Vector3();
		this.matrixO = JC3D.M.create();

		var matrixODirty = function(){
			This.matrixWorldNeedsUpdate = true;
		}

		this.translate.onChange( matrixODirty );
		this.scaleO.onChange( matrixODirty );
		this.rotationO.onChange( matrixODirty );


		this.visible = true;
	};
	JC3D.Object3D.prototype = {
		constructor: JC3D.Object3D,
		upMartix: function(){
			this.matrixNeedsUpdate&&this._upTransform();
			this.matrixWorldNeedsUpdate&&this._upTransformO();
		},
		_upTransform: function(){

			this.matrix = JC3D.M.identity(JC3D.M.create());

		    JC3D.M.rotate(this.matrix, JC3D.Math.degToRad(this.rotate.x % 360), [1,0,0], this.matrix);
		    JC3D.M.rotate(this.matrix, JC3D.Math.degToRad(this.rotate.y % 360), [0,1,0], this.matrix);
		    JC3D.M.rotate(this.matrix, JC3D.Math.degToRad(this.rotate.z % 360), [0,0,1], this.matrix);

    		JC3D.M.translate(this.matrix, [this.position.x,this.position.y,this.position.z], this.matrix);

    		JC3D.M.scale(this.matrix, [this.scale.x,this.scale.y,this.scale.z], this.matrix);

			this.matrixNeedsUpdate = false;

		},
		_upTransformO: function(){

			this.matrixO = JC3D.M.identity(JC3D.M.create());

    		JC3D.M.translate(this.matrixO, [this.translate.x,this.translate.y,this.translate.z], this.matrixO);

		    JC3D.M.rotate(this.matrixO, JC3D.Math.degToRad(this.rotationO.x % 360), [1,0,0], this.matrixO);
		    JC3D.M.rotate(this.matrixO, JC3D.Math.degToRad(this.rotationO.y % 360), [0,1,0], this.matrixO);
		    JC3D.M.rotate(this.matrixO, JC3D.Math.degToRad(this.rotationO.z % 360), [0,0,1], this.matrixO);

    		JC3D.M.scale(this.matrixO, [this.scaleO.x,this.scaleO.y,this.scaleO.z], this.matrixO);

			this.matrixWorldNeedsUpdate = false;

		}
	};

	JC3D.ShaderMaterial = function(){

	}





	JC3D.Renderer = function(parameters){

		this.children = [];
		
		parameters = parameters || {};

		this.canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement( 'canvas' );

		this.pixelRatio = parameters.devicePixelRatio || self.devicePixelRatio;

		this.precision = parameters.precision !== undefined ? parameters.precision : 'highp';

		this.alpha = parameters.alpha !== undefined ? parameters.alpha : false;
		this.depth = parameters.depth !== undefined ? parameters.depth : true;
		this.stencil = parameters.stencil !== undefined ? parameters.stencil : true;
		this.antialias = parameters.antialias !== undefined ? parameters.antialias : false;
		this.premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true;
		this.preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;
		this.logarithmicDepthBuffer = parameters.logarithmicDepthBuffer !== undefined ? parameters.logarithmicDepthBuffer : false;

		this.clearColor = new JC3D.Color( 0x000000 );
		this.clearAlpha = 0;
		this.autoClear = true;
			
		this.clear = function () {

			var bits = 0;

			if ( this.clearColor ) bits |= _gl.COLOR_BUFFER_BIT;
			if ( this.depth ) bits |= _gl.DEPTH_BUFFER_BIT;
			if ( this.stencil ) bits |= _gl.STENCIL_BUFFER_BIT;

			this.gl.clear( bits );

		};

		this.programs = {};
		this._currentPrg = null;

		this.seesion = {
			gl: this.gl,
			camera: null
		};
	}
	JC3D.Renderer.prototype.adds = function(object){
		if ( arguments.length > 1 ) {
			for ( var i = 0; i < arguments.length; i ++ ) {
				this.add( arguments[ i ] );
			}
			return this;
		};
		this.children.push( object );
	}
	JC3D.Renderer.prototype.setViewport = function(x,y,width,height){

		this.viewportX = x * this.pixelRatio;
		this.viewportY = y * this.pixelRatio;

		this.viewportWidth = width * this.pixelRatio;
		this.viewportHeight = height * this.pixelRatio;

		this.gl.viewport( this.viewportX, this.viewportY, this.viewportWidth, this.viewportHeight );
	}
	JC3D.Renderer.prototype.setSize = function(w,h){
		this.canvas.width = w * this.pixelRatio;
		this.canvas.height = h * this.pixelRatio;

		if ( updateStyle !== false ) {

			this.canvas.style.width = w + 'px';
			this.canvas.style.height = h + 'px';

		}

		this.setViewport( 0, 0, w, h );

	}
	JC3D.Renderer.prototype.render = function(camera){
		this.autoClear&&this.clear();
		camera.updateVPMatrix();
		this.seesion.camera = camera;
		var l = this.children.length;
		for(var i=0;i<l;i++){
			var obj = this.children[i];
			if(obj.visible){
				obj.draw(this.seesion);
			}
		}
	}



	JC3D.Camera = function () {
		JC3D.Object3D.call( this );
		this.type = 'Camera';
		this.up = [0,1,0];
		this.matrixWorldInverse = JC3D.M.create();
		this.projectionMatrix = JC3D.M.create();
		this.viewMatrix = JC3D.M.create();
		this.VMNeedsUpdate = true;
		this.PMNeedsUpdate = true;
		this.lookPoint = new JC3D.Vector3();
	};
	JC3D.Camera.prototype = Object.create( JC3D.Object3D.prototype );
	JC3D.Camera.prototype.constructor = JC3D.Camera;
	JC3D.Camera.prototype.lookAt = function (vector) {
		this.lookPoint = vector||this.lookPoint;
		this.viewMatrix = JC3D.M.identity(this.viewMatrix);
		JC3D.M.lookAt( this.position, this.lookPoint, this.up, this.viewMatrix );
		this.VMNeedsUpdate = false;
	};

	JC3D.PerspectiveCamera = function ( fov, aspect, near, far ) {
		JC3D.Camera.call( this );
		this.type = 'PerspectiveCamera';
		this.fov = fov || 50;
		this.aspect = aspect || 1;
		this.near = near || 0.1;
		this.far = far || 2000;
		this.updateVPMatrix();
	};
	JC3D.PerspectiveCamera.prototype = Object.create( JC3D.Camera.prototype );
	JC3D.PerspectiveCamera.prototype.constructor = JC3D.PerspectiveCamera;
	JC3D.PerspectiveCamera.prototype.updateVPMatrix = function () {
		this.PMNeedsUpdate&&this.updatePMatrix();
		this.VMNeedsUpdate&&this.lookAt();
	};
	JC3D.PerspectiveCamera.prototype.updatePMatrix = function () {
		JC3D.M.perspective(this.fov, this.aspect, this.near, this.far, this.projectionMatrix);
		this.PMNeedsUpdate = false;
	};

})(this)