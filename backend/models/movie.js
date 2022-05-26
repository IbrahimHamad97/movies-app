const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  ratingsList: [
    {
      rated: {
        type: Number,
      },
      rater: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Movie", movieSchema);
