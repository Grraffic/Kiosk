import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  picture: { type: String, default: '' },
  toka: { type: String, default: '' },
  combinedToka: { type: String, default: '' },
  members: [{
     name: { type: String, default: '' },
     position: { type: String, default: '' }
  }]
}, { versionKey: false });

export const GroupModel = mongoose.model('Group', groupSchema, 'groups');
