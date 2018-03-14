new Vue({
  el: "#rsvp",
  data: {
    party: null,
    loading: true
  },
  methods: {
    addGuest: function(e) {
      if (this.party.guests.length < this.party.max_guests) {
        var guest = {
          first_name: "",
          last_name: "",
          camping: false,
          breakfast: false,
          dietary: "",
          temp_added: true
        };
        this.party.guests.push(guest);
      }
    },
    removeGuest: function(i) {
      this.party.guests.splice(i, 1);
    },
    submit: function(e) {
      
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
      .get("http://localhost:5001/api/" + location.pathname)
      .then(res => {
        if (res.data.length > 0) this.party = res.data[0];
        this.loading = false;
      })
  }
});
