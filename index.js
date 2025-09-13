const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db");

require('dotenv').config();

const app = express();

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});