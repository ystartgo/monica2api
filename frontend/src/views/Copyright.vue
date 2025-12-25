<template>
  <div class="page-layout compact">
    <!-- 内容区域 -->
    <div class="content-grid">
      <!-- 许可证信息卡片 -->
      <div class="content-card">
        <div class="content-card-header">
          <el-icon><Document /></el-icon>
          <div>
            <h3 class="content-card-title">{{ $t('copyright.licenseTitle') }}</h3>
            <p class="content-card-description">{{ $t('copyright.licenseDesc') }}</p>
          </div>
        </div>
        
        <div class="license-content">          
          <div class="license-text">
            <p><strong>{{ $t('copyright.copyright') }}</strong></p>
            <br>
            <p>{{ $t('copyright.licenseText1') }}</p>
            <br>
            <p>{{ $t('copyright.licenseText2') }}</p>
            <br>
            <p><strong>{{ $t('copyright.disclaimer') }}</strong></p>
          </div>
        </div>
      </div>
      
      <!-- 原始项目信息卡片 -->
      <div class="content-card">
        <div class="content-card-header">
          <el-icon><Link /></el-icon>
          <div>
            <h3 class="content-card-title">{{ $t('copyright.projectTitle') }}</h3>
            <p class="content-card-description">{{ $t('copyright.projectDesc') }}</p>
          </div>
        </div>
        
        <div class="project-content">
          <el-alert
            :title="$t('copyright.basedOn')"
            type="success"
            :closable="false"
            show-icon
            class="mb-lg"
          />
          
          <el-descriptions :column="1" border>
            <el-descriptions-item :label="$t('copyright.projectName')">
              monica-proxy
            </el-descriptions-item>
            <el-descriptions-item :label="$t('copyright.originalAuthor')">
              ycvk
            </el-descriptions-item>
            <el-descriptions-item :label="$t('copyright.projectUrl')">
              <el-link
                href="https://github.com/ycvk/monica-proxy"
                target="_blank"
                type="primary"
              >
                https://github.com/ycvk/monica-proxy
                <el-icon><Link /></el-icon>
              </el-link>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('copyright.license')">
              MIT License
            </el-descriptions-item>
            <el-descriptions-item :label="$t('copyright.features')">
              <el-tag type="primary" class="mr-sm">{{ $t('copyright.featureUi') }}</el-tag>
              <el-tag type="success" class="mr-sm">{{ $t('copyright.featureFunc') }}</el-tag>
              <el-tag type="warning">{{ $t('copyright.featureGui') }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
          
          <div class="project-description">
            <h4>{{ $t('copyright.descTitle') }}</h4>
            <p>{{ $t('copyright.descText1') }}</p>
            <p>{{ $t('copyright.descText2') }}：<strong>ycvk</strong></p>
            <p>{{ $t('copyright.descText3') }}：<strong>MIT License</strong></p>
            <p>{{ $t('copyright.descText4') }}</p>
          </div>
        </div>
      </div>
      
      <!-- 快速链接卡片 -->
      <div class="content-card">
        <div class="content-card-header">
          <el-icon><Share /></el-icon>
          <div>
            <h3 class="content-card-title">{{ $t('copyright.linksTitle') }}</h3>
            <p class="content-card-description">{{ $t('copyright.linksDesc') }}</p>
          </div>
        </div>
        
        <div class="links-grid">
          <div class="link-item" @click="openOriginalProject">
            <div class="link-icon">
              <el-icon size="32"><Link /></el-icon>
            </div>
            <div class="link-info">
              <h4>{{ $t('copyright.linkOriginal') }}</h4>
              <p>{{ $t('copyright.linkOriginalDesc') }}</p>
            </div>
            <button class="btn btn-primary btn-sm">{{ $t('copyright.btnOriginal') }}</button>
          </div>
          
          <div class="link-item" @click="showLicenseFull">
            <div class="link-icon success">
              <el-icon size="32"><Document /></el-icon>
            </div>
            <div class="link-info">
              <h4>{{ $t('copyright.linkLicense') }}</h4>
              <p>{{ $t('copyright.linkLicenseDesc') }}</p>
            </div>
            <button class="btn btn-success btn-sm">{{ $t('copyright.btnLicense') }}</button>
          </div>
        </div>
      </div>
      
      <!-- 版本信息卡片 -->
      <div class="content-card">
        <div class="content-card-header">
          <el-icon><InfoFilled /></el-icon>
          <div>
            <h3 class="content-card-title">{{ $t('copyright.versionTitle') }}</h3>
            <p class="content-card-description">{{ $t('copyright.versionDesc') }}</p>
          </div>
        </div>
        
        <div class="version-content">
          <el-descriptions :column="2" border>
            <el-descriptions-item :label="$t('copyright.appName')">
              Monica Proxy
            </el-descriptions-item>
            <el-descriptions-item :label="$t('copyright.version')">
              1.0.0
            </el-descriptions-item>
            <el-descriptions-item :label="$t('copyright.guiFrame')">
              Wails v2 ({{ $t('app.title') }}) / Fyne v2 (Original)
            </el-descriptions-item>
            <el-descriptions-item :label="$t('copyright.buildTime')">
              {{ buildTime }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('copyright.goVersion')">
              {{ goVersion }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('copyright.devLang')">
              Go + Vue.js + Element Plus
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </div>
    
    <!-- 许可证全文对话框 -->
    <el-dialog
      v-model="showLicenseDialog"
      :title="$t('copyright.dialogTitle')"
      width="60%"
      top="5vh"
    >
      <div class="license-full-text">
        <pre>
MIT License

Copyright (c) 2024 Monica Proxy Project Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
        </pre>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const showLicenseDialog = ref(false)

const buildTime = ref(new Date().toLocaleString())
const goVersion = ref('1.23.0')

function openOriginalProject() {
  window.open('https://github.com/ycvk/monica-proxy', '_blank')
}

function showLicenseFull() {
  showLicenseDialog.value = true
}
</script>

<style scoped>
/* ... (unchanged) */
/* 页面布局 */
.page-layout {
  padding: var(--spacing-sm);
  background: var(--background-page);
  min-height: 100vh;
}

.compact {
  /* 紧凑模式：无顶部标题区域 */
}

/* 内容网格布局 */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: var(--card-gap);
}

/* 内容卡片样式 */
.content-card {
  background: var(--background-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  transition: all var(--transition-normal);
  overflow: hidden;
}

.content-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* 卡片头部样式 */
.content-card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--background-section);
  border-bottom: 1px solid var(--border-light);
}

.content-card-header .el-icon {
  font-size: var(--font-size-xl);
  color: var(--primary-color);
}

.content-card-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.content-card-description {
  margin: var(--spacing-xs) 0 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 许可证内容样式 */
.license-content {
  padding: var(--spacing-lg);
}

.license-text {
  line-height: var(--line-height-relaxed);
  color: var(--text-regular);
  font-size: var(--font-size-sm);
  background: var(--background-section);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.license-text p {
  margin-bottom: var(--spacing-sm);
}

.license-text strong {
  color: var(--text-primary);
  font-weight: var(--font-weight-bold);
}

/* 项目内容样式 */
.project-content {
  padding: var(--spacing-lg);
}

.project-description {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--background-section);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.project-description h4 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.project-description p {
  line-height: var(--line-height-normal);
  margin-bottom: var(--spacing-sm);
  color: var(--text-regular);
}

.project-description strong {
  color: var(--primary-color);
}

/* 链接网格样式 */
.links-grid {
  padding: var(--spacing-lg);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

.link-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--background-section);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.link-item:hover {
  background: var(--background-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.link-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.link-icon.success {
  background: var(--gradient-success);
}

.link-info {
  flex: 1;
}

.link-info h4 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.link-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

/* 按钮样式 */
.btn-sm {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  min-width: 80px;
  height: 32px;
}

/* 版本内容样式 */
.version-content {
  padding: var(--spacing-lg);
}

/* 许可证全文对话框样式 */
.license-full-text {
  max-height: 70vh;
  overflow-y: auto;
  padding: var(--spacing-lg);
  background: var(--background-section);
  border-radius: var(--radius-md);
}

.license-full-text pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  color: var(--text-primary);
}

/* 间距工具类 */
.mb-lg {
  margin-bottom: var(--spacing-lg);
}

.mr-sm {
  margin-right: var(--spacing-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-layout {
    padding: var(--spacing-sm);
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .content-card-header {
    padding: var(--spacing-md);
  }
  
  .license-content,
  .project-content,
  .links-grid,
  .version-content {
    padding: var(--spacing-md);
  }
  
  .link-item {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .page-layout {
    padding: var(--spacing-xs);
  }
  
  .content-card-header {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
  }
  
  .license-text,
  .project-description {
    padding: var(--spacing-md);
  }
}
</style>

<style scoped>
/* 页面布局 */
.page-layout {
  padding: var(--spacing-sm);
  background: var(--background-page);
  min-height: 100vh;
}

.compact {
  /* 紧凑模式：无顶部标题区域 */
}

/* 内容网格布局 */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: var(--card-gap);
}

/* 内容卡片样式 */
.content-card {
  background: var(--background-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  transition: all var(--transition-normal);
  overflow: hidden;
}

.content-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* 卡片头部样式 */
.content-card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--background-section);
  border-bottom: 1px solid var(--border-light);
}

.content-card-header .el-icon {
  font-size: var(--font-size-xl);
  color: var(--primary-color);
}

.content-card-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.content-card-description {
  margin: var(--spacing-xs) 0 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 许可证内容样式 */
.license-content {
  padding: var(--spacing-lg);
}

.license-text {
  line-height: var(--line-height-relaxed);
  color: var(--text-regular);
  font-size: var(--font-size-sm);
  background: var(--background-section);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.license-text p {
  margin-bottom: var(--spacing-sm);
}

.license-text strong {
  color: var(--text-primary);
  font-weight: var(--font-weight-bold);
}

/* 项目内容样式 */
.project-content {
  padding: var(--spacing-lg);
}

.project-description {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--background-section);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.project-description h4 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.project-description p {
  line-height: var(--line-height-normal);
  margin-bottom: var(--spacing-sm);
  color: var(--text-regular);
}

.project-description strong {
  color: var(--primary-color);
}

/* 链接网格样式 */
.links-grid {
  padding: var(--spacing-lg);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

.link-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--background-section);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.link-item:hover {
  background: var(--background-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.link-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.link-icon.success {
  background: var(--gradient-success);
}

.link-info {
  flex: 1;
}

.link-info h4 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.link-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

/* 按钮样式 */
.btn-sm {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  min-width: 80px;
  height: 32px;
}

/* 版本内容样式 */
.version-content {
  padding: var(--spacing-lg);
}

/* 许可证全文对话框样式 */
.license-full-text {
  max-height: 70vh;
  overflow-y: auto;
  padding: var(--spacing-lg);
  background: var(--background-section);
  border-radius: var(--radius-md);
}

.license-full-text pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  color: var(--text-primary);
}

/* 间距工具类 */
.mb-lg {
  margin-bottom: var(--spacing-lg);
}

.mr-sm {
  margin-right: var(--spacing-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-layout {
    padding: var(--spacing-sm);
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .content-card-header {
    padding: var(--spacing-md);
  }
  
  .license-content,
  .project-content,
  .links-grid,
  .version-content {
    padding: var(--spacing-md);
  }
  
  .link-item {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .page-layout {
    padding: var(--spacing-xs);
  }
  
  .content-card-header {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
  }
  
  .license-text,
  .project-description {
    padding: var(--spacing-md);
  }
}
</style>