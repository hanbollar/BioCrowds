
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import AllAgents from './agents.js'

var M_PI = 3.14159265359;

var adamMaterialOne;
var adamMaterialTwo;
var basicMaterialOne;
var basicMaterialTwo;

var scenePlane;
var planeTop;
var planeBottom; 
var mesh1;
var mesh2;

// set up so THREE.Vector3(...) where orig pos then target pos based on
//    num of agents currently being used
var positionsArray = new Array();

var sceneData = {
  onScene: 0,
  usingMaterial: 0,
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
  if (sceneData.usingMaterial == 0) {
    sceneData.materialOne = basicMaterialOne;
    sceneData.materialTwo = basicMaterialTwo;
  } else if (sceneData.usingMaterial == 1) {
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

/****************************************************************************/
/****************** New Orientation for Beg Scene ***************************/
/****************************************************************************/

// set orig position and ending position based on num agents in the scene
function buildCircleScene() {
  var posOrig = new THREE.Vector2(0, 0, 0); 
  var posTarget = new THREE.Vector2(0, 0, 0); 
  var num = sceneData.nAgents;
  var radius = 4;

  positionsArray = new Array();

  for (var i = 0; i < num; i++) {
    // circle shape
    var theta = 2*M_PI/num * i;
    var xLoc = radius * Math.cos(theta);
    var zLoc = radius * Math.sin(theta);
    var xLocDest = radius * Math.cos(theta + M_PI);
    var zLocDest = radius * Math.sin(theta + M_PI);

    posOrig = new THREE.Vector3(xLoc, zLoc);
    posTarget = new THREE.Vector3(xLocDest, zLocDest);

    positionsArray.push(posOrig);
    positionsArray.push(posTarget);
  }
}

function buildParrallelScene() {
  var posOrig = new THREE.Vector2(0, 0); 
  var posTarget = new THREE.Vector2(0, 0); 
  var num = sceneData.nAgents;
  var dist = 1;
  var horizDist = 8;
  var horizOffset = horizDist/(num/4);

  positionsArray = new Array();

  for (var i = 0; i < num; i++) {
    // two lines
    var it = i;
    var zLoc = 1;
    var zLocDest = -1;
    if (i > Math.floor(num/2)) {
      it = i % Math.floor(num/2);
      zLoc = -1;
      zLocDest = 1;
    }

    var xLoc = horizOffset*it*zLoc;
    var zLoc = horizOffset*it*zLocDest;

    posOrig = new THREE.Vector3(xLoc, zLoc);
    posTarget = new THREE.Vector3(xLocDest, zLocDest);

    positionsArray.push(posOrig);
    positionsArray.push(posTarget);
  }
}

/**************************************************************************/
/****************** Load and onUpdate Functions ***************************/
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
  sceneData.allAgents = new AllAgents(sceneData.nAgents, sceneData.nMarkers, sceneData.usingMaterial, sceneData.vDebug);
  sceneData.allAgents.addDataToScene(framework);

  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(sceneData, 'usingMaterial', 0, 1).step(1).onChange(function(newVal) {
    scene.remove(scenePlane);

    for (var i = scenePlane.children.length - 1; i >= 0; i--) {
        scenePlane.remove(scenePlane.children[i]);
    }

    updateSceneMaterials();
    updateMesh();
    scene.add(scenePlane);
  });

  gui.add(sceneData, 'onScene', 0, 1).step(1).onChange(function(newVal) {
    if (sceneData.onScene == 0) {
      buildCircleScene();
    } else if (sceneData.onScene == 1) {
      buildParrallelScene();
    } else {
      console.log("ONSCENE: NO PROPER SCENE TO BE LOADED");
    }

    console.log("TO DO: NEED TO ADD SOME UPDATES HERE PROBABLY DUE TO ORIG POSITION CHANGING");
  });

  gui.add(sceneData, 'nAgents', 1, 20).step(1).onChange(function(newVal) {


    // TO DO


  });
}

// called on frame updates
function onUpdate(framework) {
  // console.log("here?");
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
