const express = require("express");
const basicAuth = require("express-basic-auth");
const path = require("path");
const PORT = process.env.PORT || 5000;

require("dotenv").config();

express()
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")

  // Home
  .get("/", (req, res) => res.render("pages/index"))

  .use(
    basicAuth({
      users: { admin: "wedding" },
      challenge: true
    })
  )
  // RSVP
  .get("/rsvp", (req, res) => res.render("pages/rsvp"))

  .listen(PORT, () => console.log(`Listening on ${PORT}`));
