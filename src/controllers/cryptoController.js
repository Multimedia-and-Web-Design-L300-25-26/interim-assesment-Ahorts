const Crypto = require("../models/Crypto");
const { convertPrice } = require("../utils/currencyConverter");

const formatCoin = (coin, currency) => {
  const coinObj = coin.toObject();
  return {
    ...coinObj,
    price: convertPrice(coinObj.priceUSD, currency),
    currency: currency,
  };
};

exports.getAllCrypto = async (req, res) => {
  try {
    const currency = req.query.currency || "USD";
    const cryptos = await Crypto.find().sort({ priceUSD: -1 });

    const formatted = cryptos.map((c) => formatCoin(c, currency));

    res.status(200).json({
      status: "success",
      results: formatted.length,
      data: { cryptos: formatted },
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.getGainers = async (req, res) => {
  try {
    const currency = req.query.currency || "USD";
    // Any positive change is a gainer, sorted by highest first
    const cryptos = await Crypto.find({ change24h: { $gt: 0 } }).sort({
      change24h: -1,
    });

    const formatted = cryptos.map((c) => formatCoin(c, currency));

    res.status(200).json({
      status: "success",
      data: { cryptos: formatted },
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.getNewListings = async (req, res) => {
  try {
    const currency = req.query.currency || "USD";
    const cryptos = await Crypto.find({ isNewListing: true }).sort({
      createdAt: -1,
    });

    const formatted = cryptos.map((c) => formatCoin(c, currency));

    res.status(200).json({
      status: "success",
      data: { cryptos: formatted },
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.addCrypto = async (req, res) => {
  try {
    const { name, symbol, price, image, change24h, currency } = req.body;

    const exchangeRates = { USD: 1, GHS: 11.05, EUR: 0.92, GBP: 0.79 };
    const rate = exchangeRates[currency || "USD"] || 1;
    const priceUSD = price / rate;

    const newCrypto = await Crypto.create({
      name,
      symbol,
      priceUSD,
      image,
      change24h,
      isGainer: change24h > 0,
      isNewListing: true,
    });

    res.status(201).json({
      status: "success",
      data: { crypto: newCrypto },
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
