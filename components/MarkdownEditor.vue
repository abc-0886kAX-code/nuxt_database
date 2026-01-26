<template>
  <div class="markdown-editor">
    <!-- 工具栏 -->
    <div class="editor-toolbar">
      <button
        v-for="tool in tools"
        :key="tool.name"
        type="button"
        @click="tool.action"
        class="toolbar-btn"
        :title="tool.title"
        v-html="tool.icon"
      ></button>

      <div class="toolbar-divider"></div>

      <label class="toolbar-btn" title="插入图片">
        <input
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          ref="fileInput"
          style="display: none"
        />
        🖼️
      </label>
    </div>

    <!-- 编辑器容器 -->
    <div class="editor-container">
      <!-- 编辑区域 -->
      <div class="editor-pane">
        <textarea
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          @keydown="handleKeydown"
          @scroll="syncScroll"
          class="editor-textarea"
          placeholder="在这里输入 Markdown 内容..."
          ref="editorRef"
        ></textarea>
      </div>

      <!-- 预览区域 -->
      <div class="preview-pane" @scroll="syncScroll" ref="previewRef">
        <div class="markdown-content" v-html="renderedContent"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

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

const editorRef = ref(null)
const previewRef = ref(null)
const fileInput = ref(null)

// 渲染后的内容
const renderedContent = computed(() => {
  return marked(props.modelValue || '')
})

// 工具栏配置
const tools = [
  {
    name: 'bold',
    title: '粗体',
    icon: '<strong>B</strong>',
    action: () => insertText('**', '**')
  },
  {
    name: 'italic',
    title: '斜体',
    icon: '<em>I</em>',
    action: () => insertText('*', '*')
  },
  {
    name: 'heading',
    title: '标题',
    icon: 'H',
    action: () => insertText('## ', '')
  },
  {
    name: 'quote',
    title: '引用',
    icon: '"',
    action: () => insertText('> ', '')
  },
  {
    name: 'code',
    title: '代码块',
    icon: '&lt;/&gt;',
    action: () => insertText('```\n', '\n```')
  },
  {
    name: 'link',
    title: '链接',
    icon: '🔗',
    action: () => insertText('[', '](url)')
  },
  {
    name: 'list',
    title: '列表',
    icon: '☰',
    action: () => insertText('- ', '')
  },
  {
    name: 'table',
    title: '表格',
    icon: '▦',
    action: () => {
      const table = '\n| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| 内容 | 内容 | 内容 |\n'
      insertText(table, '')
    }
  }
]

// 插入文本
const insertText = (before, after) => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = props.modelValue
  const selectedText = text.substring(start, end)

  const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
  emit('update:modelValue', newText)

  // 设置光标位置
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
  }, 0)
}

// 处理图片上传
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) {
    return
  }

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      const imageMarkdown = `
![${file.name}](${data.data.url})
`
      insertText(imageMarkdown, '')
    } else {
      alert(data.message || '上传失败')
    }
  } catch (error) {
    alert('上传失败，请稍后重试')
  }

  // 重置文件输入
  event.target.value = ''
}

// 处理快捷键
const handleKeydown = (event) => {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  // Tab 键插入两个空格
  if (event.key === 'Tab') {
    event.preventDefault()
    insertText('  ', '')
  }

  // Ctrl/Cmd + B 粗体
  if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
    event.preventDefault()
    insertText('**', '**')
  }

  // Ctrl/Cmd + I 斜体
  if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
    event.preventDefault()
    insertText('*', '*')
  }

  // Ctrl/Cmd + K 链接
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    insertText('[', '](url)')
  }
}

// 同步滚动
let isScrolling = false
const syncScroll = (event) => {
  if (isScrolling) return

  isScrolling = true
  const target = event.target
  const other = target === editorRef.value ? previewRef.value : editorRef.value

  if (!other) return

  const percentage = target.scrollTop / (target.scrollHeight - target.clientHeight)
  other.scrollTop = percentage * (other.scrollHeight - other.clientHeight)

  setTimeout(() => {
    isScrolling = false
  }, 100)
}
</script>

<style scoped>
.markdown-editor {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
  padding: 0;
}

.toolbar-btn:hover {
  background: #f3f4f6;
  border-color: #667eea;
}

.toolbar-btn:active {
  background: #e5e7eb;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 4px;
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 650px;
}

.editor-pane,
.preview-pane {
  overflow: auto;
  height: 650px;
}

.editor-pane {
  border-right: 1px solid #e5e7eb;
}

.editor-textarea {
  width: 100%;
  height: 100%;
  border: none;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.markdown-content {
  padding: 16px;
  line-height: 1.8;
  color: #1f2937;
}

/* Markdown 内容样式 */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content :deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
}

.markdown-content :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
}

.markdown-content :deep(h3) {
  font-size: 1.25em;
}

.markdown-content :deep(p) {
  margin-bottom: 16px;
}

.markdown-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 16px 0;
}

.markdown-content :deep(code) {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9em;
}

.markdown-content :deep(pre) {
  background: #f6f8fa;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 14px;
  line-height: 1.6;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #667eea;
  padding-left: 16px;
  color: #6b7280;
  margin-bottom: 16px;
  font-style: italic;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-bottom: 16px;
  padding-left: 24px;
}

.markdown-content :deep(li) {
  margin-bottom: 8px;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
  text-align: left;
}

.markdown-content :deep(th) {
  background: #f9fafb;
  font-weight: 600;
}

.markdown-content :deep(a) {
  color: #667eea;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 24px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-container {
    grid-template-columns: 1fr;
  }

  .editor-pane {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .editor-pane,
  .preview-pane {
    height: 300px;
  }
}
</style>
