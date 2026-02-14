/**
 * 胎动记录器 - 多主题皮肤系统
 * 4套主题：春季、夏季、秋季、冬季
 */

const themeConfig = {
    spring: {
        name: '春季',
        emoji: '🌸',
        description: '粉色系，樱花/花朵元素',
        colors: {
            primary: '#FF69B4',      // 粉色主色
            primaryLight: '#FFB6C1',
            primaryDark: '#FF1493',
            secondary: '#FFB7C5',   // 樱花粉
            gradientStart: '#FFE4EC', // 浅粉渐变
            gradientMid: '#FFF0F5',
            gradientEnd: '#E0F7FA',
            accent: '#FF85A2',
            background: 'linear-gradient(180deg, #FFE4EC 0%, #FFF0F5 50%, #E0F7FA 100%)',
            cardBg: 'linear-gradient(135deg, #FFFFFF 0%, #FFE4EC 100%)',
            textPrimary: '#4A4A4A',
            textSecondary: '#888888',
            border: '#FFB6C1',
            success: '#81C784',
            warning: '#FFD54F',
            danger: '#EF5350'
        },
        icons: {
            flower: '🌸',
            cloud: '☁️',
            sun: '☀️'
        },
        animation: 'fadeIn'
    },
    summer: {
        name: '夏季',
        emoji: '☀️',
        description: '蓝色系，清爽海洋元素',
        colors: {
            primary: '#4FC3F7',      // 天蓝主色
            primaryLight: '#81D4FA',
            primaryDark: '#29B6F6',
            secondary: '#4DD0E1',    // 青色
            gradientStart: '#E0F7FA', // 浅蓝渐变
            gradientMid: '#E1F5FE',
            gradientEnd: '#B3E5FC',
            accent: '#26C6DA',
            background: 'linear-gradient(180deg, #E0F7FA 0%, #E1F5FE 50%, #B3E5FC 100%)',
            cardBg: 'linear-gradient(135deg, #FFFFFF 0%, #E0F7FA 100%)',
            textPrimary: '#37474F',
            textSecondary: '#607D8B',
            border: '#4FC3F7',
            success: '#66BB6A',
            warning: '#FFCA28',
            danger: '#EF5350'
        },
        icons: {
            flower: '🌊',
            cloud: '☁️',
            sun: '☀️'
        },
        animation: 'slideUp'
    },
    autumn: {
        name: '秋季',
        emoji: '🍂',
        description: '橙色系，温暖丰收氛围',
        colors: {
            primary: '#FF8A65',      // 橙色主色
            primaryLight: '#FFAB91',
            primaryDark: '#FF7043',
            secondary: '#FFB74D',    // 金色
            gradientStart: '#FFF3E0', // 暖橙渐变
            gradientMid: '#FFE0B2',
            gradientEnd: '#FFCC80',
            accent: '#FF9800',
            background: 'linear-gradient(180deg, #FFF3E0 0%, #FFE0B2 50%, #FFCC80 100%)',
            cardBg: 'linear-gradient(135deg, #FFFFFF 0%, #FFF3E0 100%)',
            textPrimary: '#4E342E',
            textSecondary: '#795548',
            border: '#FFAB91',
            success: '#81C784',
            warning: '#FFB300',
            danger: '#EF5350'
        },
        icons: {
            flower: '🍁',
            cloud: '☁️',
            sun: '🍂'
        },
        animation: 'bounce'
    },
    winter: {
        name: '冬季',
        emoji: '❄️',
        description: '蓝紫色系，静谧星空元素',
        colors: {
            primary: '#9575CD',      // 紫色主色
            primaryLight: '#B39DDB',
            primaryDark: '#7E57C2',
            secondary: '#64B5F6',    // 蓝色
            gradientStart: '#EDE7F6', // 浅紫渐变
            gradientMid: '#E8EAF6',
            gradientEnd: '#C5CAE9',
            accent: '#7986CB',
            background: 'linear-gradient(180deg, #EDE7F6 0%, #E8EAF6 50%, #C5CAE9 100%)',
            cardBg: 'linear-gradient(135deg, #FFFFFF 0%, #EDE7F6 100%)',
            textPrimary: '#37474F',
            textSecondary: '#5C6BC0',
            border: '#B39DDB',
            success: '#81C784',
            warning: '#FFD54F',
            danger: '#EF5350'
        },
        icons: {
            flower: '❄️',
            cloud: '⭐',
            sun: '🌙'
        },
        animation: 'fadeIn'
    }
};

// 当前主题
let currentTheme = 'spring';

// 初始化主题系统
function initTheme() {
    // 从localStorage读取主题
    const savedTheme = localStorage.getItem('kickTrackerTheme');
    if (savedTheme && themeConfig[savedTheme]) {
        currentTheme = savedTheme;
    } else {
        // 默认使用春季主题
        currentTheme = 'spring';
    }
    
    // 应用主题
    applyTheme(currentTheme);
}

// 应用主题
function applyTheme(themeName) {
    const theme = themeConfig[themeName];
    if (!theme) return;
    
    currentTheme = themeName;
    const root = document.documentElement;
    const colors = theme.colors;
    
    // 应用CSS变量
    root.style.setProperty('--pink-light', colors.gradientStart);
    root.style.setProperty('--pink', colors.border);
    root.style.setProperty('--pink-dark', colors.primary);
    root.style.setProperty('--purple-light', colors.gradientMid);
    root.style.setProperty('--purple', colors.secondary);
    root.style.setProperty('--blue-light', colors.gradientEnd);
    root.style.setProperty('--white', '#FFFFFF');
    root.style.setProperty('--text-dark', colors.textPrimary);
    root.style.setProperty('--text-light', colors.textSecondary);
    root.style.setProperty('--success', colors.success);
    root.style.setProperty('--warning', colors.warning);
    root.style.setProperty('--danger', colors.danger);
    
    // 应用背景渐变
    document.body.style.background = colors.background;
    
    // 更新卡片背景
    const cards = document.querySelectorAll('.stats-card, .week-card, .user-info-card, .baby-style-section, .settings-card, .report-card, .chart-card');
    cards.forEach(card => {
        card.style.background = card.classList.contains('user-info-card') 
            ? `linear-gradient(135deg, #FFFFFF 0%, ${colors.gradientStart} 100%)`
            : 'linear-gradient(135deg, #FFFFFF 0%, #FFE4EC 100%)';
        if (card.classList.contains('baby-style-section') || card.classList.contains('settings-card')) {
            card.style.boxShadow = `0 4px 15px ${colors.primary}33`;
        }
    });
    
    // 更新标题颜色
    const headers = document.querySelectorAll('.header h1');
    headers.forEach(header => {
        header.style.color = colors.primary;
    });
    
    // 更新按钮颜色
    const buttons = document.querySelectorAll('.kick-button');
    buttons.forEach(btn => {
        btn.style.background = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`;
        btn.style.boxShadow = `0 6px 20px ${colors.primary}66`;
    });
    
    // 保存主题到localStorage
    localStorage.setItem('kickTrackerTheme', themeName);
    
    // 更新主题选择器UI
    updateThemeSelectorUI(themeName);
    
    // 打印日志
    console.log(`🎨 主题已切换至: ${theme.name} ${theme.emoji}`);
}

// 切换主题
function switchTheme(themeName) {
    if (!themeConfig[themeName]) return;
    
    // 添加切换动画
    document.body.style.transition = 'all 0.5s ease';
    document.body.style.opacity = '0.5';
    
    setTimeout(() => {
        applyTheme(themeName);
        document.body.style.opacity = '1';
    }, 200);
    
    // 保存主题到localStorage (settings)
    if (typeof settings !== 'undefined') {
        settings.theme = themeName;
        localStorage.setItem('kickSettings', JSON.stringify(settings));
    } else {
        localStorage.setItem('kickTrackerTheme', themeName);
    }
    
    // 保存到Supabase（如果已登录）
    if (typeof uploadSettings === 'function' && getCurrentUserId()) {
        settings.theme = themeName;
        uploadSettings();
    }
}

// 更新主题选择器UI
function updateThemeSelectorUI(selectedTheme) {
    const options = document.querySelectorAll('.theme-option');
    options.forEach(option => {
        const themeName = option.dataset.theme;
        if (themeName === selectedTheme) {
            option.classList.add('selected');
            option.style.borderColor = themeConfig[themeName].colors.primary;
            option.style.background = themeConfig[themeName].colors.gradientStart;
        } else {
            option.classList.remove('selected');
            option.style.borderColor = '#E0E0E0';
            option.style.background = '#FFFFFF';
        }
    });
}

// 创建主题选择器HTML
function createThemeSelector() {
    const themes = Object.entries(themeConfig).map(([key, theme]) => `
        <div class="theme-option ${key === currentTheme ? 'selected' : ''}" 
             data-theme="${key}" 
             onclick="switchTheme('${key}')">
            <div class="theme-emoji">${theme.emoji}</div>
            <div class="theme-name">${theme.name}</div>
            <div class="theme-desc">${theme.description.split('，')[0]}</div>
            <div class="theme-preview">
                <span style="background: ${theme.colors.primary};"></span>
                <span style="background: ${theme.colors.secondary};"></span>
                <span style="background: ${theme.colors.gradientStart};"></span>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="theme-selector-section">
            <h3>🎨 主题皮肤</h3>
            <p style="font-size: 12px; color: var(--text-light); margin-bottom: 12px;">
                选择你喜欢的风格，让记录孕期更加温馨：
            </p>
            <div class="theme-grid">
                ${themes}
            </div>
            <div class="current-theme-info" id="currentThemeInfo">
                当前主题：${themeConfig[currentTheme].emoji} ${themeConfig[currentTheme].name}
            </div>
        </div>
    `;
}

// 导出主题配置供外部使用
window.themeConfig = themeConfig;
window.switchTheme = switchTheme;
window.initTheme = initTheme;
window.applyTheme = applyTheme;
window.createThemeSelector = createThemeSelector;
