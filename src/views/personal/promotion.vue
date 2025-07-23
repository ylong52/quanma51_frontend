<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="max-w-md mx-auto w-full p-4">
      <!-- 头部 -->
      <div class="flex items-center bg-white   shadow px-3 py-3 mb-4 fixed top-0 left-0 right-0 z-20 max-w-md mx-auto w-full">
        <router-link to="/personal/index" class="text-gray-500 text-lg mr-2">
          <font-awesome-icon :icon="'user'" />
        </router-link>
        <div class="flex-1 text-center text-lg font-bold text-gray-800">推广中心</div>
      </div>
      <!-- 推广链接生成区 -->
      <div class="bg-white rounded-xl shadow mb-4 p-4 mt-12">
        <div class="font-bold text-base mb-2 flex items-center">
          <font-awesome-icon :icon="'link'" class="text-blue-500 mr-2" />生成推广链接
        </div>
        <div class="mb-3">
 
          <div class="flex items-center bg-gray-50 rounded px-3 py-2">
            <span class="text-gray-400 mr-1">https://mall.com/invite/</span>
            <span class="font-medium text-gray-800">{{ inviteCode }}</span>
            <button @click="copyLink" class="ml-auto px-3 py-1 bg-blue-500 text-white rounded text-sm">复制</button>
          </div>
        </div>
        <!-- 二维码图片 -->
        <div class="flex flex-col items-center mt-4">
          <img
            :src="qrCodeUrl.value"
            alt="推广二维码"
            class="w-40 h-40 rounded shadow border border-gray-200 cursor-pointer"
            @click="downloadQrCode"
          />
          <div class="text-xs text-gray-400 mt-2">点击二维码可保存到相册</div>
        </div>
      </div>
      <!-- 推广数据统计 -->
      <div class="bg-white rounded-xl shadow mb-4 p-4 flex items-center justify-between">
        <div class="flex items-center">
          <font-awesome-icon :icon="'users'" class="text-blue-500 text-2xl mr-3" />
          <div>
            <div class="text-xs text-gray-400">总邀请人数</div>
            <div class="text-lg font-bold text-gray-800">{{ totalInvites.value }}</div>
          </div>
        </div>
        <div class="flex items-center">
          <font-awesome-icon :icon="'yen-sign'" class="text-green-500 text-2xl mr-3" />
          <div>
            <div class="text-xs text-gray-400">累计奖励(元)</div>
            <div class="text-lg font-bold text-gray-800">{{ totalReward.value }}</div>
          </div>
        </div>
      </div>
      <!-- 注册用户列表区 -->
      <div class="bg-white rounded-xl shadow mb-4 p-4 mb-20">
        <div class="font-bold text-base mb-2 flex items-center">
          <font-awesome-icon :icon="'users'" class="text-green-500 mr-2" />注册用户
        </div>
        <div class="flex items-center bg-gray-50 rounded px-2 py-1 mb-2">
          <font-awesome-icon :icon="'search'" class="text-gray-400 mr-1" />
          <input type="text" v-model="searchKeyword" placeholder="搜索手机号" class="flex-1 bg-transparent border-0 outline-none text-sm px-1" />
          <button v-if="searchKeyword" @click="searchKeyword = ''" class="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none">
            <font-awesome-icon :icon="'times-circle'" />
          </button>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="user in filteredUsers" :key="user.id" class="py-3 flex items-center">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <font-awesome-icon :icon="'user'" />
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <div class="font-medium text-gray-800 truncate">{{ user.phone }}</div>
              <div class="text-xs text-gray-400 mt-1 truncate">注册时间: {{ user.registerTime }}</div>
            </div>
            <div class="text-right ml-2">
              <span class="text-green-500 font-bold text-sm">+¥{{ user.totalReward }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="h-10"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faUsers, faLink, faSearch, faTimesCircle, faYenSign } from '@fortawesome/free-solid-svg-icons';
library.add(faUser, faUsers, faLink, faSearch, faTimesCircle, faYenSign);
import QRCode from 'qrcode';
const channelTag = ref('');
const inviteCode = ref('abc123');
const searchKeyword = ref('');
const userList = ref([
  { id: 1, phone: '138****5678', registerTime: '2025-07-14 09:23', totalReward: 30 },
  { id: 2, phone: '139****1234', registerTime: '2025-07-13 15:47', totalReward: 10 },
  { id: 3, phone: '137****8901', registerTime: '2025-07-12 11:35', totalReward: 30 },
  { id: 4, phone: '136****2345', registerTime: '2025-07-10 18:20', totalReward: 10 },
  { id: 5, phone: '135****6789', registerTime: '2025-07-09 09:15', totalReward: 30 }
]);
const filteredUsers = computed(() => {
  if (!searchKeyword.value) return userList.value;
  return userList.value.filter(user => user.phone.includes(searchKeyword.value));
});
function copyLink() {
  const linkText = `https://mall.com/invite/${inviteCode.value}`;
  navigator.clipboard.writeText(linkText).then(() => {
    alert('链接已复制到剪贴板');
  });
}
// 合计数据示例
const totalInvites = computed(() => userList.value.length);
const totalReward = computed(() => userList.value.reduce((sum, u) => sum + u.totalReward, 0));
// 二维码生成与下载
const qrCodeUrl = ref('');
const qrText = computed(() => `https://mall.com/invite/${inviteCode.value}`);
async function generateQr() {
  qrCodeUrl.value = await QRCode.toDataURL(qrText.value, { width: 256, margin: 1 });
}
watch([inviteCode], generateQr, { immediate: true });
onMounted(generateQr);
function downloadQrCode() {
  const a = document.createElement('a');
  a.href = qrCodeUrl.value;
  a.download = '推广二维码.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
</script>
