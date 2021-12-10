cc.Class({
    properties: {
        mailList:null,// 任务列表
    },
    ctor:function(){
        this.clearData()
    },
    getMisByType:function(){
        return this.mailList
    },
    getMailById:function(destId){
        for (let index = 0; index < this.mailList.length; index++) {
            if (this.mailList[index].emailID == destId){
                return this.mailList[index]
            }
        }
    },
    clearData:function(){
        this.mailList = []
    },
    updateData:function(args){
        // console.log("====:",Func.dateFtt("hh:mm:ss",new Date(args.activeAtyTime1)))
        for(const i in args.emailList){
            this.pushData(args.emailList[i])
        }
    },
    pushData:function(item){
        var tmpIndex = -1
        // if (!this.mailList[item.emailType]){
        //     this.mailList[item.emailType] = []
        // }
        for (let index = 0; index < this.mailList.length; index++) {
            if (this.mailList[index].emailID == item.emailID){
                tmpIndex = index
                break
            }
        }
        // console.log("item.emailState===:",item,tmpIndex)
        if (tmpIndex != -1){
            this.mailList[tmpIndex].emailState = item.emailState
            if (item.emailState == 3){
                this.mailList.splice(tmpIndex,1)
            }
        }else{
            if (item.emailState != 3){
                item.emailState = item.emailState || 0
                this.mailList.push(item)
            }
        }
    },
    onDelRead:function(item){
        if (this.mailList){
            for(const i in item.emailID){
                for (let index = 0; index < this.mailList.length; index++) {
                    if (this.mailList[index].emailID == item.emailID[i]){
                        this.mailList.splice(index,1)
                        break
                    }
                }
            }
        }
    },
});
