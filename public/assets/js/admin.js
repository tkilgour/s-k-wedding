new Vue({
  el: "#admin",
  data: {
    loading: true,
    parties: [],
    admin: "Thomas"
  },
  methods: {
    
  },
  computed: {
    numOpened: function() {
      let parties_opened = this.parties.filter(party => {
        (party.rsvp_opened)
      })
    }
  },
  mounted() {
    axios
      // ASSUMPTION: the pathname will always be "/{party_slug}"
      .get("/api/parties")
      .then(res => {
        if (res.data !== null) {
          this.parties = res.data
        };
        this.loading = false;
      })
  }
});
