
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import AllAgents from './agents.js'

var adamMaterialOne;
var adamMaterialTwo;
var basicMaterialOne;
var basicMaterialTwo;

var scenePlane;
var planeTop;
var planeBottom; 
var mesh1;
var mesh2;

var sceneData = {
  onScene: 0,
  materialOne: null,
  materialTwo: null,
  allAgents: null,
  nAgents: 1,
  nMarkers: 1,
  vDebug: true
};

/**************************************************************************/
/****************** Create and Update Functions ***************************/
/**************************************************************************/

function createMaterials(){
  adamMaterialOne = new THREE.ShaderMaterial({
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./adamOne.jpg')
      }
    },
    vertexShader: require('./shaders/working-vert.glsl'),
    fragmentShader: require('./shaders/working-frag.glsl'),
  });

  adamMaterialTwo = new THREE.ShaderMaterial({
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./adamTwo.jpg')
      }
    },
    vertexShader: require('./shaders/working-vert.glsl'),
    fragmentShader: require('./shaders/working-frag.glsl'),
  });

  basicMaterialOne = new THREE.ShaderMaterial({
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./simpleOne.jpg')
      }
    },
    vertexShader: require('./shaders/working-vert.glsl'),
    fragmentShader: require('./shaders/working-frag.glsl'),
  });
  basicMaterialTwo = new THREE.ShaderMaterial({
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./simpleTwo.jpg')
      }
    },
    vertexShader: require('./shaders/working-vert.glsl'),
    fragmentShader: require('./shaders/working-frag.glsl'),
  });
}

function updateSceneMaterials(){
  if (sceneData.onScene == 0) {
    sceneData.materialOne = basicMaterialOne;
    sceneData.materialTwo = basicMaterialTwo;
  } else if (sceneData.onScene == 1) {
    sceneData.materialOne = adamMaterialOne;
    sceneData.materialTwo = adamMaterialTwo;
  } else {
    console.log("main: NO PROPER MATERIAL AVAILABLE");
  }

  updateMesh();
}

function createMesh() {
  // initialize a simple plane with adam's face as material
  planeTop = new THREE.PlaneGeometry(10, 10, 10, 10);
  planeBottom = new THREE.PlaneGeometry(10, 10, 10, 10);
  // make appear double sided
  planeBottom.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI ) );
  planeTop.applyMatrix( new THREE.Matrix4().makeRotationZ( Math.PI ));

  mesh1 = new THREE.Mesh(planeTop, sceneData.materialOne);
  mesh2 = new THREE.Mesh(planeBottom, sceneData.materialOne);
  scenePlane = new THREE.Object3D();
  //putting the planes together into one object
  scenePlane.add(mesh1);
  scenePlane.add(mesh2);
  
  // make plane horizontal
  scenePlane.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2));
}

function updateMesh() {
  mesh1 = new THREE.Mesh(planeTop, sceneData.materialOne);
  mesh2 = new THREE.Mesh(planeBottom, sceneData.materialOne);
  scenePlane = new THREE.Object3D();
  //putting the planes together into one object
  scenePlane.add(mesh1);
  scenePlane.add(mesh2);
  
  // make plane horizontal
  scenePlane.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2));
}

/**************************************************************************/
/***************(** Load and onUpdate Functions ***************************/
/**************************************************************************/

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

  // creating base scene mesh
  createMaterials();
  updateSceneMaterials();

  createMesh();
  updateMesh();
  scene.add(scenePlane);

  // adding elements to the scene
  sceneData.allAgents = new AllAgents(sceneData.nAgents, sceneData.nMarkers, sceneData.onScene, sceneData.vDebug);
  sceneData.allAgents.addDataToScene(framework);

  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(sceneData, 'onScene', 0, 1).step(1).onChange(function(newVal) {
    scene.remove(scenePlane);

    for (var i = scenePlane.children.length - 1; i >= 0; i--) {
        scenePlane.remove(scenePlane.children[i]);
    }

    updateSceneMaterials();
    updateMesh();
    scene.add(scenePlane);
  });
}

// called on frame updates
function onUpdate(framework) {
  // console.log("here?");
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
