import * as THREE from 'three';

var Bridge;
export default (Bridge = function() {
  this.bridgeMesh = new THREE.Group();
  var woodMat = new THREE.MeshLambertMaterial({
    color: 0x543b14,//0x3d2f19,//0xa98f78,
    side: THREE.DoubleSide
  });

  //bridge - wood block
  for (var i = 0; i < 15; i++) {
    var blockGeom = new THREE.BoxGeometry(10, 3, 70);
    var block = new THREE.Mesh(blockGeom, woodMat);
    block.position.set(15 * i - 105, -13, 150);
    block.castShadow = true;
    //block.receiveShadow = true;
    this.bridgeMesh.add(block);
  }
  //bridge - rail
  var geometry_rail_v = new THREE.BoxGeometry(3, 20, 3);
  this.rail_1 = new THREE.Mesh(geometry_rail_v, woodMat);
  this.rail_1.position.set(-90, -6, 180);
  this.rail_1.castShadow = true;
  //customizeShadow(rail_1, 0.2);
  this.bridgeMesh.add(this.rail_1);

  var rail_2 = new THREE.Mesh(geometry_rail_v, woodMat);
  rail_2.position.set(90, -6, 180);
  rail_2.castShadow = true;
  //customizeShadow(rail_2, 0.2);
  this.bridgeMesh.add(rail_2);

  var rail_3 = new THREE.Mesh(geometry_rail_v, woodMat);
  rail_3.position.set(-90, -6, 120);
  rail_3.castShadow = true;
  //customizeShadow(rail_3, 0.2);
  this.bridgeMesh.add(rail_3);

  var rail_4 = new THREE.Mesh(geometry_rail_v, woodMat);
  rail_4.position.set(90, -6, 120);
  rail_4.castShadow = true;
  //customizeShadow(rail_4, 0.2);
  this.bridgeMesh.add(rail_4);

  var geometry_rail_h = new THREE.BoxGeometry(220, 3, 3);
  var rail_h1 = new THREE.Mesh(geometry_rail_h, woodMat);
  rail_h1.position.set(0, 5, 180);
  rail_h1.castShadow = true;
  //customizeShadow(rail_h1, 0.2);
  this.bridgeMesh.add(rail_h1);

  var rail_h2 = new THREE.Mesh(geometry_rail_h, woodMat);
  rail_h2.position.set(0, 5, 120);
  rail_h2.castShadow = true;
  //customizeShadow(rail_h2, 0.2);
  this.bridgeMesh.add(rail_h2);
  this.bridgeMesh.castShadow = true;
  this.bridgeMesh.receiveShadow = true;
  this.bridgeMesh.position.set(0, 0, 550);
});
