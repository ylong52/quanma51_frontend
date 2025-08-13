/**
 * 微信JS-SDK工具类
 * 用于在Vue3中管理微信JS-SDK的加载和配置
 */
class WeixinSDK {
  constructor() {
    this.loaded = false
    this.loading = false
    this.loadPromise = null
  }

  /**
   * 动态加载微信JS-SDK
   * @returns {Promise} 加载完成的Promise
   */
  loadSDK() {
    // 如果已经加载，直接返回
    if (this.loaded && window.wx) {
      return Promise.resolve(window.wx)
    }

    // 如果正在加载，返回现有的Promise
    if (this.loading && this.loadPromise) {
      return this.loadPromise
    }

    this.loading = true
    this.loadPromise = new Promise((resolve, reject) => {
      // 检查是否已经加载
      if (window.wx) {
        this.loaded = true
        this.loading = false
        resolve(window.wx)
        return
      }

      // 创建script标签
      const script = document.createElement('script')
      script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
      script.async = true
      
      script.onload = () => {
        this.loaded = true
        this.loading = false
        console.log('微信JS-SDK加载成功')
        resolve(window.wx)
      }
      
      script.onerror = () => {
        this.loading = false
        console.error('微信JS-SDK加载失败')
        reject(new Error('微信JS-SDK加载失败'))
      }
      
      // 添加到页面
      document.head.appendChild(script)
    })

    return this.loadPromise
  }

  /**
   * 检查是否在微信浏览器中
   * @returns {boolean}
   */
  isWeixinBrowser() {
    const isWeixin = navigator.userAgent.toLowerCase().includes('micromessenger')
    console.log('微信环境检测:', {
      isWeixin,
      userAgent: navigator.userAgent,
      hasWx: !!window.wx,
      hasWeixinJSBridge: !!window.WeixinJSBridge
    })
    return isWeixin
  }

  /**
   * 检查微信版本是否支持转账功能
   * @returns {Object} 包含支持状态和详细信息
   */
  checkTransferSupport() {
    console.log('🔍 开始检查转账功能支持...')
    
    const support = {
      isWeixin: this.isWeixinBrowser(),
      hasWx: !!window.wx,
      hasWeixinJSBridge: !!window.WeixinJSBridge,
      hasRequestMerchantTransfer: !!(window.wx && window.wx.requestMerchantTransfer),
      supported: false,
      reason: ''
    }

    console.log('📊 环境检测结果:', {
      isWeixin: support.isWeixin,
      hasWx: support.hasWx,
      hasWeixinJSBridge: support.hasWeixinJSBridge,
      hasRequestMerchantTransfer: support.hasRequestMerchantTransfer
    })

    if (!support.isWeixin) {
      support.reason = '请在微信浏览器中打开此页面'
      console.log('❌ 不支持原因: 非微信环境')
    } else if (!support.hasWx && !support.hasWeixinJSBridge) {
      support.reason = '微信JS-SDK未加载，请刷新页面重试'
      console.log('❌ 不支持原因: JS-SDK未加载')
    } else if (!support.hasRequestMerchantTransfer && !support.hasWeixinJSBridge) {
      support.reason = '当前微信版本不支持转账功能，请更新微信到最新版本'
      console.log('❌ 不支持原因: API不支持')
    } else {
      support.supported = true
      console.log('✅ 转账功能支持检查通过')
    }

    console.log('📋 转账功能支持检查结果:', support)
    return support
  }

  /**
   * 获取当前页面URL（去掉hash部分）
   * @returns {string}
   */
  getCurrentUrl() {
    // 获取当前URL，去掉hash部分
    const url = window.location.href.split('#')[0]
    console.log('当前页面URL:', url)
    return url
  }

  /**
   * 配置微信JS-SDK
   * @param {Object} config 配置对象
   * @returns {Promise}
   */
  config(config) {
    return new Promise((resolve, reject) => {
      console.log('⚙️ 开始配置微信JS-SDK...')
      
      if (!window.wx) {
        console.error('❌ 微信JS-SDK未加载')
        reject(new Error('微信JS-SDK未加载'))
        return
      }

      // 获取当前URL
      const currentUrl = this.getCurrentUrl()
      console.log('🌐 当前页面URL:', currentUrl)
      
      // 构建完整的配置对象
      const fullConfig = {
        debug: false,
        url: currentUrl, // 添加URL参数，这是签名验证的关键
        ...config
      }

      console.log('📋 微信JS-SDK配置参数:', fullConfig)
      console.log('⏰ 配置时间:', new Date().toLocaleString())

      console.log('📡 调用wx.config...')
      window.wx.config(fullConfig)

      window.wx.ready(() => {
        console.log('✅ 微信JS-SDK配置成功')
        resolve()
      })

      window.wx.error((res) => {
        console.error('❌ 微信JS-SDK配置失败:', res)
        
        // 提供更详细的错误信息
        let errorMessage = '微信JS-SDK配置失败: ' + res.errMsg
        
        if (res.errMsg.includes('invalid signature')) {
          errorMessage += '\n可能的原因：\n1. 服务器签名计算错误\n2. URL不匹配\n3. 时间戳过期\n4. 参数顺序错误'
          console.error('🔍 签名验证失败详情:', {
            currentUrl,
            config: fullConfig,
            error: res
          })
        }
        
        reject(new Error(errorMessage))
      })
    })
  }

  /**
   * 检查API是否可用
   * @param {Array} jsApiList API列表
   * @returns {Promise}
   */
  checkJsApi(jsApiList) {
    return new Promise((resolve, reject) => {
      console.log('🔍 开始检查微信API可用性...')
      
      if (!window.wx) {
        console.error('❌ 微信JS-SDK未加载')
        reject(new Error('微信JS-SDK未加载'))
        return
      }

      console.log('📋 要检查的API列表:', jsApiList)

      console.log('📡 调用wx.checkJsApi...')
      window.wx.checkJsApi({
        jsApiList,
        success: (res) => {
          console.log('✅ API检查成功')
          console.log('📊 API检查结果:', res)
          console.log('📋 检查详情:', res.checkResult)
          
          // 详细检查每个API
          jsApiList.forEach(api => {
            const isAvailable = res.checkResult[api]
            console.log(`🔍 API ${api}: ${isAvailable ? '✅ 可用' : '❌ 不可用'}`)
          })
          
          resolve(res)
        },
        fail: (res) => {
          console.error('❌ API检查失败:', res)
          reject(new Error('API检查失败: ' + res.errMsg))
        }
      })
    })
  }

  /**
   * 调用微信转账接口
   * @param {Object} params 转账参数
   * @returns {Promise}
   */
  requestMerchantTransfer(params) {
    return new Promise((resolve, reject) => {
      if (!window.wx) {
        reject(new Error('微信JS-SDK未加载'))
        return
      }

      console.log('开始调用微信转账接口...')
      console.log('转账参数:', params)
      console.log('当前环境:', {
        hasWeixinJSBridge: !!window.WeixinJSBridge,
        hasWxRequestMerchantTransfer: !!(window.wx && window.wx.requestMerchantTransfer),
        userAgent: navigator.userAgent
      })

      // 优先使用WeixinJSBridge
      if (window.WeixinJSBridge) {
        console.log('使用WeixinJSBridge调用转账接口')
        window.WeixinJSBridge.invoke('requestMerchantTransfer', params, (res) => {
          console.log('WeixinJSBridge响应:', res)
          if (res.err_msg === 'requestMerchantTransfer:ok') {
            resolve(res)
          } else {
            // 处理特定的错误信息
            let errorMessage = res.err_msg
            if (res.err_msg.includes('没有此SDK') || res.err_msg.includes('暂不支持此SDK')) {
              errorMessage = '当前微信版本不支持转账功能，请更新微信到最新版本'
            } else if (res.err_msg.includes('模拟')) {
              errorMessage = '请在真实微信环境中使用此功能，开发者工具不支持'
            }
            reject(new Error(errorMessage))
          }
        })
      } else if (window.wx && window.wx.requestMerchantTransfer) {
        // 使用wx.requestMerchantTransfer
        console.log('使用wx.requestMerchantTransfer调用转账接口')
        window.wx.requestMerchantTransfer({
          ...params,
          success: (res) => {
            console.log('wx.requestMerchantTransfer成功:', res)
            resolve(res)
          },
          fail: (res) => {
            console.log('wx.requestMerchantTransfer失败:', res)
            let errorMessage = res.errMsg
            if (res.errMsg.includes('没有此SDK') || res.errMsg.includes('暂不支持此SDK')) {
              errorMessage = '当前微信版本不支持转账功能，请更新微信到最新版本'
            } else if (res.errMsg.includes('模拟')) {
              errorMessage = '请在真实微信环境中使用此功能，开发者工具不支持'
            }
            reject(new Error(errorMessage))
          }
        })
      } else {
        const errorMsg = '转账接口不可用，请确保在微信浏览器中使用最新版本微信'
        console.error(errorMsg)
        reject(new Error(errorMsg))
      }
    })
  }

  /**
   * 带重试机制的配置方法
   * @param {Object} config 配置对象
   * @param {number} maxRetries 最大重试次数
   * @returns {Promise}
   */
  async configWithRetry(config, maxRetries = 2) {
    console.log(`🔄 开始配置微信JS-SDK (最大重试次数: ${maxRetries})`)
    let lastError = null
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📡 配置尝试 ${attempt}/${maxRetries}...`)
        await this.config(config)
        console.log(`✅ 配置尝试 ${attempt} 成功`)
        return // 成功则直接返回
      } catch (error) {
        lastError = error
        console.warn(`❌ 配置尝试 ${attempt} 失败:`, error.message)
        
        if (attempt < maxRetries) {
          console.log(`⏳ 等待1秒后重试...`)
          // 等待一段时间后重试
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    }
    
    console.error(`💥 所有配置尝试都失败了，最后错误:`, lastError.message)
    throw lastError
  }

  /**
   * 完整的微信转账流程
   * @param {Object} item 转账项目
   * @param {Function} apiCall API调用函数
   * @returns {Promise}
   */
  async handleTransfer(item, apiCall) {
    console.log('🚀 开始微信转账流程...')
    console.log('📋 转账项目信息:', item)
    
    try {
      console.log('🔍 步骤1: 检查转账功能支持...')
      // 检查转账功能支持
      const support = this.checkTransferSupport()
      console.log('📊 转账支持检查结果:', support)
      
      if (!support.supported) {
        console.error('❌ 转账功能不支持:', support.reason)
        throw new Error(support.reason)
      }
      console.log('✅ 转账功能支持检查通过')

      console.log('📦 步骤2: 加载微信JS-SDK...')
      // 加载SDK
      await this.loadSDK()
      console.log('✅ 微信JS-SDK加载完成')

      console.log('🌐 步骤3: 获取当前页面URL...')
      // 调用API获取配置
      const currentUrl = this.getCurrentUrl()
      const apiData = {
        id: item.id,
        currentUrl: currentUrl
      }
      
      console.log('📤 步骤4: 准备API调用数据...')
      console.log('📋 发送给API的数据:', apiData)
      
      console.log('🔍 步骤5: 验证API参数...')
      // 验证API参数
      const { WeixinDebugger } = await import('./weixinDebug.js')
      const validationIssues = WeixinDebugger.validateApiData(apiData)
      if (validationIssues.length > 0) {
        console.warn('⚠️ API参数验证发现问题:', validationIssues)
      } else {
        console.log('✅ API参数验证通过')
      }
      
      console.log('📡 步骤6: 调用服务器API...')
      const res = await apiCall(apiData)
      console.log('✅ 服务器API调用成功')
      console.log('📥 服务器返回数据:', res)
      
      console.log('🔧 步骤7: 解析服务器返回的配置...')
      console.log('📋 API返回的配置信息:', {
        appId: res.js_config.appId,
        timestamp: res.js_config.timestamp,
        nonceStr: res.js_config.nonceStr,
        signature: res.js_config.signature,
        jsApiList: ['requestMerchantTransfer']
      })
      
      console.log('⚙️ 步骤8: 配置微信JS-SDK...')
      // 使用重试机制配置SDK
      await this.configWithRetry({
        appId: res.js_config.appId,
        timestamp: res.js_config.timestamp,
        nonceStr: res.js_config.nonceStr,
        signature: res.js_config.signature,
        jsApiList: ['requestMerchantTransfer']
      })
      console.log('✅ 微信JS-SDK配置成功')
      
      console.log('🔍 步骤9: 检查微信API可用性...')
      // 检查API可用性
      console.log('🔍 检查requestMerchantTransfer API...')
      const checkResult = await this.checkJsApi(['requestMerchantTransfer'])
      
      // 详细检查API可用性
      const isTransferApiAvailable = checkResult.checkResult['requestMerchantTransfer']
      console.log('📊 requestMerchantTransfer API可用性:', isTransferApiAvailable)
      
      if (!isTransferApiAvailable) {
        console.warn('⚠️ requestMerchantTransfer API不可用，尝试其他方式...')
        
        // 检查是否有WeixinJSBridge
        if (window.WeixinJSBridge) {
          console.log('✅ 检测到WeixinJSBridge，可以尝试使用')
        } else {
          console.warn('❌ WeixinJSBridge也不可用')
        }
        
        // 检查wx.requestMerchantTransfer
        if (window.wx && window.wx.requestMerchantTransfer) {
          console.log('✅ 检测到wx.requestMerchantTransfer方法')
        } else {
          console.warn('❌ wx.requestMerchantTransfer方法不可用')
        }
        
        // 根据实际情况决定是否继续
        const hasAlternativeMethod = window.WeixinJSBridge || (window.wx && window.wx.requestMerchantTransfer)
        if (!hasAlternativeMethod) {
          console.error('❌ 没有可用的转账方法')
          throw new Error('您的微信版本过低，请更新至最新版本')
        } else {
          console.log('✅ 使用备用方法进行转账')
        }
      } else {
        console.log('✅ requestMerchantTransfer API可用，继续执行')
      }

      console.log('💰 步骤10: 执行微信转账...')
      // 执行转账
      console.log('🚀 开始执行转账...')
      console.log('📋 转账参数:', {
        mchId: res.transferParams.mchId,
        appId: res.transferParams.appId,
        package: res.transferParams.package
      })
      
      const transferResult = await this.requestMerchantTransfer({
        mchId: res.transferParams.mchId,
        appId: res.transferParams.appId,
        package: res.transferParams.package
      })
      
      console.log('✅ 转账执行成功')
      console.log('📊 转账执行结果:', transferResult)

      console.log('🎉 步骤11: 转账流程完成')
      console.log('📋 最终结果:', {
        success: true,
        transferId: res.transferId,
        data: transferResult
      })
      
      return {
        success: true,
        data: transferResult,
        transferId: res.transferId
      }

    } catch (error) {
      console.error('💥 微信转账处理失败:', error)
      console.error('📋 错误详情:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      
      // 提供更友好的错误信息
      let userMessage = error.message
      if (error.message.includes('invalid signature')) {
        userMessage = '微信配置失败，请刷新页面重试'
        console.error('🔍 错误类型: 签名验证失败')
      } else if (error.message.includes('请在微信浏览器中打开')) {
        userMessage = '请在微信浏览器中打开此页面'
        console.error('🔍 错误类型: 非微信环境')
      } else if (error.message.includes('没有此SDK') || error.message.includes('暂不支持此SDK')) {
        userMessage = '当前微信版本不支持转账功能，请更新微信到最新版本'
        console.error('🔍 错误类型: API不支持')
      } else if (error.message.includes('模拟')) {
        userMessage = '请在真实微信环境中使用此功能，开发者工具不支持'
        console.error('🔍 错误类型: 模拟器环境')
      } else if (error.message.includes('转账接口不可用')) {
        userMessage = '转账功能不可用，请确保在微信浏览器中使用最新版本微信'
        console.error('🔍 错误类型: 接口不可用')
      } else {
        console.error('🔍 错误类型: 未知错误')
      }
      
      console.log('📤 返回错误结果:', {
        success: false,
        error: userMessage,
        originalError: error.message
      })
      
      return {
        success: false,
        error: userMessage,
        originalError: error.message
      }
    }
  }
}

// 创建全局实例
export const weixinSDK = new WeixinSDK()

// 便捷函数
export const loadWeixinJS = () => weixinSDK.loadSDK()
export const isWeixinBrowser = () => weixinSDK.isWeixinBrowser()
export const configWeixin = (config) => weixinSDK.config(config)
export const checkWeixinApi = (jsApiList) => weixinSDK.checkJsApi(jsApiList)
export const requestWeixinTransfer = (params) => weixinSDK.requestMerchantTransfer(params)
export const handleWeixinTransfer = (item, apiCall) => weixinSDK.handleTransfer(item, apiCall)

export default weixinSDK
