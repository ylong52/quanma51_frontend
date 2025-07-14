<template>
  <div class="font-inter bg-gray-50 text-gray-800 min-h-screen flex flex-col">
    

    <!-- 主内容区 -->
    <main class="flex-grow container mx-auto px-6 py-10">
       
      <!-- 个人信息管理 -->
      <div class="max-w-4xl mx-auto">
        <div class="apple-card mb-6">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">个人信息</h2>
            <button class="text-primary hover:text-primary/80 transition-custom" v-if="!isEditing" @click="onEdit">
              <i class="fa fa-edit mr-1"></i> 编辑
            </button>
          </div>
          <div class="p-8">
            <!-- 头像区域 -->
            <div class="avatar-upload mb-8">
              <div class="avatar-preview">
                <img :src="avatarUrl" alt="用户头像">
              </div>
              <div class="avatar-edit">
                <input type="file" id="avatarUpload" accept=".png, .jpg, .jpeg" @change="onAvatarChange">
                <label for="avatarUpload">
                  <i class="fa fa-camera"></i>
                </label>
              </div>
            </div>
            <!-- 个人信息表单 -->
            <form class="form-grid" @submit.prevent>
              <label class="form-label" for="username">用户名</label>
              <div>
                <input type="text" id="username" class="apple-input" v-model="form.username" :disabled="!isEditing">
              </div>
              <label class="form-label" for="phone">手机号</label>
              <div>
                <input type="tel" id="phone" class="apple-input" v-model="form.phone" :disabled="!isEditing">
              </div>
              
      
              <!-- 操作按钮 -->
              <div></div>
              <div class="flex space-x-4 pt-4">
                <button type="button" class="apple-btn" v-if="isEditing" @click="onSave" :disabled="saving">
                  <span v-if="saving"><i class="fa fa-spinner fa-spin mr-2"></i> 保存中...</span>
                  <span v-else>保存</span>
                </button>
                <button type="button" class="apple-btn-outline" v-if="isEditing" @click="onCancel">取消</button>
              </div>
            </form>
          </div>
        </div>
        <!-- 修改密码 -->
        <div class="apple-card">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900">修改密码</h2>
          </div>
          <div class="p-8">
            <form class="form-grid" @submit.prevent>
              <label class="form-label" for="oldPassword">当前密码</label>
              <div>
                <input type="password" id="oldPassword" class="apple-input" v-model="passwordForm.oldPassword" placeholder="请输入当前密码">
              </div>
              <label class="form-label" for="newPassword">新密码</label>
              <div>
                <input type="password" id="newPassword" class="apple-input" v-model="passwordForm.newPassword" placeholder="请输入新密码">
                <p class="text-xs text-gray-500 mt-1">密码长度至少8位，包含字母和数字</p>
              </div>
              <label class="form-label" for="confirmPassword">确认新密码</label>
              <div>
                <input type="password" id="confirmPassword" class="apple-input" v-model="passwordForm.confirmPassword" placeholder="请再次输入新密码">
              </div>
              <div></div>
              <div class="flex space-x-4 pt-4">
                <button type="button" class="apple-btn" @click="onChangePassword" :disabled="changingPwd">
                  <span v-if="changingPwd"><i class="fa fa-spinner fa-spin mr-2"></i> 修改中...</span>
                  <span v-else>修改密码</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
 
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

// 个人信息表单数据
const defaultInfo = {
  username: '张三',
  phone: '13800138000',
  email: 'example@mail.com',
  gender: 'male',
  birthday: '1990-01-01',
  address: '北京市朝阳区建国路88号SOHO现代城B座1501室',
}
const form = reactive({ ...defaultInfo })
const isEditing = ref(false)
const saving = ref(false)

// 头像上传
const defaultAvatar = 'https://picsum.photos/id/64/200/200'
const avatarUrl = ref(defaultAvatar)
function onAvatarChange(e) {
  const file = e.target.files && e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      avatarUrl.value = ev.target.result
    }
    reader.readAsDataURL(file)
  }
}

function onEdit() {
  isEditing.value = true
}
function onCancel() {
  Object.assign(form, defaultInfo)
  isEditing.value = false
}
function onSave() {
  saving.value = true
  setTimeout(() => {
    Object.assign(defaultInfo, form)
    isEditing.value = false
    saving.value = false
    window.$toast ? window.$toast.success('个人信息已成功保存！') : alert('个人信息已成功保存！')
  }, 1500)
}

// 修改密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const changingPwd = ref(false)
function onChangePassword() {
  if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    window.$toast ? window.$toast.error('请填写所有密码字段') : alert('请填写所有密码字段')
    return
  }
  if (passwordForm.newPassword.length < 8) {
    window.$toast ? window.$toast.error('新密码长度至少8位') : alert('新密码长度至少8位')
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    window.$toast ? window.$toast.error('两次输入的新密码不一致') : alert('两次输入的新密码不一致')
    return
  }
  changingPwd.value = true
  setTimeout(() => {
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    changingPwd.value = false
    window.$toast ? window.$toast.success('密码修改成功！下次登录请使用新密码') : alert('密码修改成功！下次登录请使用新密码')
  }, 1500)
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.apple-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}
.apple-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.apple-btn {
  background: #0071e3;
  color: #fff;
  border-radius: 9999px;
  font-weight: 500;
  padding: 0.75rem 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.apple-btn:active, .apple-btn:focus {
  outline: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.apple-btn-outline {
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 9999px;
  font-weight: 500;
  padding: 0.75rem 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.apple-btn-outline:hover {
  border-color: #0071e3;
  color: #0071e3;
}
.apple-input {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1.125rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.apple-input:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 2px #0071e355;
}
.apple-radio {
  width: 1.25rem;
  height: 1.25rem;
  color: #0071e3;
}
.avatar-upload {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}
.avatar-upload .avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-upload .avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-upload .avatar-edit {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #0071e3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.avatar-upload .avatar-edit input {
  display: none;
}
.avatar-upload .avatar-edit i {
  color: white;
  font-size: 16px;
}
.form-grid {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1rem 2rem;
  align-items: center;
}
.form-label {
  text-align: right;
  color: #6b7280;
}
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-label {
    text-align: left;
  }
}
</style>
