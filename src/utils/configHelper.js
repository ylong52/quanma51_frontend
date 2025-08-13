import { useUserStore } from '@/store/user'

/**
 * 配置助手类 - 用于方便地访问store中的配置数据
 */
export class ConfigHelper {
  constructor() {
    this.userStore = useUserStore()
  }

  /**
   * 获取指定key的配置值
   * @param {string} key - 配置键名
   * @param {*} defaultValue - 默认值
   * @returns {*} 配置值或默认值
   */
  get(key, defaultValue = null) {
    const value = this.userStore.getConfig(key)
    return value !== null ? value : defaultValue
  }

  /**
   * 获取充值费用配置
   * @returns {number} 充值费用
   */
  getRechargeFees() {
    return this.get('recharge_fees', 0)
  }

  /**
   * 获取提现费用配置
   * @returns {number} 提现费用
   */
  getWithdrawalFees() {
    return this.get('withdrawal_fees', 0)
  }

  /**
   * 获取最小充值金额配置
   * @returns {number} 最小充值金额
   */
  getMinRechargeAmount() {
    return this.get('min_recharge_amount', 1)
  }

  /**
   * 获取最大提现金额配置
   * @returns {number} 最大提现金额
   */
  getMaxWithdrawalAmount() {
    return this.get('max_withdrawal_amount', 10000)
  }

  /**
   * 获取所有配置数据
   * @returns {Array} 配置数组
   */
  getAllConfig() {
    return this.userStore.config
  }

  /**
   * 检查配置是否已加载
   * @returns {boolean} 是否已加载
   */
  isConfigLoaded() {
    return this.userStore.config && Object.keys(this.userStore.config).length > 0
  }

  /**
   * 清除配置缓存
   */
  clearCache() {
    this.userStore.clearConfig()
  }

  /**
   * 强制重新加载配置
   */
  async reloadConfig() {
    try {
      const { default: api } = await import('@/api/index')
      const res = await api.globalconfig()
      if (res.data) {
        this.userStore.setConfig(res.data)
        return true
      }
      return false
    } catch (error) {
      console.error('重新加载配置失败:', error)
      return false
    }
  }
}

// 导出默认实例
export default new ConfigHelper()
