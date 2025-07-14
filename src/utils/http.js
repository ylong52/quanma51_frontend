import axios from 'axios';
import { ElMessage } from 'element-plus'; // 假设使用 ElementPlus 作为 UI 组件库

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '', // 从环境变量获取 API 基础路径
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = localStorage.getItem('token') || '';
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 如果设置了禁止判断，则直接返回接口内容
    if (response.config.disableCodeCheck) {
      return response.data;
    }

      const res = response.data;
    // 根据 code 进行不同处理
    switch (response.status) {
      case 200:        
        return Promise.resolve(res);
      case 400:
        showError('请求参数错误', res.message);
        return Promise.reject(res);
      case 401:
        showError('未授权', '登录状态已过期，请重新登录');
        // 跳转到登录页面
        redirectToLogin();
        return Promise.reject(res);
      case 403:
        showError('权限不足', '您没有权限执行此操作');
        return Promise.reject(res);
      case 404:
        showError('资源未找到', '请求的资源不存在');
        return Promise.reject(res);
      case 500:
        showError('服务器错误', '服务器内部错误，请稍后再试');
        return Promise.reject(res);
      default:
        showError('未知错误', `错误码: ${res.code}`);
        return Promise.reject(res);
    }
  },
  (error) => {
    console.error('响应错误:', error);
    showError('网络错误', error.message || '网络连接失败');
    return Promise.reject(error);
  }
);

// 错误提示函数
function showError(title, message) {
  ElMessage({
    message: message || title,
    type: 'error',
    duration: 3000,
  });
}

// 重定向到登录页函数
function redirectToLogin() {
  // 这里可以使用路由进行跳转
  // 例如: router.push('/login');
debugger;  
  console.log('跳转到登录页面');
}

/**
 * GET 请求
 * @param {string} url - 请求URL
 * @param {object} params - 请求参数
 * @param {object} options - 额外选项
 * @param {boolean} options.disableCodeCheck - 是否禁用状态码检查
 * @returns {Promise<any>}
 */
export function httpGet(url, params = {} ) {
  return service.get(url, {
    params
  });
}

/**
 * POST 请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求数据
 * @param {object} options - 额外选项
 * @param {boolean} options.disableCodeCheck - 是否禁用状态码检查
 * @returns {Promise<any>}
 */
export function httpPost(url, data = {},options={}) {
 
  return service.post(url, data, {
    ...options,
    disableCodeCheck: options.disableCodeCheck || false,
  });
}

// 可以根据需要添加更多方法如 put、delete 等    