// import "./public-path"
// import "core-js/full"

import React from "react"
import ReactDOM from "react-dom"
import App from "./pages/App"


function bootstrap () {
	ReactDOM.render(
		<React.StrictMode>
				<App/>
		</React.StrictMode>,
		document.getElementById("root")
	)
}

bootstrap()

if (!window.__POWERED_BY_QIANKUN__) {
	ReactDOM.render(
		<React.StrictMode>
			<App/>
		</React.StrictMode>,
		document.getElementById("root")
	)
}

