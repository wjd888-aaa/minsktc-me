<template>
  <div class="login-page">
    <Navbar />
    <div class="login-card">
      <h2>我的信息</h2>
      <el-form @submit.prevent="saveProfile">
        <el-form-item label="昵称">
          <el-input v-model="name" placeholder="选填，展示用" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="phone" placeholder="买家联系你" />
        </el-form-item>
        <el-form-item label="微信">
          <el-input v-model="wechat" placeholder="选填" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" style="width:100%">保存</el-button>
        </el-form-item>
      </el-form>
      <p class="tip">保存后，发布信息时会自动填入联系方式</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Navbar from '../components/Navbar.vue'

const name = ref('')
const phone = ref('')
const wechat = ref('')

onMounted(() => {
  const p = JSON.parse(localStorage.getItem('profile') || '{}')
  name.value = p.name || ''
  phone.value = p.phone || ''
  wechat.value = p.wechat || ''
})

function saveProfile() {
  localStorage.setItem('profile', JSON.stringify({ name: name.value, phone: phone.value, wechat: wechat.value }))
  ElMessage.success('已保存')
}
</script>

<style scoped>
.login-card { max-width: 400px; margin: 60px auto; padding: 32px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.login-card h2 { text-align: center; margin-bottom: 24px; }
.tip { text-align: center; color: #999; font-size: 0.85em; margin-top: 16px; }
</style>
