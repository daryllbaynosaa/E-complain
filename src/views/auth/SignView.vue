<script setup>
import { ref, reactive } from 'vue'
import { supabase } from '@/utils/supabase'

// Form state
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// UI state
const isLoading = ref(false)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const userId = ref(null)
const emailConfirmationSent = ref(false)

// Validation
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// Validation rules
const validateForm = () => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach((key) => (errors[key] = ''))

  // First name validation
  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  // Last name validation
  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Password validation
  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    isValid = false
  }

  // Confirm password validation
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

// Handle registration
const handleRegister = async () => {
  // Validate form
  if (!validateForm()) return

  // Show loading state
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Register with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
        },
      },
    })

    if (error) {
      errorMessage.value = error.message
    } else if (data && data.user) {
      // Store the user ID
      userId.value = data.user.id

      // Check if email confirmation is required
      emailConfirmationSent.value = !data.session

      // Set appropriate success message
      if (emailConfirmationSent.value) {
        successMessage.value =
          'Registration successful! Please check your email to confirm your account.'
      } else {
        successMessage.value = 'Registration successful! You are now signed in.'
      }

      // Log user data for debugging (remove in production)
      console.log('User registered successfully:', data.user)

      // Reset form
      form.firstName = ''
      form.lastName = ''
      form.email = ''
      form.password = ''
      form.confirmPassword = ''
    } else {
      // Handle unexpected response format
      errorMessage.value = 'Registration failed. Please try again.'
      console.error('Unexpected response format:', data)
    }
  } catch (error) {
    errorMessage.value = 'An unexpected error occurred. Please try again.'
    console.error('Registration error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1>Create an Account</h1>
        <p>Join us today and get started with your new account</p>
      </div>

      <!-- Success message -->
      <div v-if="successMessage" class="alert alert-success">
        <p>{{ successMessage }}</p>
        <div v-if="emailConfirmationSent" class="mt-2"><strong>User ID:</strong> {{ userId }}</div>
      </div>

      <!-- Error message -->
      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              :class="{ 'input-error': errors.firstName }"
              placeholder="John"
            />
            <span v-if="errors.firstName" class="error-text">{{ errors.firstName }}</span>
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              :class="{ 'input-error': errors.lastName }"
              placeholder="Doe"
            />
            <span v-if="errors.lastName" class="error-text">{{ errors.lastName }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            :class="{ 'input-error': errors.email }"
            placeholder="john.doe@example.com"
          />
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <div class="form-group password-group">
          <label for="password">Password</label>
          <div class="password-input-container">
            <input
              id="password"
              v-model="form.password"
              :type="isPasswordVisible ? 'text' : 'password'"
              :class="{ 'input-error': errors.password }"
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              class="password-toggle"
              @click="isPasswordVisible = !isPasswordVisible"
            >
              {{ isPasswordVisible ? '🙈' : '👁️' }}
            </button>
          </div>
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>

        <div class="form-group password-group">
          <label for="confirmPassword">Confirm Password</label>
          <div class="password-input-container">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="isConfirmPasswordVisible ? 'text' : 'password'"
              :class="{ 'input-error': errors.confirmPassword }"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              class="password-toggle"
              @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
            >
              {{ isConfirmPasswordVisible ? '🙈' : '👁️' }}
            </button>
          </div>
          <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
        </div>

        <button type="submit" class="register-button" :disabled="isLoading">
          <span v-if="isLoading" class="loader"></span>
          <span v-else>Create Account</span>
        </button>

        <div class="login-link">Already have an account? <a href="/login2">Log in</a></div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;

  background-image: url('@/assets/Login2Background.jpg');
}

.register-card {
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 32px;
  opacity: 0.9;
}

.register-header {
  text-align: center;
  margin-bottom: 24px;
}

.register-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.register-header p {
  color: #666;
  font-size: 16px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 16px;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #333;
}

input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.input-error {
  border-color: #ef4444;
}

.error-text {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.password-group {
  position: relative;
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
}

.register-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
}

.register-button:hover {
  background-color: #4338ca;
}

.register-button:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-link a {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

.alert-success {
  background-color: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.alert-error {
  background-color: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.mt-2 {
  margin-top: 8px;
}
</style>
