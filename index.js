'use strict';
///// Timelog ///////////////
const startTime = new Date;
///////////////

const PetriNet = require('./api/petri-net');

///// Net from JSON ///////////////
const netConfig = {
    places: {'P1':2, 'P2':0},
    transitions: ['T1'],
    arcs: ['P1-T1', 'T1-P2'],
};

const net1 = new PetriNet(netConfig);

console.log('\nnet1', net1.getNet());
///////////////

///// Net from scratch ///////////////
const net2 = new PetriNet();

net2.addPlace('P1', 2);
net2.addPlace('P2');
net2.addTransition('T1');
net2.addArc('P1', 'T1');
net2.addArc('T1', 'P2', 2);

console.log('\nnet2', net2.getNet());
///////////////

///// Timelog ///////////////
console.log('\nRunning time: ' + ((new Date) - startTime)/1000 + 's');
///////////////
