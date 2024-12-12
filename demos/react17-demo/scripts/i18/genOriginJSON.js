/**
 * @description 生成用来分析的json
 */


const fs = require("fs")
const path = require("path")

const config = require("./CONFIG.js")
let {srcFolderPath} = config

// 用来判断 src 文件中的i18 并且 生成用于可视化的json
let bigJsonObject = {}

// 定义函数，递归读取文件夹中的所有JSON文件
function readFolder (folderPath) {
	// 读取文件夹内容
	const files = fs.readdirSync(folderPath.path)

	files.forEach(file => {
		const filePath = path.join(folderPath.path, file)
		const stat = fs.statSync(filePath)

		if (stat.isDirectory()) {
			// 如果是文件夹，则递归调用
			readFolder(filePath)
		} else if (path.extname(file) === ".json") {
			// 如果是JSON文件，则读取内容
			try {
				const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"))

				let namespace = path.basename(filePath,".json");
                // origin json
                if(!bigJsonObject[folderPath.name]){
                    bigJsonObject[folderPath.name] = {}
                }
				if(!bigJsonObject[folderPath.name][namespace]){
                    bigJsonObject[folderPath.name][namespace] = {}
				}
				// 合并到大的JSON对象中，可以根据需要自定义合并逻辑
                
				bigJsonObject[folderPath.name][namespace]  = {
                    ...jsonData
                }
			} catch (err) {
				console.error(`Error reading ${file}:`, err)
			}
		}
	})
}


// 调用函数开始处理
for(let i = 0; i < srcFolderPath.length; i++){
    readFolder(srcFolderPath[i])
}

// 输出整合后的大JSON对象
// console.log(JSON.stringify(bigJsonObject, null, 2))
const jsonData = JSON.stringify(bigJsonObject, null, 2);


fs.writeFileSync('i18_origin.json', jsonData);
