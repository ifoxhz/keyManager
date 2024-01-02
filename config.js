const fs = require('fs');
let Config = {}
// 读取 JSON 文件内容


function ParseConfig(){
    try {
        const data = fs.readFileSync('config.json', 'utf8')
        // 解析 JSON 数据
        const jsonData = JSON.parse(data);
        console.log("jsonData",typeof jsonData )
        Config = jsonData
        // 分析 JSON 数据
        analyzeData();
      } catch (error) {
        console.error('Failed to parse JSON data:', error);
      }
}

// 分析 JSON 数据的函数
function analyzeData() {
  // 在这里对读取到的 JSON 数据进行分析和处理
  console.log("kpsserver config is",Config);
}


ParseConfig()

module.exports = {
    Config
}

