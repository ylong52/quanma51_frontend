import QRCode from 'qrcode'

/**
 * 二维码生成工具类
 */
export class QRCodeGenerator {
  /**
   * 生成二维码为Data URL
   * @param {string} text - 要编码的文本
   * @param {object} options - 配置选项
   * @returns {Promise<string>} Data URL
   */
  static async toDataURL(text, options = {}) {
    const defaultOptions = {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    }
    
    const mergedOptions = { ...defaultOptions, ...options }
    
    try {
      return await QRCode.toDataURL(text, mergedOptions)
    } catch (error) {
      console.error('生成二维码失败:', error)
      throw error
    }
  }

  /**
   * 生成二维码为Canvas元素
   * @param {string} text - 要编码的文本
   * @param {object} options - 配置选项
   * @returns {Promise<HTMLCanvasElement>} Canvas元素
   */
  static async toCanvas(text, options = {}) {
    const defaultOptions = {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    }
    
    const mergedOptions = { ...defaultOptions, ...options }
    
    try {
      const canvas = document.createElement('canvas')
      await QRCode.toCanvas(canvas, text, mergedOptions)
      return canvas
    } catch (error) {
      console.error('生成二维码Canvas失败:', error)
      throw error
    }
  }

  /**
   * 生成二维码为SVG字符串
   * @param {string} text - 要编码的文本
   * @param {object} options - 配置选项
   * @returns {Promise<string>} SVG字符串
   */
  static async toSVG(text, options = {}) {
    const defaultOptions = {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    }
    
    const mergedOptions = { ...defaultOptions, ...options }
    
    try {
      return await QRCode.toString(text, {
        type: 'svg',
        ...mergedOptions
      })
    } catch (error) {
      console.error('生成二维码SVG失败:', error)
      throw error
    }
  }

  /**
   * 下载二维码图片
   * @param {string} text - 要编码的文本
   * @param {string} filename - 文件名
   * @param {object} options - 配置选项
   */
  static async download(text, filename = 'qrcode.png', options = {}) {
    try {
      const dataURL = await this.toDataURL(text, options)
      const link = document.createElement('a')
      link.download = filename
      link.href = dataURL
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('下载二维码失败:', error)
      throw error
    }
  }

  /**
   * 生成二维码并返回Blob对象
   * @param {string} text - 要编码的文本
   * @param {object} options - 配置选项
   * @returns {Promise<Blob>} Blob对象
   */
  static async toBlob(text, options = {}) {
    try {
      const canvas = await this.toCanvas(text, options)
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/png')
      })
    } catch (error) {
      console.error('生成二维码Blob失败:', error)
      throw error
    }
  }
}

/**
 * 便捷函数：生成二维码Data URL
 * @param {string} text - 要编码的文本
 * @param {object} options - 配置选项
 * @returns {Promise<string>} Data URL
 */
export const generateQRCode = (text, options = {}) => {
  return QRCodeGenerator.toDataURL(text, options)
}

/**
 * 便捷函数：下载二维码
 * @param {string} text - 要编码的文本
 * @param {string} filename - 文件名
 * @param {object} options - 配置选项
 */
export const downloadQRCode = (text, filename = 'qrcode.png', options = {}) => {
  return QRCodeGenerator.download(text, filename, options)
}

/**
 * 便捷函数：生成二维码SVG
 * @param {string} text - 要编码的文本
 * @param {object} options - 配置选项
 * @returns {Promise<string>} SVG字符串
 */
export const generateQRCodeSVG = (text, options = {}) => {
  return QRCodeGenerator.toSVG(text, options)
}

export default QRCodeGenerator
