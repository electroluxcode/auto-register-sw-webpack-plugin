// 用来请求 翻译接口自动生成i18文件
// refer: https://api.fanyi.baidu.com/

const fs = require("fs")
const md5 = require("md5");
const https = require("https");
const queryString  = require ("querystring")

const config = require("./CONFIG.js")
let {appConfig} = config
  
let bigJSON = {
}

// 影响翻译的准确性
let KEYWORD = "_"
const translate = ({from = 'en',word,to = "zh"}) => {
    word = word.replace(KEYWORD," ")
    return new Promise((resolve)=>{
      
        if(from == to){
            resolve(word)
        }
        const salt = Math.random();
        const sign = md5(appConfig.appId + word + salt + appConfig.key);
    
        const query = queryString.stringify({
          q: word,
          appid: appConfig.appId,
          from, to, salt, sign
        });
      
        const options = {
          hostname: 'fanyi-api.baidu.com',
          port: 443,
          path: '/api/trans/vip/translate?' + query,
          method: 'GET'
        };
      
        const request = https.request(options, (response) => {
          let chunks = [];
          response.on('data', (chunk) => {
            chunks.push(chunk);
          });
          response.on('end', () => {
            const string = Buffer.concat(chunks).toString();
            const object = JSON.parse(string);
            if (object.error_code) {
            //   console.error(errorMap[object.error_code] || object.error_msg);
              console.log(`编译错误 from ${from} to ${to}:`,word, object.error_msg);
              resolve(`编译错误 from ${from} to ${to}: ${word}-${object.error_msg}`)
            } else {
              object.trans_result.map(obj => {
                console.log(`编译中 from ${from} to ${to}:`,obj.dst);
                resolve(obj.dst)
              });
            }
          });
        });
      
        request.on('error', (e) => {
          console.error(e);
        });
        request.end();
    })
   
};


// 判断重复的数组
let judgeDup ={ }

let filePath =  "./i18_output.json" 
let jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"))


/**
 * @description 根据obj 和属性设置值
 * @param {*} obj 
 * @param {*} path 
 * @param {*} value 
 * @returns 
 */
function set(obj, path, value) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }
  
    if (!Array.isArray(path)) {
      path = path.toString().split('.');
    }
  
    const lastIndex = path.length - 1;
    path.reduce((acc, key, index) => {
      if (index === lastIndex) {
        acc[key] = value;
      } else if (!acc[key] || typeof acc[key] !== 'object') {
        acc[key] = {};
      }
      return acc[key];
    }, obj);
  
    return obj;
}
let sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

async function tran({
    falseExistEntries
}){
    for(let j = 0 ; j < falseExistEntries.length; j++){
        let item = falseExistEntries[j]
        let shouldTranText = ""
        let dotArray = item.key.split(".")

        if(!bigJSON[item.i18name]){
          bigJSON[item.i18name] = {}
        }
        if(!bigJSON[item.i18name][item.namespace]){
          bigJSON[item.i18name][item.namespace] = {}
        }
        
        // 重复的 key不需要被判断
        if(judgeDup[`${item.i18name}_${item.key}`] ){
            set(bigJSON[item.i18name][item.namespace],dotArray,judgeDup[`${item.i18name}_${item.key}`])
            continue
        }
        shouldTranText = dotArray.at(-1)
        // 执行请求
        if(item.i18name == "en"){
            set(bigJSON[item.i18name][item.namespace],dotArray,shouldTranText)
            continue
        }
        let tranAfterText = await translate({
            word:shouldTranText ?? "",
            from:"en",
            to:item.i18name
        })
        await sleep(1500)
        // 分key保存到bigJSON中
        set(bigJSON[item.i18name][item.namespace],dotArray,tranAfterText)
        judgeDup[`${item.i18name}_${item.key}`] = tranAfterText
    }
    return new Promise((resolve) => {
        resolve()
    })
}
async function main(){
    jsonData = jsonData.filter(item => item.isLostI18)
    for(let i = 0 ; i < jsonData.length; i++){
        if(!jsonData[i].isLostI18){
            continue
        }
        // console.log(jsonData[i])
        // 获取需要被翻译的数组
        let falseExistEntries = jsonData[i].falseExistEntries
        await tran({
            falseExistEntries
        })
        
    
        
    }
    // 将处理后的数据转换为JSON格式
    const jsonDataResult = JSON.stringify(bigJSON, null, 2);

    // 将JSON数据写入文件
    fs.writeFileSync('i18_api.json', jsonDataResult);
}

main()