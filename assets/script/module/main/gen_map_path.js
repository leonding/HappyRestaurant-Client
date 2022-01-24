
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim_com = this.node.getComponent(cc.Animation)
        var clips = this.anim_com.getClips();
        var clip = clips[0];

        console.log(clip.curveData)

        var paths = clip.curveData.paths;

        var k;
        for(k in paths){
            var road_data = paths[k].props.position;
            this.gen_path_data(road_data);    
        }

    },

    gen_path_data: function(road_data) {

    }

  
    // update (dt) {},
});
