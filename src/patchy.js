PatchGraph = require("./patch-graph/patch-graph.js").PatchGraph;
PatchVis = require("./patch-vis/patch-vis.js").PatchVis;

// create a box entity
var spawnPoint = Vec3.sum(MyAvatar.position,
                          Vec3.multiply(3, Quat.getFront(Camera.getOrientation())));
var spawnOrientation = Camera.getOrientation();

var red = { red: 255, green: 0, blue: 0 };

// ctor
var App = function () {
    var self = this;
    Script.scriptEnding.connect(function () {
        self.shutDown();
    });

    /*
    this.box = Entities.addEntity({ type: "Box",
                                    position: spawnPoint,
                                    dimentions: { x: 1, y: 1, z: 1 },
                                    color: { red: 100, green: 100, blue: 255 },
                                    gravity: { x: 0, y: 0, z: 0 },
                                    visible: true,
                                    locked: false,
                                    lifetime: 6000 });
    this.nodes = [];
    this.redNode = new PatchGraph.Constant(red);
    this.nodes.push(this.redNode);
    this.entityNode = new PatchGraph.EntityProperty(this.box);
    this.nodes.push(this.entityNode);
    this.clickNode = new PatchGraph.Click();
    this.nodes.push(this.clickNode);

    PatchGraph.connect(this.redNode, "value", this.entityNode, "color");
    Patchraph.connect(this.clickNode, "click", this.entityNode, "trigger$");

    var i, l = this.nodes.length;
    for (i = 0; i < l; i++) {
        this.nodes[i].start();
    }
    */
    this.patchNodes = [];
    var patchNode = new PatchVis.PatchNode(Vec3.sum(spawnPoint, {x: 0, y: 1, z: 0}),
                                           spawnOrientation,
                                           { red: 155, green: 50, blue: 200 },
                                           "Test Node",
                                           ["input 1", "input 2", "input 3"],
                                           ["output 1", "output 2"]);
    this.patchNodes.push(patchNode);
};

App.prototype.shutDown = function () {
    var i, l = this.patchNodes.length;
    for (i = 0; i < l; i++) {
        this.patchNodes[i].destroy();
    }
    /*
    Entities.deleteEntity(this.box);
    */
};

var app = new App();


