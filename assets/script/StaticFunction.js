// 静态方法 exports
//检测数字，转换不了设为0
window.checkint = function(value){
    value = Number(value)
    return isNaN(value)?0:value
}
//字符串第一位大写
window.uFirst = function(str){
    return str.substring(0,1).toUpperCase() + str.substring(1)
}
//字符串第一位小写
window.lFirst = function(str){
    return str.substring(0,1).toLowerCase() + str.substring(1)
}
window.parseFloat1 = function(value){
    var result = parseFloat(value)
    var xsd=result.toString().split(".");
    if(xsd.length>1){
        if(xsd[1].length>1){
            result = xsd[0] + "." + xsd[1].substring(0,1);
        }
    }
    return result
}
//字符串格式
String.prototype.format = function(args)
{
    if (arguments.length > 0)
    {
        var result = this;
        if (arguments.length == 1 && typeof (args) == "object")
        {
            for (var key in args)
            {
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        }
        else
        {
            for (var i = 0; i < arguments.length; i++)
            {
                if (arguments[i] == undefined)
                {
                    return "";
                }
                else
                {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    }
    else
    {
        return this;
    }
}
//比较版本号
window.compareVersion = function(v1,v2){
    v1 = v1.split(".")
    v2 = v2.split(".")
    var len = Math.max(v1.length,v2.length)
    for (let index = 0; index < len; index++) {
        if(checkint(v1[index]) > checkint(v2[index])){
            return true
        }else if (checkint(v1[index]) < checkint(v2[index])){
            return false
        }
    }
    return false
}
window.tableNums = function(list){
    if (list){
        var num = 0
        for (const key in list) {
            if (list[key]){
                num = num + 1
            }
        }
        return num
    }
    return 0
}

