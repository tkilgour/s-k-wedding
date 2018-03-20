let vm = new Vue({
  el: "#admin",
  data: {
    loading: true,
    parties: [],
    saved_guests: [],
    admin: "Thomas",
    active_tab: "first"
  },
  methods: {
    getSavedParties() {
      return this.parties.filter(party => {
        return party.rsvp_saved;
      });
    },
    partyAttending(party) {
      let attending = false;
      party.guests.forEach(guest => {
        if (guest.attending) attending = true;
      });
      return attending;
    }
  },
  computed: {
    partiesNotOpened: function() {
      let parties_not_opened = this.parties.filter(party => {
        return (!party.rsvp_opened && !party.rsvp_saved);
      })
      return parties_not_opened;
    },
    partiesOpenedNotSaved: function() {
      let parties_opened = this.parties.filter(party => {
        return (party.rsvp_opened && !party.rsvp_saved);
      });
      return parties_opened;
    },
    partiesSaved: function() {
      return this.getSavedParties();
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
    },

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
