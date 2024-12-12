## auto-register-sw-webpack-plugin

a plugin is provided to automatically register service workers and customize the logic for loading and unloading service workers.

由于主流的service worker的plugin并没有提供自动注册的 插件选项。


- workbox: https://github.com/GoogleChrome/workbox/issues/3383
- sw-precache-webpack-plugin: https://github.com/goldhand/sw-precache-webpack-plugin/issues/65


因此提供一个插件用来自动注册service worker，

和自定义加载卸载service worker的逻辑



## usage

usage: 

```javascript
// npm install AutoRegisterSwWebpackPlugin

// webpack.config.js
const AutoRegisterSwWebpackPlugin = require("AutoRegisterSwWebpackPlugin/src")
new AutoRegisterSwWebpackPlugin({
    swSrc: "./sw.js",
    registerFn: (installSW, uninstallSW)=>{
        console.log("auto")
        installSW()
    },
    injectFilename: "index.html"
})


```



## api

|      参数      |                             作用                             |
| :------------: | :----------------------------------------------------------: |
|     swSrc      |           指示sw文件的路径，用来在入口文件进行注册           |
|   registerFn   | 用来自定义激活sw逻辑，第一个参数是激活sw函数，第二个函数是卸载sw函数，运行函数后会发送swSuccess和swError 事件，可以通过window.addeventlistener监听 |
| injectFilename |                        注入的入口文件                        |





## demo

可以运行项目中的demo查看效果

```shell
cd demos/react17-demo
npm install auto-register-sw-webpack-plugin
npm run build

# 然后 live server 打开打包后的 index.html

```