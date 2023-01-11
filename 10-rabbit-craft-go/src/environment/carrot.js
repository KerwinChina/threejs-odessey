import * as THREE from 'three';

export default class Carrot {
  constructor() {
    this.carrotMesh = new THREE.Group();
    this.generate();
  }

  generate() {
    var carrotMat = new THREE.MeshLambertMaterial({
      color: 0xd9721e
    });

    var leafMat = new THREE.MeshLambertMaterial({
      color: 0x339e33
    });

    var bodyGeom = new THREE.CylinderGeometry(5, 3, 12, 4, 1);
    // bodyGeom.vertices[8].y += 2;
    // bodyGeom.vertices[9].y -= 3;

    this.body = new THREE.Mesh(bodyGeom, carrotMat);

    var leafGeom = new THREE.BoxBufferGeometry(5, 10, 1, 1);
    leafGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 5, 0));
    // leafGeom.vertices[2].x -= 1;
    // leafGeom.vertices[3].x -= 1;
    // leafGeom.vertices[6].x += 1;
    // leafGeom.vertices[7].x += 1;

    this.leaf1 = new THREE.Mesh(leafGeom, leafMat);
    this.leaf1.position.y = 7;
    this.leaf1.rotation.z = 0.3;
    this.leaf1.rotation.x = 0.2;

    this.leaf2 = this.leaf1.clone();
    this.leaf2.scale.set(1, 1.3, 1);
    this.leaf2.position.y = 7;
    this.leaf2.rotation.z = -0.3;
    this.leaf2.rotation.x = -0.2;

    this.carrotMesh.add(this.body);
    this.carrotMesh.add(this.leaf1);
    this.carrotMesh.add(this.leaf2);

    this.body.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    this.carrotMesh.scale.set(2, 2, 2);
    this.carrotMesh.position.set(-50, 0, 50);
  }
};

