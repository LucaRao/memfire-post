<template>
  <div class="w-full">
    <h2 class="mb-12 font-bold text-3xl">Write a new post</h2>
    <!-- <h2 class="mb-12 font-bold text-2xl">Content</h2> -->
    <h2 class="mb-12 font-bold text-2xl">welcome {{userSession.user.email.substring(0,userSession.user.email.indexOf('@'))}} !</h2>
    <div class="flex gap-2 my-2">
      <input
        v-model="task"
        class="rounded w-full p-2"
        type="text"
        placeholder="Content"
      />
      <button @click="insertTask" class="btn-black">
        Publish
      </button>
    </div>

    <div class="bg-white shadow overflow-hidden rounded-md" style="height: 550px;overflow-y: scroll;">
      <ul v-for="(post, index) in allPosts" :key="index">
        <suspense>
          <Post :posts="post" />
        </suspense>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { defineComponent, ref } from 'vue'
import Post from '@/components/Post.vue'
import { allPosts, fetchPosts, addPost } from '@/vuetils/usePost'
import { userSession } from '@/vuetils/useAuth'

export default defineComponent({
  name: 'PostList',
  components: {
    Post,
  },

  async setup() {
    await fetchPosts()

    const task = ref('');
    /**
     * Wrapper function adding a new post for additional client-side error handling.
     */
    async function insertTask() {
      // Guard for short task descriptions which will fail db policy.
      if (task.value.length <= 3) {
        alert('Please make your task a little more descriptive')
        return
      }
      // Type check to ensure user is still logged in.
      if (userSession?.value === null) {
        alert('Please log in again')
        return
      }
      try {
        // Try and write the data to the database.
        const post = await addPost({ user_id: userSession.value.user.id, task: task.value })

        // If there was no response, don't do anything.
        if (!post) {
          return
        }
        // Otherwise, push the response into allPosts.
        await fetchPosts()
        console.log(allPosts,'allPosts')

        // Reset input field.
        task.value = ''
      } catch (err) {
        console.error('Unknown error when adding post', err)
      }
    }

    return {
      task,
      allPosts,
      insertTask,
      userSession,
    }
  },
})
</script>
