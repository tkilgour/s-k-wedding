window.onpopstate = function() {
  vm.$forceUpdate();
}

let vm = new Vue({
  el: "#rsvp",
  data: {
    party: null,
    loading: true,
    saving: null,
    thanks: false
  },
  methods: {
    getHash: function() {
      return window.location.hash;
    },
    partyAttending: function() {
      window.location.hash = "attending";
      this.party.guests.forEach(guest => {
        guest.attending = true;
      });
    },
    partyNotAttending: function() {
      this.party.guests.forEach(guest => {
        guest.attending = false;
        guest.camping = false;
        guest.breakfast = false;
      });
      this.party.potluck = false;
      this.submit();
    },
    partyAttendanceCheck(party) {
      let attending = false;
      party.guests.forEach(guest => {
        if (guest.attending) attending = true;
      });
      return attending;
    },
    guestAttendance: function(guest) {
      if (guest.attending) {
        guest.camping = false;
        guest.breakfast = false;
      }
    },
    addGuest: function(e) {
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
    removeGuest: function(i) {
      this.party.guests.splice(i, 1);
    },
    submit: function(e) {
      if (this.party) {
        this.saving = true;
        if (!this.partyAttendanceCheck(this.party)) this.party.potluck = false;
        axios
          .put("/api/parties/" + this.party._id, this.party)
          .then(res => {
            if (res.data.saved) {
              this.party.rsvp_attending = false;
              this.party.guests.forEach(guest => {
                if (guest.attending) this.party.rsvp_attending = true;
              });
              this.saving = false;
              window.location.hash = "thanks";
              this.thanks = true;
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  },
  computed: {
    isDisabled() {
      return this.party.guests.length >= this.party.max_guests;
    }
  },
  mounted() {
    axios
      // ASSUMPTION: the pathname will always be "/{party_slug}"
      .get("/api/parties" + location.pathname)
      .then(res => {
        if (res.data !== null) {
          this.party = res.data;
          if (this.party.rsvp_saved) {
            this.party.rsvp_attending = false;
            this.party.guests.forEach(guest => {
              if (guest.attending) this.party.rsvp_attending = true;
            });
          }
        }
        this.loading = false;
      });
  }
});
