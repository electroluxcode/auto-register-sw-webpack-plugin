/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-restricted-globals
const that = self

async function JobHandler (callback, params, workerId) {
	try {
		// const result = await callback.run()
		const result = Promise.resolve(eval(callback).apply(null, params))
		let count = 0
		for (let i = 0, len = 1000000000; i < len; i++) {
			count += i * 2
		}
		that.postMessage({
			type: "Response",
			message: "success",
			workerId,
			data: count
		})
	} catch (error) {
		that.postMessage({
			type: "Error",
			workerId,
			message: error
		})
	}
}

function EventReducer (action) {
	console.log("worker event", action)
	const { type, data, params, workerId, message } = action
	switch (type) {
		case "Count":
			return JobHandler(data, params, workerId)
		default:
			return null
	}
}

that.addEventListener("message", function message (event) {
	console.log("-worker收到了message-", event.data)
	EventReducer(event.data).catch(error => {
		that.postMessage({
			message: "error!!",
			data: error
		})
	})
	// that.close()
}, false)

that.addEventListener("error", function error (event) {

}, false)

// onmessage = function onmessage (event) {
// 	console.log("-worker收到了message2-", event)
// 	postMessage({ code: "initws", msg: "正在连接websocket" })
// }
