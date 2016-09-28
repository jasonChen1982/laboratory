var t = {width: 1.5,height: 1.5,depth: 10,segments: 12,slices: 6,xRange: 0.8,yRange: 0.1,zRange: 1,ambient: "#525252",diffuse: "#FFFFFF",speed: 0.0002};
var G = {count: 2,xyScalar: 1,zOffset: 100,ambient: "#002c4a",diffuse: "#005584",speed: 0.001,gravity: 1200,dampening: 0.95,minLimit: 10,maxLimit: null,minDistance: 20,maxDistance: 400,autopilot: false,draw: false,bounds: CAV.Vector3.create(),step: CAV.Vector3.create(Math.randomInRange(0.2, 1), Math.randomInRange(0.2, 1), Math.randomInRange(0.2, 1))};
var renderType = "canvas";
var E = "svg";
var nowRender = {renderer: renderType};
var iNowTime, startTime = Date.now();
var L = CAV.Vector3.create();
var k = CAV.Vector3.create();
var canvasBox = document.getElementById("anitOut");
// var canvasParent = document.getElementById("anitOut");
var renderer, scene, mesh, plane, material;
var render;
var r;
function start() {
    createRender();
    createScene();
    createMesh();
    createLight();
    onResize();
    reBuildMesh(canvasBox.offsetWidth, canvasBox.offsetHeight);
    goLoop();
}
function createRender() {
    render = new CAV.CanvasRenderer();
    switchRender(nowRender.renderer);
}
function switchRender(N) {
    if (renderer) {
        canvasBox.removeChild(renderer.element);
    }
    switch (N) {
        case renderType:
            renderer = render;
            break;
    }
    renderer.setSize(canvasBox.offsetWidth, canvasBox.offsetHeight);
    canvasBox.appendChild(renderer.element);
}
function createScene() {
    scene = new CAV.Scene();
}
function createMesh() {
    scene.remove(mesh);
    renderer.clear();
    plane = new CAV.Plane(t.width * renderer.width, t.height * renderer.height, t.segments, t.slices);
    material = new CAV.Material(t.ambient, t.diffuse);
    mesh = new CAV.Mesh(plane, material);
    scene.add(mesh);
    var N, O;
    for (N = plane.vertices.length - 1; N >= 0; N--) {
        O = plane.vertices[N];
        O.anchor = CAV.Vector3.clone(O.position);
        O.step = CAV.Vector3.create(Math.randomInRange(0.2, 1), Math.randomInRange(0.2, 1), Math.randomInRange(0.2, 1));
        O.time = Math.randomInRange(0, Math.PIM2);

        // O.step = CAV.Vector3.create();
        // O.time = 0;
    }
}
function createLight() {
    var O, N;
    for (O = scene.lights.length - 1; O >= 0; O--) {
        N = scene.lights[O];
        scene.remove(N);
    }
    renderer.clear();
    for (O = 0; O < G.count; O++) {
        N = new CAV.Light(G.ambient, G.diffuse);
        N.ambientHex = N.ambient.format();
        N.diffuseHex = N.diffuse.format();
        scene.add(N);
        N.mass = Math.randomInRange(0.5, 1);
        N.velocity = CAV.Vector3.create();
        N.acceleration = CAV.Vector3.create();
        N.force = CAV.Vector3.create();
    }
}
function reBuildMesh(O, N) {
    renderer.setSize(O, N);
    CAV.Vector3.set(L, renderer.halfWidth, renderer.halfHeight);
    createMesh();
}
function goLoop() {
    iNowTime = Date.now() - startTime;
    upData();
    renderFS();
    requestAnimationFrame(goLoop);
}
function upData() {
    var Q, P, O, R, T, V, U, S = t.depth / 2;
    CAV.Vector3.copy(G.bounds, L);
    CAV.Vector3.multiplyScalar(G.bounds, G.xyScalar);
    CAV.Vector3.setZ(k, G.zOffset);
    for (R = scene.lights.length - 1; R >= 0; R--) {
        T = scene.lights[R];
        CAV.Vector3.setZ(T.position, G.zOffset);
        var N = Math.clamp(CAV.Vector3.distanceSquared(T.position, k), G.minDistance, G.maxDistance);
        var W = G.gravity * T.mass / N;
        CAV.Vector3.subtractVectors(T.force, k, T.position);
        CAV.Vector3.normalise(T.force);
        CAV.Vector3.multiplyScalar(T.force, W);
        CAV.Vector3.set(T.acceleration);
        CAV.Vector3.add(T.acceleration, T.force);
        CAV.Vector3.add(T.velocity, T.acceleration);
        CAV.Vector3.multiplyScalar(T.velocity, G.dampening);
        CAV.Vector3.limit(T.velocity, G.minLimit, G.maxLimit);
        CAV.Vector3.add(T.position, T.velocity);
    }
    for (V = plane.vertices.length - 1; V >= 0; V--) {
        U = plane.vertices[V];
        Q = Math.sin(U.time + U.step[0] * iNowTime * t.speed);
        P = Math.cos(U.time + U.step[1] * iNowTime * t.speed);
        O = Math.sin(U.time + U.step[2] * iNowTime * t.speed);
        CAV.Vector3.set(U.position, t.xRange * plane.segmentWidth * Q, t.yRange * plane.sliceHeight * P, t.zRange * S * O - S);
        CAV.Vector3.add(U.position, U.anchor);
    }
    plane.dirty = true;
}
function renderFS() {
    renderer.render(scene);
}
function J(O) {
    var Q, N, S = O;
    var P = function(T) {
        for (Q = 0, l = scene.lights.length; Q < l; Q++) {
            N = scene.lights[Q];
            N.ambient.set(T);
            N.ambientHex = N.ambient.format();
        }
    };
    var R = function(T) {
        for (Q = 0, l = scene.lights.length; Q < l; Q++) {
            N = scene.lights[Q];
            N.diffuse.set(T);
            N.diffuseHex = N.diffuse.format();
        }
    };
    return {set: function() {
        P(S[0]);
        R(S[1]);
    }};
}
function onResize() {
    window.addEventListener("resize", j);
}
function A(N) {
    CAV.Vector3.set(k, N.x, renderer.height - N.y);
    CAV.Vector3.subtract(k, L);
}
function j(N) {
    reBuildMesh(canvasBox.offsetWidth, canvasBox.offsetHeight);
    renderFS();
}
start();