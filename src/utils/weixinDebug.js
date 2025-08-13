/**
 * 微信JS-SDK调试工具
 * 用于诊断签名验证问题
 */
export class WeixinDebugger {
  /**
   * 检查微信JS-SDK环境
   */
  static checkEnvironment() {
    const checks = {
      isWeixin: navigator.userAgent.toLowerCase().includes('micromessenger'),
      hasWx: !!window.wx,
      hasWeixinJSBridge: !!window.WeixinJSBridge,
      hasRequestMerchantTransfer: !!(window.wx && window.wx.requestMerchantTransfer),
      currentUrl: window.location.href,
      urlWithoutHash: window.location.href.split('#')[0],
      userAgent: navigator.userAgent
    }
    
    console.log('微信环境检查:', checks)
    return checks
  }

  /**
   * 检查转账功能支持情况
   */
  static checkTransferSupport() {
    const isWeixin = navigator.userAgent.toLowerCase().includes('micromessenger')
    const hasWx = !!window.wx
    const hasWeixinJSBridge = !!window.WeixinJSBridge
    const hasRequestMerchantTransfer = !!(window.wx && window.wx.requestMerchantTransfer)
    
    const support = {
      isWeixin,
      hasWx,
      hasWeixinJSBridge,
      hasRequestMerchantTransfer,
      supported: false,
      issues: []
    }

    if (!isWeixin) {
      support.issues.push('不在微信浏览器中')
    }
    if (!hasWx && !hasWeixinJSBridge) {
      support.issues.push('微信JS-SDK未加载')
    }
    if (!hasRequestMerchantTransfer && !hasWeixinJSBridge) {
      support.issues.push('不支持requestMerchantTransfer API')
    }

    support.supported = support.issues.length === 0
    
    console.log('转账功能支持检查:', support)
    return support
  }

  /**
   * 验证配置参数
   * @param {Object} config 配置对象
   */
  static validateConfig(config) {
    const required = ['appId', 'timestamp', 'nonceStr', 'signature', 'jsApiList']
    const missing = required.filter(key => !config[key])
    
    if (missing.length > 0) {
      console.error('缺少必需参数:', missing)
      return false
    }
    
    // 检查时间戳
    const now = Math.floor(Date.now() / 1000)
    const timestamp = parseInt(config.timestamp)
    const timeDiff = Math.abs(now - timestamp)
    
    if (timeDiff > 300) { // 5分钟
      console.warn('时间戳可能过期:', {
        current: now,
        config: timestamp,
        diff: timeDiff
      })
    }
    
    // 检查URL
    if (!config.url) {
      console.warn('缺少url参数，这可能导致签名验证失败')
    }
    
    console.log('配置参数验证通过')
    return true
  }

  /**
   * 生成调试信息
   * @param {Object} config 配置对象
   * @param {Object} error 错误对象
   */
  static generateDebugInfo(config, error = null) {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: this.checkEnvironment(),
      config: {
        ...config,
        signature: config.signature ? `${config.signature.substring(0, 8)}...` : 'undefined'
      },
      currentUrl: window.location.href,
      urlWithoutHash: window.location.href.split('#')[0]
    }
    
    if (error) {
      debugInfo.error = {
        message: error.message,
        type: error.name,
        stack: error.stack
      }
    }
    
    console.log('微信JS-SDK调试信息:', debugInfo)
    return debugInfo
  }

  /**
   * 检查签名可能的问题
   * @param {Object} config 配置对象
   */
  static diagnoseSignatureIssue(config) {
    const issues = []
    
    // 检查URL
    if (!config.url) {
      issues.push('缺少url参数')
    } else {
      const currentUrl = window.location.href.split('#')[0]
      if (config.url !== currentUrl) {
        issues.push(`URL不匹配: 配置=${config.url}, 当前=${currentUrl}`)
      }
    }
    
    // 检查时间戳
    const now = Math.floor(Date.now() / 1000)
    const timestamp = parseInt(config.timestamp)
    if (Math.abs(now - timestamp) > 300) {
      issues.push('时间戳过期或超前')
    }
    
    // 检查必需参数
    if (!config.appId) issues.push('缺少appId')
    if (!config.nonceStr) issues.push('缺少nonceStr')
    if (!config.signature) issues.push('缺少signature')
    if (!config.jsApiList || !Array.isArray(config.jsApiList)) {
      issues.push('jsApiList格式错误')
    }
    
    if (issues.length > 0) {
      console.error('签名问题诊断:', issues)
    } else {
      console.log('签名参数检查通过')
    }
    
    return issues
  }

  /**
   * 验证API调用参数
   * @param {Object} apiData API调用数据
   */
  static validateApiData(apiData) {
    const issues = []
    
    if (!apiData.id) {
      issues.push('缺少id参数')
    }
    
    if (!apiData.currentUrl) {
      issues.push('缺少currentUrl参数')
    } else {
      const expectedUrl = window.location.href.split('#')[0]
      if (apiData.currentUrl !== expectedUrl) {
        issues.push(`currentUrl不匹配: 发送=${apiData.currentUrl}, 期望=${expectedUrl}`)
      }
    }
    
    if (issues.length > 0) {
      console.error('API参数验证失败:', issues)
    } else {
      console.log('API参数验证通过')
    }
    
    return issues
  }

  /**
   * 提供修复建议
   * @param {Array} issues 问题列表
   */
  static getFixSuggestions(issues) {
    const suggestions = {
      '缺少url参数': '在wx.config中添加url参数，使用window.location.href.split("#")[0]',
      'URL不匹配': '确保服务器生成签名时使用的URL与当前页面URL完全一致',
      '时间戳过期或超前': '检查服务器时间，确保时间戳在5分钟内',
      '缺少appId': '检查服务器返回的appId是否正确',
      '缺少nonceStr': '确保服务器生成随机字符串',
      '缺少signature': '检查服务器签名算法是否正确',
      'jsApiList格式错误': '确保jsApiList是数组格式'
    }
    
    const fixList = issues.map(issue => {
      const key = Object.keys(suggestions).find(k => issue.includes(k))
      return key ? suggestions[key] : `检查${issue}`
    })
    
    console.log('修复建议:', fixList)
    return fixList
  }
}

// 便捷函数
export const checkWeixinEnvironment = () => WeixinDebugger.checkEnvironment()
export const validateWeixinConfig = (config) => WeixinDebugger.validateConfig(config)
export const generateWeixinDebugInfo = (config, error) => WeixinDebugger.generateDebugInfo(config, error)
export const diagnoseWeixinSignature = (config) => WeixinDebugger.diagnoseSignatureIssue(config)
export const getWeixinFixSuggestions = (issues) => WeixinDebugger.getFixSuggestions(issues)
export const validateWeixinApiData = (apiData) => WeixinDebugger.validateApiData(apiData)
export const checkWeixinTransferSupport = () => WeixinDebugger.checkTransferSupport()

export default WeixinDebugger
