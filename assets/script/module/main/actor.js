var State = {
    IDLE: 0, //静止
    WALK: 1, //行走
    ATTACK: 2, //攻击
    DEAD: 3, //死亡
    ARRIVED: 4, //到达
}

var Direction = {
    INVALID_DIR: -1,
    UP_DIR: 0,
    DOWN_DIR: 1,
    LEFT_DIR: 2,
    RIGHT_DIR: 3,
}


var walk_anim_params = cc.Class({
    name: "walk_anim_params",
    properties: {
        anim_frames: {
            type: cc.SpriteFrame,
            default: [],
        },
        anim_duration: 0.1,

        scale_x: 1,
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        //0 上 1 下 2 左 3 右
        walk_anim_set: {
            type: walk_anim_params,
            default: [],
        },
      

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.speed = 100;
        this.state = State.IDLE;

        this.anim = this.node.getChildByName("anim");
        this.frame_anim = this.anim.addComponent("frame_anim");

    },

    run_at_road:function(road_data){
        if(road_data.length < 2){
            return;
        }

        this.road_data = road_data;
        this.state = State.WALK;

        this.node.setPosition(road_data[0]);

        this.next_step = 1;
        this.walk_to_next();
    },

    
    play_walk_anim: function(dir) {

        var r = Math.atan2(dir.y, dir.x);
        
        var now_dir = Direction.INVALID_DIR

        if(r >= -Math.PI && r < -0.75 * Math.PI) { //左
            now_dir = Direction.LEFT_DIR
        }
        else if(r >= -0.75 * Math.PI && r < -0.25 * Math.PI) { //下
           now_dir = Direction.DOWN_DIR
        }
        else if(r >= -0.25 * Math.PI && r < 0.25 * Math.PI) { //右边
            now_dir = Direction.RIGHT_DIR
        }
        else if(r >= 0.25 * Math.PI && r < 0.75 * Math.PI) { //上
            now_dir = Direction.UP_DIR
        }
        else {
            now_dir = Direction.LEFT_DIR
        }
        this.anim_dir = now_dir;
        this.frame_anim.stop_anim();
        this.frame_anim.sprite_frames = this.walk_anim_set[this.anim_dir].anim_frames;
        this.frame_anim.duration = this.walk_anim_set[this.anim_dir].anim_duration;
        this.anim.scaleX = this.walk_anim_set[this.anim_dir].scale_x;
 
        this.frame_anim.play_loop();
    },

    walk_to_next:function(){
        this.state = State.WALK;

        var start_pos = this.node.getPosition();
        var end_pos = this.road_data[this.next_step];
        var dir = end_pos.sub(start_pos);
        var len = dir.mag();
        this.walk_time_total = len / this.speed;
        this.vx = this.speed * dir.x / len;
        this.vy = this.speed * dir.y / len;

        this.walk_time = 0;


        this.play_walk_anim(dir);
    },

    start () {

    },

    walk_update: function(dt) {
        this.walk_time += dt;
        if(this.walk_time >= this.walk_time_total){
            dt -= (this.walk_time - this.walk_time_total);
        }
        var sx = this.vx * dt;
        var sy = this.vy * dt;

        this.node.x += sx;
        this.node.y += sy;
        // console.log("--------------------", this.node.x, this.node.y)
        this.node.zIndex = this.node.y + Math.abs(this.node.x)

        var guest = Gm.ui.getScript("MainView").getFrontGuest(this)
  
        if(guest) {
            var dir = guest.node.getPosition().sub(this.node.getPosition())
            var len = dir.mag();
           if((guest.state == State.IDLE || guest.state == State.ARRIVED) && len < 25) {
               this.state = State.IDLE;
           }
        }

        if(this.state == State.WALK && this.walk_time > this.walk_time_total){
            this.next_step ++;
            if(this.next_step >= this.road_data.length) {
                this.state = State.ARRIVED;
            }else{
                this.walk_to_next();
            }
        }
    },

    update (dt) {
        if(this.state == State.WALK) {
            this.walk_update(dt)
        }

    },
});
