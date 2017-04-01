const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much

var SPHERE_MATERIAL_NORM = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var CYL_GEO_NORM = new THREE.CylinderGeometry( 5, 5, 20, 32 );

var mat1 = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var mat2 = new THREE.MeshBasicMaterial( {color: 0x0000ff} );

var MARKER_HEIGHT = 0.03;
var AGENTS_HEIGHT = 1.5;
var AGENTS_RAD = AGENTS_HEIGHT / 5;
var AGENTS_HEIGHTPOS = 0.2;

/*****************************************************************/
/************ Class for all Agents as a Collective ***************/
/*****************************************************************/
export default class AllAgents {
  constructor(numAgents, numMarkers, onMat, visualDebug) {
    this.init(numAgents, numMarkers, onMat, visualDebug);
  }

  init(numAgents, numMarkers, onMat, visualDebug) {
    console.log("allAgents: init");
    this.numAgents = numAgents;
    this.numMarkers = numMarkers;
    this.onMat = onMat;
    this.visualDebug = visualDebug;

    this.allMarkers = new Array();
    this.allAgents = new Array();

    this.makeMarkers();
    this.makeAgents();
  }

  makeAgents() {
    console.log("allAgents: makeAgents");

    console.log("AGENTS_HEIGHT: " + AGENTS_HEIGHT);
    console.log("AGENTS_HEIGHTPOS: " + AGENTS_HEIGHTPOS);
    console.log("AGENTS_RAD: " + AGENTS_RAD);

    for (var i = 0; i < this.numAgents; i++) {
      var p = new THREE.Vector3(-1, AGENTS_HEIGHTPOS, 0);
      var v = new THREE.Vector3(0, 0, 0);
      var gL = new THREE.Vector3(1, 0, 0);
      var or = new THREE.Vector3(1, 0, 0);
      var s = AGENTS_RAD;
      var m = [];
      var wT = this.onMat;
      var a = new Agent(p, v, gL, or, s, m, wT);
      this.allAgents.push(a);
    }
  }

  addDataToScene(framework) {
    console.log("allAgents: addDataToScene");
    var usingPos = new THREE.Vector3(0, 0, 0);
    var usingSize = 0;
    for (var i = 0; i < this.numAgents; i++) {
      usingPos = this.allAgents[i].pos;
      usingSize = this.allAgents[i].size;
      this.allAgents[i].mesh.scale.set(usingSize, usingSize, usingSize);
      console.log(usingPos);
      this.allAgents[i].mesh.position.set( usingPos.x, usingPos.y, usingPos.z );

      framework.scene.add(this.allAgents[i].mesh);
    }
    for (var i = 0; i < this.numMarkers; i++) {
      usingPos = this.allMarkers[i].pos;
      usingSize = this.allMarkers[i].size;
      this.allMarkers[i].mesh.scale.set(usingSize, usingSize, usingSize);
      this.allMarkers[i].mesh.position.set( usingPos.x, usingPos.y, usingPos.z );

      framework.scene.add(this.allMarkers[i].mesh);
    }
  }

  updateAgentsPos() {
    console.log("allAgents: updateAgents");
    // TO DO
  }

  makeMarkers() {
    console.log("allAgents: makeMarkers");
    for (var i = 0; i < this.numMarkers; i++) {
      var p = new THREE.Vector3(0, MARKER_HEIGHT, 0); //
      var o = false;
      
      var m = new Marker(p, o);
      this.allMarkers.push(m);
    }
  }

  show() {
    console.log("allAgents: show");
    for (var i = 0; i < this.numMarkers; i++) {
      this.allMarkers[i].show();
    }
  };

  hide() {
    console.log("allAgents: hide");
    for (var i = 0; i < this.numMarkers; i++) {
      this.allMarkers[i].hide();
    }
  };

  update() {
    // TO DO

    if (this.visualDebug) {
      this.show();
    } else {
      this.hide();
    }
  }

};//end: AllAgents class

/************************************************************/
/************ Class for each Individual Agent ***************/
/************************************************************/
class Agent {

  /*
   * necessary parts of Agent:
   *
   * Position
   * Velocity
   * Goal
   * Orientation
   * Size
   * Markers
   */
  constructor(pos, vel, goalLoc, orientation, size, markers, whichTexture) {
    this.init(pos, vel, goalLoc, orientation, size, markers, whichTexture);
  }

  init(pos, vel, goalLoc, orientation, size, markers, whichTexture) {
    console.log("Agent: init");
    this.pos = pos;
    this.vel = vel;
    this.goalLoc = goalLoc;
    this.orientation = orientation;
    this.size = size;
    this.markers = markers;
    this.whichTexture = whichTexture;

    this.mesh = null;
    this.geo = null;
    this.material = null;
      
    this.makeMesh();
  }

  makeMesh() {
    console.log("Agent: makeMesh");
    this.geo = new THREE.CylinderGeometry(AGENTS_RAD, AGENTS_RAD, AGENTS_HEIGHT);
    console.log("geo: ");
    console.log(this.geo);
    this.updateMesh();
  }

  updateMaterials() {
    console.log("Agent: updateMaterials");
    if (this.whichTexture == 0) {
      this.material = mat1;
    } else if (this.whichTexture == 1) {
      this.material = mat2;
    } else {
      console.log("main: NO PROPER MATERIAL AVAILABLE");
    }
  }

  updatePosition() {
    console.log("Agent: updatePosition");
    this.mesh.position.set(this.pos[0], this.pos[1], this.pos[2]);
  }

  updateMesh() {
    this.updateMaterials();
    this.mesh = new THREE.Mesh(this.geo, this.material);
    this.updatePosition();
  }

  update() {
    // TO DO
  }

};//end: Agent class

/***************************************************************/
/************ Class for each Marker in the Scene ***************/
/***************************************************************/
class Marker {

  /*
   * necessary parts of Marker:
   *
   * Location
   * occupied: bool if already used as marker for an obj or not
   * visualDebug: Bool for if seen or not
   */
  constructor(pos, occupied) {
    this.init(pos, occupied);
  }

  init(pos, occupied) {
    console.log("Marker: init");
    this.pos = pos;
    this.occupied = occupied;
    
    this.makeMesh();
    this.show();
  }

  makeMesh() {
    console.log("Marker: makeMesh");
    var geo = new THREE.Geometry();
    var material = new THREE.PointsMaterial( { size:.1 } );
    geo.vertices.push(new THREE.Vector3(this.pos[0], this.pos[1], this.pos[2]));

    this.mesh = new THREE.Points(geo, material);
  }

  show() {
    console.log("Marker: show");
    if (this.mesh) {
      this.mesh.visible = true;
    }
  };

  hide() {
    console.log("Marker: hide");
    if (this.mesh) {
      this.mesh.visible = false;
    }
  };

  update() {
    // TO DO
  }

};//end: Agent class