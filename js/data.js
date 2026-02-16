/**
 * 数据模块 - Supabase数据库操作
 */

const Data = {
    supabase: null,
    
    // 初始化
    init(supabaseClient) {
        this.supabase = supabaseClient;
    },
    
    // 保存胎动记录到云端
    async saveKickRecord(date, time) {
        if (!this.supabase || !Auth.getUserId()) {
            return { success: false, error: '未登录' };
        }
        
        try {
            const { data, error } = await this.supabase
                .from('kick_records')
                .insert({
                    user_id: Auth.getUserId(),
                    record_date: date,
                    record_time: time,
                    created_at: new Date().toISOString()
                });
            
            if (error) throw error;
            return { success: true };
        } catch (e) {
            console.error('保存记录失败:', e);
            return { success: false, error: e.message };
        }
    },
    
    // 从云端获取胎动记录
    async getKickRecords() {
        if (!this.supabase || !Auth.getUserId()) {
            return { success: false, error: '未登录', data: [] };
        }
        
        try {
            const { data, error } = await this.supabase
                .from('kick_records')
                .select('*')
                .eq('user_id', Auth.getUserId())
                .order('record_date', { ascending: false });
            
            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (e) {
            console.error('获取记录失败:', e);
            return { success: false, error: e.message, data: [] };
        }
    },
    
    // 保存用户设置
    async saveSettings(settings) {
        if (!this.supabase || !Auth.getUserId()) {
            return { success: false, error: '未登录' };
        }
        
        try {
            const { data, error } = await this.supabase
                .from('kick_settings')
                .upsert({
                    user_id: Auth.getUserId(),
                    due_date: settings.dueDate || null,
                    vibrate: settings.vibrate !== false,
                    baby_name: settings.babyName || null,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });
            
            if (error) throw error;
            return { success: true };
        } catch (e) {
            console.error('保存设置失败:', e);
            return { success: false, error: e.message };
        }
    },
    
    // 获取用户设置
    async getSettings() {
        if (!this.supabase || !Auth.getUserId()) {
            return { success: false, error: '未登录', data: null };
        }
        
        try {
            const { data, error } = await this.supabase
                .from('kick_settings')
                .select('*')
                .eq('user_id', Auth.getUserId())
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e.message, data: null };
        }
    },
    
    // 同步数据（下载）
    async syncDown() {
        const records = await this.getKickRecords();
        const settings = await this.getSettings();
        
        return {
            records: records.data,
            settings: settings.data
        };
    }
};

window.Data = Data;
