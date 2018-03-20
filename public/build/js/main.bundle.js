"use strict";

window.onpopstate = function () {
  vm.$forceUpdate();
};

var vm = new Vue({
  el: "#rsvp",
  data: {
    party: null,
    loading: true,
    saving: null,
    thanks: false
  },
  methods: {
    getHash: function getHash() {
      return window.location.hash;
    },
    partyAttending: function partyAttending() {
      window.location.hash = "attending";
      this.party.guests.forEach(function (guest) {
        guest.attending = true;
      });
    },
    partyNotAttending: function partyNotAttending() {
      this.party.guests.forEach(function (guest) {
        guest.attending = false;
        guest.camping = false;
        guest.breakfast = false;
      });
      this.party.potluck = false;
      this.submit();
    },
    partyAttendanceCheck: function partyAttendanceCheck(party) {
      var attending = false;
      party.guests.forEach(function (guest) {
        if (guest.attending) attending = true;
      });
      return attending;
    },

    guestAttendance: function guestAttendance(guest) {
      if (guest.attending) {
        guest.camping = false;
        guest.breakfast = false;
      }
    },
    addGuest: function addGuest(e) {
      if (this.party.guests.length < this.party.max_guests) {
        var guest = {
          first_name: "",
          last_name: "",
          camping: false,
          breakfast: false,
          dietary: "",
          attending: true,
          manually_added: true
        };
        this.party.guests.push(guest);
      }
    },
    removeGuest: function removeGuest(i) {
      this.party.guests.splice(i, 1);
    },
    submit: function submit(e) {
      var _this = this;

      if (this.party) {
        this.saving = true;
        if (!this.partyAttendanceCheck(this.party)) this.party.potluck = false;
        axios.put("/api/parties/" + this.party._id, this.party).then(function (res) {
          if (res.data.saved) {
            _this.party.rsvp_attending = false;
            _this.party.guests.forEach(function (guest) {
              if (guest.attending) _this.party.rsvp_attending = true;
            });
            _this.saving = false;
            window.location.hash = "thanks";
            _this.thanks = true;
          }
        }).catch(function (err) {
          console.error(err);
        });
      }
    }
  },
  computed: {
    isDisabled: function isDisabled() {
      return this.party.guests.length >= this.party.max_guests;
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    axios
    // ASSUMPTION: the pathname will always be "/{party_slug}"
    .get("/api/parties" + location.pathname).then(function (res) {
      if (res.data !== null) {
        _this2.party = res.data;
        if (_this2.party.rsvp_saved) {
          _this2.party.rsvp_attending = false;
          _this2.party.guests.forEach(function (guest) {
            if (guest.attending) _this2.party.rsvp_attending = true;
          });
        }
      }
      _this2.loading = false;
    });
  }
});
