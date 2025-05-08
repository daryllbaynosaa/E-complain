import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with your project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to update post status
export const updatePostStatusInDB = async (postId, newStatus) => {
  const { data, error } = await supabase
    .from('posts')
    .update({ status: newStatus })
    .eq('id', postId)
    .select()
    .single()

  if (error) {
    console.error('Error updating post status in DB:', error)
    throw error
  }

  return data
}

// Update the isUserAdmin function to be more robust and add the diagnostic function

// Modify the isUserAdmin function to be more explicit about what's happening
export async function isUserAdmin() {
  try {
    // First check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.log('No authenticated user found')
      return false
    }

    console.log('Checking admin status for user:', user.id)

    // Method 1: Check if user is in the admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)

    if (adminError) {
      console.error('Error checking admin table:', adminError)
      // Don't return here, try the other method
    } else {
      console.log('Admin table check result:', adminData)
      if (adminData && adminData.length > 0) {
        console.log('User is admin based on admins table')
        return true
      }
    }

    // Method 2: Check if user has is_admin flag in profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)

    if (profileError) {
      console.error('Error checking profile for admin flag:', profileError)
    } else {
      console.log('Profile admin check result:', profileData)
      // Check if any profile has is_admin set to true (don't use single())
      if (profileData && profileData.length > 0 && profileData[0].is_admin === true) {
        console.log('User is admin based on profile flag')
        return true
      }
    }

    // If we get here, user is not an admin
    console.log('User is not an admin')
    return false
  } catch (error) {
    console.error('Error in isUserAdmin:', error)
    return false
  }
}

export const checkUserIsAdmin = async (userId) => {
  try {
    const { data: adminData } = await supabase.from('admins').select('*').eq('user_id', userId)

    if (adminData && adminData.length > 0) {
      return true
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)

    if (profileData && profileData.length > 0 && profileData[0].is_admin === true) {
      return true
    }

    return false
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// Add this new diagnostic function
export async function runAdminDiagnostics(userId) {
  if (!userId) {
    return { isAdmin: false, error: 'No user ID provided' }
  }

  try {
    // Check auth status
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      return { isAdmin: false, error: 'Auth error', details: authError }
    }

    if (!user) {
      return { isAdmin: false, error: 'No authenticated user' }
    }

    // Check if user ID matches
    if (user.id !== userId) {
      return {
        isAdmin: false,
        error: 'User ID mismatch',
        details: { providedId: userId, authUserId: user.id },
      }
    }

    // Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)

    const profileCheck = {
      success: !profileError,
      error: profileError,
      data: profileData,
      isAdmin: profileData && profileData.length > 0 && profileData[0].is_admin === true,
    }

    // Check admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', userId)

    const adminCheck = {
      success: !adminError,
      error: adminError,
      data: adminData,
      isAdmin: adminData && adminData.length > 0,
    }

    // Determine overall admin status
    const isAdmin = profileCheck.isAdmin || adminCheck.isAdmin

    return {
      isAdmin,
      profileCheck,
      adminCheck,
      user,
    }
  } catch (error) {
    return { isAdmin: false, error: 'Unexpected error', details: error }
  }
}

// New function to fetch posts from Supabase
export const fetchPosts = async () => {
  try {
    console.log('Fetching posts...')

    // Fetch all posts
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (postsError) {
      console.error('Error fetching posts:', postsError)
      throw postsError
    }

    console.log('Posts fetched:', postsData)
    return { postsData }
  } catch (error) {
    console.error('Error in fetchPosts:', error)
    throw error
  }
}

// New function to fetch user profiles
export const fetchUserProfiles = async (userIds) => {
  try {
    if (!userIds || userIds.length === 0) {
      console.log('No user IDs to fetch')
      return { profiles: {} }
    }

    const { data, error } = await supabase.from('profiles').select('*').in('id', userIds)

    if (error) {
      console.error('Error fetching user profiles:', error)
      throw error
    }

    const profiles = {}
    data.forEach((profile) => {
      profiles[profile.id] = profile
    })

    console.log('User profiles fetched:', profiles)
    return { profiles }
  } catch (error) {
    console.error('Error fetching user profiles:', error)
    throw error
  }
}

// New function to set up realtime subscriptions for posts
export const setupRealtimeSubscriptions = (onPostsChange) => {
  // Create a channel for posts changes
  const channel = supabase
    .channel('posts-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
      console.log('Realtime update received:', payload)
      // Call the callback function when changes occur
      if (typeof onPostsChange === 'function') {
        onPostsChange(payload)
      }
    })
    .subscribe((status) => {
      console.log('Realtime subscription status:', status)
    })

  return channel
}

// Helper function to remove a realtime subscription
export const removeRealtimeSubscription = (channel) => {
  if (channel) {
    supabase.removeChannel(channel)
    console.log('Realtime subscription removed')
    return true
  }
  return false
}
