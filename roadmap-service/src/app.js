const express = require("express");
const cors = require("cors");
require("dotenv").config();
const verifyInternalAuth = require("./middlewares/verifyInternalAuth.js");

const app = express();

const roadmapRoutes = require("./routes/roadmapRoutes.js");
app.use(cors());
app.use(express.json());

app.use((req, res,next) => {
    console.log("Request received");
    next();
});
app.use("/api", verifyInternalAuth);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/roadmaps", roadmapRoutes);


const connectDB = require("./config/db.js");

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });