require("dotenv").config();

//first we import our dependencies...
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const PushBullet = require("pushbullet");
const basicAuth = require("express-basic-auth");
const Party = require("./party_schema");

//and create our instances
const app = express();
const router = express.Router();
const pusher = new PushBullet(process.env.PB_API_KEY);

//set our port to either a predetermined port number if you have set it up, or 3001
const port = process.env.PORT || 5000;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

//db config
mongoose.connect(
  `mongodb://${user}:${pass}@ds117888.mlab.com:17888/wedding-management`
);

// Setup static server
app
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "public/views"))
  .set("view engine", "ejs")

//now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// TODO: change route to /admin before launch
app.use("/", basicAuth({
  users: { "admin": process.env.AUTH_PASS },
  challenge: true
}))

// simulate server latency
// app.use((req, res, next) => setTimeout(next, 1000))

app
  // Home
  .get("/", (req, res) => res.render("pages/index"))

  // Admin
  .get("/admin", (req, res) => res.render("pages/admin"))
  
  // RSVP
  .get("/:party", (req, res) => res.render("pages/rsvp"))

// API

// get all parties
router.get("/parties", (req, res) => {
  Party.find({}, (err, parties)  => {
    res.json(parties)
  })
})

router
  .route("/parties/:query")

  // get specific Party from DB
  .get(function(req, res) {

    Party.findOne({ party_slug: req.params.query.toLowerCase() }, function(err, party) {
      if (err) res.send(err);

      if (party) {
        party.rsvp_opened = true;
        
        party.save(function(err) {
          if (err) res.send(err);
          
          pusher.note(process.env.PB_PHONE_TOKEN, `"${party.party_name}" visited their RSVP page`);
        })
      }

      res.json(party);
    });
  });

router
  .route("/parties/:party_id")
  // update specific Party in DB
  .put(function(req, res) {
    Party.findById(req.params.party_id, function(err, party) {
      if (err) res.send(err);

      req.body.guests ? (party.guests = req.body.guests) : null;
      party.potluck = req.body.potluck;
      // if (req.body.rsvp_attending) party.rsvp_attending = true;
      party.rsvp_saved = true;

      party.save(function(err) {
        if (err) res.send(err);

        pusher.note(process.env.PB_PHONE_TOKEN, `"${party.party_name}" updated their RSVP`);
        res.json({ saved: true });
      });
    });
  });

router.get('/guests', (req, res) => {
  Party.find({}, (err, parties) => {
    if (err) console.error(err);

    let guests = []

    parties.forEach(party => {
      guests = guests.concat(party.guests);
    })
    
    res.json(guests);
  })
})
  
router.get('/guests/saved', (req, res) => {
  Party.find({}, (err, parties) => {
    if (err) console.error(err);

    let guests = []

    parties.forEach(party => {
      if (party.rsvp_saved) {
        guests = guests.concat(party.guests);
      }
    })
    
    res.json(guests);
  })
})
  
//Use our router configuration when we call /api
app.use("/api", router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
