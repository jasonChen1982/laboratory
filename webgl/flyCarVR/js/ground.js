function Ground(options) {
  options = options || {};
  this.doc = new THREE.Group();
  this.land = new Land(options);
  this.doc.add(this.land.doc);
}


function Land(options){
  this.doc = new THREE.Group();
  var material = new THREE.MeshBasicMaterial( {color: options.land.color||0xd6d6d6} );
  var geometry = new THREE.Geometry();

  var x0 = -options.land.w/2;
  var zz = -options.land.h/2;
  var x1 = -options.road.w/2;
  var ss = options.markings.space;
  var sw = options.markings.w;


  geometry.vertices.push(
      new THREE.Vector3( x0, 0,  zz ),
      new THREE.Vector3( x0, 0, -zz ),
      new THREE.Vector3( x1, 0,  zz ),
      new THREE.Vector3( x1, 0, -zz ),

      new THREE.Vector3( -x1, 0,  zz ),
      new THREE.Vector3( -x1, 0, -zz ),
      new THREE.Vector3( -x0, 0,  zz ),
      new THREE.Vector3( -x0, 0, -zz )
  );
  geometry.faces.push( new THREE.Face3( 0, 1, 2 ),new THREE.Face3( 2, 1, 3 ),new THREE.Face3( 4, 5, 6 ),new THREE.Face3( 6, 5, 7 ) );
  geometry.computeBoundingSphere();

  this.land = new THREE.Mesh( geometry, material );

  var materialRoad = new THREE.MeshBasicMaterial( {color: options.road.color||0x4a4a4a} );
  var geometryRoad = new THREE.Geometry();
  geometryRoad.vertices.push(
      new THREE.Vector3( x1, 0,  zz ),
      new THREE.Vector3( x1, 0, -zz ),
      new THREE.Vector3( -x1, 0,  zz ),
      new THREE.Vector3( -x1, 0, -zz )
  );
  geometryRoad.faces.push( new THREE.Face3( 0, 1, 2 ),new THREE.Face3( 2, 1, 3 ) );
  geometryRoad.computeBoundingSphere();

  this.road = new THREE.Mesh( geometryRoad, materialRoad );

  var materialMarkings = new THREE.MeshBasicMaterial( {color: options.markings.color||0xffffff} );
  var geometryMarkings = new THREE.Geometry();
  geometryMarkings.vertices.push(
      new THREE.Vector3( x1-ss-sw, 0.1,  zz ),
      new THREE.Vector3( x1-ss-sw, 0.1, -zz ),
      new THREE.Vector3( x1-ss, 0.1,  zz ),
      new THREE.Vector3( x1-ss, 0.1, -zz ),

      new THREE.Vector3( -x1+ss, 0.1,  zz ),
      new THREE.Vector3( -x1+ss, 0.1, -zz ),
      new THREE.Vector3( -x1+ss+sw, 0.1,  zz ),
      new THREE.Vector3( -x1+ss+sw, 0.1, -zz )
  );
  geometryMarkings.faces.push( new THREE.Face3( 0, 1, 2 ),new THREE.Face3( 2, 1, 3 ),new THREE.Face3( 4, 5, 6 ),new THREE.Face3( 6, 5, 7 ) );
  geometryMarkings.computeBoundingSphere();
  this.markings = new THREE.Mesh( geometryMarkings, materialMarkings );

  this.doc.add(this.land,this.road,this.markings);
}