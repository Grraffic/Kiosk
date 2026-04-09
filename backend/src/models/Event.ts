import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  date: { type: String, required: true },
  endDate: { type: String, default: '' },
  label: { type: String, required: true },
  description: { type: String, default: '' },
  showCountdown: { type: Boolean, default: false }
}, { versionKey: false });

export const EventModel = mongoose.model('Event', eventSchema, 'events');
