const express = require("express");
const basicAuth = require("express-basic-auth");
const path = require("path");
const PORT = process.env.PORT || 5000;

require('dotenv').config();

express()
	.use(
		basicAuth({
			users: { admin: process.env.AUTH_PASS },
			challenge: true
		})
	)
	.use(express.static(path.join(__dirname, "public")))
	.set("views", path.join(__dirname, "views"))
	.set("view engine", "ejs")
	.get("/", (req, res) => res.render("pages/index"))
	.listen(PORT, () => console.log(`Listening on ${PORT}`));
