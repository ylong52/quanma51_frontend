<template>
  <div class="qrcode-container">
    <h3>二维码生成器</h3>
    
    <div class="input-section">
      <input 
        v-model="qrText" 
        type="text" 
        placeholder="请输入要生成二维码的文本或URL"
        class="qr-input"
      />
      <button @click="generateQR" class="generate-btn">生成二维码</button>
    </div>
    
    <div class="qrcode-display" v-if="qrCodeUrl">
      <img :src="qrCodeUrl" alt="生成的二维码" class="qrcode-image" />
      <button @click="downloadQR" class="download-btn">下载二维码</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QRCode from 'qrcode'

const qrText = ref('')
const qrCodeUrl = ref('')

const generateQR = async () => {
  if (!qrText.value.trim()) {
    alert('请输入要生成二维码的文本')
    return
  }
  
  try {
    // 生成二维码为Data URL
    const url = await QRCode.toDataURL(qrText.value, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    qrCodeUrl.value = url
  } catch (error) {
    console.error('生成二维码失败:', error)
    alert('生成二维码失败')
  }
}

const downloadQR = () => {
  if (!qrCodeUrl.value) return
  
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = qrCodeUrl.value
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.qrcode-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.input-section {
  margin-bottom: 20px;
}

.qr-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 14px;
}

.generate-btn, .download-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

.generate-btn:hover, .download-btn:hover {
  background-color: #0056b3;
}

.qrcode-display {
  text-align: center;
  margin-top: 20px;
}

.qrcode-image {
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
}
</style>
