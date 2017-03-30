
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Noise from './noise'
import {other} from './noise'

var starField = null;
var clock = null;
var target = null;

//var target = new THREE.Vector3(1,0,0);

// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // LOOK: the line below is synyatic sugar for the code above. Optional, but I sort of recommend it.
  // var {scene, camera, renderer, gui, stats} = framework; 

  // initialize a simple box and material
  var box = new THREE.Plane(THREE.Vector3(0, 1, 0), 0);

  var adamMaterial = new THREE.ShaderMaterial({
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./adam.jpg')
      }
    },
    vertexShader: require('./shaders/adam-vert.glsl'),
    fragmentShader: require('./shaders/adam-frag.glsl')
  });
  var adamCube = new THREE.Mesh(box, adamMaterial);

  // set camera position
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

  scene.add(adamCube);

  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  // ADD PARTICLES TO MESH

  // var sphere = new THREE.SphereGeometry(10, 32, 32);
  // target = new THREE.Mesh(sphere, adamMaterial);

  // //target = sphereMesh;

  // var starsGeometry = new THREE.Geometry();
  // for ( var i = 0; i < target.geometry.vertices.length; i ++ ) {

  //   var star = new THREE.Vector3(0,0,0);
  //   star.x = THREE.Math.randFloatSpread( 100 );
  //   star.y = THREE.Math.randFloatSpread( 100 );
  //   star.z = THREE.Math.randFloatSpread( 100 );

  //   starsGeometry.vertices.push( star );
  // }

  // var starsMaterial = new THREE.PointsMaterial( { color: 0xff0000 } )
  // starsMaterial.size = 0.1;
  // starField = new THREE.Points( starsGeometry, starsMaterial );

  // scene.add( starField );

  // clock = new THREE.Clock();

}

// var one = false;


// called on frame updates
function onUpdate(framework) {
  // console.log(`the time is ${new Date()}`);

  // if (starField == null) {
  //   onLoad(framework);
  // }

  // var delT = clock.getDelta();

  // //var newPosForGeo = new Array();

  // // if (!one) {
  //   for (var i = 0; i < target.geometry.vertices.length; i++) {
  //     var pos = starField.geometry.vertices[i];
  //     var targetUsing = target.geometry.vertices[i];

  //     var minus = new THREE.Vector3(targetUsing.x - pos.x, targetUsing.y - pos.y, targetUsing.z - pos.z);
  //     var velo = minus.normalize();
  //     //velo = new THREE.Vector3(Math.ceil(velo.x), Math.ceil(velo.y), Math.ceil(velo.z));

  //     var veloNew = new THREE.Vector3(velo.x * delT * 10.0, velo.y * delT * 10.0, velo.z * delT * 10.0);

  //     var within = 0.005;
  //     if (Math.abs(veloNew.x - 0.0) < within && Math.abs(veloNew.y - 0.0) < within && Math.abs(veloNew.z - 0.0) < within){
  //       veloNew = 0.0;
  //     }

  //     pos = new THREE.Vector3(pos.x + veloNew.x, pos.y + veloNew.y, pos.z + veloNew.z);
    

  //     starField.geometry.vertices[i].x = pos.x;
  //     starField.geometry.vertices[i].y = pos.y;
  //     starField.geometry.vertices[i].z = pos.z;
  //     //newPosForGeo.push(new THREE.Vector3(posNew.x, posNew.y, posNew.z));
  //   }

  //   //starField.geometry.vertices = newPosForGeo;
  //   starField.geometry.verticesNeedUpdate = true;

    // one = true;
  // }

/*
  var time = (new Date()).getTime();

  // if (time % 5 == 0) {
        if (starField == null) {
          onLoad(framework);
        }

        // MOVE PARTICLES
        // for each particle move closer to target location
        for (var i = 0; i<target.geometry.vertices.length; i++) {
          var velo = new THREE.Vector3(target - geoVerts[i]);
          starField.geometry.vertices[i] += (time - timePrev) * (velo.normalize());
          //console.log("updating positions: " + i);
          // console.log(starField.geometry.vertices[i].x);
          console.log(starField.geometry.vertices);
          // console.log(starField);
        }

        geo.verticesNeedsUpdate = true;
        // console.log("updated positions");
   // }

   timePrev = time;
   */
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);

// console.log('hello world');

// console.log(Noise.generateNoise());

// Noise.whatever()

// console.log(other())