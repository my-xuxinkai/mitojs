import { HandleEvents } from './handleEvents'
import { htmlElementAsString } from '@/utils'
import { EVENTTYPES, BREADCRUMBTYPES } from '@/common/constant'
import { Severity } from '@/utils/Severity'
import { addReplaceHandler } from './replace'
import { breadcrumb } from '@/core'

// 初始化事件重写
export function setupReplace(): void {
  // 所有的请求第三方库都是基于xhr、fetch二次封装的，
  // 所以只需要重写这两个事件就可以拿到所有的接口请求的信息，
  // 通过判断status的值来判断当前接口是否是正常的

  // 重写XHR原生事件，并在重写后增加事件发布
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHttp(data, BREADCRUMBTYPES.XHR)
    },
    type: EVENTTYPES.XHR
  })
  // 重写FETCH原生事件
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHttp(data, BREADCRUMBTYPES.FETCH)
    },
    type: EVENTTYPES.FETCH
  })
  // 重写 ERROR 原生事件
  addReplaceHandler({
    callback: (error) => {
      HandleEvents.handleError(error)
    },
    type: EVENTTYPES.ERROR
  })
  // 重写 CONSOLE 原生事件
  // 正常情况下正式环境是不应该有console的，那为什么要收集console的信息？
  // 第一：非正常情况下，正式环境或预发环境也可能会有console，
  // 第二：很多时候也可以把sdk放入测试环境上面调试。
  // 所以最终还是决定收集console信息，但是在初始化的时候的传参来告诉sdk是否监听console的信息收集
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleConsole(data)
    },
    type: EVENTTYPES.CONSOLE
  })
  // 重写 HISTORY 原生事件，当浏览器支持history模式时，会被以下两个事件所影响：pushState、replaceState，且这两个事件不会触发onpopstate的回调，所以我们需要监听这个三个事件-单页面应用
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHistory(data)
    },
    type: EVENTTYPES.HISTORY
  })
  // 重写 UNHANDLEDREJECTION 原生事件:当Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleUnhandleRejection(data)
    },
    type: EVENTTYPES.UNHANDLEDREJECTION
  })
  // 重写 DOM 原生事件，dom事件获取包括很多：click、input、doubleClick等等
  addReplaceHandler({
    callback: (data) => {
      const htmlString = htmlElementAsString(data.data.activeElement as HTMLElement)
      if (htmlString) {
        breadcrumb.push({
          type: BREADCRUMBTYPES.CLICK,
          category: breadcrumb.getCategory(BREADCRUMBTYPES.CLICK),
          data: htmlString,
          level: Severity.Info
        })
      }
    },
    type: EVENTTYPES.DOM
  })
  // 重写 HASHCHANGE 原生事件,当浏览器只支持hashchange时，就需要重写hashchange-单页面应用
  addReplaceHandler({
    callback: (e: HashChangeEvent) => {
      HandleEvents.handleHashchange(e)
    },
    type: EVENTTYPES.HASHCHANGE
  })
}
