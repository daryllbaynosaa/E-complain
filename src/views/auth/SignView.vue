<template>
  <v-container fluid class="d-flex align-center justify-center" style="min-height: 100vh">
    <v-card class="pa-8 form-card" elevation="10" rounded="lg">
      <h2 class="text-h5 text-center mb-6">Create an Account</h2>

      <v-form v-model="valid">
        <v-text-field
          v-model="first"
          color="primary"
          label="First Name"
          variant="outlined"
          class="mb-4 semi-transparent-textfield"
          density="comfortable"
          :rules="[rules.required]"
        ></v-text-field>

        <v-text-field
          v-model="last"
          color="primary"
          label="Last Name"
          variant="outlined"
          class="mb-4 semi-transparent-textfield"
          density="comfortable"
          :rules="[rules.required]"
        ></v-text-field>

        <v-text-field
          v-model="email"
          color="primary"
          label="Email"
          variant="outlined"
          class="mb-4 semi-transparent-textfield"
          density="comfortable"
          type="email"
          :rules="[rules.required, rules.gmail]"
        ></v-text-field>

        <v-text-field
          v-model="password"
          color="primary"
          label="Password"
          variant="outlined"
          class="mb-4 semi-transparent-textfield"
          density="comfortable"
          type="password"
          placeholder="At least 8 characters"
          :rules="[rules.required, rules.minLength]"
        ></v-text-field>

        <v-btn block color="primary" size="large" class="text-white rounded-btn" :disabled="!valid">
          Complete Registration
          <v-icon end icon="mdi-chevron-right"></v-icon>
        </v-btn>
      </v-form>

      <div class="text-center mt-4">
        <span>Already have an account?</span>
        <router-link to="/login2" class="text-blue text-decoration-none"> Log in </router-link>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const first = ref('')
const last = ref('')
const email = ref('')
const password = ref('')
const valid = ref(false)

const rules = {
  required: (v) => !!v || 'This field is required',
  minLength: (v) => (v && v.length >= 8) || 'Password must be at least 8 characters',
  gmail: (v) => /[a-zA-Z0-9._%+-]+@gmail\.com$/.test(v) || 'Please enter a valid Gmail address',
}
</script>

<style scoped>
.form-card {
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  width: 500px;
  max-width: 90%;
}

.semi-transparent-textfield .v-input__control,
.semi-transparent-textfield .v-input__slot {
  background-color: rgba(255, 255, 255, 0.4) !important;
}

/* Round button */
.rounded-btn {
  border-radius: 50px !important;
  padding-left: 2rem;
  padding-right: 2rem;
}

/* Disabled state */
.v-btn[disabled] {
  background-color: gray !important; /* Disabled color */
  cursor: not-allowed !important;
}
</style>
