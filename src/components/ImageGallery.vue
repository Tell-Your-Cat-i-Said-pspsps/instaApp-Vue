<script setup>
const { posts } = defineProps(["posts"]);
const envs = import.meta.env;
const { VITE_BASE_PHOTO_URL } = envs;
</script>
<template>
  <div class="image-gallery-container">
    <img v-for="post in posts" :key="post.id" :src="`${VITE_BASE_PHOTO_URL}/${post.url}`" />

  </div>
</template>
<style scoped>
.image-gallery-container {
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
}

img {
  margin: 5px;
  width: 200px;
}
</style>
