<template>
  <div class="qr-code-wrapper">
    <canvas ref="qrCanvas" :style="{ display: 'none' }"></canvas>
    <img 
      v-if="qrCodeUrl" 
      :src="qrCodeUrl" 
      :alt="alt"
      :style="{ width: size + 'px', height: size + 'px' }"
      class="qr-code-image"
    />
    <div v-else-if="loading" class="qr-code-loading">
      生成中...
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  // 要编码的文本或URL
  value: {
    type: String,
    required: true
  },
  // 二维码尺寸
  size: {
    type: Number,
    default: 200
  },
  // 二维码边距
  margin: {
    type: Number,
    default: 2
  },
  // 前景色
  foreground: {
    type: String,
    default: '#000000'
  },
  // 背景色
  background: {
    type: String,
    default: '#FFFFFF'
  },
  // 错误纠正级别: 'L', 'M', 'Q', 'H'
  errorCorrectionLevel: {
    type: String,
    default: 'M',
    validator: (value) => ['L', 'M', 'Q', 'H'].includes(value)
  },
  // 图片alt属性
  alt: {
    type: String,
    default: '二维码'
  }
})

const qrCanvas = ref(null)
const qrCodeUrl = ref('')
const loading = ref(false)

const generateQRCode = async () => {
  if (!props.value) {
    qrCodeUrl.value = ''
    return
  }

  loading.value = true
  
  try {
    const options = {
      width: props.size,
      margin: props.margin,
      color: {
        dark: props.foreground,
        light: props.background
      },
      errorCorrectionLevel: props.errorCorrectionLevel
    }

    // 生成二维码为Data URL
    const url = await QRCode.toDataURL(props.value, options)
    qrCodeUrl.value = url
  } catch (error) {
    console.error('生成二维码失败:', error)
    qrCodeUrl.value = ''
  } finally {
    loading.value = false
  }
}

// 监听value变化，重新生成二维码
watch(() => props.value, generateQRCode, { immediate: true })

// 监听配置变化，重新生成二维码
watch([
  () => props.size,
  () => props.margin,
  () => props.foreground,
  () => props.background,
  () => props.errorCorrectionLevel
], generateQRCode)

// 暴露方法给父组件
defineExpose({
  generateQRCode,
  download: () => {
    if (!qrCodeUrl.value) return
    
    const link = document.createElement('a')
    link.download = `qrcode-${Date.now()}.png`
    link.href = qrCodeUrl.value
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
})
</script>

<style scoped>
.qr-code-wrapper {
  display: inline-block;
}

.qr-code-image {
  display: block;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.qr-code-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #666;
  font-size: 14px;
}
</style>
