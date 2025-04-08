<script setup>
import { ref } from 'vue'
import LoginForm from '@/components/auth/LoginForm.vue'

const theme = ref(localStorage.getItem('theme') ?? 'light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}
</script>
<template>
  <v-responsive>
    <v-app :theme="theme">
      <v-app-bar
        class="px-3"
        :color="theme === 'light' ? 'grey-lighten-1' : 'grey-darken-3'"
        border
      >
        <v-spacer></v-spacer>

        <v-btn
          :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="elevated"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <v-row class="d-flex justify-center">
            <v-col cols="12" md="6">
              <v-card class="mx-auto" prepend-icon="">
                <v-card-title class="text-center">
                  <span class="font-weight-black">E-Complain</span>
                  <P>login form</P>
                </v-card-title>

                <v-card-text class="bg-surface-light pt-4">
                  <LoginForm></LoginForm>
                  <!-- LOGIN FORM SLOT -->

                  <v-divider class="my-5"></v-divider>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
      <v-footer class="font weight-bold" border app>@2025 Barangay Complain System</v-footer>
    </v-app>
  </v-responsive>
</template>
