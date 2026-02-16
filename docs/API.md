# 胎动记录器 - API文档

> 版本：1.0 | 最后更新：2026-02-16

---

## 一、模块结构

```
js/
├── app.js      # 主入口，核心业务逻辑
├── auth.js     # 用户认证模块
├── data.js     # 数据库操作模块
├── storage.js  # 本地存储模块
└── utils.js    # 工具函数（待创建）
```

---

## 二、认证模块 (auth.js)

### 方法

| 方法 | 参数 | 返回 | 说明 |
|-----|------|------|------|
| initAuth(client, callback) | Supabase客户端, 回调函数 | - | 初始化认证 |
| checkSession() | - | {user, error} | 检查登录状态 |
| loginWithEmail(email, password) | 邮箱, 密码 | {user, error} | 邮箱登录 |
| registerWithEmail(email, password) | 邮箱, 密码 | {user, error} | 邮箱注册 |
| loginWithGoogle() | - | {url, error} | Google登录 |
| logout() | - | {error} | 退出登录 |
| getCurrentUserId() | - | string/null | 获取当前用户ID |
| isLoggedIn() | - | boolean | 是否已登录 |

---

## 三、数据模块 (data.js)

### 胎动记录

| 方法 | 参数 | 返回 | 说明 |
|-----|------|------|------|
| saveKickRecord(date, time) | 日期, 时间 | {data, error} | 保存单条记录 |
| getKickRecords() | - | {data, error} | 获取所有记录 |
| getKickRecordsByDate(date) | 日期 | {data, error} | 获取指定日期记录 |
| deleteKickRecord(id) | 记录ID | {error} | 删除记录 |

### 用户设置

| 方法 | 参数 | 返回 | 说明 |
|-----|------|------|------|
| saveUserSettings(settings) | 设置对象 | {data, error} | 保存设置 |
| getUserSettings() | - | {data, error} | 获取设置 |

---

## 四、存储模块 (storage.js)

### 方法

| 方法 | 参数 | 返回 | 说明 |
|-----|------|------|------|
| getKickData() | - | object | 获取所有胎动数据 |
| getSettings() | - | object | 获取用户设置 |
| saveKickData(data) | 数据对象 | boolean | 保存胎动数据 |
| saveSettings(settings) | 设置对象 | boolean | 保存设置 |
| clearAllData() | - | - | 清除所有本地数据 |
| getKickCount(date) | 日期 | number | 获取指定日期胎动次数 |
| addKick(date, time) | 日期, 时间 | boolean | 添加胎动记录 |
| getTodayKey() | - | string | 获取今日日期key |

---

## 五、主模块 (app.js)

### 方法

| 方法 | 参数 | 返回 | 说明 |
|-----|------|------|------|
| initApp(supabaseClient) | Supabase客户端 | boolean | 初始化应用 |
| recordKick() | - | {date, time} | 记录一次胎动 |
| getTodayStats() | - | object | 获取今日统计 |
| getWeekStats() | - | object | 获取本周统计 |

---

## 六、数据结构

### 胎动记录 (kick_records)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | bigint | 主键 |
| user_id | uuid | 用户ID |
| record_date | date | 记录日期 |
| record_time | timestamp | 记录时间 |
| created_at | timestamp | 创建时间 |

### 用户设置 (kick_settings)

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | bigint | 主键 |
| user_id | uuid | 用户ID |
| due_date | date | 预产期 |
| vibrate | boolean | 震动开关 |
| baby_name | text | 宝宝名字 |
| baby_style | text | 宝宝风格 |
| baby_icon | text | 宝宝图标 |
| updated_at | timestamp | 更新时间 |

---

## 七、使用示例

```javascript
// 1. 初始化
import { initApp, recordKick, getTodayStats } from './js/app.js';

// 2. 记录胎动
await recordKick();

// 3. 获取统计
const stats = getTodayStats();
console.log('今日次数:', stats.count);
```

---

*本文档随着代码更新持续维护*
