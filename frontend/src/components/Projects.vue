<script setup>
import { ref, onMounted } from 'vue';

const projects = ref([]);
const loading = ref(true);

onMounted(async () => {
    try {
        // Fetch from our FastAPI backend
        const response = await fetch('http://localhost:8001/api/projects');
        if (response.ok) {
            projects.value = await response.json();
        } else {
            console.error("Failed to fetch projects");
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
  <section id="projects" class="max-w-6xl mx-auto px-6 py-24 relative">
    
    <!-- Decorative background glow -->
    <div class="absolute top-1/2 right-0 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

    <div class="relative z-10">
        <div class="flex items-center gap-4 mb-16">
            <h3 class="text-3xl font-bold">Project Repositories</h3>
            <div class="h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-1"></div>
        </div>

        <div v-if="loading" class="text-center py-20">
            <div class="inline-block w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p class="text-gray-400">Loading architecture...</p>
        </div>

        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="project in projects" :key="project.title" 
                 class="glass p-8 rounded-2xl project-card relative overflow-hidden group hover:shadow-[0_0_30px_rgba(96,165,250,0.15)] bg-gradient-to-br from-white/5 to-transparent">
                
                <!-- Glowing top border effect -->
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div class="flex justify-between items-start mb-6">
                    <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                         <i v-if="project.is_enterprise" class="fa-solid fa-shield-halved text-2xl"></i>
                         <i v-else-if="project.is_pypi" class="fa-solid fa-cube text-2xl"></i>
                         <i v-else class="fa-solid fa-code text-2xl"></i>
                    </div>
                    <span v-if="project.is_enterprise" class="text-[10px] bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full uppercase tracking-wider font-bold">Enterprise</span>
                    <span v-if="project.is_pypi" class="text-[10px] bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full uppercase tracking-wider font-bold">PyPI Package</span>
                </div>
                
                <h4 class="font-bold text-xl mb-3 group-hover:text-blue-400 transition-colors">
                    <a :href="project.link" target="_blank" class="hover:underline decoration-blue-500/50 underline-offset-4">
                        {{ project.title }}
                    </a>
                </h4>
                
                <p class="text-gray-400 text-sm mb-6 leading-relaxed flex-grow line-clamp-3">
                    {{ project.description }}
                </p>
                
                <div class="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                    <span v-for="tag in project.tags" :key="tag" class="skill-tag border border-white/5">
                        {{ tag }}
                    </span>
                </div>
            </div>
        </div>
    </div>
  </section>
</template>
