<template>
  <el-card shadow="hover" class="item-card" @click="$router.push('/items/' + item.id)">
    <div class="card-img">
      <img :src="item.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'" alt="" />
    </div>
    <div class="card-body">
      <h3>{{ item.title }}</h3>
      <p class="price">¥{{ item.price }}</p>
      <p class="meta">{{ item.category }} · {{ timeAgo(item.createdAt) }}</p>
    </div>
  </el-card>
</template>

<script setup>
const props = defineProps({ item: Object })
function timeAgo(date) {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return mins + '分钟前'
  const hours = Math.floor(mins / 60)
  if (hours < 24) return hours + '小时前'
  const days = Math.floor(hours / 24)
  return days + '天前'
}
</script>

<style scoped>
.item-card { cursor: pointer; }
.card-img img { width: 100%; height: 180px; object-fit: cover; display: block; }
.card-body { padding: 12px; }
.card-body h3 { font-size: 1em; margin-bottom: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.price { color: #e74c3c; font-weight: 700; font-size: 1.1em; margin-bottom: 4px; }
.meta { color: #999; font-size: 0.85em; }
</style>
