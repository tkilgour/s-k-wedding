new Vue({
  el: "#rsvp",
  data: {
    party: null,
    loading: true,
    saving: null
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
          attending: true,
          temp_added: true
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
        axios
          .put("http://localhost:5001/api/parties/" + this.party._id, this.party)
          .then(res => {
            if (res.data.saved) {
              var saving = this.saving
              this.saving = false;
              setTimeout(function() { this.saving = null; }.bind(this), 5000)
            }
          })
          .catch(err => {
            console.error(err);
          })
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
      .get("http://localhost:5001/api/parties" + location.pathname)
      .then(res => {
        if (res.data.length > 0) this.party = res.data[0];
        this.loading = false;
      })
  }
});
