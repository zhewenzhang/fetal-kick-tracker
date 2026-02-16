/**
 * 主应用模块
 */

const App = {
    // 初始化
    async init() {
        // 初始化Supabase
        Auth.supabase = window.supabase.createClient(
            CONFIG.SUPABASE.URL,
            CONFIG.SUPABASE_ANON_KEY
        );
        
        // 初始化Auth
        await Auth.init();
        
        // 初始化Data
        Data.init(Auth.supabase);
        
        // 更新UI
        this.updateStats();
        
        // 加载设置
        this.loadSettings();
        
        console.log('App initialized');
    },
    
    // 更新统计
    updateStats() {
        const todayCount = Storage.getTodayCount();
        const yesterdayCount = Storage.getYesterdayCount();
        const weekData = Storage.getWeekData();
        
        // 更新今日次数
        document.getElementById('todayCount').textContent = todayCount;
        
        // 更新变化
        const changeEl = document.getElementById('todayChange');
        if (yesterdayCount > 0) {
            const change = ((todayCount - yesterdayCount) / yesterdayCount * 100).toFixed(0);
            if (change > 0) {
                changeEl.textContent = `↑ ${change}%`;
                changeEl.className = 'stat-change up';
            } else if (change < 0) {
                changeEl.textContent = `↓ ${Math.abs(change)}%`;
                changeEl.className = 'stat-change down';
            } else {
                changeEl.textContent = '→ 0%';
                changeEl.className = 'stat-change neutral';
            }
        } else {
            changeEl.textContent = '';
        }
        
        // 更新本周统计
        const total = weekData.reduce((sum, d) => sum + d.count, 0);
        const avg = Math.round(total / 7);
        
        document.getElementById('weekTotal').textContent = total;
        document.getElementById('weekAvg').textContent = avg;
    },
    
    // 加载设置
    loadSettings() {
        const settings = Storage.getSettings();
        
        if (settings.dueDate) {
            const dueDate = new Date(settings.dueDate);
            const now = new Date();
            const weeks = Math.floor((dueDate - now) / (7 * 24 * 60 * 60 * 1000));
            const days = Math.floor((dueDate - now) / (24 * 60 * 60 * 1000));
            
            if (weeks > 0) {
                document.getElementById('dueDateDisplay').textContent = 
                    `孕${40 - weeks}周 ${days}天后预产期`;
            }
        }
    },
    
    // 记录胎动
    async recordKick() {
        const now = new Date();
        const dateStr = Storage.getTodayKey();
        const timeStr = now.toISOString();
        
        // 本地存储
        Storage.addKick(timeStr);
        
        // 云端存储（如果已登录）
        if (Auth.isLoggedIn()) {
            await Data.saveKickRecord(dateStr, timeStr);
        }
        
        // 震动反馈
        const settings = Storage.getSettings();
        if (settings.vibrate && navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // 视觉反馈
        this.showKickFeedback();
        
        // 更新统计
        this.updateStats();
    },
    
    // 显示记录反馈
    showKickFeedback() {
        const feedback = document.getElementById('kickFeedback');
        feedback.classList.add('show');
        
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 500);
    },
    
    // 显示Toast
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },
    
    // 登录成功回调
    onLoginSuccess() {
        this.showToast('🎉 登录成功！');
        this.updateStats();
    },
    
    // 显示登录弹窗
    showLoginModal() {
        document.getElementById('loginModal').classList.add('show');
    },
    
    // 隐藏登录弹窗
    hideLoginModal() {
        document.getElementById('loginModal').classList.remove('show');
    },
    
    // 显示注册弹窗
    showRegisterModal() {
        document.getElementById('registerModal').classList.add('show');
    },
    
    // 隐藏注册弹窗
    hideRegisterModal() {
        document.getElementById('registerModal').classList.remove('show');
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// 导出
window.App = App;

// 全局函数
window.recordKick = () => App.recordKick();
window.showLoginModal = () => App.showLoginModal();
window.hideLoginModal = () => App.hideLoginModal();
window.handleLogin = async () => {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        document.getElementById('loginMessage').innerHTML = '<p style="color:red">请填写邮箱和密码</p>';
        return;
    }
    
    const result = await Auth.login(email, password);
    
    if (result.success) {
        App.hideLoginModal();
        App.onLoginSuccess();
    } else {
        document.getElementById('loginMessage').innerHTML = `<p style="color:red">${result.error}</p>`;
    }
};

window.handleRegister = async () => {
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    if (!email || !password) {
        document.getElementById('registerMessage').innerHTML = '<p style="color:red">请填写邮箱和密码</p>';
        return;
    }
    
    if (password.length < 6) {
        document.getElementById('registerMessage').innerHTML = '<p style="color:red">密码至少6位</p>';
        return;
    }
    
    const result = await Auth.register(email, password);
    
    if (result.success) {
        App.showToast('注册成功！请登录');
        App.hideRegisterModal();
        App.showLoginModal();
    } else {
        document.getElementById('registerMessage').innerHTML = `<p style="color:red">${result.error}</p>`;
    }
};

window.handleLogout = async () => {
    await Auth.logout();
    App.showToast('已退出登录');
    Storage.clearAll();
    App.updateStats();
};

window.switchToLogin = () => {
    App.hideRegisterModal();
    App.showLoginModal();
};

window.showPage = (page) => {
    App.showToast(`页面 ${page} 开发中...`);
};
