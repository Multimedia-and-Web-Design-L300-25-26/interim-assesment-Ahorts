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
    coingeckoId: String,
    priceUSD: {
      type: Number,
      required: [true, "Please provide a price in USD"],
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
    // Bundled descriptive data for the explore page. TODO: Seed DB
    description: {
      en: String,
    },
    links: {
      homepage: [String],
      whitepaper: String,
      blockchain_site: [String],
      official_forum_url: [String],
      chat_url: [String],
      announcement_url: [String],
      twitter_screen_name: String,
      facebook_username: String,
      bitcointalk_thread_identifier: String,
      telegram_channel_identifier: String,
      subreddit_url: String,
      repos_url: {
        github: [String],
        bitbucket: [String],
      },
    },
    market_data: {
      current_price: {
        usd: Number,
        ghs: Number,
      },
      market_cap: {
        usd: Number,
        ghs: Number,
      },
      total_volume: {
        usd: Number,
        ghs: Number,
      },
      high_24h: {
        usd: Number,
        ghs: Number,
      },
      low_24h: {
        usd: Number,
        ghs: Number,
      },
      price_change_24h: Number,
      price_change_percentage_24h: Number,
      circulating_supply: Number,
      total_supply: Number,
      max_supply: Number,
      ath: {
        usd: Number,
        ghs: Number,
      },
      atl: {
        usd: Number,
        ghs: Number,
      },
    },
    categories: [String],
    genesis_date: String,
    sentiment_votes_up_percentage: Number,
    sentiment_votes_down_percentage: Number,
    watchlist_portfolio_users: Number,
    coingecko_rank: Number,
    coingecko_score: Number,
    developer_score: Number,
    community_score: Number,
    liquidity_score: Number,
    public_interest_score: Number,
  },
  { timestamps: true },
);

const Crypto = mongoose.model("Crypto", cryptoSchema);
module.exports = Crypto;
