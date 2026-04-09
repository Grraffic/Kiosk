import mongoose from 'mongoose';

const officerSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  position: { type: String, required: true }
}, { versionKey: false });

export const OfficerModel = mongoose.model('Officer', officerSchema, 'officers');
