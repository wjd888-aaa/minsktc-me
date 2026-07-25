<template>
  <div class="publish-page">
    <Navbar />
    <div class="form-wrap">
      <h2>{{ isEdit ? '编辑信息' : '发布信息' }}</h2>
      <el-form :model="form" label-width="100px" @submit.prevent="submit">
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

        <el-divider>位置信息</el-divider>

        <el-form-item label="附近地铁站">
          <el-select v-model="form.metro" placeholder="选择地铁站" filterable style="width:100%">
            <el-option-group v-for="line in metroLines" :key="line.key" :label="line.name">
              <el-option v-for="s in line.stations" :key="s.id" :label="displayMetro(s)" :value="s.id" />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="具体地址">
          <el-input v-model="form.address" placeholder="Введите адрес" />
        </el-form-item>

        <el-divider>图片</el-divider>

        <el-form-item label="上传图片">
          <div class="upload-area">
            <input type="file" accept="image/*" multiple id="imgPicker" ref="fileInput" @change="handleFiles" style="display:none" />
            <label for="imgPicker" class="file-label">选择图片</label>
            <span class="upload-hint">支持 JPG/PNG，单张不超过 10MB</span>
          </div>
          <div class="image-preview" v-if="form.images.length">
            <div v-for="(img, i) in form.images" :key="i" class="img-item">
              <img :src="img" />
              <el-button size="small" circle @click="form.images.splice(i, 1)">×</el-button>
            </div>
          </div>
          <div v-if="uploading" class="uploading-tip">上传中...</div>
        </el-form-item>

        <el-form-item label="联系方式">
          <el-input v-model="form.contact" placeholder="电话 / 微信" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="submitting" style="width:100%">
            {{ isEdit ? '保存修改' : '发布' }}
          </el-button>
        </el-form-item>
      </el-form>
      <el-alert v-if="success" type="success" show-icon :closable="true" :title="isEdit ? '修改成功！' : '发布成功！'" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createItem, getItem, updateItem } from '../api/index.js'
import Navbar from '../components/Navbar.vue'
import { MINSK_METRO, METRO_LINES, displayMetro } from '../data/metro.js'
import { ALL_CATEGORIES } from '../data/categories.js'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.query.id)
const editId = computed(() => parseInt(route.query.id))

const categories = ALL_CATEGORIES

const metroLines = Object.entries(METRO_LINES).map(([key, val]) => ({
  key,
  name: val.name,
  stations: MINSK_METRO.filter(s => s.line === key)
}))

const form = reactive({
  title: '',
  category: '',
  type: 'sell',
  price: '',
  description: '',
  contact: '',
  metro: '',
  address: '',
  images: []
})

const fileInput = ref(null)
const uploading = ref(false)
const submitting = ref(false)
const success = ref(false)

const profile = JSON.parse(localStorage.getItem('profile') || '{}')

async function ensurePhone() {
  if (profile.phone) return true
  try {
    const { value } = await ElMessageBox.prompt('请先输入你的手机号以验证身份', '身份验证', { inputPlaceholder: '手机号', confirmButtonText: '确定', cancelButtonText: '取消' })
    if (!value) return false
    profile.phone = value
    const p = JSON.parse(localStorage.getItem('profile') || '{}')
    p.phone = value
    localStorage.setItem('profile', JSON.stringify(p))
    return true
  } catch { return false }
}

async function loadItem() {
  try {
    const res = await getItem(editId.value)
    const d = res.data
    form.title = d.title
    form.category = d.category
    form.type = d.type
    form.price = d.price
    form.description = d.description
    form.contact = d.contact
    form.metro = d.metro || ''
    form.address = d.address || ''
    form.images = d.images || []
  } catch (e) {
    ElMessage.error('加载失败')
    router.push('/')
  }
}

onMounted(() => {
  if (profile.phone) form.contact = profile.phone
  if (profile.wechat && !form.contact) form.contact = profile.wechat
  if (isEdit.value) loadItem()
})

async function uploadFile(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || '上传失败')
  return data.url
}

async function handleFiles(e) {
  const files = e.target.files
  if (!files.length) return
  uploading.value = true
  let done = 0
  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      ElMessage.warning(file.name + ' 超过 10MB 限制')
      done++
      if (done === files.length) uploading.value = false
      continue
    }
    try {
      const url = await uploadFile(file)
      form.images.push(url)
    } catch (e) {
      ElMessage.error(file.name + ' 上传失败: ' + e.message)
    }
    done++
    if (done === files.length) uploading.value = false
  }
  fileInput.value.value = ''
}

async function submit() {
  if (!form.title || !form.category || !form.price || !form.description) {
    ElMessage.warning('请填写必填项')
    return
  }
  if (isEdit.value && !await ensurePhone()) { return }
  submitting.value = true
  try {
    const payload = { ...form, price: parseFloat(form.price) || 0, phone: profile.phone || '' }

    if (isEdit.value) {
      await updateItem(editId.value, payload)
    } else {
      await createItem(payload)
    }

    success.value = true
    if (!isEdit.value) {
      Object.assign(form, { title: '', category: '', type: 'sell', price: '', description: '', contact: '', metro: '', address: '', images: [] })
    }
  } catch (e) {
    const msg = e.response?.data?.error || (isEdit.value ? '保存失败' : '发布失败')
    ElMessage.error(msg)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.form-wrap { max-width: 640px; margin: 0 auto; padding: 24px; }
.form-wrap h2 { margin-bottom: 20px; }
.file-label { display: inline-flex; align-items: center; justify-content: center; padding: 8px 20px; background: #fff; border: 1px solid #d9d9d9; border-radius: 4px; font-size: 14px; color: #606266; cursor: pointer; user-select: none; transition: all .2s; }
.file-label:hover { color: #409eff; border-color: #409eff; }
.upload-area { display: flex; align-items: center; gap: 12px; }
.upload-hint { color: #999; font-size: 0.85em; }
.image-preview { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.img-item { position: relative; width: 80px; height: 80px; }
.img-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; border: 1px solid #eee; }
.img-item .el-button { position: absolute; top: -8px; right: -8px; }
.uploading-tip { color: #999; font-size: 0.85em; margin-top: 4px; }
</style>
