const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Katılıyor', 'Belki', 'Katılmıyor'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RSVP = mongoose.model('RSVP', rsvpSchema);

module.exports = RSVP;
