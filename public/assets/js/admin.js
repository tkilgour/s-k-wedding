let vm = new Vue({
  el: "#admin",
  data: {
    loading: true,
    parties: [],
    saved_guests: [],
    admin: "Thomas"
  },
  methods: {
    getSavedParties() {
      return this.parties.filter(party => {
        return party.rsvp_saved;
      });
    }
  },
  computed: {
    numOpened: function() {
      let parties_opened = this.parties.filter(party => {
        return party.rsvp_opened;
      });
      return parties_opened.length;
    },
    numSaved: function() {
      return this.getSavedParties().length;
    },
    numPotluck: function() {
      return this.getSavedParties().filter(party => party.potluck).length;
    },
    totalAttending: function() {
      return this.saved_guests.filter(guest => guest.attending).length
    },
    totalCamping: function() {
      return this.saved_guests.filter(guest => guest.camping).length
    },
    totalBreakfast: function() {
      return this.saved_guests.filter(guest => guest.breakfast).length
    }
  },
  mounted() {
    axios
      // ASSUMPTION: the pathname will always be "/{party_slug}"
      .get("/api/parties")
      .then(res => {
        if (res.data !== null) {
          this.parties = res.data;
        }
      });

    axios.get("/api/guests/saved").then(res => {
      if (res.data !== null) {
        this.saved_guests = res.data;
      }
      this.loading = false;
    });
  }
});
