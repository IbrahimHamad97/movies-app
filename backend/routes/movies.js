const express = require("express");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const Movie = require("../models/movie");

const router = express.Router();

const TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = TYPES[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const movie = new Movie({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      rating: 0,
      creator: req.userData.userId,
    });
    movie.save().then((createdMovie) => {
      res.status(201).json({
        message: "thanks",
        movie: {
          ...createdMovie,
          id: createdMovie._id,
        },
      });
    });
  }
);

router.delete("/:id", checkAuth, (req, res, next) => {
  Movie.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      res.status(200).json({ message: "Deletion successful!" });
    }
  );
});

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const movie = new Movie({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId,
    });
    Movie.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      movie
    ).then((result) => {
      res.status(200).json({ message: "success" });
    });
  }
);

router.get("/:id", (req, res, next) => {
  Movie.findById(req.params.id).then((movie) => {
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  });
});

router.use("", (req, res, next) => {
  Movie.find().then((docs) => {
    res.status(200).json({
      message: "meow",
      movies: docs,
    });
  });
});

module.exports = router;
