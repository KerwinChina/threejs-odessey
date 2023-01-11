import * as THREE from 'three';

var LeafTree;
import Apple from "./apples";

export default (LeafTree = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  //TREES
  this.treeMesh = new THREE.Group();
  //TRUNK
  var trunkMat = new THREE.MeshLambertMaterial({
    color: 0x543b14,
    side: THREE.DoubleSide
  });
  var trunkGeom = new THREE.BoxGeometry(20, 200, 20);
  this.trunkMesh = new THREE.Mesh(trunkGeom, trunkMat);
  this.trunkMesh.position.set(0, 58, 0);
  this.trunkMesh.castShadow = true;
  this.trunkMesh.receiveShadow = true;

  //APPLES
  var apple1 = new Apple(Math.random() * 10 - 70, Math.random() * 10 + 300, 78);
  var apple2 = new Apple(Math.random() * 10 - 1, Math.random() * 10 + 250, 78);
  var apple3 = new Apple(Math.random() * 10 + 65, Math.random() * 10 + 300, 78);
  var apple4 = new Apple(Math.random() * 10 + 45, Math.random() * 10 + 330, 78);
  var apple5 = new Apple(Math.random() * 10 + 15, Math.random() * 10 + 300, 78);
  var apple6 = new Apple(Math.random() * 10 - 35, Math.random() * 10 + 320, 78);
  var apple7 = new Apple(Math.random() * 10 - 55, Math.random() * 10 + 220, 78);
  var apple8 = new Apple(Math.random() * 10 + 55, Math.random() * 10 + 240, 78);

  apple1.appleMesh.rotation.x = -0.4;
  apple2.appleMesh.rotation.x = -0.4;
  apple3.appleMesh.rotation.x = -0.4;
  apple4.appleMesh.rotation.x = -0.4;
  apple5.appleMesh.rotation.x = -0.4;
  apple6.appleMesh.rotation.x = -0.4;
  apple7.appleMesh.rotation.x = -0.4;
  apple8.appleMesh.rotation.x = -0.4;
  var apple9 = new Apple(
    Math.random() * 10 - 70,
    Math.random() * 10 + 300,
    -80
  );
  var apple10 = new Apple(
    Math.random() * 10 - 1,
    Math.random() * 10 + 250,
    -80
  );
  var apple11 = new Apple(
    Math.random() * 10 + 65,
    Math.random() * 10 + 300,
    -80
  );
  var apple12 = new Apple(
    Math.random() * 10 + 45,
    Math.random() * 10 + 330,
    -80
  );
  var apple13 = new Apple(
    Math.random() * 10 + 15,
    Math.random() * 10 + 300,
    -80
  );
  var apple14 = new Apple(
    Math.random() * 10 - 35,
    Math.random() * 10 + 320,
    -80
  );
  var apple15 = new Apple(
    Math.random() * 10 - 55,
    Math.random() * 10 + 220,
    -80
  );
  var apple16 = new Apple(
    Math.random() * 10 + 55,
    Math.random() * 10 + 240,
    -80
  );
  apple9.appleMesh.rotation.x = +0.5;
  apple10.appleMesh.rotation.x = +0.5;
  apple11.appleMesh.rotation.x = +0.5;
  apple12.appleMesh.rotation.x = +0.5;
  apple13.appleMesh.rotation.x = +0.5;
  apple14.appleMesh.rotation.x = +0.5;
  apple15.appleMesh.rotation.x = +0.5;
  apple16.appleMesh.rotation.x = +0.5;

  var apple17 = new Apple(
    -80,
    Math.random() * 10 + 300,
    Math.random() * 10 - 70
  );
  var apple18 = new Apple(
    -80,
    Math.random() * 10 + 250,
    Math.random() * 10 - 1
  );
  var apple19 = new Apple(
    -80,
    Math.random() * 10 + 300,
    Math.random() * 10 + 65
  );
  var apple20 = new Apple(
    -80,
    Math.random() * 10 + 330,
    Math.random() * 10 + 45
  );
  var apple21 = new Apple(
    -80,
    Math.random() * 10 + 300,
    Math.random() * 10 + 15
  );
  var apple22 = new Apple(
    -80,
    Math.random() * 10 + 320,
    Math.random() * 10 - 35
  );
  var apple23 = new Apple(
    -80,
    Math.random() * 10 + 220,
    Math.random() * 10 - 55
  );
  var apple24 = new Apple(
    -80,
    Math.random() * 10 + 240,
    Math.random() * 10 + 55
  );

  apple17.appleMesh.rotation.z = -0.5;
  apple18.appleMesh.rotation.z = -0.5;
  apple19.appleMesh.rotation.z = -0.5;
  apple20.appleMesh.rotation.z = -0.5;
  apple21.appleMesh.rotation.z = -0.5;
  apple22.appleMesh.rotation.z = -0.5;
  apple23.appleMesh.rotation.z = -0.5;
  apple24.appleMesh.rotation.z = -0.5;

  var apple25 = new Apple(
    80,
    Math.random() * 10 + 300,
    Math.random() * 10 - 70
  );
  var apple26 = new Apple(80, Math.random() * 10 + 250, Math.random() * 10 - 1);
  var apple27 = new Apple(
    80,
    Math.random() * 10 + 300,
    Math.random() * 10 + 65
  );
  var apple28 = new Apple(
    80,
    Math.random() * 10 + 330,
    Math.random() * 10 + 45
  );
  var apple29 = new Apple(
    80,
    Math.random() * 10 + 300,
    Math.random() * 10 + 15
  );
  var apple30 = new Apple(
    80,
    Math.random() * 10 + 320,
    Math.random() * 10 - 35
  );
  var apple31 = new Apple(
    80,
    Math.random() * 10 + 220,
    Math.random() * 10 - 55
  );
  var apple32 = new Apple(
    80,
    Math.random() * 10 + 240,
    Math.random() * 10 + 55
  );
  apple25.appleMesh.rotation.z = +0.5;
  apple26.appleMesh.rotation.z = +0.5;
  apple27.appleMesh.rotation.z = +0.5;
  apple28.appleMesh.rotation.z = +0.5;
  apple29.appleMesh.rotation.z = +0.5;
  apple30.appleMesh.rotation.z = +0.5;
  apple31.appleMesh.rotation.z = +0.5;
  apple32.appleMesh.rotation.z = +0.5;

  //LEAVES
  var leavesMat = new THREE.MeshLambertMaterial({
    color: 0x016316,
    side: THREE.DoubleSide
  });
  var leavesGeom = new THREE.BoxGeometry(150, 230, 150);
  this.leavesMesh = new THREE.Mesh(leavesGeom, leavesMat);
  this.leavesMesh.position.set(0, 250, 0);
  this.leavesMesh.castShadow = true;

  this.treeMesh.add(this.trunkMesh);
  this.treeMesh.add(this.leavesMesh);
  this.treeMesh.castShadow = true;
  this.treeMesh.position.set(this.x, this.y, this.z);
  this.treeMesh.add(apple1.appleMesh);
  this.treeMesh.add(apple2.appleMesh);
  this.treeMesh.add(apple3.appleMesh);
  this.treeMesh.add(apple4.appleMesh);
  this.treeMesh.add(apple5.appleMesh);
  this.treeMesh.add(apple6.appleMesh);
  this.treeMesh.add(apple7.appleMesh);
  this.treeMesh.add(apple8.appleMesh);
  this.treeMesh.add(apple9.appleMesh);
  this.treeMesh.add(apple10.appleMesh);
  this.treeMesh.add(apple11.appleMesh);
  this.treeMesh.add(apple12.appleMesh);
  this.treeMesh.add(apple13.appleMesh);
  this.treeMesh.add(apple14.appleMesh);
  this.treeMesh.add(apple15.appleMesh);
  this.treeMesh.add(apple16.appleMesh);
  this.treeMesh.add(apple17.appleMesh);
  this.treeMesh.add(apple18.appleMesh);
  this.treeMesh.add(apple19.appleMesh);
  this.treeMesh.add(apple20.appleMesh);
  this.treeMesh.add(apple21.appleMesh);
  this.treeMesh.add(apple22.appleMesh);
  this.treeMesh.add(apple23.appleMesh);
  this.treeMesh.add(apple24.appleMesh);
  this.treeMesh.add(apple25.appleMesh);
  this.treeMesh.add(apple26.appleMesh);
  this.treeMesh.add(apple27.appleMesh);
  this.treeMesh.add(apple28.appleMesh);
  this.treeMesh.add(apple29.appleMesh);
  this.treeMesh.add(apple30.appleMesh);
  this.treeMesh.add(apple31.appleMesh);
  this.treeMesh.add(apple32.appleMesh);
});
