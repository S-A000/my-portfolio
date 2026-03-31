<script setup>
const skills = [
  { icon: 'fa-python', color: 'text-yellow-400', title: 'Core AI', desc: 'GenAI, NLP, Deep Learning', border: '' },
  { icon: 'fa-database text-solid', color: 'text-blue-400', title: 'Data Engineering', desc: 'ETL, Web Scraping, Power BI', border: '' },
  { icon: 'fa-code text-solid', color: 'text-green-400', title: 'Dev & Tools', desc: 'Docker, C#, VS Code API', border: '' },
  { icon: 'fa-brain text-solid', color: 'text-purple-400', title: 'Frameworks', desc: 'PyTorch, LangChain, FastAPI', border: '' },
  { icon: 'fa-sitemap text-solid', color: 'text-orange-400', title: 'System Design', desc: 'Scalable Arch, API Design', border: 'border-t-2 border-orange-500/20' },
  { icon: 'fa-network-wired text-solid', color: 'text-pink-400', title: 'AI Architecture', desc: 'Model Deployment, Vector DBs', border: 'border-t-2 border-pink-500/20' },
  { icon: 'fa-docker', color: 'text-cyan-400', title: 'Containerization', desc: 'Docker, CI/CD Pipelines', border: 'border-t-2 border-cyan-500/20' },
  { icon: 'fa-chart-pie text-solid', color: 'text-emerald-400', title: 'Analytics', desc: 'Advanced Data Mining', border: 'border-t-2 border-emerald-500/20' },
];
</script>

<template>
  <section id="skills" class="max-w-6xl mx-auto px-6 py-20 relative">
    <!-- Decorative background glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

    <div class="relative z-10">
        <div class="flex items-center gap-4 mb-12">
            <h3 class="text-3xl font-bold">Technical Mastery</h3>
            <div class="h-px bg-gradient-to-r from-blue-500/50 to-transparent flex-1"></div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div v-for="(skill, index) in skills" :key="index" 
                class="glass p-6 rounded-2xl text-center group hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                :class="skill.border">
                
                <div class="w-16 h-16 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
                    <i :class="[`fa-brands ${skill.icon}`, skill.color]" class="text-3xl"></i>
                    <!-- Fallback for solid icons if the brand class fails -->
                    <i v-if="skill.icon.includes('text-solid')" :class="[`fa-solid ${skill.icon.replace('text-solid', '')}`, skill.color]" class="text-3xl absolute"></i>
                </div>
                
                <p class="font-bold text-gray-100 mb-1">{{ skill.title }}</p>
                <p class="text-xs text-gray-400 leading-relaxed">{{ skill.desc }}</p>
            </div>
        </div>
    </div>
  </section>
</template>
