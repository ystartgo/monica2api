<template>
  <div class="page-layout compact">
    <!-- 状态卡片区域 -->
    <div class="status-row">
      <div class="status-card">
        <div class="status-icon" :class="appStore.isServiceRunning ? 'success' : 'info'">
          <el-icon><VideoPlay v-if="appStore.isServiceRunning" /><VideoPause v-else /></el-icon>
        </div>
        <h3 class="status-title">{{ $t('status.serviceTitle') }}</h3>
        <p class="status-description">
          {{ appStore.isServiceRunning ? $t('status.serviceRunning') : $t('status.serviceStopped') }}
        </p>
      </div>
      
      <div class="status-card">
        <div class="status-icon info">
          <el-icon><Connection /></el-icon>
        </div>
        <h3 class="status-title">{{ $t('status.apiTitle') }}</h3>
        <p class="status-description">
          {{ serviceStatusMessage || $t('status.waitingService') }}
        </p>
      </div>
      
      <div class="status-card">
        <div class="status-icon" :class="form.monica.cookie ? 'success' : 'warning'">
          <el-icon><Document /></el-icon>
        </div>
        <h3 class="status-title">{{ $t('status.configTitle') }}</h3>
        <p class="status-description">
          {{ form.monica.cookie ? $t('status.configComplete') : $t('status.needCookie') }}
        </p>
      </div>
    </div>
    
    <!-- 服务控制区域 -->
    <div class="service-control-section">
      <div class="config-card">
        <div class="config-card-header">
          <el-icon><VideoPlay /></el-icon>
          <div>
            <h3 class="config-card-title">{{ $t('control.title') }}</h3>
            <p class="config-card-description">{{ $t('control.desc') }}</p>
          </div>
        </div>
        
        <div class="service-controls">
          <div class="button-group">
            <button class="btn btn-success" @click="startService_btn" :disabled="appStore.isServiceRunning || loading">
              <el-icon><VideoPlay /></el-icon>
              {{ $t('control.start') }}
            </button>
            
            <button class="btn btn-danger" @click="stopService_btn" :disabled="!appStore.isServiceRunning || loading">
              <el-icon><VideoPause /></el-icon>
              {{ $t('control.stop') }}
            </button>
            
            <button class="btn btn-primary" @click="testConfig" :disabled="!appStore.isServiceRunning || loading">
              <el-icon><Connection /></el-icon>
              {{ $t('control.test') }}
            </button>
            
            <button class="btn btn-info" @click="getQuota" :disabled="loading">
              <el-icon><Coin /></el-icon>
              {{ $t('control.quota') }}
            </button>
          </div>
          
          <!-- 状态显示 -->
          <div class="status-info">
            <el-alert
              :title="serviceStatusMessage"
              :type="appStore.isServiceRunning ? 'success' : 'info'"
              :closable="false"
              show-icon
            />
            
            <div v-if="appStore.serviceStatus.address" class="api-info">
              <div class="api-info-item">
                <span class="api-label"><strong>base_url:</strong></span>
                <span class="api-value">{{ appStore.serviceStatus.address }}</span>
                <el-button class="copy-btn" size="small" @click="copyToClipboard(appStore.serviceStatus.address)" title="复制 base_url">
                  复制
                </el-button>
              </div>
              <div class="api-info-item">
                <span class="api-label"><strong>API Key:</strong></span>
                <span class="api-value">{{ maskApiKey(appStore.serviceStatus.apiKey) || '未设置' }}</span>
                <el-button class="copy-btn" size="small" @click="copyToClipboard(appStore.serviceStatus.apiKey || '')" :disabled="!appStore.serviceStatus.apiKey" title="复制 API Key">
                  复制
                </el-button>
              </div>
            </div>
            
            <div v-if="quotaInfo.geniusBot !== undefined" class="quota-info">
              <el-alert
                :title="`额度信息: Genius Bot: ${quotaInfo.geniusBot}, Credits: ${quotaInfo.credits}`"
                type="success"
                :closable="false"
                show-icon
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- API端点信息 -->
    <div class="api-endpoints-section">
      <div class="config-card">
        <div class="config-card-header">
          <el-icon><Link /></el-icon>
          <div>
            <h3 class="config-card-title">{{ $t('apiInfo.title') }}</h3>
            <p class="config-card-description">{{ $t('apiInfo.desc') }}</p>
          </div>
        </div>
        
        <div class="api-info">
          <ul>
            <li><strong>POST</strong> /v1/chat/completions - {{ $t('apiInfo.chat') }}</li>
            <li><strong>GET</strong> /v1/models - {{ $t('apiInfo.models') }}</li>
            <li><strong>POST</strong> /v1/images/generations - {{ $t('apiInfo.images') }}</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- 配置表单区域 -->
    <div class="config-grid">
      <div class="config-card">
        <div class="config-card-header">
          <el-icon><Setting /></el-icon>
          <div>
            <h3 class="config-card-title">{{ $t('config.monicaTitle') }}</h3>
            <p class="config-card-description">{{ $t('config.monicaDesc') }}</p>
          </div>
        </div>
        
        <el-form :model="form" label-width="120px" size="large" class="form-large">
        <el-form-item :label="$t('config.cookie')" required>
          <el-input
            v-model="form.monica.cookie"
            type="textarea"
            :rows="4"
            :placeholder="$t('config.cookieHolder')"
          />
        </el-form-item>
        
        <el-form-item :label="$t('config.botUid')">
          <el-input
            v-model="form.monica.botUID"
            :placeholder="$t('config.botUidHolder')"
            :disabled="!form.monica.enableCustomBotMode"
          />
        </el-form-item>
        
        <el-form-item :label="$t('config.customBot')">
          <el-switch v-model="form.monica.enableCustomBotMode" />
        </el-form-item>
      </el-form>
      </div>
      
      <div class="config-card">
        <div class="config-card-header">
          <el-icon><Shield /></el-icon>
          <div>
            <h3 class="config-card-title">{{ $t('config.securityTitle') }}</h3>
            <p class="config-card-description">{{ $t('config.securityDesc') }}</p>
          </div>
        </div>
        
        <el-form :model="form" label-width="120px" size="large" class="form-large">
        <el-form-item :label="$t('config.apiKey')" required>
          <el-input
            v-model="form.security.bearerToken"
            :placeholder="$t('config.apiKeyHolder')"
            show-password
          />
        </el-form-item>
        
        <el-form-item :label="$t('config.skipTls')">
          <el-switch v-model="form.security.tlsSkipVerify" />
        </el-form-item>
        
        <el-form-item :label="$t('config.rateLimit')">
          <el-switch v-model="form.security.rateLimitEnabled" />
        </el-form-item>
        
        <el-form-item :label="$t('config.rateLimitRps')" v-if="form.security.rateLimitEnabled">
          <el-input-number
            v-model="form.security.rateLimitRPS"
            :min="1"
            :max="1000"
          />
        </el-form-item>
        
        <el-form-item :label="$t('config.timeout')">
          <el-input-number
            v-model="form.security.requestTimeout"
            :min="1"
            :max="300"
          />
        </el-form-item>
      </el-form>
      </div>
      
      <div class="config-card">
        <div class="config-card-header">
          <el-icon><Share /></el-icon>
          <div>
            <h3 class="config-card-title">{{ $t('config.proxyTitle') }}</h3>
            <p class="config-card-description">{{ $t('config.proxyDesc') }}</p>
          </div>
        </div>
        
        <el-form :model="form" label-width="120px" size="large" class="form-large">
        <el-form-item :label="$t('config.enableProxy')">
          <el-switch v-model="form.proxy.enabled" />
          <el-alert
            v-if="form.proxy.enabled && (!form.proxy.httpProxy && !form.proxy.httpsProxy)"
            :title="$t('config.proxyWarn')"
            type="warning"
            :closable="false"
            show-icon
            class="mt-sm"
          />
          <el-alert
            v-if="form.proxy.enabled && (form.proxy.httpProxy || form.proxy.httpsProxy)"
            :title="`${$t('config.proxySuccess')}: ${form.proxy.httpProxy || form.proxy.httpsProxy}`"
            type="success"
            :closable="false"
            show-icon
            class="mt-sm"
          />
        </el-form-item>
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
    
    <!-- 测试结果对话框 -->
    <el-dialog
      v-model="showTestResults"
      title="API配置测试结果"
      width="80%"
      top="5vh"
    >
      <div class="test-results">
        <el-collapse v-model="activeCollapse">
          <el-collapse-item
            v-for="(result, index) in testResults"
            :key="index"
            :name="index.toString()"
          >
            <template #title>
              <span :class="getResultClass(result)">
                {{ result.endpoint }} - {{ getResultText(result) }}
              </span>
            </template>
            <div class="test-details">
              <p><strong>{{ $t('test.url') }}:</strong></p>
              <pre>{{ result.url }}</pre>
              
              <p v-if="result.requestData"><strong>{{ $t('test.reqData') }}:</strong></p>
              <pre v-if="result.requestData">{{ result.requestData }}</pre>
              
              <p v-if="result.responseData"><strong>{{ $t('test.resData') }}:</strong></p>
              <pre v-if="result.responseData">{{ result.responseData }}</pre>
              
              <p v-if="result.error"><strong>{{ $t('test.error') }}:</strong></p>
              <pre v-if="result.error" class="error">{{ result.error }}</pre>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'
import { VideoPlay, VideoPause, Connection, Coin, Check, Link, CopyDocument } from '@element-plus/icons-vue'
import {GetConfig,UpdateConfig,StartService,StopService,TestConfig,GetServiceStatus,GetQuota} from '../../wailsjs/wailsjs/go/main/WailsApp.js'
const appStore = useAppStore()
const { t } = useI18n()

const form = reactive({
  monica: {
    cookie: '',
    botUID: '',
    enableCustomBotMode: false
  },
  proxy: {
    enabled: false,
    httpProxy: '',
    httpsProxy: '',
    noProxy: ''
  },
  security: {
    bearerToken: '',
    tlsSkipVerify: false,
    rateLimitEnabled: false,
    rateLimitRPS: 10,
    requestTimeout: 30
  }
})

const loading = ref(false)
const showTestResults = ref(false)
const testResults = ref([])
const quotaInfo = ref({})
const activeCollapse = ref([])

const serviceStatusMessage = computed(() => {
  if (appStore.isServiceRunning) {
    return t('status.serviceRunning')
  }
  return t('status.serviceStopped') 
})

onMounted(async () => {
  await loadConfig()
})

async function loadConfig() {
  try {
    const config = await GetConfig()
    if (config.monica) {
      Object.assign(form.monica, config.monica)
    }
    if (config.proxy) {
      Object.assign(form.proxy, config.proxy)
      // 根据是否有代理配置来设置启用状态
      form.proxy.enabled = !!(config.proxy.httpProxy || config.proxy.httpsProxy)
    }
    if (config.security) {
      Object.assign(form.security, config.security)
    }
  } catch (error) {
    const errorMsg = error?.message || error?.toString() || '未知错误'
    ElMessage.error(t('config.loadFail') + ': ' + errorMsg)
  }
}

async function saveConfig() {
  loading.value = true
  try {
    await UpdateConfig({
      monica: form.monica,
      proxy: form.proxy,
      security: form.security
    })
    ElMessage.success(t('config.saveSuccess'))
  } catch (error) {
    const errorMsg = error?.message || error?.toString() || '未知错误'
    ElMessage.error(t('config.saveFail') + ': ' + errorMsg)
  } finally {
    loading.value = false
  }
}

async function startService_btn() {
  loading.value = true
  
  const loadingMessage = ElMessage({
    message: t('control.starting'),
    type: 'info',
    duration: 0,
    showClose: false
  })
  
  try {
    await saveConfig()
    await StartService()
    loadingMessage.close()
    ElMessage.success(t('control.startSuccess'))
    await getServiceStatus1()
  } catch (error) {
    loadingMessage.close()
    const errorMsg = error?.message || error?.toString() || '未知错误'
    ElMessage.error(t('control.startFail') + ': ' + errorMsg)
  } finally {
    loading.value = false
  }
}

async function stopService_btn() {
  loading.value = true
  
  const loadingMessage = ElMessage({
    message: t('control.stopping'),
    type: 'info',
    duration: 0,
    showClose: false
  })
  
  try {
    await StopService()
    loadingMessage.close()
    ElMessage.success(t('control.stopSuccess'))
    await getServiceStatus1()
  } catch (error) {
    loadingMessage.close()
    const errorMsg = error?.message || error?.toString() || '未知错误'
    ElMessage.error(t('control.stopFail') + ': ' + errorMsg)
  } finally {
    loading.value = false
  }
}

async function getServiceStatus1() {
  try {
    const status = await GetServiceStatus()
    appStore.serviceStatus = status
  } catch (error) {
    console.error('获取服务状态失败:', error)
  }
}

async function testConfig() {
  loading.value = true
  
  // 添加测试开始的用户反馈
  const loadingMessage = ElMessage({
    message: t('control.testing'),
    type: 'info',
    duration: 0, // 不自动关闭
    showClose: false
  })
  
  try {
    await saveConfig()
    const results = await TestConfig()
    testResults.value = results
    showTestResults.value = true
    // 默认全部折叠，不展开任何测试结果
    activeCollapse.value = []
    
    // 关闭加载消息并显示成功消息
    loadingMessage.close()
    ElMessage.success(t('control.testSuccess'))
    
  } catch (error) {
    // 关闭加载消息
    loadingMessage.close()
    
    // 改善错误处理，防止undefined
    const errorMsg = error?.message || error?.toString() || '未知错误'
    ElMessage.error(t('control.testFail') + ': ' + errorMsg)
    
    // 如果是必填项错误，给出更友好的提示
    if (errorMsg.includes('请填写')) {
      const fieldMsg = `${t('validation.requiredFields')}\n• ${t('validation.cookie')}\n• ${t('validation.apiKey')}\n• ${t('validation.botUid')}`
      
      ElMessageBox.alert(
        errorMsg + '\n\n' + fieldMsg,
        t('validation.check'),
        {
          type: 'warning',
          confirmButtonText: t('common.iKnow')
        }
      )
    }
    
  } finally {
    loading.value = false
  }
}

async function getQuota() {
  loading.value = true
  
  const loadingMessage = ElMessage({
    message: t('control.quotaQuerying'),
    type: 'info',
    duration: 0,
    showClose: false
  })
  
  try {
    const quota = await GetQuota()
    loadingMessage.close()
    
    if (quota.error) {
      const errorMsg = quota.error || '未知错误'
      ElMessage.error(t('control.quotaFail') + ': ' + errorMsg)
    } else {
      quotaInfo.value = quota
      ElMessage.success(t('control.quotaSuccess'))
    }
  } catch (error) {
    loadingMessage.close()
    const errorMsg = error?.message || error?.toString() || '未知错误'
    ElMessage.error(t('control.quotaFail') + ': ' + errorMsg)
  } finally {
    loading.value = false
  }
}

function getResultClass(result) {
  if (result.error) return 'result-error'
  if (result.statusCode >= 200 && result.statusCode < 300) return 'result-success'
  return 'result-error'
}

function getResultText(result) {
  if (result.error) return `失败: ${result.error}`
  if (result.statusCode >= 200 && result.statusCode < 300) return `成功 (HTTP ${result.statusCode})`
  return `错误 (HTTP ${result.statusCode})`
}

async function copyToClipboard(text) {
  if (!text) {
    ElMessage.warning(t('common.copyEmpty'))
    return
  }
  
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(t('common.copySuccess'))
  } catch (error) {
    ElMessage.error(t('common.copyFail'))
  }
}

function maskApiKey(key) {
  if (!key) return ''
  if (key.length <= 8) return '********'
  return key.substring(0, 3) + '****' + key.substring(key.length - 4)
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

/* 服务控制区域样式 */
.service-control-section {
  margin-bottom: var(--spacing-md);
}

.service-controls {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.service-controls .button-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  justify-content: center;
  padding: var(--spacing-sm) 0;
}

.service-controls .btn {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 100px;
  justify-content: center;
}

.service-controls .btn-success {
  background: var(--gradient-success);
  color: white;
}

.service-controls .btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
}

.service-controls .btn-danger {
  background: var(--gradient-error);
  color: white;
}

.service-controls .btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
}

.service-controls .btn-primary {
  background: var(--gradient-primary);
  color: white;
}

.service-controls .btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.service-controls .btn-info {
  background: var(--gradient-info);
  color: white;
}

.service-controls .btn-info:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(144, 147, 153, 0.4);
}

.service-controls .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* API端点信息区域样式 */
.api-endpoints-section {
  margin-bottom: var(--spacing-md);
}

/* 配置网格布局 */
.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--card-gap);
  margin-bottom: var(--spacing-md);
}

/* API端点信息样式 */
.api-info {
  padding: var(--spacing-sm);
  background: var(--background-section);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.api-info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid var(--border-light);
}

.api-info-item:last-child {
  border-bottom: none;
}

.api-label {
  min-width: 80px;
  color: var(--text-regular);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
}

.api-value {
  flex: 1;
  color: var(--text-regular);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
  word-break: break-all;
}

.copy-btn {
  min-width: auto;
  padding: 2px 8px;
  font-size: var(--font-size-xs);
  height: 24px;
  line-height: 1;
}

.api-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.api-info li {
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-regular);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
  word-break: break-all;
}

.api-info li:last-child {
  border-bottom: none;
}

.api-info li strong {
  color: var(--primary-color);
  font-weight: var(--font-weight-bold);
  margin-right: var(--spacing-xs);
}

/* 测试结果对话框样式 */
.test-results {
  max-height: 60vh;
  overflow-y: auto;
}

.test-details {
  padding: var(--spacing-sm);
}

.test-details pre {
  background: var(--background-section);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--text-primary);
}

.test-details .error {
  background: rgba(245, 108, 108, 0.1);
  color: var(--error-color);
  border-color: var(--error-color);
}

.result-success {
  color: var(--success-color);
  font-weight: var(--font-weight-bold);
}

.result-error {
  color: var(--error-color);
  font-weight: var(--font-weight-bold);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-layout {
    padding: var(--spacing-sm);
  }
  
  .config-grid {
    grid-template-columns: 1fr;
  }
  
  .service-controls .button-group {
    flex-direction: column;
  }
  
  .service-controls {
    gap: var(--spacing-sm);
  }
  
  .service-controls .btn {
    min-width: 100%;
  }
  
  .api-endpoints-section .api-info li {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .api-endpoints-section .api-info li strong {
    min-width: auto;
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

/* 服务控制区域样式 */
.service-control-section {
  margin-bottom: var(--spacing-md);
}

.service-controls {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.service-controls .button-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  justify-content: center;
  padding: var(--spacing-sm) 0;
}

.service-controls .btn {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 100px;
  justify-content: center;
}

.service-controls .btn-success {
  background: var(--gradient-success);
  color: white;
}

.service-controls .btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
}

.service-controls .btn-danger {
  background: var(--gradient-error);
  color: white;
}

.service-controls .btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
}

.service-controls .btn-primary {
  background: var(--gradient-primary);
  color: white;
}

.service-controls .btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.service-controls .btn-info {
  background: var(--gradient-info);
  color: white;
}

.service-controls .btn-info:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(144, 147, 153, 0.4);
}

.service-controls .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* API端点信息区域样式 */
.api-endpoints-section {
  margin-bottom: var(--spacing-md);
}

/* 配置网格布局 */
.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--card-gap);
  margin-bottom: var(--spacing-md);
}

/* API端点信息样式 */
.api-info {
  padding: var(--spacing-sm);
  background: var(--background-section);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.api-info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid var(--border-light);
}

.api-info-item:last-child {
  border-bottom: none;
}

.api-label {
  min-width: 80px;
  color: var(--text-regular);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
}

.api-value {
  flex: 1;
  color: var(--text-regular);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
  word-break: break-all;
}

.copy-btn {
  min-width: auto;
  padding: 2px 8px;
  font-size: var(--font-size-xs);
  height: 24px;
  line-height: 1;
}

.api-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.api-info li {
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-regular);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
  word-break: break-all;
}

.api-info li:last-child {
  border-bottom: none;
}

.api-info li strong {
  color: var(--primary-color);
  font-weight: var(--font-weight-bold);
  margin-right: var(--spacing-xs);
}

/* 测试结果对话框样式 */
.test-results {
  max-height: 60vh;
  overflow-y: auto;
}

.test-details {
  padding: var(--spacing-sm);
}

.test-details pre {
  background: var(--background-section);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--text-primary);
}

.test-details .error {
  background: rgba(245, 108, 108, 0.1);
  color: var(--error-color);
  border-color: var(--error-color);
}

.result-success {
  color: var(--success-color);
  font-weight: var(--font-weight-bold);
}

.result-error {
  color: var(--error-color);
  font-weight: var(--font-weight-bold);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-layout {
    padding: var(--spacing-sm);
  }
  
  .config-grid {
    grid-template-columns: 1fr;
  }
  
  .service-controls .button-group {
    flex-direction: column;
  }
  
  .service-controls {
    gap: var(--spacing-sm);
  }
  
  .service-controls .btn {
    min-width: 100%;
  }
  
  .api-endpoints-section .api-info li {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .api-endpoints-section .api-info li strong {
    min-width: auto;
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