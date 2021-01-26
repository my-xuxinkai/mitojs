import { ERRORTYPES, BREADCRUMBTYPES } from '@/common/constant'
import { isError, extractErrorStack, getLocationHref, getTimestamp, unknownToString, isWxMiniEnv } from '../utils/index'
import { transportData } from './transportData'
import { breadcrumb } from './breadcrumb'
import { Severity } from '@/utils/Severity'
import { getCurrentRoute } from '@/wx-mini/utils'

interface LogTypes {
  message: string
  tag?: string
  level?: Severity
  ex?: any
}

/**
 * 自定义上报事件
 */
export function log({ message = 'emptyMsg', tag = '', level = Severity.Critical, ex = '' }: LogTypes): void {
  let errorInfo = {}
  if (isError(ex)) {
    errorInfo = extractErrorStack(ex, level)
  }
  const error = {
    type: ERRORTYPES.LOG_ERROR,
    level,
    message: unknownToString(message),
    name: 'MITO.log',
    customTag: unknownToString(tag),
    time: getTimestamp(),
    url: isWxMiniEnv ? getCurrentRoute() : getLocationHref(),
    ...errorInfo
  }
  breadcrumb.push({
    type: BREADCRUMBTYPES.CUSTOMER,
    category: breadcrumb.getCategory(BREADCRUMBTYPES.CUSTOMER),
    data: message,
    level: Severity.fromString(level.toString())
  })
  transportData.send(error)
}
