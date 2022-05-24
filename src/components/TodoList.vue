<template>
  <div class="w-full">
    <h2 class="mb-12 font-bold text-3xl">Write a new post</h2>
    <!-- <h2 class="mb-12 font-bold text-2xl">Content</h2> -->
    <h2 class="mb-12 font-bold text-2xl">welcome {{userName.substring(0,userName.indexOf('@'))}} !</h2>
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
      <ul v-for="(todo, index) in allTodos" :key="index">
        <suspense>
          <Todo :todos="todo" />
        </suspense>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { defineComponent, ref } from 'vue'
import Todo from '@/components/Todo.vue'
import { allTodos, fetchTodos, addTodo } from '@/vuetils/useTodo'
import { userSession } from '@/vuetils/useAuth'

export default defineComponent({
  name: 'TodoList',
  components: {
    Todo,
  },

  async setup() {
    await fetchTodos()

    const task = ref('');
    const userName = ref('')
    userName.value = localStorage.getItem('userName') || ''
    /**
     * Wrapper function adding a new todo for additional client-side error handling.
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
        const todo = await addTodo({ user_id: userSession.value.user.id, task: task.value })

        // If there was no response, don't do anything.
        if (!todo) {
          return
        }
        // Otherwise, push the response into allTodos.
        await fetchTodos()
        console.log(allTodos,'allTodos')

        // Reset input field.
        task.value = ''
      } catch (err) {
        console.error('Unknown error when adding todo', err)
      }
    }

    return {
      userName,
      task,
      allTodos,
      insertTask,
      userSession,
    }
  },
})
</script>
