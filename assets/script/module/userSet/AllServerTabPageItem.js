
cc.Class({
    extends: cc.Component,

    properties: {
        serverName:cc.Label,
        headNode:cc.Node,
        newIcon:cc.Sprite,
        roleName:cc.Label,
        m_oLevel:cc.Label,
    },

    setData (data){
        if(data.rolehead){
            Func.newHead2(data.rolehead,this.headNode,data.rolehead,1)
            // this.headNode.itemBase.loadBottomFrame("share_img_k1")
            // this.headNode.itemBase.setLabStr("")
        }else{
            this.headNode.active = false
        }
        if(data.new){
            this.newIcon.node.active = true
        }
        this.serverName.string = data.servername || data.name
        if(data.rolename){
            // this.roleName.string = data.rolename
        }
        if(data.level){
            this.m_oLevel.string = "Lv."+data.level
        }
        this.username = data.username || ""
        this.sId = data.sId || data.id
        this.url = data.url || data.value
    },
    onSwitchClick(){
        if(Gm.loginData.serverNowId == this.sId){
            Gm.floating(Ls.get(5815))
        }else{
            var tips = {}
            tips.title = Ls.get(500048)
            tips.msg = cc.js.formatStr(Ls.get(1000065), this.serverName.string)//"切换到服务器："+this.serverName.string+"，此操作生效需要更新加载游戏，是/否？"
            Gm.box(tips,(btnType)=>{
                if(btnType == 1){
                    var serverData = {}
                    serverData.id = this.sId
                    serverData.value = this.url
                    Gm.getLogic("LoginLogic").setChangeServerData(serverData)
                }
            })
        }
    },
});
