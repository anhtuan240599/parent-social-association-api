<template>
  <div id="app">
    <header-public />
    <div class="r">
      <div class="ct">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderPublic from "./components/PublicHeader";
export default {
  components: {
    HeaderPublic,
  },
};
</script>

<style lang="scss"></style>
