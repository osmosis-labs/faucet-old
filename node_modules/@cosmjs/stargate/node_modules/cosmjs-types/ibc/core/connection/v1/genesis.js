"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenesisState = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const connection_1 = require("../../../../ibc/core/connection/v1/connection");
exports.protobufPackage = "ibc.core.connection.v1";
const baseGenesisState = { nextConnectionSequence: long_1.default.UZERO };
exports.GenesisState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.connections) {
            connection_1.IdentifiedConnection.encode(v, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.clientConnectionPaths) {
            connection_1.ConnectionPaths.encode(v, writer.uint32(18).fork()).ldelim();
        }
        if (!message.nextConnectionSequence.isZero()) {
            writer.uint32(24).uint64(message.nextConnectionSequence);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseGenesisState);
        message.connections = [];
        message.clientConnectionPaths = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.connections.push(connection_1.IdentifiedConnection.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.clientConnectionPaths.push(connection_1.ConnectionPaths.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.nextConnectionSequence = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseGenesisState);
        message.connections = [];
        message.clientConnectionPaths = [];
        if (object.connections !== undefined && object.connections !== null) {
            for (const e of object.connections) {
                message.connections.push(connection_1.IdentifiedConnection.fromJSON(e));
            }
        }
        if (object.clientConnectionPaths !== undefined && object.clientConnectionPaths !== null) {
            for (const e of object.clientConnectionPaths) {
                message.clientConnectionPaths.push(connection_1.ConnectionPaths.fromJSON(e));
            }
        }
        if (object.nextConnectionSequence !== undefined && object.nextConnectionSequence !== null) {
            message.nextConnectionSequence = long_1.default.fromString(object.nextConnectionSequence);
        }
        else {
            message.nextConnectionSequence = long_1.default.UZERO;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.connections) {
            obj.connections = message.connections.map((e) => (e ? connection_1.IdentifiedConnection.toJSON(e) : undefined));
        }
        else {
            obj.connections = [];
        }
        if (message.clientConnectionPaths) {
            obj.clientConnectionPaths = message.clientConnectionPaths.map((e) => e ? connection_1.ConnectionPaths.toJSON(e) : undefined);
        }
        else {
            obj.clientConnectionPaths = [];
        }
        message.nextConnectionSequence !== undefined &&
            (obj.nextConnectionSequence = (message.nextConnectionSequence || long_1.default.UZERO).toString());
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseGenesisState);
        message.connections = [];
        if (object.connections !== undefined && object.connections !== null) {
            for (const e of object.connections) {
                message.connections.push(connection_1.IdentifiedConnection.fromPartial(e));
            }
        }
        message.clientConnectionPaths = [];
        if (object.clientConnectionPaths !== undefined && object.clientConnectionPaths !== null) {
            for (const e of object.clientConnectionPaths) {
                message.clientConnectionPaths.push(connection_1.ConnectionPaths.fromPartial(e));
            }
        }
        if (object.nextConnectionSequence !== undefined && object.nextConnectionSequence !== null) {
            message.nextConnectionSequence = object.nextConnectionSequence;
        }
        else {
            message.nextConnectionSequence = long_1.default.UZERO;
        }
        return message;
    },
};
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=genesis.js.map