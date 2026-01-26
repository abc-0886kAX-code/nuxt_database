<template>
  <div class="posts-page">
    <div class="page-header">
      <h1>文章管理</h1>
      <button @click="openCreateModal" class="btn-primary">
        <span class="icon">+</span>
        新建文章
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-info">
          <div class="stat-label">全部文章</div>
          <div class="stat-value">{{ stats.total }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <div class="stat-label">已发布</div>
          <div class="stat-value">{{ stats.published }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-info">
          <div class="stat-label">草稿</div>
          <div class="stat-value">{{ stats.draft }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👁️</div>
        <div class="stat-info">
          <div class="stat-label">总浏览量</div>
          <div class="stat-value">{{ stats.totalViews }}</div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filters">
      <div class="search-box">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="搜索标题或内容..."
          class="search-input"
        />
      </div>
      <select v-model="statusFilter" @change="fetchPosts" class="filter-select">
        <option value="">全部状态</option>
        <option value="published">已发布</option>
        <option value="draft">草稿</option>
        <option value="archived">已归档</option>
      </select>
    </div>

    <!-- 文章列表 -->
    <div class="posts-container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="posts.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>暂无文章</h3>
        <p>点击"新建文章"按钮创建第一篇文章</p>
      </div>

      <div v-else class="posts-list">
        <div
          v-for="post in posts"
          :key="post.id"
          class="post-item"
          :class="`status-${post.status}`"
        >
          <div class="post-main">
            <h3 class="post-title">{{ post.title }}</h3>
            <div class="post-meta">
              <span class="meta-item" v-if="post.category">
                <span class="icon">📁</span>
                {{ post.category }}
              </span>
              <span class="meta-item">
                <span class="icon">📅</span>
                {{ formatDate(post.created_at) }}
              </span>
            </div>
          </div>

          <div class="post-actions">
            <span class="status-badge" :class="post.status">
              {{ getStatusText(post.status) }}
            </span>
            <button @click="viewPost(post.id)" class="btn-icon" title="查看详情">
              👁️
            </button>
            <button @click="editPost(post)" class="btn-icon" title="编辑">
              ✏️
            </button>
            <button @click="deletePost(post.id)" class="btn-icon btn-danger" title="删除">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="total > pageSize" class="pagination">
        <button
          @click="currentPage > 1 && fetchPosts(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="page-btn"
        >
          上一页
        </button>
        <span class="page-info">
          第 {{ currentPage }} 页，共 {{ Math.ceil(total / pageSize) }} 页
        </span>
        <button
          @click="currentPage < Math.ceil(total / pageSize) && fetchPosts(currentPage + 1)"
          :disabled="currentPage >= Math.ceil(total / pageSize)"
          class="page-btn"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 创建/编辑文章模态框 -->
    <Modal
      v-model="showCreateModal"
      :title="showEditModal ? '编辑文章' : '新建文章'"
      size="full"
    >
      <form id="postForm" @submit.prevent="savePost" class="post-form">
        <div class="form-group">
          <label>标题 *</label>
          <input
            v-model="formData.title"
            type="text"
            required
            placeholder="请输入文章标题"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>摘要</label>
          <textarea
            v-model="formData.excerpt"
            rows="2"
            placeholder="请输入文章摘要（可选）"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-group">
          <label>内容 * <span class="label-tip">（支持 Markdown 格式）</span></label>
          <MarkdownEditor
            v-model="formData.content"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>分类</label>
            <select
              v-model="formData.category"
              class="form-select"
            >
              <option value="">请选择分类</option>
              <option value="技术">技术</option>
              <option value="生活">生活</option>
              <option value="随笔">随笔</option>
              <option value="教程">教程</option>
            </select>
          </div>

          <div class="form-group">
            <label>标签</label>
            <select
              v-model="formData.tags"
              class="form-select"
            >
              <option value="">请选择标签</option>
              <option value="前端">前端</option>
              <option value="后端">后端</option>
              <option value="数据库">数据库</option>
              <option value="算法">算法</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>状态</label>
          <select v-model="formData.status" class="form-select">
            <option value="draft">草稿</option>
            <option value="published">发布</option>
            <option value="archived">归档</option>
          </select>
        </div>
      </form>

      <template #footer>
        <button type="button" @click="closeModal" class="btn-secondary">
          取消
        </button>
        <button type="button" @click="previewPost" class="btn-secondary" :disabled="!formData.content">
          预览
        </button>
        <button type="submit" form="postForm" class="btn-primary">
          {{ showEditModal ? '保存修改' : '创建文章' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

// 配置 marked
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (__) {}
    }
    return hljs.highlightAuto(code).value
  },
  langPrefix: 'hljs language-',
  breaks: true,
  gfm: true
})

// 响应式数据
const posts = ref([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const stats = ref({
  total: 0,
  published: 0,
  draft: 0,
  archived: 0,
  totalViews: 0
})

const showCreateModal = ref(false)
const showEditModal = ref(false)
const currentPostId = ref(null)
const formData = ref({
  title: '',
  content: '',
  excerpt: '',
  category: '',
  tags: '',
  status: 'draft'
})

// 获取文章统计
const fetchStats = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/posts/stats', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
    const data = await response.json()
    if (data.success) {
      stats.value = data.data
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取文章列表
const fetchPosts = async (page = 1) => {
  loading.value = true
  currentPage.value = page

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.value.toString()
    })

    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }

    if (statusFilter.value) {
      params.append('status', statusFilter.value)
    }

    const response = await fetch(`/api/posts?${params}`)
    const data = await response.json()

    if (data.success) {
      posts.value = data.data.posts
      total.value = data.data.total
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索处理（防抖）
let searchTimeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchPosts(1)
  }, 500)
}

// 查看文章详情
const viewPost = (postId) => {
  navigateTo(`/posts/${postId}`)
}

// 打开新建文章模态框
const openCreateModal = () => {
  // 重置表单数据
  currentPostId.value = null
  formData.value = {
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'draft'
  }
  showEditModal.value = false
  showCreateModal.value = true
}

// 编辑文章
const editPost = (post) => {
  currentPostId.value = post.id
  formData.value = {
    title: post.title,
    content: post.content,
    excerpt: post.excerpt || '',
    category: post.category || '',
    tags: post.tags || '',
    status: post.status
  }
  showEditModal.value = true
  showCreateModal.value = true
}

// 监听编辑模态框关闭
watch(showEditModal, (newValue) => {
  if (!newValue) {
    showCreateModal.value = false
  }
})

// 保存文章
const savePost = async () => {
  try {
    const url = showEditModal.value ? `/api/posts/${currentPostId.value}` : '/api/posts'
    const method = showEditModal.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    })

    const data = await response.json()

    if (data.success) {
      alert(showEditModal.value ? '更新成功！' : '创建成功！')
      closeModal()
      fetchPosts(currentPage.value)
      fetchStats()
    } else {
      alert(data.message || '操作失败')
    }
  } catch (error) {
    console.error('保存文章失败:', error)
    alert('操作失败，请稍后重试')
  }
}

// 删除文章
const deletePost = async (id) => {
  if (!confirm('确定要删除这篇文章吗？')) return

  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE'
    })

    const data = await response.json()

    if (data.success) {
      alert('删除成功！')
      fetchPosts(currentPage.value)
      fetchStats()
    } else {
      alert(data.message || '删除失败')
    }
  } catch (error) {
    console.error('删除文章失败:', error)
    alert('删除失败，请稍后重试')
  }
}

// 关闭模态框
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  currentPostId.value = null
  formData.value = {
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'draft'
  }
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    published: '已发布',
    draft: '草稿',
    archived: '已归档'
  }
  return statusMap[status] || status
}

// 预览文章
const previewPost = () => {
  if (!formData.value.content) return

  // 渲染 markdown 内容
  const renderedContent = marked(formData.value.content || '')

  // 打开新窗口预览
  const previewWindow = window.open('', '_blank')
  previewWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${formData.value.title || '无标题'} - 预览</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          background: #f9fafb;
        }
        .preview-container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        h1 { font-size: 2.5em; margin-bottom: 0.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
        h2 { font-size: 2em; margin-top: 1.5em; margin-bottom: 0.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
        h3 { font-size: 1.5em; margin-top: 1.2em; margin-bottom: 0.5em; }
        .meta { color: #666; margin-bottom: 2em; padding-bottom: 1em; border-bottom: 1px solid #eee; }
        .meta-item { margin-right: 20px; }
        p { margin-bottom: 1em; }
        img { max-width: 100%; border-radius: 8px; }
        pre { background: #f6f8fa; padding: 16px; border-radius: 8px; overflow-x: auto; margin-bottom: 1em; }
        code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
        pre code { background: none; padding: 0; }
        blockquote { border-left: 4px solid #667eea; padding-left: 16px; color: #666; margin: 1em 0; }
        table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
        th { background: #f9fafb; font-weight: 600; }
        ul, ol { margin-bottom: 1em; padding-left: 24px; }
        a { color: #667eea; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="preview-container">
        <h1>${formData.value.title || '无标题'}</h1>
        <div class="meta">
          <span class="meta-item">👤 ${currentPostId.value ? formData.value.author_name || '作者' : '当前用户'}</span>
          ${formData.value.category ? `<span class="meta-item">📁 ${formData.value.category}</span>` : ''}
          <span class="meta-item">📅 ${new Date().toLocaleDateString('zh-CN')}</span>
        </div>
        ${formData.value.excerpt ? `<p style="font-size: 1.1em; color: #666; font-style: italic; margin-bottom: 2em;">${formData.value.excerpt}</p>` : ''}
        <div class="content">
          ${renderedContent}
        </div>
      </div>
    </body>
    </html>
  `)
  previewWindow.document.close()
}

// 页面加载时获取数据
onMounted(() => {
  fetchPosts()
  fetchStats()
})
</script>

<style scoped>
.posts-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary .icon {
  font-size: 18px;
  font-weight: bold;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 36px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 12px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
}

/* 筛选器 */
.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

/* 文章列表 */
.posts-container {
  min-height: 400px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #1f2937;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  border-left: 4px solid #e5e7eb;
}

.post-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.post-item.status-published {
  border-left-color: #10b981;
}

.post-item.status-draft {
  border-left-color: #f59e0b;
}

.post-item.status-archived {
  border-left-color: #6b7280;
}

.post-main {
  flex: 1;
  min-width: 0;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #6b7280;
}

.meta-item .icon {
  font-size: 14px;
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.published {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.draft {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.archived {
  background: #f3f4f6;
  color: #374151;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: #e5e7eb;
  transform: scale(1.1);
}

.btn-icon.btn-danger:hover {
  background: #fee2e2;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding: 16px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #6b7280;
}

/* 表单样式 */
.post-form {
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.label-tip {
  font-size: 12px;
  font-weight: 400;
  color: #9ca3af;
  margin-left: 4px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  max-width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .posts-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-header h1 {
    font-size: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .post-item {
    flex-direction: row;
    align-items: center;
    padding: 12px;
  }

  .post-title {
    font-size: 14px;
  }

  .post-meta {
    gap: 8px;
  }

  .meta-item {
    font-size: 12px;
  }

  .post-actions {
    padding-top: 0;
    border-top: none;
  }
}
</style>
