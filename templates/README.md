# rubick-plugin-demo

## 项目开发
### 1. 安装依赖
```
yarn install
yarn serve
```

### 2. DevServer
如果需要在 dev 环境进行热更新调试，则需要修改一下 `public/package.json` 添加一下 `development` 字段：

```json
"development": "http://localhost:4001"
```

### 3. 调试
启动成功后，如果需要调试插件，则需要先在控制台执行：

```shell
npm run build
cd dist
npm link
```
然后到
`rubick插件市场 => 开发者` 填写插件名称进行安装

![](https://pic1.zhimg.com/80/v2-cff07e792cd900bf3d8d5ecd3b8038d8_720w.png)

安装成功后即可通过 `package.json` 中的命令唤起界面进行调试啦！

## 发布插件
### 1. 编译构建
首先需要编译插件
```shell
npm run build
```

### 2. 发布插件到 npm 仓库

```shell
cd dist
npm publish
```

### 3. 给 gitcode 提交插件 PR 信息

[gitcode 地址： https://gitcode.net/rubickcenter/rubick-database](https://gitcode.net/rubickcenter/rubick-database/-/blob/master/plugins/total-plugins.json)

### 4. 等着插件被合入就可自动上架啦！