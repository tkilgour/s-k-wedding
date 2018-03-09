window.onload = function() {
  new Vue({
    el: "#rsvp",
    data: {
      party: "Skura / Kilgour",
      guests: [
        {
          firstName: "Anna",
          lastName: "Skura",
          camping: true,
          breakfast: true,
          dietary: ""
        },
        {
          firstName: "Thomas",
          lastName: "Kilgour",
          camping: true,
          breakfast: true,
          dietary: "vegetarian"
        }
      ],
      maxGuests: 3
    },
    methods: {
      addGuest: function(e) {
        if (this.guests.length < this.maxGuests) {
          var guest = {
            firstName: "",
            lastName: "",
            camping: false,
            breakfast: false,
            dietary: ""
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
        return this.guests.length >= this.maxGuests;
      }
    }
  });
};
