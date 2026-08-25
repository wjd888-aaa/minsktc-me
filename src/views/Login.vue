<template>
  <div class="login-page">
    <Navbar />
    <div class="login-card">
      <template v-if="!signedIn">
        <h2>登录 / 注册</h2>
        <div v-if="!clerkReady" class="auth-tip">
          <p v-if="clerkError" class="err">{{ clerkError }}</p>
          <p v-else>正在加载登录服务…</p>
        </div>
        <div ref="clerkBox" :style="{ display: clerkMounted ? 'block' : 'none' }"></div>
        <p class="tip">支持邮箱注册登录，Google 一键登录上线后此处会自动显示 Google 按钮</p>
      </template>
      <template v-else>
        <div class="user-head">
          <div class="avatar">{{ avatarChar }}</div>
          <div class="user-meta">
            <b>{{ displayName }}</b>
            <span>{{ userEmail }}</span>
          </div>
          <el-button size="small" text type="danger" @click="logout">退出</el-button>
        </div>
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
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import Navbar from '../components/Navbar.vue'

const signedIn = ref(false)
const clerkReady = ref(false)
const clerkMounted = ref(false)
const clerkError = ref('')
const clerkBox = ref(null)
const userEmail = ref('')
const displayName = ref('')
const name = ref('')
const phone = ref('')
const wechat = ref('')
let pollTimer = null

const avatarChar = computed(() => (displayName.value || userEmail.value || '?').charAt(0).toUpperCase())

function loadClerkAuth() {
  return new Promise((resolve, reject) => {
    if (window.BKAuth) return resolve(window.BKAuth)
    const s = document.createElement('script')
    s.src = '/clerk-auth.js'
    s.onload = () => resolve(window.BKAuth)
    s.onerror = () => reject(new Error('登录脚本加载失败'))
    document.head.appendChild(s)
  })
}

function showUser(u) {
  let email = ''
  if (u.primaryEmailAddress && typeof u.primaryEmailAddress === 'object') {
    email = u.primaryEmailAddress.emailAddress || ''
  } else if (u.emailAddresses && u.emailAddresses.length) {
    for (const e of u.emailAddresses) {
      if (u.primaryEmailAddressId === e.id) { email = e.emailAddress; break }
      if (!email) email = e.emailAddress
    }
  }
  const n = u.username || u.firstName || email.split('@')[0]
  userEmail.value = email
  displayName.value = n
  signedIn.value = true
  try { localStorage.setItem('xianyu_user', JSON.stringify({ n, e: email })) } catch (err) {}
  const p = JSON.parse(localStorage.getItem('profile') || '{}')
  if (!p.name && n) { name.value = n; saveProfile(true) }
}

async function mountSignIn() {
  const auth = window.BKAuth
  try {
    await auth.mountSignIn(clerkBox.value)
    clerkMounted.value = true
  } catch (e) {
    clerkError.value = (e && e.message) || '登录组件加载失败'
  }
}

async function init() {
  try {
    const auth = await loadClerkAuth()
    if (!auth.isConfigured()) {
      clerkError.value = '登录服务即将上线，敬请期待'
      return
    }
    const u = await auth.user()
    if (u) { showUser(u); clerkReady.value = true; return }
    clerkReady.value = true
    await mountSignIn()
    const Clerk = await auth.init()
    Clerk.addListener((e) => {
      if (e.client && e.client.sessions) {
        const s = e.client.sessions[0]
        if (s && s.user) showUser(s.user)
      }
    })
    pollTimer = setInterval(async () => {
      try {
        const cu = await auth.user()
        if (cu && !signedIn.value) showUser(cu)
      } catch (err) {}
    }, 3000)
  } catch (e) {
    clerkError.value = (e && e.message) || '登录服务加载失败'
  }
}

function logout() {
  try { localStorage.removeItem('xianyu_user') } catch (err) {}
  window.BKAuth.logout().then(() => location.reload())
}

function saveProfile(silent) {
  localStorage.setItem('profile', JSON.stringify({ name: name.value, phone: phone.value, wechat: wechat.value }))
  if (!silent) ElMessage.success('已保存')
}

onMounted(init)
onBeforeUnmount(() => { if (pollTimer) clearInterval(pollTimer) })
</script>

<style scoped>
.login-card { max-width: 400px; margin: 60px auto; padding: 32px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.login-card h2 { text-align: center; margin-bottom: 24px; }
.tip { text-align: center; color: #999; font-size: 0.85em; margin-top: 16px; }
.auth-tip { text-align: center; color: #999; padding: 24px 0; }
.auth-tip .err { color: #c0392b; }
.user-head { display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0; margin-bottom: 20px; }
.avatar { width: 44px; height: 44px; border-radius: 50%; background: #409eff; color: #fff; font-size: 20px; line-height: 44px; text-align: center; flex-shrink: 0; }
.user-meta { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.user-meta b { font-size: 15px; }
.user-meta span { color: #999; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
