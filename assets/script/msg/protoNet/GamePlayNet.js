var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_ENTER_PIC_C]   = "GamePlay.OPEnterPicture"
MSGCode.proto[MSGCode.OP_ENTER_PIC_S]   = "GamePlay.OPEnterPictureRet"
MSGCode.proto[MSGCode.OP_CHANGE_PIC_C]    = "GamePlay.OPChangePicture"
MSGCode.proto[MSGCode.OP_CHANGE_PIC_S]    = "GamePlay.OPChangePictureRet"
MSGCode.proto[MSGCode.OP_RESET_PIC_C]    = "GamePlay.OPResetPicture"
MSGCode.proto[MSGCode.OP_RESET_PIC_S]    = "GamePlay.OPResetPictureRet"
MSGCode.proto[MSGCode.OP_GET_EVNET_PIC_C]    = "GamePlay.OPGetEventDataPicture"
MSGCode.proto[MSGCode.OP_GET_EVNET_PIC_S]    = "GamePlay.OPGetEventDataPictureRet"
MSGCode.proto[MSGCode.OP_TRIGGER_EVENT_PIC_C]    = "GamePlay.OPTriggerEventPicture"
MSGCode.proto[MSGCode.OP_TRIGGER_EVENT_PIC_S]    = "GamePlay.OPTriggerEventPictureRet"
MSGCode.proto[MSGCode.OP_REVIVEALL_PIC_C]    = "GamePlay.OPReviveAllHeroPicture"
MSGCode.proto[MSGCode.OP_REVIVEALL_PIC_S]    = "GamePlay.OPReviveAllHeroPictureRet"

MSGCode.proto[MSGCode.OP_CHESSSKILL_VIEW_C]    = "GamePlay.OPChessSkillView"
MSGCode.proto[MSGCode.OP_CHESSSKILL_VIEW_S]    = "GamePlay.OPChessSkillViewRet"
MSGCode.proto[MSGCode.OP_CHESSSKILL_MERGE_C]    = "GamePlay.OPChessSkillMerge"

cc.Class({
    properties: {
        
    },
    openChess(page,treasure=false){
        Gm.sendCmdHttp(MSGCode.OP_CHESSSKILL_VIEW_C,{page:page,treasure:treasure})
    },
    mergeChess(sourceId,targetId,page,treasure=false){
        this.chessTargetId = targetId
        Gm.sendCmdHttp(MSGCode.OP_CHESSSKILL_MERGE_C,{page:page,sourceId:sourceId,targetId:targetId,treasure:treasure})
    },
    enter:function(treasure=false){
        Gm.sendCmdHttp(MSGCode.OP_ENTER_PIC_C,{treasure:treasure})
    },
    changeMap(flag,treasure=false){
        Gm.sendCmdHttp(MSGCode.OP_CHANGE_PIC_C,{flag:flag,treasure:treasure})
    },
    resetPic(treasure=false){
        Gm.sendCmdHttp(MSGCode.OP_RESET_PIC_C,{treasure:treasure})
    },
    getEventData(nowId,stageId,treasure=false){
        Gm.sendCmdHttp(MSGCode.OP_GET_EVNET_PIC_C,{currentMapId:nowId,stageId:stageId,treasure:treasure})
    },
    reviveAll(treasure=false){
        Gm.sendCmdHttp(MSGCode.OP_REVIVEALL_PIC_C,{treasure:treasure})
    },
    triggerEvent(nowId,stageId,lineHero=[],qualityId=0,treasure=false){
        if (lineHero.length > 0){
            Gm.heroData.setLineHero({type:PictureFunc.getLineHeroType(treasure),hero:lineHero})
        }
        this.triggerData = {nowId:nowId,stageId:stageId}
        Gm.sendCmdHttp(MSGCode.OP_TRIGGER_EVENT_PIC_C,{currentMapId:nowId,stageId:stageId,lineHero:lineHero,qualityId:qualityId,treasure:treasure})
    },

    
});
