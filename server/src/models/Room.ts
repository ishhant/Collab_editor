import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  language: { type: String, required: true },
  content: { type: String, default: '' }
});

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  files: [fileSchema]
}, { timestamps: true });

export const RoomModel = mongoose.model('Room', roomSchema);
