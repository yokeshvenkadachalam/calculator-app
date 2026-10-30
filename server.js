
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Calculator server is running"
    });
});

app.listen(PORT, () => {
    console.log(`Calculator running at http://localhost:${PORT}`);
});
