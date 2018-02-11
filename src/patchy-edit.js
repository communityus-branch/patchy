/* global PatchyEdit:true, require */

PatchyEdit = require("./patchy-edit/patchy-edit.js").PatchyEdit;

// TODO: move this into a button class helper
function makeNewButton() {
    var buttonImageUrl = "https://s3.amazonaws.com/hifi-public/tony/patchy/new.svg";
    var windowDimensions = Controller.getViewportDimensions();
    var buttonWidth = 64;
    var buttonHeight = 64;
    var buttonPadding = 20;
    var buttonPositionX = windowDimensions.x - buttonPadding - buttonWidth;
    var buttonPositionY = (windowDimensions.y - buttonHeight) / 2 - (buttonHeight + buttonPadding);
    var newButton = Overlays.addOverlay("image", {
        x: buttonPositionX,
        y: buttonPositionY,
        subImage: { x: 0, y: buttonHeight, width: buttonWidth, height: buttonHeight},
        width: buttonWidth,
        height: buttonHeight,
        imageURL: buttonImageUrl,
        visible: true,
        alpha: 1.0
    });
    return newButton;
}

// ctor
var App = function () {
    var self = this;

    // hook up shutdown event handler
    Script.scriptEnding.connect(function () {
        self.shutDown();
    });

    // hook up mouse click event handler
    Controller.mousePressEvent.connect(function(event) {
        var clickedOverlay = Overlays.getOverlayAtPoint({x: event.x, y: event.y});
        if (clickedOverlay === self.newButton) {
            self.makeNewNode();
        }
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

    this.newButton = makeNewButton();
    this.patchNodes = [];
};

App.prototype.shutDown = function () {
    Overlays.deleteOverlay(this.newButton);
    var i, l = this.patchNodes.length;
    for (i = 0; i < l; i++) {
        this.patchNodes[i].destroy();
    }
    /*
    Entities.deleteEntity(this.box);
    */
};

App.prototype.makeNewNode = function () {

    var spawnPoint = Vec3.sum(MyAvatar.position, Vec3.multiply(3, Quat.getFront(Camera.getOrientation())));
    var spawnOrientation = Camera.getOrientation();

    var patchNode = new PatchyEdit.PatchyNode(
        Vec3.sum(spawnPoint, {x: 0, y: 1, z: 0}),
        spawnOrientation,
        { red: 155, green: 50, blue: 200 },
        "Test Node",
        ["input 1", "input 2", "input 3"],
        ["output 1", "output 2"]
    );
    this.patchNodes.push(patchNode);
};

var app = new App();


