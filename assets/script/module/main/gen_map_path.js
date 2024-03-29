
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.road_path = {}

        this.anim_com = this.node.getComponent(cc.Animation)
        var clips = this.anim_com.getClips();
        var clip = clips[0];

        console.log(clip.curveData)

        this.graphics = this.node.getComponent(cc.Graphics)

        var paths = clip.curveData.paths;

        var k;
        for(k in paths){
            var road_data = paths[k].props.position;
            this.gen_path_data(k, road_data);    
        }

        Gm.ui.getMain().set_road_path(this.road_path)
    },

    gen_path_data: function(road_key, road_data) {
        var data = []
        for(var i = 0; i < road_data.length; i++){
            var key_frame = road_data[i];
            data.push(cc.v2(key_frame.value[0], key_frame.value[1]))

            if(key_frame.motionPath != undefined){
                for(var j = 0; j < key_frame.motionPath.length; j++){
                    data.push(cc.v2(key_frame.motionPath[j][0], key_frame.motionPath[j][1]))
                }
            }
        }
        this.road_path[road_key] = data 
        cc.log("123213",data)

        for(var index = 0; index < data.length; index++){
            var startPoint = data[index];
            cc.log(startPoint.x, startPoint.y)
            
            if(index == 0){
                this.graphics.moveTo(startPoint.x, startPoint.y)
            }else {
                this.graphics.lineTo(startPoint.x, startPoint.y)
            }
            this.graphics.stroke()
        }
    },

    start: function(){
        // var actor = this.node.parent.getChildByName("enemy_bear").getComponent("actor")
        // actor.run_at_road(this.road_path)
        // cc.log(actor)
    },

    get_road_path: function(){
        return this.road_path;
    },


    // update (dt) {},
});
