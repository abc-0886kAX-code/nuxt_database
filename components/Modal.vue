<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click.self="handleOverlayClick"
      >
        <div class="modal-container" :class="sizeClass">
          <!-- 头部 -->
          <div v-if="showHeader" class="modal-header">
            <div class="modal-title">
              <slot name="header">
                <h2>{{ title }}</h2>
              </slot>
            </div>
            <button
              v-if="showClose"
              type="button"
              class="modal-close"
              @click="handleClose"
              aria-label="关闭"
            >
              ×
            </button>
          </div>

          <!-- 内容区域 -->
          <div class="modal-body" :class="bodyClass">
            <slot></slot>
          </div>

          <!-- 底部区域 -->
          <div v-if="showFooter || $slots.footer" class="modal-footer">
            <slot name="footer">
              <button
                type="button"
                class="btn-secondary"
                @click="handleClose"
              >
                关闭
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'full'].includes(value)
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  bodyClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'open'])

const sizeClass = computed(() => `modal-${props.size}`)

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose()
  }
}

// 监听打开事件
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    emit('open')
    // 禁止背景滚动
    document.body.style.overflow = 'hidden'
  } else {
    // 恢复背景滚动
    document.body.style.overflow = ''
  }
})

// 组件卸载时恢复滚动
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* 遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

/* 模态框容器 */
.modal-container {
  background: white;
  border-radius: 16px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 尺寸变体 */
.modal-small {
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
}

.modal-medium {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
}

.modal-large {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
}

.modal-full {
  width: 95%;
  max-width: 1400px;
  height: 90vh;
  max-height: 90vh;
}

/* 头部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.modal-title h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #6b7280;
  padding: 0;
}

.modal-close:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.modal-close:active {
  transform: scale(0.95);
}

/* 内容区域 */
.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

/* 底部 */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
  background: #f9fafb;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(-20px) scale(0.95);
}

/* 按钮样式 - 使用 :deep() 确保插槽中的按钮也能应用样式 */
:deep(.btn-secondary) {
  padding: 10px 20px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  color: #374151;
}

:deep(.btn-secondary:hover) {
  background: #f9fafb;
  border-color: #d1d5db;
}

:deep(.btn-primary) {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

:deep(.btn-primary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

:deep(.btn-danger) {
  padding: 10px 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

:deep(.btn-danger:hover) {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }

  .modal-small,
  .modal-medium,
  .modal-large {
    max-width: 100%;
  }

  .modal-full {
    width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer button {
    width: 100%;
  }
}
</style>
