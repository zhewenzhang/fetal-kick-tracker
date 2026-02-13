-- 胎动记录器 Supabase 表结构
-- 可在 Supabase SQL 编辑器中执行

-- 胎动记录表
CREATE TABLE IF NOT EXISTS kick_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    record_date DATE NOT NULL,
    record_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_kick_records_user_id ON kick_records(user_id);
CREATE INDEX IF NOT EXISTS idx_kick_records_date ON kick_records(record_date);
CREATE INDEX IF NOT EXISTS idx_kick_records_created ON kick_records(created_at);

-- 孕期设置表
CREATE TABLE IF NOT EXISTS kick_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    due_date DATE,
    vibrate BOOLEAN DEFAULT true,
    baby_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_kick_settings_user ON kick_settings(user_id);

-- 开启 RLS（行级安全）
ALTER TABLE kick_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE kick_settings ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能访问自己的数据
CREATE POLICY "用户可以查看自己的胎动记录" ON kick_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的胎动记录" ON kick_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的胎动记录" ON kick_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的胎动记录" ON kick_records
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "用户可以查看自己的设置" ON kick_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的设置" ON kick_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的设置" ON kick_settings
    FOR UPDATE USING (auth.uid() = user_id);
