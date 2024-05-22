const RSVP = require("../models/Rsvp");
const Event = require("../models/Events");

//RSVP Oluşturma
exports.createRSVP = async (req, res) => {
  try {
    const { status } = req.body;
    const { eventId } = req.params;
    const userId = req.user.userId; // Giriş yapan kullanıcının kimliği
    console.log(userId);

    console.log('Request Body:', req.body); // req.body içeriğini kontrol et
    console.log('User ID:', userId);


    if (!status || !['Katılıyor', 'Belki', 'Katılmıyor'].includes(status)) {
        return res.status(400).json({ error: "Geçersiz RSVP durumu." });
      }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(400).json({ error: "Etkinlik Bulunamadı!" });
    }

    const existingRSVP = await RSVP.findOne({ event: eventId, user: userId });
    if (existingRSVP) {
      return res
        .status(400)
        .json({ error: "Kullanıcı zaten bu etkinliğe katıldı!" });
    }

    const rsvp = new RSVP({
      event: eventId,
      user: userId,
      status: status
    });

    await rsvp.save();
    res.status(201).json(rsvp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Belirli bir etkinlik için RSVP'leri listeleme
exports.getEventRSVPs = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Etkinlik bulunamadı!" });
    }

    const rsvps = await RSVP.find({ event: eventId })
        .populate('user', 'username')
        .populate('event', 'title');

    res.status(200).json(rsvps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
