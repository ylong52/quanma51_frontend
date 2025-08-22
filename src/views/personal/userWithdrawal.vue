<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="max-w-md mx-auto w-full p-4">
      <!-- 头部 -->
      <div class="flex items-center bg-white shadow px-3 py-3 mb-4 fixed top-0 left-0 right-0 z-20 max-w-md mx-auto w-full">
        <a @click="$router.back()" class="text-gray-500 text-lg mr-2 cursor-pointer">
          <font-awesome-icon :icon="'arrow-left'" />
        </a>
        <div class="flex-1 text-center text-lg font-bold text-gray-800">提现管理</div>
        <div class="flex items-center space-x-3">
          <router-link to="/personal/rechargelist" class="text-gray-500 text-lg">
            <font-awesome-icon :icon="'wallet'" />
          </router-link>
          <router-link to="/personal/index" class="text-gray-500 text-lg">
            <font-awesome-icon :icon="'user'" />
          </router-link>
        </div>
      </div>
      
      <!-- 登录检查 -->
      <div v-if="!isLoggedIn" class="flex items-center justify-center h-screen">
        <Login :show="showLoginPopup" @close="onLoginClose" />
      </div>
      <div v-else>
      
      <!-- 提示信息 -->
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md mb-4 mt-12">
        <div class="flex items-center">
          <font-awesome-icon :icon="'exclamation-circle'" class="text-yellow-500 mr-2" />
          <div class="text-sm text-gray-700">
            <p>为保障资金安全，提现将在1-2个工作日内处理，请耐心等待。</p>
            <p>选择微信提现，请在24小时处理。否则会作废，要重新操作提现</p>
          </div>
        </div>
      </div>
      
      <!-- 提现申请卡片 -->
      <div class="bg-white rounded-xl shadow mb-4 mt-1">
        <div class="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer select-none" @click="showForm = !showForm">
          <font-awesome-icon :icon="'credit-card'" class="text-orange-500 mr-2" />
          <span class="font-bold">提现申请</span>
          <font-awesome-icon :icon="showForm ? 'chevron-up' : 'chevron-down'" class="ml-auto text-gray-400 transition-transform" />
        </div>
        <div v-show="showForm" class="px-4 py-4">
          <div class="mb-4">
            <label class="block text-sm mb-1">提现金额*(最大免审金额为：{{ userBalanceInfo.recharge_fees }}元)</label>
            <div class="relative">
              <font-awesome-icon :icon="'yen-sign'" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <el-input type="number" class="w-full pl-8 pr-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-orange-400 text-base" :max="amount_max" placeholder="请输入提现金额" v-model="withdrawalAmount"   />
            </div>
            <p class="text-xs text-gray-400 mt-1">当前可提现余额: {{ userBalanceInfo.balance }}元</p>
          </div>
          <div class="mb-4">
            <div v-if="accountInfo.alipay == '' && accountInfo.wechat == ''">
              <label class="text-red-500 text-sm mb-1"> 请先前往个人中心绑定提现账户</label>
            </div>
            <div v-else>
              <el-select v-model="paymentMethod" placeholder="请选择提现方式" size="small" style="width: 100%" @change="handlePaymentMethodChange">
                
                <el-option label="微信" value="wechat" v-if="accountInfo.wechat != ''"></el-option>
                <el-option label="支付宝" value="alipay" v-if="accountInfo.alipay != ''"></el-option>
              </el-select>
            </div>
          </div>
          
          <button 
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded mt-2 flex items-center justify-center withdrawal-button" 
            @click="hasAccountBinding ? handleWithdrawalClick() : $router.push('/personal/payment-binding')"
            :disabled="userBalanceInfo.balance <= 0 || withdrawalLoading"
            :class="{
              'bg-black-400 hover:bg-black-400': userBalanceInfo.balance <= 0,
              'bg-gray-400 hover:bg-gray-400 cursor-not-allowed': withdrawalLoading
            }"
          >
            <font-awesome-icon :icon="withdrawalLoading ? 'spinner' : 'paper-plane'" :class="{'animate-spin': withdrawalLoading}" class="mr-2" />
            {{
              withdrawalLoading
                ? '正在提交...'
                : (userBalanceInfo.balance <= 0
                    ? '余额为0不能提现'
                    : (hasAccountBinding ? '提交提现申请' : '请先绑定提现账户'))
            }}
          </button>
           
        </div>
      </div>
      <!-- 提现记录卡片 -->
      <div class="bg-white rounded-xl shadow mb-4">
        <div class="flex items-center px-4 py-3 border-b border-gray-100">
          <font-awesome-icon :icon="'history'" class="text-blue-500 mr-2" />
          <span class="font-bold">提现记录</span>
          <button 
            @click="debouncedRefreshData" 
            class="ml-auto text-blue-500 hover:text-blue-600 p-1 rounded"
            :disabled="loading"
          >
            <font-awesome-icon :icon="loading ? 'spinner' : 'sync'" :class="{'animate-spin': loading}" />
          </button>
        </div>
        <div class="px-4 py-4">
          <!-- 搜索和日期选择 -->
          <div class="mb-3">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-select v-model="status" placeholder="提现状态" clearable size="small" style="width: 100%">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="待处理" value="0"></el-option>
                  <el-option label="已到账" value="1"></el-option>
                  <el-option label="失败" value="2"></el-option>
                  <el-option label="未确认收款" value="3"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-input v-model="withdrawalId" placeholder="提现单号" clearable size="small"></el-input>
              </el-col>
              <el-col :span="8">
                <div class="flex space-x-1">
                  <el-button type="primary" @click="debouncedHandleQuery" size="small">
                    <font-awesome-icon :icon="'search'" class="mr-1" /> 查询
                  </el-button>
                  <!-- <el-button @click="resetFilters" size="small">
                    <font-awesome-icon :icon="'sync'" class="mr-1" /> 重置
                  </el-button> -->
                </div>
              </el-col>
            </el-row>
          </div>
          
          <!-- 提现记录列表 -->
          <div v-loading="loading">
            <!-- 使用卡片式详情展示替代表格 -->
            <div v-if="filteredData.length > 0">
              <div v-for="(item, index) in filteredData" :key="index" class="bg-white rounded-lg shadow-sm mb-2 overflow-hidden">
                <!-- 卡片头部：序号、单号和状态 -->
                <div class="flex justify-between items-center p-2 border-b border-gray-100">
                  <div class="flex items-center">
                    <span class="text-xs bg-gray-100 text-gray-600 rounded px-1 mr-1">{{ index + 1 }}</span>
                    <span class="text-xs font-medium  " style="max-width: 120px;">{{ item.withdrawal_no }}</span>
                  </div>
                  <div class="flex items-center">
                    <span v-if="item.withdrawal_status === 0" class="text-xs bg-yellow-100 text-yellow-600 rounded px-1 py-0.5">待处理</span>
                    <span v-else-if="item.withdrawal_status === 1" class="text-xs bg-green-100 text-green-600 rounded px-1 py-0.5">已到账</span>
                    <span v-else-if="item.withdrawal_status === 2" class="text-xs bg-red-100 text-red-600 rounded px-1 py-0.5">失败</span>
                    <span v-else-if="item.withdrawal_status === 3" class="text-xs bg-red-100 text-red-600 rounded px-1 py-0.5 flex items-center cursor-pointer" @click="handleWechatConfirm(item)">
                      <font-awesome-icon v-if="wechatConfirmLoading === item.id" :icon="'spinner'" class="animate-spin mr-1" />
                      {{ wechatConfirmLoading === item.id ? '处理中...' : '微信待收款确认' }}
                    </span>
                  </div>
                </div>
                
                <!-- 卡片内容：一行显示所有信息 -->
                <div class="p-2">
                  <div class="grid grid-cols-4 gap-1">
                    <!-- 金额 -->
                    <div>
                      <div class="text-xs text-gray-500">金额</div>
                      <div class="text-sm text-orange-500 font-bold">¥{{ item.amount }}</div>
                    </div>
                 
                    <!-- 提现方式和账号 -->
                    <div>
                      <div class="text-xs text-gray-500">账户</div>
                      <div class="text-xs">
                        <span v-if="item.withdrawal_type == 1">支付宝</span>
                        <span v-else-if="item.withdrawal_type == 2">微信</span>
                        
                      </div>
                    </div>
                    
                    <!-- 时间 -->
                    <div>
                      <div class="text-xs text-gray-500">时间</div>
                      <div class="text-xs text-gray-600">{{ item.withdrawal_time }}</div>
                    </div>
                    
                    <!-- 操作按钮 -->
                    <div class="flex justify-end items-end">
                      <button 
                        v-if="item.withdrawal_status === 0 || item.withdrawal_status === 2" 
                        @click="debouncedDeleteWithdrawal(item)" 
                        class="text-red-500 text-xs flex items-center bg-gray-50 rounded px-2 py-1"
                      >
                        <font-awesome-icon :icon="'trash'" class="mr-1" />
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 无数据状态 -->
            <div v-else class="text-center py-5 bg-white rounded-lg shadow-sm">
              <font-awesome-icon :icon="'inbox'" class="text-gray-300 text-2xl mb-2" />
              <p class="text-gray-500 text-sm">暂无提现记录</p>
            </div>
          </div>
          
          <!-- 分页控件 -->
          <div class="mt-4 flex justify-center">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 15]"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="total"
              background
              size="small"
              class="pagination-mobile"
            ></el-pagination>
          </div>
          
          <!-- 显示总记录数 -->
          <div class="text-center text-xs text-gray-500 mt-2">
            共 {{ total }} 条记录
          </div>
        </div>
      </div>
      <div class="h-10"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faCreditCard, faChevronDown, faChevronUp, faYenSign, faPaperPlane, faPlus, faHistory, faSearch, faSync, faTrash, faInbox, faExclamationCircle, faArrowLeft, faWallet, faSpinner } from '@fortawesome/free-solid-svg-icons';
library.add(faUser, faCreditCard, faChevronDown, faChevronUp, faYenSign, faPaperPlane, faPlus, faHistory, faSearch, faSync, faTrash, faInbox, faExclamationCircle, faArrowLeft, faWallet, faSpinner);
import * as api from '@/api';
import { useUserStore } from '@/store/user';
import { useToast } from "vue-toast-notification";
import { ElMessage, ElMessageBox } from 'element-plus';
import Login from '@/views/login.vue';
import { useDebounce } from '@/utils/debounce';
import { handleWeixinTransfer } from '@/utils/weixin.js';
// import { WeixinDebugger } from '@/utils/weixinDebug.js';

const userStore = useUserStore();
const toast = useToast();
const searchStatus = ref('all');
const withdrawalAmount = ref(0);
const showForm = ref(false);
const paymentMethod = ref('alipay'); // 默认选择支付宝
const amount_max = userStore.userInfo.balance;
const withdrawalLoading = ref(false); // 提现按钮加载状态

 

// 登录状态管理
const isLoggedIn = computed(() => {
  return userStore.userInfo && userStore.userInfo.isLoggedIn;
});

// 检查是否有账户绑定
const hasAccountBinding = computed(() => {
  return accountInfo.value.alipay !== '' || accountInfo.value.wechat !== '';
});
const showLoginPopup = ref(true);

// 登录窗口关闭处理
const onLoginClose = () => {
  showLoginPopup.value = false;
  // 如果登录成功，isLoggedIn 会自动变为 true
  // 如果登录失败但关闭了窗口，则返回上一页
  if (!isLoggedIn.value) {
    history.back();
  }
};

// 提现记录相关变量
const tableData = ref([]);
const loading = ref(false);
const wechatConfirmLoading = ref(null); // 微信确认按钮的加载状态
// 分页参数
const currentPage = ref(1);
const pageSize = ref(5);
const total = ref(0);
// 筛选条件
const status = ref('');
const withdrawalId = ref('');
const accountInfo = ref({"alipay":"","wechat":""})
const userBalanceInfo = ref({balance:0,recharge_fees:0})
// 获取提现记录
const getWithdrawalRecord = async () => {
  try {
    loading.value = true;
    let res = await api.userWithdrawalList({
      page: currentPage.value,
      pageSize: pageSize.value,
      status: status.value,
      withdrawal_no: withdrawalId.value
    });
    let data = res.list;
    tableData.value = data.data;
    // total,per_page,current_page
    total.value = data.total;
    pageSize.value = data.per_page;
    currentPage.value = data.current_page;
    //
    accountInfo.value.alipay = res.accountInfo.alipay;
    accountInfo.value.wechat = res.accountInfo.wechat;
    userBalanceInfo.value.balance = res.userBalanceInfo.balance;
    userBalanceInfo.value.recharge_fees = res.userBalanceInfo.recharge_fees;
  } catch (error) {
    console.error('获取提现记录失败:', error);
    toast.error('获取提现记录失败');
  } finally {
    loading.value = false;
  }
}

// 计算属性：当前页数据
const filteredData = computed(() => {
  let filtered = tableData.value;
  
  // 状态筛选
  if (status.value !== '') {
    filtered = filtered.filter(item => String(item.withdrawal_status) === String(status.value));
  }
  
  // 提现单号筛选
  if (withdrawalId.value && withdrawalId.value.trim() !== '') {
    filtered = filtered.filter(item => 
      item.withdrawal_no && item.withdrawal_no.toLowerCase().includes(withdrawalId.value.toLowerCase())
    );
  }
  
  return filtered;
});

// 分页方法
const handleSizeChange = (val) => {
  pageSize.value = val;
  getWithdrawalRecord();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  getWithdrawalRecord();
};

// 查询和重置方法
function handleQuery() {
  // 如果有分页，重置到第一页
  currentPage.value = 1;
  // filteredData 会自动响应
}

// 防抖处理后的查询函数
const debouncedHandleQuery = useDebounce(handleQuery, 500);

// 刷新数据函数
const refreshData = async () => {
  try {
    toast.info('正在刷新...', {
      duration: 1000,
      position: 'top'
    });
    await getWithdrawalRecord();
    toast.success('刷新成功', {
      duration: 2000,
      position: 'top'
    });
  } catch (error) {
    console.error('刷新失败:', error);
    toast.error('刷新失败', {
      duration: 2000,
      position: 'top'
    });
  }
};

// 防抖处理后的刷新函数
const debouncedRefreshData = useDebounce(refreshData, 1000);

const resetFilters = () => {
  status.value = '';
  withdrawalId.value = '';
};

// 删除提现记录
const deleteWithdrawal = (row) => {
  // 获取状态文本
  const statusText = row.withdrawal_status === 0 ? '待处理' : '失败';
  
  // 删除提现记录
  ElMessageBox.confirm(
    `确定要删除${statusText}状态的提现记录吗？<br/>
    <strong>提现单号：</strong>${row.withdrawal_no}<br/>
    <strong>提现金额：</strong>¥${row.amount}<br/>
    <strong>申请时间：</strong>${row.withdrawal_time}<br/>
    <strong>当前状态：</strong>${statusText}<br/><br/>
    删除后无法恢复，请谨慎操作！`,
    '确认删除',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true
    }
  ).then(async () => {
    try {
      await api.deleteUserWithdrawal(row.id);
      toast.success('删除成功');
      // 刷新余额
      getuserBalance();
      // 重新获取数据
      getWithdrawalRecord();
    } catch (error) {
      console.error('删除失败:', error);
      toast.error('删除失败');
    }
  }).catch(() => {
    // 用户取消删除
    toast.info('已取消删除');
  });
};

// 防抖处理后的删除函数
const debouncedDeleteWithdrawal = useDebounce(deleteWithdrawal, 1000);

const handleWithdrawal = async () => {
  //判断是否有输入项
  if (withdrawalAmount.value == '' || withdrawalAmount.value == 0) {
    toast.error('请输入提现金额');
    return;
  }

  // 检查提现金额是否为有效数字
  if (isNaN(withdrawalAmount.value) || withdrawalAmount.value <= 0) {
    toast.error('请输入有效的提现金额');
    return;
  }

  // 检查提现金额是否超过余额
  if (withdrawalAmount.value > userBalanceInfo.value.balance) {
    toast.error('提现金额不能超过当前余额');
    return;
  }

  // 检查提现金额是否超过最大免审金额
  if (withdrawalAmount.value > userBalanceInfo.value.recharge_fees) {
    toast.error(`提现金额不能超过最大免审金额：${userBalanceInfo.value.recharge_fees}元`);
    return;
  }

  if (paymentMethod.value == '') {
    toast.error('请选择提现方式');
    return;
  }

  try {
    const res = await api.createUserWithdrawal({      
      amount: withdrawalAmount.value - 0,  
      payment_method:paymentMethod.value 
    });
    
    if (res.status == 'success') {
      // getuserBalance();
      getWithdrawalRecord();
      // 清空提现金额
      withdrawalAmount.value = 0;
      // toast.success(res.msg);
      //ElMessageBox 提示，用户点确，才能关闭
      ElMessageBox.alert(res.msg, '提示', {
        confirmButtonText: '确定',
        type: 'success',
        dangerouslyUseHTMLString: true
      });
    }
  } catch (error) {
    console.error('提现申请失败:', error);
    toast.error('提现申请失败，请稍后再试');
  }
}

// 提现按钮点击处理函数
const handleWithdrawalClick = async () => {
  if (withdrawalLoading.value) {
    return; // 如果正在加载，直接返回，防止重复点击
  }
  
  withdrawalLoading.value = true; // 设置加载状态
  
  try {
    await handleWithdrawal();
  } finally {
    withdrawalLoading.value = false; // 无论成功还是失败，都要重置加载状态
  }
}

// 防抖处理后的提现函数
const debouncedHandleWithdrawal = useDebounce(handleWithdrawal, 3000);

const getuserBalance = async () => {
  try {
    const res = await api.getUserBalance()
    userStore.setBalance(res.balance)  
  } catch (error) {
    console.error('获取用户余额失败:', error);
  }
}

// 监听搜索输入变化
watch(withdrawalId, (newVal) => {
  // 当搜索内容变化时，可以触发查询
  console.log('搜索内容变化:', newVal);
});

// 监听登录状态变化
watch(isLoggedIn, (newVal) => {
  if (newVal === true) {
    // 用户登录后加载数据
    getuserBalance();
    getWithdrawalRecord();
  }
});

onMounted(() => {
  // 只有在用户已登录的情况下才加载数据
  if (isLoggedIn.value) {
    // getuserBalance();
    // accountGetOne();
    getWithdrawalRecord(); // 加载提现记录
  }
});

 

// const account = ref("");
//   const accountGetOne = async () => {
//   try {
//     const res = await api.accountGetOne() 
 
//     // 检查res和res.data是否存在
//     if (!res || !res.data) {
//       account.value = "";
//       return false;
//     }
    
//     if (res.data.use_accounttype == 0) {
//       //弹出未绑定提现账户
//       //toast.error('请前往个人中心，请先绑定提现账户');
//       account.value = "";
//       return false;
//     }
//     if (res.data.use_accounttype == 2 && (!res.data.wx_openid || res.data.wx_openid == '')) {
//       //弹出未绑定提现账户
//       // toast.error('请前往个人中心，请先绑定提现账户');
//       account.value = "";
//       return false;
//     }
//     if (res.data.use_accounttype == 1 && (res.data.alipay_account_number==null || res.data.alipay_account_number == '')) {
//       //弹出未绑定提现账户
//       // toast.error('请前往个人中心，请先绑定提现账户');
//       account.value = "";
//       return false;
//     }
//     account.value = res.data.use_accounttype;
//     if (res.data.use_accounttype == 2) {
//       let opend_id = res.data.wx_openid; //只显示前4位和后4位
//       opend_id = opend_id.substring(0, 4) + '****' + opend_id.substring(opend_id.length - 4);
//       account.value = "微信：" + opend_id;
//     }
//     if (res.data.use_accounttype == 1) {
//       account.value = "支付宝：".concat(res.data.alipay_account_number || '');
//     }
//     return true;
//   } catch (error) {
//     console.error('获取账户信息失败:', error);
//     account.value = "";
//     return false;
//   }
// }
// const wxPageData = ref({})

// 显示状态信息
const showStatus = (message, type = 'info') => {
  if (type === 'success') {
    toast.success(message)
  } else if (type === 'error') {
    toast.error(message)
  } else {
    toast.info(message)
  }
}

// 检查转账状态
const checkTransferStatus = async (transferId) => {
  try {
    console.log('检查转账状态...', transferId)
    // 可以调用API检查转账状态
    const res = await api.wxcheckTransferStatus(transferId)
  } catch (error) {
    console.error('检查转账状态失败:', error)
  }
}

const handleWechatConfirm = async (item) => {
  console.log('520 微信待收款确认:', item)
  
  // 设置加载状态
  wechatConfirmLoading.value = item.id;
  
  try {
    // 检查微信环境和转账支持
    // WeixinDebugger.checkEnvironment()
    // const transferSupport = WeixinDebugger.checkTransferSupport()
    
    // 简化环境检查，移除调试信息
    const isWeixin = navigator.userAgent.toLowerCase().includes('micromessenger')
    const hasWx = !!(window.wx || window.WeixinJSBridge)
    
    if (!isWeixin || !hasWx) {
      showStatus('请在微信中打开', 'error')
      return
    }
    
    // 使用工具类处理微信转账
    const result = await handleWeixinTransfer(item, (data) => api.userWithdrawalWechatConfirm(data))
    
    if (result.success) {
      showStatus('确认请求已发送，请查看微信支付账单', 'success')
      // 保存转账ID用于后续状态检查
      // wxPageData.value.transferId = result.transferId
      // 可以在这里轮询检查转账状态
      // checkTransferStatus(result.transferId)
      await api.wxcheckTransferStatus({"transferId":result.transferId})
      await getWithdrawalRecord();
    } else {
      // 如果是签名错误，提供更详细的调试信息
      if (result.originalError && result.originalError.includes('invalid signature')) {
        console.error('签名验证失败，请检查服务器配置')
        showStatus('微信配置失败，请联系客服', 'error')
      } else {
        showStatus(result.error, 'error')
      }
    }
    
  } catch (error) {
    console.error('微信确认处理失败:', error)
    
    // 生成调试信息
    // WeixinDebugger.generateDebugInfo({}, error)
    
    showStatus('处理失败，请重试', 'error')
  } finally {
    // 重置加载状态
    wechatConfirmLoading.value = null;
  }
}


const handlePaymentMethodChange=()=>{
  console.log('提现方式变化:', paymentMethod.value)
}


</script>

<style scoped>
/* 添加必要的样式 */
.text-success {
  color: #52c41a;
}

.text-danger {
  color: #ff4d4f;
}

.text-warning {
  color: #faad14;
}

.text-primary {
  color: #1890ff;
}

.font-weight-bold {
  font-weight: 600;
}

/* 移动端表格样式优化 */
:deep(.el-table) {
  font-size: 12px;
}

:deep(.el-table th) {
  padding: 5px 0;
}

:deep(.el-table td) {
  padding: 5px 0;
}

/* 移动端分页样式优化 */
.pagination-mobile {
  width: 100%;
  display: flex;
  justify-content: center;
}

:deep(.el-pagination .el-pager li) {
  min-width: 24px;
}

/* 卡片阴影效果 */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* 确保内容不会溢出容器 */
.overflow-hidden {
  overflow: hidden;
}
</style>