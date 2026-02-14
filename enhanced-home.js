/**
 * 增强版首页 - 显示更多统计和趋势
 */

function renderEnhancedHomePage() {
    const today = getToday();
    const todayCount = kickData[today]?.length || 0;
    const weekStats = calculateWeekStats(new Date());
    
    return `
        <!-- 1. 今日概览卡片 -->
        <div class="stats-card">
            <h2><span id="babyNamePrefix"></span>的今日胎动</h2>
            <div class="stats-number" id="todayCount">${todayCount}</div>
            <div class="stats-label">次</div>
            <div id="statusBadge">
                ${getStatusBadge(todayCount)}
            </div>
            <div class="status-tip" id="statusTip">${getStatusTip(todayCount)}</div>
        </div>
        
        <!-- 2. 快捷统计 -->
        <div class="quick-stats">
            <div class="quick-stat">
                <span class="qs-icon">📈</span>
                <span class="qs-value">${weekStats.avgCount}</span>
                <span class="qs-label">周均</span>
            </div>
            <div class="quick-stat">
                <span class="qs-icon">📅</span>
                <span class="qs-value">${weekStats.activeDays}/7</span>
                <span class="qs-label">记录天</span>
            </div>
            <div class="quick-stat">
                <span class="qs-icon">🔥</span>
                <span class="qs-value">${weekStats.totalCount}</span>
                <span class="qs-label">本周</span>
            </div>
            <div class="quick-stat">
                <span class="qs-icon">🎯</span>
                <span class="qs-value">${getStreak()}</span>
                <span class="qs-label">连续</span>
            </div>
        </div>
        
        <!-- 3. 记录按钮 -->
        <button class="kick-button" id="kickButton" onclick="recordKick()">
            <span id="kickButtonIcon" style="font-size: 50px; display: block;"></span>
            <span>點擊記錄</span>
            <span style="font-size: 12px; margin-top: 4px;">胎動</span>
        </button>
        <div class="last-kick" id="lastKick">${getLastKickText()}</div>
        
        <!-- 4. 周趋势简图 -->
        <div class="week-trend-mini">
            <h3>📊 本周趋势</h3>
            <div class="trend-mini-bars">
                ${renderMiniTrendBars(weekStats.weekData)}
            </div>
        </div>
    `;
}

// 获取状态徽章
function getStatusBadge(count) {
    if (count === 0) return '<span class="badge resting">💤 休息中</span>';
    if (count < 6) return '<span class="badge active">🌱 活动中</span>';
    if (count < 10) return '<span class="badge healthy">✅ 正常</span>';
    return '<span class="badge excited">🎉 非常活跃！</span>';
}

// 获取状态提示
function getStatusTip(count) {
    if (count === 0) return '还没记录，点击按钮开始吧！';
    if (count < 6) return '继续观察，保持记录';
    if (count < 10) return '表现不错，继续保持！';
    return '宝宝今天很活跃！';
}

// 获取连续记录天数
function getStreak() {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        if (kickData[dateStr]?.length > 0) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }
    return streak + '天';
}

// 获取最后记录时间文本
function getLastKickText() {
    const today = getToday();
    const times = kickData[today] || [];
    if (times.length === 0) return '還沒記錄，點擊上方按鈕';
    
    const lastTime = new Date(times[times.length - 1]);
    const hour = lastTime.getHours();
    const minute = String(lastTime.getMinutes()).padStart(2, '0');
    
    return `最後一次：${hour}:${minute}`;
}

// 渲染迷你趋势条形图
function renderMiniTrendBars(weekData) {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    const maxCount = Math.max(...weekData.map(d => d.count), 10);
    
    return weekData.map((day, i) => {
        const height = Math.max((day.count / maxCount * 100), 10);
        const isToday = i === new Date().getDay();
        
        return `
            <div class="mini-bar-wrapper ${isToday ? 'today' : ''}">
                <div class="mini-bar" style="height: ${height}%">
                    <span class="mini-value">${day.count}</span>
                </div>
                <span class="mini-label">${days[i]}</span>
            </div>
        `;
    }).join('');
}

// 记录胎动
function recordKick() {
    // 原有逻辑保持不变
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    const timeStr = now.toISOString();
    
    if (!kickData[dateStr]) kickData[dateStr] = [];
    kickData[dateStr].push(timeStr);
    
    localStorage.setItem('kickData', JSON.stringify(kickData));
    
    // 震动反馈
    if (settings.vibrate && navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    // 更新显示
    updateTodayCount();
    updateTimeline();
    updateWeekStats();
    
    // 显示最后记录时间
    document.getElementById('lastKick').textContent = `最後一次：${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    // 更新状态
    document.getElementById('statusBadge').innerHTML = getStatusBadge(kickData[dateStr].length);
    document.getElementById('statusTip').textContent = getStatusTip(kickData[dateStr].length);
    
    // 同步到云端
    if (supabase && getCurrentUserId()) {
        supabase.from('kick_records').insert({
            user_id: getCurrentUserId(),
            record_date: dateStr,
            record_time: timeStr,
            created_at: now.toISOString()
        }).then();
    }
}

// 添加首页增强样式
function injectHomeEnhancementStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .quick-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 20px;
        }
        .quick-stat {
            text-align: center;
            padding: 12px 8px;
            background: white;
            border-radius: 14px;
            box-shadow: 0 2px 8px rgba(255, 182, 193, 0.3);
        }
        .qs-icon {
            display: block;
            font-size: 20px;
            margin-bottom: 4px;
        }
        .qs-value {
            display: block;
            font-size: 18px;
            font-weight: bold;
            color: var(--pink-dark);
        }
        .qs-label {
            display: block;
            font-size: 11px;
            color: var(--text-light);
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }
        .badge.resting {
            background: #E0E0E0;
            color: #666;
        }
        .badge.active {
            background: #FFF8E1;
            color: #F57C00;
        }
        .badge.healthy {
            background: #E8F5E9;
            color: #388E3C;
        }
        .badge.excited {
            background: #FFEBEE;
            color: #E53935;
        }
        .week-trend-mini {
            background: white;
            border-radius: 16px;
            padding: 15px;
            margin-top: 15px;
            box-shadow: 0 4px 15px rgba(255, 182, 193, 0.3);
        }
        .week-trend-mini h3 {
            font-size: 14px;
            color: var(--text-dark);
            margin-bottom: 12px;
        }
        .trend-mini-bars {
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            height: 60px;
        }
        .mini-bar-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }
        .mini-bar-wrapper.today .mini-bar {
            background: linear-gradient(180deg, var(--pink) 0%, var(--pink-dark) 100%);
            border: 2px solid var(--pink-dark);
        }
        .mini-bar {
            width: 24px;
            background: var(--pink-light);
            border-radius: 6px 6px 0 0;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding-top: 4px;
            min-height: 20px;
        }
        .mini-value {
            font-size: 10px;
            color: var(--text-dark);
            font-weight: bold;
        }
        .mini-label {
            font-size: 11px;
            color: var(--text-light);
        }
    `;
    document.head.appendChild(style);
}

// 页面加载后应用增强
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHomeEnhancementStyles);
} else {
    injectHomeEnhancementStyles();
}

window.getStatusBadge = getStatusBadge;
window.getStatusTip = getStatusTip;
window.getStreak = getStreak;
