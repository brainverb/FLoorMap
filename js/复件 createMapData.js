$(document).ready(function(){
    var myScroll;
    var device;
    var areasArray = [];//areas设置参数数组
    //var gestureScale;
    //地图默认宽高。默认全部展示
    var defaultWidth = 1397;
    var defaultHeight = 500;
    var $map;//map image 
    var mapsData;//json格式的maps数据
    var currentFloor = 2;//当前楼层
    var dataPath = "data/floor.xml";
    var oriWidth = 2795;
    var oriHeight = 1000;
    //缩放比例。
    var scaleRates = [0.5, 0.8, 1];
    var defaultLevel = 0;
    //缩放比例，0 默认全部显示，1，显示卡片，2，原图显示
    var scaleOptions = [{
        level: 0,
        width: 1397,
        height: 500
    }, {
        level: 1,
        width: 2236,
        height: 800
    }, {
        level: 2,
        width: 2795,
        height: 1000
    }];
    var currentScaleType = 0;//当前缩放比例类型
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
    //需要显示的卡片信息。按照这里的排列顺序显示
    var displayOptions = ["dept", "group", "staffid", "englishname", "step", "outtel", "innertel", "mobile", "email", "name"]
    //总楼层数
    var totalFloor = floorsData.length;
    var $flag = $('<img src="images/flag.jpg" class="flagImg"/>');
    
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
    //入口函数
    function init(floor){
        //初始化滑动条
        $("#slider").slider({
            value: 0,
            orientation: "horizontal",
            range: "max",
            min: 0,
            max: 2,
            step: 1,
            slide: function(event, ui){
                $.each(scaleRates, function(i){
                    if (i == ui.value) {
                        currentScaleType = i;
                        return false;
                    }
                });
                resizeMap();
            }
        });
        //parseMapData(dataPath);//本地数据
        getDataFromParent(5);//服务器数据
        setMapImage(floor);
        setBuildingImg();
        device = checkBrowser();
        initDefaultSize();
        //电脑才用iscroll。ipad和手机不需要。移动设备采用手势会自动缩放和滚动
        if (device == "pc") {
            initScroll();
        }
        else { //移动设备不显示楼层和缩放按钮
            $("#floorTxt").show();
            $("#floorTxt").text("您当前在第" + currentFloor + "层");
            $("#previewDiv").hide();
            $("#zoomDiv").hide();
        }
    }
    //获取设备类型
    function checkBrowser(){
        var b = navigator.userAgent.toLowerCase();
        if (b.indexOf("ipad") >= 0) 
            return "ipad";
        if (b.indexOf("iphone") >= 0 || b.indexOf("ipod") >= 0 || b.indexOf("android") >= 0) 
            return "mobile";
        return "pc";
    }
    //初始化默认大小
    function initDefaultSize(){
        $.each(scaleOptions, function(){
            if (this.level == defaultLevel) { //默认0的大小
                currentScaleType = this.level;
                $map.width(this.width).height(this.height);
                $("#scroller").css({
                    width: this.width,
                    height: this.height
                });
            }
        })
    }
    //初始化iscroll滚动条
    function initScroll(){
        myScroll = new iScroll('wrapper', {
            snap: false,
            momentum: true
        });
    }
    //初始化图片插件
    function initMapster(){
        $.mapster.impl.init();
        $map.mapster(mapsterObj);
    }
    //清除mapdata，image。
    function clearMapData(){
        $map.mapster("unbind");
        areasArray = null;
        $("#floors_Map").empty();
    }
 // 从JSP父窗口获取数据
	function getDataFromParent(floor) {
		var url =  "http://localhost:8080/usermanager/useradmin/map_getUserByFloor.action?floor=" + floor;
		$.getJSON(url,function(data){
			createAreaElement(data.userList);
			//初始化地图
			initMapster();
		}).error(function(){
			console.log("error to get userlist!");
		});
	}
    //解析XML文件
    function parseMapData(xml){
        $.get(xml, "", function(data){
            //xml转换成json的map数据
            mapsData = $.xml2json(data).map;
            //保存到本地存储
            var str = JSON.stringify(mapsData);//json格式转换成str
            localStorage.setItem("MAPSDATA", str);//存储地图数据
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
    //从EDB拿到员工数据
    function getDataFromEDB(){
    
    }
    //创建HTML上的MAP和AREA元素并初始化插件
    function createAreaElement(areaData){
        var tempArray = [];
        var toolTipDiv;
        var areaObj;//area设置参数
        var area;//html area 元素
        var docFrag = document.createDocumentFragment();
        var tipStr;
        var coordsArr;
        var rate = defaultWidth / oriWidth;
        var newCoords;
        //创建map元素标签
        $.each(areaData, function(){
            newCoords = "";
            area = document.createElement("area");
            area.setAttribute("shape", "rect");
            area.setAttribute("name", this.name);
            //将coords字符串切割成数组
            coordsArr = this.coords.split(",");
            $.each(coordsArr, function(){
                newCoords += Math.round(parseInt(this) * rate) + ",";
            });
            newCoords = newCoords.substr(0, newCoords.length - 1);
            area.setAttribute("coords", newCoords);
            area.setAttribute("href", "#");//必须有这个属性。否则不会显示tooltip
            docFrag.appendChild(area);
            tipstr = "<div class='staffinfo'>";
            for (var p in this) {
                if (p == "shape" || p == "coords" || p == "staffid") 
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
    //设置当前显示的楼层图片
    function setMapImage(floor){
        $.each(floorsData, function(){
            if (this.floorId == parseInt(floor)) {
                $("#mapImg").attr("src", this.image).css({
                    width: defaultWidth,
                    height: defaultHeight
                }).attr("usemap", "#floors").attr("id", "mapImg");
                $map = $("#mapImg");
                return false;
            }
        });
    }
    function setBuildingImg(){
        //设置楼层图片
        var imagePath = "images/F" + currentFloor + ".png";
        $("#buildImg").attr("src", imagePath);
    }
    //放大
    $("#zoomIn").click(function(e){
        if (currentScaleType == scaleOptions.length - 1) {
            return;
        }
		//尚未初始化完mapster。不允许点击
        if (!$map.mapster('state')) {
            return;
        }
        currentScaleType++;
        resizeMap();
    });
    //重新定位图片和滚动条
    function resizeMap(){
        $.each(scaleOptions, function(){
            if (this.level == currentScaleType) {
                $map.mapster("tooltip");
                $map.mapster('resize', this.width, this.height, 1000);
                if (myScroll) {
                    refreshScroll();
                }
                $("#slider").slider("value", this.level);
                return false;
            }
        });
    }
    //缩小
    $("#zoomOut").click(function(e){
		if (currentScaleType == 0) {
            return;
        }
        //尚未初始化完mapster。不允许点击
        if (!$map.mapster('state')) {
            return;
        }
        currentScaleType--;
        resizeMap();
    });
    //查找员工。
    $("#searchBtn").click(function(){
        //尚未初始化完mapster。不允许点击
        if (!$map.mapster('state')) {
            console.log("尚未初始化");
            return;
        }
        var staffName = $.trim($("#staffName").val()).toLowerCase();
        if (staffName == "") 
            return;
        var result = false;
        $.each(mapsData, function(){
            var mapData = this;
            var areas = mapData.area;
            if (areas) {
                $.each(areas, function(index){
                    if (this.name == staffName) {
                        result = true;
                        if (currentFloor == parseInt(mapData.floor)) {//在当前楼层
                            displayStaff(this.name);
                        }
                        else { //获取所在楼层数据并定位
                            clearMapData();
                            currentFloor = mapData.floor;
                            setMapImage(currentFloor);
                            //更新table的楼层
                            setBuildingImg();
                            $("#floors_Map").attr("floor", currentFloor);
                            createAreaElement(mapData.area);
                            initMapster();
                            if ($map.mapster('data', staffName).areas != undefined) {
                                displayStaff(this.name, mapData.area);
                            }
                            else {
                                setTimeout(function(){
                                    displayStaff(staffName, mapData.area);
                                }, 1000);
                            }
                        }
                        if(device != "pc")
                        	$("#floorTxt").text("您当前在第" + currentFloor + "层").show();
                        return false;
                    }
                })
            }
        });
        if (!result) 
            alert("不存在该员工或尚未登记!");
    });
    //显示员工信息
    function displayStaff(staffName, areaData){
        currentScaleType = 0;
        resizeMap(currentScaleType);
        if ($map.mapster('data', staffName).areas == undefined) {
            alert("尚未初始化地图数据，请重新点击查询按钮查询");
            return;
        }
        //获取当前员工的area的坐标数组
        var positions = $map.mapster('data', staffName).areas[0].area.coords.split(",");
        //延迟滚动并定位。若不延迟可能因为resize尚未完成导致定位不准确或没有定位。
        setTimeout(function(){
            //滚动到当前员工的位置	
            if (myScroll) {
                var scrollLeft = -(parseFloat(positions[0]) - $("#wrapper").width() * 0.5);
                if (Math.abs(scrollLeft) > $("#scroller").width()) {
                    myScroll.scrollTo(scrollLeft, -(parseFloat(positions[1]) - $("#wrapper").height() * 0.5), 1000);
                }
            }
            else {
                //设置滚动条位置
                var scrollLeft = parseFloat(positions[0]) - document.body.clientWidth * 0.5 + $("#toolTipDiv").width();
                if (scrollLeft > 0) 
                    $(document).scrollLeft(scrollLeft);
            }
            setTimeout(function(){
                $map.mapster('set', true, staffName);//添加选中样式和flag。
                $map.mapster('tooltip', staffName);//显示tooltip
            }, 500);
        }, 1000);
    };
    //选择楼层
    $("#building").bind("click", changeFloor);
    
    function changeFloor(e){
        if (currentFloor == parseInt($(e.target).attr("floor"))) {
            return;
        }
        currentFloor = $(e.target).attr("floor");
        if (device != "pc") {
            $("#floorTxt").text("您当前在第" + currentFloor + "层");
        }
        setMapImage(currentFloor);		
        setBuildingImg();
        $("#floors_Map").attr("floor", currentFloor);
		
        //恢复滑动块位置
        $.each(scaleRates, function(index){
            if (defaultLevel == index) {
                $("#slider").slider("value", index);
                return false;
            }
        });
        clearMapData();
        if (mapsData) {
            //若所在的楼层尚未初始化员工的area信息，则mapsData不保存信息则不会再页面上生成area元素并无法缩放地图。
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
		initMapster();
        //更新地图
        currentScaleType = 0;
        refreshScroll();
    }
    //更新滚动条
    function refreshScroll(){
        $.each(scaleOptions, function(){
            if (currentScaleType == parseInt(this.level)) {
                $("#scroller").css({
                    width: this.width,
                    height: this.height
                });
                myScroll.refresh();//更新滚动条
                return false;
            }
        });
    }
    //没啥用。
    $(document).live("gestureend", function(e){
        e.stopPropagation();
        var orig = e.originalEvent;
        orig.stopPropagation();
    });
    init(currentFloor);
});
