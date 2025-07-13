<template>
  <Teleport to="body">
    <div v-if="showAgreement" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- 遮罩层 -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click.self="showAgreement = false"></div>
      <!-- 弹窗内容 -->
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden animate-fadeInUp">
        <!-- 关闭按钮 -->
        <button class="absolute top-3 right-3 text-gray-400 hover:text-primary text-xl z-10" @click="showAgreement = false">
          &times;
        </button>
        <div class="p-6">
          <div class="text-center mb-4">
            <h2 class="text-xl font-bold text-gray-800">用户服务协议</h2>
          </div>
          <div class="max-h-[60vh] overflow-y-auto pr-2 mb-6">
            <p class="mb-4">欢迎使用我们的服务！在使用我们的服务之前，请仔细阅读以下服务协议。</p>
            <h3 class="font-semibold mt-4 mb-2">一、服务条款的接受</h3>
            <p class="mb-2">1.1 当您注册成为我们的用户，或使用我们提供的服务时，即表示您已阅读、理解并同意接受本服务条款的所有内容。</p>
            <p>1.2 我们有权在必要时修改本服务条款，修改后的条款将通过网站公告或其他适当方式通知您。如果您不同意修改后的条款，应立即停止使用我们的服务。</p>
            <h3 class="font-semibold mt-4 mb-2">二、服务内容</h3>
            <p class="mb-2">2.1 我们将通过网站、移动应用等多种平台向您提供各种服务，包括但不限于信息发布、在线交易、社交互动等。</p>
            <p>2.2 我们保留随时变更、中断或终止部分或全部服务的权利，且无需对您或任何第三方承担任何责任。</p>
            <h3 class="font-semibold mt-4 mb-2">三、用户账号</h3>
            <p class="mb-2">3.1 您在使用我们的服务时，可能需要注册一个账号。您应确保提供的注册信息真实、准确、完整且及时更新。</p>
            <p>3.2 您应对您的账号和密码安全负责，并且对您账号下的所有活动和行为承担全部责任。</p>
            <h3 class="font-semibold mt-4 mb-2">四、用户行为规范</h3>
            <p class="mb-2">4.1 您在使用我们的服务时，不得从事任何违法、违规或侵犯他人合法权益的行为。</p>
            <p>4.2 您不得利用我们的服务制作、发布、传播任何虚假、有害、侮辱性、诽谤性或违反公序良俗的信息。</p>
            <h3 class="font-semibold mt-4 mb-2">五、隐私政策</h3>
            <p class="mb-2">5.1 我们尊重您的隐私，将按照隐私政策收集、使用和保护您的个人信息。</p>
            <p>5.2 您使用我们的服务即表示您同意我们按照隐私政策的规定处理您的个人信息。</p>
            <h3 class="font-semibold mt-4 mb-2">六、免责声明</h3>
            <p class="mb-2">6.1 我们的服务是按"现状"和"可得到"的基础提供的，我们不保证服务的连续性、安全性、准确性等。</p>
            <p>6.2 在任何情况下，我们对因您使用或无法使用我们的服务而导致的任何损害，包括但不限于直接、间接、偶然、特殊或惩罚性损害，均不承担责任。</p>
            <h3 class="font-semibold mt-4 mb-2">七、适用法律和争议解决</h3>
            <p class="mb-2">7.1 本服务条款的解释、效力和执行适用中华人民共和国法律。</p>
            <p>7.2 如双方就本服务条款发生争议，应首先通过友好协商解决；协商不成的，任何一方均有权向有管辖权的人民法院提起诉讼。</p>
            <p class="mt-4">请仔细阅读上述条款，如您同意，请点击"同意并继续"按钮。</p>
          </div>
          <div class="flex justify-end space-x-4">
            <button @click="handleDisagree" class="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-custom">
              不同意
            </button>
            <button @click="handleAgree" class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-custom shadow-md hover:shadow-lg">
              同意并继续
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useToast } from 'vue-toast-notification'

const emit = defineEmits(['close'])

// 控制协议弹窗显示状态
const showAgreement = ref(true)

// Toast 实例
const toast = useToast()

// 处理同意协议
const handleAgree = () => {
  showAgreement.value = false
  toast.success('感谢您同意我们的服务协议！')
  emit('close',true)
}

// 处理不同意协议
const handleDisagree = () => {
  showAgreement.value = false
  toast.warning('很遗憾，您需要同意服务协议才能继续使用我们的服务。')
  emit('close',false)
}
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUp {
  animation: fadeInUp 0.3s cubic-bezier(0.4,0,0.2,1);
}
</style>    