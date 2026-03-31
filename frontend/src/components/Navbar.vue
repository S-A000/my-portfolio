<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <nav :class="['fixed top-0 w-full z-50 transition-all duration-300', isScrolled ? 'glass border-b border-white/5 py-3' : 'bg-transparent py-5']">
    <div class="max-w-6xl mx-auto px-6 flex justify-between items-center">
      <h1 class="text-xl font-bold tracking-tighter cursor-pointer hover:scale-105 transition-transform">
        Syed Abdullah<span class="text-blue-500"> Bin Masood</span>
      </h1>
      
      <div class="hidden md:flex space-x-8 text-sm font-medium text-gray-400 items-center">
        <a href="#projects" class="hover:text-white transition-colors relative group">
          Projects
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
        </a>
        <a href="#skills" class="hover:text-white transition-colors relative group">
          Skills
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
        </a>
        <a href="/abdullah_bin_masood.pdf" download class="text-blue-400 border border-blue-400/30 px-5 py-2 rounded-full hover:bg-blue-500/10 hover:shadow-[0_0_15px_rgba(96,165,250,0.4)] transition-all flex items-center gap-2">
          Download CV <i class="fa-solid fa-download"></i>
        </a>
      </div>
      
      <!-- Mobile menu button (visual only for now) -->
      <button class="md:hidden text-gray-400 hover:text-white">
        <i class="fa-solid fa-bars text-xl"></i>
      </button>
    </div>
  </nav>
</template>
