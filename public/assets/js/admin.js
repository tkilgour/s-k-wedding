let vm = new Vue({
  el: "#admin",
  data: {
    loading: true,
    parties: [],
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
    confirmedAttending: function() {
      let numAttending = 0;

      this.getSavedParties().forEach(party => {
        party.guests.forEach(guest => {
          if (guest.attending) numAttending++;
        })
      });

      return numAttending;
    },
    confirmedNotAttending: function() {
      let numNotAttending = 0;

      this.getSavedParties().forEach(party => {
        party.guests.forEach(guest => {
          if (!guest.attending) numNotAttending++;
        })
      });

      return numNotAttending;
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
        this.loading = false;
      });
  }
});
