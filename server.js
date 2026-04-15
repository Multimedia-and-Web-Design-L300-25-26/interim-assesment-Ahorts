const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

// Load environment variables and connect to DB
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", require("./src/routes/authRoutes"));
app.use("/crypto", require("./src/routes/cryptoRoutes"));

app.get("/", (_req, res) => {
  res.send("Ahorts Crypto Clone API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
