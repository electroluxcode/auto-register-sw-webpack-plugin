# 旧文档抽离

getDocsAppMeta

## 数据交互

- 组织码: 从localstorage中获取(`src\utils\auth.js`)
- authorization: 从localstorage中截取 (`src\utils\auth.js`)
- 文档id: 从路径中获取  (`src\pages\Docs\index.js`) 

基座只负责传递这些数据。文档协同用 amao 内部的 `initRemote`, 文件服务用 keewood那一套 



## 受控组件

- 路由： `根路由`
- 如果需要作为一个受控组件引入，参考 `src\pages\Docs\comp.js` 中把   defaultvalue替换成自己的dom 结构即可



## ot 

- 路由: `/docId`
- 参考 `src\pages\Docs\index.js`















