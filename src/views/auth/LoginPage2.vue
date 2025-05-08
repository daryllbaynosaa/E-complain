<template>
  <div class="login-page-container">
    <!-- Success alert - Modified to be smaller and not transparent -->
    <div v-if="loginStatus.success" class="success-alert">
      <div class="success-content">
        <v-icon icon="mdi-check-circle" color="white" class="mr-2"></v-icon>
        {{ loginStatus.success }}
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          color="white"
          class="ml-auto"
          @click="loginStatus.success = ''"
        ></v-btn>
      </div>
    </div>

    <!-- Error alert - Modified to be smaller and not transparent -->
    <div v-if="loginStatus.error" class="error-alert">
      <div class="error-content">
        <v-icon icon="mdi-alert-circle" color="white" class="mr-2"></v-icon>
        {{ loginStatus.error }}
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          color="white"
          class="ml-auto"
          @click="loginStatus.error = ''"
        ></v-btn>
      </div>
    </div>

    <v-card
      class="mx-auto pa-6 pa-sm-8 pa-md-12 pb-6 pb-sm-8 semi-transparent-card"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-form v-model="valid" @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          :rules="[rules.required, rules.email]"
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          class="semi-transparent-textfield mt-4"
        ></v-text-field>

        <div
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between flex-wrap mt-4"
        >
          <span>Password</span>

          <a
            class="text-caption text-decoration-none text-blue mt-1 mt-sm-0"
            href="#"
            rel="noopener noreferrer"
            @click.prevent="handleForgotPassword"
          >
            Forgot login password?
          </a>
        </div>

        <v-text-field
          v-model="password"
          :rules="[rules.required, rules.min]"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          class="semi-transparent-textfield"
        ></v-text-field>

        <v-card class="mb-6 mb-sm-8 mb-md-12" color="surface-variant" variant="tonal">
          <v-card-text class="text-medium-emphasis text-caption pa-2 pa-sm-3 pa-md-4">
            Warning: After 3 consecutive failed login attempts, your account will be temporarily
            locked for three hours. If you must login now, you can also click "Forgot login
            password?" below to reset the login password.
          </v-card-text>
        </v-card>

        <v-btn
          :disabled="!valid || isLoading"
          :loading="isLoading"
          :class="password.length >= 8 ? 'login-btn-enabled' : 'login-btn-disabled'"
          size="large"
          variant="flat"
          block
          class="mb-4 mb-sm-6 mb-md-8 rounded-btn"
          type="submit"
        >
          Log In
        </v-btn>
      </v-form>

      <v-card-text class="text-center">
        <router-link to="/signup" class="text-primary text-decoration-none">
          Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
        </router-link>
      </v-card-text>
    </v-card>

    <!-- Reset Password Dialog -->
    <v-dialog v-model="resetDialog" max-width="90%" class="reset-dialog">
      <v-card>
        <v-card-title class="text-h6 pa-4">Reset Password</v-card-title>
        <v-card-text class="pa-4">
          <p class="mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <v-text-field
            v-model="resetEmail"
            label="Email"
            variant="outlined"
            :rules="[rules.required, rules.email]"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="resetDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            :loading="isResetting"
            :disabled="isResetting || !resetEmail || !rules.email(resetEmail)"
            @click="sendPasswordReset"
          >
            Send Reset Link
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'vue-router'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const router = useRouter()

// Form state
const visible = ref(false)
const valid = ref(false)
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const loginAttempts = ref(0)

// Password reset
const resetDialog = ref(false)
const resetEmail = ref('')
const isResetting = ref(false)

// Login status
const loginStatus = reactive({
  error: '',
  success: '',
})

// Validation rules
const rules = {
  required: (v) => !!v || 'This field is required',
  email: (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  min: (v) => (v && v.length >= 8) || 'Password must be at least 8 characters',
}

// Handle login
const handleLogin = async () => {
  if (!valid.value) return

  loginStatus.error = ''
  loginStatus.success = ''
  isLoading.value = true

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      loginAttempts.value++
      loginStatus.error = error.message

      // Check for too many login attempts
      if (loginAttempts.value >= 3) {
        loginStatus.error =
          'Too many failed login attempts. Please try again later or reset your password.'
      }
    } else if (data && data.user) {
      loginStatus.success = 'Login successful!'
      loginAttempts.value = 0

      // Store user data if needed
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect to dashboard
      setTimeout(() => {
        router.replace('postfeed')
      }, 1000)
    }
  } catch (err) {
    console.error('Login error:', err)
    loginStatus.error = 'An unexpected error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Handle forgot password
const handleForgotPassword = () => {
  resetEmail.value = email.value // Pre-fill with current email if available
  resetDialog.value = true
}

// Send password reset email
const sendPasswordReset = async () => {
  if (!resetEmail.value || !rules.email(resetEmail.value)) return

  isResetting.value = true

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.value, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      loginStatus.error = error.message
    } else {
      loginStatus.success = 'Password reset link sent to your email!'
      resetDialog.value = false
    }
  } catch (err) {
    console.error('Password reset error:', err)
    loginStatus.error = 'Failed to send reset link. Please try again.'
  } finally {
    isResetting.value = false
  }
}

// Use onMounted to ensure this runs only in the browser environment
onMounted(() => {
  // Your code that needs to run after the component is mounted
})
</script>

<style scoped>
.login-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background-image: url('@/assets/Login2Background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* New success alert styling - smaller and solid (not transparent) */
.success-alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  max-width: 300px;
  width: auto;
}

.success-content {
  display: flex;
  align-items: center;
  background-color: #4caf50; /* Solid green background */
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 14px; /* Reduced font size */
}

/* New error alert styling - smaller and solid (not transparent) */
.error-alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  max-width: 300px;
  width: auto;
}

.error-content {
  display: flex;
  align-items: center;
  background-color: #f44336; /* Solid red background */
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 14px; /* Reduced font size */
}

/* Gradient with transparency */
.semi-transparent-card {
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px); /* For Safari support */
  width: 100%;
}

/* Transparent background for text fields */
.semi-transparent-textfield :deep(.v-field__outline) {
  background-color: rgba(255, 255, 255, 0.4) !important;
}

.semi-transparent-textfield :deep(.v-field__input) {
  color: rgba(0, 0, 0, 0.87) !important;
}

.login-btn-enabled {
  background-color: #0d47a1 !important;
  color: white !important;
  opacity: 1;
  transition: background-color 0.3s ease;
}

.login-btn-enabled:hover {
  background-color: #102e50 !important;
}

.login-btn-disabled {
  background-color: gray !important;
  color: #b0bec5 !important;
  opacity: 1;
}

/* Round Button */
.rounded-btn {
  border-radius: 50px !important;
}

/* Reset dialog responsive styling */
.reset-dialog {
  margin: 1rem;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .semi-transparent-card {
    padding: 1.5rem !important;
  }

  .login-page-container {
    padding: 0.5rem;
  }

  .success-alert,
  .error-alert {
    max-width: 250px;
  }

  .success-content,
  .error-content {
    font-size: 13px;
  }
}

@media (max-width: 400px) {
  .semi-transparent-card {
    padding: 1rem !important;
  }

  .success-alert,
  .error-alert {
    max-width: 200px;
  }

  .success-content,
  .error-content {
    font-size: 12px;
    padding: 6px 12px;
  }
}

/* Fix for iOS backdrop-filter */
@supports not (backdrop-filter: blur(4px)) {
  .semi-transparent-card {
    background-color: rgba(255, 255, 255, 0.9);
  }
}
</style>
