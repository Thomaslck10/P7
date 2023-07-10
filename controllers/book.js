const Book = require('../models/Book');
const fs = require('fs');

// Enregistre un livre dans la base de données

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    book.save()
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

// Met à jour le livre avec l'id fourni

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({message: 'unauthorized request'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Livre modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

//Supprime le livre avec l'id fourni

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({message: 'unauthorized request'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

// Renvoie le livre avec l’id fourni

exports.getOneBook =  (req, res, next) => {
    Book.findOne({ _id: req.params.id })
     .then(book => res.status(200).json(book))
     .catch(error => res.status(404).json({ error }));
};

// Renvoie un tableau de tous les livres de la base de données.

exports.getAllBooks =  (req, res, next) => {
    Book.find()
     .then(books => res.status(200).json(books))
     .catch(error => res.status(400).json({ error }));
};

// Renvoie un tableau des 3 livres de la base de données ayant la meilleure note moyenne

exports.getBestBooks =  (req, res, next) => {
    Book.find()
     .sort({averageRating: -1})
     .limit(3)    
     .then(bestBooks => res.status(200).json(bestBooks))
     .catch(error => res.status(400).json({ error }));
};

// Définit la note pour le user ID fourni

exports.rateBook = (req, res, next) => {
    const newRating = {
      userId: req.body.userId,
      grade: req.body.rating,
    };
    Book.updateOne({ _id: req.params.id }, { $push: { ratings: newRating } })
      .then(() => {
        Book.findOne({ _id: req.params.id }).then((book) => {
          let totalRatings = 0;
          let averageRating = 0;
          for (let i = 0; i < book.ratings.length; i++) {
            totalRatings += book.ratings[i].grade;
          }
          averageRating = totalRatings / book.ratings.length;
          Book.updateOne(
            { _id: req.params.id },
            { $set: { averageRating: averageRating } }
          ).then(() => {
            Book.findOne({ _id: req.params.id })
              .then((book) => {
                res.status(200).json(book);
              })
              .catch((error) => res.status(404).json({ error }));
          });
        });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  };
