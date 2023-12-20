# 使用 Node.js 官方提供的 Node 镜像作为基础镜像
FROM node:18


# 安装需要的工具包
#RUN apt-get update && \
#    apt-get install -y procps net-tools


# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到容器中
COPY package*.json ./

# 安装项目依赖
RUN npm install  --silent --no-cache

# 将整个项目目录复制到容器中
COPY . .

# 暴露应用程序运行的端口（如果需要）
EXPOSE 4000

# 运行应用程序
CMD [ "npm", "run" ,"start" ]

