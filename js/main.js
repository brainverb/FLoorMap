var myScroll;
$(document).ready(function(){
    loaded();
    
	//var $flag =  $('<div style="margin:0;left:50"><img src="images/flag.jpg" class="flagImg"/></div>'); 
//    $map.mapster({
//        noHrefIsMask: false,
//        fillColor: '0a7a0a',//滑动时显示的颜色。绿色
//        fillOpacity: 0.5,
//        fadeInterval: 50,//渐变区间
//        mapKey: "name",//标识参数
//        mapValue: 'name',//标识值
//        strokeWidth: 2,//边框宽度
//        stroke: true,//是否显示边框
//        strokeColor: 'F88017',//边框颜色
//        showToolTip: true,//显示提示框。
//        showFlag:true,
//        toolTipClose: ["area-mouseout"],//关闭提示的事件 area-mouseout
//        flagClose: ["area-click"],
//		listKey: 'name',//热点选择的key类型
//        listSelectedAttribute: 'checked',//选择的属性
//        sortList: "asc",//列表排序方式
//        isSelectable: true,//是否可选
//        singleSelect: false,//是否只能高亮最后一个选择area而不高亮其它的
//        onGetList: addCheckBoxes,//生成checkbox列表
//        //set_options:{ singleSelect: state },//是否只允许一个高亮。
//        set_bound: true,
//        mapScale: true,//允许初始化的时候就缩放。在image的style属性设置width:XXpx。注意不要设置height。否则会因为比例不正确无效。
//        onClick: function(e){ //点击list选择框事件
//            styleCheckbox(e.selected, e.listTarget);
//            //            if (!utils.isScrolledIntoView(e.listTarget, false, $statelist)) {
//            //                utils.centerOn($statelist, e.listTarget);//让checkbox的滚动条滚动到当前指定位置。
//            //            }
//        },
//        render_select: { //选中的样式
//            fillColor: 'ff0000',//默认背景色和透明度
//            fillOpacity: 0.2,
//            stroke: false
//        },
//        render_highlight: {
//            fillColor: '2aff00',
//            stroke: true
//        },
//        areas: [{
//            key: 'ccx',
//            stroke: false,
//			selected:true,
//			isSelectable:true,
//			flag:$flag,
//            toolTip: $('<div style="margin:0;left:50"><img src="images/ccx.jpg" class="headImg"/></div><div style="clear:both;"></div><p>ccx<br/> 部门主管 .<br/>tel:110</p>')
//        }, {
//            key: 'sky',
//            stroke: true,
//			isSelectable:true,
//            fillColorMask: 'ff0000',//遮罩颜色。isMask为true才生效
//            toolTip: $('<div style="margin:0;left:50"><img src="images/sky.jpg" class="headImg"/></div><div style="clear:both;"></div><p>sky <br/>项目经理 .<br/>tel:152</p>'),
//			flag:$flag
//        }, {
//            key: "david",
//            fillColor: '0000ff',//填充颜色
//            isSelectable: true,//是否可以选中。只有为true，selected参数才有效
//            toolTip: $('<div style="margin:0;left:50"><img src="images/head.jpg" class="headImg"/></div><div style="clear:both;"></div><p>DAVID<br/> 程序员 .<br/>tel:18925117805</p>'),
//            selected: true, //设置为true，则会有默认红色填充。
//            flag:$flag
//        }, {
//            key: "tim",
//            fillColor: '0000ff',//填充颜色
//            flag:$flag,
//            isSelectable: true,//是否可以选中。只有为true，selected参数才有效
//            toolTip: $('<div style="margin:0;left:50"><img src="images/tim.jpg" class="headImg"/></div><div style="clear:both;"></div><p>tim <br/>手机开发工程师 .<br/>tel:119</p>')
//        }]
//    });
    //初始化地图的位置。默认是在左上角。
    myScroll.scrollTo(-800, -300);
    
    
    function loaded(){
        myScroll = new iScroll('wrapper', {
            snap: false,
            momentum: true
        });
    }
});


