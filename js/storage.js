/**
 * 本地存储模块
 */

const Storage = {
    // 获取胎动数据
    getKickData() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEYS.KICK_DATA);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('读取胎动数据失败:', e);
            return {};
        }
    },
    
    // 保存胎动数据
    saveKickData(data) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.KICK_DATA, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('保存胎动数据失败:', e);
            return false;
        }
    },
    
    // 获取设置
    getSettings() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS);
            return data ? JSON.parse(data) : this.getDefaultSettings();
        } catch (e) {
            return this.getDefaultSettings();
        }
    },
    
    // 保存设置
    saveSettings(settings) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
            return true;
        } catch (e) {
            return false;
        }
    },
    
    // 获取宝宝风格
    getBabyStyle() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEYS.BABY_STYLE);
            return data ? JSON.parse(data) : { style: 'cartoon', icon: '👶🏻' };
        } catch (e) {
            return { style: 'cartoon', icon: '👶🏻' };
        }
    },
    
    // 保存宝宝风格
    saveBabyStyle(style) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.BABY_STYLE, JSON.stringify(style));
            return true;
        } catch (e) {
            return false;
        }
    },
    
    // 获取默认设置
    getDefaultSettings() {
        return {
            dueDate: '',
            babyName: '',
            vibrate: true,
            theme: 'spring'
        };
    },
    
    // 获取今日日期key
    getTodayKey() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    },
    
    // 获取昨日日期key
    getYesterdayKey() {
        const now = new Date();
        now.setDate(now.getDate() - 1);
        return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    },
    
    // 添加胎动记录
    addKick(timeStr) {
        const data = this.getKickData();
        const todayKey = this.getTodayKey();
        
        if (!data[todayKey]) {
            data[todayKey] = [];
        }
        data[todayKey].push(timeStr);
        
        return this.saveKickData(data);
    },
    
    // 获取今日胎动次数
    getTodayCount() {
        const data = this.getKickData();
        const todayKey = this.getTodayKey();
        return data[todayKey]?.length || 0;
    },
    
    // 获取昨日胎动次数
    getYesterdayCount() {
        const data = this.getKickData();
        const yesterdayKey = this.getYesterdayKey();
        return data[yesterdayKey]?.length || 0;
    },
    
    // 获取本周数据
    getWeekData() {
        const data = this.getKickData();
        const weekData = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
            weekData.push({
                date: key,
                count: data[key]?.length || 0
            });
        }
        
        return weekData;
    },
    
    // 清除所有数据
    clearAll() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.KICK_DATA);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.SETTINGS);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.BABY_STYLE);
    }
};

window.Storage = Storage;
