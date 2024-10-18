<script setup>
import { onMounted } from "vue";
import Nav from "./components/Nav.vue";
import { useUserStore } from "./stores/users";
const userStore = useUserStore();
onMounted(() => {
  userStore.getUser();
});
</script>
<template>
  <main>
    <Nav />
    <RouterView />
  </main>
</template>

<style scoped></style>
