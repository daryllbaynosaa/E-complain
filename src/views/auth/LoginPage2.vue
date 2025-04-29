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

    <v-card
      class="mx-auto pa-12 pb-8 semi-transparent-card"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-form v-model="valid">
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
            target="_blank"
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
          :disabled="!valid"
          :class="password.length >= 8 ? 'login-btn-enabled' : 'login-btn-disabled'"
          size="large"
          variant="flat"
          block
          class="mb-8 rounded-btn"
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
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const valid = ref(false)
const email = ref('')
const password = ref('')

const rules = {
  required: (v) => !!v || 'This field is required',
  email: (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  min: (v) => (v && v.length >= 8) || 'Password must be at least 8 characters',
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
  background-color: #0b3c5d !important; /* Darker blue on hover */
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
