import { query, queryOne, insert, update, del } from '~/server/config/database'

export interface Post {
  id?: number
  title: string
  content: string
  excerpt?: string
  author_id: number
  author_name: string
  category?: string
  tags?: string
  status?: 'published' | 'draft' | 'archived'
  view_count?: number
  created_at?: Date
  updated_at?: Date
}

export interface PostFilters {
  status?: 'published' | 'draft' | 'archived'
  category?: string
  author_id?: number
  search?: string
  page?: number
  pageSize?: number
}

// 创建文章
export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const sql = `
    INSERT INTO posts (title, content, excerpt, author_id, author_name, category, tags, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `
  const result = await insert(sql, [
    post.title,
    post.content,
    post.excerpt || null,
    post.author_id,
    post.author_name,
    post.category || null,
    post.tags || null,
    post.status || 'draft'
  ])
  return result.insertId
}

// 获取文章列表（分页）
export async function getPosts(filters: PostFilters = {}): Promise<{
  posts: Post[]
  total: number
}> {
  // 确保类型正确
  const page = Number(filters.page) || 1
  const pageSize = Number(filters.pageSize) || 10
  const offset = (page - 1) * pageSize

  const whereConditions: string[] = []
  const params: any[] = []

  if (filters.status) {
    whereConditions.push('status = ?')
    params.push(filters.status)
  }

  if (filters.category) {
    whereConditions.push('category = ?')
    params.push(filters.category)
  }

  if (filters.author_id) {
    whereConditions.push('author_id = ?')
    params.push(Number(filters.author_id))
  }

  if (filters.search) {
    whereConditions.push('(title LIKE ? OR content LIKE ?)')
    params.push(`%${filters.search}%`, `%${filters.search}%`)
  }

  // 构建 WHERE 子句
  const whereClause = whereConditions.length > 0 ? ` WHERE ${whereConditions.join(' AND ')}` : ''

  // 获取总数
  const countSql = `SELECT COUNT(*) as total FROM posts${whereClause}`
  const countResult = await queryOne<{ total: number }>(countSql, params)
  const total = countResult?.total || 0

  // 获取数据 - 直接在SQL中使用数字，不使用占位符
  // 这样可以避免某些MySQL版本的参数化查询问题
  const dataSql = `SELECT id, title, content, excerpt, author_id, author_name, category, tags, status, view_count, created_at, updated_at FROM posts${whereClause} ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${offset}`
  // const dataSql = `SELECT id, title, content, excerpt, author_id, author_name, category, tags, status, view_count, created_at, updated_at FROM posts${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`


  const posts = await query<Post>(dataSql, params)

  return {
    posts,
    total
  }
}

// 获取单个文章
export async function getPostById(id: number): Promise<Post | null> {
  const sql = `
    SELECT id, title, content, excerpt, author_id, author_name, category, tags,
           status, view_count, created_at, updated_at
    FROM posts
    WHERE id = ?
  `
  return await queryOne<Post>(sql, [id])
}

// 更新文章
export async function updatePost(
  id: number,
  post: Partial<Omit<Post, 'id' | 'author_id' | 'author_name' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  const fields: string[] = []
  const params: any[] = []

  if (post.title !== undefined) {
    fields.push('title = ?')
    params.push(post.title)
  }

  if (post.content !== undefined) {
    fields.push('content = ?')
    params.push(post.content)
  }

  if (post.excerpt !== undefined) {
    fields.push('excerpt = ?')
    params.push(post.excerpt)
  }

  if (post.category !== undefined) {
    fields.push('category = ?')
    params.push(post.category)
  }

  if (post.tags !== undefined) {
    fields.push('tags = ?')
    params.push(post.tags)
  }

  if (post.status !== undefined) {
    fields.push('status = ?')
    params.push(post.status)
  }

  if (post.view_count !== undefined) {
    fields.push('view_count = ?')
    params.push(post.view_count)
  }

  if (fields.length === 0) return false

  params.push(id)
  const sql = `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`
  const result = await update(sql, params)

  return result.affectedRows > 0
}

// 删除文章
export async function deletePost(id: number): Promise<boolean> {
  const sql = 'DELETE FROM posts WHERE id = ?'
  const result = await del(sql, [id])
  return result.affectedRows > 0
}

// 增加文章浏览量
export async function incrementPostViews(id: number): Promise<void> {
  const sql = 'UPDATE posts SET view_count = view_count + 1 WHERE id = ?'
  await update(sql, [id])
}

// 获取文章统计信息
export async function getPostStats(): Promise<{
  total: number
  published: number
  draft: number
  archived: number
  totalViews: number
}> {
  const sql = `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
      SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
      SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived,
      SUM(view_count) as totalViews
    FROM posts
  `
  const result = await queryOne<any>(sql)

  return {
    total: result?.total || 0,
    published: result?.published || 0,
    draft: result?.draft || 0,
    archived: result?.archived || 0,
    totalViews: result?.totalViews || 0
  }
}

// 获取所有分类
export async function getCategories(): Promise<string[]> {
  const sql = `
    SELECT DISTINCT category
    FROM posts
    WHERE category IS NOT NULL AND category != ''
    ORDER BY category
  `
  const rows = await query<{ category: string }>(sql)
  return rows.map(row => row.category)
}

// 获取作者的文章统计
export async function getAuthorPostStats(authorId: number): Promise<{
  total: number
  published: number
  totalViews: number
}> {
  const sql = `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
      SUM(view_count) as totalViews
    FROM posts
    WHERE author_id = ?
  `
  const result = await queryOne<any>(sql, [authorId])

  return {
    total: result?.total || 0,
    published: result?.published || 0,
    totalViews: result?.totalViews || 0
  }
}
