<template>
  <div class="publish-page">
    <Navbar />
    <div class="form-wrap">
      <h2>发布信息</h2>
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
              <el-option v-for="s in line.stations" :key="s.id" :label="s.name" :value="s.id" />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="具体地址">
          <el-input v-model="form.address" placeholder="街道、楼号、房间号等" />
        </el-form-item>

        <el-divider>图片</el-divider>

        <el-form-item label="上传图片">
          <div class="upload-area">
            <input type="file" accept="image/*" multiple style="display:none" ref="fileInput" @change="handleFiles" />
            <el-button @click="$refs.fileInput.click()">选择图片</el-button>
            <span class="upload-hint">支持 JPG/PNG，单张不超过 2MB</span>
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
          <el-button type="primary" native-type="submit" :loading="submitting" style="width:100%">发布</el-button>
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
import { MINSK_METRO, METRO_LINES } from '../data/metro.js'

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
if (profile.phone) form.contact = profile.phone
if (profile.wechat && !form.contact) form.contact = profile.wechat

function handleFiles(e) {
  const files = e.target.files
  if (!files.length) return
  uploading.value = true
  let loaded = 0
  for (const file of files) {
    if (file.size > 2 * 1024 * 1024) {
      ElMessage.warning(file.name + ' 超过 2MB 限制')
      continue
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      form.images.push(ev.target.result)
      loaded++
      if (loaded === files.length) uploading.value = false
    }
    reader.onerror = () => { uploading.value = false; ElMessage.error('图片读取失败') }
    reader.readAsDataURL(file)
  }
  fileInput.value.value = ''
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
    Object.assign(form, { title: '', category: '', type: 'sell', price: '', description: '', contact: '', metro: '', address: '', images: [] })
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
.upload-area { display: flex; align-items: center; gap: 12px; }
.upload-hint { color: #999; font-size: 0.85em; }
.image-preview { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.img-item { position: relative; width: 80px; height: 80px; }
.img-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; border: 1px solid #eee; }
.img-item .el-button { position: absolute; top: -8px; right: -8px; }
.uploading-tip { color: #999; font-size: 0.85em; margin-top: 4px; }
</style>
