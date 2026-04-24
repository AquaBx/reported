<script setup lang="ts">
const { status, data, signIn, signOut } = useAuth()
</script>

<template>
  <div>
    <h1>Mon App Nuxt avec Authentik SSO</h1>
    
    <div v-if="status === 'authenticated'">
      <p>Connecté en tant que : <strong>{{ data?.user?.name }}</strong> ({{ data?.user?.email }})</p>
      <button @click="signOut()">Se déconnecter</button>
    </div>
    
    <div v-else>
      <p>Vous n'êtes pas connecté.</p>
      <button @click="signIn('authentik')">Se connecter avec Authentik</button>
    </div>
  </div>
</template>
