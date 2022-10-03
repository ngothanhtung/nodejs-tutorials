const events = require('events');
const eventEmitter = new events.EventEmitter();

//Create an event handler:
const myEventHandler = function () {
  console.log('I hear a scream!');
};

//Assign the event handler to an event:
eventEmitter.on('scream', myEventHandler);

//Fire the 'scream' event:
eventEmitter.emit('scream');
