<template>
  <b-container>
    <h1 class="login-title">Login</h1>
    <b-alert id="alert" variant="danger" :show="showError()" dismissible fade>{{
      error
    }}</b-alert>
    <b-link class="register-link" to="/register/">Register</b-link>
    <b-row class="form-container">
      <b-form class="login-form">
        <b-form-group
          id="input-group-1"
          label="Email address:"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            type="email"
            v-model="email"
            placeholder="Enter email"
            :state="emailValidation"
            required
          ></b-form-input>
          <b-form-invalid-feedback :state="emailValidation">
            Invalid email
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="input-group-2" label="Password:" label-for="input-2">
          <b-form-input
            id="input-2"
            type="password"
            v-model="password"
            placeholder="Password"
            required
          ></b-form-input>
        </b-form-group>
        <b-button
          type="submit"
          block
          variant="primary"
          v-on:click="attemptLogin"
          >Submit</b-button
        >

        <hr data-content="or" class="u-hr-text" />

        <b-button
          name="button"
          type="button"
          block
          variant="primary"
          data-label="Continue with Google"
          v-on:click="loginWithGoogle"
        >
          <span class="google-image">
            <img
              src="https://ynab-evergreen-assets.youneedabudget.com/ynab-api-production/v1.61940/assets/google-logo-54e60c3db3a805b0cdd5ace5c871f691ebe85248f6685f663c0e007ace582b72.svg"
              class="google-image"
            /> </span
          ><span class="brand-name">Continue with Google</span>
        </b-button>
      </b-form>
    </b-row>
  </b-container>
</template>

<script>
import firebase from "firebase";
import store from "../store";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    showError() {
      return this.error != "";
    },
    loginWithGoogle() {
      var vue = this;
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((user) => {
          console.log("login success")
          store.dispatch("fetchUser", user);
          console.log(firebase.auth().currentUser.uid);
          vue.$router.replace({ name: "Dashboard" });
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
    attemptLogin(event) {
      event.preventDefault();
      var vue = this;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          store.dispatch("fetchUser", user);
          console.log(firebase.auth().currentUser.uid);
          vue.$router.replace({ name: "Dashboard" });
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
  },
  computed: {
    emailValidation() {
      return this.email.includes("@");
    },
  },
};
</script>

<style>
.login-title {
  text-align: center;
}

.form-container {
  display: block;
  text-align: center;
  padding-top: 2%;
}

.login-form {
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
}

.register-link {
  text-align: center;
}

.google-image {
  width: 10%;
  position: relative;
  right: 4%;
}
</style>