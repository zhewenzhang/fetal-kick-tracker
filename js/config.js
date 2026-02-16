/**
 * 配置文件
 */

const CONFIG = {
    // Supabase配置
    SUPABASE: {
        URL: 'https://uwvlduprxppwdkjkvwby.supabase.co',
        ANON_KEY: 'sb_publishable_NCyVuDM0d_Nkn50QvKdY-Q_OCQJsN5L'
    },
    
    // 存储键名
    STORAGE_KEYS: {
        KICK_DATA: 'kickData',
        SETTINGS: 'kickSettings',
        BABY_STYLE: 'babyStyleSettings'
    },
    
    // 孕期标准
    PREGNANCY_STANDARDS: {
        early: { min: 6, max: null, tip: '孕中期：胎动逐渐规律' },
        peak: { min: 10, max: null, tip: '孕晚期：胎动最活跃时期' },
        late: { min: 3, max: 5, tip: '足月：胎动减少但保持规律' }
    },
    
    // 主题配置
    THEMES: {
        spring: { name: '春天', primary: '#FFB6C1' },
        summer: { name: '夏天', primary: '#87CEEB' },
        autumn: { name: '秋天', primary: '#DEB887' },
        winter: { name: '冬天', primary: '#E0F7FA' }
    }
};

// 导出
window.CONFIG = CONFIG;
