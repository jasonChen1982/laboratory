var MODE = {
  NORMAL: 'NORMAL',
  RENDER: 'RENDER',
};

function RenderTarget(gl, width, height) {
  this.gl = gl;
  this.width = width;
  this.height = height;
  this.frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

  this.texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
	// gl.activeTexture(gl.TEXTURE0);
}

function DisplayTarget(options) {
  options = options || {};
  this.canvas = null;
  this.mode = MODE.NORMAL;
  this.width = options.width;
  this.height = options.height;
  if (options.gl) {
    this.canvas = options.canvas ? options.canvas :
    document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.gl = this.canvas.getContext('webgl', {
      alpha: true,
    });
    this.mode = MODE.RENDER;
  } else {
    this.gl = options.gl;
  }
  this.renderTarget = new RenderTarget(this.gl, this.width, this.height);
}

DisplayTarget.prototype.update = function() {
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.renderTarget.frameBuffer);
}

DisplayTarget.prototype.draw = function() {
}

class DisplayTarget {
  constructor(args) {
    const { gl, ARSession, cameraPosition, cameraSize, orientation } = args;
    this.gl = gl;
    this.ARSession = ARSession;
    this.fb = null;
    this.texture = gl.createTexture();
    this.renderer = new Renderer(gl, shader, { cameraPosition, cameraSize, orientation });

    this.isInitFramebuffer = false;
  }

  update() {
    if (!this.isInitFramebuffer) {
      this.initFramebuffer();
      this.isInitFramebuffer = true;
    }

    this.renderer.update(this.getFrames());
  }

  draw() {
    if (this.isInitFramebuffer) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      this.isInitFramebuffer = false;
    }
    if (this.isDirty && this.isRunning) {
      this.renderer.update(this.getFrames());
    }
  }

  dispose() {
    this.fbo = null;
  }

  getFrames() {
    return this.ARSession.getCurrentFrame();
  }

  get isRunning() {
    return this.ARSession.isRunning;
  }

  get isDirty() {
    return this.ARSession.isDirty;
  }

  initFramebuffer() {
    const gl = this.gl;
    let texture = null;

    // createFramebuffer, and set to current frame buffer
    const fb = gl.createFramebuffer();
    this.fb = fb;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    // create texture
    texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // bind texutre to framebuffer
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    // release texutre
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 480, 640, 0, gl.RGB, gl.UNSIGNED_BYTE, null);

    // set texture
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
}

export default DisplayTarget;
