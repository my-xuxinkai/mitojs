import { MitoVue } from '@/Vue'
import { setupReplace } from './browser/load'
import { log } from '@/core'
import { isBrowserEnv, isWxMiniEnv, _global } from './utils/index'
import { SDK_VERSION, SDK_NAME } from './common/config'
import { InitOptions } from '@/types'
import { errorBoundaryReport } from '@/React'
import initOptions from './common/initOpitons'
import { init as wxInit } from './wx-mini/index'

/**
 * 整体采用发布-订阅模式：
 * 订阅事件 => 重写原生事件 => 触发原生事件（发布事件） => 拿到错误信息 => 提取有用的错误信息 => 上报服务端
 */

// web项目初始化方法
function webInit(options: InitOptions = {}): void {
  // 判断浏览器是不是支持xhr或者sdk禁用了
  if (!('XMLHttpRequest' in _global) || options.disabled) return
  // 初始化传进来的参数
  initOptions(options)
  // 初始化事件重写
  setupReplace()
}

// 对外暴露的初始化方法：判断是web项目还是小程序项目，并执行对应的初始化方法
function init(options: InitOptions = {}): void {
  if (isBrowserEnv) {
    webInit(options)
  } else if (isWxMiniEnv) {
    wxInit(options)
  }
}

export default { MitoVue, SDK_VERSION, SDK_NAME, init, log, errorBoundaryReport }
