<template>
  <div class="container-fluid">
    <img src="@/assets/republic.png" alt="My App Logo" class="logo-img" />
  </div>

  <!-- Title Text -->
  <div class="text-center main-title mb-6">
    <h1 class="display-1">BARANGAY COMPLAINS AND REPORT SYSTEM</h1>
  </div>

  <v-container class="fill-height d-flex flex-column justify-center align-center">
    <!-- Login Button -->
    <v-row justify="center" class="w-100">
      <v-col cols="12" md="4" sm="6">
        <router-link to="/login2" class="text-decoration-none">
          <v-btn rounded="xl" size="large" class="glass-btn elevation-10" block> Login </v-btn>
        </router-link>
      </v-col>
    </v-row>

    <!-- Create Account Button -->
    <v-row justify="center" class="w-100 mt-4">
      <v-col cols="12" md="4" sm="6">
        <router-link to="/signup" class="text-decoration-none">
          <v-btn rounded="xl" size="large" class="glass-btn elevation-10" block>
            Create Account
          </v-btn>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
/* Global styles */

.logo-img {
  width: 200px;
  height: auto;
  margin-left: 200px;
  margin-top: 100px;
}
body {
  margin: 0;
  padding: 0;
  height: 100vh; /* Ensure the full height of the page */
  background-image: url('@/assets/birdview.jpg');
  background-size: cover;
  background-position: center;
}

/* Custom Title Style */
.main-title {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6); /* Slight shadow to make text stand out */
}

/* Glass effect for buttons */
.glass-btn {
  background: rgba(255, 255, 255, 0.2); /* Semi-transparent white background */
  backdrop-filter: blur(8px); /* Frosted glass effect */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Slight border */
  color: white; /* Text color */
  font-weight: bold; /* Bold text */
  letter-spacing: 1px; /* Spacing between letters */
  transition:
    transform 0.3s ease,
    background-color 0.3s ease; /* Smooth hover transition */
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.3); /* Slightly more opaque on hover */
  transform: translateY(-4px); /* Slight lift on hover */
}

/* Responsive Title Adjustment */
@media (max-width: 600px) {
  .main-title {
    font-size: 1.5rem; /* Adjust title size for small screens */
  }
}
</style>
