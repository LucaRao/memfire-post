/* eslint-disable @typescript-eslint/camelcase */
import { supabase } from '@/lib/supabase'
import { ref } from 'vue'

const allPosts = ref<Post[]>([])

/**
 * Retreive all post for the signed in user
 */
async function fetchPosts() {
  try {
    const { data: posts, error } = await supabase.from('posts').select('*, account(*)').order('inserted_at')

    if (error) {
      console.log('error', error)
      return
    }
    // handle for when no posts are returned
    if (posts === null) {
      allPosts.value = []
      return
    }
    // store response to allPosts
    allPosts.value = posts
    console.log('got posts!', allPosts.value)
  } catch (err) {
    console.error('Error retrieving data from db', err)
  }
}

/**
 *  Add a new post to supabase
 */
async function addPost(post: Post): Promise<null | Post> {
  try {
    const { data, error } = await supabase.from('posts').insert(post).single();
    if (error) {
      alert(error.message)
      console.error('There was an error inserting', error)
      return null
    }

    console.log('created a new post')
    return data
  } catch (err) {
    alert('Error')
    console.error('Unknown problem inserting to db', err)
    return null
  }
}

/**
 * Targets a specific post via its record id and updates the is_completed attribute.
 */
async function updateTaskCompletion(post: Post, isCompleted: boolean) {
  try {
    const { error } = await supabase
      .from('posts')
      .update({ is_complete: isCompleted })
      .eq('id', post.id)
      .single()

    if (error) {
      alert(error.message)
      console.error('There was an error updating', error)
      return
    }

    console.log('Updated task', post.id)
  } catch (err) {
    alert('Error')
    console.error('Unknown problem updating record', err)
  }
}

/**
 *  Deletes a post via its id
 */
async function deletePost(post: Post) {
  try {
    await supabase.from('posts').delete().eq('id', post.id)
    console.log('deleted post', post.id)
  } catch (error) {
    console.error('error', error)
  }
}

export { allPosts, fetchPosts, addPost, updateTaskCompletion, deletePost }
