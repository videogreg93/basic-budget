<template>
  <b-row class="header">
    <h4>Basic Budget</h4>
    <b-nav pills class="navigation">
      <b-nav-item active>Active</b-nav-item>
      <b-nav-item>Link</b-nav-item>
    </b-nav>
    <div class="login">
      <b-link to="/login/">Login</b-link>
    </div>
  </b-row>
</template>

<script>
export default {
  name: "HeaderComponent",
  data() {},
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
</style>
