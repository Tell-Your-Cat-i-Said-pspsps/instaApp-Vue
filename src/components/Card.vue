<script setup>
const envs = import.meta.env;
const { post } = defineProps(["post"]);
const { VITE_BASE_PHOTO_URL } = envs;
</script>
<template>
  <a-card hoverable style="width: 240px">
    <template #cover>
      <img alt="example" :src="`${VITE_BASE_PHOTO_URL}/${post.url}`" />

    </template>
    <a-card-meta :title="post.username">
      <template #description>{{ post.caption }}</template>
    </a-card-meta>
  </a-card>
</template>