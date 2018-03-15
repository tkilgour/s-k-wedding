"use strict";

new Vue({
  el: "#rsvp",
  data: {
    party: null,
    loading: true,
    saving: null
  },
  methods: {
    addGuest: function addGuest(e) {
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
    removeGuest: function removeGuest(i) {
      this.party.guests.splice(i, 1);
    },
    submit: function submit(e) {
      var _this = this;

      if (this.party) {
        this.saving = true;
        axios.put("/api/parties/" + this.party._id, this.party).then(function (res) {
          if (res.data.saved) {
            _this.saving = false;
            setTimeout(function () {
              this.saving = null;
            }.bind(_this), 5000);
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
      if (res.data !== null) _this2.party = res.data;
      _this2.loading = false;
    });
  }
});
