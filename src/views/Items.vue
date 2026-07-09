<template>
  <div class="items-page">
    <Navbar />
    <div class="page-inner">
      <div class="filters">
        <el-select v-model="metro" placeholder="全部地铁站" clearable filterable @change="load">
          <el-option-group v-for="line in metroLines" :key="line.key" :label="line.name">
              <el-option v-for="s in line.stations" :key="s.id" :label="displayMetro(s)" :value="s.id" />
          </el-option-group>
        </el-select>
        <el-select v-model="category" placeholder="全部分类" clearable @change="load">
          <el-option v-for="c in categories" :key="c.key" :label="c.name" :value="c.key" />
        </el-select>
        <el-select v-model="type" placeholder="全部类型" clearable @change="load">
          <el-option label="出售" value="sell" />
          <el-option label="出租" value="rent" />
          <el-option label="求购" value="buy" />
        </el-select>
      </div>
      <div v-if="loading" class="loading"><el-icon class="is-loading"><Loading /></el-icon> 加载中...</div>
      <div v-else-if="items.length === 0" class="empty">暂无信息</div>
      <div v-else class="items-grid">
        <ItemCard v-for="item in items" :key="item.id" :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Loading } from '@element-plus/icons-vue'
import { getItems } from '../api/index.js'
import Navbar from '../components/Navbar.vue'
import ItemCard from '../components/ItemCard.vue'
import { MINSK_METRO, METRO_LINES, displayMetro } from '../data/metro.js'

const route = useRoute()
const items = ref([])
const loading = ref(true)
const category = ref(route.query.cat || '')
const type = ref('')
const metro = ref(route.query.metro || '')

const categories = [
  { key: 'electronics', name: '电子产品' },
  { key: 'furniture', name: '家具日用' },
  { key: 'clothing', name: '服装鞋包' },
  { key: 'books', name: '教材书籍' },
  { key: 'rental', name: '房屋出租' },
  { key: 'service', name: '生活服务' }
]

const metroLines = Object.entries(METRO_LINES).map(([key, val]) => ({
  key,
  name: val.name,
  stations: MINSK_METRO.filter(s => s.line === key)
}))

async function load() {
  loading.value = true
  try {
    const params = {}
    if (category.value) params.category = category.value
    if (type.value) params.type = type.value
    if (metro.value) params.metro = metro.value
    const res = await getItems(params)
    items.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.page-inner { max-width: 1200px; margin: 0 auto; padding: 24px; }
.filters { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.filters .el-select { min-width: 180px; }
.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.loading, .empty { text-align: center; padding: 60px; color: #999; }
</style>
