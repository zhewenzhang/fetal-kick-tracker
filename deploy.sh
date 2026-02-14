#!/bin/bash

# 胎动记录器 - GitHub部署脚本

echo "🚀 开始部署到 GitHub..."

# 检查是否已初始化 git
if [ ! -d .git ]; then
    echo "📁 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit: 胎动记录器 v1.0"
fi

# 检查远程仓库
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 请先在 GitHub 创建仓库，然后运行："
    echo "   git remote add origin https://github.com/你的用户名/fetal-kick-tracker.git"
    echo "   git push -u origin main"
    exit 1
fi

# 提交更改
echo "📝 提交更改..."
git add .
git commit -m "Update: $(date '+%Y-%m-%d %H:%M')"

# 推送到 GitHub
echo "⬆️ 推送到 GitHub..."
git push origin main

echo ""
echo "✅ 部署完成！"
echo ""
echo "📱 访问地址：https://你的用户名.github.io/fetal-kick-tracker/"
echo ""
echo "💡 提示：推送到 main 分支后，GitHub Pages 会自动启用（可能需要1-2分钟）"
