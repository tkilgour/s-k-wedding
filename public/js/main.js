// window.onload = function() {
  new Vue({
    el: "#rsvp",
    data: {
      party_name: "",
      guests: [],
      max_guests: 0,
      loading: true,
    },
    methods: {
      addGuest: function(e) {
        if (this.guests.length < this.max_guests) {
          var guest = {
            first_name: "",
            last_name: "",
            camping: false,
            breakfast: false,
            dietary: "",
            temp_added: true
          };
          this.guests.push(guest);
        }
      },
      removeGuest: function(i) {
        this.guests.splice(i, 1);
      }
    },
    computed: {
      isDisabled() {
        return this.guests.length >= this.max_guests;
      }
    },
    mounted() {
      axios
        // ASSUMPTION: the pathname will always be "/{party_slug}"
        .get("http://localhost:5001/api/" + location.pathname)
        .then(res => {
          let party = res.data[0]

          this.party_name = party.party_name;
          this.guests = party.guests;
          this.max_guests = party.max_guests;
          this.loading = false;
        })
    }
  });
// };
