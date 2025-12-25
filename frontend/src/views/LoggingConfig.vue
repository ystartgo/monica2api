<template>
  <div class="page-layout compact">
    <!-- 日志系统状态卡片 -->
    <div class="status-row">
      <div class="status-card">
        <div class="status-icon" :class="getLogLevelClass(form.logging.level)">
          <el-icon><Document /></el-icon>
        </div>
        <h3 class="status-title">{{ $t('logging.statusLevel') }}</h3>
        <p class="status-description">
          <el-tag :type="getLogLevelTag(form.logging.level)" size="large">
            {{ form.logging.level.toUpperCase() }}
          </el-tag>
        </p>
      </div>
      
      <div class="status-card success">
        <div class="status-icon success">
          <el-icon><FolderOpened /></el-icon>
        </div>
        <h3 class="status-title">{{ $t('logging.statusFile') }}</h3>
        <p class="status-description">{{ formatFileSize(logFileSize) }}</p>
      </div>
      
      <div class="status-card" :class="form.logging.enableRequestLog ? 'warning' : 'info'">
        <div class="status-icon" :class="form.logging.enableRequestLog ? 'warning' : 'info'">
          <el-icon><Warning /></el-icon>
        </div>
        <h3 class="status-title">{{ $t('logging.statusDetail') }}</h3>
        <p class="status-description">
          <el-tag :type="form.logging.enableRequestLog ? 'warning' : 'info'" size="large">
            {{ form.logging.enableRequestLog ? $t('logging.enabled') : $t('logging.disabled') }}
          </el-tag>
        </p>
      </div>
    </div>

    <!-- 配置表单区域 -->
    <div class="config-grid">
      <div class="config-card">
        <div class="config-card-header">
          <el-icon><Setting /></el-icon>
          <div>
            <h3 class="config-card-title">{{ $t('logging.basicTitle') }}</h3>
            <p class="config-card-description">{{ $t('logging.basicDesc') }}</p>
          </div>
        </div>
        
        <el-form :model="form" label-width="120px" size="large" class="form-large">
          <el-form-item :label="$t('logging.level')">
            <el-select v-model="form.logging.level" :placeholder="$t('logging.levelSelect')" style="width: 100%">
              <el-option :label="$t('logging.levelDebug')" value="debug" />
              <el-option :label="$t('logging.levelInfo')" value="info" />
              <el-option :label="$t('logging.levelWarn')" value="warn" />
              <el-option :label="$t('logging.levelError')" value="error" />
            </el-select>
          </el-form-item>
          
          <el-form-item :label="$t('logging.format')">
            <el-select v-model="form.logging.format" :placeholder="$t('logging.formatSelect')" style="width: 100%">
              <el-option :label="$t('logging.formatJson')" value="json" />
              <el-option :label="$t('logging.formatConsole')" value="console" />
            </el-select>
          </el-form-item>
          
          <el-form-item :label="$t('logging.output')">
            <el-input 
              v-model="outputDisplay" 
              readonly 
              :placeholder="$t('logging.outputFile')"
            >
              <template #prefix>
                <el-icon><Document /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item :label="$t('logging.mask')">
            <el-switch 
              v-model="form.logging.maskSensitive"
              :active-text="$t('logging.maskActive')"
              :inactive-text="$t('logging.maskInactive')"
              size="large"
            />
          </el-form-item>
        </el-form>
      </div>
      
      <div class="config-card">
        <div class="config-card-header">
          <el-icon><Tools /></el-icon>
          <div>
            <h3 class="config-card-title">{{ $t('logging.advancedTitle') }}</h3>
            <p class="config-card-description">{{ $t('logging.advancedDesc') }}</p>
          </div>
        </div>
        
        <el-form :model="form" label-width="120px" size="large" class="form-large">
          <el-form-item :label="$t('logging.detailLog')">
            <el-switch 
              v-model="form.logging.enableRequestLog"
              :active-text="$t('logging.enable')"
              :inactive-text="$t('logging.disable')"
              size="large"
              @change="onRequestLogChange"
            />
            <el-button 
              v-if="form.logging.enableRequestLog"
              type="text" 
              @click="showDetails = !showDetails"
              class="ml-sm"
            >
              <el-icon><View /></el-icon>
              {{ showDetails ? $t('logging.hideDetail') : $t('logging.viewDetail') }}
            </el-button>
          </el-form-item>
            
            <!-- 可折叠的详细信息 -->
            <el-collapse-transition>
              <div v-show="showDetails && form.logging.enableRequestLog" class="details-alert">
                <el-alert 
                  type="warning" 
                  :closable="false"
                  :title="$t('logging.detailTitle')"
                >
                  <template #default>
                    <div class="details-content">
                      <p><strong>{{ $t('logging.detailContent') }}</strong></p>
                      <ul>
                        <li>{{ $t('logging.detailItem1') }}</li>
                        <li>{{ $t('logging.detailItem2') }}</li>
                        <li>{{ $t('logging.detailItem3') }}</li>
                        <li>{{ $t('logging.detailItem4') }}</li>
                      </ul>
                      <p class="warning-text">
                        <el-icon><WarningFilled /></el-icon>
                        {{ $t('logging.detailWarn') }}
                      </p>
                    </div>
                  </template>
                </el-alert>
              </div>
            </el-collapse-transition>
            
            <el-divider />
            
            <!-- 日志文件管理 -->
            <div class="file-management">
              <el-form-item :label="$t('logging.filePath')">
              <el-input v-model="logFilePath" readonly size="small">
                <template #append>
                  <el-button @click="openLogDirectory" size="small">
                    <el-icon><FolderOpened /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('logging.fileSize')">
              <el-input v-model="logFileSize" readonly size="small">
                <template #append>
                  <el-button 
                    @click="clearLogFile" 
                    type="danger" 
                    size="small"
                    :disabled="logFileSize === $t('logging.fileNotExist') || logFileSize === '0 B'"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
              
            </div>
          </el-form>
        </div>
      </div>
    
    <!-- 保存配置按钮 -->
    <div class="save-section">
      <button class="btn btn-primary" @click="saveConfig" :loading="loading">
        <el-icon><Check /></el-icon>
        {{ $t('config.save') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Check, FolderOpened, Delete, Setting, Tools, Document, Warning, WarningFilled, View } from '@element-plus/icons-vue'
import {UpdateConfig,GetConfig,OpenLogDirectory,GetLogFilePath,GetLogFileSize,ClearLogFile} from '../../wailsjs/wailsjs/go/main/WailsApp.js'

const { t } = useI18n()

const form = reactive({
  logging: {
    level: 'info',
    format: 'json',
    output: 'file', // 固定为文件输出，编译后无法更改
    enableRequestLog: false, // 默认禁用详细请求日志，防止日志爆炸
    maskSensitive: true
  }
})

const logFilePath = ref('~/.monica-proxy/logs/monica-proxy.log')
const logFileSize = ref(t('logging.calculating'))
const loading = ref(false)
const showDetails = ref(false)
const outputDisplay = ref(t('logging.outputFile'))

onMounted(async () => {
  await loadConfig()
  // 获取实际的日志文件路径和大小
  await updateLogFileInfo()
})

async function updateLogFileInfo() {
  try {
    const actualPath = await GetLogFilePath()
    logFilePath.value = actualPath
    
    const size = await GetLogFileSize()
    // If backend returns "文件不存在", we might want to map it, or handle it here
    // Assuming backend returns local string, we might just display it or check if it matches specific string
    logFileSize.value = size
  } catch (error) {
    console.log(t('error.getLogInfo'), error)
  }
}

async function loadConfig() {
  try {
    const config = await GetConfig()
    if (config.logging) {
      Object.assign(form.logging, config.logging)
    }
  } catch (error) {
    ElMessage.error(t('config.loadFail') + ': ' + error.message)
  }
}

async function saveConfig() {
  loading.value = true
  try {
    await UpdateConfig({
      logging: form.logging
    })
    ElMessage.success(t('config.saveSuccess'))
  } catch (error) {
    ElMessage.error(t('config.saveFail') + ': ' + error.message)
  } finally {
    loading.value = false
  }
}

function getLogLevelTag(level) {
  switch (level) {
    case 'debug':
      return 'info'
    case 'info':
      return 'success'
    case 'warn':
      return 'warning'
    case 'error':
      return 'danger'
    default:
      return 'info'
  }
}

function getLogLevelClass(level) {
  switch (level) {
    case 'debug':
      return 'debug'
    case 'info':
      return 'success'
    case 'warn':
      return 'warning'
    case 'error':
      return 'danger'
    default:
      return 'info'
  }
}

function formatFileSize(size) {
  if (size === '文件不存在') {
      return t('logging.fileNotExist')
  }
  if (size === '0 B') {
    return size
  }
  return size
}

function onRequestLogChange(value) {
  if (value) {
    // 启用详细日志时自动显示详情
    showDetails.value = true
  }
}

async function openLogDirectory() {
  try {
    await OpenLogDirectory()
    ElMessage.success(t('logging.openSuccess'))
  } catch (error) {
    const errorMsg = error?.message || error?.toString() || t('error.unknown')
    ElMessage.error(t('logging.openFail') + ': ' + errorMsg)
  }
}

async function clearLogFile() {
  try {
    await ElMessageBox.confirm(
      t('logging.clearConfirm'),
      t('logging.clearTitle'),
      {
        confirmButtonText: t('logging.clearBtn'),
        cancelButtonText: t('logging.cancelBtn'),
        type: 'warning',
        dangerouslyUseHTMLString: true,
      }
    )
    
    await ClearLogFile()
    await updateLogFileInfo() // 更新文件大小显示
    ElMessage.success(t('logging.clearSuccess'))
  } catch (error) {
    if (error === 'cancel') {
      // 用户取消操作，不显示错误
      return
    }
    const errorMsg = error?.message || error?.toString() || t('error.unknown')
    ElMessage.error(t('logging.clearFail') + ': ' + errorMsg)
  }
}
</script>

<style scoped>
/* ... (unchanged) */
/* 页面布局增强 */
.page-layout {
  padding: var(--spacing-sm);
  background: var(--background-page);
  min-height: 100vh;
}

.compact {
  /* 紧凑模式：无顶部标题区域 */
}

/* 状态卡片样式增强 */
.status-row {
  margin-bottom: var(--spacing-md);
}

.status-card {
  transition: transform var(--transition-normal);
}

.status-card:hover {
  transform: translateY(-4px);
}

/* 调试级别特殊样式 */
.status-icon.debug {
  background: var(--gradient-info);
  color: white;
}

/* 危险级别特殊样式 */
.status-icon.danger {
  background: var(--gradient-error);
  color: white;
}

/* 配置网格布局 */
.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--card-gap);
  margin-bottom: var(--spacing-xl);
}

/* 详细信息样式 */
.details-alert {
  margin-top: var(--spacing-md);
}

.details-content {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

.details-content ul {
  margin: var(--spacing-sm) 0;
  padding-left: var(--spacing-lg);
}

.details-content li {
  margin-bottom: var(--spacing-xs);
}

.warning-text {
  color: var(--warning-color);
  font-weight: var(--font-weight-bold);
  margin-top: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

/* 文件管理样式 */
.file-management {
  margin-top: var(--spacing-md);
}

/* 表单样式增强 */
.form-large {
  margin-top: var(--spacing-md);
}

.form-large .el-form-item {
  margin-bottom: var(--spacing-lg);
}

/* 按钮样式统一 */
.ml-sm {
  margin-left: var(--spacing-sm);
}

.mt-sm {
  margin-top: var(--spacing-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-layout {
    padding: var(--spacing-sm);
  }
  
  .config-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-layout {
    padding: var(--spacing-xs);
  }
  
  .status-row {
    grid-template-columns: 1fr;
  }
}
</style>

<style scoped>
/* 页面布局增强 */
.page-layout {
  padding: var(--spacing-sm);
  background: var(--background-page);
  min-height: 100vh;
}

.compact {
  /* 紧凑模式：无顶部标题区域 */
}

/* 状态卡片样式增强 */
.status-row {
  margin-bottom: var(--spacing-md);
}

.status-card {
  transition: transform var(--transition-normal);
}

.status-card:hover {
  transform: translateY(-4px);
}

/* 调试级别特殊样式 */
.status-icon.debug {
  background: var(--gradient-info);
  color: white;
}

/* 危险级别特殊样式 */
.status-icon.danger {
  background: var(--gradient-error);
  color: white;
}

/* 配置网格布局 */
.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--card-gap);
  margin-bottom: var(--spacing-xl);
}

/* 详细信息样式 */
.details-alert {
  margin-top: var(--spacing-md);
}

.details-content {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

.details-content ul {
  margin: var(--spacing-sm) 0;
  padding-left: var(--spacing-lg);
}

.details-content li {
  margin-bottom: var(--spacing-xs);
}

.warning-text {
  color: var(--warning-color);
  font-weight: var(--font-weight-bold);
  margin-top: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

/* 文件管理样式 */
.file-management {
  margin-top: var(--spacing-md);
}

/* 表单样式增强 */
.form-large {
  margin-top: var(--spacing-md);
}

.form-large .el-form-item {
  margin-bottom: var(--spacing-lg);
}

/* 按钮样式统一 */
.ml-sm {
  margin-left: var(--spacing-sm);
}

.mt-sm {
  margin-top: var(--spacing-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-layout {
    padding: var(--spacing-sm);
  }
  
  .config-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-layout {
    padding: var(--spacing-xs);
  }
  
  .status-row {
    grid-template-columns: 1fr;
  }
}
</style>