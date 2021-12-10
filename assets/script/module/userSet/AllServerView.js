cc.Class({
    extends: cc.Component,

    properties: {
        m_oTabScrollView:{
            default:null,
            type:cc.ScrollView
        },
        m_oTabItemPrefab:cc.Prefab,
        m_oTabPageScrollView:{
            default:null,
            type:cc.ScrollView
        },
        m_oTabPageItemPrefab:cc.Prefab
    },
    onDisable(){
        this.data = null
        this.serverConf = null
        this.tabItemDatas = null
        this.selectTabIdx = 0
        for(let index = this.m_oTabScrollView.content.children.length-1; index >= 0; index--){
            const node = this.m_oTabScrollView.content.children[index]
            node.parent = null
        }
    },
    updateTabList:function(data,conf,owner){
        var self = this
        this.owner = owner
        this.data = data
        this.serverConf = conf
        this.tabItemDatas = []
        var tmpItems = []//5个为一组
        this.listTabBtns = []
        var username = Gm.loginData.getDeviceId()
        for(var key in conf){
            if(data.history[conf[key].id] && data.history[conf[key].id][username]){
                conf[key].sId = data.history[conf[key].id][username].sId
                conf[key].rolehead = data.history[conf[key].id][username].rolehead
                conf[key].rolename = data.history[conf[key].id][username].rolename
                conf[key].level = data.history[conf[key].id][username].level
            }
            if(key == conf.length - 1){
                conf[key].new = true
            }
            tmpItems.push(conf[key])
            
            if(tmpItems.length == 5 || (key == conf.length-1 && tmpItems.length < 5)){
                tmpItems.sort(function sortId(a,b){
                    return b.id - a.id
                })
                this.tabItemDatas.push(tmpItems)
                tmpItems = []
            }
            // if(key == conf.length-1 && tmpItems.length < 5){
            //     tmpItems.sort(function sortId(a,b){
            //         return b.id - a.id
            //     })
            //     this.tabItemDatas.push(tmpItems)
            // }
        }
        // this.owner.removeAllPoolItem(this.m_oTabScrollView.content)
        for(let index = this.m_oTabScrollView.content.children.length-1; index >= 0; index--){
            const node = this.m_oTabScrollView.content.children[index]
            node.parent = null
        }
        this.m_oTabScrollView.stopAutoScroll()

        Gm.ui.simpleScroll(this.m_oTabScrollView,this.tabItemDatas,function(itemData,tmpIdx){
            var item = this.getBasePoolItem()
            item.active = true
            this.m_oTabScrollView.content.addChild(item)
            var itemSp = item.getComponent("AllServerTabItem")
            itemSp.setData(tmpIdx, itemData, this)
            this.listTabBtns.push(itemSp)
            if(tmpIdx == 1){
               this.select(tmpIdx)
            }
            return item
        }.bind(this))
        
        this.m_oTabScrollView.scrollToTop()
    },
    updatePageList:function(data){
        var self = this
        for(let index = this.m_oTabPageScrollView.content.children.length-1; index >= 0; index--){
            const node = this.m_oTabPageScrollView.content.children[index]
            node.parent = null
        }
        this.m_oTabPageScrollView.stopAutoScroll()
        
        Gm.ui.simpleScroll(this.m_oTabPageScrollView,data,function(itemData,tmpIdx){
            var item = this.getTabPageItem()
            item.active = true
            this.m_oTabPageScrollView.content.addChild(item)
            var itemSp = item.getComponent("AllServerTabPageItem")
            itemSp.setData(itemData)
            return item
        }.bind(this))
        this.m_oTabPageScrollView.scrollToTop()
    },
    getBasePoolItem(){
        var node = cc.instantiate(this.m_oTabItemPrefab)
        node.active = true
        return node
    },
    getTabPageItem(){
        var node = cc.instantiate(this.m_oTabPageItemPrefab)
        node.active = true
        return node
    },
    getItems(){
        return this.tabItemDatas
    },
    select:function(tabIndex){
        if (this.selectTabIdx != tabIndex){
            Gm.audio.playEffect("music/06_page_tap")
            this.selectTabIdx = tabIndex
            
            for (const key in this.listTabBtns) {
                const v = this.listTabBtns[key];
                var isSelect = key == (tabIndex-1)
                v.setSelected(isSelect)
            }
            this.updatePageList(this.tabItemDatas[tabIndex-1])
        }
    },
});
