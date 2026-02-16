/**
 * 认证模块
 */

const Auth = {
    supabase: null,
    user: null,
    initialized: false,
    
    // 初始化
    async init() {
        this.supabase = window.supabase.createClient(
            CONFIG.SUPABASE.URL,
            CONFIG.SUPABASE_ANON_KEY
        );
        
        // 监听认证状态变化
        this.supabase.auth.onAuthStateChange((event, session) => {
            this.handleAuthChange(event, session);
        });
        
        // 检查现有会话
        await this.checkSession();
        
        this.initialized = true;
    },
    
    // 处理认证状态变化
    handleAuthChange(event, session) {
        if (event === 'SIGNED_IN' && session?.user) {
            this.user = session.user;
            this.updateUI();
            App.onLoginSuccess();
        } else if (event === 'SIGNED_OUT') {
            this.user = null;
            this.updateUI();
        }
    },
    
    // 检查会话
    async checkSession() {
        try {
            const { data: { session } } = await this.supabase.auth.getSession();
            if (session?.user) {
                this.user = session.user;
                this.updateUI();
            }
            return session?.user || null;
        } catch (e) {
            console.error('检查会话失败:', e);
            return null;
        }
    },
    
    // 邮箱登录
    async login(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            return { success: true, user: data.user };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },
    
    // 邮箱注册
    async register(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password
            });
            
            if (error) throw error;
            return { success: true, user: data.user };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },
    
    // Google登录
    async loginWithGoogle() {
        try {
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google'
            });
            
            if (error) throw error;
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },
    
    // 退出登录
    async logout() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            Storage.clearAll();
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },
    
    // 获取用户ID
    getUserId() {
        return this.user?.id || null;
    },
    
    // 是否已登录
    isLoggedIn() {
        return this.user !== null;
    },
    
    // 更新UI显示
    updateUI() {
        const userNameEl = document.getElementById('userName');
        const userStatusEl = document.getElementById('userStatus');
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (this.user) {
            userNameEl.textContent = this.user.email?.split('@')[0] || '用户';
            userStatusEl.textContent = '已登录';
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
        } else {
            userNameEl.textContent = '未登录';
            userStatusEl.textContent = '登录后同步数据';
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
        }
    }
};

window.Auth = Auth;
