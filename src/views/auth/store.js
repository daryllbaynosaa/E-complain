import { ref } from 'vue'
import { supabase } from './supabase-setup'

// Shared state that can be imported in both components
export const posts = ref([])
export const postLikes = ref({})
export const postComments = ref({})
export const userProfiles = ref({})

// Fetch a single post and update it in the shared state
export const fetchSinglePost = async (postId) => {
  try {
    const { data, error } = await supabase.from('posts').select('*').eq('id', postId).single()

    if (error) throw error

    // Update the post in the local state
    const postIndex = posts.value.findIndex((p) => p.id === postId)
    if (postIndex !== -1) {
      // Update the post in the array
      posts.value[postIndex] = data
    } else {
      // If the post isn't in our current list, add it
      posts.value.push(data)
    }

    return data
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error)
    return null
  }
}

// Fetch all posts
export const fetchPosts = async () => {
  try {
    console.log('Fetching posts...')

    // Fetch posts with more detailed error handling
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (postsError) {
      console.error('Error fetching posts:', postsError)
      throw postsError
    }

    console.log('Posts fetched:', postsData)

    // Add default status if missing
    postsData.forEach((post) => {
      if (!post.status) post.status = 'pending'
    })

    posts.value = postsData
    return postsData
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}
export const checkIsAdmin = async (userId) => {
  if (!userId) return false

  try {
    // Try the is_admin function first
    const { data: isAdminData, error: isAdminError } = await supabase.rpc('is_admin', {
      user_uuid: userId,
    })

    if (isAdminError) {
      console.error('Error calling is_admin function:', isAdminError)

      // Fallback: Try direct query to admins table
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', userId)

      if (adminError) {
        console.error('Error querying admins table:', adminError)
        return false
      }

      return adminData && adminData.length > 0
    }

    return !!isAdminData
  } catch (error) {
    console.error('Unexpected error checking admin status:', error)
    return false
  }
}

// Update post status
export const updatePostStatus = async (postId, newStatus, isAdmin = false) => {
  if (!isAdmin) {
    console.error('Only admins can update post status')
    return null
  }

  try {
    // Update the post status in the database
    const { data, error } = await supabase
      .from('posts')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(), // Add this to ensure the updated_at field changes
      })
      .eq('id', postId)
      .select()

    if (error) throw error

    console.log('Post status updated:', data)

    // Update local state
    await fetchSinglePost(postId)

    return data[0]
  } catch (error) {
    console.error('Error updating post status:', error)
    return null
  }
}
