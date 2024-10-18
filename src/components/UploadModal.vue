<script setup>
import { ref } from "vue";
import { supabase } from "../../supabase";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
const loading = ref(false);
const open = ref(false);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { addNewPost } = defineProps(["addNewPost"]);
const errorMessage = ref("");
const showModal = () => {
  open.value = true;
};
const handleOk = async () => {
  loading.value = true;
  let filePath;
  const fileName = Math.floor(Math.random() * 1000000000000000);
  if (file.value) {
    const { data, error } = await supabase.storage
      .from("images")
      .upload("public/" + fileName, file.value);
    if (error) {
      loading.value = false;
      return (errorMessage.value = "Couldn't upload image");
    }
    filePath = data.path;
    await supabase.from("posts").insert({
      url: filePath,
      caption: caption.value,
      owner_id: user.value.id
    });

    addNewPost({
      url: filePath,
      caption: caption.value
    });
    loading.value = false;
    caption.value = "";
    open.value = false;
  }
};
const handleCancel = () => {
  open.value = false;
};
//Uploading an Image
const caption = ref("");
const file = ref(null);
const handleUploadChange = (e) => {
  if (e.target.files[0]) {
    file.value = e.target.files[0];
  }
};
</script>
<template>
  <div>
    <a-button @click="showModal"> Upload Photo </a-button>
    <a-modal v-model:open="open" title="Upload Photo" @ok="handleOk">
      <template #footer>
        <a-button key="back" @click="handleCancel"> Return </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          Submit
        </a-button>
      </template>
      <div v-if="!loading" class="modal-body">
        <input type="file" accept=".jpeg,.png,.jpg" @change="handleUploadChange" />
        <a-input v-model:value="caption" placeholder="Caption..." maxLength="50"></a-input>
        <a-typography-text v-if="errorMessage" type="danger">
          {{ errorMessage }}
        </a-typography-text>
      </div>
      <div v-else class="spinner">
        <a-spin />
      </div>
    </a-modal>
  </div>
</template>
<style scoped>
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
