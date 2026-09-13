"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fileSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    language: { type: String, required: true },
    content: { type: String, default: '' }
});
const roomSchema = new mongoose_1.default.Schema({
    roomId: { type: String, required: true, unique: true },
    files: [fileSchema]
}, { timestamps: true });
exports.RoomModel = mongoose_1.default.model('Room', roomSchema);
