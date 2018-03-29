"use strict";
//import dependency
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an
//object that shows the shape of your database entries.
var BackupSchema = new Schema({
  backup_date: { type: Date, default: Date.now },
  backups: [
    {
      party_name: {
        type: String,
        required: true
      },
      party_slug: String,
      maxGuests: Number,
      potluck: Boolean,
      rsvp_opened: Boolean,
      rsvp_attending: Schema.Types.Mixed,
      rsvp_saved: Boolean,
      guests: [
        {
          first_name: String,
          last_name: String,
          attending: Boolean,
          camping: Boolean,
          breakfast: Boolean,
          dietary: String,
          manually_added: Boolean
        }
      ]
    }
  ]
});

//export our module to use in server.js
module.exports = mongoose.model("Backup", BackupSchema);
