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
    getId(): string;
    setId(value: string): void;

    getX(): number;
    setX(value: number): void;

    getY(): number;
    setY(value: number): void;


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
        id: string,
        x: number,
        y: number,
    }
}

export class LocationDiffMsg extends jspb.Message { 
    getId(): string;
    setId(value: string): void;

    getX(): number;
    setX(value: number): void;

    getY(): number;
    setY(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LocationDiffMsg.AsObject;
    static toObject(includeInstance: boolean, msg: LocationDiffMsg): LocationDiffMsg.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LocationDiffMsg, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LocationDiffMsg;
    static deserializeBinaryFromReader(message: LocationDiffMsg, reader: jspb.BinaryReader): LocationDiffMsg;
}

export namespace LocationDiffMsg {
    export type AsObject = {
        id: string,
        x: number,
        y: number,
    }
}
