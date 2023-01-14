import * as THREE from 'three';

export default class Apple {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.appleMesh = new THREE.Group();
    this.generate();
  }

  generate() {
    var appleMat = new THREE.MeshLambertMaterial({
      color: 0xffff00
    });

    var stalkMat = new THREE.MeshLambertMaterial({
      color: 0x339e33
    });

    var sideMat = new THREE.MeshLambertMaterial({
      color: 0xff260
    });

    // 整体
    var bodyGeometry = new THREE.CylinderGeometry(4, 3, 8, 6, 1);
    bodyGeometry.attributes.position.setY(8, bodyGeometry.attributes.position.getY(8) + 1);
    bodyGeometry.attributes.position.setY(9, bodyGeometry.attributes.position.getY(9) + .1);
    bodyGeometry.attributes.position.needsUpdate = true;
    this.body = new THREE.Mesh(bodyGeometry, appleMat);

    // 柄
    var stalkGeometry = new THREE.BoxBufferGeometry(2, 6, 1, 1);
    stalkGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 5, 0));
    stalkGeometry.attributes.position.setX(2, stalkGeometry.attributes.position.getX(2) - 1);
    stalkGeometry.attributes.position.setX(3, stalkGeometry.attributes.position.getX(3) - 1);
    stalkGeometry.attributes.position.setX(6, stalkGeometry.attributes.position.getX(6) + 1);
    stalkGeometry.attributes.position.setX(7, stalkGeometry.attributes.position.getX(7) + 1);
    stalkGeometry.attributes.position.needsUpdate = true;

    this.stalk = new THREE.Mesh(stalkGeometry, stalkMat);
    this.stalk.position.set(1, 1, 0);
    this.stalk.rotation.z = 0.3;
    this.stalk.rotation.x = 0.1;

    var sideGeom = new THREE.CylinderGeometry(2, 2, 4);
    this.side = new THREE.Mesh(sideGeom, sideMat);
    this.side.position.set(Math.random(), 1, 1.65);
    this.side.rotation.x = 0.13;

    this.appleMesh.add(this.body);
    this.appleMesh.add(this.stalk);
    this.appleMesh.add(this.side);

    this.body.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    this.appleMesh.scale.set(2, 2, 2);
    this.appleMesh.position.set(this.x, this.y, this.z);
  }
}
