/**
 * 下载事件处理工具
 */
export class DownloadEventManager {
  constructor() {
    this.listeners = new Map()
    this.setupGlobalListeners()
  }

  /**
   * 设置全局事件监听器
   */
  setupGlobalListeners() {
    // 下载开始事件
    window.addEventListener('downloadStart', (event) => {
      this.notifyListeners('downloadStart', event.detail)
    })

    // 下载成功事件
    window.addEventListener('downloadSuccess', (event) => {
      this.notifyListeners('downloadSuccess', event.detail)
    })

    // 下载失败事件
    window.addEventListener('downloadError', (event) => {
      this.notifyListeners('downloadError', event.detail)
    })
  }

  /**
   * 添加事件监听器
   * @param {string} eventType - 事件类型
   * @param {Function} callback - 回调函数
   * @param {string} id - 监听器ID
   */
  addListener(eventType, callback, id = null) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Map())
    }
    
    const listenerId = id || `listener_${Date.now()}_${Math.random()}`
    this.listeners.get(eventType).set(listenerId, callback)
    
    return listenerId
  }

  /**
   * 移除事件监听器
   * @param {string} eventType - 事件类型
   * @param {string} id - 监听器ID
   */
  removeListener(eventType, id) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).delete(id)
    }
  }

  /**
   * 通知所有监听器
   * @param {string} eventType - 事件类型
   * @param {any} data - 事件数据
   */
  notifyListeners(eventType, data) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`下载事件监听器执行失败:`, error)
        }
      })
    }
  }

  /**
   * 触发下载开始事件
   * @param {object} detail - 事件详情
   */
  triggerDownloadStart(detail) {
    const event = new CustomEvent('downloadStart', { detail })
    window.dispatchEvent(event)
  }

  /**
   * 触发下载成功事件
   * @param {object} detail - 事件详情
   */
  triggerDownloadSuccess(detail) {
    const event = new CustomEvent('downloadSuccess', { detail })
    window.dispatchEvent(event)
  }

  /**
   * 触发下载失败事件
   * @param {object} detail - 事件详情
   */
  triggerDownloadError(detail) {
    const event = new CustomEvent('downloadError', { detail })
    window.dispatchEvent(event)
  }

  /**
   * 清理所有监听器
   */
  clearAllListeners() {
    this.listeners.clear()
  }
}

// 创建全局实例
export const downloadEventManager = new DownloadEventManager()

/**
 * 便捷函数：添加下载开始监听器
 * @param {Function} callback - 回调函数
 * @param {string} id - 监听器ID
 * @returns {string} 监听器ID
 */
export const onDownloadStart = (callback, id = null) => {
  return downloadEventManager.addListener('downloadStart', callback, id)
}

/**
 * 便捷函数：添加下载成功监听器
 * @param {Function} callback - 回调函数
 * @param {string} id - 监听器ID
 * @returns {string} 监听器ID
 */
export const onDownloadSuccess = (callback, id = null) => {
  return downloadEventManager.addListener('downloadSuccess', callback, id)
}

/**
 * 便捷函数：添加下载失败监听器
 * @param {Function} callback - 回调函数
 * @param {string} id - 监听器ID
 * @returns {string} 监听器ID
 */
export const onDownloadError = (callback, id = null) => {
  return downloadEventManager.addListener('downloadError', callback, id)
}

/**
 * 便捷函数：移除监听器
 * @param {string} eventType - 事件类型
 * @param {string} id - 监听器ID
 */
export const removeDownloadListener = (eventType, id) => {
  downloadEventManager.removeListener(eventType, id)
}

export default downloadEventManager
