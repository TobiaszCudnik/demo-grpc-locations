// package: drones
// file: api.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as api_pb from "./api_pb";

interface ILocationService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    sendLocation: ILocationService_IsendLocation;
}

interface ILocationService_IsendLocation extends grpc.MethodDefinition<api_pb.LocationMsg, api_pb.Ack> {
    path: string; // "/drones.Location/sendLocation"
    requestStream: boolean; // true
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_pb.LocationMsg>;
    requestDeserialize: grpc.deserialize<api_pb.LocationMsg>;
    responseSerialize: grpc.serialize<api_pb.Ack>;
    responseDeserialize: grpc.deserialize<api_pb.Ack>;
}

export const LocationService: ILocationService;

export interface ILocationServer {
    sendLocation: grpc.handleClientStreamingCall<api_pb.LocationMsg, api_pb.Ack>;
}

export interface ILocationClient {
    sendLocation(callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationMsg>;
    sendLocation(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationMsg>;
    sendLocation(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationMsg>;
    sendLocation(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationMsg>;
}

export class LocationClient extends grpc.Client implements ILocationClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public sendLocation(callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationMsg>;
    public sendLocation(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationMsg>;
    public sendLocation(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationMsg>;
    public sendLocation(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationMsg>;
}
