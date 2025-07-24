<template>
  <div class="content-container overflow-x-hidden">
    <!-- 为固定头部留出空间 -->
    <div class="header-spacer"></div>

    <!-- 广告横幅区 -->
    <div
      class="text-white p-5 mt-3 relative overflow-hidden rounded-xl mx-3 shadow-md section-highlight cursor-pointer" style="background-color: #e1251b;"
      data-section="banner">
      <div class="relative z-10">
        <h2 class="text-xl font-bold mb-3 text-shadow editable-field" data-type="text" data-target="banner-title"><i
            class="fa fa-circle title-icon"></i>超1000种选择 热门视频音乐会员</h2>
        <div class="flex space-x-3 overflow-x-auto pb-2">
          <!-- 卡片式设计 -->
          <div class="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center w-20 flex-shrink-0 card-hover">
            <img src="https://picsum.photos/seed/stream1/40/40" alt="视频平台1"
              class="w-10 h-10 mx-auto rounded-full mb-1 editable-field" data-type="image" data-target="banner-img1">
            <span class="text-xs editable-field" data-type="text" data-target="banner-text1">正版</span>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center w-20 flex-shrink-0 card-hover">
            <img src="https://picsum.photos/seed/stream2/40/40" alt="视频平台2"
              class="w-10 h-10 mx-auto rounded-full mb-1 editable-field" data-type="image" data-target="banner-img2">
            <span class="text-xs editable-field" data-type="text" data-target="banner-text2">推荐</span>

          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center w-20 flex-shrink-0 card-hover">
            <img src="https://picsum.photos/seed/stream3/40/40" alt="视频平台3"
              class="w-10 h-10 mx-auto rounded-full mb-1 editable-field" data-type="image" data-target="banner-img3">
            <span class="text-xs editable-field" data-type="text" data-target="banner-text3">热门</span>

          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center w-20 flex-shrink-0 card-hover">
            <img src="https://picsum.photos/seed/stream4/40/40" alt="视频平台4"
              class="w-10 h-10 mx-auto rounded-full mb-1 editable-field" data-type="image" data-target="banner-img4">
            <span class="text-xs editable-field" data-type="text" data-target="banner-text4">便宜</span>
          </div>
        </div>
      </div>
      <!-- 装饰元素 -->
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
      <div class="absolute -right-5 -bottom-5 w-32 h-32 bg-white/10 rounded-full"></div>
    </div>


    <!-- 餐饮代下区 -->
    <div class="bg-white p-4 mt-3 shadow-sm rounded-xl mx-2 card-shadow section-highlight cursor-pointer"
      data-section="food-service">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-lg editable-field" data-type="text" data-target="food-title"><i
            class="fa fa-circle title-icon"></i>餐饮代下</h3>
        
      </div>
      <div class="flex overflow-x-auto pb-2 space-x-3">
        <!-- 改进的卡片设计 -->
      
        <div class="flex-shrink-0 w-1/4 text-center card-hover"
          v-for="h in hotCategoryList" :key="h.id">
          <div class="bg-gray-100 rounded-xl overflow-hidden mb-1 shadow-sm">
            <img :src="h.img" :alt="h.name" class="w-full h-24 object-cover editable-field"
              data-type="image" data-target="food-img1">
          </div>
          <h4 class="font-medium text-sm truncate editable-field" data-type="text" data-target="food-name1">{{h.name}}</h4>
         
        </div>


      </div>

    </div>
 

    <!-- 分类区 -->
    <div class="bg-white p-4 mt-3 shadow-sm rounded-xl mx-2 card-shadow section-highlight cursor-pointer"   data-section="audio-membership" v-if="categoryList.length > 0" v-for="item in categoryList" :key="item.id">
      <div class="flex  items-center mb-4">
        <span><img :src="item.img" :alt="item.category" class="w-10 h-10 rounded-lg object-cover"></span>
        <h3 class="font-bold text-lg editable-field" data-type="text" data-target="audio-title">
          <i  class="fa fa-circle title-icon" ></i>{{item.category}}</h3>
          <a href="#" class="text-primary text-sm flex items-center editable-field ml-auto" data-type="text"
            data-target="audio-action">
            查看更多 <i class="fa fa-angle-right ml-1"></i>
          </a>
      </div>
      <div class="space-y-3">
        <!-- 改进的列表卡片 -->
        <div class="category-list grid grid-cols-2 sm:grid-cols-3 gap-4">


          <div class="category-card" v-for="item2 in item.children" :key="item2.id">
 
            <div class="category-card flex items-center p-3 border border-gray-100 rounded-xl card-hover">
              <img :src="item2.img" :alt="item2.category"
                class="w-14 h-14 rounded-lg object-cover editable-field" data-type="image" data-target="audio-img1">
              <div class="ml-3 flex-1">
                <h4 class="font-medium text-sm editable-field truncate p-1"
                  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;width:80px;" data-type="text" 
                  data-target="audio-name1" title="">{{item2.category}}</h4>
                <!-- <p class="text-xs text-gray-500 mt-1 editable-field" data-type="text" data-target="audio-desc1">30天无限畅听</p> -->
                <button class="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium editable-field"
                  data-type="text" data-target="audio-button1" @click="goProductList(item2.parent_id,item2.id)">
                  立即购买
                </button>
              </div>
            </div>
          </div>


          <!-- ... -->
        </div>



      </div>
    </div>

    <!-- 为固定底部留出空间 -->
    <div class="footer-spacer"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import * as api from '@/api/index'; 
import { useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
const categoryList = ref([]);

const getCategoryList = async () => {
  const res = await api.getProductCategory();
  categoryList.value = res.data;
};

const hotCategoryList = ref([]);
const getHotCategoryList = async () => {
  const res = await api.getProductCategory({id:1327,child_limit:10});
  hotCategoryList.value = res.data[0]['children'];
};

getCategoryList();
getHotCategoryList();

const goProductList = (parent_id,id) => {
  router.push({
    path: '/productlist',
    query: { category: parent_id, category2: id }
  });
};


</script>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  padding: 0 0.7em 0 0.4em;
  margin-right: 0.3em;
  margin-bottom: 2px;
  background: #f3f4f6;
  color: #e1251b;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.tag i {
  font-size: 13px;
  margin-right: 0.25em;
  color: #e1251b;
}

.tag-official {
  background: #e0f2fe;
  color: #0284c7;
}

.tag-recommend {
  background: #fef9c3;
  color: #b45309;
}

.tag-hot {
  background: #fee2e2;
  color: #dc2626;
}

.section-title {
  font-weight: bold;
  font-size: 18px;
  display: flex;
  align-items: center;
}

.title-icon {
  display: inline-block;
  vertical-align: middle;
  /* 可选：调整颜色和大小 */
  color: #e1251b;
  /* 或 text-primary */
  font-size: 1.25em;
}
</style>