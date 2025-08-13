<template>
  <button 
    @click="handleTransfer"
    :disabled="loading || disabled"
    :class="[
      'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center',
      loading 
        ? 'bg-gray-400 text-white cursor-not-allowed' 
        : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
    ]"
  >
    <font-awesome-icon 
      :icon="loading ? 'spinner' : 'weixin'" 
      :spin="loading" 
      class="mr-2" 
    />
    {{ loading ? '处理中...' : buttonText }}
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faWeixin, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { handleWeixinTransfer } from '@/utils/weixin.js'
import { useToast } from 'vue-toast-notification'

library.add(faWeixin, faSpinner)

const props = defineProps({
  // 转账项目数据
  item: {
    type: Object,
    required: true
  },
  // API调用函数
  apiCall: {
    type: Function,
    required: true
  },
  // 按钮文本
  buttonText: {
    type: String,
    default: '微信确认收款'
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['success', 'error', 'complete'])

const loading = ref(false)
const toast = useToast()

// 处理转账
const handleTransfer = async () => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const result = await handleWeixinTransfer(props.item, (data) => props.apiCall(data))
    
    if (result.success) {
      toast.success('确认请求已发送，请查看微信确认页面')
      emit('success', result)
    } else {
      toast.error(result.error)
      emit('error', result.error)
    }
    
  } catch (error) {
    console.error('微信转账处理失败:', error)
    toast.error('处理失败，请重试')
    emit('error', error.message)
  } finally {
    loading.value = false
    emit('complete')
  }
}
</script>

<style scoped>
/* 按钮样式 */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

button:not(:disabled):hover {
  transform: translateY(-2px);
}
</style>
