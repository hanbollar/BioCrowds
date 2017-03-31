
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Noise from './noise'
import {other} from './noise'

import AllAgents from './agents.js'


var sceneData = {
  onScene: 0
};

// called after the scene loads
function onLoad(framework) {

  // declaring all left variables in this scope as same as member obj from framework with same names
  var {scene, camera, renderer, gui, stats} = framework; 

  // set skybox
  var loader = new THREE.CubeTextureLoader();
  var urlPrefix = './skymap/';
  var skymap = new THREE.CubeTextureLoader().load([
      urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
      urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
      urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
  ] );
  scene.background = skymap;

  // adding directional light
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);

   // set camera position
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // initialize a simple plane with adam's face as material
  var planeTop = new THREE.PlaneGeometry(3, 3, 3, 3);
  var planeBottom = new THREE.PlaneGeometry(3, 3, 3, 3);
  // make appear double sided
  planeBottom.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI ) );

  var adamMaterialOne = new THREE.ShaderMaterial({
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./adamOne.jpg')
      }
    },
    vertexShader: require('./shaders/adam-vert.glsl'),
    fragmentShader: require('./shaders/adam-frag.glsl'),
  });
  var adamMaterialTwo = new THREE.ShaderMaterial({
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./adamTwo.jpg')
      }
    },
    vertexShader: require('./shaders/adam-vert.glsl'),
    fragmentShader: require('./shaders/adam-frag.glsl'),
  });

  // var adamCube = new THREE.Mesh(plane, doubleAdamMaterial);
  var mesh1 = new THREE.Mesh(planeTop, adamMaterialOne);
  var mesh2 = new THREE.Mesh(planeBottom, adamMaterialTwo);
  var adamPlane = new THREE.Object3D();
  //putting the planes together into one object
  adamPlane.add(mesh1);
  adamPlane.add(mesh2);
  
  // make plane horizontal
  adamPlane.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2));
  
  scene.add(adamPlane);

  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(sceneData, 'onScene', 0, 1).step(1).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });
}

// called on frame updates
function onUpdate(framework) {
  // console.log("here?");
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
