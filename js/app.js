/**
 * 主应用模块 - 增强版
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
        
        // 更新按钮状态
        this.updateKickButton();
        
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
            changeEl.textContent = todayCount > 0 ? '🎉 第一天!' : '';
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
            
            if (weeks > 0 && weeks <= 40) {
                document.getElementById('dueDateDisplay').textContent = 
                    `孕${40 - weeks}周 ${days}天后预产期`;
            }
        }
    },
    
    // 更新按钮状态
    updateKickButton() {
        const button = document.getElementById('kickButton');
        const hint = document.getElementById('kickHint');
        
        if (Auth.isLoggedIn()) {
            button.classList.add('ready');
            hint.textContent = '点击记录宝宝胎动';
            hint.style.color = 'var(--primary)';
        } else {
            button.classList.remove('ready');
            hint.textContent = '请先登录才能记录';
            hint.style.color = 'var(--text-light)';
        }
    },
    
    // 检查是否可以记录
    canRecordKick() {
        if (!Auth.isLoggedIn()) {
            this.showToast('请先登录才能记录胎动 ❤️', 'warning');
            this.showLoginModal();
            return false;
        }
        return true;
    },
    
    // 记录胎动 - 增强版
    async recordKick() {
        // 检查登录
        if (!this.canRecordKick()) return;
        
        const now = new Date();
        const dateStr = Storage.getTodayKey();
        const timeStr = now.toISOString();
        
        // 本地存储
        Storage.addKick(timeStr);
        
        // 云端存储
        if (Auth.isLoggedIn()) {
            await Data.saveKickRecord(dateStr, timeStr);
        }
        
        // 震动反馈
        const settings = Storage.getSettings();
        if (settings.vibrate && navigator.vibrate) {
            navigator.vibrate([50, 30, 50]); // 两次震动
        }
        
        // 增强动效
        this.showKickAnimation();
        
        // 更新统计
        this.updateStats();
    },
    
    // 显示胎动动画 - 幸福版
    showKickAnimation() {
        const button = document.getElementById('kickButton');
        
        // 1. 按钮动画
        button.classList.add('kicking');
        button.style.transform = 'scale(0.9)';
        
        // 2. 涟漪效果
        this.createRippleEffect();
        
        // 3. 数字跳动
        this.animateCount();
        
        // 4. 幸福感消息
        this.showHappyMessage();
        
        // 5. 恢复
        setTimeout(() => {
            button.classList.remove('kicking');
            button.style.transform = '';
        }, 500);
    },
    
    // 创建涟漪效果
    createRippleEffect() {
        const button = document.getElementById('kickButton');
        const rect = button.getBoundingClientRect();
        
        // 创建多个涟漪
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const ripple = document.createElement('div');
                ripple.className = 'kick-ripple';
                ripple.innerHTML = '💕';
                ripple.style.cssText = `
                    position: fixed;
                    left: ${rect.left + rect.width/2}px;
                    top: ${rect.top + rect.height/2}px;
                    font-size: ${20 + Math.random() * 20}px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: rippleOut 1s ease-out forwards;
                    opacity: 0.8;
                `;
                document.body.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 1000);
            }, i * 150);
        }
    },
    
    // 数字动画
    animateCount() {
        const countEl = document.getElementById('todayCount');
        const current = parseInt(countEl.textContent) || 0;
        
        // 跳动效果
        countEl.style.transform = 'scale(1.3)';
        countEl.style.color = 'var(--success)';
        
        setTimeout(() => {
            countEl.textContent = current + 1;
            countEl.style.transform = 'scale(1)';
            countEl.style.color = '';
        }, 200);
    },
    
    // 幸福感消息
    showHappyMessage() {
        const messages = [
            '❤️ 宝宝感受到了！',
            '😊 幸福的互动',
            '👶 宝宝在回应你',
            '💕 甜蜜的时刻',
            '✨ 爱的传递',
            '🌟 小生命在跳动'
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        // 创建消息气泡
        const bubble = document.createElement('div');
        bubble.className = 'happy-bubble';
        bubble.textContent = message;
        bubble.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF69B4, #FFB6C1);
            color: white;
            padding: 16px 32px;
            border-radius: 24px;
            font-size: 18px;
            font-weight: 600;
            z-index: 10000;
            animation: bubbleFloat 1.5s ease-out forwards;
            box-shadow: 0 8px 32px rgba(255, 105, 180, 0.4);
        `;
        
        document.body.appendChild(bubble);
        
        setTimeout(() => bubble.remove(), 1500);
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
        this.showToast('🎉 登录成功！开始记录幸福时刻', 'success');
        this.updateKickButton();
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

// 添加涟漪动画CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleOut {
        0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
        }
    }
    
    @keyframes bubbleFloat {
        0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
        20% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
        }
        80% {
            transform: translate(-50%, -60%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -80%) scale(0.8);
            opacity: 0;
        }
    }
    
    .kick-button.kicking {
        animation: kickPulse 0.5s ease-out !important;
    }
    
    @keyframes kickPulse {
        0% { transform: scale(1); }
        30% { transform: scale(0.85); }
        60% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .kick-button.ready {
        box-shadow: 0 0 0 0 rgba(255, 105, 180, 0.7);
        animation: readyPulse 2s infinite !important;
    }
    
    @keyframes readyPulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 105, 180, 0.4); }
        70% { box-shadow: 0 0 0 20px rgba(255, 105, 180, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 105, 180, 0); }
    }
    
    #todayCount {
        transition: transform 0.2s, color 0.2s;
    }
`;
document.head.appendChild(style);

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
    App.updateKickButton();
};

window.switchToLogin = () => {
    App.hideRegisterModal();
    App.showLoginModal();
};

window.showPage = (page) => {
    App.showToast(`页面 ${page} 开发中...`);
};
