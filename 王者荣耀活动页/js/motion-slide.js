//define(function(require) {
    //var Zepto = require($);
    (function () {

        /*===================filePath:[src/main/motion/motion.js]======================*/
        /**
         * @author Brucewan
         * @version 1.0
         * @date 2014-06-13
         * @description tg核心功能
         * @example
         var tab1 = new mo.Tab({
			target: $('#slide01 li')
		});
         * @name mo
         * @namespace
         */
        (function () {

            (function () {

                if (window.Motion) {
                    return;
                }

                var Motion = /** @lends mo */{
                    /**
                     * tg版本号
                     * @type {string}
                     */
                    version: '1.1',

                    /**
                     * 命令空间管理 eg. Motion.add('mo.Slide:mo.Tab', function(){})
                     * @param {string} name
                     * @param {object} obj
                     */

                    add: function (name, obj) {
                        var target = window;
                        var me = arguments.callee;
                        var parent = null;
                        var isMatch = /^([\w\.]+)(?:\:([\w\.]+))?\s*$/.test(name);
                        var objNS = RegExp.$1.split('.');
                        var parentNS = RegExp.$2.split('.');
                        var name = objNS.pop();
                        var isClass = /[A-Z]/.test(name.substr(0, 1));
                        var constructor = function () {
                            var mainFn = arguments.callee.prototype.init;
                            if (typeof(mainFn) == 'function' && arguments.callee.caller != me) {
                                mainFn && mainFn.apply(this, arguments);
                            }
                        };

                        for (var i = 0; i < objNS.length; i++) {
                            var p = objNS[i];
                            target = target[p] || (target[p] = {});
                        }

                        if (parentNS[0] != '') {
                            parent = window;
                            for (var i = 0; i < parentNS.length; i++) {
                                parent = parent[parentNS[i]];
                                if (!parent) {
                                    parent = null;
                                    break;
                                }
                            }
                        }


                        if (isClass && typeof(obj) == 'function') {
                            if (parent) {
                                constructor.prototype = new parent();
                                constructor.prototype.superClass = parent;
                            }
                            target[name] = constructor;
                            constructor.prototype.constructor = constructor;
                            obj.call(target[name].prototype);
                        } else {
                            target[name] = obj;
                        }

                    }

                };

                window.Motion = window.mo = Motion;
            })();

        })();

        /*===================filePath:[src/main/base/base.js]======================*/
        /**
         * @version 1.0
         * @date 2014-06-15
         * @description mo
         * @name mo
         * @namespace
         */

        /**
         * @author Brucewan
         * @version 1.0
         * @date 2014-06-18
         * @description 基础类
         * @name mo.Base
         * @class
         */
        (function () {


            Motion.add('mo.Base', function () {
                /**
                 * public 作用域
                 * @alias mo.Base#
                 * @ignore
                 */
                var _public = this;
                /**
                 * public static作用域
                 * @alias mo.Base.
                 * @ignore
                 */
                var _static = this.constructor;
                /**
                 * private static作用域
                 * @alias mo.Base~
                 * @ignore
                 */
                var _self = {};
                /**
                 * 构造函数
                 */
                _public.constructor = function () {
                    // private作用域
                    var _private = {};
                };


                /**
                 * 绑定事件
                 */

                _public.on = function (name, fn) {
                    box = Zepto(this);
                    return box.on.apply(box, arguments);
                };


                /**
                 * 绑定事件
                 */
                _public.off = function (name, fn) {
                    box = Zepto(this);
                    return box.off.apply(box, arguments);
                };

                /**
                 * 触发事件
                 */
                _public.trigger = function (name, data) {
                    var box = Zepto(this);
                    return box.triggerHandler.apply(box, arguments);
                };


            });

        })();

        /*===================filePath:[src/main/tab/tab.js]======================*/
        /**
         * @author Brucewan
         * @version 1.0
         * @date 2014-06-18
         * @description 切换类中
         * @extends mo.Base
         * @name mo.Tab
         * @requires lib/zepto.js
         * @requires src/base.js
         * @param {object|string} config.target 目标选项卡片，即供切换的 Elements list (Elements.length >= 2)
         * @param {object|string} [config.controller='ul>li*'] 触发器
         * @param {string} [config.direction='x'] 指定方向，仅效果为'slide'时有效
         * @param {boolean}  [config.autoPlay=false] 是否自动播放
         * @param {number}  [config.playTo=0] 默认播放第几个（索引值计数，即0开始的计数方式）
         * @param {number}  [config.switchTo=undefined] 切换到第几个（无动画效果）
         * @param {string}  [config.type='touchend'] 事件触发类型
         * @param {string}  [config.currentClass='current'] 当前样式名称, 多tab嵌套时有指定需求
         * @param {boolean}  [config.link=false] tab controller中的链接是否可被点击
         * @param {boolean}  [config.circle=false] 是否循环滚动
         * @param {number}  [config.stay=2000] 自动播放时停留时间
         * @param {number}  [config.disable] 禁止某屏滚动
         * @param {object|string}  [config.prevBtn] 播放前一张，调用prev()
         * @param {object|string}  [config.nextBtn] 插放后一张，调用next()
         * @param {string}  [config.easing='swing'] 动画方式：默认可选(可加载Zepto.easying.js扩充)：'swing', 'linear'
         * @param {object{string:function}}  [config.event] 初始化绑定的事件
         * @param {object{'dataSrc':Element, 'dataProp':String, 'dataWrap':Element, 'delay': Number}}  [config.title] 初始化绑定的事件
         * @param {boolean}  [config.lazy=false] 是否启用按需加载，需要按需加载的元素设置data-src属性
         * @example
         var tab1 = new mo.Tab({
			target: $('#slide01 li')
		});
         * @see tab/demo1.html 普通切换
         * @see tab/demo2.html 按需加载
         * @see tab/demo3.html 自定义事件
         * @class
         */
        (function () {


            Motion.add('mo.Tab:mo.Base', function () {
                /**
                 * public 作用域
                 * @alias mo.Tab#
                 * @ignore
                 */
                var _public = this;

                var _private = {};

                /**
                 * public static作用域
                 * @alias mo.Tab.
                 * @ignore
                 */
                var _static = this.constructor;


                // 插件默认配置
                _static.config = {
                    //target // 目标 tab items
                    //controller // tab header(toc?)
                    //width // 限定目标宽度
                    //height // 限定目标高度
                    //disable // 禁止某屏滚动
                    //arrow // 指示箭头
                    effect: 'base',
                    direction: 'x',
                    autoPlay: false,
                    playTo: 0, // 播放到第几个 tab
                    switchTo: window.undefined, // 切换到第几个 tab
                    type: 'touchend',
                    currentClass: 'current',
                    link: false,
                    stay: 2000,
                    delay: 200,
                    touchDis: 20,
                    lazy: window.undefined,
                    circle: false,
                    degradation: 'base',
                    animateTime: 300,
                    event: {},
                    easing: 'ease',
                    title: {
                        delay: 0
                    },
                    controlDisabed: false
                };

                _static.effect = {};

                _private.supportTouch = 'ontouchstart' in window;
                _private.e = {
                    'touchstart': _private.supportTouch ? 'touchstart' : 'mousedown',
                    'touchmove': _private.supportTouch ? 'touchmove' : 'mousemove',
                    'touchend': _private.supportTouch ? 'touchend' : 'mouseup'
                }


                /***
                 * 初始化
                 * @description 参数处理
                 */
                _public.init = function (config) {
                    this.config = Zepto.extend(true, {}, _static.config, config); // 参数接收

                    var self = this;
                    var config = self.config;


                    // 必选参数处理
                    var target = Zepto(config.target);


                    // 统计实例
                    if (this.constructor.instances) {
                        this.constructor.instances.push(this);
                    } else {
                        this.constructor.instances = [this];
                    }

                    // 参数处理
                    Zepto.extend(self, /** @lends mo.Tab.prototype*/ {
                        /**
                         * 目标选项卡片
                         * @type object
                         */
                        target: target,

                        /**
                         * 目标选项卡片控制器
                         * @type object
                         */
                        controller: null,

                        /**
                         * 上一个选项卡的索引值
                         * @type number|undefined
                         */
                        prevPage: window.undefined,

                        /**
                         * 当前播放第几个的索引值
                         * @type number|undefined
                         */
                        curPage: window.undefined,

                        /**
                         * 目标选项卡片容器
                         * @type object
                         */
                        container: target.parent(), // 包裹容器

                        //length: target.length, // 元素数目
                        prevBtn: Zepto(config.prevBtn),
                        nextBtn: Zepto(config.nextBtn),

                        /**
                         * 播放状态
                         * @type boolean
                         */
                        isPlaying: config.autoPlay,

                        disabledPrevList: [],
                        disabledNextList: []
                    });

                    if (target.length <= 1) {
                        return;
                    }

                    if (config.disable !== window.undefined) {
                        self.disable(config.disable);
                    }
                    if (!config.circle) {
                        self.disable(0, 'prev');
                        self.disable(self.target.length - 1, 'next');
                    }


                    // 快捷传入自定义事件
                    for (var name in config) {
                        var result = /^on(.+)/.exec(name);
                        if (result && result[1]) {
                            config.event[result[1]] = config[name];
                        }
                    }

                    // 效果作为自定义事件绑定
                    if (_static.effect[config.effect]['beforechange']) {
                        _static.effect[config.effect]['mobeforechange'] = _static.effect[config.effect]['beforechange'];
                        delete _static.effect[config.effect]['beforechange'];
                    }
                    self.on(_static.effect[config.effect]);

                    // 自定义事件绑定
                    self.on(config.event);


                    /**
                     * @event mo.Tab#beforeinit
                     * @property {object} event 开始初始化前
                     */
                    if (self.trigger('beforeinit') === false) {
                        return;
                    }

                    // DOM初始化
                    _private.initDOM.call(self);

                    // DOM绑定事件
                    _private.attach.call(self);

                    // 延时0s，待init对DOM修改渲染完成后执行
                    /**
                     * @event mo.Tab#init
                     * @property {object} event 初始化完成
                     */
                    if (self.trigger('init') === false) {
                        return;
                    }


                    // 播放到默认Tab
                    if (config.switchTo !== window.undefined) {
                        self.switchTo(config.switchTo);
                    } else {
                        self.switchTo(config.playTo);
                    }


                    // 自动播放
                    if (config.autoPlay) self.play();


                };

                // 绑定事件
                _private.initDOM = function () {
                    var self = this;
                    var config = self.config;

                    // 保证 目标层、包裹层、容器层 三层方便控制
                    // if (/(:?ul|ol|dl)/i.test(self.container[0].tagName)) {
                    // 	self.wrap = self.container;
                    // 	self.container = self.wrap.parent();
                    // } else {
                    // 	config.target.wrapAll('<div class="tab_wrap">'); // 可能带来风险，尽量用用规则保障，不执行到这一步
                    // 	self.wrap = self.target.parent();
                    // }
                    self.wrap = self.container;
                    self.container = self.wrap.parent();

                    // 如果有控制controller
                    if (config.controller !== false) {
                        config.controller = Zepto(config.controller);
                        if (config.controller.length < 1) {
                            var ul = Zepto('<ul class="controller">');
                            var str = '';
                            for (var i = 0; i < self.target.length; i++) {
                                str += '<li>' + (i + 1) + '</li>';
                            }
                            ul.html(str);
                            self.container.append(ul);
                            config.controller = ul.children();
                        }
                        self.controller = config.controller;
                    }

                    // 移除不需要且只含有document.write的script标签，以防后续操作出错
                    var scripts = self.target.find('script');
                    scripts.each(function (i, elem) {
                        elem = Zepto(elem);
                        // 如果script中只执行了document.write，则移出该script标签
                        if (/^\s*document\.write\([^\)]+\)[\s;]*$/.test(elem.html())) {
                            elem.remove();
                        }
                    });

                    // 获取标题
                    var titleSrc = config.title.dataSrc || self.target;
                    var titleProp = config.title.dataProp || 'title';
                    var titleWrap = Zepto(config.title.dataWrap);
                    titleSrc = Zepto(titleSrc);

                    // 如果标题容器存在 并且 有标题数据
                    if (titleWrap.length > 0 && titleSrc.attr(titleProp)) {
                        self.titleWrap = titleWrap;
                        self.titleData = [];
                        titleSrc.each(function (i, obj) {
                            self.titleData.push(Zepto(obj).attr(titleProp));
                        });
                    }

                    // 检测前缀
                    self.cssPrefix = '';
                    self.propPrefix = '';
                    var vendors = {'webkit': 'webkit', 'Moz': 'moz', 'ms': 'ms'};
                    var testElem = document.createElement('div');
                    for (var key in vendors) {
                        if (testElem.style[key + 'Transform'] !== undefined) {
                            self.cssPrefix = '-' + vendors[key] + '-';
                            self.propPrefix = key;
                            break;
                        }
                    }


                };

                // 绑定事件
                _private.attach = function () {
                    var self = this;
                    var config = self.config;

                    if (self.controller) {
                        Zepto.each(self.controller, function (i, elem) {
                            var elem = Zepto(elem);
                            var delayTimer;
                            elem.on(config.type, function () {
                                self.playTo(i);
                            });
                            if (!config.link) {
                                Zepto(elem).on(_private.e.touchstart, function (e) {
                                    e.preventDefault();
                                });
                            }

                        })
                    }

                    if (self.nextBtn) {
                        Zepto(self.nextBtn).on(_private.e.touchend, function (e) {
                            self.next();
                            e.preventDefault();
                        });
                    }

                    if (self.prevBtn) {
                        Zepto(self.prevBtn).on(_private.e.touchend, function (e) {
                            self.prev();
                            e.preventDefault();
                        });
                    }

                    self.wrap.on(_private.e.touchstart, function () {
                        // 如果没在自动播放
                        if (self.isPlaying) {
                            _private.clearTimer.call(self);
                        }
                    });
                    Zepto('body').on(_private.e.touchend, function () {
                        // 如果没在自动播放
                        if (self.isPlaying) {
                            _private.setTimer.call(self);
                        }

                    });

                    if (config.touchMove) {
                        _private.touchMove.call(self);
                    }

                };

                /**
                 * 播放到第几个选项卡
                 * @param {number} page 第几页（索引值）
                 */
                _public.playTo = function (page) {
                    page = parseInt(page);
                    if (page === NaN) {
                        return;
                    }
                    var self = this;
                    var config = self.config;
                    var hasCur = self.curPage !== window.undefined;
                    var prevPage;

                    if (page === self.oriCurPage) {
                        self.trigger('mobeforechange');
                        return;
                    }

                    // 临界计算
                    self._outBound = function (i) {
                        if (i >= self.target.length) i %= self.target.length;
                        if (i < 0) {
                            var m = i % self.target.length;
                            i = m === 0 ? 0 : (m + self.target.length);
                        }
                        return i;
                    }

                    self.oriPrevPage = self.oriCurPage;
                    self.oriCurPage = page;


                    self.prevPage = self.curPage;
                    prevPage = self.curPage;
                    page = self.curPage = self._outBound(page);


                    if (self.controller && page !== prevPage) {
                        var curCtrl = self.controller[page],
                            prevCtrl = self.controller[prevPage];
                        if (curCtrl) {
                            //curCtrl.setAttribute('a', page);
                            Zepto(curCtrl).addClass(self.config.currentClass);
                        }
                        if (prevCtrl) Zepto(prevCtrl).removeClass(self.config.currentClass); //如果正常获取


                    }

                    if (page !== prevPage) {
                        self.target.eq(page).addClass(self.config.currentClass);
                        self.target.eq(prevPage).removeClass(self.config.currentClass);
                    }

                    // 填充标题
                    if (self.titleWrap) {
                        window.setTimeout(function () {
                            self.titleWrap.html(self.titleData[self.curPage] || '');
                        }, config.title.delay);
                    }

                    // 按需加载
                    var curTarget = Zepto(self.target[self.curPage]);
                    if (config.lazy === window.undefined) {
                        var curChildren = curTarget.children();
                        if (curChildren.length === 1 && curChildren[0].tagName.toLowerCase() == 'textarea') {
                            config.lazy = true;
                        }
                    }
                    if (config.lazy === true) {
                        if (curTarget.length > 0 && !curTarget.data('parsed')) _private.lazyload(curTarget);
                        if (self._loaded === window.undefined) {
                            self._loaded = [];
                        }
                        if (self._loaded.indexOf(page) === -1) {
                            var curObj = self.target.eq(page);
                            var elems = curObj.find('*');
                            elems = Zepto(elems.concat(curObj));
                            elems.each(function (i, elem) {
                                elem = Zepto(elem);
                                var src = elem.data('src');
                                if (src) {
                                    if (/img|audio|video|link/i.test(elem[0].tagName)) {
                                        elem.attr('src', src);
                                    } else {
                                        elem.css('background-image', 'url(' + src + ')');
                                    }

                                    elem.removeAttr('data-src');
                                }

                            });
                            self._loaded.push(page);
                        }

                    }

                    //self.config.onchange.call(self, page);
                    /**
                     * @event mo.Tab#beforechange
                     * @property {object} event 开始切换
                     */
                    if (self.trigger('beforechange', [self.curPage]) === false) {
                        return;
                    }

                    self.trigger('mobeforechange');
                    //if(self.effect) self.effect.onchange.call(self);

                    // 指示箭头显示/隐藏
                    var arrow = Zepto(config.arrow);
                    if (arrow.length > 0) {
                        console.log(self.curPage >= self.target.length - 1);
                        if ((self.curPage >= self.target.length - 1 && !config.circle) || self.disabledNextList.indexOf(self.curPage) != -1) {
                            arrow.css('display', 'none')
                        } else {
                            arrow.css('display', 'block')
                        }
                    }

                };

                /**
                 * 播放后一个
                 */
                _public.next = function () {
                    this.playTo(this.oriCurPage + 1);
                };

                /**
                 * 播放前一个
                 */
                _public.prev = function () {
                    this.playTo(this.oriCurPage - 1);
                };

                /**
                 * 开始自动播放
                 */
                _private.setTimer = function () {
                    var self = this;
                    var config = self.config;
                    if (self.timer) {
                        _private.clearTimer.call(self);
                    }

                    self.timer = window.setInterval(function () {
                        var to = self.curPage + 1;
                        self.playTo(to);

                    }, config.stay);

                };

                /**
                 * 停止自动播放
                 */
                _private.clearTimer = function () {
                    window.clearInterval(this.timer);
                };

                /**
                 * 开始自动播放
                 */
                _public.play = function () {
                    var self = this;
                    _private.setTimer.call(self);
                    self.isPlaying = true;
                    self.trigger('play');
                };

                /**
                 * 停止自动播放
                 */
                _public.stop = function () {
                    var self = this;
                    _private.clearTimer.call(self);
                    self.isPlaying = false;
                    self.trigger('stop');
                };


                /**
                 * 禁用某屏
                 */
                _public.disable = function (index, direction) {
                    var self = this;
                    if (!direction || direction == 'prev') {
                        self.disabledPrevList.push(index);
                    }
                    if (!direction || direction == 'next') {
                        self.disabledNextList.push(index);
                    }
                };


                /**
                 * 启用某屏
                 */
                _public.enable = function (index, direction) {
                    var self = this;
                    if (!direction || direction == 'prev') {
                        var pos = self.disabledPrevList.indexOf(index);
                        if (pos !== -1) {
                            self.disabledPrevList.splice(pos, 1);
                        }
                    }
                    if (!direction || direction == 'next') {
                        var pos = self.disabledNextList.indexOf(index);
                        if (pos !== -1) {
                            self.disabledNextList.splice(pos, 1);
                        }
                    }
                };

                /**
                 * 无动画效果切换
                 */
                _public.switchTo = function (page) {
                    var self = this;
                    var userAnimateTime = self.config.animateTime;
                    self.config.animateTime = 0;
                    self.playTo(page);
                    window.setTimeout(function () {
                        self.config.animateTime = userAnimateTime;
                    }, 2);

                };

                _static.extend = function (name, events) {
                    var obj = {};
                    if (Zepto.isPlainObject(name)) {
                        obj = name;
                    } else {
                        obj[name] = events;
                    }
                    Zepto.extend(_static.effect, obj);
                };

                _private.lazyload = function (curTarget) {
                    var textareas = curTarget.children('textarea');

                    // curTarget子元素有且只有一个textarea元素时
                    if (textareas.length === 1) {
                        curTarget.html(textareas.eq(0).val())
                        curTarget.data('parsed', true);
                    }
                };

                _private.touchMove = function () {
                    var self = this;
                    var config = self.config;

                    var touchMove, touchEnd, touchDirection;
                    var startX, startY, disX, disY, dis;
                    var moveX, moveY, moveDisX, moveDisY, moveDis;
                    var stopMove = false;

                    if (config.touchMove) {
                        self.wrap.on(_private.e.touchstart, function (e) {
                            var evt = e.touches ? e.touches[0] : e;
                            startX = moveX = evt.pageX;
                            startY = moveY = evt.pageY;
                            // console.log(startY);

                            /**
                             * @event mo.Tab#touchstart
                             * @property {object} event 开始切换
                             */
                            if (self.trigger('touchstart', [startX, startY]) === false) {
                                return;
                            }

                            self.wrap.on(_private.e.touchmove, touchMove);
                            self.wrap.on(_private.e.touchend, touchEnd);
                            touchDirection = '';
                        });
                    }
                    touchMove = function (e) {
                        var evt = e.touches ? e.touches[0] : e;
                        var x = evt.pageX;
                        var y = evt.pageY;
                        disX = x - startX;
                        disY = y - startY;
                        moveDisX = x - moveX;
                        moveDisY = y - moveY;
                        moveX = x;
                        moveY = y;

                        if (config.direction == 'x') {
                            dis = disX;
                            moveDis = moveDisX;
                        } else {
                            dis = disY;
                            moveDis = moveDisY;
                        }
                        if (!touchDirection) {
                            if (Math.abs(disX / disY) > 1) {
                                touchDirection = 'x';
                            } else {
                                touchDirection = 'y';
                            }
                        }

                        //如果在第一页
                        var $screen1=self.target.eq(0);
                        if(self.curPage == 0){
                          var isPage1 = !$screen1.hasClass("toPage2");
                          var isPage2end = $screen1.hasClass("page2end");
                          //如果在第一屏
                          if(isPage1){
                            stopMove = true;
                            //上滑添加动画去第二屏
                            if(dis <= -30){
                              $screen1.addClass("toPage2");
                            }
                            return false;
                        //如果在第二屏
                          }else{
                            //下滑移除动画去第一屏
                            if(dis >= 30){
                              $screen1.removeClass("toPage2").removeClass("page2end");
                            }
                            if(isPage2end){
                              stopMove = false;
                            }else{
                              stopMove = true;
                              return false;
                            }
                          }
                        }

                        if (config.direction == touchDirection) {

                            e.preventDefault();
                            e.stopPropagation();
                            /**
                             * @event mo.Tab#touchmove
                             * @property {object} event 开始切换
                             */
                            self.trigger('touchmove', [dis, moveDis, evt]);
                        }
                        // if ((dis > 0 && self.curPage >= 0) || (dis < 0 && self.curPage <= self.target.length - 1)) {

                        // }


                    }
                    touchEnd = function () {
                        if(stopMove){
                          return;
                        }
                        if (touchDirection && config.direction != touchDirection) {
                            return;
                        }
                        if (dis === undefined || isNaN(dis) || dis === 0) {
                            return;
                        }

                        // self.wrap.style.webkitTransitionDuration = config.animTime + 'ms';
                        self.wrap.off(_private.e.touchmove, touchMove);
                        self.wrap.off(_private.e.touchend, touchEnd);


                        /**
                         * @event mo.Tab#touchend
                         * @property {object} event 开始切换
                         */
                        if (self.trigger('touchend', [dis]) === false) {
                            dis = 0;
                            return;
                        }

                        var isOK = true;
                        if (!dis || (Math.abs(dis) < config.touchDis || !isOK)) {
                            self.playTo(self.curPage);
                            dis = 0;
                            return;
                        }

                        if ((self.disabledPrevList.indexOf(self.curPage) !== -1 && dis > 0) ||
                            (self.disabledNextList.indexOf(self.curPage) !== -1 && dis < 0)) {
                            self.playTo(self.oriCurPage);
                            dis = 0;
                            return;
                        }


                        // var to = dis > 0 ? self.oriCurPage - 1 : self.oriCurPage + 1;
                        // var length = self.target.length;
                        // if(!config.circle) {
                        // 	to = to < 0 ? 0 : to;
                        // 	to = to >= length ? length - 1 : to;
                        // }
                        var to = dis > 0 ? self.oriCurPage - 1 : self.oriCurPage + 1;

                        self.playTo(to);

                        dis = 0;

                    };

                };

                _static.extend('base', {
                    init: function () {
                        var self = this;
                        config = self.config;
                        Zepto.each(self.target, function (i, elem) {
                            if (self.target[config.playTo][0] != elem) Zepto(elem).hide();
                        });

                    },
                    beforechange: function () {
                        var self = this,
                            prevElem = self.prevPage === window.undefined ? null : self.target[self.prevPage],
                            curElem = self.target[self.curPage];
                        if (prevElem) Zepto(prevElem).hide();
                        Zepto(curElem).show();
                        /**
                         * @event mo.Tab#change
                         * @property {object} event 切换完成
                         */
                        self.trigger('change', [self.curPage]);

                    }
                });


            });
        })();

        /*===================filePath:[src/main/slide/slide.js]======================*/
        /**
         * @author Brucewan
         * @version 1.0
         * @date 2014-06-18
         * @description 页面切换，图片滑动等全部统一使用mo.Slide
         * @extends mo.Tab
         * @name mo.Slide
         * @requires lib/zepto.js
         * @requires src/base.js
         * @requires src/tab.js
         * @param {boolean}  [config.touchMove=true] 是否允许手指滑动
         * @param {object|string} config.target 目标选项卡片，即供切换的 Elements list (Elements.length >= 2)
         * @param {object|string} [config.controller='ul>li*'] 触发器
         * @param {string} [config.effect='slide'] 指定效果，可选值：'slide', 'push', 'flip'
         * @param {string} [config.direction='x'] 指定方向，仅效果为'slide'时有效
         * @param {boolean}  [config.autoPlay=false] 是否自动播放
         * @param {number}  [config.playTo=0] 默认播放第几个（索引值计数，即0开始的计数方式）
         * @param {string}  [config.type='mouseover'] 事件触发类型
         * @param {string}  [config.currentClass='current'] 当前样式名称, 多tab嵌套时有指定需求
         * @param {boolean}  [config.link=false] tab controller中的链接是否可被点击
         * @param {number}  [config.stay=2000] 自动播放时停留时间
         * @param {number}  [config.disable] 禁止某屏滚动
         * @param {boolean}  [config.loop=false] 是否启用循环滚动
         * @param {number}  [config.delay=150] mouseover触发延迟时间
         * @param {object|string}  [config.prevBtn] 播放前一张，调用prev()
         * @param {object|string}  [config.nextBtn] 插放后一张，调用next()
         * @param {string}  [config.easing='swing'] 动画方式：默认可选(可加载Zepto.easying.js扩充)：'swing', 'linear'
         * @param {object{string:function}}  [config.event] 初始化绑定的事件
         * @param {object{'dataSrc':Element, 'dataProp':String, 'dataWrap':Element, 'delay': Number}}  [config.title] 初始化绑定的事件
         * @param {boolean}  [config.lazy=false] 是否启用按需加载，需要按需加载的元素设置data-src属性
         * @example
         var tab1 = new mo.Slide({
			target: $('#slide01 li')
		});
         * @see slide/demo5.html 默认滚动效果slide
         * @see slide/demo6.html 推动滚动效果push
         * @see slide/demo7.html 3d翻转效果flip
         * @see slide/demo8.html 循环滚动
         * @see slide/demo9.html 锁屏
         * @see slide/demo10.html 嵌套的slide
         * @see slide/demo11.html 按需加载
         * @class
         */
        (function () {

            Motion.add('mo.Slide:mo.Tab', function () {
                /**
                 * public 作用域
                 * @alias mo.Slide#
                 * @ignore
                 */
                var _public = this;

                var _private = {};

                /**
                 * public static作用域
                 * @alias mo.Slide.
                 * @ignore
                 */
                var _static = this.constructor;


                _public.init = function (config) {
                    this.config = Zepto.extend(true, {}, _static.config, config); // 参数接收

                    // 初始化父类
                    this.superClass.call(this, this.config);
                };

                _static.config = {
                    touchMove: true,
                    direction: 'y',
                    effect: 'slide',
                    controller: false
                };

                mo.Tab.extend('slide', {
                    init: function () {
                        var self = this;
                        var config = self.config;

                        // 清除浮动
                        self.wrap.css({
                            'position': 'relative',
                            'overflow': 'hidden'
                        });
                        self.wrap.css('-webkit-backface-visibility', 'hidden');
                        self.target.css({
                            'position': 'absolute',
                            'top': '0',
                            'left': '0',
                            'visibility': 'hidden'
                        });

                        // 设置不同方向不同的操作属性
                        if (config.direction == 'x') {

                            // // 初始化CSS
                            // var wrapWidth = 0;
                            // self.target.each(function(i, elem) {
                            // 	wrapWidth += Zepto(elem)[0].offsetWidth;
                            // });
                            // if (wrapWidth <= 0) {
                            // 	wrapWidth = document.documentElement.offsetWidth * self.target.length;
                            // }

                            // self.wrap.css('width', config.wrapWidth || wrapWidth + 'px');

                            // 设置操作属性
                            self.animProp = 'translateX';
                            self.sizeProp = 'width';
                            self.posProp = ['left', 'right'];
                        } else {
                            self.animProp = 'translateY';
                            self.sizeProp = 'height';
                            self.posProp = ['top', 'bottom'];
                        }
                    },


                    touchmove: function (e, startDis, moveDis) {
                        var self = this;
                        var curObj = self.target.eq(self.curPage);
                        if (self.moving == true) {
                            return;
                        }

                        // 判断是否是锁定屏
                        var locked = false;
                        if ((self.disabledNextList.indexOf(self.curPage) !== -1 && startDis < 0) || (self.disabledPrevList.indexOf(self.curPage) !== -1 && startDis > 0)) {
                            locked = true;
                        }

                        // 获取当前偏移值
                        var currentVal = /\(([\d-]*).*\)/.exec(curObj.css(self.propPrefix + 'Transform'));
                        var currentPos = currentVal ? currentVal[1] * 1 : 0;

                        // 设置当前屏位置
                        var curStyle = {};
                        var offsetDis = currentPos + moveDis;
                        if (locked) {
                            offsetDis = startDis / 6;
                        }
                        curStyle[self.cssPrefix + 'transform'] = self.animProp + '(' + (offsetDis) + 'px)'+' translateZ(0)';
                        self.target.css('visibility', 'hidden');
                        curObj.css(curStyle).css('visibility', 'visible');

                        // 设置下一屏位置
                        var nextObj, nextDis = {}, nextSize;
                        if (startDis > 0) {
                            nextObj = self.target.eq(self._outBound(self.curPage - 1));
                            nextSize = -nextObj[self.sizeProp]();
                        } else {
                            nextObj = self.target.eq(self._outBound(self.curPage + 1));
                            nextSize = curObj[self.sizeProp]();

                        }

                        if (!locked) {
                            self.target.css('visibility', 'hidden');
                            curObj.css('visibility', 'visible');
                            nextObj.css('visibility', 'visible');
                            nextDis[self.cssPrefix + 'transform'] = self.animProp + '(' + (currentPos + moveDis + nextSize) + 'px)'+' translateZ(0)';
                            nextObj.css(nextDis);
                        }

                    },

                    touchend: function (e, dis) {
                        var self = this;
                        var curObj = self.target.eq(self.curPage);


                        // 如果有单屏页面内容过多
                        var rect = self.target[self.curPage].getBoundingClientRect();
                        var winSize = $(window)[self.sizeProp];

                        if (!(self.target.eq(self.curPage).offset()[self.sizeProp] <= self.container.offset()[self.sizeProp])) {
                            if ((dis <= 0 && rect[self.posProp[1]] > winSize) || (dis > 0 && rect[self.posProp[0]] < 0)) {
                                var currentVal = /\(([\d-]*).*\)/.exec(curObj.css(self.propPrefix + 'Transform'));
                                var currentPos = currentVal ? currentVal[1] * 1 : 0;
                                var posObj = {};
                                var pos = currentPos + dis;
                                var size = curObj[self.sizeProp]();
                                var wrapSize = self.wrap[self.sizeProp]();
                                pos = pos > 0 ? 0 : pos;
                                pos = pos < wrapSize - size ? wrapSize - size : pos;
                                // posObj[self.cssPrefix + 'transform'] = self.animProp + '(' + pos + 'px)';
                                posObj[self.cssPrefix + 'transform'] = self.animProp + '(' + pos + 'px)'+' translateZ(0)';
                                curObj.animate(posObj);
                                return false;
                            }
                        }

                        self.touchTrigger = true;
                    },

                    beforechange: function () {
                        var self = this;
                        var config = self.config;
                        var prevIndex = self.prevPage;
                        var curIndex = self.curPage;
                        var prevObj = self.target.eq(prevIndex);
                        var curObj = self.target.eq(curIndex);
                        var prevStartPos = {}, prevEndPos = {}, curStartPos = {}, curEndPos = {};
                        var size;


                        // 位置
                        if (self.oriCurPage > self.oriPrevPage) {
                            size = prevObj[self.sizeProp]();
                        } else {
                            size = -curObj[self.sizeProp]();
                        }


                        curStartPos[self.cssPrefix + 'transform'] = self.animProp + '(' + size + 'px)'+' translateZ(0)';
                        prevEndPos[self.cssPrefix + 'transform'] = self.animProp + '(' + (-size) + 'px)'+' translateZ(0)';
                        curEndPos[self.cssPrefix + 'transform'] = self.animProp + '(0px)'+' translateZ(0)';


                        // 设置初始属
                        if (!self.touchTrigger) {
                            curObj.css(curStartPos);
                            self.touchTrigger = false;
                        }

                        // curObj.css(curStartPos);
                        self.target.css('visibility', 'hidden');
                        prevObj.css('visibility', 'visible');
                        curObj.css('visibility', 'visible');


                            // 设置终点属性
                            prevObj.animate(prevEndPos, config.animateTime, config.easing, function () {
                                // console.log(self.prevPage + ':' + self.curPage);
                                self.target.eq(self.prevPage).css('visibility', 'hidden');
                                // prevObj.css('visibility', 'hidden');
                            });
                            self.moving = true;
                            // console.log(curEndPos)
                            // console.log(self.prevPage + ':' + self.curPage);
                            curObj.animate(curEndPos, config.animateTime, config.easing, function () {
                                curObj.css('visibility', 'visible');
                                self.moving = false;
                                self.trigger('change', [self.curPage]);
                            });

                    }

                });


            });

        })();

    })();
//});
