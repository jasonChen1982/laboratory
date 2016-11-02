function PutStar(opts) {
    var vertexs = opts.vertexs;
    var sizes = [];
    var colors = [];

    this.vertexs = new Float32Array(vertexs.length);
    this.colors = new Float32Array(vertexs.length);
    this.sizes = new Float32Array(vertexs.length/3);
    for ( var i = 0, i3 = 0; i < vertexs.length; i ++, i3 += 3 ) {
        this.vertexs[ i3 + 0 ] = vertexs[ i3 + 0 ]*3.0;
        this.vertexs[ i3 + 1 ] = vertexs[ i3 + 1 ]*3.0;
        this.vertexs[ i3 + 2 ] = vertexs[ i3 + 2 ]*3.0;
        this.colors[ i3 + 0 ] = 0.99;
        this.colors[ i3 + 1 ] = 1.0;
        this.colors[ i3 + 2 ] = 0.9;
        var rr = Math.random()<0.3,
            bb = rr?8.0:4.0;
            this.sizes[ i ] = Math.random()*bb;
    }
    this.group = new THREE.Scene();
    this.star = new THREE.BufferGeometry();
    this.star.addAttribute( 'position', new THREE.BufferAttribute( this.vertexs, 3 ) );
    this.star.addAttribute( 'customColor', new THREE.BufferAttribute( this.colors, 3 ) );
    this.star.addAttribute( 'size', new THREE.BufferAttribute( this.sizes, 1 ) );
    this.starMesh = new THREE.Points( this.star, opts.starMaterial );
    this.starMesh.lookAt(opts.lookAt);


    this.line = new THREE.BufferGeometry();
    this.materialLine = new THREE.LineBasicMaterial({ transparent:true, color: 0x89a8ff });
    this.materialLine.opacity = 0;

    this.line.addAttribute( 'position', new THREE.BufferAttribute( this.vertexs, 3 ) );

    this.lineMesh = new THREE.Line( this.line, this.materialLine );
    this.lineMesh.visible = false;
    this.lineMesh.lookAt(opts.lookAt);


    this.group.position.x = opts.position.x;
    this.group.position.y = opts.position.y;
    this.group.position.z = opts.position.z;
    this.group.scale.set(1.5,1.5,1.5);
    this.group.add( this.starMesh,this.lineMesh );//
};
PutStar.prototype.showLine = function() {
    this.lineMesh.visible = true;
    this.stop = false;
    var This = this;
    var l = this.sizes.length;
    var opacitySpeed = 0.003;
    var opacity = 0;

    function go(){
        if(This.stop)return;
        var time = Date.now() * 0.005;
        opacity += opacitySpeed;
        if(opacity>1) opacity = 1.0;
        This.materialLine.opacity = Math.min(opacity,0.5);
        for ( var i = 0; i < l; i++ ) {
            This.sizes[ i ] = 6 + 2*( 1 + Math.sin( 0.3 * i + time ) );
        }

        This.star.attributes.size.needsUpdate = true;
        requestAnimationFrame( go );
    };
    go();
};
PutStar.prototype.hideLine = function() {
    var This = this;
    var opacitySpeed = 0.006;
    var opacity = This.materialLine.opacity;
    function go(){
        var stop = opacity<=0;
        opacity -= opacitySpeed;
        This.materialLine.opacity = Math.max(opacity,0.0);

        if(!stop){
            requestAnimationFrame( go );
        }else{
            This.stop = true;
            This.initSize();
        }
    };
    go();
}
PutStar.prototype.initSize = function() {
    var This = this;
    var l = This.sizes.length;
    var target = new Float32Array(l);;
    for ( var i = 0; i < l; i++ ) {
        var rr = Math.random()<0.1,
            bb = rr?8.0:4.0;
            target[ i ] = Math.random()*bb;
    }
    this.goMove({
        sizes: This.sizes,
        to: target,
        time: 300,
        fx: 'easeOut',
        update: function(){
            This.star.attributes.size.needsUpdate = true;
        },
        complete: function(){
            This.lineMesh.visible = false;
        }
    });
};
PutStar.prototype.goMove = function(opts) {
    var Tween = {
        linear: function (t, b, c, d){  //匀速
            return c*t/d + b;
        },
        easeIn: function(t, b, c, d){  //加速曲线
            return c*(t/=d)*t + b;
        },
        easeOut: function(t, b, c, d){  //减速曲线
            return -c *(t/=d)*(t-2) + b;
        },
        easeBoth: function(t, b, c, d){  //加速减速曲线
            if ((t/=d/2) < 1) {
                return c/2*t*t + b;
            }
            return -c/2 * ((--t)*(t-2) - 1) + b;
        }
    }
    var startTime = Date.now(),
        sizes = opts.sizes,
        to = opts.to,
        time = opts.time,
        fx = opts.fx,
        l = sizes.length,
        This = this,
        from = new Float32Array(l);
        for(var a=0,l=l;a<l;a++){
            from[a] = sizes[a];
        };
    function go(){
        var now = Date.now(),
            progress = now-startTime,
            stop = progress>time;
        for(var i=0;i<l;i++){
            sizes[i] = Tween[fx]( progress, from[i], to[i]-from[i], time);
        }
        opts.update&&opts.update();
        if(!stop){
            requestAnimationFrame( go );
        }else{
            opts.complete&&opts.complete();
        }
    };
    go();
}