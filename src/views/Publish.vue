<template>
  <div class="publish-page">
    <Navbar />
    <div class="form-wrap">
      <h2>发布信息</h2>
      <el-form :model="form" label-width="80px" @submit.prevent="submit">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="分类" required>
          <el-select v-model="form.category" placeholder="选择分类" style="width:100%">
            <el-option v-for="c in categories" :key="c.key" :label="c.name" :value="c.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" required>
          <el-radio-group v-model="form.type">
            <el-radio value="sell">出售</el-radio>
            <el-radio value="rent">出租</el-radio>
            <el-radio value="buy">求购</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="价格" required>
          <el-input v-model="form.price" placeholder="0" type="number">
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="描述" required>
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请详细描述..." />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.contact" placeholder="电话 / 微信" />
        </el-form-item>
        <el-form-item label="图片链接">
          <el-input v-model="imageUrl" placeholder="输入图片URL，回车添加" @keyup.enter="addImage" />
          <div class="image-list">
            <el-tag v-for="(img, i) in form.images" :key="i" closable @close="form.images.splice(i, 1)">
              {{ img.slice(0, 30) }}...
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="submitting">发布</el-button>
        </el-form-item>
      </el-form>
      <el-alert v-if="success" type="success" show-icon :closable="true" title="发布成功！" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { createItem } from '../api/index.js'
import Navbar from '../components/Navbar.vue'

const categories = [
  { key: 'electronics', name: '电子产品' },
  { key: 'furniture', name: '家具日用' },
  { key: 'clothing', name: '服装鞋包' },
  { key: 'books', name: '教材书籍' },
  { key: 'rental', name: '房屋出租' },
  { key: 'service', name: '生活服务' }
]

const form = reactive({
  title: '',
  category: '',
  type: 'sell',
  price: '',
  description: '',
  contact: '',
  images: []
})

const imageUrl = ref('')
const submitting = ref(false)
const success = ref(false)

function addImage() {
  if (imageUrl.value && !form.images.includes(imageUrl.value)) {
    form.images.push(imageUrl.value)
    imageUrl.value = ''
  }
}

async function submit() {
  if (!form.title || !form.category || !form.price || !form.description) {
    ElMessage.warning('请填写必填项')
    return
  }
  submitting.value = true
  try {
    await createItem(form)
    success.value = true
    Object.assign(form, { title: '', category: '', type: 'sell', price: '', description: '', contact: '', images: [] })
  } catch (e) {
    ElMessage.error('发布失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.form-wrap { max-width: 640px; margin: 0 auto; padding: 24px; }
.form-wrap h2 { margin-bottom: 20px; }
.image-list { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px; }
</style>
