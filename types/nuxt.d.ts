/**
 * @FilePath: /nuxt_database/types/nuxt.d.ts
 * @Description: Nuxt 3 类型定义扩展
 */

import 'nuxt'
import 'h3'

declare module 'h3' {
  interface H3EventContext {
    /** 当前登录用户信息 */
    user?: {
      id: number
      username: string
      role: string
      email: string
    }
  }
}
