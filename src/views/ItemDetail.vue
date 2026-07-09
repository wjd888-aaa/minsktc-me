<template>
  <div class="detail-page">
    <Navbar />
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="!item" class="loading">信息不存在</div>
    <div v-else class="detail-inner">
      <div class="detail-main">
        <el-carousel v-if="item.images?.length" height="400px">
          <el-carousel-item v-for="img in item.images" :key="img">
            <img :src="img" class="detail-img" />
          </el-carousel-item>
        </el-carousel>
        <div class="detail-info">
          <h1>{{ item.title }}</h1>
          <p class="detail-price">¥{{ item.price }}</p>
          <p class="detail-meta">{{ item.category }} · {{ typeLabel }} · {{ timeAgo(item.createdAt) }}</p>
          <p v-if="item.metro" class="detail-metro">🚇 {{ getMetroName(item.metro) }} {{ item.address ? '— ' + item.address : '' }}</p>
          <el-divider />
          <p class="detail-desc">{{ item.description }}</p>
        </div>
      </div>
      <div class="detail-side">
        <el-card>
          <p><strong>📞 联系方式</strong></p>
          <p>{{ item.contact || '未提供' }}</p>
          <el-button type="primary" style="width:100%;margin-top:12px" @click="showContact = !showContact">
            {{ showContact ? '隐藏' : '查看联系方式' }}
          </el-button>
          <p v-if="showContact" style="margin-top:8px;font-size:1.2em;text-align:center">{{ item.contact || '暂无' }}</p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getItem } from '../api/index.js'
import Navbar from '../components/Navbar.vue'
import { getMetroName } from '../data/metro.js'

const route = useRoute()
const item = ref(null)
const loading = ref(true)
const showContact = ref(false)

const typeLabel = computed(() => ({ sell: '出售', rent: '出租', buy: '求购' }[item.value?.type] || ''))


function timeAgo(date) {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return mins + '分钟前'
  const hours = Math.floor(mins / 60)
  if (hours < 24) return hours + '小时前'
  return Math.floor(hours / 24) + '天前'
}

onMounted(async () => {
  try {
    const res = await getItem(route.params.id)
    item.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.detail-inner { display: flex; gap: 24px; max-width: 1200px; margin: 0 auto; padding: 24px; }
.detail-main { flex: 1; }
.detail-img { width: 100%; height: 100%; object-fit: cover; }
.detail-info { padding: 20px 0; }
.detail-info h1 { font-size: 1.5em; margin-bottom: 8px; }
.detail-price { font-size: 1.8em; color: #e74c3c; font-weight: 700; }
.detail-meta { color: #999; font-size: 0.9em; margin: 8px 0; }
.detail-desc { line-height: 1.7; color: #555; }
.detail-side { width: 320px; flex-shrink: 0; }
.loading { text-align: center; padding: 60px; color: #999; }
</style>
