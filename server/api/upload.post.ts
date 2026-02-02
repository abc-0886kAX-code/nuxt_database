/*
 * @FilePath: /nuxt_database/server/api/upload.post.ts
 * @Author: abc-0886kAX-code
 * @Date: 2026-01-26 10:55:09
 * @LastEditors: abc-0886kAX-code
 * @LastEditTime: 2026-01-26 13:22:39
 * @Description: 
 */
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const isPro = process.env.NODE_ENV === 'production'

export default defineEventHandler(async (event) => {
  try {
    // 使用 Nuxt 3 内置的 multipart/form-data 解析
    const formData = await readFormData(event)

    // 获取上传的文件
    const file = formData.get('file')

    if (!file) {
      return {
        success: false,
        message: '未找到上传的文件'
      }
    }

    // 验证文件类型
    const filename = file.name
    const ext = path.extname(filename).toLowerCase()
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

    if (!allowedExts.includes(ext)) {
      return {
        success: false,
        message: `不支持的文件类型: ${ext}，仅支持 JPG、PNG、GIF、WebP`
      }
    }

    // 生成唯一文件名
    const newFilename = `${randomUUID()}${ext}`

    // 确保 uploads 目录存在
    // 根据环境判断正确的 public/uploads 路径
    let uploadsDir
    if (isPro) {
      // 生产环境：.output/server -> .output/public/uploads
      uploadsDir = path.join(process.cwd(), '..', 'files', 'uploads')
    } else {
      // 开发环境：项目根目录 -> public/uploads
      uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    }

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const filepath = path.join(uploadsDir, newFilename)

    // 将文件保存到磁盘
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    fs.writeFileSync(filepath, buffer)

    // 返回文件信息
    return {
      success: true,
      message: '上传成功',
      data: {
        url: isPro ? `${process.env.UPLOAD_ADRES}/uploads/${newFilename}` : `/uploads/${newFilename}`,
        filename: newFilename,
        size: buffer.length,
        originalName: filename
      }
    }

  } catch (error) {
    console.error('文件上传异常:', error)
    return {
      success: false,
      message: `文件上传失败: ${error.message}`
    }
  }
})
