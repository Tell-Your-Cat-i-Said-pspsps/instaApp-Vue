<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import Container from './Container.vue';
import ImageGallery from './ImageGallery.vue';
import UserBar from './UserBar.vue';
import { supabase } from '../../supabase';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/users';
import { storeToRefs } from 'pinia';
const route = useRoute();
const { username } = route.params;
const posts = ref([]);
const user = ref(null);
const loadingProfile = ref(true);
const isFollowing = ref(false);
const userStore = useUserStore();
const { user: loggedInUser } = storeToRefs(userStore);
const userInfo = reactive({
  posts: null,
  followers: null,
  following: null
});
const addNewPost = (post) => {
  posts.value.unshift(post);
};
const fetchData = async () => {
  loadingProfile.value = true;
  const { data: userData } = await supabase
    .from('users')
    .select()
    .eq('username', username)
    .single();
  if (!userData) {
    loadingProfile.value = false;
    return (user.value = null);
  }
  user.value = userData;
  const { data: postsData } = await supabase.from('posts').select().eq('owner_id', user.value.id);
  posts.value = postsData;
  await fetchIsFollowing();
  loadingProfile.value = false;
  const followersCount = await fetchFollowersCount();
  const followingCount = await fetchFollowingCount();
  userInfo.posts = posts.value.length;
  userInfo.followers = followersCount;
  userInfo.following = followingCount;
};
const fetchIsFollowing = async () => {
  if (loggedInUser.value && loggedInUser.value.id !== user.value.id) {
    const { data } = await supabase
      .from('followers_following')
      .select()
      .eq('follower_id', loggedInUser.value.id)
      .eq('following_id', user.value.id)
      .single();
    if (data) return isFollowing.value = true;
  }
};
const updateIsFollowing = (follow) => {
  isFollowing.value = follow;
};
const fetchFollowersCount = async () => {
  const { count } = (await supabase.from('followers_following')
    .select('*', { count: "exact" })
    .eq("following_id", user.value.id));
  return count;
};
const fetchFollowingCount = async () => {
  const { count } = (await supabase.from('followers_following')
    .select('*', { count: "exact" })
    .eq("follower_id", user.value.id));
  return count;
};

watch(loggedInUser, async () => {
  await fetchIsFollowing();
});
onMounted(() => {
  fetchData();
});
</script>
<template>
  <Container>
    <div class="profile-container" v-if="!loadingProfile">
      <UserBar :addNewPost="addNewPost" :isFollowing="isFollowing" :updateIsFollowing="updateIsFollowing"
        :key="$route.params.username" :currentUser="user" :userInfo="userInfo" />
      <ImageGallery :posts="posts" />
    </div>
    <div class="spinner" v-else>
      <a-spin></a-spin>
    </div>
  </Container>
</template>
<style scoped>
.profile-container {
  padding: 8px;
  display: grid;
  gap: 16px;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85vh;
}
</style>
