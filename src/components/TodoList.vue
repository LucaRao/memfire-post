<template>
  <div class="w-full">
    <h2 class="mb-12 font-bold text-3xl">Write a new post</h2>
    <h2 class="mb-12 font-bold text-2xl">welcome {{userSession.user.email.substring(0,userSession.user.email.indexOf('@'))}}!</h2>
    <div class="flex gap-2 my-2">
      <input
        v-model="task"
        class="rounded w-full p-2"
        type="text"
        placeholder="What do you need to?"
      />
      <button @click="insertTask" class="btn-black">
        Publish
      </button>
    </div>

    <div class="bg-white shadow overflow-hidden rounded-md" style="height: 300px;overflow-y: scroll;">
      <ul v-for="(todo, index) in allTodos" :key="index">
        <suspense>
        <Todo :todo="todo" />
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

    const task = ref('')

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
        const todo = await addTodo({ email: userSession.value.user.email, task: task.value, })

        // If there was no response, don't do anything.
        if (!todo) {
          return
        }
        // Otherwise, push the response into allTodos.
        // allTodos.value.push(todo)
        await fetchTodos()
        // Reset input field.
        task.value = ''
      } catch (err) {
        console.error('Unknown error when adding todo', err)
      }
    }

    return {
      task,
      allTodos,
      insertTask,
      userSession,
    }
  },
})
</script>
