<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import {
  User,
  Settings,
  LogOut,
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  AtSign,
  UserCircle,
  FileText,
} from 'lucide-vue-next'

const router = useRouter()
const loading = ref(false)
const uploading = ref(false)
const username = ref('')
const fullName = ref('')
const website = ref('')
const bio = ref('')
const avatarUrl = ref(null)
const user = ref(null)
const notification = ref({ show: false, type: '', message: '' })
const formChanged = ref(false)
const activeTab = ref('profile')

// Form validation
const errors = ref({})

// Computed properties
const initials = computed(() => {
  if (fullName.value) return fullName.value.charAt(0).toUpperCase()
  if (username.value) return username.value.charAt(0).toUpperCase()
  return user.value?.email?.charAt(0).toUpperCase() || '?'
})

const avatarColor = computed(() => {
  // Generate consistent color based on username
  const colors = [
    'bg-emerald-100 text-emerald-600',
    'bg-violet-100 text-violet-600',
    'bg-amber-100 text-amber-600',
    'bg-rose-100 text-rose-600',
    'bg-cyan-100 text-cyan-600',
  ]
  const hash = username.value?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0
  return colors[hash % colors.length]
})

onMounted(() => {
  getUser()
})

// Track form changes
const trackChanges = () => {
  formChanged.value = true
}

// Watch for form changes
const setupFormChangeTracking = () => {
  const fields = [username, fullName, website, bio]
  fields.forEach((field) => {
    field.value = field.value // Initialize
  })
}

async function getUser() {
  try {
    const { data } = await supabase.auth.getUser()
    if (data?.user) {
      user.value = data.user
      await getProfile()
      setupFormChangeTracking()
    } else {
      router.push('/login')
    }
  } catch (error) {
    showNotification('error', 'Failed to get user information')
    console.error('Error getting user:', error)
  }
}

async function getProfile() {
  try {
    loading.value = true

    const { data, error, status } = await supabase
      .from('profiles')
      .select('username, full_name, website, bio, avatar_url')
      .eq('id', user.value.id)
      .single()

    if (error && status !== 406) {
      throw error
    }

    if (data) {
      username.value = data.username || ''
      fullName.value = data.full_name || ''
      website.value = data.website || ''
      bio.value = data.bio || ''
      avatarUrl.value = data.avatar_url
    }
  } catch (error) {
    showNotification('error', 'Error loading profile data')
    console.error('Error loading user data:', error)
  } finally {
    loading.value = false
  }
}

function validateForm() {
  errors.value = {}
  let isValid = true

  if (!username.value.trim()) {
    errors.value.username = 'Username is required'
    isValid = false
  } else if (username.value.length < 3) {
    errors.value.username = 'Username must be at least 3 characters'
    isValid = false
  }

  if (website.value && !isValidUrl(website.value)) {
    errors.value.website = 'Please enter a valid URL'
    isValid = false
  }

  if (bio.value && bio.value.length > 160) {
    errors.value.bio = 'Bio must be less than 160 characters'
    isValid = false
  }

  return isValid
}

function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

async function updateProfile() {
  if (!validateForm()) return

  try {
    loading.value = true

    const { error } = await supabase.from('profiles').upsert({
      id: user.value.id,
      username: username.value,
      full_name: fullName.value,
      website: website.value,
      bio: bio.value,
      avatar_url: avatarUrl.value,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    showNotification('success', 'Profile updated successfully')
    formChanged.value = false
  } catch (error) {
    showNotification('error', 'Error updating profile')
    console.error('Error updating profile:', error)
  } finally {
    loading.value = false
  }
}

async function uploadAvatar(event) {
  try {
    uploading.value = true

    if (!event.target.files || event.target.files.length === 0) {
      throw new Error('You must select an image to upload.')
    }

    const file = event.target.files[0]
    const fileSize = file.size / 1024 / 1024 // size in MB

    if (fileSize > 2) {
      throw new Error('File size must be less than 2MB')
    }

    const fileExt = file.name.split('.').pop()
    const allowedTypes = ['jpg', 'jpeg', 'png', 'gif']

    if (!allowedTypes.includes(fileExt.toLowerCase())) {
      throw new Error('Please upload an image file (JPG, PNG, or GIF)')
    }

    const filePath = `${user.value.id}/avatar-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

    avatarUrl.value = data.publicUrl
    formChanged.value = true
  } catch (error) {
    showNotification('error', error.message || 'Error uploading avatar')
    console.error('Error uploading avatar:', error)
  } finally {
    uploading.value = false
  }
}

async function signOut() {
  try {
    await supabase.auth.signOut()
    router.push('/')
  } catch (error) {
    showNotification('error', 'Error signing out')
    console.error('Error signing out:', error)
  }
}

function showNotification(type, message) {
  notification.value = {
    show: true,
    type,
    message,
  }

  // Auto-hide notification after 5 seconds
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

function setActiveTab(tab) {
  activeTab.value = tab
}

function discardChanges() {
  getProfile()
  formChanged.value = false
}
</script>

<template>
  <div class="profile-container">
    <!-- Header -->
    <header class="header">
      <div class="header-container">
        <div class="header-content">
          <div class="header-left">
            <div class="logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="logo-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span class="logo-text">E-Complain</span>
            </div>
            <nav class="main-nav">
              <a
                href="postfeed
              "
                class="nav-link"
                >Home</a
              >
              <a href="profile" class="nav-link active">My Profile</a>
            </nav>
          </div>

          <div class="header-right">
            <div v-if="user" class="user-info">
              <span class="user-email">{{ user.email }}</span>
              <div class="avatar-small">
                <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img" />
                <div v-else :class="['avatar-fallback', avatarColor]">
                  {{ initials }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile menu button (for small screens) -->
    <div class="mobile-menu-container">
      <button class="mobile-menu-button">
        <span class="mobile-menu-icon"></span>
      </button>
    </div>

    <!-- Notification -->
    <div
      v-if="notification.show"
      :class="[
        'notification',
        notification.type === 'success' ? 'notification-success' : 'notification-error',
      ]"
    >
      <div class="notification-content">
        <div class="notification-icon">
          <CheckCircle v-if="notification.type === 'success'" class="icon-success" />
          <AlertCircle v-else class="icon-error" />
        </div>
        <div class="notification-message">
          <p>{{ notification.message }}</p>
        </div>
        <button @click="notification.show = false" class="notification-close">
          <span class="sr-only">Close</span>
          <svg class="close-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="main-content">
      <div class="content-container">
        <!-- Loading state -->
        <div v-if="loading && !user" class="loading-container">
          <Loader2 class="loading-spinner" />
        </div>

        <div v-else class="profile-card">
          <!-- Profile header -->
          <div class="profile-header">
            <!-- Cover image -->
            <div class="cover-image"></div>

            <!-- Profile header content wrapper -->
            <div class="profile-header-wrapper">
              <!-- Avatar -->
              <div class="avatar-container">
                <div class="avatar-wrapper">
                  <div v-if="avatarUrl" class="avatar">
                    <img :src="avatarUrl" alt="Avatar" class="avatar-img" />
                  </div>
                  <div v-else :class="['avatar-fallback-large', avatarColor]">
                    {{ initials }}
                  </div>

                  <label for="avatar-upload" class="avatar-upload-button">
                    <Camera v-if="!uploading" class="avatar-upload-icon" />
                    <Loader2 v-else class="avatar-upload-loading" />
                    <input
                      id="avatar-upload"
                      name="avatar-upload"
                      type="file"
                      class="sr-only"
                      accept="image/*"
                      @change="uploadAvatar"
                      :disabled="uploading"
                    />
                    <span class="sr-only">Change avatar</span>
                  </label>
                </div>
              </div>

              <!-- User info -->
              <div class="profile-header-info">
                <div class="profile-header-content">
                  <div>
                    <h1 class="profile-name">
                      {{ fullName || username || 'Your Profile' }}
                    </h1>
                    <p class="profile-email">{{ user?.email }}</p>
                  </div>
                  <button @click="signOut" class="sign-out-button">
                    <LogOut class="sign-out-icon" />
                    <span class="sign-out-text">Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="tabs-container">
            <div class="tabs-wrapper">
              <nav class="tabs">
                <button
                  @click="setActiveTab('profile')"
                  :class="['tab', activeTab === 'profile' ? 'tab-active' : '']"
                >
                  <User class="tab-icon" />
                  <span class="tab-text">Profile Information</span>
                </button>
                <button
                  @click="setActiveTab('settings')"
                  :class="['tab', activeTab === 'settings' ? 'tab-active' : '']"
                >
                  <Settings class="tab-icon" />
                  <span class="tab-text">Account Settings</span>
                </button>
              </nav>
            </div>
          </div>

          <!-- Profile tab content -->
          <div v-if="activeTab === 'profile'" class="tab-content">
            <div class="profile-grid">
              <!-- Form section -->
              <div class="profile-form">
                <div class="form-group">
                  <label for="username" class="form-label">
                    <AtSign class="form-icon" />
                    Username
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      v-model="username"
                      @input="trackChanges"
                      class="form-input"
                      placeholder="your_username"
                    />
                  </div>
                  <p v-if="errors.username" class="input-error">{{ errors.username }}</p>
                  <p v-else class="input-help">This will be displayed publicly</p>
                </div>

                <div class="form-group">
                  <label for="website" class="form-label">
                    <LinkIcon class="form-icon" />
                    Website
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="url"
                      name="website"
                      id="website"
                      v-model="website"
                      @input="trackChanges"
                      class="form-input"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <p v-if="errors.website" class="input-error">{{ errors.website }}</p>
                </div>

                <div class="form-group">
                  <label for="bio" class="form-label">
                    <FileText class="form-icon" />
                    Bio
                  </label>
                  <div class="input-wrapper">
                    <textarea
                      id="bio"
                      name="bio"
                      rows="4"
                      v-model="bio"
                      @input="trackChanges"
                      class="form-textarea"
                      placeholder="Tell us a bit about yourself"
                    ></textarea>
                  </div>
                  <p v-if="errors.bio" class="input-error">{{ errors.bio }}</p>
                  <p v-else class="bio-counter">
                    <span>Brief description for your profile</span>
                    <span :class="bio.length > 140 ? 'text-amber-500' : ''"
                      >{{ bio.length }}/160</span
                    >
                  </p>
                </div>
              </div>

              <!-- Account info sidebar -->
              <div class="account-sidebar">
                <h3 class="sidebar-title">Account Information</h3>
                <div class="sidebar-content">
                  <div class="sidebar-item">
                    <div class="sidebar-label">Email</div>
                    <div class="sidebar-value">{{ user?.email }}</div>
                  </div>
                  <div class="sidebar-item">
                    <div class="sidebar-label">Account created</div>
                    <div class="sidebar-value">
                      {{ new Date(user?.created_at).toLocaleDateString() }}
                    </div>
                  </div>
                  <div class="sidebar-item">
                    <div class="sidebar-label">Last sign in</div>
                    <div class="sidebar-value">
                      {{ new Date(user?.last_sign_in_at).toLocaleDateString() }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings tab content -->
          <div v-if="activeTab === 'settings'" class="tab-content">
            <div class="settings-container">
              <div class="settings-section">
                <h3 class="settings-title">Email Preferences</h3>
                <div class="settings-options">
                  <div class="settings-option">
                    <div class="checkbox-wrapper">
                      <input
                        id="notifications"
                        name="notifications"
                        type="checkbox"
                        class="checkbox"
                      />
                    </div>
                    <div class="option-content">
                      <label for="notifications" class="option-label">Email notifications</label>
                      <p class="option-description">
                        Receive email notifications when someone comments on your complaints
                      </p>
                    </div>
                  </div>
                  <div class="settings-option">
                    <div class="checkbox-wrapper">
                      <input id="marketing" name="marketing" type="checkbox" class="checkbox" />
                    </div>
                    <div class="option-content">
                      <label for="marketing" class="option-label">Marketing emails</label>
                      <p class="option-description">
                        Receive updates about new features and improvements
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="settings-section">
                <h3 class="settings-title">Privacy Settings</h3>
                <div class="settings-options">
                  <div class="settings-option">
                    <div class="checkbox-wrapper">
                      <input
                        id="public-profile"
                        name="public-profile"
                        type="checkbox"
                        class="checkbox"
                      />
                    </div>
                    <div class="option-content">
                      <label for="public-profile" class="option-label">Public profile</label>
                      <p class="option-description">Make your profile visible to other users</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="settings-section">
                <h3 class="settings-title">Danger Zone</h3>
                <div class="danger-zone">
                  <button type="button" class="danger-button">Delete Account</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Form actions -->
          <div v-if="formChanged" class="form-actions">
            <button type="button" @click="discardChanges" class="discard-button">
              Discard Changes
            </button>
            <button
              type="button"
              @click="updateProfile"
              :disabled="loading"
              class="save-button"
              :class="{ 'button-loading': loading }"
            >
              <Loader2 v-if="loading" class="button-icon spin" />
              <CheckCircle v-else class="button-icon" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Base styles */
.profile-container {
  min-height: 100vh;
  background-color: #f9fafb;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

/* Header styles */
.header {
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  height: 4rem;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo-icon {
  height: 2rem;
  width: 2rem;
  color: #10b981;
}

.logo-text {
  margin-left: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.main-nav {
  display: none;
  margin-left: 1.5rem;
}

@media (min-width: 768px) {
  .main-nav {
    display: flex;
    gap: 2rem;
  }
}

.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0 0.25rem;
  height: 4rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #374151;
  border-bottom-color: #d1d5db;
}

.nav-link.active {
  color: #111827;
  border-bottom-color: #10b981;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-email {
  display: none;
  font-size: 0.875rem;
  color: #4b5563;
}

@media (min-width: 768px) {
  .user-email {
    display: block;
  }
}

.avatar-small {
  height: 2rem;
  width: 2rem;
  border-radius: 9999px;
  overflow: hidden;
  background-color: #f3f4f6;
}

.avatar-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.avatar-fallback {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

/* Mobile menu */
.mobile-menu-container {
  display: none;
}

@media (max-width: 767px) {
  .mobile-menu-container {
    display: block;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 20;
  }

  .mobile-menu-button {
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    background-color: #10b981;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
  }

  .mobile-menu-icon {
    position: relative;
    width: 1.5rem;
    height: 2px;
    background-color: white;
  }

  .mobile-menu-icon::before,
  .mobile-menu-icon::after {
    content: '';
    position: absolute;
    width: 1.5rem;
    height: 2px;
    background-color: white;
    transition: all 0.3s ease;
  }

  .mobile-menu-icon::before {
    transform: translateY(-6px);
  }

  .mobile-menu-icon::after {
    transform: translateY(6px);
  }
}

/* Notification styles */
.notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
  padding: 1rem;
  border-radius: 0.375rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-width: 24rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
  opacity: 1;
}

.notification-success {
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.notification-error {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.notification-content {
  display: flex;
}

.notification-icon {
  flex-shrink: 0;
}

.icon-success {
  height: 1.25rem;
  width: 1.25rem;
  color: #10b981;
}

.icon-error {
  height: 1.25rem;
  width: 1.25rem;
  color: #ef4444;
}

.notification-message {
  margin-left: 0.75rem;
}

.notification-message p {
  font-size: 0.875rem;
  font-weight: 500;
}

.notification-close {
  margin-left: auto;
  padding-left: 0.75rem;
  color: #9ca3af;
}

.notification-close:hover {
  color: #6b7280;
}

.close-icon {
  height: 1.25rem;
  width: 1.25rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Main content styles */
.main-content {
  padding: 1.5rem 0;
}

.content-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 0;
}

.loading-spinner {
  height: 3rem;
  width: 3rem;
  color: #10b981;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.profile-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
}

/* Profile header styles */
.profile-header {
  position: relative;
}

.cover-image {
  height: 8rem;
  background: linear-gradient(to right, #10b981, #0ea5e9);
}

/* New wrapper for profile header content to fix layout */
.profile-header-wrapper {
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
}

@media (min-width: 640px) {
  .profile-header-wrapper {
    flex-direction: row;
    align-items: flex-end;
    padding-bottom: 0;
  }
}

.avatar-container {
  margin-top: -3rem;
  margin-left: 1rem;
  margin-bottom: 1rem;
}

@media (min-width: 640px) {
  .avatar-container {
    margin-bottom: 0;
  }
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  height: 6rem;
  width: 6rem;
  border-radius: 9999px;
  overflow: hidden;
  background-color: #ffffff;
  padding: 0.25rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.avatar-fallback-large {
  height: 6rem;
  width: 6rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.5rem;
  background-color: #ffffff;
  padding: 0.25rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.avatar-upload-button {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 2rem;
  width: 2rem;
  border-radius: 9999px;
  background-color: #ffffff;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.avatar-upload-button:hover {
  background-color: #f9fafb;
}

.avatar-upload-icon {
  height: 1rem;
  width: 1rem;
  color: #4b5563;
}

.avatar-upload-loading {
  height: 1rem;
  width: 1rem;
  color: #10b981;
  animation: spin 1s linear infinite;
}

.profile-header-info {
  flex: 1;
  padding: 0 1rem 1rem;
}

@media (min-width: 640px) {
  .profile-header-info {
    padding: 0 1.5rem 1.5rem;
  }
}

.profile-header-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .profile-header-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.profile-email {
  font-size: 0.875rem;
  color: #6b7280;
}

.sign-out-button {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  align-self: flex-start;
}

.sign-out-button:hover {
  background-color: #f9fafb;
  color: #111827;
}

.sign-out-icon {
  height: 1rem;
  width: 1rem;
  margin-right: 0.375rem;
}

@media (max-width: 480px) {
  .sign-out-text {
    display: none;
  }

  .sign-out-icon {
    margin-right: 0;
  }

  .sign-out-button {
    padding: 0.375rem;
  }
}

/* Tabs styles */
.tabs-container {
  border-bottom: 1px solid #e5e7eb;
}

.tabs-wrapper {
  padding: 0 1.5rem;
  overflow-x: auto;
}

.tabs {
  display: flex;
  gap: 1.5rem;
  white-space: nowrap;
}

.tab {
  display: flex;
  align-items: center;
  padding: 1rem 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  background: none;
}

.tab:hover {
  color: #4b5563;
  border-bottom-color: #d1d5db;
}

.tab-active {
  color: #10b981;
  border-bottom-color: #10b981;
  font-weight: 600;
}

.tab-icon {
  height: 1rem;
  width: 1rem;
  margin-right: 0.5rem;
}

@media (max-width: 480px) {
  .tab-text {
    display: none;
  }

  .tab-icon {
    margin-right: 0;
    height: 1.25rem;
    width: 1.25rem;
  }

  .tabs {
    justify-content: center;
  }
}

/* Tab content styles */
.tab-content {
  padding: 1.5rem;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .profile-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-icon {
  height: 1rem;
  width: 1rem;
  margin-right: 0.375rem;
  color: #9ca3af;
}

.input-wrapper {
  position: relative;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-textarea {
  min-height: 6rem;
  resize: vertical;
}

.input-error {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
}

.input-help {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.bio-counter {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Account sidebar styles */
.account-sidebar {
  background-color: #f9fafb;
  border-radius: 0.375rem;
  padding: 1rem;
  height: fit-content;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.sidebar-content {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.sidebar-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

/* Settings styles */
.settings-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-section {
  padding-top: 1.25rem;
}

.settings-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.settings-options {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-option {
  display: flex;
  align-items: flex-start;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  height: 1.25rem;
}

.checkbox {
  height: 1rem;
  width: 1rem;
  color: #10b981;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
}

.checkbox:checked {
  background-color: #10b981;
  border-color: #10b981;
}

.option-content {
  margin-left: 0.75rem;
}

.option-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.option-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.danger-zone {
  margin-top: 1rem;
}

.danger-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid #fca5a5;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #b91c1c;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.danger-button:hover {
  background-color: #fef2f2;
}

/* Form actions styles */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  background-color: #f9fafb;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
}

.discard-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.discard-button:hover {
  background-color: #f3f4f6;
}

.save-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
  background-color: #10b981;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.save-button:hover {
  background-color: #059669;
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-icon {
  height: 1rem;
  width: 1rem;
  margin-right: 0.375rem;
}

.button-loading {
  position: relative;
}

.spin {
  animation: spin 1s linear infinite;
}

/* Custom scrollbar */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Responsive adjustments for small screens */
@media (max-width: 480px) {
  .cover-image {
    height: 6rem;
  }

  .avatar {
    height: 5rem;
    width: 5rem;
  }

  .avatar-fallback-large {
    height: 5rem;
    width: 5rem;
    font-size: 1.25rem;
  }

  .profile-name {
    font-size: 1.25rem;
  }

  .tab-content {
    padding: 1rem;
  }
}
</style>
