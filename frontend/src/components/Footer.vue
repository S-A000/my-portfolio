<script setup>
</script>

<template>
  <footer class="relative pt-20 pb-10 overflow-hidden border-t border-white/5">
    
    <!-- Decorative background glow -->
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

    <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        
        <h2 class="text-4xl font-bold mb-4">Let's Build Something <span class="gradient-text">Extraordinary</span></h2>
        <p class="text-gray-400 mb-10 max-w-xl mx-auto">Open for collaborations, interesting projects, and coffee chats about the future of AI.</p>
        
        <a href="mailto:abinemasood814@gmail.com" class="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] mb-20 relative overflow-hidden group">
            <span class="relative z-10">Say Hello <i class="fa-solid fa-paper-plane ml-2"></i></span>
            <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
        </a>

        <div class="flex flex-col items-center border-t border-white/10 pt-10">
            <p class="text-gray-500 text-xs tracking-widest uppercase mb-6">Designed & Built by Syed Abdullah Bin Masood</p>
            
            <div class="flex justify-center space-x-6">
                <a href="https://github.com/S-A000" class="text-gray-500 hover:text-white transition-colors"><i class="fa-brands fa-github text-xl"></i></a>
                <a href="https://www.linkedin.com/in/abdullah-bin-masood-0b25103b4/" class="text-gray-500 hover:text-blue-400 transition-colors"><i class="fa-brands fa-linkedin text-xl"></i></a>
                <a href="#" class="text-gray-500 hover:text-cyan-400 transition-colors"><i class="fa-brands fa-docker text-xl"></i></a>
                <a href="#" class="text-gray-500 hover:text-purple-400 transition-colors"><i class="fa-solid fa-microchip text-xl"></i></a>
            </div>
            
            <p class="text-gray-600 text-[10px] mt-6">© {{ new Date().getFullYear() }} All Rights Reserved. Built with Vue 3 & Three.js</p>
        </div>
    </div>
  </footer>
</template>
