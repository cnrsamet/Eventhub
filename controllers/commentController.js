const Comment = require("../models/Comments");
const Event = require("../models/Events");

// Yorum oluşturma
exports.createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { eventId } = req.params;
    const userId = req.user.userId; // Giriş yapan kullanıcının kimliği

    if (!text) {
      return res.status(400).json({ error: "Yorum metni gereklidir" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Etkinlik bulunamadı!" });
    }

    const comment = new Comment({
      event: eventId,
      user: userId,
      text: text,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Belirli bir etkinlik için yorumları listeleme
exports.getEventComments = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res
        .status(400)
        .json({ error: "Event ID verilmedi, lütfen giriş yapınız." });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Etkinlik bulunamadı!" });
    }

    const comments = await Comment.find({ event: eventId }).populate(
      "user",
      "username"
    );

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Yorum güncelleme
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId; // Giriş yapan kullanıcının kimliği

    if (!text) {
      return res.status(400).json({ error: "Yorum metni gereklidir" });
    }

    const comment = await Comment.findOne({ _id: commentId, user: userId });

    if (!comment) {
      return res
        .status(404)
        .json({ error: "Yorum bulunamadı veya bu kullanıcıya ait değil!" });
    }

    comment.text = text;

    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Yorum silme
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId; // Giriş yapan kullanıcının kimliği

    if (!commentId) {
      return res.status(400).json({ error: "Yorum ID'si gereklidir" });
    }

    if (!userId) {
      return res.status(400).json({ error: "Kullanıcı kimliği gereklidir" });
    }

    const comment = await Comment.findOne({ _id: commentId, user: userId });

    if (!comment) {
      return res
        .status(404)
        .json({ error: "Yorum bulunamadı veya bu kullanıcıya ait değil!" });
    }

    // Yorumun silinmesi
    await comment.deleteOne();

    res.status(200).json({ message: "Yorum başarıyla silindi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
