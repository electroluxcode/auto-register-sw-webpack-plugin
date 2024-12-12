
let srcPathObj = {
    "en":"../../src/i18n/locales/enUS/data",
    "fil":"../../src/i18n/locales/filPH/data",
    "fra":"../../src/i18n/locales/frFR/data",
    "id":"../../src/i18n/locales/idID/data",
    "jp":"../../src/i18n/locales/jaJP/data",
    "may":"../../src/i18n/locales/msMY/data",
    "th":"../../src/i18n/locales/thTH/data",
    "vie":"../../src/i18n/locales/viVN/data",
    "zh":"../../src/i18n/locales/zhCN/data",
}
let srcFolderPath = []
let selectLangs = process.env.TRANSLATE_LANGS ? process.env.TRANSLATE_LANGS.join(",") : 'all'

let selectLanguage = (selectLangs)=>{
    if(selectLangs === 'all'){
        for(let key in srcPathObj){
            srcFolderPath.push({
                path:srcPathObj[key],
                name:key
            })
        }
    }else{
        for(let key in selectLangs){
            if(srcPathObj[key]){
                srcFolderPath.push({
                    path:srcPathObj[key],
                    name:key
                })
            }
        }
    }
}
selectLanguage(selectLangs)

// console.log(srcFolderPath)
module.exports = {
    // 配置 百度翻译的api
    appConfig : {
        appId: process.env.TRANSLATE_APPID ??'',
        key: process.env.TRANSLATE_KEY ?? '',
    },
    srcFolderPath,
    srcPathObj,
}