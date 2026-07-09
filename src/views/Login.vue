<template>
  <div class="login-page">
    <Navbar />
    <div class="login-card">
      <h2>登录</h2>
      <el-form @submit.prevent="login">
        <el-form-item label="手机号">
          <el-input v-model="phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" style="width:100%">获取验证码</el-button>
        </el-form-item>
      </el-form>
      <p class="tip">登录后可发布信息和管理你的内容</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import Navbar from '../components/Navbar.vue'

const phone = ref('')

async function login() {
  ElMessage.info('登录功能开发中...')
}
</script>

<style scoped>
.login-card { max-width: 400px; margin: 60px auto; padding: 32px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.login-card h2 { text-align: center; margin-bottom: 24px; }
.tip { text-align: center; color: #999; font-size: 0.85em; margin-top: 16px; }
</style>
