<script setup>
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Skills from './components/Skills.vue'
import Projects from './components/Projects.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="bg-gray-950 min-h-screen text-gray-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">
    <Navbar />
    <main>
      <Hero />
      <Skills />
      <Projects />
    </main>
    <Footer />
  </div>
</template>

<style>
/* Global styles fallback if needed. Most handled by style.css */
body {
    background-color: #030712;
}
</style>
