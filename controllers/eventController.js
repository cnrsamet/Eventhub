const Event = require("../models/Events");

// Etkinlik oluşturma
exports.createEvent = async (req, res) => {
  try {
    console.log(req.user);
    const { title, description, location, date } = req.body;
    const createdBy = req.user.userId; // Auth middleware ile kullanıcıyı belirlemek

    const event = new Event({
      title,
      description,
      location,
      date,
      createdBy,
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
    const events = await Event.find().populate("createdBy", "username");

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tek bir etkinliği getirme
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate(
      "createdBy",
      "username"
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
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
    const userId = req.user.userId; // Giriş yapan kullanıcının kimliği

    // Öncelikle etkinliği veritabanından çekiyoruz
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Etkinliği oluşturan kullanıcı ile giriş yapan kullanıcıyı karşılaştırıyoruz
    if (event.createdBy.toString() !== userId) {
      return res.status(403).json({ error: "Event'i sadece Event sahibi değiştirebilir." });
    }

    // Etkinliği güncelliyoruz
    event.title = title;
    event.description = description;
    event.location = location;
    event.date = date;

    await event.save();

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
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
