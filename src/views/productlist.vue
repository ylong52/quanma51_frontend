<template>
  <div class="product-list-page">
    <!-- 顶部区域 -->
    <div class="header">
      <div class="title-container">
        <div class="title">{{ titleCategory }}</div>
        <!-- 分类下拉图标（使用Font Awesome组件） -->
        <font-awesome-icon :icon="['fas', 'chevron-down']" class="category-icon" id="categoryIcon" @click="toggleCategoryDropdown" />
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

    <!-- 分类下拉菜单 -->    
    <div class="category-dropdown" :class="{ active: isCategoryDropdownOpen }">
      <div class="category-grid">
        <div class="category-item" v-for="category in categories" :key="category.id" @click="selectCategoryCLick(category)">
          {{ category.id }} - {{ category.category }}
        </div>
      </div>
    </div>

    <!-- 二级分类 -->
    <div class="sub-category bg-white shadow-lg p-10 mt-10">
      <template v-if="subCategorys.length > 0">
        <div class="grid grid-cols-3 pt-10 gap-3">
          <div
            class="sub-category-item px-9 py-6 rounded-lg hover:bg-blue-50 hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-center font-medium text-gray-800 border border-gray-100 flex flex-col items-center justify-center"
            v-for="subCategory in subCategorys"
            :key="subCategory.id"
            :class="{
              'active bg-blue-100 border-blue-200 font-bold': subCategory.id === selectedSubCategoryId
            }"
            @click="selectSubCategoryClick(subCategory)"
          >
            <div class="mb-2 flex items-center justify-center">
              <img :src="subCategory.img" alt="icon" class="w-8 h-8 object-cover rounded-full" />
            </div>
            <div class="text-base mt-1 truncate w-[5em] mx-auto text-ellipsis overflow-hidden whitespace-nowrap">{{ subCategory.category }}</div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="py-12 text-center text-gray-400 text-base">
          暂无二级分类
        </div>
      </template>
    </div>

    <!-- 分类导航 -->
    <ul class="tab-nav">
      <li v-for="tab in tabs" :key="tab.id">
        <a href="javascript:;" :class="{ active: activeTab === tab.id }" @click="setActiveTab(tab.id)">{{ tab.name }}</a>
      </li>
    </ul>

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

    <!-- 底部导航 -->
    <Footer :active="2" />
     
  </div>
</template>

<script setup>
import { ref, reactive, computed,onUnmounted, watch,onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import Footer from '@/components/page-footer.vue';
import { faChevronDown, faSearch, faThLarge, faList, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import * as api from "@/api";
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

// 注册Font Awesome图标
library.add(faChevronDown, faSearch, faThLarge, faList, faTimesCircle);
const icons = {
  faChevronDown,
  faSearch,
  faThLarge,
  faList
};

// 响应式状态
const isCategoryDropdownOpen = ref(false);
const listViewStyle = ref('grid'); // 'grid' 或 'list'
const activeTab = ref(1);
const searchTerm = ref('');
//
 
onMounted(() => {  
  getProductCategory();
});

// 分类数据 - 添加调试输出确保数据正确加载
const categories = ref([]);
const titleCategory = ref('');
const selectedCategoryId = ref(0);
const getProductCategory = async () => {
  const res = await api.getProductCategory({
    parent_limit: 9999,
    parent_offset: 9999,
  });
  categories.value = res.data;
  titleCategory.value = res.data[0].category;
 
  let category_id = route.query.category?(route.query.category - 0):0;
 
  if (categories.value.length > 0) {
    if (category_id > 0) {
      // 3. 找到对应主分类
      const firstCategory = categories.value.find(cat => cat.id === category_id);
      if (firstCategory) {
        selectedCategoryId.value = firstCategory.id;
        subCategorys.value = firstCategory.children || [];
        titleCategory.value = firstCategory.category;
        // 默认选中第一个二级分类
        if (firstCategory.children && firstCategory.children.length > 0) {
          getProductList(firstCategory.children[0].id);
        }
      }
    }  else {
      let firstCategory = categories.value[0];
      if(firstCategory.children){
        subCategorys.value = firstCategory.children;
        titleCategory.value = firstCategory.category;
        getProductList(firstCategory.children[0].id);
      }
    }
  }

  let category2_id = route.query.category2?(route.query.category2 - 0):0;
  if(category2_id > 0){
    // 设置选中的二级分类ID
    selectedSubCategoryId.value = category2_id;
    // 确保使用传入的category2_id加载商品列表
    getProductList(category2_id);
    
    // 调试输出
    console.log('从URL接收到category2_id:', category2_id, '设置selectedSubCategoryId为:', selectedSubCategoryId.value);
  }

};



console.log('Categories data:', categories); // 添加调试日志
const tabs = reactive([
  { id: 1, name: '默认' },
 { id: 'updated_at', name: '时间排序' },
  { id: 'price', name: '价格排序' },
  { id: 'number', name: '销量排序' },
]);

 
// 底部导航数据
const bottomNavItems = reactive([
  { id: 1, name: '首页' },
  { id: 2, name: '分类' }, 
  { id: 3, name: '我的' },
]);

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
  // 这里使用计算属性filteredGoods自动过滤，无需额外操作
};

// 清除搜索内容
const clearSearch = () => {
  searchTerm.value = '';
  console.log('清除搜索内容');
  // 清除后会自动触发计算属性重新计算
};
 
// 方法
const toggleCategoryDropdown = () => {
  isCategoryDropdownOpen.value = !isCategoryDropdownOpen.value;
};

const setActiveTab = (tabId) => {
  activeTab.value = tabId;
  // 这里可以添加排序逻辑
  getProductList(selectedSubCategoryId.value);
};

// 添加列表视图切换方法
const toggleListViewStyle = () => {
  listViewStyle.value = listViewStyle.value === 'grid' ? 'list' : 'grid';
};

const goodsData = ref([])
const subCategorys = ref([])
const selectedSubCategoryId = ref(null)
const selectCategoryCLick = (category) => {

  //category是主类，需要获取子类
  if(category.children){
    subCategorys.value = category.children;
    titleCategory.value = category.category;
    getProductList(category.children[0].id);
  }
  toggleCategoryDropdown();
};

const selectSubCategoryClick = (subCategory) => {
  selectedSubCategoryId.value = subCategory.id
  getProductList(subCategory.id);
}

const getProductList = async (subCategory_id) => {
  const res = await api.getProductList({
    category: subCategory_id,
    limit:999,
    sort:activeTab.value==1?'':activeTab.value
  });
  goodsData.value = res.data || []; // 确保数据默认为空数组
}

watch(subCategorys, (newList) => {
  // 只有在selectedSubCategoryId为null或未定义时才设置默认值
  // 这样可以避免覆盖从URL传入的category2参数
  if (newList.length > 0 && !selectedSubCategoryId.value) {
    console.log('设置默认二级分类ID:', newList[0].id);
    selectedSubCategoryId.value = newList[0].id;
  }
}, { immediate: true })

// 点击页面其他区域关闭下拉菜单
const handleClickOutside = (event) => {
  const categoryIcon = document.getElementById('categoryIcon');
  const categoryDropdown = document.querySelector('.category-dropdown');

  if (categoryIcon && categoryDropdown && 
      !categoryIcon.contains(event.target) && 
      !categoryDropdown.contains(event.target)) {
    isCategoryDropdownOpen.value = false;
  }
};

const goGoodsDetail = (goods_id) => {
  router.push({
    path: '/goodsdetail',
    query: { id: goods_id }
  });
}

// 监听点击事件
document.addEventListener('click', handleClickOutside);

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
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
  position: sticky;
  top: 0;
  z-index: 10;
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

.category-icon {
  width: 16px;
  height: 16px;
  margin-left: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
  color: #b8b6b6;
}

.category-icon.active {
  transform: rotate(180deg);
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

/* 分类下拉菜单 */
.category-dropdown {
  position: absolute;
  top: 56px;
  left: 0;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  z-index: 9;
  max-height: 0;
  overflow-y: auto; /* 允许垂直滚动 */
  transition: max-height 0.3s ease-out;
}

.category-dropdown.active {
  max-height: 300px; /* 限制最大高度，超出时显示滚动条 */
}

/* 自定义滚动条样式 */
.category-dropdown::-webkit-scrollbar {
  width: 6px;
}

.category-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.category-dropdown::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.category-dropdown::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background-color: #eee;
}

.category-item {
  padding: 12px 8px;
  background-color: #fff;
  text-align: center;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.category-item:hover {
  background-color: #f8f8f8;
}

/* 分类导航 */
.tab-nav {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.tab-nav li {
  flex: 1;
  text-align: center;
  list-style: none;
}

.tab-nav li a {
  display: block;
  padding: 10px 0;
  text-decoration: none;
  color: #333;
  font-size: 14px;
}

.tab-nav li a.active {
  color: #f00;
  font-weight: 500;
}

/* 商品列表 */
.goods-list {
  padding: 10px;
  max-height: calc(100vh - 220px); /* 减去其他元素的高度，确保在屏幕内显示 */
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

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-bottom: 10px;
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

/* 底部导航 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  border-top: 1px solid #eee;
}

.bottom-nav ul {
  display: flex;
}

.bottom-nav li {
  flex: 1;
  text-align: center;
  list-style: none;
}

.bottom-nav li a {
  display: block;
  padding: 10px 0;
  text-decoration: none;
  color: #333;
  font-size: 14px;
}
</style>
