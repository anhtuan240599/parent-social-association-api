<template>
  <div>
    <div class="card card-login">
      <div class="card_body">
        <form @submit.prevent="login">
            <div class="form_group">
                <label for="username">Username</label>
                <input id="username" type="text" class="form_control">
            </div>
            <div class="form_group">
                <label for="password">Password</label>
                <input id="password" type="text" class="form_control">
            </div>
            <div class="form_group">
                <label for="firstName">Firstname</label>
                <input id="firstName" type="text" class="form_control">
            </div>
            <div class="form_group">
                <label for="lastName">LastName</label>
                <input id="lastName" type="text" class="form_control">
            </div>
            <button class="btn btn_success btn">Regiser</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default{
    methods: {
        login(){
            console.log("Login func...");
        }
    }
}
</script>

<style lang="scss" scoped>
    .card-login{
        width: 450px;
    }
</style>