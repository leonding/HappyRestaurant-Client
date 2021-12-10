cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel:cc.Label
    },
    setData:function(data,owner){
        this.data = data
        this.owner = owner
        this.nameLabel.string = data.name
        this.setStatus(data.status)
    },
    onClick:function(){
        this.owner.onItemClick(this.data)
    },
    setStatus(status){

    },
    setRoleName(name){
        console.log("玩家创建的角色名=====",name)
        this.m_roleName = name
    },

    updteCreatedUI(){

    },

    getServerId(){
        if(this.data){
            return this.data.id
        }else{
            return undefined
        }
    }

});
