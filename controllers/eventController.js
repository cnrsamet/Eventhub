const Event = require('../models/event');

// Etkinlik oluşturma
exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, date } = req.body;
    const createdBy = req.user._id; // Auth middleware ile kullanıcıyı belirlemek

    const event = new Event({
      title,
      description,
      location,
      date,
      createdBy
    });

    await event.save();

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Etkinlikleri listeleme
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'username');

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tek bir etkinliği getirme
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate('createdBy', 'username');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Etkinlik güncelleme
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, location, date } = req.body;

    const event = await Event.findByIdAndUpdate(
      eventId,
      { title, description, location, date },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Etkinlik silme
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
