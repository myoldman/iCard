/**
 * 配置及公有属性
 **/
var realWindowWidth = 0;
var realWindowHeight = 0;
var ratio = 0;
wx.getSystemInfo({
  success: function (res) {
    realWindowWidth = res.windowWidth
    realWindowHeight = res.windowHeight
    ratio = res.ratio
  }
})
function Trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
/**
 * 主函数入口区
 **/
function mdParse(bindName, data, target, bgColor, bg, bgImg) {
  var that = target;
  //存放转化后的数据
  var transData = genCardData(data)
  transData.bg = bg
  transData.bgColor = bgColor
  transData.bgImg = bgImg
  var bindData = {};
  console.log(transData)
  bindData[bindName] = transData;
  that.setData(bindData)
}

function genCardData(content) {
  var transData = {items:[]}
  content = content.replace(/\r\n/g, "\n")
  var contents = content.split("\n")
  // 前一个段落是否引用
  var lastQuote = false
  for (var i = 0; i < contents.length; i++) {
    var item = {blocks:[]}
    var line = contents[i]
    var origLine = line
    var itemType = 'normal'
    var itemClass = 'mdNormal'
    var regTitle = /^#+/
    var regResult = regTitle.exec(line)
    // 段落为标题
    if (regResult) {
      itemType = 'title'
      itemClass = 'mdTitle'
      line = Trim(line.substring(regResult[0].length))
    }
    
    if (line.length > 0 && line[0] == '-') {
      // 段落为列表
      line = line.replace("-", ""); 
      line = Trim(line)
      itemType = 'list'
      itemClass = 'mdList'
    } else if (line.length > 0 && line[0] == '>') {
      // 段落为引用
      line = line.replace(">", "");
      line = Trim(line)
      itemType = 'quote'
      itemClass = 'mdQuote'
      if (lastQuote) {
        item.showImage = false
      } else {
        itemClass += ' mdQuoteBegin'
        item.showImage = true
      }
      lastQuote = true
    } else {
      if(lastQuote) {
        transData.items[transData.items.length - 1].itemClass += ' mdQuoteEnd'
      }
      lastQuote = false
    }

    var regBold = /(([\*]{2})(.+?)([\*]{2}))/g
    var boldMatch = line.match(regBold)
    var boldArr = []
    if (boldMatch) {
      for (var k = 0; k < boldMatch.length; k++) {
        var strMatch = boldMatch[k]
        var matchIndex = line.indexOf(strMatch)
        boldArr.push({ start: matchIndex - 4 * k, end: matchIndex + strMatch.length - 4 - 4 * k - 1 })
      }
      var lastMatch
      var classStr = "mdOrange"
      for (var j = 0; j < boldMatch.length; j++) {
        var strMatch = boldMatch[j]
  
        if(j == 0 ){
          var block = line.substring(0, line.indexOf(strMatch))
          item.blocks.push({content:block, classStr : ''})
        } else {
          var block = line.substring(line.indexOf(lastMatch) + lastMatch.length, line.indexOf(strMatch))
          item.blocks.push({ content: block, classStr: '' })
        }
        item.blocks.push({ content: strMatch.substring(2, strMatch.length - 2), classStr : classStr })
        //line = line.replace(strMatch, appendTag + strMatch.substring(2, strMatch.length - 2) + "</text>");
        lastMatch = strMatch
      }
      var lastblock = line.substring(line.indexOf(lastMatch) + lastMatch.length, line.length)
      if (lastblock.length > 0 ){
        item.blocks.push({ content: lastblock, classStr: '' })
      }
    } else {
      if (line.length == 0) {
        itemClass += " mdEmpty"
      }
      
      item.blocks.push({content: line, classStr:''})
    }
    item.type = itemType
    item.itemClass = itemClass
    console.log(item.blocks)
    transData.items.push(item)
  }
  return transData
}

module.exports = {
  mdParse: mdParse
}

