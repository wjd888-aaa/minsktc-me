<template>
  <div class="home">
    <Navbar />
    <section class="hero">
      <h1>明斯克华人生活信息平台</h1>
      <p>二手交易 · 房屋出租 · 生活服务</p>
      <div class="hero-actions">
        <el-input v-model="search" placeholder="搜索商品或房源..." class="search-input" clearable @keyup.enter="goSearch" />
        <el-button type="primary" @click="goSearch">搜索</el-button>
      </div>
      <div class="hero-metro">
        <el-select v-model="metro" placeholder="按地铁站筛选" clearable filterable style="width:300px" @change="goMetro">
          <el-option-group v-for="line in metroLines" :key="line.key" :label="line.name">
            <el-option v-for="s in line.stations" :key="s.id" :label="displayMetro(s)" :value="s.id" />
          </el-option-group>
        </el-select>
      </div>
    </section>
    <section class="categories">
      <el-card v-for="cat in categories" :key="cat.key" class="cat-card" shadow="hover" @click="$router.push('/items?cat=' + cat.key)">
        <h3>{{ cat.icon }} {{ cat.name }}</h3>
      </el-card>
    </section>
    <section class="recent">
      <h2>最新发布</h2>
      <div v-if="loading" class="loading"><el-icon class="is-loading"><Loading /></el-icon> 加载中...</div>
      <div v-else-if="items.length === 0" class="empty">暂无信息</div>
      <div v-else class="items-grid">
        <ItemCard v-for="item in items" :key="item.id" :item="item" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Loading } from '@element-plus/icons-vue'
import { getItems } from '../api/index.js'
import Navbar from '../components/Navbar.vue'
import ItemCard from '../components/ItemCard.vue'
import { MINSK_METRO, METRO_LINES, displayMetro } from '../data/metro.js'

const router = useRouter()
const search = ref('')
const metro = ref('')
const items = ref([])
const loading = ref(true)

const categories = [
  { key: 'electronics', name: '电子产品', icon: '📱' },
  { key: 'furniture', name: '家具日用', icon: '🛋️' },
  { key: 'clothing', name: '服装鞋包', icon: '👗' },
  { key: 'books', name: '教材书籍', icon: '📚' },
  { key: 'rental', name: '房屋出租', icon: '🏠' },
  { key: 'service', name: '生活服务', icon: '🔧' }
]

const metroLines = Object.entries(METRO_LINES).map(([key, val]) => ({
  key,
  name: val.name,
  stations: MINSK_METRO.filter(s => s.line === key)
}))

function goSearch() {
  const q = '/items?search=' + encodeURIComponent(search.value)
  router.push(metro.value ? q + '&metro=' + metro.value : q)
}

function goMetro() {
  router.push('/items?metro=' + metro.value)
}

onMounted(async () => {
  try {
    const res = await getItems({ limit: 12 })
    items.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.hero { text-align: center; padding: 60px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; }
.hero h1 { font-size: 2em; margin-bottom: 10px; }
.hero p { margin-bottom: 24px; opacity: 0.9; }
.hero-actions { display: flex; gap: 10px; max-width: 500px; margin: 0 auto; }
.hero-metro { margin-top: 16px; }
.hero-metro .el-select { --el-select-input-color: #fff; }
.search-input { flex: 1; }
.categories { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; padding: 24px; max-width: 1200px; margin: 0 auto; }
.cat-card { cursor: pointer; text-align: center; }
.cat-card h3 { margin: 0; font-size: 1em; }
.recent { max-width: 1200px; margin: 0 auto; padding: 0 24px 40px; }
.recent h2 { margin-bottom: 16px; }
.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.loading, .empty { text-align: center; padding: 40px; color: #999; }
</style>
