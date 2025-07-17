import axios from 'axios';
import { useToast } from 'vue-toast-notification'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
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
    if (response.config.disableCodeCheck) {
      return response.data;
    }

    const res = response.data;
    switch (response.status) {
      case 200:
        return Promise.resolve(res);
      case 400:        
        showError('请求参数错误', res.message);
        return Promise.reject(res);
      case 401:
        showError('未授权', '登录状态失败或已过期，请重新登录');
        // redirectToLogin();
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
    // debugger;
    // console.error('响应错误:', error);
    if (error.status == 400) {
      showError('请求参数错误', error.response.data.message || error.message);
        //已经处理了错误，返回空
      return Promise.resolve({});
    }
    if (error.status == 401) {
      showError('未授权', '登录状态失败或已过期，请重新登录');

      // redirectToLogin();
      return Promise.reject({});
    }
    if (error.status == 403) {
      showError('权限不足', '您没有权限执行此操作');
      return Promise.reject({});
    }
    if (error.status == 404) {
      showError('资源未找到', error.response.data.message || error.message);
      return Promise.reject({});
    }
    if (error.status == 500) {
      showError('服务器错误', error.response.data.message || error.message);
      return Promise.reject({});
    }

    showError('网络错误', error.message || '网络连接失败');
    return Promise.reject({});
  }
);

// 错误提示函数
function showError(title, message) {
  useToast().error(message)
}

// 重定向到登录页函数
function redirectToLogin() {
  console.log('跳转到登录页面');
  // 实际项目中应使用路由跳转
  // router.push('/login');
}

// 导出request对象
export const request = {
  /**
   * GET请求
   * @param {string} url - 请求URL
   * @param {object} params - 请求参数
   * @param {object} options - 额外选项
   */
  get: (url, params = {}, options = {}) => {
    return service.get(url, {
      params,
      ...options,
      disableCodeCheck: options.disableCodeCheck || false,
    });
  },

  /**
   * POST请求
   * @param {string} url - 请求URL
   * @param {object} data - 请求数据
   * @param {object} options - 额外选项
   */
  post: (url, data = {}, options = {}) => {
    return service.post(url, data, {
      ...options,
      disableCodeCheck: options.disableCodeCheck || false,
    });
  }
};