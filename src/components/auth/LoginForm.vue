<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field label="email" variant="outlined"></v-text-field>

    <v-text-field label="password" variant="outlined"></v-text-field>

    <v-btn class="mt-2" type="submit" prepend-icon="mdi-login" block> login </v-btn>
  </v-form>
</template>
