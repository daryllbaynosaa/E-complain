<template>
  <div>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />

    <!-- Success alert -->
    <v-alert
      v-if="loginStatus.success"
      type="success"
      variant="tonal"
      class="mx-auto mb-4"
      max-width="448"
      closable
      @click:close="loginStatus.success = ''"
    >
      {{ loginStatus.success }}
    </v-alert>

    <!-- Error alert -->
    <v-alert
      v-if="loginStatus.error"
      type="error"
      variant="tonal"
      class="mx-auto mb-4"
      max-width="448"
      closable
      @click:close="loginStatus.error = ''"
    >
      {{ loginStatus.error }}
    </v-alert>

    <v-card
      class="mx-auto pa-12 pb-8 semi-transparent-card"
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
          class="semi-transparent-textfield"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password

          <a
            class="text-caption text-decoration-none text-blue"
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

        <v-card class="mb-12" color="surface-variant" variant="tonal">
          <v-card-text class="text-medium-emphasis text-caption">
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
          class="mb-8 rounded-btn"
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
    <v-dialog v-model="resetDialog" max-width="500px">
      <v-card>
        <v-card-title>Reset Password</v-card-title>
        <v-card-text>
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
        <v-card-actions>
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
import { ref, reactive } from 'vue'
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

      // ✅ Redirect to dashboard
      setTimeout(() => {
        router.replace('/postfeed')
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
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  background-image: url('@/assets/Login2Background.jpg');
  background-size: cover;
  background-position: center;
}

/* Gradient with transparency */
.semi-transparent-card {
  background-color: rgba(255, 255, 255, 0.6); /* 60% opaque white */
  backdrop-filter: blur(4px); /* optional: adds soft blur for depth */
}

.v-card {
  background-color: rgba(255, 255, 255, 0.6); /* 60% opacity white */
  backdrop-filter: blur(5px); /* Optional: nice blur effect behind the card */
}

/* Transparent background for text fields */
.semi-transparent-textfield .v-input__control {
  background-color: rgba(255, 255, 255, 0.4) !important; /* Transparent background */
  border: 1px solid rgba(0, 0, 0, 0.3) !important; /* Border color */
}

.semi-transparent-textfield .v-input__slot {
  background-color: rgba(255, 255, 255, 0.4) !important; /* Transparent background */
}

/* Optional: make sure text and icons are visible */
.semi-transparent-textfield .v-input__control .v-input__label {
  color: rgba(0, 0, 0, 0.87) !important; /* Keep label text dark */
}

.semi-transparent-textfield .v-input__control .v-text-field__outline {
  border-color: rgba(0, 0, 0, 0.6) !important; /* Darker border color */
}

.login-btn-enabled {
  background-color: #0d47a1 !important; /* Dark blue */
  color: white !important;
  opacity: 1;
  transition: background-color 0.3s ease; /* Smooth transition for hover */
}

.login-btn-enabled:hover {
  background-color: #102e50 !important; /* Darker blue on hover */
}

.login-btn-disabled {
  background-color: gray !important; /* Light blue */
  color: #b0bec5 !important;
  opacity: 1;
}

/* Round Button */
.rounded-btn {
  border-radius: 50px !important; /* Fully rounded button */
}
</style>
