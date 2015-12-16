var NODE_WIDTH = 1.0;
var NODE_CELL_HEIGHT = 0.25;
var NODE_CELL_DEPTH = 0.25;

function linkEntities(parentEntity, childEntity) {
    Entities.editEntity(childEntity, { parentID: parentEntity });
}

function clamp(val, min, max) {
    if (val < min) {
        return min;
    } else if (val > max) {
        return max;
    } else {
        return val;
    }
}

function addColor(color, amount) {
    var red = color.red + amount;
    var green = color.green + amount;
    var blue = color.blue + amount;
    return { red: clamp(red, 0, 255),
             green: clamp(green, 0, 255),
             blue: clamp(blue, 0, 255) };
}

function calcTextColor(bgColor) {
    var lum = 255 - (0.299 * bgColor.red + 0.587 * bgColor.blue + 0.114 * bgColor.green);
    if (lum < 146) {
        return { red: 0, green: 0, blue: 0 };
    } else {
        return { red: 255, green: 255, blue: 255 };
    }
}

function makeCell(position, rotation, width, color, text) {
    var boxEntity = Entities.addEntity({
        type: "Box",
        name: text + " Box",
        position: position,
        rotation: rotation,
        locked: false,
        dimensions: { x: width, y: NODE_CELL_HEIGHT, z: NODE_CELL_DEPTH },
        color: color
    });

    var textOffset = Vec3.multiply(Quat.getFront(rotation), -(NODE_CELL_DEPTH / 2) - 0.01);

    var textEntity = Entities.addEntity({
        type: "Text",
        name: text + " Text",
        position: Vec3.sum(position, textOffset),
        rotation: rotation,
        dimensions: { x: width, y: NODE_CELL_HEIGHT, z: NODE_CELL_DEPTH },
        backgroundColor: color,
        textColor: calcTextColor(color),
        text: text,
    });

    return [boxEntity, textEntity];
}

function makeSphere(position, rotation, diameter, color) {
    return Entities.addEntity({
        type: "Sphere",
        position: position,
        rotation: rotation,
        dimensions: { x: diameter, y: diameter, z: diameter },
        color: color
    });
}

/**
  * Constructs a new PatchyNode instance
  * @param {Object} position Vec3 with object with x, y, z keys.
  * @param {Object} rotation Quaternion with x, y, z, w keys.
  * @param {Object} color Object with red, green, blue keys (0..255).
  * @param {string} title Display title of node.
  * @param {string[]} inputs Array of input strings
  * @param {string[]} outputs Array of output strings
  */
var PatchyNode = function (position, rotation, color, title, inputs, outputs) {
    this.title = title;
    this.inputs = inputs;
    this.outputs = outputs;

    this.entities = [];
    this.entities = this.entities.concat(makeCell(position, rotation, NODE_WIDTH, color, title));
    this.rootEntity = this.entities[0];

    // add input cells
    var downOffset = Vec3.multiply(Quat.getUp(rotation), -NODE_CELL_HEIGHT);
    var rightOffset = Vec3.multiply(Quat.getRight(rotation), NODE_WIDTH / 4);
    var leftOffset = Vec3.multiply(rightOffset, -1);
    var rightSphereOffset = Vec3.multiply(Quat.getRight(rotation), (NODE_WIDTH / 4) + (NODE_CELL_HEIGHT / 2));
    var leftSphereOffset = Vec3.multiply(rightSphereOffset, -1);
    var nextColor, nextPosition = Vec3.sum(position, leftOffset);
    var i, l = inputs.length;
    for (i = 0; i < l; i++) {
        nextPosition = Vec3.sum(nextPosition, downOffset);
        if ((i % 2) === 0) {
            nextColor = addColor(color, 15);
        } else {
            nextColor = addColor(color, -15);
        }
        this.entities = this.entities.concat(makeCell(nextPosition, rotation, NODE_WIDTH / 2, nextColor, inputs[i]));
        this.entities.push(makeSphere(Vec3.sum(nextPosition, leftSphereOffset), rotation, NODE_CELL_HEIGHT, nextColor));
    }

    // add output cells
    nextPosition = Vec3.sum(position, rightOffset);
    l = outputs.length;
    for (i = 0; i < l; i++) {
        nextPosition = Vec3.sum(nextPosition, downOffset);
        if ((i % 2) === 1) {
            nextColor = addColor(color, 15);
        } else {
            nextColor = addColor(color, -15);
        }
        this.entities = this.entities.concat(makeCell(nextPosition, rotation, NODE_WIDTH / 2, nextColor, outputs[i]));
        this.entities.push(makeSphere(Vec3.sum(nextPosition, rightSphereOffset), rotation, NODE_CELL_HEIGHT, nextColor));
    }

    // make all entities children of the root entity.
    l = this.entities.length;
    for (i = 1; i < l; i++) {
        linkEntities(this.rootEntity, this.entities[i]);
    }

    Object.defineProperty(this, "position", {
        get: this.getPosition,
        set: this.setPosition
    });

    Object.defineProperty(this, "rotation", {
        get: this.getRotation,
        set: this.setRotation
    });

    this.position = position;
    this.rotation = rotation;
};

PatchyNode.prototype.destroy = function () {
    var i, l = this.entities.length;
    for (i = 0; i < l; i++) {
        Entities.deleteEntity(this.entities[i]);
    }
};

PatchyNode.prototype.getPosition = function (position) {
    return this._position;
};

PatchyNode.prototype.setPosition = function (position) {
    this._position = position;
    Entities.editEntity(this.rootEntity, { position: position });
};

PatchyNode.prototype.getRotation = function (rotation) {
    return this._rotation;
};

PatchyNode.prototype.setRotation = function (rotation) {
    this._rotation = rotation;
    Entities.editEntity(this.rootEntity, { rotation: rotation });
};

// exports
exports.PatchyNode = PatchyNode;
