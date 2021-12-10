exports.showEventType = function(nowId,stageId,treasure){
    var eventData = Gm.pictureData.getEventDataByStageId(stageId,treasure)
    var data = Gm.pictureData.getFloorInfoByStageId(stageId,treasure)
    // cc.log(stageId,data)
    var conf = Gm.config.getPictureEvent(data.eventId)
    var dd = {nowId:nowId,stageId:stageId,treasure:treasure}
    // cc.log(conf)
    if (conf.type == 1){ //战斗事件
        if (eventData.length == 0){
            Gm.gamePlayNet.getEventData(nowId,stageId,treasure)
            return
        }
        Gm.ui.create("PictureBattleEventView",dd)
    }else if (conf.type == 2){ //酒馆
        if (eventData.length == 0){
            Gm.gamePlayNet.getEventData(nowId,stageId,treasure)
            return
        }
        Gm.ui.create("PictureTavernView",dd)
    }else if (conf.type == 3){ //恢复
        
        Gm.box({title:Ls.get(2315),msg:Ls.get(2316),ok:Ls.get(2317)},(btnType)=>{
            if (btnType == 1){
                Gm.gamePlayNet.triggerEvent(nowId,stageId,[],0,treasure)
            }
        })
    }else if (conf.type == 4){ //复活
        Gm.box({title:Ls.get(2318),msg:Ls.get(2319),ok:Ls.get(2320)},(btnType)=>{
            if (btnType == 1){
                Gm.gamePlayNet.triggerEvent(nowId,stageId,[],0,treasure)
            }
        })
    }else if (conf.type == 5){ //棋子

    }
}

exports.getLineHeroType = function(treasure){
    return treasure?ConstPb.lineHero.LINE_PICTURE2:ConstPb.lineHero.LINE_PICTURE
}

exports.getYunPos = function(){
    var posList = {}
    posList[3] = [-250.911,-2.756,258.472]
    posList[4] = [-268.281,-82.115,95.178,290.076]
    posList[5] = [-287.158,-125.439,13.972,165.598,310.007]
    return posList
}



