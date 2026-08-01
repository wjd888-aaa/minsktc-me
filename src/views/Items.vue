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
        <el-select v-model="type" placeholder="全部类型" clearable @change="load">
          <el-option label="出售" value="sell" />
          <el-option label="出租" value="rent" />
          <el-option label="求购" value="buy" />
        </el-select>
      </div>
      <div class="category-filter">
        <div class="cat-row-main" :class="{ 'mobile-grid': isMobile }">
          <span
            v-for="c in mainCategories"
            :key="c.key"
            class="cat-pill"
            :class="{ active: category === c.key }"
            @click="toggleCategory(c.key)"
          >{{ c.icon }} {{ c.name }}</span>
        </div>
        <div class="cat-row-extra">
          <span
            v-for="(c, i) in extraCategories"
            :key="c.key"
            class="cat-pill cat-pill-extra"
            :class="{ active: category === c.key }"
            @click="toggleCategory(c.key)"
          >{{ c.icon }} {{ c.name }}<span v-if="i < extraCategories.length - 1" class="cat-sep">|</span></span>
        </div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Loading } from '@element-plus/icons-vue'
import { getItems } from '../api/index.js'
import Navbar from '../components/Navbar.vue'
import ItemCard from '../components/ItemCard.vue'
import { MINSK_METRO, METRO_LINES, displayMetro } from '../data/metro.js'
import { MAIN_CATEGORIES, EXTRA_CATEGORIES } from '../data/categories.js'

const route = useRoute()
const items = ref([])
const loading = ref(true)
const category = ref(route.query.cat || '')
const type = ref('')
const metro = ref(route.query.metro || '')
const mainCategories = MAIN_CATEGORIES
const extraCategories = EXTRA_CATEGORIES

const mql = window.matchMedia('(max-width: 768px)')
const isMobile = ref(mql.matches)
function onScreenChange(e) { isMobile.value = e.matches }
onMounted(() => mql.addEventListener('change', onScreenChange))
onUnmounted(() => mql.removeEventListener('change', onScreenChange))

const metroLines = Object.entries(METRO_LINES).map(([key, val]) => ({
  key,
  name: val.name,
  stations: MINSK_METRO.filter(s => s.line === key)
}))

function toggleCategory(key) {
  category.value = category.value === key ? '' : key
  load()
}

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
.filters { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.filters .el-select { min-width: 180px; }
.category-filter { margin-bottom: 28px; }
.cat-row-main { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
.cat-row-extra { display: flex; flex-wrap: wrap; gap: 10px; padding-top: 14px; border-top: 1px solid #eee; justify-content: center; }
.cat-pill { display: inline-block; padding: 6px 18px; border-radius: 20px; font-size: 0.9em; color: #555; background: #f5f5f5; cursor: pointer; transition: all .2s; user-select: none; letter-spacing: 0.02em; }
.cat-pill:hover { background: #e8e8e8; color: #333; }
.cat-row-main.mobile-grid { display: grid !important; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
.cat-row-main.mobile-grid .cat-pill { text-align: center; padding: 8px 12px; }
.cat-pill.active { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; font-weight: 600; box-shadow: 0 2px 8px rgba(102,126,234,.35); }
.cat-pill-extra { background: #fafafa; color: #888; font-size: 0.85em; padding: 5px 14px; }
.cat-pill-extra.active { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; }
.cat-sep { color: #ddd; margin-left: 10px; }
.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.loading, .empty { text-align: center; padding: 60px; color: #999; }
</style>
