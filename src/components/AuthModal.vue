<script setup>
import { ref, defineProps, reactive } from "vue";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
//pinia store

const userStore = useUserStore();
const { errorMessage, loading, user } = storeToRefs(userStore);
const userCredentials = reactive({
  email: "",
  username: "",
  password: ""
});

//handle DOM Objects
const modalVisible = ref(false);
const { isLogin } = defineProps(["isLogin"]);
const title = isLogin ? "Login" : "Signup";
const clearUserCredentials = () => {
  userCredentials.email = "";
  userCredentials.password = "";
  userCredentials.username = "";
  userStore.clearErrorMessage();
};
const handleOk = async () => {
  if (isLogin) {
    await userStore.handleLogin({
      email: userCredentials.email,
      password: userCredentials.password
    });
  } else {
    await userStore.handleSignup(userCredentials);
  }
  if (user.value) {
    modalVisible.value = false;
    clearUserCredentials();
  }
};
const handleCancel = () => {
  userStore.clearErrorMessage();
  modalVisible.value = false;
};
</script>
<template>
  <div>
    <a-button type="primary" @click="modalVisible = true">
      {{ title }}
    </a-button>
    <a-modal
      v-model:open="modalVisible"
      :title="title"
      centered
      @cancel="handleCancel"
    >
      <template #footer>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleOk"
          >Submit</a-button
        >
      </template>
      <div v-if="!loading" class="input-container">
        <a-input
          v-if="!isLogin"
          v-model:value="userCredentials.username"
          placeholder="Username"
        />
        <a-input v-model:value="userCredentials.email" placeholder="Email" />
        <a-input
          v-model:value="userCredentials.password"
          placeholder="Password"
          type="password"
        />
        <a-typography-text v-if="errorMessage" type="danger">
          {{ errorMessage }}
        </a-typography-text>
      </div>
      <div v-else class="spinner">
        <a-spin></a-spin>
      </div>
    </a-modal>
  </div>
</template>
<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}
</style>
