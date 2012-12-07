var myScroll;
var currentFloor = 2;//当前楼层
const RADIUS = 40;//flag的半径
var defaultRate = 0.5;//默认比率
var currentRate;
var dataPath = "data/floor.xml";
//缩放比例。
var scaleRates = [0.5, 0.8, 1];
const ORIWIDTH = 2795;
const ORIHEIGHT = 1000;
//地图默认宽高。默认全部展示
var defaultWidth = ORIWIDTH * defaultRate;
var defaultHeight = ORIHEIGHT * defaultRate;
var $bindMap;
var mapsData;//json格式的maps数据
var areasArray = [];//areas设置参数数组
var scrollX = -300;
//需要显示的卡片信息。按照这里的排列顺序显示
var displayOptions = ["dept", "group", "staffid", "englishname", "step", "outtel", "innertel", "mobile", "email", "name"]
//当前flag所在坐标相对于地图原图的百分比
var currentFlagPosition = {
    x: 0,
    y: 0
};//flag的中心点位置的百分比
$(document).ready(function($){
    //保存floor数据数组
    var floorsData = [{
        floorId: 1,
        image: "images/layout/1.jpg"
    }, {
        floorId: 2,
        image: "images/layout/2.jpg"
    }, {
        floorId: 3,
        image: "images/layout/3.jpg"
    }, {
        floorId: 4,
        image: "images/layout/4.jpg"
    }, {
        floorId: 5,
        image: "images/layout/5.jpg"
    }, {
        floorId: 6,
        image: "images/layout/6.jpg"
    }, {
        floorId: 7,
        image: "images/layout/7.jpg"
    }, {
        floorId: 8,
        image: "images/layout/8.jpg"
    }, {
        floorId: 9,
        image: "images/layout/9.jpg"
    }];
    
    //设置当前显示的楼层图片
    function setMapImage(floor){
        $.each(floorsData, function(){
            if (this.floorId == parseInt(floor)) {
                $("#bindImg").attr("src", this.image).css({
                    width: ORIWIDTH * currentRate,
                    height: ORIHEIGHT * currentRate
                }).attr("usemap", "#floors");
                $bindMap = $("#bindImg");
                return false;
            }
        });
    }
    //缩放
    function scale(){
        var preImgWidth = $bindMap.width();
        $("#bindScroller").css({
            width: ORIWIDTH * currentRate,
            height: ORIHEIGHT * currentRate
        });
        $bindMap.mapster("tooltip");
        $("#flagDiv").hide();
        $bindMap.mapster('resize', ORIWIDTH * currentRate, ORIHEIGHT * currentRate, 1000);
        setTimeout(function(){
            $bindMap.mapster("setFlagCircle", currentFlagPosition);
        }, 1000);
        
        myScroll.refresh();//更新滚动条
    }
    //放大
    $("#zoomIn").bind("click", function(e){
        if (currentRate == scaleRates[scaleRates.length - 1]) 
            return;
        $.each(scaleRates, function(index){
            if (parseFloat(this) === parseFloat(currentRate)) {
                currentRate = scaleRates[index + 1];
                $("#slider").slider("value", index + 1);
                return false;
            }
        });
        scale();
    });
    //缩小
    $("#zoomOut").bind("click", function(e){
        if (currentRate == scaleRates[0]) //$("#bindImg").width()取得的是整数没带小数。
            return;
        
        for (var i = 0; i < scaleRates.length; i++) {
            if (currentRate === scaleRates[i]) {
                currentRate = scaleRates[i - 1];
                $("#slider").slider("value", i - 1);
                break;
            }
        }
        scale();
    });
    //选择楼层
    $("#building").bind("click", function(e){
        if (currentFloor == parseInt($(e.target).attr("floor"))) {
            return;
        }
        if ($bindMap.mapster("state")) {
            clearMapData();
        }
        currentFloor = $(e.target).attr("floor");
        if ($("#location") != undefined) {
            //设置父页面的input
            $("#location").attr("value", currentFloor);
            $("#coordinate").attr("value", "");
        }
        var imagePath = "images/F" + currentFloor + ".png";
        $("#buildImg").attr("src", imagePath);
        setMapImage(currentFloor);
        $("#floors_Map").attr("floor", currentFloor);
        var tempRate = currentRate;
        //更新地图
        currentRate = defaultRate;
        getDataFromParent();
        //是否初始化员工的coordinator信息。
        if (mapsData != null) {
            $.each(mapsData, function(){
                var mapData = this;
                if (parseInt(mapData.floor) == currentFloor) {
                    if (mapData.area) {
                        createAreaElement(mapData.area);
                    }
                    return false;
                }
            });
        }
        initMapster();//初始化插件
        initScroll();
        initFlag();
        $.each(scaleRates, function(index){
            if (parseFloat(this) === defaultRate) {
                $("#slider").slider("value", index);
                return false;
            }
        });
    });
    //重置flag的位置和大小
    function initFlag(){
        currentFlagPosition.x = 0;
        currentFlagPosition.y = 0;
        $("#flagDiv").css({
            width: 30,
            height: 48,
            left: 0,
            top: 50,
            position: "absolute",
            "z-index": 99
        }).show();
        $("#flagImg").css({
            width: 30,
            height: 48
        });
    }
    //存在mapdata但是双击位置不在mapdata的位置上。因此要监听图片的位置
    $("#bindImg").bind("dblclick", function(e){
        if ($bindMap.mapster("state")) {
            var pointX = e.clientX + $(document).scrollLeft() - $(e.target).offset().left - myScroll.x;
            var pointY = e.clientY + $(document).scrollTop() - $(e.target).offset().top - myScroll.y;
            currentFlagPosition.x = pointX / $bindMap.width();
            currentFlagPosition.y = pointY / $bindMap.height();
            var coords = JSON.stringify(currentFlagPosition);
            if ($("#coordinate") != undefined) {
                //设置父页面的input
                $("#coordinate").attr("value", coords);
            }
            $("#flagDiv").css({
                left: pointX - $("#flagDiv").width() * 0.5,
                top: pointY - $("#flagDiv").height()
            }).show();
            $bindMap.mapster("setFlagCircle", currentFlagPosition);
        }
    });
    function init(floor){
    	$("#loading").show();
    	$("#bindWrapper").hide();
    	var slideVal;
        //初始化滑动条
        $("#slider").slider({
            value: 0,
            orientation: "horizontal",
            range: "max",
            min: 0,
            max: 30,
            step: 1,
            start:function(event,ui){
            	slideVal = ui.value;
            },
            stop: function(event, ui){
            	if(slideVal < ui.value){
            		if(ui.value > 15 ){
            			$("#slider").slider("value", 30);
            			currentRate = scaleRates[2];
            		}else{
            			$("#slider").slider("value", 15);
            			currentRate = scaleRates[1];
            		}
            	}else{
            		if(ui.value > 15 ){
            			$("#slider").slider("value", 15);
            			currentRate = scaleRates[1];
            		}else{
            			$("#slider").slider("value", 0);
            			currentRate = scaleRates[0];
            		}
            	}
                scale();
            }
        });
        currentRate = defaultRate;
        currentFloor = floor;
        setMapImage(currentFloor);
        initScroll();
        parseMapData(dataPath);
        
    }
    //初始化iscroll滚动条
    function initScroll(){
        $("#bindScroller").css({
            width: ORIWIDTH * currentRate,
            height: ORIHEIGHT * currentRate
        });
        $("#bindLi").css({
            width: ORIWIDTH * currentRate,
            height: ORIHEIGHT * currentRate
        });
        $bindMap.css({
            width: ORIWIDTH * currentRate,
            height: ORIHEIGHT * currentRate
        });
        if (!myScroll) {
            myScroll = new iScroll('bindWrapper', {
                snap: false,
                momentum: true
            });
        }
        else {
            myScroll.refresh();
        }
        myScroll.scrollTo(scrollX,0,1000);
        setTimeout(function(){
        	$("#loading").hide();
            $("#bindWrapper").show();
        },2000);
    }
    //从JSP父窗口获取数据
    function getDataFromParent(data){
        if (data != null) {
            $.each(data, function(){
                if (parseInt(this.floor) == currentFloor) {
                    $("#floors_Map").attr("floor", this.floor);
                    createAreaElement(this.area);
                    return false;
                }
            });
        }
    }
    //解析XML文件
    function parseMapData(xml){
        $.get(xml, "", function(data){
            //xml转换成json的map数据
            mapsData = $.xml2json(data).map;
            //保存到本地存储
            var str = JSON.stringify(mapsData);//json格式转换成str
            $.each(mapsData, function(){
                if (parseInt(this.floor) == currentFloor) {
                    $("#floors_Map").attr("floor", this.floor);
                    createAreaElement(this.area);
                    return false;
                }
            });
            initMapster();
        }, "xml");
    }
    var mapsterObj = {
        noHrefIsMask: false,//area的href不存在或是nohref则使用遮罩，不监听mouseover等事件
        fadeInterval: 50,//渐变区间
        mapKey: "name",//标识参数
        mapValue: 'name',//标识值
        strokeWidth: 2,//边框宽度
        highlight: true,//选择时是否显示区域高亮
        stroke: true,//是否显示边框
        strokeColor: 'F88017',//边框颜色
        showToolTip: true,//显示提示框。
        toolTipClose: ["area-mouseout"],//关闭提示的事件 area-mouseout
        isSelectable: false,//是否可选
        singleSelect: true,//是否只能高亮最后一个选择area而不高亮其它的
        mapScale: true,//允许初始化的时候就缩放。在image的style属性设置width:XXpx。注意不要设置height。否则会因为比例不正确无效。
        render_select: { //选中的样式
            fillColor: 'ff0000',//默认背景色和透明度
            fillOpacity: 0.2,
            stroke: true
        },
        render_highlight: {
            fillColor: '2aff00',
            stroke: true
        },
        areas: areasArray
    };
    //创建HTML上的MAP和AREA元素并初始化插件
    function createAreaElement(areaData){
        var tempArray = [];
        var toolTipDiv;
        var areaObj;//area设置参数
        var area;//html area 元素
        var docFrag = document.createDocumentFragment();
        var tipStr;
        var coordsArr;
        var rate = currentRate;
        var newCoords;
        //创建map元素标签
        $.each(areaData, function(){
            newCoords = "";
            area = document.createElement("area");
            area.setAttribute("shape", this.shape);
            area.setAttribute("dept", this.dept);
            area.setAttribute("name", this.name);
            //将coords字符串切割成数组
            coordsArr = this.coords.split(",");
            $.each(coordsArr, function(){
                newCoords += Math.round(parseInt(this) * rate) + ",";
            });
            newCoords = newCoords.substr(0, newCoords.length - 1);
            area.setAttribute("coords", newCoords);
            area.setAttribute("href", this.href);
            docFrag.appendChild(area);
            tipstr = "<div class='staffinfo'>";
            for (var p in this) {
                if (p == "shape" || p == "coords" || p == "href" || p == "head") 
                    continue;
                var info = this;
                $.each(displayOptions, function(){
                    if (p == this) {
                        tipstr += this + ":" + info[p] + "<br />";
                    }
                });
            }
            tipstr += "</div>";
            toolTipDiv = "<img src=\"" + this.head + "\" class=\"headImg\"/>" + tipstr;
            //area设置参数
            areaObj = {
                key: this.name,
                stroke: true,
                selected: false,
                isSelectable: false,
                toolTip: $(toolTipDiv)
            }
            tempArray.push(areaObj);
        });
        areasArray = tempArray;
        $("#floors_Map").append(docFrag);
        $.each(mapsterObj.areas, function(){
            $.each(this, function(){
                this.key = null;
                this.toolTip = null;
            });
        });
        mapsterObj.areas = null;
        mapsterObj.areas = areasArray;
        tempArray = null;
        areaObj = null;
        area = null;
        toolTipDiv = null;
    }
    //初始化图片插件
    function initMapster(){
        $.mapster.impl.init();
        $bindMap.mapster(mapsterObj);
    }
    //清除mapdata，image。
    function clearMapData(){
        $bindMap.mapster("unbind");
        areasArray = null;
        $("#floors_Map").empty();
    }
    $("#flagImg").bind("mouseover",function(e){
    	var relatedTarget = e.relatedTarget;
    	if(relatedTarget.nodeName.toLowerCase() == "area"){
    		$bindMap.mapster("tooltip",relatedTarget.attributes["name"].value);
    	}else{
    		console.log("not area");
    	}
    });
    init(currentFloor);
});
