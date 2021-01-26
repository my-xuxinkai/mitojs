import { breadcrumb } from '@/core'
import { transportData } from '@/core'
import { InitOptions } from '@/types'
import { setSilentFlag } from '@/utils'
import { logger } from '@/utils'
import { options as coreOptions } from '../core/options'

// 初始化传进来的参数
export default function initOptions(options: InitOptions = {}) {
  // 设置监控哪些事件
  setSilentFlag(options)
  // 用户行为存放的最大容量，最大是100，当你配置超过100时，最终还是会设置成100，一方面是防止占更多的内存、一方面是保存超过100条用户行为没多大意义
  breadcrumb.bindOptions(options)
  // 默认不会在控制台打印用户行为和错误信息，为true时将会在控台打印
  logger.bindOptions(options.debug)
  // 设置 dsn, beforeDataReport, apikey, configReportXhr, backTrackerId
  transportData.bindOptions(options)
  // 设置 beforeAppAjaxSend, enableTraceId, filterXhrUrlRegExp, traceIdFieldName, includeHttpUrlTraceIdRegExp
  coreOptions.bindOptions(options)
}
