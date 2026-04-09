import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  category: { type: String, required: true },
  schedule: { type: String, default: '' },
  meetings: [{
     name: { type: String, default: '' },
     date: { type: String, default: '' },
     time: { type: String, default: '' }
  }]
}, { versionKey: false });

export const ActivityModel = mongoose.model('Activity', activitySchema, 'activities');
