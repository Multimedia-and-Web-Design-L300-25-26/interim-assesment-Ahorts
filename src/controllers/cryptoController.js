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
    console.error("Crypto Controller Error:", error);
    res.status(400).json({ status: "fail", message: "Failed to process request. Please try again later." });
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
    console.error("Crypto Controller Error:", error);
    res.status(400).json({ status: "fail", message: "Failed to process request. Please try again later." });
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
    console.error("Crypto Controller Error:", error);
    res.status(400).json({ status: "fail", message: "Failed to process request. Please try again later." });
  }
};

exports.getCryptoBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;
    const currency = req.query.currency || "USD";
    const crypto = await Crypto.findOne({ symbol: symbol.toUpperCase() });

    if (!crypto) {
      return res.status(404).json({ status: "fail", message: "Crypto not found" });
    }

    const formatted = formatCoin(crypto, currency);

    res.status(200).json({
      status: "success",
      data: { crypto: formatted },
    });
  } catch (error) {
    console.error("Crypto Controller Error:", error);
    res.status(400).json({ status: "fail", message: "Failed to process request. Please try again later." });
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
    console.error("Crypto Controller Error:", error);
    res.status(400).json({ status: "fail", message: "Failed to process request. Please try again later." });
  }
};
