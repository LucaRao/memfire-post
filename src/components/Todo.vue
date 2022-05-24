<template>
  <li
    class="
      block
      cursor-pointer
      hover:bg-gray-200
      focus:outline-none focus:bg-gray-200
      transition
      duration-150
      ease-in-out
      border-style1
    "
  >
    <div class="flex items-center px-4 py-4 sm:px-6">
      <div class="min-w-0 flex-1 flex items-center">
        <div class="text-sm leading-5 font-medium truncate t-s">{{ todos.task }}</div>
      </div>
      <button @click="toggleLike" class="w-4 h-4 ml-2  hover:border-black rounded">
        <svg
          v-if="like"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="24px"
          height="24px"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 256 256"
        >
          <path
            d="M236.023 92c0 30.565-17.713 62.005-52.648 93.446a317.34 317.34 0 0 1-51.442 37.534a8 8 0 0 1-7.819 0c-4.25-2.38-104.09-59.117-104.09-130.98a60.02 60.02 0 0 1 108-36.04a60.02 60.02 0 0 1 108 36.04z"
            fill="currentColor"
          ></path>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="24px"
          height="24px"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 256 256"
        >
          <path
            d="M128.018 228a11.995 11.995 0 0 1-5.864-1.53C117.82 224.043 16.018 166.18 16.018 92a64.028 64.028 0 0 1 112-42.378a64.028 64.028 0 0 1 112 42.378c0 74.18-101.803 132.043-106.137 134.47a11.995 11.995 0 0 1-5.863 1.53zm-48-176a40.046 40.046 0 0 0-40 40c0 51.222 67.445 97.186 88 110c20.554-12.814 88-58.778 88-110a40.009 40.009 0 0 0-76.928-15.408a12 12 0 0 1-22.145 0A39.923 39.923 0 0 0 80.018 52z"
            fill="currentColor"
          ></path>
        </svg>
      </button>
    </div>
    <div class="flex items-center px-4 py-4 sm:px-6 t-m">
      {{ todos.account.email.substring(0, todos.account.email.indexOf('@')) }}
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { updateTaskCompletion, deleteTodo } from '@/vuetils/useTodo'
/* eslint-disable @typescript-eslint/camelcase */
import { supabase } from '@/lib/supabase'
import { userSession } from '@/vuetils/useAuth'

export default defineComponent({
  name: 'Todo',
  props: {
    todos: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const like = ref<undefined | null>(undefined)
    const fecthLike = async () => {
      const { data } = await supabase
        .from('likes')
        .select('*')
        .match({
          post_id: props.todos.id,
          account_id: userSession?.value?.user?.id || '',
        })
        if(data?.length){
          like.value = data[0]
        } else {
            like.value = null
        }
  }
    fecthLike()
    // Removes todo from supbase and also from app state
    const toggleLike = async () => {
      if (like.value) {
        await supabase
          .from('likes')
          .delete()
          .match({
            post_id: props.todos.id,
            account_id: userSession?.value?.user?.id || '',
          })
      } else {
        await supabase
          .from('likes')
          .insert({
            post_id: props.todos.id,
            account_id: userSession?.value?.user?.id,
          })
          .single()
      }
    fecthLike()
    }
    
    return { updateTaskCompletion, toggleLike, userSession,like,fecthLike }
  },

})
</script>

<style lang="css" scoped>
.border-style1 {
  border: 1px solid #d5d0d0;
  margin: 20px 15px;
  border-radius: 10px;
}
.t-s {
  font-size: 14px;
  font-weight: bold;
}
.t-m {
  font-size: 13px;
  font-weight: normal;
  margin-top: -20px;
}
</style>
