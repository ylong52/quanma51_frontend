<template>
  <el-config-provider :locale="zhCn">
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
              <div class="text-lg font-bold text-gray-800">{{ totalInvites }}</div>
            </div>
          </div>
          <div class="flex items-center">
            <font-awesome-icon :icon="'yen-sign'" class="text-green-500 text-2xl mr-3" />
            <div>
              <div class="text-xs text-gray-400">累计奖励(元)</div>
              <div class="text-lg font-bold text-gray-800">{{ totalReward }}</div>
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
            <input type="text" v-model="searchKeyword" placeholder="搜索手机号或用户名" class="flex-1 bg-transparent border-0 outline-none text-sm px-1" />
            <button v-if="searchKeyword" @click="searchKeyword = ''" class="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none">
              <font-awesome-icon :icon="'times-circle'" />
            </button>
          </div>
          <div class="divide-y divide-gray-100">
            <!-- 加载状态 -->
            <div v-if="loading" class="py-8 flex justify-center items-center text-gray-400">
              <font-awesome-icon icon="spinner" spin class="mr-2" />加载中...
            </div>
            <!-- 空状态 -->
            <div v-else-if="paginatedUsers.length === 0" class="py-8 flex justify-center items-center text-gray-400">
              暂无推广用户数据
            </div>
            <!-- 用户列表 -->
            <div v-else v-for="(user, index) in paginatedUsers" :key="user.id || index" class="py-3 flex items-center">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <font-awesome-icon :icon="'user'" />
              </div>
              <div class="ml-3 flex-1 min-w-0">
                <div class="font-medium text-gray-800 truncate">{{ user.user_info && user.user_info.id || '未知ID' }}</div>
                <div class="text-xs text-gray-400 mt-1 truncate">姓名: {{ user.user_info && user.user_info.username || '未知' }}</div>
                <div class="text-xs text-gray-400 mt-1 truncate">手机号: {{ user.user_info && user.user_info.phone || '未知' }}</div>
                <div class="text-xs text-gray-400 mt-1 truncate">奖励: {{ user.reward_amount || '0.00' }}</div>
                <div class="text-xs text-gray-400 mt-1 truncate">状态: {{ user.reward_status == 1 ? '已发放' : '未发放' || '未知' }}</div>
                <div class="text-xs text-gray-400 mt-1 truncate">注册时间: {{ user.registration_time || '未知' }}</div>
              </div>
              <div class="text-right ml-2">
                <span class="text-green-500 font-bold text-sm">+¥{{ user.reward || user.totalReward || '0.00' }}</span>
              </div>
            </div>
          </div>
          
          <!-- 分页 -->
          <div class="flex justify-center mt-4">
            <el-pagination 
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange" 
              :current-page="currentPage" 
              :page-sizes="[5, 10, 20]"
              :page-size="pageSize"
              layout="prev, pager, next" 
              :total="total" 
              size="small"
              background 
              :hide-on-single-page="true" 
              :pager-count="5"
              class="mini-pagination">
            </el-pagination>              
          </div>
        </div>
        <div class="h-10"></div>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faUsers, faLink, faSearch, faTimesCircle, faYenSign, faSpinner } from '@fortawesome/free-solid-svg-icons';
library.add(faUser, faUsers, faLink, faSearch, faTimesCircle, faYenSign, faSpinner);
import QRCode from 'qrcode';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ElConfigProvider } from 'element-plus';
import * as api from '@/api';
const channelTag = ref('');
const inviteCode = ref('abc123');
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(5);
const loading = ref(true); // 加载状态
const total = ref(0); // 总条数

const userList = ref([]);

const filteredUsers = computed(() => {
  return userList.value;
});

// 分页后的用户列表
const paginatedUsers = computed(() => {
  if (loading.value) return [];
  return userList.value;
});

// 处理页码变化
function handleCurrentChange(page) {
  currentPage.value = page;
  fetchPromotionUsers();
}

// 处理每页条数变化
function handleSizeChange(size) {
  pageSize.value = size;
  currentPage.value = 1; // 重置到第一页
  fetchPromotionUsers();
}

function copyLink() {
  const linkText = `https://mall.com/invite/${inviteCode.value}`;
  navigator.clipboard.writeText(linkText).then(() => {
    alert('链接已复制到剪贴板');
  });
}
// 监听搜索关键词变化
watch(searchKeyword, () => {
  currentPage.value = 1; // 重置到第一页
  fetchPromotionUsers(); // 重新获取数据
});

// 合计数据示例
const totalInvites = computed(() => userList.value.length);
const totalReward = computed(() => {
  if (!userList.value.length) return '0.00';
  return userList.value.reduce((sum, user) => sum + parseFloat(user.reward || user.totalReward || 0), 0).toFixed(2);
});
// 二维码生成与下载
const qrCodeUrl = ref('');
const qrText = computed(() => `https://mall.com/invite/${inviteCode.value}`);
async function generateQr() {
  qrCodeUrl.value = await QRCode.toDataURL(qrText.value, { width: 256, margin: 1 });
}
watch([inviteCode], generateQr, { immediate: true });

// 模拟获取推广用户数据
const fetchPromotionUsers = async() => {
  try {
    loading.value = true;
    const res = await api.promotionList({
      page: currentPage.value,
      pageSize: pageSize.value,
      searchKeyword: searchKeyword.value
    });
 
    if (res && res.list) {
      // 如果数据直接在res.list中
      userList.value = res.list.data  ;
      currentPage.value = res.list.current_page || currentPage.value;
      pageSize.value = res.list.per_page || pageSize.value;
      total.value = res.list.total || 0;
    } else {
      userList.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error('获取推广用户列表失败:', error);
    userList.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  generateQr();
  fetchPromotionUsers();
});

function downloadQrCode() {
  const a = document.createElement('a');
  a.href = qrCodeUrl.value;
  a.download = '推广二维码.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


</script>
