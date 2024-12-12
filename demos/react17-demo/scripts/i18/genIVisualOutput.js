const fs = require('fs');
const path = require('path');

const config = require("./CONFIG.js")
let {srcFolderPath} = config
// step1:后缀
let suffix = [".js", ".jsx"]
// 遍历src文件夹下的所有文件
const srcFolder = '../../src';

// 读取目标JSON文件
const targetJsonFile = 'i18_origin.json';
const targetJson = JSON.parse(fs.readFileSync(targetJsonFile, 'utf8'));


const results = [];

// 递归遍历文件夹
function traverseFolder(folder) {
    const files = fs.readdirSync(folder);
    files.forEach(file => {
        const filePath = path.join(folder, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            traverseFolder(filePath);
        } else if (stats.isFile() && suffix.includes(path.extname(filePath))) {
            
            for(let srcPath of srcFolderPath){
                // 遍历i18 文件夹，赋值
                processFile(filePath,srcPath.name);
            }
        }
    });
}

// 处理单个文件
function processFile(file,i18name) {
    const content = fs.readFileSync(file, 'utf8');
    const regex = /i18n\.t\("([^"]+)"\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const i18nKey = match[1];
        // 检查该键是否存在于目标JSON中
        let {isExist, isObject, namespace} = checkIfKeyExists(targetJson, i18nKey,i18name);
        results.push({
            i18name: i18name,
            file: file,
            key: i18nKey,
            isExist: isExist,
            isObject: isObject,
            namespace
        });
    }

    const regex2 =  /[^a-zA-Z]t\("([^"]+)"\)/g;
    let match2;
    while ((match2 = regex2.exec(content)) !== null) {
        const i18nKey = match2[1];
        // 检查该键是否存在于目标JSON中
        let {isExist, isObject,namespace} = checkIfKeyExists(targetJson, i18nKey,i18name);
        results.push({
            i18name: i18name,
            file: file,
            key: i18nKey,
            isExist: isExist,
            isObject: isObject
        });
    }
}

let defaultNameSpace = "other"
// 检查键是否存在于JSON中的函数
function checkIfKeyExists(json, key,i18name ) {
    const keys = key.split('.');
    let current = json;
    
    current = current[i18name]
    let namespaces = Object.keys(current)
    let cache 
    for(let j = 0;j<namespaces.length;j++){

        let namespace = namespaces[j]

        // 命名空间下的数据遍历
        let newData = current[namespace]
        for (let i = 0; i < keys.length; i++) {
            if(i>1){
                cache = namespace
            }
          
            if(!newData){
                continue
            }
            newData = newData[keys[i]];
              // 不能直接return
              if(typeof newData == "string" || typeof newData == "number" ){
                return {
                    isExist: true,
                    namespace: namespace ?? defaultNameSpace
                };
            }
        }
    }
    return {
        isExist: false,
        namespace:cache ?? defaultNameSpace
    };
}

// 开始遍历
traverseFolder(srcFolder);

// 打印结果

let data = results

// 使用一个对象来按文件名进行分组
const groupedData = data.reduce((acc, { file, key, isExist, isObject,i18name,namespace }) => {
    if (!acc[file]) {
        acc[file] = [];
    }
    acc[file].push({ key, isExist, isObject,i18name, namespace });
    return acc;
}, {});

// 合并同一文件中的条目，并记录 isExist 为 false 的数据
const mergedData = Object.entries(groupedData).map(([file, entries]) => {
    const mergedEntry = entries.reduce((acc, { key, isExist, isObject,i18name,namespace }) => {
        acc[file] = acc[file] || [];
        acc[file].push({ key, isExist, isObject,i18name,namespace });
        return acc;
    }, {});

    const falseExistEntries = entries.filter(entry => !entry.isExist);

    return {
        file,
        mergedEntries: mergedEntry[file],
        falseExistEntries,
        isLostI18: (!!falseExistEntries.length),
        
    };
});

let filterArr = mergedData.filter((e) => {
    return e.isLostI18
})
// 将处理后的数据转换为JSON格式
const jsonData = JSON.stringify(filterArr, null, 2);


// 将JSON数据写入文件
fs.writeFileSync('i18_output.json', jsonData);



console.log("")
console.log("🎉🎉🎉:在 scripts//i18 文件夹下 已生成 i18_output.json 文件和 可视化数据 visual.html 请前往查看")
console.log("")


if(filterArr.length){
    // console.log(jsonData)
    throw new Error("似乎有丢失的i18n字段，请检查。进程已退出")
}