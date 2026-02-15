/**
 * 增强版报告系统 - Redesign方案A
 * 1. 今日概览：24小时柱状图（暖色=活跃，冷色=安静）
 * 2. 周对比：上周vs本周并排柱状图 + 趋势箭头 + 百分比
 */

// ==================== 1. 今日概览 - 24小时柱状图 ====================
function generateHourlyBarChart(date) {
    const kicks = kickData[date] || [];
    
    // 统计每小时胎动次数
    const hourlyCounts = new Array(24).fill(0);
    kicks.forEach(time => {
        const hour = new Date(time).getHours();
        hourlyCounts[hour]++;
    });
    
    const maxCount = Math.max(...hourlyCounts, 1);
    const totalCount = kicks.length;
    
    // 找峰值时段
    let peakHour = 0;
    let peakCount = 0;
    hourlyCounts.forEach((count, hour) => {
        if (count > peakCount) {
            peakCount = count;
            peakHour = hour;
        }
    });
    
    // 生成柱状图HTML
    let barsHtml = '';
    for (let h = 0; h < 24; h++) {
        const count = hourlyCounts[h];
        const heightPercent = maxCount > 0 ? (count / maxCount * 100) : 0;
        const isPeak = count === peakCount && count > 0;
        
        // 颜色判断：暖色=活跃(>15), 冷色=安静(<8), 中间=正常
        let colorClass = 'bar-normal';
        if (count > 15) colorClass = 'bar-warm';
        else if (count > 0 && count < 8) colorClass = 'bar-cool';
        else if (count >= 8) colorClass = 'bar-normal';
        
        barsHtml += `
            <div class="hourly-bar-wrapper ${isPeak ? 'peak' : ''}">
                ${isPeak && count > 0 ? `<span class="peak-badge">峰值</span>` : ''}
                ${count > 0 ? `<span class="bar-value">${count}</span>` : ''}
                <div class="hourly-bar ${colorClass}" style="height: ${Math.max(heightPercent, count > 0 ? 8 : 2)}%"></div>
                ${h % 2 === 0 ? `<span class="hour-label">${h}</span>` : '<span class="hour-label-spacer"></span>'}
            </div>
        `;
    }
    
    return `
        <div class="report-section hourly-chart-section">
            <h3>📅 今日概览</h3>
            <div class="hourly-summary">
                <div class="summary-item">
                    <span class="summary-number">${totalCount}</span>
                    <span class="summary-label">总次数</span>
                </div>
                <div class="summary-item">
                    <span class="summary-number">${peakCount > 0 ? peakHour + ':00' : '--'}</span>
                    <span class="summary-label">峰值时段</span>
                </div>
                <div class="summary-item">
                    <span class="summary-number">${peakCount}</span>
                    <span class="summary-label">峰值次数</span>
                </div>
            </div>
            <div class="hourly-chart-container">
                <div class="hourly-chart-bars">
                    ${barsHtml}
                </div>
                <div class="hourly-chart-xaxis">
                    <span>0时</span>
                    <span>6时</span>
                    <span>12时</span>
                    <span>18时</span>
                    <span>23时</span>
                </div>
            </div>
            <div class="chart-color-legend">
                <span class="legend-item"><span class="legend-dot warm"></span>活跃 (>15次/h)</span>
                <span class="legend-item"><span class="legend-dot normal"></span>正常 (8-15次/h)</span>
                <span class="legend-item"><span class="legend-dot cool"></span>安静 (<8次/h)</span>
            </div>
        </div>
    `;
}

// ==================== 2. 周对比 - 上周vs本周 ====================
function generateWeekComparisonChart() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=周日
    
    // 本周数据（周一到周日）
    const thisWeekData = [];
    const lastWeekData = [];
    const dayNames = ['一', '二', '三', '四', '五', '六', '日'];
    
    // 计算本周一的日期
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - mondayOffset);
    thisMonday.setHours(0, 0, 0, 0);
    
    // 上周一
    const lastMonday = new Date(thisMonday);
    lastMonday.setDate(thisMonday.getDate() - 7);
    
    let thisWeekTotal = 0;
    let lastWeekTotal = 0;
    
    for (let i = 0; i < 7; i++) {
        // 本周
        const thisDay = new Date(thisMonday);
        thisDay.setDate(thisMonday.getDate() + i);
        const thisDateStr = `${thisDay.getFullYear()}-${String(thisDay.getMonth()+1).padStart(2,'0')}-${String(thisDay.getDate()).padStart(2,'0')}`;
        const thisCount = kickData[thisDateStr]?.length || 0;
        thisWeekData.push({ date: thisDateStr, count: thisCount, dayName: dayNames[i] });
        thisWeekTotal += thisCount;
        
        // 上周
        const lastDay = new Date(lastMonday);
        lastDay.setDate(lastMonday.getDate() + i);
        const lastDateStr = `${lastDay.getFullYear()}-${String(lastDay.getMonth()+1).padStart(2,'0')}-${String(lastDay.getDate()).padStart(2,'0')}`;
        const lastCount = kickData[lastDateStr]?.length || 0;
        lastWeekData.push({ date: lastDateStr, count: lastCount, dayName: dayNames[i] });
        lastWeekTotal += lastCount;
    }
    
    // 计算趋势
    const percentChange = lastWeekTotal > 0 
        ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal * 100).toFixed(0)
        : (thisWeekTotal > 0 ? 100 : 0);
    
    let trendArrow = '→';
    let trendClass = 'trend-stable';
    if (percentChange > 5) {
        trendArrow = '↑';
        trendClass = 'trend-up';
    } else if (percentChange < -5) {
        trendArrow = '↓';
        trendClass = 'trend-down';
    }
    
    // 找最大值用于缩放
    const allCounts = [...thisWeekData.map(d => d.count), ...lastWeekData.map(d => d.count)];
    const maxCount = Math.max(...allCounts, 1);
    
    // 生成并排柱状图
    let barsHtml = '';
    for (let i = 0; i < 7; i++) {
        const lastH = maxCount > 0 ? (lastWeekData[i].count / maxCount * 100) : 0;
        const thisH = maxCount > 0 ? (thisWeekData[i].count / maxCount * 100) : 0;
        
        // 每日变化
        const dailyChange = lastWeekData[i].count > 0
            ? ((thisWeekData[i].count - lastWeekData[i].count) / lastWeekData[i].count * 100).toFixed(0)
            : (thisWeekData[i].count > 0 ? 100 : 0);
        let dailyArrow = '';
        if (dailyChange > 5) dailyArrow = '↑';
        else if (dailyChange < -5) dailyArrow = '↓';
        
        barsHtml += `
            <div class="week-compare-day">
                <div class="compare-bars">
                    <div class="compare-bar last-week" style="height: ${Math.max(lastH, lastWeekData[i].count > 0 ? 8 : 2)}%" title="上周${dayNames[i]}: ${lastWeekData[i].count}次">
                        ${lastWeekData[i].count > 0 ? `<span class="compare-bar-val">${lastWeekData[i].count}</span>` : ''}
                    </div>
                    <div class="compare-bar this-week" style="height: ${Math.max(thisH, thisWeekData[i].count > 0 ? 8 : 2)}%" title="本周${dayNames[i]}: ${thisWeekData[i].count}次">
                        ${thisWeekData[i].count > 0 ? `<span class="compare-bar-val">${thisWeekData[i].count}</span>` : ''}
                    </div>
                </div>
                <span class="compare-day-label">${dayNames[i]}</span>
                ${dailyArrow ? `<span class="daily-trend ${dailyArrow === '↑' ? 'trend-up' : 'trend-down'}">${dailyArrow}</span>` : ''}
            </div>
        `;
    }
    
    // 本周/上周日均
    const thisAvg = (thisWeekTotal / 7).toFixed(1);
    const lastAvg = (lastWeekTotal / 7).toFixed(1);
    
    return `
        <div class="report-section week-compare-section">
            <h3>📊 周对比</h3>
            <div class="week-compare-header">
                <div class="week-compare-summary">
                    <div class="compare-total">
                        <span class="compare-label">上周</span>
                        <span class="compare-value last">${lastWeekTotal}次</span>
                        <span class="compare-avg">日均${lastAvg}</span>
                    </div>
                    <div class="compare-trend ${trendClass}">
                        <span class="trend-arrow">${trendArrow}</span>
                        <span class="trend-percent">${Math.abs(percentChange)}%</span>
                    </div>
                    <div class="compare-total">
                        <span class="compare-label">本周</span>
                        <span class="compare-value current">${thisWeekTotal}次</span>
                        <span class="compare-avg">日均${thisAvg}</span>
                    </div>
                </div>
            </div>
            <div class="week-compare-chart">
                ${barsHtml}
            </div>
            <div class="compare-legend">
                <span class="legend-item"><span class="legend-dot last-week-color"></span>上周</span>
                <span class="legend-item"><span class="legend-dot this-week-color"></span>本周</span>
            </div>
        </div>
    `;
}

// ==================== 3. 健康评估（保留） ====================
function generateHealthAssessment(stats) {
    const dueDate = settings.dueDate;
    const weeks = dueDate ? getWeekFromDue(dueDate)?.weeks : null;
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
        <div class="report-section">
            <h3>💊 健康评估</h3>
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
        </div>
    `;
}

function getNormalRange(weeks) {
    if (!weeks) return { min: 5, max: 15, perHour: '3-5' };
    if (weeks < 28) return { min: 3, max: 10, perHour: '2-4' };
    if (weeks < 34) return { min: 5, max: 15, perHour: '3-5' };
    if (weeks < 37) return { min: 3, max: 10, perHour: '2-4' };
    return { min: 2, max: 8, perHour: '1-3' };
}

// ==================== 4. 活跃时段分布（保留） ====================
function generateTimeDistribution() {
    const timeSlots = {};
    for (let i = 0; i < 24; i++) timeSlots[i] = 0;
    
    Object.values(kickData).forEach(times => {
        times.forEach(time => {
            const hour = new Date(time).getHours();
            timeSlots[hour]++;
        });
    });
    
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
    
    const periods = [
        { name: '🌅 凌晨', hours: [0,1,2,3,4,5] },
        { name: '🌅 早上', hours: [6,7,8,9,10,11] },
        { name: '☀️ 中午', hours: [12,13,14,15,16,17] },
        { name: '🌆 晚上', hours: [18,19,20,21,22,23] }
    ];
    
    let html = '<div class="report-section"><h3>🕐 活跃时段</h3>';
    html += '<div class="time-distribution">';
    html += '<p style="margin-bottom:12px;">宝宝最活跃时段：';
    if (maxActivity === 0) {
        html += '暂无数据';
    } else {
        activePeriods.forEach(h => {
            html += `<span class="active-period">${h}:00 - ${parseInt(h)+1}:00</span>`;
        });
    }
    html += '</p>';
    
    html += '<div class="period-bars">';
    periods.forEach(period => {
        const total = period.hours.reduce((sum, h) => sum + (timeSlots[h] || 0), 0);
        const maxTotal = periods.reduce((max, p) => {
            const t = p.hours.reduce((s, h) => s + (timeSlots[h] || 0), 0);
            return Math.max(max, t);
        }, 1);
        const height = Math.max((total / maxTotal) * 100, 15);
        
        html += `
            <div class="period-bar-wrapper">
                <div class="period-bar" style="height: ${Math.min(height, 100)}%"></div>
                <span class="period-name">${period.name}</span>
                <span class="period-count">${total}次</span>
            </div>
        `;
    });
    html += '</div></div></div>';
    
    return html;
}

// ==================== 5. 计算周统计 ====================
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
        todayCount: weekData[dayOfWeek]?.count || 0,
        weekData,
        totalCount,
        avgCount: Math.round(totalCount / 7),
        activeDays
    };
}

// ==================== 6. 导出报告 ====================
function exportReport(type) {
    if (type === 'pdf') {
        window.print();
    } else if (type === 'excel') {
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

// ==================== 7. 替换原报告生成 ====================
function replaceReportGeneration() {
    // 重写报告生成 - 注入到reportContent区域
    const originalGenerateReport = window.generateReport;
    
    window.generateReport = function() {
        const date = document.getElementById('reportDate').value || getToday();
        const dateObj = new Date(date);
        const weekStats = calculateWeekStats(dateObj);
        
        const container = document.getElementById('reportContent');
        if (!container) return;
        
        // 1. 今日概览 - 24小时柱状图
        let html = generateHourlyBarChart(date);
        
        container.innerHTML = html;
        
        // 更新标题
        document.getElementById('reportTitle').textContent = `${date} 報告`;
    };
    
    // 重写周报告 - 注入到weekReportContent
    const originalWeekReport = window.generateWeekReport;
    
    window.generateWeekReport = function() {
        const container = document.getElementById('weekReportContent');
        if (!container) return;
        
        // 直接用周对比图替换原来的简单统计
        // 因为weekReport有自己的wrapper，我们需要替换整个weekReport的内容
        const weekReportEl = document.getElementById('weekReport');
        if (weekReportEl) {
            weekReportEl.outerHTML = `<div id="weekReport">${generateWeekComparisonChart()}</div>`;
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
window.generateEnhancedReport = generateHourlyBarChart;
window.calculateWeekStats = calculateWeekStats;
window.exportReport = exportReport;
