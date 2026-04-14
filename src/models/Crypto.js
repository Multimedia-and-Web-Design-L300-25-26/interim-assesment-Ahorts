const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    symbol: {
      type: String,
      required: [true, "Please provide a symbol"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    image: {
      type: String,
      required: [true, "Please provide an image URL"],
    },
    change24h: {
      type: Number,
      required: [true, "Please provide a 24h change percentage"],
    },
    isGainer: {
      type: Boolean,
      default: false,
    },
    isNewListing: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
    },
    // We can add more fields here later
  },
  { timestamps: true },
);

const Crypto = mongoose.model("Crypto", cryptoSchema);
module.exports = Crypto;
