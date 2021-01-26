import { EVENTTYPES, WxEvents } from './constant'
import { getFlag, getFunctionName, logger, nativeTryCatch, setFlag } from '../utils'

export interface ReplaceHandler {
  type: EVENTTYPES | WxEvents
  callback: ReplaceCallback
}

type ReplaceCallback = (data: any) => void

// 订阅中心
const handlers: { [key in EVENTTYPES]?: ReplaceCallback[] } = {}

// 订阅事件-handle包含事件类型和回调处理方法
export function subscribeEvent(handler: ReplaceHandler): void {
  // 没有事件，就不处理
  if (!handler) {
    return
  }
  if (getFlag(handler.type)) {
    return
  }
  setFlag(handler.type, true)
  // 将事件加入订阅中心
  handlers[handler.type] = handlers[handler.type] || []
  handlers[handler.type].push(handler.callback)
}

// 发布事件
export function triggerHandlers(type: EVENTTYPES | WxEvents, data: any): void {
  if (!type || !handlers[type]) return
  handlers[type].forEach((callback) => {
    nativeTryCatch(
      () => {
        callback(data)
      },
      (e: Error) => {
        logger.error(`重写事件triggerHandlers的回调函数发生错误\nType:${type}\nName: ${getFunctionName(callback)}\nError: ${e}`)
      }
    )
  })
}
