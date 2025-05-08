<template>
  <div class="landing-page">
    <!-- Logo Section -->
    <div class="logo-container">
      <img src="@/assets/republic.png" alt="My App Logo" class="logo-img" />
    </div>

    <!-- Title Text -->
    <div class="text-center main-title mb-6">
      <h1 class="text-h4 text-lg-h1">BARANGAY COMPLAINS AND REPORT SYSTEM</h1>
    </div>
    <br />
    <br />
    <br />
    <v-container class="fill-height d-flex flex-column justify-center align-center">
      <!-- Login Button -->
      <v-row justify="center" class="w-100">
        <v-col cols="12" sm="8" md="6" lg="4">
          <router-link to="/login2" class="text-decoration-none">
            <v-btn rounded="xl" size="large" class="glass-btn elevation-10" block> Login </v-btn>
          </router-link>
        </v-col>
      </v-row>

      <!-- Create Account Button -->
      <v-row justify="center" class="w-100 mt-4">
        <v-col cols="12" sm="8" md="6" lg="4">
          <router-link to="/signup" class="text-decoration-none">
            <v-btn rounded="xl" size="large" class="glass-btn elevation-10" block>
              Create Account
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  background-image: url('@/assets/birdview.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
}

.logo-container {
  display: flex;
  justify-content: flex-start;
  padding: 2rem;
}

.logo-img {
  width: 180px;
  height: auto;
  max-width: 100%;
}

.main-title {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.main-title h1 {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
  line-height: 1.2;
}

.glass-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: bold;
  letter-spacing: 1px;
  padding: 1rem 1.5rem;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-4px);
}

@media (max-width: 960px) {
  .main-title h1 {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .logo-container {
    justify-content: center;
    padding: 1.5rem 1rem;
  }

  .main-title h1 {
    font-size: 2rem;
  }
}

@media (max-width: 600px) {
  .logo-img {
    width: 140px;
  }

  .main-title h1 {
    font-size: 1.5rem;
  }

  .glass-btn {
    padding: 0.75rem 1rem;
  }
}
.main-title h1 {
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
  line-height: 1.2;
}

/* Custom size overrides if needed */
@media (min-width: 1264px) {
  .main-title h1.text-lg-h1 {
    font-size: 90px !important;
  }
}

@media (max-width: 1263px) {
  .main-title h1.text-h4 {
    font-size: 30px !important;
  }
}

@media (max-width: 400px) {
  .main-title h1 {
    font-size: 1.25rem;
  }
}
</style>
