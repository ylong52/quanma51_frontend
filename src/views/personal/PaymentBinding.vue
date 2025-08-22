<template>
  <el-config-provider :locale="zhCn">
    <div class="min-h-screen bg-gray-100 flex flex-col">
      <div class="max-w-md mx-auto w-full p-4">
        <!-- 头部 -->
        <div class="flex items-center bg-white shadow px-3 py-3 mb-4 fixed top-0 left-0 right-0 z-20 max-w-md mx-auto w-full">
          <a @click="$router.back()" class="text-gray-500 text-lg mr-2 cursor-pointer">
            <font-awesome-icon :icon="'arrow-left'" />
          </a>
          <div class="flex-1 text-center text-lg font-bold text-gray-800">账户绑定</div>
        </div>

        <!-- 页面标题 -->
        <div class="mb-6 mt-16">
          <h1 class="text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-center mb-2">账户绑定</h1>
          <p class="text-gray-500 text-sm text-center">绑定用于退款的支付账户</p>
        </div>
        
          <div v-if="currentPayment === '0'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
           <div class="flex items-center">
             <font-awesome-icon :icon="'info-circle'" class="text-yellow-500 mr-2" />
             <span class="text-yellow-700 font-medium">您还没有选择退款收款方式</span>
           </div>
         </div>
         
        <!-- 支付宝绑定卡片 -->
        <div class="bg-white rounded-xl shadow mb-6 overflow-hidden transition-all duration-300">
          <div class="p-4 flex justify-between items-center cursor-pointer" @click="toggleAlipay">
            <div class="flex items-center">
              <font-awesome-icon :icon="'credit-card'" class="text-indigo-500 mr-3 text-xl" />
              <h2 class="font-semibold text-lg">支付宝</h2>
            </div>
            <button class="text-gray-500 hover:text-indigo-500 transition-colors">
              <font-awesome-icon :icon="'chevron-down'" class="transition-transform duration-300" :class="{'rotate-180': alipayExpanded}" />
            </button>
          </div>
          
          <div v-show="alipayExpanded" class="border-t border-gray-100">
            <!-- 已绑定支付宝信息 -->
            <div v-if="!showAlipayEditForm && alipayAccount" class="p-4">
              <div class="space-y-3">
                <div class="flex items-center">
                  <div class="w-24 text-gray-500">支付宝账户</div>
                  <div class="font-medium">{{ alipayAccount }}</div>
                </div>
                <div class="flex items-center">
                  <div class="w-24 text-gray-500">真实姓名</div>
                  <div class="font-medium">{{ alipayName }}</div>
                </div>
                <!-- <div class="flex items-center">
                  <div class="w-24 text-gray-500">是否当前使用</div>
                  <div class="flex items-center ml-2">
                    <el-radio v-model="currentPayment" label="1" @change="handleAlipayCurrentChange">是</el-radio>
                  </div>
                </div> -->
              </div>
              
              <div class="flex gap-3 mt-4">
                <button @click="handleUnbindAlipay" class="w-1/2 py-2 border border-red-500 text-red-500 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center">
                  <font-awesome-icon :icon="'unlink'" class="mr-2" /> 解绑
                </button>
                <button @click="showAlipayEditForm = true" class="w-1/2 py-2 border border-indigo-500 text-indigo-500 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center">
                  <font-awesome-icon :icon="'edit'" class="mr-2" /> 修改
                </button>
              </div>
            </div>
            
            <!-- 未绑定支付宝 - 显示绑定表单 -->
            <div v-else-if="!alipayAccount" class="p-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">支付宝账户</label>
                <div class="relative">
                  <input 
                    type="text" 
                    v-model="alipayForm.account"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                    placeholder="请输入支付宝账户"
                  >
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">真实姓名</label>
                <div class="relative">
                  <input 
                    type="text" 
                    v-model="alipayForm.name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                    placeholder="请输入真实姓名"
                  >
                </div>
              </div>
              
              <div class="flex gap-3">
                <button @click="debouncedHandleBindAlipay" class="w-full py-2 bg-indigo-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center">
                  <font-awesome-icon :icon="'plus'" class="mr-2" /> 绑定支付宝
                </button>
              </div>
            </div>
            
            <!-- 编辑支付宝表单 -->
            <div v-else class="p-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">支付宝账户</label>
                <div class="relative">
                  <input 
                    type="text" 
                    v-model="alipayForm.account"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                    placeholder="请输入支付宝账户"
                  >
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">真实姓名</label>
                <div class="relative">
                  <input 
                    type="text" 
                    v-model="alipayForm.name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                    placeholder="请输入真实姓名"
                  >
                </div>
              </div>
              
              <div class="flex gap-3">
                <button @click="handleSaveAlipay" class="w-full py-2 bg-indigo-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center">
                  <font-awesome-icon :icon="'check'" class="mr-2" /> 保存修改
                </button>
                <button @click="showAlipayEditForm = false" class="w-1/3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center">
                  <font-awesome-icon :icon="'times'" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 微信绑定卡片 -->
        <div class="bg-white rounded-xl shadow mb-6 overflow-hidden transition-all duration-300">
          <div class="p-4 flex justify-between items-center cursor-pointer" @click="toggleWechat">
            <div class="flex items-center">
              <font-awesome-icon :icon="['fab', 'weixin']" class="text-indigo-500 mr-3 text-xl" />
              <h2 class="font-semibold text-lg">微信</h2>
            </div>
            <button class="text-gray-500 hover:text-indigo-500 transition-colors">
              <font-awesome-icon :icon="'chevron-down'" class="transition-transform duration-300" :class="{'rotate-180': wechatExpanded}" />
            </button>
          </div>
          
          <div v-show="wechatExpanded" class="border-t border-gray-100">
            <!-- 已绑定微信信息 -->
            <div v-if="isShowWechat" class="p-4">
              <div class="space-y-3">
                <!-- 编辑表单 -->
                <div v-if="showWechatEditForm" class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">真实姓名</label>
                  <div class="relative">
                    <input 
                      type="text" 
                      v-model="wechatForm.name"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                      placeholder="请输入真实姓名"
                    >
                  </div>
                </div>
                
                <!-- 显示信息 -->
                <div v-else>
                  <div class="flex items-center mb-2">
                    <div class="w-24 text-gray-500">真实姓名</div>
                    <div class="font-medium">{{ wechatForm.name || '未设置' }}</div>
                  </div>
                </div>
 
                <div class="flex items-center">
                  <div class="w-24 text-gray-500">微信账户</div>
                  <div class="font-medium">{{ wechatAccount }}</div>
                </div>
                <!-- <div class="flex items-center">
                  <div class="w-24 text-gray-500">是否当前使用</div>
                  <div class="flex items-center ml-2">
                    <el-radio v-model="currentPayment" label="2" @change="handleWechatCurrentChange">是</el-radio>
                  </div>
                </div> -->
              </div>

              <!-- 编辑模式下的按钮 -->
              <div v-if="showWechatEditForm" class="flex gap-3 mt-4">
                <button @click="debouncedHandleSaveWechat" class="w-full py-2 bg-indigo-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center">
                  <font-awesome-icon :icon="'check'" class="mr-2" /> 保存修改
                </button>
                
                <button @click="showWechatEditForm = false" class="w-1/3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center">
                  <font-awesome-icon :icon="'times'" />
                </button>
              </div>
              
              <!-- 非编辑模式下的按钮 -->
              <div v-else class="flex gap-3 mt-4">
                <button @click="showWechatEditForm = true" class="w-1/2 py-2 border border-indigo-500 text-indigo-500 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center">
                  <font-awesome-icon :icon="'edit'" class="mr-2" /> 修改
                </button>
                
                <button @click="handleUnbindWechat" class="w-1/2 py-2 border border-red-500 text-red-500 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center">
                  <font-awesome-icon :icon="'unlink'" class="mr-2" /> 解绑
                </button>
              </div>
            </div>
            
            <!-- 未绑定微信 - 只有在没有wx_openid时才显示绑定按钮 -->
            <div v-else class="p-4">
              <div class="text-center py-8">
                <font-awesome-icon :icon="['fab', 'weixin']" class="text-gray-400 text-4xl mb-4" />
                <p class="text-gray-500 mb-4">暂未绑定微信账户</p>
                <button @click="handleWechatBind" class="py-2 px-4 bg-green-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center mx-auto">
                  <font-awesome-icon :icon="['fab', 'weixin']" class="mr-2" /> 绑定微信
                </button>
              </div>
            </div>
          </div>
        </div>
        
 
        
        <!-- 帮助提示 -->
        <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-20">
          <h3 class="font-medium text-indigo-500 mb-2 flex items-center">
            <font-awesome-icon :icon="'info-circle'" class="mr-2" /> 温馨提示
          </h3>
          <ul class="text-sm text-gray-600 space-y-1">
            <li class="flex items-start">
              <font-awesome-icon :icon="'check-circle'" class="text-green-500 mt-0.5 mr-2" />
              <span>请确保您填写的账户信息与本人身份信息一致</span>
            </li>
            <li class="flex items-start">
              <font-awesome-icon :icon="'check-circle'" class="text-green-500 mt-0.5 mr-2" />
              <span>退款将原路返回，绑定后不可修改，请谨慎操作</span>
            </li>
            <li class="flex items-start">
              <font-awesome-icon :icon="'check-circle'" class="text-green-500 mt-0.5 mr-2" />
              <span>当前使用账户将用于优先退款，支付宝和微信只能选择一个</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ElConfigProvider, ElMessage, ElRadio, ElMessageBox } from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faArrowLeft, 
  faCreditCard,
  faChevronDown, 
  faUnlink, 
  faEdit, 
  faCheck, 
  faTimes, 
  faPlus, 
  faSave, 
  faInfoCircle, 
  faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';
import { faWeixin } from '@fortawesome/free-brands-svg-icons';
import * as api from '@/api';
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';
import { useDebounce } from '@/utils/debounce';

// 注册 Font Awesome 图标
library.add(
  faArrowLeft, 
  faCreditCard, 
  faChevronDown, 
  faUnlink, 
  faEdit, 
  faCheck, 
  faTimes, 
  faPlus, 
  faSave, 
  faInfoCircle, 
  faCheckCircle,
  faWeixin
);

// 支付宝相关状态
const alipayAccount = ref('');
const alipayName = ref('');
const alipayAccountId = ref(null);
const alipayExpanded = ref(true);
const showAlipayEditForm = ref(false);

// 支付宝表单
const alipayForm = ref({
  account: '',
  name: ''
});

const wechatForm = ref({
  name: ''
});

// 微信相关状态
const wechatAccount = ref('');
const wechatAccountId = ref(null);
const wechatExpanded = ref(true);
const isShowWechat = ref(false); // 跟踪微信是否已绑定
const showWechatEditForm = ref(false); // 是否显示微信编辑表单

// 当前使用的支付方式 (1-支付宝，2-微信)
const currentPayment = ref('0');

// 切换支付宝卡片展开/折叠
const toggleAlipay = () => {
  alipayExpanded.value = !alipayExpanded.value;
};

// 切换微信卡片展开/折叠
const toggleWechat = () => {
  wechatExpanded.value = !wechatExpanded.value;
};

// 绑定支付宝
const handleBindAlipay = async () => {
  try {
    if (!alipayForm.value.account) {
      return ElMessage.error('支付宝账户不能为空');
    }
    
    if (!alipayForm.value.name) {
      return ElMessage.error('真实姓名不能为空');
    }
    
    const data = {
      alipay_account_number: alipayForm.value.account,
      alipay_real_name: alipayForm.value.name,
       
    };
    
    await api.accountBinding(data);
    
         alipayAccount.value = alipayForm.value.account;
     alipayName.value = alipayForm.value.name;
     alipayForm.value = { account: '', name: '' };
     currentPayment.value = '1'; // 设置为支付宝类型
     
     ElMessage.success('支付宝账户绑定成功');
    
    // 重新获取账户信息
    await initPage();
  } catch (error) {
    console.error('绑定支付宝账户失败:', error);
    ElMessage.error(error?.message || '绑定失败，请稍后再试');
  }
};

// 防抖处理后的绑定支付宝函数
const debouncedHandleBindAlipay = useDebounce(handleBindAlipay, 1000);

// 解绑支付宝
const handleUnbindAlipay = async () => {
  try {
    const result = await ElMessageBox.confirm('确定要解绑该支付宝账户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    if (result === 'confirm') {
      if (alipayAccountId.value) {
        await api.accountDelete(1);  //1表示支付宝的类型
      }
      
      // 清空支付宝相关数据，恢复到未绑定状态
      alipayAccount.value = '';
      alipayName.value = '';
      alipayAccountId.value = null;
      showAlipayEditForm.value = false;
      alipayForm.value = { account: '', name: '' };
      
             // 如果当前使用的是支付宝，重置为未绑定
       if (currentPayment.value === '1') {
         currentPayment.value = '0'; // 重置为未绑定
       }
      
      ElMessage.success('支付宝账户解绑成功');
      
      // 重新获取账户信息
      await initPage();
    }
  } catch (error) {
    // 用户取消操作，不做处理
  }
};

// 解绑微信
const handleUnbindWechat = async () => {
  try {
    const result = await ElMessageBox.confirm('确定要解绑该微信账户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    if (result === 'confirm') {
      try {
        // 调用API解绑微信账户
        await api.accountDelete(2);
        
        // 清空微信相关数据
        wechatAccount.value = '';
        wechatAccountId.value = null;
        isShowWechat.value = false; // 重置微信绑定标志，这会触发显示"暂未绑定微信账户"的提示
        showWechatEditForm.value = false; // 关闭编辑表单
        wechatForm.value.name = ''; // 清空微信姓名
        
        // 如果当前使用的是微信，重置为未绑定
        if (currentPayment.value === '2') {
          currentPayment.value = '0'; // 重置为未绑定
        }
        
        ElMessage.success('微信账户解绑成功');
        
        // 重新获取账户信息
        await initPage();
      } catch (error) {
        console.error('解绑微信账户失败:', error);
        ElMessage.error(error?.message || '解绑失败，请稍后再试');
      }
    }
  } catch (error) {
    // 用户取消操作，不做处理
  }
};


// 处理微信绑定
const handleWechatBind = async () => {
   //如果是微信浏览器就转向，没有就弹出提示要在微信上才能绑定微信帐户
   if (navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
    //转到
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${baseUrl}/wechat/auth?user=${userStore.userInfo.username}`;
   } else {
    ElMessage.error('请在微信浏览器上才能绑定微信帐户');
   }  
}


// 处理微信绑定
const handleWechatBind2 = async () => {
  try {
    ElMessage.info('正在绑定微信账户...');
    //转到
  

    // 模拟生成随机的微信openid和用户名
    const mockOpenid = 'wx_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const mockUsername = '微信用户_' + Math.random().toString(36).substring(2, 8);
    
    // 微信绑定数据，不传use_accounttype值
    const data = {
      wx_openid: mockOpenid,
      type: 2 // 2表示微信类型
    };
    
    // 调用绑定接口
    await api.accountBinding(data);
    
         // 模拟绑定成功，更新本地状态
     wechatAccount.value = mockUsername + ' (' + mockOpenid.substring(0, 8) + '****' + mockOpenid.substring(mockOpenid.length - 4) + ')';
     wechatAccountId.value = Date.now(); // 模拟ID
     isShowWechat.value = true; // 设置微信已绑定标志
     currentPayment.value = '2'; // 设置为微信类型
    
    ElMessage.success('微信账户绑定成功');
    
    // 重新获取账户信息
    await initPage();
    
  } catch (error) {
    console.error('微信绑定失败:', error);
    ElMessage.error(error?.message || '微信绑定失败，请稍后再试');
  }
};

// 保存支付宝修改
const handleSaveAlipay = async () => {
  try {
    if (!alipayForm.value.account) {
      return ElMessage.error('支付宝账户不能为空');
    }
    
    if (!alipayForm.value.name) {
      return ElMessage.error('真实姓名不能为空');
    }
    
    const data = {
      alipay_account_number: alipayForm.value.account,
      alipay_real_name: alipayForm.value.name,
      use_accounttype: 1 // 1-支付宝
      // user_id 通常由后端从token中获取，前端不需要传递
    };
    
    await api.accountUpdate(data);
    
         alipayAccount.value = alipayForm.value.account;
     alipayName.value = alipayForm.value.name;
     showAlipayEditForm.value = false;
     currentPayment.value = '1'; // 确保设置为支付宝类型
     ElMessage.success('支付宝账户信息修改成功');
    
    // 重新获取账户信息
    await initPage();
  } catch (error) {
    console.error('修改支付宝账户失败:', error);
    ElMessage.error(error?.message || '修改失败，请稍后再试');
  }
};

// 保存微信姓名
const handleSaveWechat = async () => {
  try {
    if (!wechatForm.value.name.trim()) {
      return ElMessage.warning('请输入真实姓名');
    }
    
    // 调用接口修改微信姓名
    await api.accountModifyWechatName({"wx_real_name":wechatForm.value.name});    
     
    ElMessage.success(`已成功保存微信姓名！`);
    
    // 关闭编辑表单
    showWechatEditForm.value = false;
    
    // 重新获取账户信息以更新界面
    await initPage();
    
  } catch (error) {
    console.error('保存设置失败:', error);
    ElMessage.error(error?.message || '保存失败，请稍后再试');
  }
};

// 防抖处理后的保存微信姓名函数
const debouncedHandleSaveWechat = useDebounce(handleSaveWechat, 1000);


// 支付宝当前使用状态改变
const handleAlipayCurrentChange = async () => {
  try {
    // 直接调用接口修改当前使用的账户类型
    await api.accountModifyUseAccounttype(1);
    
    ElMessage.success('已成功将支付宝设置为当前使用账户！');
    
    // 重新获取账户信息
    await initPage();
  } catch (error) {
    console.error('设置支付宝为当前使用账户失败:', error);
    ElMessage.error(error?.message || '设置失败，请稍后再试');
  }
};

// 微信当前使用状态改变
const handleWechatCurrentChange = async () => {
  try {
    // 直接调用接口修改当前使用的账户类型
    await api.accountModifyUseAccounttype(2);
    
    ElMessage.success('已成功将微信设置为当前使用账户！');
    
    // 重新获取账户信息
    await initPage();
  } catch (error) {
    console.error('设置微信为当前使用账户失败:', error);
    ElMessage.error(error?.message || '设置失败，请稍后再试');
  }
};

// 页面加载时初始化
const initPage = async () => {
  try {
    // 获取已绑定的账户信息
    const response = await api.accountGetOne();
    
    // 检查响应是否有效
    if (!response || !response.data) {
      // 清空所有数据，恢复到原始默认值
      resetAccountData();
      return;
    }
    
    // 设置当前支付方式，如果没有绑定则为0
    if (response.data.use_accounttype) {
      currentPayment.value = response.data.use_accounttype + '';
    } else {
      currentPayment.value = '0'; // 未绑定
    }
    
    // 检查 response.data 是数组还是单个对象
    const accounts = Array.isArray(response.data) ? response.data : [response.data];
    
    // 处理支付宝账户
    if (response.data.alipay_account_number) {
      // 支付宝账户脱敏处理
      let alipayAccountData = response.data;
      const accountNumber = alipayAccountData.alipay_account_number || '';
      alipayAccount.value = accountNumber.length > 4 ? 
        accountNumber.substring(0, 3) + '****' + accountNumber.substring(accountNumber.length - 4) : 
        accountNumber;
      alipayName.value = alipayAccountData.alipay_real_name || '';
      alipayAccountId.value = alipayAccountData.id;
      alipayForm.value = {
        account: alipayAccountData.alipay_account_number || '', // 编辑时显示完整账户
        name: alipayName.value
      };        
    } else {
      // 清空支付宝相关数据
      alipayAccount.value = '';
      alipayName.value = '';
      alipayAccountId.value = null;
      alipayForm.value = { account: '', name: '' };
    }
    
    // 处理微信账户
    if (response.data.wx_openid) {
      // 微信openid通常很长，进行脱敏处理
      const openid = response.data.wx_openid || '';
      wechatAccount.value = openid.length > 10 ? 
        openid.substring(0, 6) + '****' + openid.substring(openid.length - 4) : 
        openid;
     
      isShowWechat.value = true; // 设置微信已绑定标志
      
      // 设置微信名称
      wechatForm.value.name = response.data.wx_real_name || '';
      console.log('微信姓名:', wechatForm.value.name); // 调试输出
    } else {
      // 清空微信相关数据
      wechatAccount.value = '';
      wechatAccountId.value = null;
      isShowWechat.value = false; // 确保微信未绑定标志
      wechatForm.value.name = ''; // 清空微信姓名
    }
    
  } catch (error) {
    console.error('获取支付账户信息失败:', error);
    ElMessage.error('获取账户信息失败，请稍后再试');
    // 出错时重置所有数据
    resetAccountData();
  }
};

// 重置账户数据的辅助函数
const resetAccountData = () => {
  alipayAccount.value = '';
  alipayName.value = '';
  alipayAccountId.value = null;
  alipayForm.value = { account: '', name: '' };
  showAlipayEditForm.value = false;
  
  wechatAccount.value = '';
  wechatAccountId.value = null;
  isShowWechat.value = false; // 重置微信绑定标志
  showWechatEditForm.value = false; // 重置微信编辑表单状态
  wechatForm.value = { name: '' }; // 清空微信表单数据
  
  // 重置当前使用支付方式为默认值
  currentPayment.value = '0';
};

// 用户认证检查
const userStore = useUserStore();
const router = useRouter();

// 检查用户是否已登录
const checkAuth = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token || !userStore.isLoggedIn) {
    ElMessage.error('请先登录');
    router.push('/login');
    return false;
  }
  return true;
};

// 监听当前支付方式变化，确保只能选择一个
watch(currentPayment, (newValue, oldValue) => {
  if (newValue === oldValue) return;
  
  // 如果选择了支付宝，确保微信不被选中
  if (newValue === '1') {
    // 支付宝被选中，微信自动取消选中
    console.log('支付宝被设置为当前使用');
  } else if (newValue === '2') {
    // 微信被选中，支付宝自动取消选中
    console.log('微信被设置为当前使用');
  }
});

// 页面挂载时初始化
onMounted(() => {
  if (checkAuth()) {
    initPage();
  }
});
</script>

<style scoped>
.transition-transform {
  transition: transform 0.3s ease;
}
</style>
