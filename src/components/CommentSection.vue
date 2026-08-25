<template>
  <div class="comment-section">
    <div class="comment-head">
      <h3>留言板 <span class="comment-count">{{ comments.length }}</span></h3>
    </div>

    <div v-if="loading" class="comment-loading">加载中...</div>
    <div v-else-if="comments.length === 0" class="comment-empty">还没有留言，快来抢沙发~</div>
    <div v-else class="comment-list">
      <div v-for="c in comments" :key="c.id" class="comment-item">
        <div class="comment-top">
          <span class="comment-name">{{ c.name }}</span>
          <span class="comment-time">{{ timeAgo(c.createdAt) }}</span>
        </div>
        <p class="comment-content">{{ c.content }}</p>
      </div>
    </div>

    <div class="comment-form">
      <el-input v-model="name" class="comment-name-input" maxlength="20" placeholder="你的昵称（可选）" clearable />
      <el-input
        v-model="content"
        type="textarea"
        :rows="3"
        maxlength="500"
        show-word-limit
        placeholder="写下你的留言..."
      />
      <div class="comment-submit-row">
        <el-button type="primary" :loading="submitting" @click="submit">发表留言</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getComments, createComment } from '../api/index.js'

const props = defineProps({ itemId: { type: [Number, String], required: true } })

const comments = ref([])
const loading = ref(true)
const submitting = ref(false)
const name = ref(localStorage.getItem('commentName') || '')
const content = ref('')

async function load() {
  loading.value = true
  try {
    const res = await getComments(props.itemId)
    comments.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function submit() {
  const text = content.value.trim()
  if (!text) {
    ElMessage.warning('请输入留言内容')
    return
  }
  submitting.value = true
  try {
    const res = await createComment(props.itemId, { name: name.value, content: text })
    comments.value.unshift(res.data)
    content.value = ''
    if (name.value) localStorage.setItem('commentName', name.value)
    ElMessage.success('留言成功')
  } catch (e) {
    ElMessage.error(e.response?.data?.error || '留言失败，请重试')
  } finally {
    submitting.value = false
  }
}

function timeAgo(date) {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return mins + '分钟前'
  const hours = Math.floor(mins / 60)
  if (hours < 24) return hours + '小时前'
  const days = Math.floor(hours / 24)
  return days + '天前'
}

onMounted(load)
</script>

<style scoped>
.comment-section { background: #fff; border-radius: 12px; border: 1px solid #eee; padding: 24px; }
.comment-head h3 { font-size: 1.15em; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.comment-count { font-size: 0.75em; background: #667eea; color: #fff; border-radius: 100px; padding: 1px 10px; font-weight: 600; }
.comment-loading, .comment-empty { text-align: center; padding: 32px; color: #999; font-size: 0.95em; }
.comment-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.comment-item { background: #fafafa; border-radius: 10px; padding: 12px 16px; }
.comment-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.comment-name { font-weight: 600; color: #333; font-size: 0.95em; }
.comment-time { color: #bbb; font-size: 0.8em; }
.comment-content { color: #555; font-size: 0.95em; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
.comment-form { border-top: 1px dashed #e5e5e5; padding-top: 18px; display: flex; flex-direction: column; gap: 12px; }
.comment-name-input { max-width: 260px; }
.comment-submit-row { display: flex; justify-content: flex-end; }
</style>
