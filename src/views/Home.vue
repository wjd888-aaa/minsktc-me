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
      <div class="cat-grid">
        <div v-for="cat in mainCategories" :key="cat.key" class="cat-card" @click="$router.push('/items?cat=' + cat.key)">
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
        </div>
      </div>
      <div class="cat-extra-row">
        <div v-for="cat in extraCategories" :key="cat.key" class="cat-card cat-card-extra" @click="$router.push('/items?cat=' + cat.key)">
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
        </div>
      </div>
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
import { MAIN_CATEGORIES, EXTRA_CATEGORIES } from '../data/categories.js'

const router = useRouter()
const search = ref('')
const metro = ref('')
const items = ref([])
const loading = ref(true)
const mainCategories = MAIN_CATEGORIES
const extraCategories = EXTRA_CATEGORIES

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
.categories { max-width: 1200px; margin: 0 auto; padding: 32px 24px; }
.cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 14px; margin-bottom: 20px; }
.cat-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 18px 8px; border-radius: 16px; background: #f8f8f8; cursor: pointer; transition: all .25s; }
.cat-card:hover { background: #f0f0f0; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,.06); }
.cat-icon { font-size: 1.6em; line-height: 1; }
.cat-name { font-size: 0.85em; color: #444; font-weight: 500; letter-spacing: 0.02em; }
.cat-extra-row { display: flex; gap: 14px; justify-content: center; padding-top: 14px; border-top: 1px solid #eee; }
.cat-card-extra { flex-direction: row; padding: 10px 24px; border-radius: 100px; background: #fafafa; }
.cat-card-extra:hover { background: #f0f0f0; }
.recent { max-width: 1200px; margin: 0 auto; padding: 0 24px 40px; }
.recent h2 { margin-bottom: 16px; }
.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.loading, .empty { text-align: center; padding: 40px; color: #999; }
</style>
