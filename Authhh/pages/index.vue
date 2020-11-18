<template>
  <div>
    <div v-for="(deck, index) in decks" :key="deck._id">
      <div>
        <span> {{ deck.description }} </span>
      </div>
      <a href="#">
      <v-for>
        <img :src="deck.image[0].filename">
      </v-for>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    try {
      let response = await $axios.$get("http://localhost:4000/decks");
      return {
        decks: response.decks
      };
    } catch (err) {}
  }
};
</script>
