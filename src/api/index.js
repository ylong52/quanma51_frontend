import { request } from '@/utils/request';  
 
// 登录模块
export const login = (data) => request.post('/api/login', data);
export const logout = () => request.post('/api/logout');
export const getUserInfo = () => request.get('/api/userinfo');
export const forgotPassword = (data) => request.post('/api/forgotPassword', data);
export const checkToken = () => request.get('/api/checkToken');
 
export const globalconfig = () => request.get('/api/globalconfig');
//获取用户余额
export const getUserBalance = () => request.get('/api/user/balance');

export const getProductCategory = (params) => request.get('/api/product/category',   params );
export const getProductCategoryLevel2 = () => request.get('/api/product/category/level2');

// 用户管理模块
export const getUserList = (params) => request.get('/api/users',  params );
export const register = (data) => request.post('/api/register', data);
export const updateUser = (id, data) => request.put(`/api/users/${id}`, data);
// export const deleteUser = (id) => request.delete(`/api/users/${id}`);

// 商品管理模块
export const getProductList = (params) => request.post('/api/product',  params  );
export const getProductDetail = (id) => request.get(`/api/product/detail/${id}`);

// export const createOrder = (data) => request.post('/api/order/create', data);
// getOrderInfo
export const getOrderInfo = (orderNumber) => request.get(`/api/order/orderinfo/${orderNumber}`);
//payOrder
export const payOrder = (params) => request.post(`/api/order/pay`, params);
//cancelOrder
export const cancelOrder = (orderNumber) => request.post(`/api/order/cancel/${orderNumber}`);

//orderList
export const orderList = (params) => request.post(`/api/order/list`, params);

//rechargeRecord
export const rechargeRecord = (params) => request.post(`/api/recharge/list`, params);
//充值
export const rechargeCreatepay = (params) => request.post(`/api/recharge/createpay`, params);

//userWithdrawalList
export const userWithdrawalList = (params) => request.post(`/api/withdrawal/list`, params);
// createUserWithdrawal
export const createUserWithdrawal = (data) => request.post('/api/withdrawal/create', data);
// deleteUserWithdrawal
export const deleteUserWithdrawal = (id) => request.post(`/api/withdrawal/delete/${id}`);

export const promotionList = (params) => request.post(`/api/promotion/list`, params);

// 修改密码
export const changePassword = (data) => request.post('/api/change-password', data);

// 支付账户绑定相关
export const getPaymentAccounts = () => request.get('/api/payment/accounts');
export const bindPaymentAccount = (data) => request.post('/api/payment/bind', data);
export const unbindPaymentAccount = (type) => request.delete(`/api/payment/unbind/${type}`);
export const updatePaymentAccount = (data) => request.put('/api/payment/update', data);
export const setDefaultPaymentAccount = (type) => request.put(`/api/payment/set-default/${type}`);

//绑定账户 - 字段: user_id, wx_openid, alipay_account_number, real_name, use_accounttype, type(微信绑定用)
export const accountBinding = (data) => request.post('/api/account/store', data);
//获取账户信息 - 返回字段: user_id, wx_openid, alipay_account_number, real_name, use_accounttype, created_at, updated_at
export const accountGetOne = (data) => {
  try {
    return request.post('/api/account/getOne', data || {});
  } catch (error) {
    console.error('获取账户信息失败:', error);
    // 返回一个默认的响应结构，避免空值引起的错误
    return Promise.resolve({
      data: {
        use_accounttype: 0,
        alipay_account_number: '',
        wx_openid: '',
        real_name: '',
        wx_real_name: ''
      }
    });
  }
};
//更新账户信息 - 字段: alipay_account_number, real_name, use_accounttype
export const accountUpdate = (data) => request.post('/api/account/store', data);
//删除账户绑定
export const accountDelete = (type) => request.post(`/api/account/delete/${type}`);
//设置当前使用账户 - 字段: use_accounttype (1-支付宝, 2-微信)
export const accountSetDefault = (data) => request.post('/api/account/setDefault', data);

//修改绑定账户类型
export const accountModifyUseAccounttype = (use_accounttype) => request.post(`/api/account/modifyUseAccounttype/${use_accounttype}`);


export const accountModifyWechatName = (data) => request.post('/api/account/modifyWechatName',data);

//微信待收款确认
export const userWithdrawalWechatConfirm = (data) => request.post('/api/withdrawal/wechatconfirm',data);


export const wxcheckTransferStatus = (data) => request.post('/api/withdrawal/wxcheckTransferStatus',data);