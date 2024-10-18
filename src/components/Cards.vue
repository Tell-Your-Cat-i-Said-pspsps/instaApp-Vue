<script setup>
import Observer from "./Observer.vue";
import { useUserStore } from "@/stores/users";
import { supabase } from "../../supabase";
import Card from "./Card.vue";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const posts = ref([]);
const lastCardIndex = ref(2);
const followingIds = ref([]);
const endReached = ref(false);
const fetchData = async () => {
  const { data: followings } = await supabase.from('followers_following')
    .select('following_id')
    .eq('follower_id', user.value.id);
  followingIds.value = followings.map(f => f.following_id);
  const { data: fetchedPosts } = await supabase.from('posts')
    .select()
    .in('owner_id', followingIds.value)
    .range(0, lastCardIndex.value)
    .order('created_at', { ascending: false });
  posts.value = fetchedPosts;
};
const fetchNextSet = async () => {
  if (!endReached.value) {
    const { data: fetchedPosts } = await supabase.from('posts')
      .select()
      .in('owner_id', followingIds.value)
      .range(lastCardIndex.value + 1, lastCardIndex.value + 3)
      .order('created_at', { ascending: false });
    if (fetchedPosts) {
      posts.value = [
        ...posts.value,
        ...fetchedPosts
      ];
    }
    lastCardIndex.value = lastCardIndex.value + 3;
    if (!fetchedPosts.length) {
      endReached.value = true;
    }
  }
};

onMounted(async () => {
  await fetchData();
});

</script>
<template>
  <div class="timeline-container">
    <Card v-for="post in posts" :key="post.id" :post="post" />
    <Observer v-if="posts.length" @intersect="fetchNextSet" />
  </div>
</template>
<style scoped>
.timeline-container {
  padding: 8px;
  /* display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); */
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-items: center;
  align-items: center;
}
</style>