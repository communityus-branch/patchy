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
    var boxEntityProps = {
        type: "Box",
        name: text + " Box",
        position: position,
        rotation: rotation,
        locked: false,
        dimensions: { x: width, y: NODE_CELL_HEIGHT, z: NODE_CELL_DEPTH },
        color: color,
        visible: true,
        lifetime: 100000
    };

    var boxEntity = Entities.addEntity(boxEntityProps);

    var textOffset = Vec3.multiply(Quat.getFront(rotation), -(NODE_CELL_DEPTH / 2) - 0.01);

    var textEntityProps = {
        type: "Text",
        name: text + " Text",
        position: Vec3.sum(position, textOffset),
        rotation: rotation,
        dimensions: { x: width, y: NODE_CELL_HEIGHT, z: NODE_CELL_DEPTH },
        backgroundColor: color,
        textColor: calcTextColor(color),
        text: text,
    };

    var textEntity = Entities.addEntity(textEntityProps);

    return { boxEntity: boxEntity, textEntity: textEntity };
}

/**
  * Constructs a new PatchNode instance
  * @param {Object} position Vec3 with object with x, y, z keys.
  * @param {Object} rotation Quaternion with x, y, z, w keys.
  * @param {Object} color Object with red, green, blue keys (0..255).
  * @param {string} title Display title of node.
  * @param {string[]} inputs Array of input strings
  * @param {string[]) outputs Array of output strings
  */
var PatchNode = function (position, rotation, color, title, inputs, outputs) {
    this.title = title;
    this.inputs = inputs;
    this.outputs = outputs;

    this.cells = [];
    this.cells.push(makeCell(position, rotation, NODE_WIDTH, color, title));
    this.rootEntity = this.cells[0].boxEntity;

    var downOffset = Vec3.multiply(Quat.getUp(rotation), -NODE_CELL_HEIGHT);
    var rightOffset = Vec3.multiply(Quat.getRight(rotation), NODE_WIDTH / 4);
    var leftOffset = Vec3.multiply(rightOffset, -1);
    var nextColor, nextPosition = Vec3.sum(position, leftOffset);
    var i, l = inputs.length;
    for (i = 0; i < l; i++) {
        nextPosition = Vec3.sum(nextPosition, downOffset);
        if ((i % 2) == 0) {
            nextColor = addColor(color, 15);
        } else {
            nextColor = addColor(color, -15);
        }
        this.cells.push(makeCell(nextPosition, rotation, NODE_WIDTH / 2, nextColor, inputs[i]));
    }

    nextPosition = Vec3.sum(position, rightOffset);
    l = outputs.length;
    for (i = 0; i < l; i++) {
        nextPosition = Vec3.sum(nextPosition, downOffset);
        if ((i % 2) == 1) {
            nextColor = addColor(color, 15);
        } else {
            nextColor = addColor(color, -15);
        }
        this.cells.push(makeCell(nextPosition, rotation, NODE_WIDTH / 2, nextColor, outputs[i]));
    }

    // make all entities children of the root entity.
    linkEntities(this.rootEntity, this.cells[0].textEntity);
    l = this.cells.length;
    for (i = 1; i < l; i++) {
        linkEntities(this.rootEntity, this.cells[i].boxEntity);
        linkEntities(this.rootEntity, this.cells[i].textEntity);
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

PatchNode.prototype.destroy = function () {
    var i, l = this.cells.length;
    for (i = 0; i < l; i++) {
        Entities.deleteEntity(this.cells[i].boxEntity);
        Entities.deleteEntity(this.cells[i].textEntity);
    }
};

PatchNode.prototype.getPosition = function (position) {
    return this._position;
};

PatchNode.prototype.setPosition = function (position) {
    this._position = position;
    Entities.editEntity(this.rootEntity, { position: position });
};

PatchNode.prototype.getRotation = function (rotation) {
    return this._rotation;
};

PatchNode.prototype.setRotation = function (rotation) {
    this._rotation = rotation;
    Entities.editEntity(this.rootEntity, { rotation: rotation });
};

// exports
exports.PatchNode = PatchNode;
