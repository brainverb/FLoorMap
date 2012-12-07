//全局变量 jquery.imagemapster.js调用
const RADIUS = 25;// flag的半径
var $bindMap;//map image 
var staffid;//當前用戶
var currentFlagPosition = {
		x : 0,
		y : 0
};// flag的中心点位置的百分比   
var currentRate;//当前缩放比例
const ORIWIDTH = 2788;
const ORIHEIGHT = 919;
$(document).ready(function(){
    var myScroll;
    var currentFloor = 1;// 当前楼层
    
    const DEFAULTRATE = 0.5;// 默认比率
    
    var currRadius = RADIUS * DEFAULTRATE;//当前半径
    //缩放比例。
    var scaleRates = [0.5, 0.8, 1];
    const DEFAULTWIDTH = ORIWIDTH * DEFAULTRATE;
    const DEFAULTHEIGHT = ORIHEIGHT * DEFAULTRATE;
    //var mapsData;
    var device;
    var areasArray = [];//areas设置参数数组
    
    
    //保存floor数据数组
    var floorsData = [ {
		floorId : 1,
		image : "/address/images/map/layout/1.jpg"
	}, {
		floorId : 2,
		image : "/address/images/map/layout/2.jpg"
	}, {
		floorId : 3,
		image : "/address/images/map/layout/3.jpg"
	}, {
		floorId : 4,
		image : "/address/images/map/layout/4.jpg"
	}, {
		floorId : 5,
		image : "/address/images/map/layout/5.jpg"
	}, {
		floorId : 6,
		image : "/address/images/map/layout/6.jpg"
	}, {
		floorId : 7,
		image : "/address/images/map/layout/7.jpg"
	}, {
		floorId : 8,
		image : "/address/images/map/layout/8.jpg"
	}, {
		floorId : 9,
		image : "/address/images/map/layout/9.jpg"
	} ];  
    // 设置当前显示的楼层图片
	function setMapImage() {
		$.each(floorsData, function() {
			if (this.floorId == parseInt(currentFloor)) {
				$("#bindImg").attr("src", this.image).css({
					width : DEFAULTWIDTH,
					height : DEFAULTHEIGHT
				}).attr("usemap", "#floors");
				$("#bindImg").css({position:"absolute",left:"0px",top:"0px"});
				$bindMap = $("#bindImg");
				return false;
			}
		});
	}
	//重新定位图片和滚动条
    function scale(){
    	$("#scroller").css({
			width : ORIWIDTH * currentRate,
			height : ORIHEIGHT * currentRate
		});
    	$bindMap.mapster("tooltip");
    	$("#flagDiv").hide();
		$bindMap.mapster('resize', ORIWIDTH * currentRate, ORIHEIGHT
				* currentRate, 1000);
		//重新定位员工的坐标位置 
		if(currentFlagPosition.x != 0 && currentFlagPosition.y != 0){
			setTimeout(function() {
				$bindMap.mapster("setFlagCircle", currentFlagPosition);
			}, 1000);
		}else{
			console.log("coordinate error!");
		}
		myScroll.refresh();// 更新滚动条
    }
  //放大
    $("#zoomIn").click(function(e){
    	if (currentRate == scaleRates[scaleRates.length - 1])
			return;
		$.each(scaleRates, function(index) {
			if (parseFloat(this) === parseFloat(currentRate)) {
				currentRate = scaleRates[index + 1];
				$("#slider").slider("value", (index+1) * 15);
				return false;
			}
		});
		scale();
    });
    
    //缩小
    $("#zoomOut").click(function(e){
    	if (currentRate == scaleRates[0]) 
			return;

		for ( var i = 0; i < scaleRates.length; i++) {
			if (currentRate === scaleRates[i]) {
				currentRate = scaleRates[i - 1];
				$("#slider").slider("value", (i-1) * 15);
				break;
			}
		}
		scale();
    });
    var mapsterObj = {
        noHrefIsMask: false,//area的href不存在或是nohref则使用遮罩，不监听mouseover等事件
        fadeInterval: 50,//渐变区间
        mapKey: "staffid",//标识参数
        mapValue: 'staffid',//标识值
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
    function init(){
    	var url = window.location.href;
    	staffid = $.trim(url.substring(url.indexOf("=")+1,url.length));
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
				var $slider = $("#slider");
            	if(slideVal < ui.value){
            		if(ui.value > 15 ){
            			$slider.slider("value", 30);
            			currentRate = scaleRates[2];
            		}else{
            			$slider.slider("value", 15);
            			currentRate = scaleRates[1];
            		}
            	}else{
            		if(ui.value > 15 ){
            			$slider.slider("value", 15);
            			currentRate = scaleRates[1];
            		}else{
            			$slider.slider("value", 0);
            			currentRate = scaleRates[0];
            		}
            	}
                scale();
            }
        });
        currentRate = DEFAULTRATE;
        getDataFromServer();
        device = checkBrowser();
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
    	$bindMap.css({width:DEFAULTWIDTH,height:DEFAULTHEIGHT});
    	$("#scroller").css({
            width: DEFAULTWIDTH,
            height: DEFAULTHEIGHT
        });
        if(device != "pc"){
        	$("#wrapper").width(document.body.clientWidth).height(document.body.clientHeight);
        }
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
        $bindMap.mapster(mapsterObj);
        if($bindMap.mapster("state")){
        	//初始化用户坐标位置 以下代码必须放在初始化地图之后执行。否则可能报错。
			if( currentFlagPosition.x != 0 && currentFlagPosition.y != 0){
				$bindMap.mapster("setFlagCircle",currentFlagPosition);
				if(staffid != "" && staffid != null){
					$bindMap.mapster('tooltip', String(staffid));//显示tooltip
					currentStaffId = String(staffid);
					var x = currentFlagPosition.x * DEFAULTWIDTH;
					if(x > $("#wrapper").width()){
						myScroll.scrollTo(-(x - $("#wrapper").width()*0.5),0,1000);
					}
				}else{
					console.log("no staffid");
				}
			}else{
				console.log("no coordinate value!");
			}
		}else{
			console.log("init again!");
			initMapster();
		}
    }
    //清除mapdata，image。
    function clearMapData(){
        $bindMap.mapster("unbind");
        areasArray = null;
        $("#floors_Map").empty();
    }
  //从EDB拿到员工数据
    function getDataFromServer(){
    	var url = "/address/getTheSameFloorUsers.action?staffID=" + staffid;
//		$.getJSON(url,function(data){
//			createAreaElement(data.userList);
//			console.log(data);
//		}).error(function(e){
//			console.log("error to get user data!" + e.message);
//		});
		$.ajax({
			  url: url,
			  dataType: 'json',
			  success: function(data){
				  	if(data.theSameFloorUsers != null){
				  		createAreaElement(data.theSameFloorUsers);
				  	}else{
				  		console.log("return null data!");
				  	}
				},
			  error:function(e){
					alert("當前員工沒有位置信息!");
				}
		});
    }
 // 创建HTML上的MAP和AREA元素并初始化插件
	function createAreaElement(areaData) {
		var tempArray = [];
		var toolTipDiv;
		var areaObj;// area设置参数
		var area;// html area 元素
		var docFrag = document.createDocumentFragment();
		var tipstr;
		var fullName;
		var coordsObj;
		var coordsStr;
		// 创建map元素标签
		$.each(areaData, function(i) {
			var user = this;
			area = document.createElement("area");
			area.setAttribute("shape", "circle");
			area.setAttribute("staffid", user.staffID);
			area.setAttribute("href", "#");
			coordsObj = JSON.parse(user.coordinate);
			//第一個員工為當前員工
			if(i == 0){
				currentFlagPosition = coordsObj;
				currentFloor = user.location;
				$("#floors_Map").attr("floor", currentFloor);
			    setMapImage();
			    initDefaultSize();
		        //电脑才用iscroll。ipad和手机不需要。移动设备采用手势会自动缩放和滚动
		        if (device == "pc") {
		            initScroll();
		        }
		        else { //移动设备不显示楼层和缩放按钮
		        	$("#previewDiv").hide();
		        	$("#zoomDiv").hide();
		        }
			}
			coordsStr = parseInt(coordsObj.x * ORIWIDTH) + "," + parseInt(coordsObj.y * ORIHEIGHT) + "," + RADIUS;
			area.setAttribute("coords", coordsStr);
			docFrag.appendChild(area);
			tipstr = "<div class='staffinfo'>"
				+ '<b>組別：</b>' + user.team + '<br />'
				+'<b>員工編號：</b>' + user.staffID +'<br />'
				+'<b>英文名字：</b>' + user.lastName+', '+ user.middleName+' '+ user.firstName+'<br />'    
				+'<b>中文名字：</b> ' + user.chineseName+'<br />'    
				+'<b>別名：</b>' + user.nickName + ' <br />'  
				+'<b>職位：</b>' + user.title + '  <br /> '
				+'<b>直線：</b>' + user.directNumber + '  <br />'  
				+'<b>內線：</b>' + user.extension+ '   <br />'  
				+'<b>手提電話：</b>' + user.mobile + ' <br />'    
				+'<b>公司電郵：</b>' + user.email + '<br />'
				+ "</div>";
			if(this.icon.indexOf("http://") == -1){
				this.icon = "images/map/default.png";
			}
			toolTipDiv = "<img src=\"" + user.icon
					+ "\" class=\"headImg\"/>" + tipstr;
			// area设置参数 key值必须是string类型。否则取不到mapsterObj.areas
			areaObj = {
				key : String(this.staffID),
				stroke : true,
				selected : false,
				isSelectable : false,
				toolTip :$(toolTipDiv)
			};
			tempArray.push(areaObj);
		});
		areasArray = tempArray;
		$("#floors_Map").append(docFrag);
		$.each(mapsterObj.areas, function() {
			$.each(this, function() {
				this.key = null;
				this.toolTip = null;
			});
		});
		mapsterObj.areas = areasArray;				
		tempArray = null;
		areaObj = null;
		area = null;
		toolTipDiv = null;
		coordsStr = null;
		coordsObj = null;
		//初始化地图
		initMapster();
	}
	init();
//    function setBuildingImg(){
//        //设置楼层图片
//        var imagePath = "images/map/F" + currentFloor + ".png";
//        $("#buildImg").attr("src", imagePath);
//    }
    
    //查找员工。
//    $("#searchBtn").click(function(){
//    	//尚未初始化完mapster。不允许点击
//        if (!$bindMap.mapster('state')) {
//            console.log("尚未初始化");
//            return;
//        }
//        var staffName = $.trim($("#staffName").val()).toLowerCase();
//        if (staffName == "") 
//            return;
//        var result = false;
//        $.each(mapsData, function(){
//            var mapData = this;
//            var areas = mapData.area;
//            if (areas) {
//                $.each(areas, function(index){
//                    if (this.name == staffName) {
//                        result = true;
//                        if (currentFloor == parseInt(mapData.floor)) {//在当前楼层
//                            displayStaff(this.name);
//                        }
//                        else { //获取所在楼层数据并定位
//                            clearMapData();
//                            currentFloor = mapData.floor;
//                            setMapImage(currentFloor);
//                            //更新table的楼层
//                            setBuildingImg();
//                            $("#floors_Map").attr("floor", currentFloor);
//                            createAreaElement(mapData.area);
//                            if ($bindMap.mapster('data', staffName).areas != undefined) {
//                                displayStaff(this.name, mapData.area);
//                            }
//                            else {
//                                setTimeout(function(){
//                                    displayStaff(staffName, mapData.area);
//                                }, 1000);
//                            }
//                        }
//                        return false;
//                    }
//                })
//            }
//        });
//        if (!result) 
//            alert("不存在该员工或尚未登记!");
//    });
    //显示员工信息
//    function displayStaff(staffName, areaData){
//        currentScaleType = 0;
//        scale(currentScaleType);
//        if ($bindMap.mapster('data', staffName).areas == undefined) {
//            alert("尚未初始化地图数据，请重新点击查询按钮查询");
//            return;
//        }
//        //获取当前员工的area的坐标数组
//        var positions = $bindMap.mapster('data', staffName).areas[0].area.coords.split(",");
//        //延迟滚动并定位。若不延迟可能因为resize尚未完成导致定位不准确或没有定位。
//        setTimeout(function(){
//            //滚动到当前员工的位置	
//            if (myScroll) {
//                var scrollLeft = -(parseFloat(positions[0]) - $("#wrapper").width() * 0.5);
//                if (Math.abs(scrollLeft) > $("#scroller").width()) {
//                    myScroll.scrollTo(scrollLeft, -(parseFloat(positions[1]) - $("#wrapper").height() * 0.5), 1000);
//                }
//            }
//            else {
//                //设置滚动条位置
//                var scrollLeft = parseFloat(positions[0]) - document.body.clientWidth * 0.5 + $("#toolTipDiv").width();
//                if (scrollLeft > 0) 
//                    $(document).scrollLeft(scrollLeft);
//            }
//            setTimeout(function(){
//                $bindMap.mapster('set', true, staffName);//添加选中样式和flag。
//                $bindMap.mapster('tooltip', staffName);//显示tooltip
//            }, 500);
//        }, 1000);
//    };
    //选择楼层 不显示 楼层的图片
    //$("#building").bind("click", changeFloor);
    
//    function changeFloor(e){
//    	if (currentFloor == parseInt($(e.target).attr("floor"))) {
//			return;
//		}
//		if ($bindMap.mapster("state")) {
//			clearMapData();
//		}
//		currentFloor = $(e.target).attr("floor");
//		var imagePath = "images/map/F" + currentFloor + ".png";
//		$("#buildImg").attr("src", imagePath);
//		setMapImage(currentFloor);
//		$("#floors_Map").attr("floor", currentFloor);
//		var tempRate = currentRate;
//		// 更新地图
//		currentRate = DEFAULTRATE;
//		getDataFromServer();
//		initFlag();
//		$.each(scaleRates, function(index) {
//			if (parseFloat(this) === DEFAULTRATE) {
//				$("#slider").slider("value", index);
//				return false;
//			}
//		});
//		initScroll();
//    }
    //更新滚动条
//    function refreshScroll(){
//        //        if ($bindMap.mapster('state') == null) 
//        //            return;
//        $.each(scaleOptions, function(){
//            if (currentScaleType == parseInt(this.level)) {
//            	$("#scroller").css({
//                    width: this.width,
//                    height: this.height
//                });
//                myScroll.refresh();//更新滚动条
//                return false;
//            }
//        });
//    }
    //没啥用。
//    $(document).live("gestureend", function(e){
//        e.stopPropagation();
//        var orig = e.originalEvent;
//        orig.stopPropagation();
//    });
    
});
