// package: drones
// file: api.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Ack extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Ack.AsObject;
    static toObject(includeInstance: boolean, msg: Ack): Ack.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Ack, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Ack;
    static deserializeBinaryFromReader(message: Ack, reader: jspb.BinaryReader): Ack;
}

export namespace Ack {
    export type AsObject = {
    }
}

export class LocationMsg extends jspb.Message { 
    getId(): number;
    setId(value: number): void;

    getX(): number;
    setX(value: number): void;

    getY(): number;
    setY(value: number): void;

    getFull(): boolean;
    setFull(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LocationMsg.AsObject;
    static toObject(includeInstance: boolean, msg: LocationMsg): LocationMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LocationMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LocationMsg;
    static deserializeBinaryFromReader(message: LocationMsg, reader: jspb.BinaryReader): LocationMsg;
}

export namespace LocationMsg {
    export type AsObject = {
        id: number,
        x: number,
        y: number,
        full: boolean,
    }
}
