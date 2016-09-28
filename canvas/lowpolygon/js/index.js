
	// function makeRotation( axis,angle ) {
	// 	var c = Math.cos( angle*Math.PI/180 );
	// 	var s = Math.sin( angle*Math.PI/180 );
	// 	var t = 1 - c;
	// 	var x = axis.x, y = axis.y, z = axis.z;
	// 	var tx = t * x, ty = t * y;
	// 	var te = new JC.Array([
	// 				tx * x + c,     tx * y + s * z, tx * z - s * y, 0,
	// 				tx * y - s * z, ty * y + c,     ty * z + s * x, 0,
	// 				tx * z + s * y, ty * z - s * x, t * z * z + c,  0,
	// 				0, 0, 0, 1
	// 			]);
	// }

	// function makeRotation( axis,angle ) {
	// 	var c = Math.cos( angle*Math.PI/180 );
	// 	var s = Math.sin( angle*Math.PI/180 );
	// 	var t = 1 - c;
	// 	var x = axis.x, y = axis.y, z = axis.z;
	// 	var tx = t * x, ty = t * y;
	// 	var te = new JC.Array([
	// 				tx * x + c,     tx * y + s * z, tx * z - s * y, 0,
	// 				tx * y - s * z, ty * y + c,     ty * z + s * x, 0,
	// 				tx * z + s * y, ty * z - s * x, t * z * z + c,  0,
	// 				0, 0, 0, 1
	// 			]);
	// }

(function(){
	var root = this;
	window.PIXI = window.PIXI || {};

	PIXI.blendModes = {
	    NORMAL:0,
	    ADD:1,
	    MULTIPLY:2,
	    SCREEN:3,
	    OVERLAY:4,
	    DARKEN:5,
	    LIGHTEN:6,
	    COLOR_DODGE:7,
	    COLOR_BURN:8,
	    HARD_LIGHT:9,
	    SOFT_LIGHT:10,
	    DIFFERENCE:11,
	    EXCLUSION:12,
	    HUE:13,
	    SATURATION:14,
	    COLOR:15,
	    LUMINOSITY:16
	};

	PIXI.scaleModes = {
	    DEFAULT:0,
	    LINEAR:0,
	    NEAREST:1
	};

	PIXI._UID = 0;

	if(typeof(Float32Array) != 'undefined')
	{
	    PIXI.Float32Array = Float32Array;
	    PIXI.Uint16Array = Uint16Array;
	}
	else
	{
	    console.log('not suport Float32Array');
	}


	PIXI.Point = function(x, y)
	{
	    this.x = x || 0;
	    this.y = y || 0;
	};
	PIXI.Point.prototype.clone = function()
	{
	    return new PIXI.Point(this.x, this.y);
	};
	PIXI.Point.prototype.set = function(x, y)
	{
	    this.x = x || 0;
	    this.y = y || ( (y !== 0) ? this.x : 0 ) ;
	};
	PIXI.Point.prototype.constructor = PIXI.Point;


	PIXI.Rectangle = function(x, y, width, height)
	{
	    this.x = x || 0;
	    this.y = y || 0;
	    this.width = width || 0;
	    this.height = height || 0;
	};
	PIXI.Rectangle.prototype.clone = function()
	{
	    return new PIXI.Rectangle(this.x, this.y, this.width, this.height);
	};
	PIXI.Rectangle.prototype.contains = function(x, y)
	{
	    if(this.width <= 0 || this.height <= 0)
	        return false;

	    var x1 = this.x;
	    if(x >= x1 && x <= x1 + this.width)
	    {
	        var y1 = this.y;

	        if(y >= y1 && y <= y1 + this.height)
	        {
	            return true;
	        }
	    }

	    return false;
	};
	PIXI.Rectangle.prototype.constructor = PIXI.Rectangle;
	PIXI.EmptyRectangle = new PIXI.Rectangle(0,0,0,0);

	PIXI.Matrix = function()
	{
	    this.a = 1;
	    this.b = 0;
	    this.c = 0;
	    this.d = 1;
	    this.tx = 0;
	    this.ty = 0;
	};
	PIXI.Matrix.prototype.fromArray = function(array)
	{
	    this.a = array[0];
	    this.b = array[1];
	    this.c = array[3];
	    this.d = array[4];
	    this.tx = array[2];
	    this.ty = array[5];
	};
	PIXI.Matrix.prototype.toArray = function()
	{
	    if(!this.array) this.array = new Float32Array(9);
	    var array = this.array;

	    array[0] = this.a;
	    array[1] = this.c;
	    array[2] = 0;
	    array[3] = this.b;
	    array[4] = this.d;
	    array[5] = 0;
	    array[6] = this.tx;
	    array[7] = this.ty;
	    array[8] = 1;

	    return array;
	};
	PIXI.identityMatrix = new PIXI.Matrix();


	PIXI.DisplayObject = function()
	{
	    this.position = new PIXI.Point();
	    this.scale = new PIXI.Point(1,1);
	    this.pivot = new PIXI.Point(0,0);
	    this.rotation = 0;
	    this.alpha = 1;
	    this.visible = true;
	    this.hitArea = null;
	    this.renderable = false;
	    this.parent = null;
	    this.worldAlpha = 1;
	    this._interactive = false;

	    // this.defaultCursor = 'pointer';

	    this.worldTransform = new PIXI.Matrix();
	    this.color = [];
	    this.customColor = [];

	    this.dynamic = true;

	    // cached sin rotation and cos rotation
	    this._sr = 0;
	    this._cr = 1;

	};
	PIXI.DisplayObject.prototype.constructor = PIXI.DisplayObject;
	Object.defineProperty(PIXI.DisplayObject.prototype, 'worldVisible', {
	    get: function() {
	        var item = this;
	        do
	        {
	            if(!item.visible)return false;
	            item = item.parent;
	        }
	        while(item);

	        return true;
	    }
	});
	PIXI.DisplayObject.prototype.updateTransform = function()
	{
	    if(this.rotation !== this.rotationCache)
	    {
	        this.rotationCache = this.rotation;
	        this._sr =  Math.sin(this.rotation);
	        this._cr =  Math.cos(this.rotation);
	    }

	    var parentTransform = this.parent.worldTransform;
	    var worldTransform = this.worldTransform;

	    var px = this.pivot.x;
	    var py = this.pivot.y;

	    var a00 = this._cr * this.scale.x,
	        a01 = -this._sr * this.scale.y,
	        a10 = this._sr * this.scale.x,
	        a11 = this._cr * this.scale.y,
	        a02 = this.position.x - a00 * px - py * a01,
	        a12 = this.position.y - a11 * py - px * a10,
	        b00 = parentTransform.a, b01 = parentTransform.b,
	        b10 = parentTransform.c, b11 = parentTransform.d;

	    worldTransform.a = b00 * a00 + b01 * a10;
	    worldTransform.b = b00 * a01 + b01 * a11;
	    worldTransform.tx = b00 * a02 + b01 * a12 + parentTransform.tx;

	    worldTransform.c = b10 * a00 + b11 * a10;
	    worldTransform.d = b10 * a01 + b11 * a11;
	    worldTransform.ty = b10 * a02 + b11 * a12 + parentTransform.ty;

	    this.worldAlpha = this.alpha * this.parent.worldAlpha;
	};
	PIXI.DisplayObject.prototype.getBounds = function( matrix )
	{
	    matrix = matrix;
	    return PIXI.EmptyRectangle;
	};
	PIXI.DisplayObject.prototype.getLocalBounds = function()
	{
	    return this.getBounds(PIXI.identityMatrix);
	};
	PIXI.DisplayObject.prototype.render = function(renderSession)
	{
	    renderSession = renderSession;
	};
	Object.defineProperty(PIXI.DisplayObject.prototype, 'x', {
	    get: function() {
	        return  this.position.x;
	    },
	    set: function(value) {
	        this.position.x = value;
	    }
	});
	Object.defineProperty(PIXI.DisplayObject.prototype, 'y', {
	    get: function() {
	        return  this.position.y;
	    },
	    set: function(value) {
	        this.position.y = value;
	    }
	});
	Object.defineProperty(PIXI.DisplayObject.prototype, 'scaleX', {
	    get: function() {
	        return  this.scale.x;
	    },
	    set: function(value) {
	        this.scale.x = value;
	    }
	});
	Object.defineProperty(PIXI.DisplayObject.prototype, 'scaleY', {
	    get: function() {
	        return  this.scale.y;
	    },
	    set: function(value) {
	        this.scale.y = value;
	    }
	});



	PIXI.DisplayObjectContainer = function()
	{
	    PIXI.DisplayObject.call( this );
	    this.children = [];
	};
	PIXI.DisplayObjectContainer.prototype = Object.create( PIXI.DisplayObject.prototype );
	PIXI.DisplayObjectContainer.prototype.constructor = PIXI.DisplayObjectContainer;
	Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'width', {
	    get: function() {
	        return this.scale.x * this.getLocalBounds().width;
	    },
	    set: function(value) {
	        
	        var width = this.getLocalBounds().width;

	        if(width !== 0)
	        {
	            this.scale.x = value / ( width/this.scale.x );
	        }
	        else
	        {
	            this.scale.x = 1;
	        }
	        this._width = value;
	    }
	});
	Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'height', {
	    get: function() {
	        return  this.scale.y * this.getLocalBounds().height;
	    },
	    set: function(value) {

	        var height = this.getLocalBounds().height;

	        if(height !== 0)
	        {
	            this.scale.y = value / ( height/this.scale.y );
	        }
	        else
	        {
	            this.scale.y = 1;
	        }
	        this._height = value;
	    }
	});
	PIXI.DisplayObjectContainer.prototype.addChild = function(child)
	{
	    return this.addChildAt(child, this.children.length);
	};
	PIXI.DisplayObjectContainer.prototype.addChildAt = function(child, index)
	{
	    if(index >= 0 && index <= this.children.length)
	    {
	        if(child.parent)
	        {
	            child.parent.removeChild(child);
	        }

	        child.parent = this;

	        this.children.splice(index, 0, child);

	        if(this.stage)child.setStageReference(this.stage);

	        return child;
	    }
	    else
	    {
	        throw new Error(child + ' The index '+ index +' supplied is out of bounds ' + this.children.length);
	    }
	};
	PIXI.DisplayObjectContainer.prototype.getChildAt = function(index)
	{
	    if(index >= 0 && index < this.children.length)
	    {
	        return this.children[index];
	    }
	    else
	    {
	        throw new Error('Supplied index does not exist in the child list, or the supplied DisplayObject must be a child of the caller');
	    }
	};
	PIXI.DisplayObjectContainer.prototype.removeChild = function(child)
	{
	    return this.removeChildAt( this.children.indexOf( child ) );
	};
	PIXI.DisplayObjectContainer.prototype.removeChildAt = function(index)
	{
	    var child = this.getChildAt( index );
	    if(this.stage)
	        child.removeStageReference();

	    child.parent = undefined;
	    this.children.splice( index, 1 );
	    return child;
	};
	PIXI.DisplayObjectContainer.prototype.updateTransform = function()
	{
	    if(!this.visible)return;
	    PIXI.DisplayObject.prototype.updateTransform.call( this );
	    for(var i=0,j=this.children.length; i<j; i++)
	    {
	        this.children[i].updateTransform();
	    }
	};
	PIXI.DisplayObjectContainer.prototype.getBounds = function(matrix)
	{
	    if(this.children.length === 0)return PIXI.EmptyRectangle;
	    if(matrix)
	    {
	        var matrixCache = this.worldTransform;
	        this.worldTransform = matrix;
	        this.updateTransform();
	        this.worldTransform = matrixCache;
	    }
	    var minX = Infinity;
	    var minY = Infinity;

	    var maxX = -Infinity;
	    var maxY = -Infinity;

	    var childBounds;
	    var childMaxX;
	    var childMaxY;

	    var childVisible = false;

	    for(var i=0,j=this.children.length; i<j; i++)
	    {
	        var child = this.children[i];
	        
	        if(!child.visible)continue;

	        childVisible = true;

	        childBounds = this.children[i].getBounds( matrix );
	     
	        minX = minX < childBounds.x ? minX : childBounds.x;
	        minY = minY < childBounds.y ? minY : childBounds.y;

	        childMaxX = childBounds.width + childBounds.x;
	        childMaxY = childBounds.height + childBounds.y;

	        maxX = maxX > childMaxX ? maxX : childMaxX;
	        maxY = maxY > childMaxY ? maxY : childMaxY;
	    }

	    if(!childVisible)
	        return PIXI.EmptyRectangle;

	    var bounds = this._bounds;

	    bounds.x = minX;
	    bounds.y = minY;
	    bounds.width = maxX - minX;
	    bounds.height = maxY - minY;
	   
	    return bounds;
	};
	PIXI.DisplayObjectContainer.prototype.getLocalBounds = function()
	{
	    var matrixCache = this.worldTransform;

	    this.worldTransform = PIXI.identityMatrix;

	    for(var i=0,j=this.children.length; i<j; i++)
	    {
	        this.children[i].updateTransform();
	    }

	    var bounds = this.getBounds();

	    this.worldTransform = matrixCache;

	    return bounds;
	};
	PIXI.DisplayObjectContainer.prototype.render = function(renderSession)
	{
	    if(!this.visible || this.alpha <= 0)return;
	    
	    var i,j;

	    for(i=0,j=this.children.length; i<j; i++)
	    {
	        this.children[i].render(renderSession);
	    }
	};



	PIXI.Sprite = function(texture)
	{
	    PIXI.DisplayObjectContainer.call( this );
	    this.anchor = new PIXI.Point();
	    this.texture = texture;
	    this._width = 0;
	    this._height = 0;
	    this.tint = 0xFFFFFF;

	    this.blendMode = PIXI.blendModes.NORMAL;


	    this.renderable = true;
	};
	PIXI.Sprite.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
	PIXI.Sprite.prototype.constructor = PIXI.Sprite;
	Object.defineProperty(PIXI.Sprite.prototype, 'width', {
	    get: function() {
	        return this.scale.x * this.texture.frame.width;
	    },
	    set: function(value) {
	        this.scale.x = value / this.texture.frame.width;
	        this._width = value;
	    }
	});
	Object.defineProperty(PIXI.Sprite.prototype, 'height', {
	    get: function() {
	        return  this.scale.y * this.texture.frame.height;
	    },
	    set: function(value) {
	        this.scale.y = value / this.texture.frame.height;
	        this._height = value;
	    }
	});
	PIXI.Sprite.prototype.setTexture = function(texture)
	{
	    this.texture = texture;
	    this.cachedTint = 0xFFFFFF;
	};
	PIXI.Sprite.prototype.onTextureUpdate = function()
	{
	    // so if _width is 0 then width was not set..
	    if(this._width)this.scale.x = this._width / this.texture.frame.width;
	    if(this._height)this.scale.y = this._height / this.texture.frame.height;
	};
	PIXI.Sprite.prototype.getBounds = function(matrix)
	{

	    var width = this.texture.frame.width;
	    var height = this.texture.frame.height;

	    var w0 = width * (1-this.anchor.x);
	    var w1 = width * -this.anchor.x;

	    var h0 = height * (1-this.anchor.y);
	    var h1 = height * -this.anchor.y;

	    var worldTransform = matrix || this.worldTransform ;

	    var a = worldTransform.a;
	    var b = worldTransform.c;
	    var c = worldTransform.b;
	    var d = worldTransform.d;
	    var tx = worldTransform.tx;
	    var ty = worldTransform.ty;

	    var x1 = a * w1 + c * h1 + tx;
	    var y1 = d * h1 + b * w1 + ty;

	    var x2 = a * w0 + c * h1 + tx;
	    var y2 = d * h1 + b * w0 + ty;

	    var x3 = a * w0 + c * h0 + tx;
	    var y3 = d * h0 + b * w0 + ty;

	    var x4 =  a * w1 + c * h0 + tx;
	    var y4 =  d * h0 + b * w1 + ty;

	    var maxX = -Infinity;
	    var maxY = -Infinity;

	    var minX = Infinity;
	    var minY = Infinity;

	    minX = x1 < minX ? x1 : minX;
	    minX = x2 < minX ? x2 : minX;
	    minX = x3 < minX ? x3 : minX;
	    minX = x4 < minX ? x4 : minX;

	    minY = y1 < minY ? y1 : minY;
	    minY = y2 < minY ? y2 : minY;
	    minY = y3 < minY ? y3 : minY;
	    minY = y4 < minY ? y4 : minY;

	    maxX = x1 > maxX ? x1 : maxX;
	    maxX = x2 > maxX ? x2 : maxX;
	    maxX = x3 > maxX ? x3 : maxX;
	    maxX = x4 > maxX ? x4 : maxX;

	    maxY = y1 > maxY ? y1 : maxY;
	    maxY = y2 > maxY ? y2 : maxY;
	    maxY = y3 > maxY ? y3 : maxY;
	    maxY = y4 > maxY ? y4 : maxY;

	    var bounds = this._bounds;

	    bounds.x = minX;
	    bounds.width = maxX - minX;

	    bounds.y = minY;
	    bounds.height = maxY - minY;

	    // store a reference so that if this function gets called again in the render cycle we do not have to recalculate
	    this._currentBounds = bounds;

	    return bounds;
	};
	PIXI.Sprite.prototype.render = function(renderSession)
	{
	    if(!this.visible || this.alpha <= 0)return;
	    
	    var i,j;

	    renderSession.spriteBatch.render(this);

	    for(i=0,j=this.children.length; i<j; i++)
	    {
	        this.children[i].render(renderSession);
	    }
	};
	

	PIXI.CompileVertexShader = function(gl, shaderSrc)
	{
	    return PIXI._CompileShader(gl, shaderSrc, gl.VERTEX_SHADER);
	};
	PIXI.CompileFragmentShader = function(gl, shaderSrc)
	{
	    return PIXI._CompileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
	};
	PIXI._CompileShader = function(gl, shaderSrc, shaderType)
	{
	    var src = shaderSrc.join("\n");
	    var shader = gl.createShader(shaderType);
	    gl.shaderSource(shader, src);
	    gl.compileShader(shader);

	    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	        window.console.log(gl.getShaderInfoLog(shader));
	        return null;
	    }

	    return shader;
	};
	PIXI.compileProgram = function(gl, vertexSrc, fragmentSrc)
	{
	    var fragmentShader = PIXI.CompileFragmentShader(gl, fragmentSrc);
	    var vertexShader = PIXI.CompileVertexShader(gl, vertexSrc);

	    var shaderProgram = gl.createProgram();

	    gl.attachShader(shaderProgram, vertexShader);
	    gl.attachShader(shaderProgram, fragmentShader);
	    gl.linkProgram(shaderProgram);

	    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	        window.console.log("Could not initialise shaders");
	    }

	    return shaderProgram;
	};



	PIXI.PixiShader = function(gl)
	{
	    this._UID = PIXI._UID++;
	    
	    this.gl = gl;

	    this.program = null;

	    this.fragmentSrc = [
	        'precision lowp float;',

	        'void main(void) {',
	        '   gl_FragColor = vec4(0.0,1.0,0.0,1.0);',
	        '}'
	    ];

	    this.textureCount = 0;

	    this.attributes = [];

	    this.init();
	};

	PIXI.PixiShader.prototype.init = function()
	{
	    var gl = this.gl;

	    var program = PIXI.compileProgram(gl, this.vertexSrc || PIXI.PixiShader.defaultVertexSrc, this.fragmentSrc);
	    
	    gl.useProgram(program);

	    // this.uSampler = gl.getUniformLocation(program, 'uSampler');
	    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
	    // this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
	    // this.dimensions = gl.getUniformLocation(program, 'dimensions');

	    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
	    // this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
	    // this.colorAttribute = gl.getAttribLocation(program, 'aColor');

	    if(this.colorAttribute === -1)
	    {
	        this.colorAttribute = 2;
	    }

	    this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute];

	    for (var key in this.uniforms)
	    {
	        this.uniforms[key].uniformLocation = gl.getUniformLocation(program, key);
	    }

	    this.initUniforms();

	    this.program = program;
	};
	PIXI.PixiShader.prototype.initUniforms = function()
	{
	    this.textureCount = 1;
	    var gl = this.gl;
	    var uniform;

	    for (var key in this.uniforms)
	    {
	        uniform = this.uniforms[key];

	        var type = uniform.type;

	        if (type === 'sampler2D')
	        {
	            uniform._init = false;

	            if (uniform.value !== null)
	            {
	                this.initSampler2D(uniform);
	            }
	        }
	        else if (type === 'mat2' || type === 'mat3' || type === 'mat4')
	        {
	            uniform.glMatrix = true;
	            uniform.glValueLength = 1;

	            if (type === 'mat2')
	            {
	                uniform.glFunc = gl.uniformMatrix2fv;
	            }
	            else if (type === 'mat3')
	            {
	                uniform.glFunc = gl.uniformMatrix3fv;
	            }
	            else if (type === 'mat4')
	            {
	                uniform.glFunc = gl.uniformMatrix4fv;
	            }
	        }
	        else
	        {
	            uniform.glFunc = gl['uniform' + type];

	            if (type === '2f' || type === '2i')
	            {
	                uniform.glValueLength = 2;
	            }
	            else if (type === '3f' || type === '3i')
	            {
	                uniform.glValueLength = 3;
	            }
	            else if (type === '4f' || type === '4i')
	            {
	                uniform.glValueLength = 4;
	            }
	            else
	            {
	                uniform.glValueLength = 1;
	            }
	        }
	    }

	};
	PIXI.PixiShader.prototype.initSampler2D = function(uniform)
	{
	    if (!uniform.value || !uniform.value.baseTexture || !uniform.value.baseTexture.hasLoaded)
	    {
	        return;
	    }

	    var gl = this.gl;

	    gl.activeTexture(gl['TEXTURE' + this.textureCount]);
	    gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id]);

	    if (uniform.textureData)
	    {
	        var data = uniform.textureData;

	        var magFilter = (data.magFilter) ? data.magFilter : gl.LINEAR;
	        var minFilter = (data.minFilter) ? data.minFilter : gl.LINEAR;
	        var wrapS = (data.wrapS) ? data.wrapS : gl.CLAMP_TO_EDGE;
	        var wrapT = (data.wrapT) ? data.wrapT : gl.CLAMP_TO_EDGE;
	        var format = (data.luminance) ? gl.LUMINANCE : gl.RGBA;

	        if (data.repeat)
	        {
	            wrapS = gl.REPEAT;
	            wrapT = gl.REPEAT;
	        }

	        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !!data.flipY);

	        if (data.width)
	        {
	            var width = (data.width) ? data.width : 512;
	            var height = (data.height) ? data.height : 2;
	            var border = (data.border) ? data.border : 0;

	            gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, border, format, gl.UNSIGNED_BYTE, null);
	        }
	        else
	        {
	            gl.texImage2D(gl.TEXTURE_2D, 0, format, gl.RGBA, gl.UNSIGNED_BYTE, uniform.value.baseTexture.source);
	        }

	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
	    }

	    gl.uniform1i(uniform.uniformLocation, this.textureCount);

	    uniform._init = true;

	    this.textureCount++;

	};
	PIXI.PixiShader.prototype.syncUniforms = function()
	{
	    this.textureCount = 1;
	    var uniform;
	    var gl = this.gl;

	    for (var key in this.uniforms)
	    {
	        uniform = this.uniforms[key];

	        if (uniform.glValueLength === 1)
	        {
	            if (uniform.glMatrix === true)
	            {
	                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.transpose, uniform.value);
	            }
	            else
	            {
	                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value);
	            }
	        }
	        else if (uniform.glValueLength === 2)
	        {
	            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y);
	        }
	        else if (uniform.glValueLength === 3)
	        {
	            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z);
	        }
	        else if (uniform.glValueLength === 4)
	        {
	            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w);
	        }
	        else if (uniform.type === 'sampler2D')
	        {
	            if (uniform._init)
	            {
	                gl.activeTexture(gl['TEXTURE' + this.textureCount]);
	                gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture( uniform.value.baseTexture, gl));
	                gl.uniform1i(uniform.uniformLocation, this.textureCount);
	                this.textureCount++;
	            }
	            else
	            {
	                this.initSampler2D(uniform);
	            }
	        }
	    }

	};
	PIXI.PixiShader.prototype.destroy = function()
	{
	    this.gl.deleteProgram( this.program );
	    this.uniforms = null;
	    this.gl = null;

	    this.attributes = null;
	};
	PIXI.PixiShader.defaultVertexSrc = [
	    'attribute vec2 aVertexPosition;',
	    'uniform vec2 projectionVector;',

	    'void main(void) {',
	    '   gl_PointSize = 30.0;',
	    '   vec2 tmpPosition = aVertexPosition/projectionVector;',
	    '   gl_Position = vec4(tmpPosition-vec2(1,-1), 0.0, 1.0);',
	    '}'
	];
})();