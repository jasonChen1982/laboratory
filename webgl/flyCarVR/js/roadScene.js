function RoadScene(options) {
    options = options || {};
    this.doc = new THREE.Group();

    this.tweenMax = new TimelineMax({ paused: true });

    this.init();
}
RoadScene.prototype.init = function() {
    this.buildMark();
    this.buildRoadLamp();
    this.buildRoom();

    this.tweenMax.time(0);
    this.tweenMax.play();
};
RoadScene.prototype.buildMark = function() {

    var geometryMark = new THREE.Geometry();
    var materialMark = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (var j = -1, jj = 0; j < 2; j++, jj++) {
        var x = j * 20;
        for (var i = 0; i < 21; i++) {
            var idx = i - 10;
            geometryMark.vertices.push(
                new THREE.Vector3(-0.6 + x, 0.1, idx * 80),
                new THREE.Vector3(-0.6 + x, 0.1, idx * 80 + 40),
                new THREE.Vector3(0.6 + x, 0.1, idx * 80),
                new THREE.Vector3(0.6 + x, 0.1, idx * 80 + 40)
            );
            geometryMark.faces.push(new THREE.Face3(0 + jj * 21 * 4 + i * 4, 1 + jj * 21 * 4 + i * 4, 2 + jj * 21 * 4 + i * 4), new THREE.Face3(2 + jj * 21 * 4 + i * 4, 1 + jj * 21 * 4 + i * 4, 3 + jj * 21 * 4 + i * 4));
        }
    }
    this.mark = new THREE.Mesh(geometryMark, materialMark);
    this.doc.add(this.mark);

    this.tweenMax.add(TweenMax.fromTo(this.mark.position, 1, { z: 0, }, { z: 80, ease: Power0.easeNone, repeat: -1 }), 0);

};
RoadScene.prototype.buildRoadLamp = function() {

    this.roadLamp = new THREE.Group();

    var This = this;
    var tree = null,
        lamp = null;
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('./model/');
    mtlLoader.load('tree.mtl', function(materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('./model/');
        objLoader.load('tree.obj', function(object) {
            object.scale.set(13, 13, 13);
            tree = object;
            tryBuild();
        });
    });



    var mtlLoader1 = new THREE.MTLLoader();
    mtlLoader1.setPath('./model/');
    mtlLoader1.load('lamp.mtl', function(materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('./model/');
        objLoader.load('lamp.obj', function(object) {
            object.scale.set(13, 13, 13);
            lamp = object;
            tryBuild();
        });
    });

    function tryBuild() {
        if (lamp && tree) build(lamp, tree);
    }

    function build(lamp, tree) {
        for (var i = 0; i < 13; i++) {
            var idx = i - 6;
            var lampL = lamp.clone();
            var lampR = lamp.clone();
            lampL.position.set(-48, 0, idx * 160 + 20);
            lampR.rotation.y = Math.PI;
            lampR.position.set(48, 0, idx * 160 + 20);
            var treeL = tree.clone();
            var treeR = tree.clone();
            treeL.position.set(-90, 0, idx * 160);
            treeR.rotation.y = Math.PI;
            treeR.position.set(90, 0, idx * 160);
            This.roadLamp.add(lampL, lampR, treeL, treeR);
        }
    }


    this.doc.add(this.roadLamp);
    this.tweenMax.add(TweenMax.fromTo(this.roadLamp.position, 1, { z: 0, }, { z: 160, ease: Power0.easeNone, repeat: -1 }), 0);

};

var COLORS = [0x5b96f9, 0xc5a58b, 0xFFD26E, 0x54ffc3, 0xffec50, 0xff5745, 0xFFD26E, 0xffec50, 0xff5745, 0x54ffc3, 0xFFD26E, 0xff5745];
RoadScene.prototype.buildRoom = function() {
    this.room = new THREE.Group();
    this.roomTween = [];

    var num = 12;
    var btn = false;

    for (var i = 0; i < num; i++) {
        btn = !btn;
        var random = Math.random();
        var color = COLORS[i];
        var room = new THREE.Mesh(new THREE.BoxGeometry(60, 120, 60), new THREE.MeshLambertMaterial({
            color: color
        }));
        room.position.x = btn ? -160 : 160;
        room.position.z = -1000;
        room.position.y = 58;
        this.room.add(room);
        var tween = TweenMax.to(room.position, 12.5, { z: 1000, ease: Power0.easeNone, repeat: -1 });
        var progress = THREE.Math.clamp((i + random - 0.5) / num, 0, 1);

        tween.progress(progress);
        this.roomTween.push(tween);
        // this.tweenMax.add(tween,progress);
    }

    this.doc.add(this.room);

};
RoadScene.prototype.speedUp = function(speed) {
    speed = speed || 0.01;
    var timeScale = THREE.Math.clamp(this.tweenMax.timeScale() + speed, 0.4, 8);
    // console.log();
    this.tweenMax.timeScale(timeScale);
    this.changeSpeed(timeScale);
    // return timeScale;
};
RoadScene.prototype.speedDown = function() {
    var timeScale = THREE.Math.clamp(this.tweenMax.timeScale() - 0.04, 0.4, 8);
    // console.log();
    this.tweenMax.timeScale(timeScale);
    this.changeSpeed(timeScale);
    // return timeScale;
};
RoadScene.prototype.changeSpeed = function(timeScale) {
    var l = this.roomTween.length;
    for (var i = 0; i < l; i++) {
        this.roomTween[i].timeScale(timeScale);
    }
};
