<script setup>
import { RouterLink, useRouter } from "vue-router";
import Container from "./Container.vue";
import { ref } from "vue";
import AuthModal from "./AuthModal.vue";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";


const userStore = useUserStore();
const { user, loadingUser } = storeToRefs(userStore);
const handleLogout = async () => {
  await userStore.handleLogout();
};
const goToUserProfile = () => {
  router.push(`/profile/${user.value.username}`);
};
const searchUsername = ref("");
const router = useRouter();
const onSearch = () => {
  if (searchUsername.value) {
    router.push(`/profile/${searchUsername.value}`);
    searchUsername.value = "";
  }
};
</script>
<template>
  <ALayoutHeader>
    <Container>
      <div class="nav-container">
        <div class="right-content">
          <RouterLink to="/"><img src="../assets/logo.svg" /></RouterLink>
          <a-input-search v-model:value="searchUsername" placeholder="Search Username..." style="width: 350px"
            @search="onSearch" />
        </div>
        <div v-if="!loadingUser">

          <div class="btn-container" v-if="!user">
            <AuthModal />
            <AuthModal :isLogin="true" />
          </div>
          <div class="btn-container" v-else>
            <a-button type="primary" @click="goToUserProfile">Profile</a-button>
            <a-button type="primary" danger @click="handleLogout">Logout</a-button>
          </div>
        </div>


      </div>
    </Container>
  </ALayoutHeader>
</template>
<style scoped>
a img {
  width: 40px;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.right-content {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 10px 0;
}

.btn-container {
  display: flex;
  gap: 8px;
}

.ant-layout-header {
  border-bottom: 0.1rem solid rgba(235, 235, 235, 0.2);
}

.ant-layout-header a {
  display: flex;
  align-items: center;
}
</style>
