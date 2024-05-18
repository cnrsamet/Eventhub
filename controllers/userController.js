const User = require('../models/Users');
const TokenBlacklist = require('../models/TokenBlackList');



const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = process.env.SECRET_KEY;



exports.getAllUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

exports.userCreate = async (req, res) => {
    try {
      const { username, mail, password } = req.body;
  
      // Gelen verilerin doğru olup olmadığını kontrol et
      if (!username || !mail || !password) {
        return res.status(400).json({ error: 'Lütfen tüm alanları doldurun.' });
      }
  
      const user = new User({ username, mail, password });
      await user.save();
  
      res.status(201).json(user);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ error: 'Bu e-posta zaten kullanılıyor.' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
};  

exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json('Kullanıcı Başarıyla silindi!');
};

exports.updateUser = async (req, res) => {
    try {
        const upUser = await User.findOne({ _id: req.params.id });
        if (!upUser) {
            return res.status(404).send({ error: "Kullanıcı Bulunamadı." });
        }
        // Gelen verileri güncelle
        upUser.username = req.body.username;
        upUser.mail = req.body.mail;
        upUser.password = req.body.password;
        await upUser.save();
        res.json({
            id: upUser._id,
            username: upUser.username,
            mail: upUser.mail
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Bir hata oluştu." });
    }
};

exports.loginUser = async (req, res) => {
    try {
        // Kullanıcıyı e-posta adresine göre bul
        const user = await User.findOne({ mail: req.body.mail });
        if (!user) {
            return res.status(401).json({ message: 'Kullanıcı Bulunamadı!' });
        }

        // Şifreyi karşılaştır
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Lütfen Bilgilerinizi Kontrol ediniz.' });
        }

        // JWT oluştur
        const token = jwt.sign(
            {
                mail: user.mail,
                userId: user._id
            },
            secretKey,
            { expiresIn: '1h' }
        );
        

        res.status(200).json({
            message: 'Giriş Başarılı!',
            token: token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        // Kullanıcının token'ını al
        const token = req.headers.authorization.split(" ")[1];

        // Yeni bir karaliste kaydı oluştur
        const blacklistedToken = new TokenBlacklist({ token });
        await blacklistedToken.save();

        res.status(200).json({ message: 'Çıkış Başarılı!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};