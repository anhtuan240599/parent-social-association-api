<template>
  <div>
    <div class="card card-login">
      <div class="card_body">
        <form @submit.prevent="login">
            <div class="form_group">
                <label for="username">Username</label>
                <input id="username" type="text" class="form_control" v-model="username">
            </div>
            <div class="form_group">
                <label for="password">Password</label>
                <input id="password" type="password" class="form_control" v-model="password">
            </div>
            <button class="btn btn_success btn">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default{
    data() {
        return{
            username: '',
            password: ''
        }
    },
    methods: {
        login(){
            console.log("Login func...");
            this.$store.dispatch("AUTH/login",{
                username: this.username, 
                password: this.password
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .card-login{
        width: 450px;
    }
</style>