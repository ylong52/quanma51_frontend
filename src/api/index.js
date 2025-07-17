import { request } from '@/utils/request';  
 
// 登录模块
export const login = (data) => request.post('/api/login', data);
export const logout = () => request.post('/api/logout');
export const getUserInfo = () => request.get('/api/userInfo');
export const getProductCategory = () => request.get('/api/product/category');
export const getProductCategoryLevel2 = () => request.get('/api/product/category/level2');

// 用户管理模块
export const getUserList = (params) => request.get('/api/users', { params });
export const createUser = (data) => request.post('/api/users', data);
export const updateUser = (id, data) => request.put(`/api/users/${id}`, data);
export const deleteUser = (id) => request.delete(`/api/users/${id}`);

// 商品管理模块
export const getProductList = (params) => request.post('/api/product', { params });
export const getProductDetail = (id) => request.get(`/api/product/detail/${id}`);

export const createOrder = (data) => request.post('/api/order/create', data);
// getOrderInfo
export const getOrderInfo = (orderNumber) => request.get(`/api/order/orderinfo/${orderNumber}`);
//payOrder
export const payOrder = (params) => request.post(`/api/order/pay`, params);
//cancelOrder
export const cancelOrder = (orderNumber) => request.post(`/api/order/cancel/${orderNumber}`);