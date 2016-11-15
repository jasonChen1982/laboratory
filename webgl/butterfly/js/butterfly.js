var JCM = new Martix();

function Vertex3(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

function Object3D() {
    this.vertex3 = [];
    this.toRAD = Math.PI / 180.0;
    this.rotate = new Vertex3();
    this.scale = new Vertex3(1, 1, 1);
    this.translate = new Vertex3();
    this.matrix = JCM.identity(JCM.create());
}
Object3D.prototype.rotateXYZ = function() {
    JCM.rotate(this.matrix, (this.rotate.x % 360) * this.toRAD, [1, 0, 0], this.matrix);
    JCM.rotate(this.matrix, (this.rotate.y % 360) * this.toRAD, [0, 1, 0], this.matrix);
    JCM.rotate(this.matrix, (this.rotate.z % 360) * this.toRAD, [0, 0, 1], this.matrix);
}
Object3D.prototype.translateXYZ = function() {
    JCM.translate(this.matrix, [this.translate.x, this.translate.y, this.translate.z], this.matrix);
}
Object3D.prototype.scaleXYZ = function() {
    JCM.scale(this.matrix, [this.scale.x, this.scale.y, this.scale.z], this.matrix);
}
Object3D.prototype.upMatrix = function(Wmatrix) {
    this.matrix = JCM.identity(JCM.create());
    this.translateXYZ();
    this.rotateXYZ();
    this.scaleXYZ();

    JCM.multiply(Wmatrix, this.matrix, this.matrix);
    var mat = this.matrix;

    for (var i = 0, l = this.vertex.length; i < l; i++) {
        var x = this.vertex[i].x,
            y = this.vertex[i].y,
            z = this.vertex[i].z,
            x1 = mat[0] * x + mat[4] * y + mat[8] * z + mat[12],
            y1 = mat[1] * x + mat[5] * y + mat[9] * z + mat[13],
            z1 = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];

        this.vertex3[i] = {};
        this.vertex3[i].x = x1 * (800 / (z1 + 800)); // 
        this.vertex3[i].y = y1 * (800 / (z1 + 800)); // 
        this.vertex3[i].z = z1;
    }
}

function Wings() {
    this.vertex = [{ x: -1, y: -1, z: 0 }, { x: -8, y: -31, z: 0 }, { x: -146, y: -135, z: 0 }, { x: -150, y: -122, z: 0 }, { x: -198, y: -52, z: 0 }, { x: -173, y: 58, z: 0 }, { x: -329, y: -126, z: 0 }, { x: -1, y: 0, z: 0 }, { x: -131, y: 53, z: 0 }, { x: -89, y: 122, z: 0 }, { x: -23, y: 135, z: 0 }, { x: -58, y: 58, z: 0 }, { x: -63, y: 87, z: 0 }, { x: -74, y: 86, z: 0 }, { x: -70, y: 96, z: 0 }];
    this.vertexR = [];
    this.vertexR3 = [];
    this.color = ['#30201d', '#3b2d28', '#fb913c', '#423c32', '#3b2d28', '#e46e39', '#3b2d28', '#ee8548', '#ca6532', '#efba6b', '#232626'];
    this.index = [
        [0, 1, 5],
        [1, 2, 3],
        [1, 3, 4],
        [1, 4, 5],
        [2, 6, 3],
        [3, 6, 4],
        [4, 6, 5],
        [7, 8, 9],
        [7, 9, 10],
        [7, 8, 11],
        [12, 13, 14]
    ];
    for (var i = 0; i < this.vertex.length; i++) {
        this.vertexR[i] = {};
        this.vertexR[i].x = -this.vertex[i].x;
        this.vertexR[i].y = this.vertex[i].y;
        this.vertexR[i].z = this.vertex[i].z;
    }
}
Wings.prototype = new Object3D();
Wings.prototype.constructor = Wings;
Wings.prototype.upMatrixR = function(Wmatrix) {
    this.matrixR = JCM.identity(JCM.create());
    JCM.translate(this.matrixR, [-this.translate.x, this.translate.y, this.translate.z], this.matrixR);

    JCM.rotate(this.matrixR, (this.rotate.x % 360) * this.toRAD, [1, 0, 0], this.matrixR);
    JCM.rotate(this.matrixR, -(this.rotate.y % 360) * this.toRAD, [0, 1, 0], this.matrixR);
    JCM.rotate(this.matrixR, (this.rotate.z % 360) * this.toRAD, [0, 0, 1], this.matrixR);

    JCM.scale(this.matrixR, [this.scale.x, this.scale.y, this.scale.z], this.matrixR);

    JCM.multiply(Wmatrix, this.matrixR, this.matrixR);

    var mat = this.matrixR;

    for (var i = 0, l = this.vertexR.length; i < l; i++) {
        var x = this.vertexR[i].x,
            y = this.vertexR[i].y,
            z = this.vertexR[i].z,
            x1 = mat[0] * x + mat[4] * y + mat[8] * z + mat[12],
            y1 = mat[1] * x + mat[5] * y + mat[9] * z + mat[13],
            z1 = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];

        this.vertexR3[i] = {};
        this.vertexR3[i].x = x1 * (800 / (z1 + 800)); // 
        this.vertexR3[i].y = y1 * (800 / (z1 + 800)); // 
        this.vertexR3[i].z = z1;
    }

}
Wings.prototype.render = function(ctx, Wmatrix) {
    this.upMatrix(Wmatrix);
    this.upMatrixR(Wmatrix);
    var index = this.index,
        color = this.color,
        vertex = this.vertex3,
        vertexR = this.vertexR3;
    for (var i = 0; i < index.length; i++) {
        var pp = index[i];
        ctx.fillStyle = color[i];
        ctx.beginPath();
        for (var L = 0; L < pp.length; L++) {
            if (L == 0) {
                ctx.moveTo(vertex[pp[L]].x, vertex[pp[L]].y);
            } else {
                ctx.lineTo(vertex[pp[L]].x, vertex[pp[L]].y);
            }
        }
        ctx.fill();
        ctx.beginPath();
        for (var R = 0; R < pp.length; R++) {
            if (R == 0) {
                ctx.moveTo(vertexR[pp[R]].x, vertexR[pp[R]].y);
            } else {
                ctx.lineTo(vertexR[pp[R]].x, vertexR[pp[R]].y);
            }
        }
        ctx.fill();
    }
}

function Tentacle() {
    this.vertex = [{ x: -4, y: -65, z: 0 }, { x: -8, y: -61, z: 0 }, { x: -87, y: -150, z: 0 }, { x: 4, y: -65, z: 0 }, { x: 8, y: -61, z: 0 }, { x: 87, y: -150, z: 0 }];
    this.color = ['#070401', '#070401'];
    this.index = [
        [0, 1, 2],
        [3, 4, 5]
    ];
}
Tentacle.prototype = new Object3D();
Tentacle.prototype.constructor = Tentacle;
Tentacle.prototype.render = function(ctx, Wmatrix) {
    this.upMatrix(Wmatrix);
    var index = this.index,
        color = this.color,
        vertex = this.vertex3;
    for (var i = 0; i < index.length; i++) {
        var pp = index[i];
        ctx.fillStyle = color[i];
        ctx.beginPath();
        for (var L = 0; L < pp.length; L++) {
            if (L == 0) {
                ctx.moveTo(vertex[pp[L]].x, vertex[pp[L]].y);
            } else {
                ctx.lineTo(vertex[pp[L]].x, vertex[pp[L]].y);
            }
        }
        ctx.fill();
    }
}

function Body() {
    this.vertex = [{ x: 0, y: -67, z: 0 }, { x: -16, y: -56, z: 0 }, { x: -10, y: -49, z: 0 }, { x: 16, y: -56, z: 0 }, { x: 10, y: -49, z: 0 }, { x: -15, y: -43, z: 0 }, { x: -8, y: 25, z: 0 }, { x: 0, y: 25, z: 0 }, { x: 0, y: 25, z: 0 }, { x: 8, y: 25, z: 0 }, { x: 15, y: -43, z: 0 }, { x: -18, y: 148, z: 0 }, { x: 24, y: 148, z: 0 }, { x: 0, y: 170, z: 0 }];
    this.color = ['#62564d', '#62564d', '#3b2d28', '#23120c', '#fccc67', '#e6a15b', '#3b2d28'];
    this.index = [
        [0, 1, 2],
        [0, 3, 4],
        [0, 5, 6, 7],
        [0, 8, 9, 10],
        [6, 11, 9],
        [9, 11, 12],
        [11, 13, 12]
    ];
}
Body.prototype = new Object3D();
Body.prototype.constructor = Body;
Body.prototype.render = function(ctx, Wmatrix) {
    this.upMatrix(Wmatrix);
    var index = this.index,
        color = this.color,
        vertex = this.vertex3;
    for (var i = 0; i < index.length; i++) {
        var pp = index[i];
        ctx.fillStyle = color[i];
        ctx.beginPath();
        for (var L = 0; L < pp.length; L++) {
            if (L == 0) {
                ctx.moveTo(vertex[pp[L]].x, vertex[pp[L]].y);
            } else {
                ctx.lineTo(vertex[pp[L]].x, vertex[pp[L]].y);
            }
        }
        ctx.fill();
    }
}



function Butterfly() {
    this.tentacle = new Tentacle();
    this.body = new Body();
    this.wings = new Wings();
    this.wings.translate.x = -10;
    //this.wings.rotate.y = -80;
}
Butterfly.prototype = new Object3D();
Butterfly.prototype.constructor = Butterfly;
Butterfly.prototype.render = function(ctx) {
    this.upMatrix();
    this.tentacle.render(ctx, this.matrix);
    this.body.render(ctx, this.matrix);
    this.wings.render(ctx, this.matrix);
}
Butterfly.prototype.upMatrix = function() {
    this.matrix = JCM.identity(JCM.create());
    this.translateXYZ();
    this.rotateXYZ();
    this.scaleXYZ();
}
