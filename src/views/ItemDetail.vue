<template>
  <div class="detail-page">
    <Navbar />
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="!item" class="loading">信息不存在</div>
    <div v-else class="detail-inner">
      <div class="detail-left">
        <div v-if="item.images?.length" class="detail-img-wrap">
          <div v-for="(img, i) in item.images" :key="i" class="detail-img-box" @click="openLightbox(i)">
            <img :src="img" class="detail-img" alt="" />
          </div>
        </div>
      </div>
      <div class="detail-right">
        <div class="detail-header">
          <h1>{{ item.title }}</h1>
          <p class="detail-price">¥{{ item.price }}</p>
          <p class="detail-meta">{{ item.category }} · {{ typeLabel }} · {{ timeAgo(item.createdAt) }}</p>
          <p v-if="item.metro" class="detail-metro">🚇 {{ getMetroName(item.metro) }} {{ item.address ? '— ' + item.address : '' }}</p>
        </div>
        <div class="detail-body">
          <div class="detail-section">
            <p class="section-label">描述</p>
            <p class="detail-desc">{{ item.description }}</p>
          </div>
          <div class="detail-section">
            <p class="section-label">联系方式</p>
            <p class="detail-contact">{{ item.contact || '未提供' }}</p>
            <el-button type="primary" size="large" style="width:100%;margin-top:8px" @click="showContact = !showContact">
              {{ showContact ? '收起' : '查看联系方式' }}
            </el-button>
            <p v-if="showContact" class="contact-reveal">{{ item.contact || '暂无' }}</p>
          </div>
          <div v-if="isOwner" class="owner-actions">
            <el-button type="primary" size="large" @click="editItem">✏️ 编辑</el-button>
            <el-button type="danger" size="large" @click="confirmDelete">🗑️ 删除</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="lightboxShow" class="lightbox-overlay" @click.self="closeLightbox">
      <img :src="item.images[lightboxIndex]" class="lightbox-img" @click="closeLightbox" />
      <div v-if="item.images.length > 1" class="lightbox-nav">
        <span class="lightbox-prev" @click.stop="prevImg">‹</span>
        <span class="lightbox-next" @click.stop="nextImg">›</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getItem, deleteItem } from '../api/index.js'
import Navbar from '../components/Navbar.vue'
import { getMetroName } from '../data/metro.js'

const route = useRoute()
const router = useRouter()
const item = ref(null)
const loading = ref(true)
const showContact = ref(false)
const lightboxShow = ref(false)
const lightboxIndex = ref(0)
const profile = JSON.parse(localStorage.getItem('profile') || '{}')

const typeLabel = computed(() => ({ sell: '出售', rent: '出租', buy: '求购' }[item.value?.type] || ''))

const isOwner = computed(() => {
  if (!item.value) return false
  return profile.phone && item.value.phone === profile.phone
})

function openLightbox(i) { lightboxIndex.value = i; lightboxShow.value = true }
function closeLightbox() { lightboxShow.value = false }
function prevImg() { lightboxIndex.value = (lightboxIndex.value - 1 + item.value.images.length) % item.value.images.length }
function nextImg() { lightboxIndex.value = (lightboxIndex.value + 1) % item.value.images.length }
function timeAgo(date) {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return mins + '分钟前'
  const hours = Math.floor(mins / 60)
  if (hours < 24) return hours + '小时前'
  return Math.floor(hours / 24) + '天前'
}

function editItem() {
  router.push('/publish?id=' + item.value.id)
}

async function confirmDelete() {
  try {
    await ElMessageBox.confirm('确定要删除这条信息吗？', '确认删除', { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' })
    await deleteItem(item.value.id, profile.phone)
    ElMessage.success('已删除')
    router.push('/')
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败，请检查权限')
  }
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
.detail-inner { display: flex; gap: 48px; max-width: 1200px; margin: 0 auto; padding: 40px 32px; align-items: flex-start; }
.detail-left { flex: 1; min-width: 0; }
.detail-right { width: 380px; flex-shrink: 0; }
.detail-img-wrap { display: flex; flex-direction: column; gap: 16px; }
.detail-img-box { width: 100%; height: 480px; display: flex; align-items: center; justify-content: center; background-color: #f5f5f5; border-radius: 12px; cursor: pointer; overflow: hidden; transition: box-shadow .2s; }
.detail-img-box:hover { box-shadow: 0 4px 20px rgba(0,0,0,.08); }
.detail-img { max-width: 100%; max-height: 100%; display: block; }
@media (max-width: 768px) { .detail-img-box { height: 300px; } }
.lightbox-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,.9); display: flex; align-items: center; justify-content: center; }
.lightbox-img { max-width: 95vw; max-height: 95vh; object-fit: contain; border-radius: 4px; cursor: zoom-out; }
.lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); display: flex; justify-content: space-between; width: 100%; pointer-events: none; }
.lightbox-prev, .lightbox-next { pointer-events: auto; font-size: 48px; color: #fff; padding: 0 20px; cursor: pointer; user-select: none; opacity: .7; }
.lightbox-prev:hover, .lightbox-next:hover { opacity: 1; }
.detail-header { margin-bottom: 40px; }
.detail-header h1 { font-size: 1.75em; font-weight: 700; margin-bottom: 12px; line-height: 1.3; color: #1a1a1a; }
.detail-price { font-size: 2.2em; color: #e74c3c; font-weight: 700; margin-bottom: 8px; }
.detail-meta { color: #999; font-size: .95em; }
.detail-metro { color: #666; font-size: .95em; margin-top: 4px; }
.detail-body { display: flex; flex-direction: column; gap: 32px; }
.detail-section { background: #fafafa; border-radius: 12px; padding: 24px; }
.section-label { font-size: .85em; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 12px; }
.detail-desc { line-height: 1.8; color: #333; font-size: 1em; white-space: pre-wrap; }
.detail-contact { font-size: 1.2em; font-weight: 600; color: #1a1a1a; }
.contact-reveal { margin-top: 12px; font-size: 1.3em; font-weight: 700; color: #e74c3c; text-align: center; padding: 12px; background: #fff; border-radius: 8px; }
.owner-actions { display: flex; gap: 16px; }
.owner-actions .el-button { flex: 1; }
.loading { text-align: center; padding: 80px; color: #999; font-size: 1.1em; }
@media (max-width: 860px) {
  .detail-inner { flex-direction: column; gap: 24px; padding: 24px 16px; }
  .detail-right { width: 100%; }
}
</style>
