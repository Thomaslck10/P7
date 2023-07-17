const sharp = require('sharp');
const fs = require("fs");

exports.compressImages = (req, res, next) => {
    if (req.file) {
        sharp(req.file.path)
            .resize({height: 1080})
            .toFormat('webp')
            .webp({ quality: 80 })
            // Je la nomme correctement, avec un nom different de celui de base (j'ajoute _resized avant l'extension)
            .toFile('images/' + req.file.filename.split('.')[0] + '_resized.webp', (err, info) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ error: 'Erreur lors de la compression de l\'image.' });
                }
                // idem ici
                fs.unlink(req.file.path, () => {
                    req.file.path = 'images/' + req.file.filename.split('.')[0] + '_resized.webp';
                    next();
                })
                // je renomme le nom du fichier qui sera transmis à ton controller
                req.file.filename = req.file.filename.split('.')[0] + '_resized.webp';
            });
    } else {
        next();
    }
};

