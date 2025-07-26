<template>
  <div
    class="flex h-screen overflow-hidden flex-col bg-white font-sans text-textDark"
  >
    <!-- 搜索栏 -->
    <div class="">
      <!-- 搜索区 -->
      <div
        class="bg-white p-3 shadow-sm section-highlight cursor-pointer"
        data-section="search-area"
      >
        <div class="flex items-center space-x-2">
          <i class="fa fa-search text-gray-400 pl-3"></i>
        <input 
            type="text"
            placeholder="请输入商品名称"
          v-model="searchTerm"
            class="flex-1 h-10 bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          
        </div>
      </div>
    </div>
    <!-- 分类内容区 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 左侧导航 -->
      <div
        class="w-28 bg-leftBg flex-shrink-0 border-r border-borderGray overflow-y-auto scrollbar-hide h-full"
      >
        <ul class="py-2 mb-10">
          <li
            v-for="(cat, idx) in categories"
            :key="cat.category"
            :class="[
              'px-3 py-4 text-center cursor-pointer transition-colors',
              idx === activeIndex
                ? 'nav-item-active'
                : 'text-textGray text-sm font-medium hover:bg-gray-100',
            ]"
            @click="selectCategory(idx)"
          >
            <i :class="[cat.icon, 'block mx-auto mb-1']"></i>{{ cat.category }}
          </li>
        </ul>
      </div>
      <!-- 右侧内容 -->
      <div
        ref="rightPanel"
        class="flex-1 overflow-y-auto scrollbar-hide h-full bg-rightBg"
        @scroll="handleScroll"
      >
        <div class="p-4">
          <template v-if="filteredCategories.length > 0">
            <div
              v-for="(cat, idx) in filteredCategories"
              :key="cat.category"
              class="mb-8 category-block"
              :ref="(el) => (categoryRefs[idx] = el)"
            >
              <!-- 一级类名 -->
              <div class="text-xl  mb-2 text-textDark text-center text-textGray">
                {{ cat.category }}
              </div>
              <!-- 二级服务卡片 -->
              <div class="grid grid-cols-3 gap-4">
                <div
                  v-for="srv in cat.children"
                  :key="srv.category"
                  class="text-center service-item service-card"
                >
                  <div
                    class="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2" @click="goToDetail(srv)"
                  >
                    <img
                      :src="srv.img"
                      alt="icon"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <span class="text-sm text-textDark">{{ srv.category }}</span>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="py-12 text-center">
            <div
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="fa fa-search text-gray-400 text-2xl"></i>
            </div>
            <p class="text-textGray">没有找到相关服务</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from "vue";
import Footer from '@/components/page-footer.vue';
import { useRouter } from 'vue-router';
import * as api from "@/api";
const router = useRouter();
const searchTerm = ref('');
const activeIndex = ref(0);
const rightPanel = ref(null);
const categoryRefs = ref([]);

const categories = ref([]);

const getCategories = async () => {
  const res = await api.getProductCategory({
    parent_limit: 9999,
    parent_offset: 9999,
  });
  categories.value = res.data;
  console.log(res.data);
};
getCategories();

function selectCategory(idx) {
  activeIndex.value = idx;
  searchTerm.value = "";
  // 滚动到对应分类
  nextTick(() => {
    if (categoryRefs.value[idx]) {
      categoryRefs.value[idx].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
}

const filteredCategories = computed(() => {
  if (searchTerm.value.trim()) {
    return categories.value
      .map((cat) => ({
        ...cat,
        children: cat.children
          ? cat.children.filter((srv) =>
              // 不区分大小写匹配子分类名称
              srv.category.toLowerCase().includes(searchTerm.value.trim().toLowerCase())
            )
          : [],
      }))
      // 过滤掉子分类为空的父分类
      .filter(cat => cat.children && cat.children.length > 0);
  } else {
    // 无搜索时返回所有分类和子分类
    return categories.value;
  }
})

const filteredServices = computed(() => {
  return Array.isArray(filteredCategories.value)
    ? filteredCategories.value.reduce(
        (arr, cat) => arr.concat(cat.services),
        []
      )
    : [];
});

// 右侧滚动时高亮左侧导航
function handleScroll() {
  if (!categoryRefs.value.length) return;

  const scrollTop = rightPanel.value.scrollTop;
  let foundIdx = 0;

  // 使用getBoundingClientRect获取元素位置，提高浏览器兼容性
  for (let i = 0; i < categoryRefs.value.length; i++) {
    const el = categoryRefs.value[i];
    if (el) {
      const rect = el.getBoundingClientRect();
      // 元素顶部距离视口顶部的距离
      const elementTop = rect.top + scrollTop - rightPanel.value.offsetTop;

      if (elementTop - 40 <= scrollTop) {
        foundIdx = i;
      }
    }
  }

  activeIndex.value = foundIdx;
}

// 初始化 categoryRefs
onMounted(() => {
  categoryRefs.value = [];
});
function handleSearch() {
  // 搜索逻辑已通过computed属性实现，这里可以添加额外的搜索处理或输入验证
  if (searchTerm.value.trim()) {
    console.log('搜索关键词:', searchTerm.value)
  }
}

const goToDetail = (srv) => {
  router.push(`/productlist?category=${srv.parent_id}&category2=${srv.id}`)
}
</script>

<style scoped>
.text-primary {
  color: #165dff;
}
.bg-leftBg {
  background: #f5f7fa;
}
.bg-rightBg {
  background: #ffffff;
}
.text-textDark {
  color: #333333;
}
.text-textGray {
  color: #999999;
}
.bg-cardBg {
  background: #f9fafc;
}
.border-borderGray {
  border-color: #e5e6eb;
}
.nav-item-active {
  color: #165dff;
  background: #fff;
  border-left: 2px solid #165dff;
  font-weight: 500;
}
.service-card {
  transition: all 0.2s;
}
.service-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px 0 rgba(22, 93, 255, 0.08);
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
