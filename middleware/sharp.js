const sharp = require('sharp');
const fs = require("fs");

exports.compressImages = (req, res, next) => {
    if (req.file) {
        sharp(req.file.path)
            .resize({height: 1080})
            .toFormat('webp')
            .webp({ quality: 80 })
            .toFile('images/' + req.file.filename.split('.')[0] + '_resized.webp', (err, info) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ error: 'Erreur lors de la compression de l\'image.' });
                }
                fs.unlink(req.file.path, () => {
                    req.file.path = 'images/' + req.file.filename.split('.')[0] + '_resized.webp';
                    next();
                })
                req.file.filename = req.file.filename.split('.')[0] + '_resized.webp';
            });
    } else {
        next();
    }
};

