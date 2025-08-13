<template>
  <div class="flex h-screen overflow-hidden flex-col bg-white font-sans text-textDark">
    <!-- 搜索栏 -->
    <div class="p-3 border-b border-borderGray bg-white shadow-sm">
      <!-- 搜索区 -->
    <div class="bg-white p-3 shadow-sm section-highlight cursor-pointer" data-section="search-area">
      <div class="flex items-center space-x-2">
        <i class="fa fa-search text-gray-400 pl-3"></i>
        <input type="text" placeholder="请输入商品名称" class="flex-1 h-10 bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/30">
        <button class="bg-primary text-white py-2 px-5 rounded-full text-sm font-medium">
          搜索
        </button>
      </div>
    </div>
    
    </div>
    <!-- 分类内容区 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 左侧导航 -->
      <div class="w-28 bg-leftBg flex-shrink-0 border-r border-borderGray overflow-y-auto scrollbar-hide h-full">
       
        <ul class="py-2">
          <li v-for="(cat, idx) in categories" :key="cat.category"
              :class="['px-3 py-4 text-center cursor-pointer transition-colors', idx === activeIndex ? 'nav-item-active' : 'text-textGray text-sm font-medium hover:bg-gray-100']"
              @click="selectCategory(idx)">
            <i :class="[cat.icon, 'block mx-auto mb-1']"></i>{{ cat.category }}
          </li>
        </ul>
      </div>
      <!-- 右侧内容 -->
      <div ref="rightPanel" class="flex-1 overflow-y-auto scrollbar-hide h-full bg-rightBg" @scroll="handleScroll">
       
        <div class="p-4">
          <template  v-if="filteredCategories.length > 0">
            <div v-for="(cat, idx) in filteredCategories" :key="cat.category" class="mb-8 category-block">
              <!-- 一级类名 -->
              <div class="text-xl font-bold mb-2 text-textDark">{{ cat.category }}</div>
              <!-- 二级服务卡片 -->
              <div class="grid grid-cols-3 gap-4">
                <div v-for="srv in cat.children" :key="srv.category" class="text-center service-item service-card">
                  <div class="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2">
                    <img :src="srv.img" alt="icon" class="w-full h-full object-cover">
                  </div>
                  <span class="text-sm text-textDark">{{ srv.category }}</span>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="py-12 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa fa-search text-gray-400 text-2xl"></i>
            </div>
            <p class="text-textGray">没有找到相关服务</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import * as api from '@/api'
const searchTerm = ref('')
const activeIndex = ref(0)
const rightPanel = ref(null)
const categoryRefs = ref([])

const categories = ref([]);

const getCategories = async () => {
  const res = await api.getProductCategory({"parent_limit":9999,"parent_offset":9999})
  categories.value = res.data;
  console.log( res.data )
}
getCategories();

function selectCategory(idx) {
  activeIndex.value = idx
  searchTerm.value = ''
  // 滚动到对应分类
  nextTick(() => {
    if (categoryRefs.value[idx]) {
      categoryRefs.value[idx].scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const filteredCategories = computed(() => {
  if (searchTerm.value.trim()) {
    // 搜索时，返回所有包含关键字的服务，按分类分组
    const arr = categories.value
      .map(cat => ({
        ...cat,
        services: cat.services.filter(srv => srv.name.includes(searchTerm.value.trim()))
      }))
      .filter(cat => cat.services.length > 0)
    return Array.isArray(arr) ? arr : []
  } else {
    return  categories.value 
  }
})

const filteredServices = computed(() => {
  return Array.isArray(filteredCategories.value)
    ? filteredCategories.value.reduce((arr, cat) => arr.concat(cat.services), [])
    : []
})

// 右侧滚动时高亮左侧导航
function handleScroll() {
  if (!categoryRefs.value.length) return
  const scrollTop = rightPanel.value.scrollTop
  let foundIdx = 0
  for (let i = 0; i < categoryRefs.value.length; i++) {
    const el = categoryRefs.value[i]
    if (el && el.offsetTop - 40 <= scrollTop) {
      foundIdx = i
    }
  }
  activeIndex.value = foundIdx
}

// 初始化 categoryRefs
onMounted(() => {
  categoryRefs.value = []
})
</script>

<style scoped>
.text-primary { color: #165DFF; }
.bg-leftBg { background: #F5F7FA; }
.bg-rightBg { background: #FFFFFF; }
.text-textDark { color: #333333; }
.text-textGray { color: #999999; }
.bg-cardBg { background: #F9FAFC; }
.border-borderGray { border-color: #E5E6EB; }
.nav-item-active {
  color: #165DFF;
  background: #fff;
  border-left: 2px solid #165DFF;
  font-weight: 500;
}
.service-card {
  transition: all 0.2s;
}
.service-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px 0 rgba(22,93,255,0.08);
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.category-block {
  scroll-margin-top: 60px;
}
</style>
