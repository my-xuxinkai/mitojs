import { ERRORTYPES } from '@/common/constant'
import { BreadcrumbPushData } from './breadcrumb'

//传递给服务端的数据结构
export interface TransportDataType {
  authInfo: AuthInfo
  breadcrumb: BreadcrumbPushData[]
  data: ReportDataType
  record?: any[]
}

export interface AuthInfo {
  apikey: string
  sdkVersion: string
  sdkName: string
  // 用户唯一标识
  // 为了方便统计用户量，在每次上报的时候会带一个唯一标识符trackerId，生成这个trackerId的途径有两种：
  // 1、如果你是用ajax上报的话，发现cookie中没有带trackerId这个字段，服务端生成并setCookie设置到用户端的cookie
  // 2、直接用SDK生成，在每次上报之前都判断localstorage是否存在trackerId，有则随着错误信息一起发送，没有的话生成一个并设置到localstorage
  trackerId: string
}

export interface ReportDataType {
  type?: ERRORTYPES
  message?: string
  url: string
  name?: string
  stack?: any
  time?: number
  errorId?: number
  level: string
  // ajax
  elapsedTime?: number
  request?: {
    httpType?: string
    traceId?: string
    method: string
    url: string
    data: any
  }
  response?: {
    status: number
    data: string
  }
  // vue
  componentName?: string
  propsData?: any
  // logError 手动报错 MITO.log
  customTag?: string
}
