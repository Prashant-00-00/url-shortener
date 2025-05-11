import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  clicks: [
    {
      ip: String,
      timestamp: { type: Date, default: Date.now },
      userAgent: String,
    }
  ]
}, { collection: 'urls' });

export default mongoose.model('Url', urlSchema);
