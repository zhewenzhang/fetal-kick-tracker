/**
 * 增强版报告系统
 * 添加：趋势图、统计分析、智能建议、PDF导出
 */

function generateEnhancedReport() {
    const today = document.getElementById('reportDate').value || getToday();
    const dateObj = new Date(today);
    const weekStats = calculateWeekStats(dateObj);
    
    // 生成报告HTML
    let html = `
        <div class="enhanced-report">
            <!-- 1. 今日概览 -->
            <div class="report-section">
                <h3>📅 今日概览</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${weekStats.todayCount}</div>
                        <div class="stat-label">今日胎动</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${weekStats.avgCount}</div>
                        <div class="stat-label">周均次数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${weekStats.activeDays}</div>
                        <div class="stat-label">本周记录天数</div>
                    </div>
                </div>
            </div>
            
            <!-- 2. 趋势分析 -->
            <div class="report-section">
                <h3>📈 本周趋势</h3>
                <div class="trend-chart" id="trendChart">
                    ${generateTrendChart(weekStats.weekData)}
                </div>
            </div>
            
            <!-- 3. 健康评估 -->
            <div class="report-section">
                <h3>💊 健康评估</h3>
                ${generateHealthAssessment(weekStats)}
            </div>
            
            <!-- 4. 记录时间分布 -->
            <div class="report-section">
                <h3>🕐 活跃时段</h3>
                ${generateTimeDistribution()}
            </div>
            
            <!-- 5. 周对比 -->
            <div class="report-section">
                <h3>📊 周对比</h3>
                ${generateWeekComparison()}
            </div>
            
            <!-- 6. 导出按钮 -->
            <div class="report-section export-section">
                <button class="export-btn primary" onclick="exportReport('pdf')">
                    📄 导出PDF报告
                </button>
                <button class="export-btn secondary" onclick="exportReport('excel')">
                    📊 导出Excel
                </button>
            </div>
        </div>
    `;
    
    return html;
}

// 生成趋势图（ASCII简化版）
function generateTrendChart(weekData) {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    const maxCount = Math.max(...weekData.map(d => d.count), 10);
    
    let html = '<div class="ascii-chart">';
    html += '<div class="chart-y-axis">';
    html += `<span>${maxCount}</span>`;
    html += `<span>${Math.round(maxCount/2)}</span>`;
    html += '<span>0</span>';
    html += '</div>';
    html += '<div class="chart-bars">';
    
    weekData.forEach((day, i) => {
        const height = (day.count / maxCount * 100).toFixed(0);
        const emoji = getDayEmoji(day.count);
        html += `
            <div class="chart-bar-wrapper">
                <div class="chart-bar" style="height: ${height}%">
                    <span class="bar-value">${day.count}</span>
                </div>
                <span class="bar-label">${days[i]}</span>
            </div>
        `;
    });
    
    html += '</div></div>';
    return html;
}

// 获取日期emoji
function getDayEmoji(count) {
    if (count === 0) return '💤';
    if (count < 5) return '🌱';
    if (count < 10) return '👍';
    if (count < 20) return '🎉';
    return '🔥';
}

// 生成健康评估
function generateHealthAssessment(stats) {
    const dueDate = settings.dueDate;
    const weeks = dueDate ? calculateWeeks(dueDate) : null;
    const normalRange = getNormalRange(weeks);
    
    let status = 'good';
    let message = '';
    
    if (stats.avgCount < normalRange.min) {
        status = 'warning';
        message = `宝宝今天活动较少。建议：轻轻拍拍肚子，观察宝宝是否有回应。`;
    } else if (stats.avgCount > normalRange.max) {
        status = 'good';
        message = `宝宝非常活跃！继续保持记录。`;
    } else {
        status = 'good';
        message = `胎动次数正常范围内，继续保持！`;
    }
    
    const statusEmoji = status === 'good' ? '✅' : '⚠️';
    
    return `
        <div class="health-card ${status}">
            <div class="health-header">
                <span class="status-emoji">${statusEmoji}</span>
                <span class="status-text">${weeks ? `孕${weeks}周` : '孕期'}</span>
            </div>
            <div class="health-info">
                <p>参考范围：每小时 ${normalRange.perHour} 次</p>
                <p>您的宝宝：${stats.avgCount > 0 ? '高于' : '接近'}平均水平</p>
            </div>
            <div class="health-tip">
                💡 ${message}
            </div>
        </div>
    `;
}

// 获取孕周正常范围
function getNormalRange(weeks) {
    if (!weeks) return { min: 5, max: 15, perHour: '3-5' };
    
    if (weeks < 28) {
        return { min: 3, max: 10, perHour: '2-4' };
    } else if (weeks < 34) {
        return { min: 5, max: 15, perHour: '3-5' };
    } else if (weeks < 37) {
        return { min: 3, max: 10, perHour: '2-4' };
    } else {
        return { min: 2, max: 8, perHour: '1-3' };
    }
}

// 计算孕周
function calculateWeeks(dueDate) {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? Math.floor(diffDays / 7) : 40;
}

// 生成时间段分布
function generateTimeDistribution() {
    const timeSlots = {};
    for (let i = 0; i < 24; i++) timeSlots[i] = 0;
    
    // 统计每个时段的胎动次数
    Object.values(kickData).forEach(times => {
        times.forEach(time => {
            const hour = new Date(time).getHours();
            timeSlots[hour]++;
        });
    });
    
    // 找出最活跃时段
    let maxActivity = 0;
    let activePeriods = [];
    Object.entries(timeSlots).forEach(([hour, count]) => {
        if (count > maxActivity) {
            maxActivity = count;
            activePeriods = [hour];
        } else if (count === maxActivity && count > 0) {
            activePeriods.push(hour);
        }
    });
    
    let html = '<div class="time-distribution">';
    html += '<p>宝宝最活跃时段：';
    if (maxActivity === 0) {
        html += '暂无数据';
    } else {
        activePeriods.forEach(h => {
            const timeRange = `${h}:00 - ${parseInt(h)+1}:00`;
            html += `<span class="active-period">${timeRange}</span>`;
        });
    }
    html += '</p>';
    
    // 按时段显示简要分布
    const periods = [
        { name: '🌅 凌晨', hours: [0,1,2,3,4,5] },
        { name: '🌅 早上', hours: [6,7,8,9,10,11] },
        { name: '☀️ 中午', hours: [12,13,14,15,16,17] },
        { name: '🌆 晚上', hours: [18,19,20,21,22,23] }
    ];
    
    html += '<div class="period-bars">';
    periods.forEach(period => {
        const total = period.hours.reduce((sum, h) => sum + (timeSlots[h] || 0), 0);
        const maxPeriod = Math.max(...period.hours.map(h => timeSlots[h] || 0), 1);
        const height = Math.max((total / (maxPeriod * 3 || 1)) * 100, 20);
        
        html += `
            <div class="period-bar-wrapper">
                <div class="period-bar" style="height: ${Math.min(height, 100)}%"></div>
                <span class="period-name">${period.name}</span>
            </div>
        `;
    });
    html += '</div></div>';
    
    return html;
}

// 生成周对比
function generateWeekComparison() {
    const weeks = [];
    for (let i = 3; i >= 1; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7));
        weeks.push({ weekNum: `第${4-i}周`, stats: calculateWeekStats(weekStart) });
    }
    
    let html = '<div class="week-comparison">';
    weeks.forEach(w => {
        html += `
            <div class="week-item">
                <span class="week-label">${w.weekNum}</span>
                <div class="week-bar-wrapper">
                    <div class="week-bar" style="width: ${Math.min(w.stats.avgCount * 5, 100)}%"></div>
                </div>
                <span class="week-count">${w.stats.totalCount}次</span>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// 计算周统计
function calculateWeekStats(date) {
    const dayOfWeek = date.getDay();
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - dayOfWeek);
    
    let weekData = [];
    let totalCount = 0;
    let activeDays = 0;
    
    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);
        const dateStr = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
        const count = kickData[dateStr]?.length || 0;
        weekData.push({ date: dateStr, count });
        if (count > 0) activeDays++;
        totalCount += count;
    }
    
    return {
        todayCount: weekData[6].count,
        weekData,
        totalCount,
        avgCount: Math.round(totalCount / 7),
        activeDays
    };
}

// 导出报告
function exportReport(type) {
    if (type === 'pdf') {
        window.print();
    } else if (type === 'excel') {
        // 简化的CSV导出
        let csv = '日期,时间\n';
        Object.entries(kickData).forEach(([date, times]) => {
            times.forEach(time => {
                csv += `${date},${new Date(time).toLocaleTimeString()}\n`;
            });
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `胎动记录_${getToday()}.csv`;
        a.click();
    }
}

// 注入增强版报告样式
function injectEnhancedReportStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .enhanced-report {
            padding: 15px;
        }
        .report-section {
            background: white;
            border-radius: 16px;
            padding: 18px;
            margin-bottom: 15px;
            box-shadow: 0 4px 15px rgba(255, 182, 193, 0.3);
        }
        .report-section h3 {
            font-size: 16px;
            color: var(--text-dark);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        }
        .stat-card {
            text-align: center;
            padding: 12px;
            background: linear-gradient(135deg, var(--pink-light) 0%, var(--white) 100%);
            border-radius: 12px;
        }
        .stat-number {
            font-size: 28px;
            font-weight: bold;
            color: var(--pink-dark);
        }
        .stat-label {
            font-size: 12px;
            color: var(--text-light);
        }
        .health-card {
            padding: 15px;
            border-radius: 12px;
            border-left: 4px solid var(--success);
        }
        .health-card.warning {
            border-left-color: var(--warning);
            background: #FFF8E1;
        }
        .health-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
        }
        .status-emoji {
            font-size: 24px;
        }
        .status-text {
            font-weight: bold;
            color: var(--text-dark);
        }
        .health-info p {
            font-size: 13px;
            color: var(--text-light);
            margin: 4px 0;
        }
        .health-tip {
            margin-top: 10px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 8px;
            font-size: 13px;
        }
        .period-bars {
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            height: 60px;
            margin-top: 15px;
        }
        .period-bar-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }
        .period-bar {
            width: 24px;
            background: linear-gradient(180deg, var(--pink) 0%, var(--pink-dark) 100%);
            border-radius: 6px 6px 0 0;
            min-height: 8px;
        }
        .period-name {
            font-size: 10px;
            color: var(--text-light);
        }
        .week-comparison {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .week-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .week-label {
            width: 50px;
            font-size: 13px;
            color: var(--text-dark);
        }
        .week-bar-wrapper {
            flex: 1;
            height: 20px;
            background: var(--pink-light);
            border-radius: 10px;
            overflow: hidden;
        }
        .week-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--pink) 0%, var(--pink-dark) 100%);
            border-radius: 10px;
            transition: width 0.5s ease;
        }
        .week-count {
            width: 50px;
            font-size: 12px;
            color: var(--text-light);
            text-align: right;
        }
        .export-section {
            display: flex;
            gap: 10px;
        }
        .export-btn {
            flex: 1;
            padding: 14px;
            border-radius: 12px;
            border: none;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .export-btn.primary {
            background: linear-gradient(135deg, var(--pink-dark) 0%, var(--pink) 100%);
            color: white;
        }
        .export-btn.secondary {
            background: white;
            border: 2px solid var(--pink);
            color: var(--pink-dark);
        }
        .export-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
        }
        .active-period {
            display: inline-block;
            padding: 4px 12px;
            background: var(--pink-light);
            border-radius: 20px;
            margin: 0 4px;
            font-size: 13px;
            color: var(--pink-dark);
        }
        @media print {
            .export-section, .header, .page-tabs, .kick-button {
                display: none !important;
            }
            .report-section {
                break-inside: avoid;
            }
        }
    `;
    document.head.appendChild(style);
}

// 替换原报告生成函数
function replaceReportGeneration() {
    // 保存原函数
    const originalGenerateReport = window.generateReport;
    
    // 重写报告生成
    window.generateReport = function() {
        // 确保样式已注入
        if (!document.querySelector('.enhanced-report')) {
            injectEnhancedReportStyles();
        }
        
        const date = document.getElementById('reportDate').value || getToday();
        const count = kickData[date]?.length || 0;
        
        let html = `
            <div class="enhanced-report">
                <div class="report-section">
                    <h3>📅 ${date} 胎动记录</h3>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${count}</div>
                            <div class="stat-label">今日胎动</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${count >= 10 ? '✅' : count >= 6 ? '👍' : '⚠️'}</div>
                            <div class="stat-label">${count >= 10 ? '非常活跃' : count >= 6 ? '正常' : '偏少'}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${count > 0 ? '🔥' : '💤'}</div>
                            <div class="stat-label">${count > 0 ? '有记录' : '无记录'}</div>
                        </div>
                    </div>
                </div>
                ${generateEnhancedReport().replace('<div class="enhanced-report">', '').replace('</div>', '')}
            </div>
        `;
        
        const container = document.getElementById('reportContent');
        if (container) {
            container.innerHTML = html;
        }
    };
}

// 页面加载后替换
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceReportGeneration);
} else {
    replaceReportGeneration();
}

// 导出供全局使用
window.generateEnhancedReport = generateEnhancedReport;
window.calculateWeekStats = calculateWeekStats;
window.exportReport = exportReport;
