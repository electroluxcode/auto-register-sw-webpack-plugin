// 将 api 生成的 json 合并到 各个文件目录的 translate.json 中里面
const fs = require("fs")
const path = require("path")
const _ = require("lodash")
const config = require("./CONFIG.js")
let {srcPathObj} = config


// 生成的合并策略
let select = true
let strategy = {
    merge:!select,
    split:select
}


let filePath =  "./i18_api.json" 

// addition 策略写入的json
let jsonName = "translateData.json"


let jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"))

// 获取api 下面的
let jsoni18Keys = Object.keys(jsonData)
for(let i = 0; i < jsoni18Keys.length; i++) {
    let i18Key = jsoni18Keys[i]

    // i18 数据 
    let data = jsonData[i18Key]
    let namespacePathParent = srcPathObj[i18Key]
    let namespaces = Object.keys(data)

    if(strategy.merge){
        // 判断在 哪一个数组里面
        for(let j = 0; j < namespaces.length; j++) {
            let namespace = namespaces[j] + ".json"
            // 写入的文件路径
            let filePath = path.resolve(namespacePathParent,namespace)
            if(!fs.existsSync(filePath)){
                fs.writeFileSync(filePath, JSON.stringify({}, null, 2), 'utf8');
            }
            let jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"))
            let newTranslateData = _.merge(jsonData, data[namespaces[j]])
            fs.writeFileSync(filePath, JSON.stringify(newTranslateData, null, 2));
            console.log(filePath)
        }
    }
    
    if(strategy.split){
        let transJson = {
        }
        for(let z in data){
            transJson = _.merge(transJson, data[z])
        }
        let filePath = path.resolve(namespacePathParent,jsonName)
        if(!fs.existsSync(filePath)){
            fs.writeFileSync(filePath, JSON.stringify({}, null, 2), 'utf8');
        }
        let jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"))
        let newTranslateData = _.merge(jsonData, transJson)
        fs.writeFileSync(filePath, JSON.stringify(newTranslateData, null, 2));
        console.log(filePath)
    }
}
console.log("已全部合并/分离对应 文件")