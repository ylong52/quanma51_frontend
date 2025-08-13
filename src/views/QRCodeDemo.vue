<template>
  <div class="qrcode-demo">
    <h1>Vue3 二维码生成演示</h1>
    
    <!-- 基础用法 -->
    <section class="demo-section">
      <h2>基础用法</h2>
      <div class="demo-item">
        <QRCode :value="basicText" />
        <div class="demo-info">
          <p>文本: {{ basicText }}</p>
          <input v-model="basicText" placeholder="输入文本" class="demo-input" />
        </div>
      </div>
    </section>

    <!-- 自定义样式 -->
    <section class="demo-section">
      <h2>自定义样式</h2>
      <div class="demo-item">
        <QRCode 
          :value="customText" 
          :size="300"
          :foreground="customColor"
          :background="customBgColor"
          :margin="4"
        />
        <div class="demo-info">
          <p>文本: {{ customText }}</p>
          <input v-model="customText" placeholder="输入文本" class="demo-input" />
          <div class="color-controls">
            <label>
              前景色:
              <input v-model="customColor" type="color" />
            </label>
            <label>
              背景色:
              <input v-model="customBgColor" type="color" />
            </label>
          </div>
        </div>
      </div>
    </section>

    <!-- 不同尺寸 -->
    <section class="demo-section">
      <h2>不同尺寸</h2>
      <div class="size-demo">
        <div class="size-item">
          <h4>小尺寸 (100px)</h4>
          <QRCode :value="sizeText" :size="100" />
        </div>
        <div class="size-item">
          <h4>中尺寸 (200px)</h4>
          <QRCode :value="sizeText" :size="200" />
        </div>
        <div class="size-item">
          <h4>大尺寸 (300px)</h4>
          <QRCode :value="sizeText" :size="300" />
        </div>
      </div>
      <input v-model="sizeText" placeholder="输入文本" class="demo-input" />
    </section>

    <!-- 错误纠正级别 -->
    <section class="demo-section">
      <h2>错误纠正级别</h2>
      <div class="error-level-demo">
        <div class="level-item">
          <h4>L - 低 (7%)</h4>
          <QRCode :value="errorText" :error-correction-level="'L'" />
        </div>
        <div class="level-item">
          <h4>M - 中 (15%)</h4>
          <QRCode :value="errorText" :error-correction-level="'M'" />
        </div>
        <div class="level-item">
          <h4>Q - 高 (25%)</h4>
          <QRCode :value="errorText" :error-correction-level="'Q'" />
        </div>
        <div class="level-item">
          <h4>H - 最高 (30%)</h4>
          <QRCode :value="errorText" :error-correction-level="'H'" />
        </div>
      </div>
      <input v-model="errorText" placeholder="输入文本" class="demo-input" />
    </section>

    <!-- 下载功能 -->
    <section class="demo-section">
      <h2>下载功能</h2>
      <div class="download-demo">
        <QRCode ref="downloadQR" :value="downloadText" />
        <div class="demo-info">
          <input v-model="downloadText" placeholder="输入要下载的文本" class="demo-input" />
          <button @click="downloadQRCode" class="download-btn">下载二维码</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QRCode from '@/components/QRCode.vue'

const basicText = ref('https://www.example.com')
const customText = ref('自定义样式二维码')
const customColor = ref('#FF6B6B')
const customBgColor = ref('#F7F7F7')
const sizeText = ref('不同尺寸演示')
const errorText = ref('错误纠正级别演示')
const downloadText = ref('可下载的二维码')

const downloadQR = ref(null)

const downloadQRCode = () => {
  if (downloadQR.value) {
    downloadQR.value.download()
  }
}
</script>

<style scoped>
.qrcode-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.demo-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-top: 20px;
}

.demo-info {
  flex: 1;
}

.demo-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 14px;
}

.color-controls {
  margin-top: 15px;
}

.color-controls label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
}

.color-controls input[type="color"] {
  margin-left: 10px;
  width: 50px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.size-demo {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.size-item {
  text-align: center;
}

.size-item h4 {
  margin-bottom: 10px;
  color: #666;
}

.error-level-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.level-item {
  text-align: center;
}

.level-item h4 {
  margin-bottom: 10px;
  color: #666;
}

.download-demo {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-top: 20px;
}

.download-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
}

.download-btn:hover {
  background-color: #218838;
}

@media (max-width: 768px) {
  .demo-item {
    flex-direction: column;
  }
  
  .size-demo {
    flex-direction: column;
  }
  
  .error-level-demo {
    grid-template-columns: 1fr;
  }
  
  .download-demo {
    flex-direction: column;
  }
}
</style>
