

// 替换 str 中的敏感词为 replaceStr, step 为筛选强度， 最小为 0，最大为 5
exports.runFilterWord = function(str, replaceStr="*", step=1){
    if (str == undefined) {
        return "";
    }
    str = str.replace(/\s/g,"")
    if (step > 5) {
        step = 5;
    }
    else if (step < 0) {
        step = 0;
    }

    for (var j = 0; j < step; j++) {
        var result = this.check(str);
        var len = result.length;

        if (len == 0) {
            break;
        }
        // 排序结果，长度长的在前面
        result.sort(function (a, b) {
            return b.length - a.length});
        for (var i = 0; i < len; i++) {
            str = str.replace(result[i], replaceStr);
        }
    }

    return str;
}


exports.check = function (content) {
    if (exports.mapData == null){
        exports.init()
    }

    var result = [];
    var count = content.length;
    var stack = [];
    var point = this.mapData;
    // 用于标记找到关键词的标记
    var isFound = false;
    var foundStack = null;
    
    for (var i = 0; i < count; ++i) {
        var ch = content.charAt(i);
        var item = point[ch];
        // 如果没找到则复位，让主循环
        if (item == null) {
            if (isFound) {
                isFound = false;
                i = i - (stack.length - foundStack.length + 1); // 计算回退距离
                result.push(foundStack.join("")); // 把单个的字母数组连成一串字符串
            }else {
                i = i - stack.length; // 计算回退距离
            }
            stack = []; // 清空字符堆栈
            point = this.mapData;
        }else if (item["isFinish"]) {
            stack.push(ch);
            point = item;
            // 标记找到了目标词
            isFound = true;
            foundStack = stack.concat(); // 复制数组
        }
        else {
            stack.push(ch);
            point = item;
        }
    }
    // 这里还要补充检查
    if (isFound) {
        result.push(foundStack.join("")); // 把单个的字母数组连成一串字符串
    }
    return result;
}

exports.isCheck = function(content){
    if (content == null){
        return false
    }
    content = content.replace(/\s/g,"")
    var result = exports.check(content)
    if(result.length >0){
        Gm.floating(Ls.get(5819))
    }
    return result.length > 0
},

exports.init = function(){
    exports.mapData = exports.buildMap(Gm.config.getFilterWorld())
}

exports.buildMap = function (wordList) {
    var result = {};
    var count = wordList.length;
    // 遍历单词
    for (var i = 0; i < count; ++i) {
        var map = result;
        var word = wordList[i];
        var wordLength = word.length;
        // 遍历单词的每个字母
        for (var j = 0; j < wordLength; ++j) {
            var ch = word.charAt(j);
            var stateInfo = map[ch];
    
            if (stateInfo == null) {
               stateInfo = {};
               map[ch] = stateInfo;
           }
           // 如果是最后一个字母，设置一个完结标识
           if (j == wordLength - 1) {
               stateInfo["isFinish"] = true;
           }else{
               map = stateInfo;
           }
        }
    }
    return result;
}