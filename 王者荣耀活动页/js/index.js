define(function(require) {
  require('./fx');
  require("./motion-slide");
  require("./motion-loader");
  require("./radarChart");

  //设置通栏
  // console.log(mqq)
  mqq.invoke("ui", "setTransparentTitleBar", {
      bgclr: '#000000',
      titleclr: '#000000',
      txtclr: '#000000',
      anim: false,
      alpha: 0,
      dur: 150
  });

  mqq.invoke("ui", "setStatusBar", {
      ios_statusbar: 0
  })

  //点击切换区服
  $(".screen1").on("click",".area",function(){
    $(".popup").eq(0).addClass("show");
  })
  $(".screen1 .popup").on("click","button",function(){
    $(".popup").removeClass("show");
  })
  //点击执行第二页动画
  $(".screen1").on("click",".start",function(){
    $(".screen1").addClass("toPage2");
  })

  //第二页动画结束添加class
  var $page2Title =$(".page2 .title");
  $page2Title.on('webkitAnimationEnd', function() {
    // console.error("end")
    $(".screen1").addClass("page2end")
  })



  function fireAnimated(){
    // 段位火花的apng动画
    var fireCanvas = document.querySelector('.canvas-fire'),
        fireContext = fireCanvas.getContext('2d'),
        apngImage = new Image(),
        apngEmjAnimation;
      apngImage.src = './images/fire_apng.png';
      fireCanvas.width = 750;
      fireCanvas.height = 850;
      console.log("fireAnimated");
      apngEmjAnimation = APNG.animateContext(apngImage.src, fireContext);
      // checkAnimateFinished(apngEmjAnimation,emjFinished);
  }


  function flashAnimated(){
    // 英雄闪电的apng动画
    var flashCanvas = document.querySelectorAll('.canvas-flash');
    var apngImage = new Image();
    // console.log(flashCanvas)
    apngImage.src = './images/flash_apng.png';
    for (var i = 0; i < flashCanvas.length; i++){
      var flashContext = flashCanvas[i].getContext('2d');
      flashCanvas[i].width = 400;
      flashCanvas[i].height = 400;
      // console.log("flashAnimated");
      APNG.animateContext(apngImage.src, flashContext);
    }

  }


  //loader
  var $loadWrap = $('.loading-wrap');
  var $progress = $('.progress');
  new mo.Loader([
    './images/bg.png',
    './images/armour1.png',
    './images/area_box.png',
    './images/common.png',
    './images/level.png',
    './images/page1.png',
    './images/page2.png',
    './images/page3.png',
    './images/page4.png',
    './images/page5.png',
    './images/page6.png',
    './images/page8.png',
    './images/page9.png',
    './images/page10.png',
    './images/page11.png',
    './images/saying.png',
    './images/title.png'
  ], {
    loadType: 1,
    minTime: 100,
    onLoading: function(count, total) {
      var progress = parseInt(count / total * 100);
      // console.log(count,total,progress)
      $progress.text(progress + '%');
      $(".screen1").show();
      if (progress >= 20) {
        $(".screen1").addClass("step1");
      }
      if (progress >= 40) {
        $(".screen1").addClass("step2");
      }
      if (progress >= 60) {
        $(".screen1").addClass("step3");
      }
      if (progress >= 80) {
        $(".screen1").addClass("step4");
      }
      if (progress >= 100) {
        $(".screen1").addClass("step5");
      }
    },
    onComplete: function(time) {
      // $(".screen1").removeClass("loading");
      $(".page-slide").show();
      slideInit();

      //圆环动画循环后暂停
      var $circleRight =$(".page1 .circle-right");
      var playCount = 0;
      $circleRight.on('webkitAnimationIteration', function() {
        playCount ++;
        if(playCount == 2){
          $(".screen1").addClass("circle1-pause");
        }
        if(playCount == 3){
          $(".screen1").addClass("circle2-pause");
        }
      })

      //英雄闪电的apng动画
      // flashAnimated();
      //段位火花的apng动画
      // fireAnimated();

      //上周对战数据
      radarChart.init(document.querySelector("#lastWeek"), {
          data: {
              maxValue: [4, 4, 4, 4, 4, 4],
              value: [0.2, 1, 3, 4, 3, 2],
          },
          config: {
              scale: 0.92,
              dataFill: {
                  fillStyle: "rgba(165,165,165, 0.3)"
              },
              bg: {
                  layer: 4,
                  evenFillStyle: "transparent",
                  oddFillStyle: "transparent",
                  evenStrokeStyle: "transparent",
                  oddStrokeStyle: "transparent"
              },
              dataCircle: {
                  r: 0,
                  strokeStyle: "transparent",
                  fillStyle: "transparent",
                  lineWidth: 0
              },
              dataLine: {
                  strokeStyle: "transparent",
                  lineWidth: 0
              },
              font: {
                  fontColor: "transparent"
              }
          }
      });
      //本周对战数据
      radarChart.init(document.querySelector("#thisWeek"), {
          data: {
              maxValue: [4, 4, 4, 4, 4, 4],
              value: [3.6, 2, 3.3, 1.4, 4 ,3.4],
          },
          config: {
              scale: 0.92,
              dataFill: {
                  fillStyle: "rgba(0, 73, 237, .5)"
              },
              bg: {
                  layer: 4,
                  evenFillStyle: "transparent",
                  oddFillStyle: "transparent",
                  evenStrokeStyle: "transparent",
                  oddStrokeStyle: "transparent"
              },
              dataCircle: {
                  r: 4,
                  strokeStyle: "rgba(63,42,109,1)",
                  fillStyle: "#ffee5b",
                  lineWidth: 4
              },
              dataLine: {
                  strokeStyle: "#3f2a6d",
                  lineWidth: 3
              },
              font: {
                  fontColor: "transparent"
              }
          }
      });
    }
  });


  function slideInit() {
    window.pageSlide = new mo.Slide({
      target: $('.slide .page-slide')
    });

    pageSlide.on('change', function(e) {
      console.log("change:"+this.curPage)
      var prevPage = this.prevPage;
      var curPage = this.curPage;
      $('.slide .page-slide').eq(prevPage).removeClass('animated');
      $('.slide .page-slide').eq(curPage).addClass('animated');
        if(curPage === 1){

        var el1=$(".screen3 .data-text dd")[0];
        var el2=$(".screen3 .data-text dd")[1];
        var el3=$(".screen3 .data-text dd")[2];

        var od1 = new Odometer(
        {
          el: el1,
          format: '',
          duration: 3000,
          theme: 'default'
        //  animation: 'count'
        });
        var od2 = new Odometer(
        {
          el: el2,
          format: '',
          duration: 3000,
          theme: 'default'
        //  animation: 'count'
        });
        var od3 = new Odometer(
        {
          el: el3,
          format: '',
          duration: 3000,
          theme: 'default'
        //  animation: 'count'
        });

        el1.innerHTML = "";
          od1.update(22);
        setTimeout(function(){
          el2.innerHTML = "";
          od2.update(10);
        },200);
        setTimeout(function(){
          el3.innerHTML = "";
          od3.update(32);
        },400);
      };
      if(curPage === 2){
        var el1=$(".screen4 .data-text dd").eq(0)[0];
        var el2=$(".screen4 .data-text dd").eq(1)[0];
        var el3=$(".screen4 .data-text dd").eq(2)[0];

        var od1 = new Odometer(
        {
          el: el1,
          format: '',
          duration: 3000,
          theme: 'default'
        //  animation: 'count'
        });
        var od2 = new Odometer(
        {
          el: el2,
          format: '',
          duration: 3000,
          theme: 'default'
        //  animation: 'count'
        });
        var od3 = new Odometer(
        {
          el: el3,
          format: '',
          duration: 3000,
          theme: 'default'
        //  animation: 'count'
        });


        el1.innerHTML = "";
        od1.update(122);
        setTimeout(function(){
          el2.innerHTML = "";
          od2.update(6);
        },200);
        setTimeout(function(){
          el3.innerHTML = "";
          od3.update(109);
        },400);
      };
    })
  }
});
