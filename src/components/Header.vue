<template>
  <b-row class="header">
    <h4 v-on:click="goHome()" class="home-button">Basic Budget</h4>
    <b-nav pills class="navigation">
      <b-nav-item active>Active</b-nav-item>
      <b-nav-item>Link</b-nav-item>
    </b-nav>
    <div class="login" v-if="user.loggedIn">
      <b-dropdown
        split
        split-variant="outline-primary"
        variant="primary"
        :text="user.data.email"
        class="m-2"
      >
        <b-dropdown-item href="#" v-on:click="signOut()"
          >Sign Out</b-dropdown-item
        >
      </b-dropdown>
    </div>
    <div class="login" v-else>
      <b-link to="/login/">Login</b-link>
    </div>
  </b-row>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";

export default {
  name: "HeaderComponent",
  data() {
    return {};
  },
  methods: {
    signOut() {
      var vue = this;
      firebase
        .auth()
        .signOut()
        .then(() => {
          vue.$router.replace({
            name: "login",
          });
        });
    },
    goHome() {
      this.$router.push("/");
    }
  },
  computed: {
    ...mapGetters({
      // map `this.user` to `this.$store.getters.user`
      user: "user",
    }),
  },
};
</script>


<style scoped>
.header {
  padding-left: 5%;
  padding-top: 2%;
  margin-bottom: 2%;
  box-shadow: 0 1px 5px 0 rgb(0 0 0 / 20%);
}

.navigation {
  margin-left: 3%;
  position: relative;
  bottom: 10px;
}

.login {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 70%;
  position: relative;
  bottom: 10px;
}

.home-button {
  cursor: pointer;
}
</style>
