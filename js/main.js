/**
 * Created by Administrator on 2016/9/18.
 */
//flyBox对象
function holder(){
    this.box=document.getElementById('flyBox');
}

//我方飞机对象
function myPlane(blood){
    holder.call(this);
    this.blood=blood;

    this.init();
    this.create();
    this.move();
}

//我方飞机的事件（利用原型）
myPlane.prototype={
    init:function(){
        //初始化参数获取盒子的高宽
        this.boxW=this.box.clientWidth;
        this.boxH=this.box.clientHeight;
    },
    //创造一个我放飞机
    create:function(){
        var box=this.box;//获取盒子
        this.plane=document.createElement('div');//创建一个放飞机的容器
        this.plane.className='mplane';//为容器载入预先准备好的类
        this.pos={
            x:158,
            y:474
        };
        box.appendChild(this.plane);//将飞机推入盒子
    },
    //创建一个飞机跟随鼠标移动的事件
    move:function(){
        var box=this.box;
        var plane=this.plane;//获取创建的飞机
        var self=this;
        box.onmousemove=function(e){//鼠标移动事件
            var ev=e||window.event;
            //获取鼠标当前位置
            var posX=(ev.offsetX||ev.layerX)-plane.offsetWidth/2;
            var posY=(ev.offsetY||ev.layerY)-plane.offsetHeight/2;
            //边界判断
            if(posX<=-plane.offsetWidth/2){
                posX=-plane.offsetWidth/2;
            }else if(posX>=box.clientWidth-plane.offsetWidth/2){
                posX=box.clientWidth-plane.offsetWidth/2
            }
            if(posY<=0){
                posY=0;
            }else if(posY>=box.clientHeight-plane.offsetHeight){
                posY=box.clientHeight-plane.offsetHeight;
            }
            //记录飞机位置用作子弹的坐标
            self.pos.x=posX+plane.offsetWidth/2;
            self.pos.y=posY;
            //飞机的位移
            plane.style.left=posX+'px';
            plane.style.top=posY+'px';
        }
    }
}

//创建子弹
function Bullet(speed){
    holder.call(this);
    this.speed=speed;

    this.shoot();
}

//创建子弹射击事件
Bullet.prototype={
    create:function(){
        var box=this.box;
        var bullet=document.createElement('span');
        bullet.className='bul';
        box.appendChild(bullet);

        //一个子弹的生命周期
        //子弹的位置
        bullet.style.left=(plane.pos.x-bullet.offsetWidth/2+2)+'px';
        bullet.style.top=(plane.pos.y-bullet.offsetHeight)+'px';
        bullet.t=plane.pos.y-bullet.offsetHeight;
        bullet.timer=setInterval(function(){
            bullet.t--;
            if(bullet.t<=0){
                clearInterval(bullet.timer);
                box.removeChild(bullet);
            }
            bullet.style.top=bullet.t+'px';
        },1);
    },
    shoot:function(){
        var self=this;
        this.timer = setInterval(function(){
            self.create();
        },this.speed)
    }
}

//创建敌机
var scoreNum=0;
function elePlane(opt){
    holder.call(this);
    this.speed=opt.speed;
    this.blood=opt.blood;
    this.times=opt.times;
    this.class_1=opt.class_1;
    this.class_2=opt.class_2;
    this.oScore=document.getElementsByClassName('score')[0];

    this.init();
    this.loop();
}
//创建一个敌机的原型
elePlane.prototype={
    init:function(){
        this.boxW=this.box.clientWidth;
        this.boxH=this.box.clientHeight;
    },
    create:function(){
        var box=this.box;
        var blood=this.blood;
        var h=this.boxH;
        var w=this.boxW;
        var class_1=this.class_1;
        var class_2=this.class_2;
        var speed=this.speed;
        var self=this;
        //创造一个敌机容器
        var eleFly=document.createElement('div');
        eleFly.className=class_1;
        box.appendChild(eleFly);
        //随机敌机的横向坐标
        eleFly.style.left=Math.floor(Math.random()*(w-eleFly.offsetWidth))+'px';
        eleFly.t=eleFly.offsetTop;
        //飞机下落
        eleFly.timer = setInterval(function(){
            eleFly.t+=speed;
            //到达底部飞机移出
            if(eleFly.t>=h-eleFly.offsetHeight){
                clearInterval(eleFly.timer);
                box.removeChild(eleFly);
            }
            //碰撞判断
            var el=eleFly.offsetLeft;
            var et=eleFly.offsetTop;
            var eh=eleFly.offsetHeight;
            var ew=eleFly.offsetWidth;
                //子弹碰撞
            var bullets = box.getElementsByTagName('span');
            for(var i=0;i<bullets.length;i++){
                var bul = bullets[i];
                var bl=bul.offsetLeft;
                var bt=bul.offsetTop;
                var bw=bul.offsetWidth;
                var bh=bul.offsetHeight;
                if((bl+bw>=el&&el+ew>=bl)&&(et+eh>=bt&&bt+bh>=et)){
                    blood--;
                    //记分
                    scoreNum++;
                    self.oScore.innerHTML='得分：'+scoreNum;
                    //回收子弹，必须要，没有的话会产生一些奇妙的BUG
                    clearInterval(bul.timer);
                    box.removeChild(bul);
                    //回收敌机
                    if(blood==0){
                        //记分
                        //if(self==elefly_s){
                        //    scoreNum+=1;
                        //}else if(self==elefly_l){
                        //    scoreNum+=3;
                        //}else if(self==elefly_xl){
                        //    scoreNum+=5;
                        //}
                        //self.oScore.innerHTML='得分：'+scoreNum;
                        eleFly.className=class_2;
                        clearInterval(eleFly.timer);
                        setTimeout(function(){
                            if(eleFly){
                                box.removeChild(eleFly);
                            }
                        },500)
                    }
                }
            }
                //互相伤害
            var myp=plane.plane;
            if((el+ew>=myp.offsetLeft&&myp.offsetLeft+myp.offsetWidth>=el)&&(et+eh>=myp.offsetTop&&myp.offsetTop+myp.offsetHeight>=et)){
                var oBlood=document.getElementsByClassName('blood')[0];
                var live=oBlood.children;
                live[plane.blood-1].style.backgroundPositionX='36px';
                plane.blood--;
                //回收敌机
                blood=0;
                eleFly.className = class_2;
                clearInterval(eleFly.timer);
                setTimeout(function(){
                    box.removeChild(eleFly);
                },500)
                //我方战机血量为0 游戏结束
                if(plane.blood==0){
                    myp.className = 'boom';
                    box.onmousemove = null;
                    clearInterval(eleFly.timer);
                    clearInterval(bullet.timer);
                    clearInterval(elefly_s.timer);
                    clearInterval(elefly_l.timer);
                    clearInterval(elefly_xl.timer);
                    setTimeout(function(){
                        box.removeChild(myp);
                        //结束后产生的效果
                        var gm=document.createElement('div');
                        gm.className='gameOver';
                        gm.innerHTML='<p>GAME OVER</p><button id="new">Restart Game</button><button id="end">Quit</button>';
                        box.appendChild(gm);
                        if(gm){
                            var oNew=gm.children[1];
                            var oEnd=gm.children[2];
                            oNew.onclick=function(){
                                window.location.reload();
                            }
                            oEnd.onclick=function(){
                                window.close();
                            }
                        }
                    },500)
                }
            }
            eleFly.style.top=eleFly.t+'px';
        },10)
    },
    loop:function(){
        var self=this;
        this.timer = setInterval(function(){
            self.create();
        },this.times)
    }
}
