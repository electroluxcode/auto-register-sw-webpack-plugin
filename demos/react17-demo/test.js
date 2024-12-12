// sw.js 离线缓存的设置，注册service worker
function installSW () {
	if (navigator.serviceWorker != null) {
		navigator.serviceWorker.register("./sw.js")
			.then(function (registration) {
				console.log("Registered events at scope: ", registration.scope)
			})
	}

	// 授权
	Notification.requestPermission().then(function (result) {
		if (result === "granted") {
			console.log("已经授权")
		}
	})

	window.deferredPrompt = null

	// 监听beforeinstallprompt事件，该事件在网站满足PWA安装条件时触发，保存安装事件
	window.addEventListener("beforeinstallprompt", e => {
		console.log("满足触发条件", e)
		e.preventDefault()
		window.deferredPrompt = e
	})

	// 监听appinstalled事件，该事件在用户同意安装后触发，清空安装事件
	window.addEventListener("appinstalled", () => {
		window.deferredPrompt = null
	})
	console.log("Service Worker 注册成功")
}

// // 手动触发PWA安装
// function addToDesktop() {
//   window.deferredPrompt.prompt();
// }

function uninstallSW () {
	// 卸载逻辑
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.ready.then(registration => {
			registration.unregister()
		})
		console.log("Service Worker 已卸载")
	}
}
