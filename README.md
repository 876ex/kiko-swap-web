# 开始

- 安装依赖 yarn
- 本地 yarn serve(dev) 或 yarn serve stage(测试)

# 打包

- bulid-stage 测试环境
- build 生产环境

# 注意

.env 文件修改一定要慎重

- .env 所有环境公用变量
- .env.development 本地开发环境变量
- .env.production 生产环境打包（一定要慎重修改！！！）
- .env-stagedev 本地开发使用， 测试环境数据
- .env-stageprod 测试环境使用，生产数据和生产环境变量打包
