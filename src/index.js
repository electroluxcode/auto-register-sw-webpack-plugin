const templateInjectjs = ({
    swSrc= "./sw.js", registerFn=()=>{},
})=>{
    return `
<script>
// 注册service worker
function installSW () {
	if (navigator.serviceWorker != null) {
            navigator.serviceWorker.register("${swSrc}")
                .then(function (registration) {
                    console.log("Registered events at scope: ", registration.scope)
                    document.dispatchEvent(new CustomEvent("swSuccess", {
                        isRegistered: true
                    }))
                }).catch(()=>{
                    document.dispatchEvent(new CustomEvent("swError", {
                        isRegistered: false
                    }))
                })
    }
	Notification.requestPermission().then(function (result) {
		if (result === "granted") {
			console.log("allowed")
		}
	})
	window.deferredPrompt = null
	window.addEventListener("beforeinstallprompt", e => {
		e.preventDefault()
		window.deferredPrompt = e
	})
	window.addEventListener("appinstalled", () => {
            window.deferredPrompt = null
    })
}

// 卸载逻辑
function uninstallSW () {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.ready.then(registration => {
			registration.unregister()
            
            document.dispatchEvent(new CustomEvent("swSuccess", {
                isRegistered: false
            }))
		}).catch(()=>{
            document.dispatchEvent(new CustomEvent("swError", {
                isRegistered: true
            }))    
        })
	}
}
(${registerFn}).call(this,installSW,uninstallSW)
</script>
`
}

class AutoRegisterSwWebpackPlugin {
    /**
     * @param {*} swSrc  service worker 文件路径
     * @param {*} registerFn 注册函数
     * @param {*} injectFilename 注入文件 默认是index.html
     */
    constructor(params) {
        this.params = params
        this.params.injectFilename = params.injectFilename || "index.html"
    }
    apply(compiler) {
        let that = this
        compiler.hooks.emit.tapAsync("emit", (compilation,callback) => {
            for (const name in compilation.assets) {
                let source = compilation.assets[name].source()
                if (name === that.params.injectFilename) {
                    source = source + templateInjectjs(this.params)
                    compilation.assets[name] = {
                        source: function () {
                            return source;
                        },
                        size: function () {
                            return source.length;
                        }
                    }
                }
            }
            callback()
        });
        
    }
}
module.exports = AutoRegisterSwWebpackPlugin;
