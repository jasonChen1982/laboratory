console.clear();
window.addEventListener('load', function() {
    if (!Detector.webgl) Detector.addGetWebGLMessage();

    var w = window.innerWidth,
        h = window.innerHeight,
        spaceSize = 700;

    var container, renderer, scene, camera, controls;

    var simplex = new FastSimplexNoise({
        min: 0,
        max: 1
    });

    var agents, nbAgents = 2500;

    function Agent(x, y, z) {
        this.pos = new THREE.Vector3(x, y, z);
        this.vel = new THREE.Vector3();
        this.acc = new THREE.Vector3();
        this.mass = 1;
        this.maxSpeed = 3;
        this.maxForce = 0.3;
        this.theta = 0;
        this.phi = 0;

        this.material = new THREE.MeshPhongMaterial({
            color: 0xfb3550,
            shading: THREE.FlatShading
        });

        var geometry = new THREE.CylinderGeometry(0, 5, 30, 8);
        geometry.rotateX(Math.PI / 2);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.position.copy(this.pos);
        this.mesh.up.set(0, 0, 1);
        scene.add(this.mesh);
    }

    Agent.prototype.seek = function(target) {
        var desired = target.clone().sub(this.pos);

        var d = desired.length();
        if (d < 20) {
            var m = d / 20 * this.maxSpeed;
            desired.setLength(m);
        } else {
            desired.setLength(this.maxSpeed);
        }

        var steer = desired.clone().sub(this.vel);
        if (steer.lengthSq() > this.maxSpeed * this.maxSpeed) steer.setLength(this.maxForce);

        this.applyForce(steer);
    };

    Agent.prototype.wander = function(t) {
        var wanderR = 25;
        var wanderD = 80;
        var change = 0.3 * Math.PI * 4;
        this.theta = simplex.in3D(t / 10000 + this.pos.x / 500, this.pos.y / 800, this.pos.z / 720) * change;
        this.phi = simplex.in3D(t / 10000 + this.pos.y / 500, this.pos.z / 800, this.pos.x / 720) * change;

        var sphereloc = this.vel.clone();
        sphereloc.setLength(wanderD);
        sphereloc.add(this.pos);

        var sphereOffSet = new THREE.Vector3(
            wanderR * Math.sin(this.theta) * Math.cos(this.phi),
            wanderR * Math.sin(this.theta) * Math.sin(this.phi),
            wanderR * Math.cos(this.theta)
        );
        sphereOffSet.lerp(this.vel, 0.5);
        var target = sphereloc.add(sphereOffSet);
        this.seek(target);
    };

    Agent.prototype.applyForce = function(force) {
        var f = force.clone();
        f.divideScalar(this.mass);
        this.acc.add(f);
    };

    Agent.prototype.border = function() {
        var margin = 10;
        if (this.pos.lengthSq() > spaceSize * spaceSize + margin * margin) {
            this.pos.multiplyScalar(-1).setLength( spaceSize );
        }
    };

    Agent.prototype.update = function(t) {
        this.vel.add(this.acc);
        if (this.vel.lengthSq() > this.maxSpeed * this.maxSpeed) this.vel.setLength(this.maxSpeed);
        this.pos.add(this.vel);

        // reset acceleration
        this.acc.set(0, 0, 0);

        this.mesh.position.copy(this.pos);
        this.mesh.lookAt(this.pos.clone().add(this.vel));
    };

    (function init() {
        // renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(w, h);
        container = document.getElementById('container');
        container.appendChild(renderer.domElement);

        // world
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x1E2630, 0.0012);
        renderer.setClearColor(scene.fog.color);

        // camera
        camera = new THREE.PerspectiveCamera(60, w / h, 1, 2000);
        camera.position.x = 0;
        camera.position.y = 400;
        camera.position.z = 500;
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        // lights
        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1);
        scene.add(light);
        light = new THREE.DirectionalLight(0x002288);
        light.position.set(-1, -1, -1);
        scene.add(light);
        light = new THREE.AmbientLight(0x222222);
        scene.add(light);

        // Dome
        geometry = new THREE.IcosahedronGeometry(spaceSize, 1);
        var domeMaterial = new THREE.MeshPhongMaterial({
            color: 0x1E2630,
            shading: THREE.FlatShading,
            side: THREE.BackSide
        });
        var dome = new THREE.Mesh(geometry, domeMaterial);
        scene.add(dome);

        agents = (new Array(nbAgents)).fill(0).map(d =>
            new Agent(
                (Math.random() * 2 - 1) * spaceSize,
                (Math.random() * 2 - 1) * spaceSize,
                (Math.random() * 2 - 1) * spaceSize
            )
        );

        window.addEventListener('resize', onWindowResize, false);
    })();

    function onWindowResize() {
        w = window.innerWidth;
        h = window.innerHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    (function animate(t) {
        requestAnimationFrame(animate);

        agents.forEach(agent => {
            agent.wander(t);
            agent.border();
            agent.update(t);
        });

        renderer.render(scene, camera);
    })(0);
});