var JCM = new matIV();
    function HSL(){
        this.h = 265;// Math.random()*360 >> 0;
        this.s = randomRange(60,66) >> 0;
        this.l = randomRange(9,40) >> 0;
    }
    function Vertex3(x,y,z){
        this.x = x||0;
        this.y = y||0;
        this.z = z||0;
        this.toRAD = Math.PI/180.0;
    }
    Vertex3.prototype.randomPos = function(w){
        var degX = this.toRAD*randomRange(0,360),
            degY = this.toRAD*randomRange(0,360),
            radius = 300;//w/4;

            this.x = Math.sin(degX)*Math.cos(degY)*radius;
            this.y = Math.sin(degX)*Math.sin(degY)*radius;
            this.z = Math.cos(degX)*radius;
    }
    Vertex3.prototype.rect = function(w,h){
        // var degX = this.toRAD*randomRange(0,360),
        //     degY = this.toRAD*randomRange(0,360),
        //     degZ = this.toRAD*randomRange(0,360),
        //     radius = 300;// w/4;

        //     this.x = Math.sin(degX)*radius;// *Math.cos(degY)
        //     this.y = Math.sin(degY)*radius;// *Math.sin(degY)
        //     this.z = Math.cos(degZ)*radius;

        this.x = (Math.random()-.5)*w;
        this.y = (Math.random()-.5)*h;
        this.z = (Math.random()-.5)*w;
    }

    function Triangle(){
        this.color = new HSL();
        this.alpha = 1;
        this.vertex3 = [];
        this.vertex2 = [];
        this.position = new Vertex3();
        this.rotate = new Vertex3();
        this.rotateS = new Vertex3();
        this.toRAD = Math.PI/180.0;
        this.matrix = JCM.identity(JCM.create());
        this.matrixS = JCM.identity(JCM.create());
        this.random = randomRange(1,4);
    }
    Triangle.prototype.init = function(){
        for(var i=0;i<3;i++){
            var degX = this.toRAD*randomRange(0,360),
                degY = this.toRAD*randomRange(0,360),
                radius = randomRange(10,30),
                pos = {};
                this.vertex2.push({x:0,y:0,z:0});

                pos.x = Math.sin(degX)*Math.cos(degY)*radius;
                pos.y = Math.sin(degX)*Math.sin(degY)*radius;
                pos.z = Math.cos(degX)*radius;
                this.vertex3.push(pos);
        }
    }
    Triangle.prototype.rotateXYZ = function(perspective,lookAt){
        this.rotate.x += .2;
        this.rotate.y += .1;


        this.rotateS.x += this.random;
        this.rotateS.y += this.random;
        //this.position.z-=1;

        this.matrix = JCM.identity(JCM.create());
        JCM.rotate(this.matrix, (this.rotate.x % 360) * this.toRAD, [1,0,0], this.matrix);
        JCM.rotate(this.matrix, (this.rotate.y % 360) * this.toRAD, [0,1,0], this.matrix);
        JCM.rotate(this.matrix, (this.rotate.z % 360) * this.toRAD, [0,0,1], this.matrix);

        this.matrixS = JCM.identity(JCM.create());
        JCM.rotate(this.matrixS, (this.rotateS.x % 360) * this.toRAD, [1,0,0], this.matrixS);
        JCM.rotate(this.matrixS, (this.rotateS.y % 360) * this.toRAD, [0,1,0], this.matrixS);
        JCM.rotate(this.matrixS, (this.rotateS.z % 360) * this.toRAD, [0,0,1], this.matrixS);

        // JCM.multiply(lookAt, this.matrix, this.matrix);
        JCM.multiply(perspective, this.matrix, this.matrix);
    }
    Triangle.prototype.upMatrix = function(perspective,lookAt){
        var mat = this.matrix;
        var matS = this.matrixS;

        this.rotateXYZ(perspective,lookAt);
        for(var i=0,l=this.vertex3.length;i<l;i++){
            var x = matS[0]*this.vertex3[i].x+matS[4]*this.vertex3[i].y+matS[8]*this.vertex3[i].z+this.position.x,
                y = matS[1]*this.vertex3[i].x+matS[5]*this.vertex3[i].y+matS[9]*this.vertex3[i].z+this.position.y,
                z = matS[2]*this.vertex3[i].x+matS[6]*this.vertex3[i].y+matS[10]*this.vertex3[i].z+this.position.z,
                x1 = mat[0]*x+mat[4]*y+mat[8]*z,
                y1 = mat[1]*x+mat[5]*y+mat[9]*z,
                z1 = mat[2]*x+mat[6]*y+mat[10]*z+mat[14];

            this.vertex2[i].x = x1;
            this.vertex2[i].y = y1;
            this.vertex2[i].z = z1;

        }
        // console.log(this.vertex2[1].z);
    }
    Triangle.prototype.draw = function(session){
        var ctx = session.ctx,
            perspective = session.perspective,
            lookAt = session.lookAt;

        this.upMatrix(perspective,lookAt);
        ctx.save();
        ctx.fillStyle = 'hsl('+this.color.h+','+this.color.s+'%,'+this.color.l+'%)';
        //ctx.globalAlpha = Math.max((400+this.vertex2[0].z)/500,0);
        ctx.beginPath();
        ctx.moveTo(this.vertex2[0].x, this.vertex2[0].y);
        ctx.lineTo(this.vertex2[1].x, this.vertex2[1].y);
        ctx.lineTo(this.vertex2[2].x, this.vertex2[2].y);
        ctx.fill();

        ctx.restore();
    }


    function Stage(id){
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.child = [];
        this.autoClear = true;
        this.matrix = JCM.identity(JCM.create());
        this.matrix2 = JCM.identity(JCM.create());
        this.autoUp = true;
    };
    Stage.prototype.perspective = function(fovy, aspect, near, far){
        this.fovy = fovy;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.autoUp = true;
    }
    Stage.prototype.lookAt = function(eye, center, up){
        this.eye = eye;
        this.center = center;
        this.up = up;
        this.autoUp = true;
    }
    Stage.prototype.upMatrix = function(){
        if(!this.autoUp){return};
        JCM.perspective(this.fovy, this.aspect, this.near, this.far, this.matrix);
        JCM.lookAt(this.eye, this.center, this.up, this.matrix2);
        this.autoUp = false;
    }
    Stage.prototype.addChild = function (child){
        if (child == null) { return child; }
        var l = arguments.length;
        if (l > 1) {
            for (var i=0; i<l; i++) { this.addChild(arguments[i]); }
            return arguments[l-1];
        }
        this.child.push(child);
        return child;
    }
    Stage.prototype.resize = function (w,h){
        this.width = this.canvas.width = w;
        this.height = this.canvas.height = h;
    }
    Stage.prototype.render = function (){
        this.sortChild();
        this.upMatrix();
        if(this.autoClear)this.ctx.clearRect(0,0,this.width,this.height);
        var totle = this.child.length,
            iNow = 0,
            session = {
                ctx: this.ctx,
                perspective: this.matrix,
                lookAt: this.matrix2
            };

        this.ctx.save();
        this.ctx.translate(this.width/2,this.height/2);
        while(iNow<totle){
            var children = this.child[iNow];
                children.draw(session);
            iNow++;
        }
        this.ctx.restore();
    }
    Stage.prototype.sortChild = function (){
        this.child.sort(function(a,b){
            return a.vertex2[0].z-b.vertex2[0].z;
        });
    }


    function randomRange(LLimit,TLimit){
        return Math.floor(Math.random()*(TLimit-LLimit) + LLimit);
    };