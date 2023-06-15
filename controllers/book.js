const Book = require('../models/Book');

// Enregistre un livre dans la base de données

exports.createBook =  (req, res, next) => {
    delete req.body.id;
    const book = new Book({
      ...req.body
    });
    book.save()
     .then(() => res.status(201).json({ message: 'livre enregistré !'}))
     .catch(error => res.status(400).json({ error }));
};

// Met à jour le livre avec l'id fourni

exports.modifyBook =  (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, id: req.params.id})
     .then(() => res.status(200).json({ message: 'livre modifié !'}))
     .catch(error => res.status(400).json({ error }));
};

//Supprime le livre avec l'_id fourni

exports.deleteBook =  (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
     .then(() => res.status(200).json({ message: 'livre supprimé !'}))
     .catch(error => res.status(400).json({ error })); 
};

// Renvoie le livre avec l’_id fourni

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