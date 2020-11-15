<template>
<nav class="nav">
    <div class="r">
        <div class="ct">
            <div class="d_flex">
                <div class="lgo">
                    <a href="#">Auth</a>
                </div>
                <ul class="ml_auto items">
                    <li><router-link: to="{name :'Home'}">Home</router-link></li>
                    <li><router-link: to="{name :'Secret'}">Secret</router-link></li>
                    <li><router-link: to="{name :'Login'}">Login</router-link></li>
                    <li><router-link: to="{name :'Register'}">Register</router-link></li>
                </ul>
            </div>
        </div>
    </div>
</nav>
</template>

<style lang="scss" scoped>
.nav {
    background-color: #000;
    height: 100px;
    .items {
    display: flex;
    list-style: none;

    li {
        margin: 10px;
    }
}
}
</style>
