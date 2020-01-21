// package: drones
// file: api.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as api_pb from "./api_pb";

interface ILocationService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    sendLocation: ILocationService_IsendLocation;
    sendLocationDiff: ILocationService_IsendLocationDiff;
}

interface ILocationService_IsendLocation extends grpc.MethodDefinition<api_pb.LocationMsg, api_pb.Ack> {
    path: string; // "/drones.Location/sendLocation"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_pb.LocationMsg>;
    requestDeserialize: grpc.deserialize<api_pb.LocationMsg>;
    responseSerialize: grpc.serialize<api_pb.Ack>;
    responseDeserialize: grpc.deserialize<api_pb.Ack>;
}
interface ILocationService_IsendLocationDiff extends grpc.MethodDefinition<api_pb.LocationDiffMsg, api_pb.Ack> {
    path: string; // "/drones.Location/sendLocationDiff"
    requestStream: boolean; // true
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<api_pb.LocationDiffMsg>;
    requestDeserialize: grpc.deserialize<api_pb.LocationDiffMsg>;
    responseSerialize: grpc.serialize<api_pb.Ack>;
    responseDeserialize: grpc.deserialize<api_pb.Ack>;
}

export const LocationService: ILocationService;

export interface ILocationServer {
    sendLocation: grpc.handleUnaryCall<api_pb.LocationMsg, api_pb.Ack>;
    sendLocationDiff: grpc.handleClientStreamingCall<api_pb.LocationDiffMsg, api_pb.Ack>;
}

export interface ILocationClient {
    sendLocation(request: api_pb.LocationMsg, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientUnaryCall;
    sendLocation(request: api_pb.LocationMsg, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientUnaryCall;
    sendLocation(request: api_pb.LocationMsg, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientUnaryCall;
    sendLocationDiff(callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationDiffMsg>;
    sendLocationDiff(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationDiffMsg>;
    sendLocationDiff(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationDiffMsg>;
    sendLocationDiff(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationDiffMsg>;
}

export class LocationClient extends grpc.Client implements ILocationClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public sendLocation(request: api_pb.LocationMsg, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientUnaryCall;
    public sendLocation(request: api_pb.LocationMsg, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientUnaryCall;
    public sendLocation(request: api_pb.LocationMsg, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientUnaryCall;
    public sendLocationDiff(callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationDiffMsg>;
    public sendLocationDiff(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationDiffMsg>;
    public sendLocationDiff(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationDiffMsg>;
    public sendLocationDiff(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: api_pb.Ack) => void): grpc.ClientWritableStream<api_pb.LocationDiffMsg>;
}
