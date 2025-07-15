import { request } from '@/utils/request';  
 
// 登录模块
export const login = (data) => request.post('/api/login', data);
export const logout = () => request.post('/api/logout');
export const getUserInfo = () => request.get('/api/userInfo');

// 用户管理模块
export const getUserList = (params) => request.get('/api/users', { params });
export const createUser = (data) => request.post('/api/users', data);
export const updateUser = (id, data) => request.put(`/api/users/${id}`, data);
export const deleteUser = (id) => request.delete(`/api/users/${id}`);

// 商品管理模块
export const getProductList = (params) => request.get('/api/products', { params });
export const getProductDetail = (id) => request.get(`/api/products/${id}`);
// 更多接口...    