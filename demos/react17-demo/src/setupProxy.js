// src/setupProxy.js

const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function App (app) {
	app.use(
		"^/api",
		createProxyMiddleware({
			target: process.env.TEAMSHARE_SERVICE_URL,
			changeOrigin: true, // needed for virtual hosted sites
			ws: false, // 代理websocket
			logLevel: "debug",
			pathRewrite: {
				"^/api": "" // 重写路径
			},
			onError (error) {
				console.log("-- 代理资源错误 Error --", error)
			}
		})
	)
}
