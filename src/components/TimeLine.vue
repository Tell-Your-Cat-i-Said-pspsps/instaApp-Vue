<script setup>
import { useUserStore } from "@/stores/users";
import Container from "./Container.vue";
import { storeToRefs } from "pinia";
import Cards from "./Cards.vue";
import LoginMessage from "./LoginMessage.vue";
const userStore = useUserStore();
const { user, loadingUser } = storeToRefs(userStore);
</script>
<template>
  <Container>
    <div v-if="!loadingUser">
      <Cards v-if="user" />
      <LoginMessage v-else />
    </div>
    <div class="timeline-spinner" v-else>
      <a-spin></a-spin>
    </div>
  </Container>
</template>
<style scoped>
.timeline-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 85vh;
}
</style>
