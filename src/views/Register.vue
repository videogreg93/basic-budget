<template>
  <b-container>
    <h1 class="login-title">Sign Up</h1>
    <b-alert id="alert" variant="danger" :show="showError()" dismissible fade>{{
      error
    }}</b-alert>
    <b-link class="register-link" to="/login/">Log in</b-link>
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
          v-on:click="attemptRegister"
          >Sign Up</b-button
        >
      </b-form>
    </b-row>
  </b-container>
</template>

<script>
import firebase from "firebase";

export default {
  name: "RegisterView",
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
    attemptRegister(event) {
      event.preventDefault();
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
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
</style>