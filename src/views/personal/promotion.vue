<template>
  <el-config-provider :locale="zhCn">
    <div class="min-h-screen bg-gray-100 flex flex-col">
      <div class="max-w-md mx-auto w-full p-4">
        <!-- 头部 -->
        <div class="flex items-center bg-white shadow px-3 py-3 mb-4 fixed top-0 left-0 right-0 z-20 max-w-md mx-auto w-full">
          <a @click="$router.back()" class="text-gray-500 text-lg mr-2 cursor-pointer">
            <font-awesome-icon :icon="'arrow-left'" />
          </a>
          <div class="flex-1 text-center text-lg font-bold text-gray-800">推广中心</div>
          <router-link to="/personal/index" class="text-gray-500 text-lg ml-2">
            <font-awesome-icon :icon="'user'" />
          </router-link>
        </div>
        <!-- 推广链接生成区 -->
        <div class="bg-white rounded-xl shadow mb-4 p-4 mt-12">
          <div class="font-bold text-base mb-2 flex items-center">
            <font-awesome-icon :icon="'link'" class="text-blue-500 mr-2" />生成推广链接
          </div>
          <div class="mb-3">
   
            <div class="flex items-center bg-gray-50 rounded px-3 py-2">
              <span class="text-gray-400 mr-1">{{ getDomain }}</span>
  
              <button @click="copyLink" class="ml-auto px-3 py-1 bg-blue-500 text-white rounded text-sm">复制</button>
            </div>
          </div>
          <!-- 二维码图片 -->
          <div class="flex flex-col items-center mt-4">
            <div class="relative cursor-pointer" @click="handleDownloadQRCode">
              <QRCode 
                :value="getDomain"
                :size="300"
                :foreground="'#FF6B6B'"
                :background="'#F7F7F7'"
                :margin="4"
                :error-correction-level="'H'"
              />
              <!-- 下载遮罩层 -->
              <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                <div class="download-overlay opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <font-awesome-icon :icon="'download'" class="text-white text-2xl" />
                  <span class="text-white text-sm ml-2">点击下载</span>
                </div>
              </div>
            </div>
            <div class="text-xs text-gray-400 mt-2">点击二维码可保存到相册</div>
            
            <!-- 下载按钮 -->
            <button 
              @click="handleDownloadQRCode" 
              class="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
              :disabled="isDownloading"
            >
              <font-awesome-icon :icon="isDownloading ? 'spinner' : 'download'" :spin="isDownloading" class="mr-2" />
              {{ isDownloading ? '下载中...' : '下载二维码' }}
            </button>
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
import QRCode from '@/components/QRCode.vue'
import { generateQRCode, downloadQRCode, generateQRCodeSVG } from '@/utils/qrcode.js'
import { downloadEventManager } from '@/utils/downloadEvents.js'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faUsers, faLink, faSearch, faTimesCircle, faYenSign, faSpinner, faArrowLeft, faDownload } from '@fortawesome/free-solid-svg-icons';
library.add(faUser, faUsers, faLink, faSearch, faTimesCircle, faYenSign, faSpinner, faArrowLeft, faDownload);
 
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ElConfigProvider } from 'element-plus';
import * as api from '@/api';
import { useUserStore } from '@/store/user';
const userStore = useUserStore();
 
const inviteCode = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).userId:'';
debugger;
const getDomain =  import.meta.env.VITE_API_BASE_URL+'?invite='+inviteCode;

const customColor = ref('#FF6B6B')
const customBgColor = ref('#F7F7F7')
const toolResult = ref(null)
const isDownloading = ref(false)

const handleDownloadQRCode = async () => {
  // 使用事件管理器触发下载开始事件
  downloadEventManager.triggerDownloadStart({
    text: getDomain,
    timestamp: new Date().toISOString()
  })
  
  // 设置下载状态
  isDownloading.value = true
  
  try {
    await downloadQRCode(getDomain, `推广二维码-${Date.now()}.png`, {
      width: 300,
      color: { dark: '#FF6B6B', light: '#F7F7F7' }
    })
    
    // 使用事件管理器触发下载成功事件
    downloadEventManager.triggerDownloadSuccess({
      text: getDomain,
      filename: `推广二维码-${Date.now()}.png`,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('下载失败:', error)
    
    // 使用事件管理器触发下载失败事件
    downloadEventManager.triggerDownloadError({
      text: getDomain,
      error: error.message,
      timestamp: new Date().toISOString()
    })
  } finally {
    isDownloading.value = false
  }
}

const generateSVG = async () => {
  try {
    const svgString = await generateQRCodeSVG(getDomain, {
      width: 200,
      color: { dark: '#000000', light: '#FFFFFF' }
    })
    toolResult.value = { type: 'svg', data: svgString }
  } catch (error) {
    console.error('生成SVG失败:', error)
  }
}

const generateWithTool = async () => {
  try {
    const dataURL = await generateQRCode(simpleText.value, {
      width: 200,
      color: { dark: '#000000', light: '#FFFFFF' }
    })
    toolResult.value = { type: 'image', data: dataURL }
  } catch (error) {
    console.error('生成失败:', error)
  }
}

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
   
  navigator.clipboard.writeText(getDomain).then(() => {
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




</script>

<style scoped>
.download-overlay {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 12px 16px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
}

.download-overlay:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

/* 确保二维码容器有正确的圆角 */
.relative {
  border-radius: 8px;
  overflow: hidden;
}
</style>
