<script setup>
import UploadModal from "./UploadModal.vue";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { supabase } from "../../supabase";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { userInfo, currentUser, addNewPost, isFollowing, updateIsFollowing } = defineProps([
  "userInfo",
  "currentUser",
  "addNewPost",
  "isFollowing",
  "updateIsFollowing"
]);
const { username: profileUsername } = useRoute().params;
const followUser = async () => {
  await supabase.from("followers_following").insert({
    follower_id: user.value.id,
    following_id: currentUser.id
  });
  updateIsFollowing(true);
};
const unfollowUser = async () => {
  //currentUser is the user which we are currently viewing his profile
  await supabase.from("followers_following").delete()
    .eq("follower_id", user.value.id)
    .eq("following_id", currentUser.id);
  updateIsFollowing(false);
};
</script>
<template>
  <div class="userbar-content" v-if="currentUser">
    <div class="top-content">
      <a-typography-title :level="2">{{ currentUser.username }}</a-typography-title>
      <div v-if="user">
        <upload-modal v-if="profileUsername === user.username" :addNewPost="addNewPost" />
        <div v-else>
          <a-button v-if="isFollowing" ghost @click="unfollowUser">Following</a-button>
          <a-button v-else ghost @click="followUser">Follow</a-button>
        </div>
      </div>
    </div>
    <div class="bottom-content">
      <a-typography-title :level="5">{{ userInfo.posts }} posts</a-typography-title>
      <a-typography-title :level="5">{{ userInfo.followers }} followers</a-typography-title>
      <a-typography-title :level="5">{{ userInfo.following }} following</a-typography-title>
    </div>
  </div>
  <div class="userbar-content" v-else>
    <div class="top-content">
      <a-typography-title :level="2">User Not Found</a-typography-title>
    </div>
  </div>
</template>
<style scoped>
.userbar-content {
  display: flex;
  flex-direction: column;
  color: rgba(235, 235, 235, 0.64);
}

.top-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bottom-content {
  display: flex;
  gap: 16px;
  align-items: center;
}

.bottom-content h5 {
  margin: 0;
  padding: 0;
  color: rgba(235, 235, 235, 0.64);
}

.top -content h2 {
  color: rgba(235, 235, 235, 0.64);
}
</style>
