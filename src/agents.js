const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much

var SPHERE_MATERIAL_NORM = new THREE.MeshBasicMaterial( {color: 0xffff00} );


/*****************************************************************/
/************ Class for all Agents as a Collective ***************/
/*****************************************************************/
export default class AllAgents {
  constructor(pos, radius, vel, gridWidth, visualDebug) {
    this.init(pos, radius, vel, gridWidth, visualDebug);
  }

  init(pos, radius, vel, gridWidth, visualDebug) {
    this.gridWidth = gridWidth;
    this.pos = pos;
    this.vel = vel;

    this.radius = radius;
    this.radius2 = radius * radius;
    this.mesh = null;

    if (visualDebug) {      
      this.makeMesh();
    }
  }

  makeMesh() {
    this.mesh = new THREE.Mesh(SPHERE_GEO, LAMBERT_WHITE);
    this.updateMeshPos();
  }

  updateMeshPos() {
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.scale.set(this.radius, this.radius, this.radius);
  }

  show() {
    if (this.mesh) {
      this.mesh.visible = true;
    }
  };

  hide() {
    if (this.mesh) {
      this.mesh.visible = false;
    }
  };

  update() {
    // TO DO
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
  constructor(pos, vel, goalLoc, orientation, size, markers, boolTexture) {
    this.init(pos, vel, goalLoc, orientation, size, markers, boolTexture);
  }

  init(pos, vel, goalLoc, orientation, size, markers, boolTexture) {
    this.pos = pos;
    this.vel = vel;
    this.goalLoc = goalLoc;
    this.orientation = orientation;
    this.size = size;
    this.markers = markers;
    this.visualDebug = visualDebug;
      
    this.makeMesh();
  }

  makeMesh() {



    this.mesh = new THREE.Mesh(SPHERE_GEO, LAMBERT_WHITE);
    this.updateMeshPos();
  }

  updateMeshPos() {
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.scale.set(this.radius, this.radius, this.radius);
  }

  show() {
    if (this.mesh) {
      this.mesh.visible = true;
    }
  };

  hide() {
    if (this.mesh) {
      this.mesh.visible = false;
    }
  };

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
  constructor(pos, occupied, visualDebug) {
    this.init(pos, occupied, visualDebug);
  }

  init(pos, occupied, visualDebug) {
    this.pos = pos;
    this.occupied = occupied;
    this.visualDebug = visualDebug;

    if (visualDebug) {      
      this.makeMesh();
      this.show();
    }
  }

  makeMesh() {
    var geo = new THREE.Geometry();
    var material = new THREE.PointsMaterial( { size:.1 } );
    geo.vertices.push(new THREE.Vector3(this.pos.x, this.pos.y, this.pos.z));

    this.mesh = new THREE.Points(geo, LAMBERT_WHITE);
  }

  show() {
    if (this.mesh) {
      this.mesh.visible = true;
    }
  };

  hide() {
    if (this.mesh) {
      this.mesh.visible = false;
    }
  };

  update() {
    // TO DO
  }

};//end: Agent class