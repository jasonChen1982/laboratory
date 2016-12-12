var pathConfig = [
    [
        new THREE.Vector4(   0,   0,   7, 1),
        new THREE.Vector4(   0,   0,   6, 1),
        new THREE.Vector4(   0,   0,   2, 1),
        new THREE.Vector4( 1.5,   0, 3.7, 1),
        new THREE.Vector4( 2.8,   0, 2.8, 1),
        new THREE.Vector4( 3.7,   0, 1.5, 1),
        new THREE.Vector4(   4,   0,   0, 1),
    ],
    [
        new THREE.Vector4(   4,   0,   0, 1),
        new THREE.Vector4( 3.7,   0,-1.5, 1),
        new THREE.Vector4( 2.8,   0,-2.8, 1),
        new THREE.Vector4( 1.5,   0,-3.7, 1),
        new THREE.Vector4(   0,   0,  -4, 1),
    ],
    [
        new THREE.Vector4(   0,   0,  -4, 1),
        new THREE.Vector4(-1.5,   0,-3.7, 1),
        new THREE.Vector4(-2.8,   0,-2.8, 1),
        new THREE.Vector4(-3.7,   0,-1.5, 1),
        new THREE.Vector4(  -4,   0,   0, 1),
    ],
    [
        new THREE.Vector4(  -4,   0,   0, 1),
        new THREE.Vector4(-3.7,   0, 1.5, 1),
        new THREE.Vector4(-2.8,   0, 2.8, 1),
        new THREE.Vector4(-1.5,   0, 3.7, 1),
        new THREE.Vector4(   0,   0,   2, 1),
        new THREE.Vector4(   0,   0,   6, 1),
        new THREE.Vector4(   0,   0,   7, 1),
    ]
];
var nurbsPool = pathConfig.map(function(it){
    return new CreatePath(it);
});
// console.log(nurbsPool);