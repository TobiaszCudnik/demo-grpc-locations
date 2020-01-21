// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var api_pb = require('./api_pb.js');

function serialize_drones_Ack(arg) {
  if (!(arg instanceof api_pb.Ack)) {
    throw new Error('Expected argument of type drones.Ack');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_drones_Ack(buffer_arg) {
  return api_pb.Ack.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_drones_LocationDiffMsg(arg) {
  if (!(arg instanceof api_pb.LocationDiffMsg)) {
    throw new Error('Expected argument of type drones.LocationDiffMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_drones_LocationDiffMsg(buffer_arg) {
  return api_pb.LocationDiffMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_drones_LocationMsg(arg) {
  if (!(arg instanceof api_pb.LocationMsg)) {
    throw new Error('Expected argument of type drones.LocationMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_drones_LocationMsg(buffer_arg) {
  return api_pb.LocationMsg.deserializeBinary(new Uint8Array(buffer_arg));
}


var LocationService = exports.LocationService = {
  sendLocation: {
    path: '/drones.Location/sendLocation',
    requestStream: false,
    responseStream: false,
    requestType: api_pb.LocationMsg,
    responseType: api_pb.Ack,
    requestSerialize: serialize_drones_LocationMsg,
    requestDeserialize: deserialize_drones_LocationMsg,
    responseSerialize: serialize_drones_Ack,
    responseDeserialize: deserialize_drones_Ack,
  },
  sendLocationDiff: {
    path: '/drones.Location/sendLocationDiff',
    requestStream: true,
    responseStream: false,
    requestType: api_pb.LocationDiffMsg,
    responseType: api_pb.Ack,
    requestSerialize: serialize_drones_LocationDiffMsg,
    requestDeserialize: deserialize_drones_LocationDiffMsg,
    responseSerialize: serialize_drones_Ack,
    responseDeserialize: deserialize_drones_Ack,
  },
};

exports.LocationClient = grpc.makeGenericClientConstructor(LocationService);
