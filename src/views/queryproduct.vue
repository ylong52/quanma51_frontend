<template>
  <el-config-provider :locale="zhCn">
    <div class="product-list-page">
      <!-- 顶部区域 -->
      <div class="header">
        <div class="title-container">
          <div class="title">商品列表</div>
        </div>
        <div class="search-container">
          <input type="text" placeholder="请输入您想要的商品" class="search-input" v-model="searchTerm" @input="handleSearch">
          <!-- 清除按钮 -->
          <font-awesome-icon 
            v-if="searchTerm" 
            :icon="['fas', 'times-circle']" 
            class="clear-icon" 
            @click="clearSearch" 
          />
          <!-- 搜索图标（使用Font Awesome组件） -->
          <font-awesome-icon v-else :icon="['fas', 'search']" class="search-icon" @click="handleSearch" />
        </div>
        <!-- 列表样式切换图标（使用Font Awesome组件） -->
        <font-awesome-icon :icon="listViewStyle === 'grid' ? ['fas', 'th-large'] : ['fas', 'list']" class="view-style-icon" @click="toggleListViewStyle" />
      </div>

      <!-- 商品列表 -->
      <div class="goods-list" :class="{ 'grid-view': listViewStyle === 'grid', 'list-view': listViewStyle === 'list' }">
        <template v-if="filteredGoods.length > 0">
          <div class="goods-item" v-for="goods in filteredGoods" :key="goods.id">
            <img :src="goods.imgUrl" alt="{{ goods.name }}" class="goods-img" loading="lazy">
            <div class="goods-info">
              <div class="goods-title">{{ goods.name }}</div>
              <div class="goods-sku">商品编号：{{ goods.id }}</div>
              <div class="price">售价：{{ goods.platform_price }}元</div>
            </div>
            <button class="buy-btn" @click="goGoodsDetail(goods.id)">立即购买</button>
          </div>
        </template>
        <div class="goods-item" v-else>
          <div class="text-center text-gray-400 text-base">
            {{ searchTerm ? '没有找到相关商品' : '暂无商品' }}
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination 
          @current-change="handleCurrentChange" 
          :current-page="currentPage" 
          :page-size="pageSize"
          layout="prev, pager, next" 
          :total="total" 
          size="small" 
          background 
          :hide-on-single-page="true" 
          :pager-count="5">
        </el-pagination>
      </div>

      <!-- 底部导航 -->
      <Footer :active="99" />
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import Footer from '@/components/page-footer.vue';
import { faSearch, faThLarge, faList, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import * as api from "@/api";
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ElConfigProvider } from 'element-plus';
const router = useRouter();

// 注册Font Awesome图标
library.add(faSearch, faThLarge, faList, faTimesCircle);
const route = useRoute();
 
const searchTerm = ref(route.query.searchValue || '');

// 响应式状态
const listViewStyle = ref('grid'); // 'grid' 或 'list'
 
const goodsData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

onMounted(() => {  
  getProductList();
});

// 过滤后的商品列表
const filteredGoods = computed(() => {
  if (!searchTerm.value.trim()) return goodsData.value;
  return goodsData.value.filter(goods => 
    goods.name && goods.name.toLowerCase().includes(searchTerm.value.trim().toLowerCase())
  );
});

// 处理搜索
const handleSearch = () => {
  console.log('搜索商品:', searchTerm.value);
  currentPage.value = 1; // 重置到第一页
  getProductList(); // 重新获取数据
};

// 清除搜索内容
const clearSearch = () => {
  searchTerm.value = '';
  console.log('清除搜索内容');
  currentPage.value = 1; // 重置到第一页
  getProductList(); // 重新获取数据
};

// 添加列表视图切换方法
const toggleListViewStyle = () => {
  listViewStyle.value = listViewStyle.value === 'grid' ? 'list' : 'grid';
};

const getProductList = async () => {
  try {
    const res = await api.getProductList({
      limit: pageSize.value,
      page: currentPage.value,
      keyword: searchTerm.value
    });
    
    if (res.data) {
      goodsData.value = res.data || []; // 确保数据默认为空数组
      
      // 处理分页数据
      if (res) {
        total.value = parseInt(res.total) || 0;
        currentPage.value = parseInt(res.current_page) || 1;
        pageSize.value = parseInt(res.per_page) || 10;
      } else {
        // 如果API没有返回分页信息，则假设总数为数组长度
        total.value = goodsData.value.length;
      }
    } else {
      goodsData.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error('获取商品列表失败:', error);
    goodsData.value = [];
    total.value = 0;
  }
};

// 处理页码变化
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  getProductList();
};

const goGoodsDetail = (goods_id) => {
  router.push({
    path: '/goodsdetail',
    query: { id: goods_id }
  });
};
</script>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.product-list-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 50px; /* 为底部导航留出空间 */
  max-width: 640px;
  margin: 0 auto;
  position: relative;
}

/* 顶部搜索栏及导航 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 100;
  max-width: 640px;
  margin: 0 auto;
}

.title-container {
  display: flex;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.search-container {
  flex: 1;
  margin: 0 10px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 30px 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  background-color: #f8f8f8;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #ff4d4f;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #999;
}

.clear-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #aaa;
  cursor: pointer;
  z-index: 2; /* 确保它在搜索图标上方 */
  transition: color 0.2s;
}

.clear-icon:hover {
  color: #ff4d4f; /* 鼠标悬停时变红色 */
}

.view-style-icon {
  width: 16px;
  height: 16px;
  color: #bbbaba;
  cursor: pointer;
}

/* 商品列表 */
.goods-list {
  padding: 10px;
  padding-top: 60px; /* 为固定的头部留出空间 */
  max-height: calc(100vh - 120px); /* 减去其他元素的高度，确保在屏幕内显示 */
  overflow-y: auto; /* 允许垂直滚动 */
}

/* 自定义商品列表滚动条样式 */
.goods-list::-webkit-scrollbar {
  width: 6px;
}

.goods-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.goods-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.goods-list::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

/* 网格视图 */
.goods-list.grid-view {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

/* 列表视图 */
.goods-list.list-view {
  display: block;
}

.goods-item {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  height: 100%;
}

.goods-list.list-view .goods-item {
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

.goods-img {
  width: 70%;
  height: 70%;
  object-fit: cover;
  margin-bottom: 10px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.goods-list.list-view .goods-img {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  margin-bottom: 0;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.goods-title {
  font-size: 14px;
  margin-bottom: 5px;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-sku {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.price {
  font-size: 14px;
  color: #f00;
  margin-bottom: 5px;
  font-weight: 500;
}

.buy-btn {
  background-color: #f00;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
}

.goods-list.list-view .buy-btn {
  width: auto;
}

/* 分页容器样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  background-color: #fff;
  margin-top: 10px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
}

/* 自定义分页器样式 */
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #ff4d4f;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled):hover) {
  color: #ff4d4f;
}
</style>
