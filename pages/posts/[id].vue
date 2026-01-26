<template>
  <div class="post-detail-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 文章内容 -->
    <div v-else-if="post" class="post-detail">
      <!-- 返回按钮 -->
      <button @click="goBack" class="back-btn">
        ← 返回列表
      </button>

      <!-- 文章主体 -->
      <article class="article">
        <!-- 文章头部 -->
        <header class="article-header">
          <h1 class="article-title">{{ post.title }}</h1>

          <div class="article-meta">
            <span class="meta-item" v-if="post.author_name">
              <span class="icon">👤</span>
              {{ post.author_name }}
            </span>
            <span class="meta-item" v-if="post.category">
              <span class="icon">📁</span>
              {{ post.category }}
            </span>
            <span class="meta-item">
              <span class="icon">📅</span>
              {{ formatDate(post.created_at) }}
            </span>
            <span class="meta-item" v-if="post.view_count !== undefined">
              <span class="icon">👁️</span>
              {{ post.view_count }} 次浏览
            </span>
          </div>

          <!-- 文章标签 -->
          <div class="article-tags" v-if="post.tags">
            <span v-for="tag in post.tags.split(',')" :key="tag" class="tag">
              {{ tag.trim() }}
            </span>
          </div>
        </header>

        <!-- 文章摘要 -->
        <div class="article-excerpt" v-if="post.excerpt">
          {{ post.excerpt }}
        </div>

        <!-- Markdown 渲染内容 -->
        <div class="article-content markdown-body" v-html="renderedContent"></div>
      </article>

      <!-- 文章底部操作 -->
      <div class="article-footer">
        <div class="article-actions">
          <button @click="sharePost" class="action-btn">
            🔗 分享
          </button>
          <button @click="likePost" class="action-btn" :class="{ liked: isLiked }">
            {{ isLiked ? '❤️' : '🤍' }} 点赞
          </button>
        </div>
      </div>

      <!-- 相关文章推荐 -->
      <div class="related-posts" v-if="relatedPosts.length > 0">
        <h3>相关文章</h3>
        <div class="related-posts-list">
          <div
            v-for="relatedPost in relatedPosts"
            :key="relatedPost.id"
            @click="goToPost(relatedPost.id)"
            class="related-post-item"
          >
            <h4>{{ relatedPost.title }}</h4>
            <p class="related-post-excerpt">
              {{ relatedPost.excerpt || relatedPost.content.substring(0, 100) + '...' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else class="error-state">
      <div class="error-icon">❌</div>
      <h3>文章不存在</h3>
      <p>该文章可能已被删除或不存在</p>
      <button @click="goBack" class="btn-primary">返回列表</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const loading = ref(true)
const isLiked = ref(false)
const relatedPosts = ref([])

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

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  if (!post.value) return ''
  return marked(post.value.content || '')
})

// 获取文章详情
const fetchPost = async () => {
  loading.value = true
  try {
    const response = await fetch(`/api/posts/${route.params.id}`)
    const data = await response.json()

    if (data.success) {
      post.value = data.data
      // 增加浏览量
      await incrementViewCount(route.params.id)
      // 获取相关文章
      await fetchRelatedPosts(post.value.category, post.value.id)
    } else {
      post.value = null
    }
  } catch (error) {
    console.error('获取文章失败:', error)
    post.value = null
  } finally {
    loading.value = false
  }
}

// 增加浏览量
const incrementViewCount = async (postId) => {
  try {
    await fetch(`/api/posts/${postId}/view`, { method: 'POST' })
  } catch (error) {
    console.error('增加浏览量失败:', error)
  }
}

// 获取相关文章
const fetchRelatedPosts = async (category, currentId) => {
  if (!category) return

  try {
    const response = await fetch(`/api/posts?category=${category}&limit=3`)
    const data = await response.json()

    if (data.success) {
      relatedPosts.value = data.data.posts.filter(p => p.id !== currentId).slice(0, 3)
    }
  } catch (error) {
    console.error('获取相关文章失败:', error)
  }
}

// 返回列表
const goBack = () => {
  router.push('/posts')
}

// 跳转到指定文章
const goToPost = (postId) => {
  router.push(`/posts/${postId}`)
  window.scrollTo(0, 0)
  fetchPost()
}

// 分享文章
const sharePost = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: post.value.title,
        text: post.value.excerpt,
        url: window.location.href
      })
    } catch (error) {
      // 用户取消分享，不做处理
    }
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('链接已复制到剪贴板')
    }).catch(() => {
      alert('复制失败，请手动复制链接')
    })
  }
}

// 点赞文章
const likePost = () => {
  isLiked.value = !isLiked.value
  // 这里可以调用 API 保存点赞状态
  if (isLiked.value) {
    alert('感谢点赞！')
  }
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchPost()
})
</script>

<style scoped>
.post-detail-page {
  min-height: 100vh;
  background: #f9fafb;
  padding: 20px;
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

.post-detail {
  max-width: 900px;
  margin: 0 auto;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 24px;
}

.back-btn:hover {
  background: #f9fafb;
  border-color: #667eea;
  color: #667eea;
}

.article {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.article-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.article-title {
  font-size: 2.5em;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
}

.meta-item .icon {
  font-size: 16px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  color: #667eea;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.article-excerpt {
  font-size: 1.2em;
  line-height: 1.7;
  color: #4b5563;
  font-style: italic;
  margin-bottom: 32px;
  padding: 20px;
  background: #f9fafb;
  border-left: 4px solid #667eea;
  border-radius: 8px;
}

.article-content {
  font-size: 16px;
  line-height: 1.8;
  color: #1f2937;
}

/* Markdown 样式 */
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin-top: 32px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: #1f2937;
}

.markdown-body :deep(h1) {
  font-size: 2em;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 12px;
}

.markdown-body :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
}

.markdown-body :deep(h3) {
  font-size: 1.25em;
}

.markdown-body :deep(p) {
  margin-bottom: 16px;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 12px;
  margin: 24px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.markdown-body :deep(code) {
  background: #f3f4f6;
  padding: 3px 8px;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
  color: #e83e8c;
}

.markdown-body :deep(pre) {
  background: #1f2937;
  border-radius: 12px;
  padding: 20px;
  overflow-x: auto;
  margin-bottom: 24px;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: #f9fafb;
  font-size: 14px;
  line-height: 1.6;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid #667eea;
  padding-left: 20px;
  color: #6b7280;
  margin: 24px 0;
  font-style: italic;
  background: #f9fafb;
  padding: 16px 20px;
  border-radius: 8px;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin-bottom: 16px;
  padding-left: 28px;
}

.markdown-body :deep(li) {
  margin-bottom: 10px;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 12px 16px;
  text-align: left;
}

.markdown-body :deep(th) {
  background: #f9fafb;
  font-weight: 600;
  color: #1f2937;
}

.markdown-body :deep(tr:hover) {
  background: #f9fafb;
}

.markdown-body :deep(a) {
  color: #667eea;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s;
}

.markdown-body :deep(a:hover) {
  border-bottom-color: #667eea;
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 32px 0;
}

.article-footer {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.article-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-btn {
  padding: 12px 24px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.action-btn.liked {
  border-color: #ef4444;
  color: #ef4444;
}

.related-posts {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.related-posts h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
}

.related-posts-list {
  display: grid;
  gap: 16px;
}

.related-post-item {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.related-post-item:hover {
  border-color: #667eea;
  background: #f9fafb;
  transform: translateX(4px);
}

.related-post-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.related-post-excerpt {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.error-state h3 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #1f2937;
}

.btn-primary {
  margin-top: 24px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article {
    padding: 24px;
  }

  .article-title {
    font-size: 1.8em;
  }

  .article-excerpt {
    font-size: 1em;
    padding: 16px;
  }

  .markdown-body :deep(h1) {
    font-size: 1.5em;
  }

  .markdown-body :deep(h2) {
    font-size: 1.3em;
  }

  .related-posts {
    padding: 20px;
  }
}
</style>
