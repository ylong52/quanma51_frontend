<template>
  <div class="bg-white rounded-xl shadow-sm p-4 flex-1 overflow-hidden">
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-semibold text-neutral-700">{{ getServiceName }}</h2>
      <div class="flex items-center space-x-2">
        <span class="text-xs text-neutral-500">最近更新: 2025-07-13</span>
        <button class="text-neutral-500 hover:text-primary transition-colors">
          <i class="fa fa-refresh"></i>
        </button>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <component 
      :is="getComponentName"
      class="content-fade"
    ></component>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import DidiContent from './service-content/DidiContent.vue';
import WangchaojiContent from './service-content/WangchaojiContent.vue';
import TuhuContent from './service-content/TuhuContent.vue';
import KfcContent from './service-content/KfcContent.vue';
import MeituanContent from './service-content/MeituanContent.vue';

const props = defineProps({
  activeService: {
    type: String,
    required: true
  }
});

const serviceComponents = {
  didi: DidiContent,
  wangchaoji: WangchaojiContent,
  tuhu: TuhuContent,
  kfc: KfcContent,
  meituan: MeituanContent
};

const serviceNames = {
  didi: '滴滴出行',
  wangchaoji: '霸王茶姬',
  tuhu: '途虎洗车',
  kfc: '肯德基',
  meituan: '美团外卖'
};

const getComponentName = computed(() => {
  return serviceComponents[props.activeService] || DidiContent;
});

const getServiceName = computed(() => {
  return serviceNames[props.activeService] || '未知服务';
});
</script>

<style scoped>
.content-fade {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
    