cc.Class({
    extends: cc.Component,
    properties: {
        defaultStr:"",//to_x_0_y_0|
        actionList:{//json
            default: [],
            type: cc.String,
        },
    },
    starAction(callback){
        this.node.stopAllActions()
        var defList = this.defaultStr.split("|")
        if (defList.length>0){
            for (let j = 0; j < defList.length; j++) {
                const v1 = defList[j].split("_");
                for (let k = 1; k < v1.length; k++) {
                    var key = v1[k]
                    var value = checkint(v1[k+1])
                    if (v1[0] == "to"){
                        this.node[key] = value
                    }else if (v1[0] == "by"){
                        this.node[key] = this.node[key] + value
                    }
                    k++
                }
            }
        }

        if(this.actionList.length >0){
            for (let i = 0; i < this.actionList.length; i++) {
                var v = JSON.parse(this.actionList[i])
                var acList = new Array()
                for (let k = 0; k < v.action.length; k++) {
                    const v1 = v.action[k];
                    var ac
                    if (v1.hasOwnProperty("arg2")){
                        ac = cc[v1.acName](v1.time,checkint(v1.arg1),checkint(v1.arg2))
                    }else if (v1.hasOwnProperty("arg1")){
                        ac = cc[v1.acName](v1.time,checkint(v1.arg1))
                    }else{
                        ac = cc[v1.acName](v1.time)
                    }
                    if (v1.easing){
                        ac.easing(cc[v1.easing]())
                    }
                    acList.push(ac)
                }
                if (callback && i == this.actionList.length -1){
                    var callFunc = cc.callFunc(()=>{
                        callback()
                    })
                    acList.push(callFunc)
                }

                if (acList.length == 1){
                    this.node.runAction(acList[0])
                }else{
                    var acs = cc[v.type](acList)
                    this.node.runAction(acs)
                }
            }
        }else{
            if (callback){
                callback()
            }
        }
        
    },
});
