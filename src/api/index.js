import { request } from '@/utils/request';  
 
// 登录模块
export const login = (data) => request.post('/api/login', data);
export const logout = () => request.post('/api/logout');
export const getUserInfo = () => request.get('/api/userinfo');
export const forgotPassword = (data) => request.post('/api/forgotPassword', data);
export const checkToken = () => request.get('/api/checkToken');

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

