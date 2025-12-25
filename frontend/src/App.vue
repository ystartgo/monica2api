<template>
  <div id="app" class="page-layout light-theme">
    <el-container style="height: 100vh;">
      <el-header class="app-header">
        <div class="app-header-content">
          <h1 class="app-title">Monica Proxy Wails</h1>
          <p class="app-subtitle">{{ $t('app.subtitle') }}</p>
        </div>
        <div class="header-controls" style="display: flex; align-items: center; gap: 10px;">
          <el-dropdown @command="handleLangCommand">
            <span class="el-dropdown-link" style="color: white; cursor: pointer; display: flex; align-items: center;">
              Language
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
                <el-dropdown-item command="zh-TW">繁體中文</el-dropdown-item>
                <el-dropdown-item command="en">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
          <div class="app-status">
            <el-tag v-if="appStore.isServiceRunning" class="status-tag running" effect="dark">
              <el-icon><VideoPlay /></el-icon>
              {{ $t('app.status.running') }}
            </el-tag>
            <el-tag v-else class="status-tag stopped" effect="dark">
              <el-icon><VideoPause /></el-icon>
              {{ $t('app.status.serviceStopped') }}
            </el-tag>
          </div>
        </div>
      </el-header>
      
      <el-container>
        <el-aside class="app-sidebar">
          <el-menu
            :default-active="$route.path"
            router
            class="sidebar-menu"
          >
            <el-menu-item index="/main">
              <el-icon><Setting /></el-icon>
              <span>{{ $t('app.menu.mainConfig') }}</span>
            </el-menu-item>
            <el-menu-item index="/server">
              <el-icon><Cpu /></el-icon>
              <span>{{ $t('app.menu.serverConfig') }}</span>
            </el-menu-item>
            <el-menu-item index="/logging">
              <el-icon><Document /></el-icon>
              <span>{{ $t('app.menu.loggingConfig') }}</span>
            </el-menu-item>
            <el-menu-item index="/copyright">
              <el-icon><InfoFilled /></el-icon>
              <span>{{ $t('app.menu.copyright') }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        
        <el-main class="app-main">
          <div class="page-content">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Setting, Cpu, Document, InfoFilled, VideoPlay, VideoPause, ArrowDown } from '@element-plus/icons-vue'
import {GetServiceStatus,GetConfig} from '../wailsjs/wailsjs/go/main/WailsApp.js'
const appStore = useAppStore()
const { locale, t } = useI18n()

function handleLangCommand(command) {
  locale.value = command
}

onMounted(async () => {
  await loadConfig()
  await getServiceStatu()
})

async function loadConfig() {
  try {
    const config = await GetConfig()
    appStore.config = config
  } catch (error) {
    console.error(t('config.loadFail'), error)
  }
}

async function getServiceStatu() {
  try {
    const status = await GetServiceStatus()
    appStore.serviceStatus = status
  } catch (error) {
    console.error(t('error.getStatus'), error)
  }
}
</script>

<style>
/* 引入全局滚动条隐藏样式 */
@import './styles/global-scrollbar.css';

/* 强制浅色主题 */
.light-theme {
  background-color: #ffffff !important;
  color: #303133 !important;
}

/* 隐藏滚动条但保持滚动功能 - 正确方法 */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
/* ... existing styles ... */


.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* 全局滚动条隐藏 */
* {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

*::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

.light-theme .app-header {
  background: var(--gradient-primary) !important;
  color: white !important;
}

.light-theme .app-sidebar {
  background: #ffffff !important;
  border-right: 1px solid #e4e7ed !important;
}

.light-theme .app-main {
  background: #f5f7fa !important;
}

.light-theme .page-content {
  background: #f5f7fa !important;
}

/* 应用头部样式 */
.app-header {
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-md);
  box-shadow: var(--shadow-md);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  z-index: var(--z-fixed);
}

.app-header-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.app-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  color: white;
}

.app-subtitle {
  font-size: var(--font-size-sm);
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.app-status {
  display: flex;
  align-items: center;
}

.status-tag {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
}

.status-tag.running {
  background: var(--gradient-success);
  border: none;
}

.status-tag.stopped {
  background: var(--gradient-info);
  border: none;
}

/* 应用侧边栏样式 */
.app-sidebar {
  background: var(--background-section);
  border-right: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  width: 180px !important;
  min-width: 180px;
  max-width: 220px;
  position: fixed;
  top: 50px;
  left: 0;
  bottom: 0;
  z-index: var(--z-sticky);
}

.sidebar-menu {
  height: 100%;
  border-right: none;
  background: transparent;
  overflow-y: auto;
  /* 隐藏滚动条 */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.sidebar-menu::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

.sidebar-menu .el-menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--text-regular);
  transition: all var(--transition-fast);
}

.sidebar-menu .el-menu-item:hover {
  background: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
}

.sidebar-menu .el-menu-item.is-active {
  background: rgba(64, 158, 255, 0.15);
  color: var(--primary-color);
  font-weight: var(--font-weight-medium);
}

.sidebar-menu .el-menu-item .el-icon {
  font-size: var(--font-size-lg);
}

/* 应用主内容区域样式 */
.app-main {
  background: var(--background-page);
  padding: 0;
  overflow: hidden;
  margin-left: 180px;
  margin-top: 50px;
  min-height: calc(100vh - 50px);
}

.page-content {
  min-height: calc(100vh - 50px);
  padding: var(--spacing-sm);
  height: calc(100vh - 50px);
  overflow-y: auto;
  /* 平滑滚动 */
  scroll-behavior: smooth;
  /* 隐藏滚动条 */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.page-content::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    text-align: center;
  }
  
  .app-header-content {
    align-items: center;
    text-align: center;
  }
  
  .app-title {
    font-size: var(--font-size-lg);
  }
  
  .app-subtitle {
    font-size: var(--font-size-xs);
  }
  
  .app-sidebar {
    width: 50px !important;
    min-width: 50px;
    max-width: 50px;
    height: calc(100vh - 50px);
  }
  
  .sidebar-menu .el-menu-item span {
    display: none;
  }
  
  .sidebar-menu .el-menu-item {
    justify-content: center;
    padding: var(--spacing-md);
  }
  
  .page-content {
    padding: var(--spacing-xs);
    height: calc(100vh - 50px);
  }
  
  .app-main {
    margin-left: 50px;
  }
}
</style>