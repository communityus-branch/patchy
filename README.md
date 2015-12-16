# Patchy: Prototype Visual Scripting Tools for High Fidelity.

Very WIP, does not even work at the moment

## Goals

* Node based data flow interface similar to [Crytek Flowgraph](http://docs.cryengine.com/display/SDKDOC2/Flow+Graph+Editor) or [Unreal Kismet](https://udn.epicgames.com/Three/KismetHome.html).
* Nodes are placed in the world with hand controllers.
* Nodes can be manipulated in the world with hand controllers.
* Links between nodes can be made with hand controllers.
* Entire system is implemented in JavaScript.
* Only minimal set of nodes will be implemented for prototype.
* **STRETCH** nodes are visible to others in the environment
* **STRETCH** nodes/patches change color dynamically based on input.

## Non Goals

* Making it anything other then a prototype
* True multi user support, or any persistence model.

## Implementation Plan

Patchy will contain three main scripts:

## patchy-edit

**patchy-edit.js** is an Interface script and is only used to create new patchy nodes, and edit existing patchy nodes.
Ideally, it will make use of hand controllers for all it's functionality, including:

* create new nodes of any type
* delete nodes
* make connection between nodes
* toggle visibility of nodes
* position and orient nodes

## patchy-server

**patchy-server.js** is an Assignment Client script that runs on the server.
It is responsible for running the actual nodes implementation.
These nodes will edit entity properties to make the behavior visible to all clients.
It receives notifications from **patchy-edit.js** using the Messaging pub-sub service, for the following events.

* node created
* new link between nodes
* node deleted

These notifications will be used to make sure the server side node graph is kept in sync with the actual visual representation.

## patchy-entity

**patchy-entity.js** is a script that runs on each entity in the scene.
It is responsible for forwarding entity events such as trigger enter/leave to the patchy-server via the Messaging pub-sub service.
There might be several types of patchy-entity scripts for each type of entity.









