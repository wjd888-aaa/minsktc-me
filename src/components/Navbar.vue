<template>
  <header class="navbar">
    <div class="nav-inner">
      <router-link to="/" class="logo">MinskTC</router-link>
      <nav class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/items">所有信息</router-link>
        <router-link to="/publish">发布信息</router-link>
      </nav>
      <router-link to="/login" class="login-btn">
        <el-button size="small">{{ user || '我的' }}</el-button>
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref('')

onMounted(() => {
  const p = JSON.parse(localStorage.getItem('profile') || '{}')
  user.value = p.name || p.phone || ''
})
</script>

<style scoped>
.navbar { background: #fff; border-bottom: 1px solid #eee; position: sticky; top: 0; z-index: 100; }
.nav-inner { display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 56px; }
.logo { font-weight: 700; font-size: 1.3em; color: #409eff; }
.nav-links { display: flex; gap: 24px; }
.nav-links a { color: #666; font-size: 0.95em; }
.nav-links a:hover, .nav-links a.router-link-active { color: #409eff; }
</style>
