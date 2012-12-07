<html>
    <head>
        <title>shapes</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <link rel="stylesheet" href="style/style.css" type="text/css" media="screen" charset="utf-8"/>
        <link rel="stylesheet" href="style/themes/base/jquery.ui.all.css">
		<script type="text/javascript" src="js/jquery-1.7.1.min.js">
        </script>
        <script type="text/javascript" src="js/jNotify.jquery.js">
        </script>
        <script src="js/iscroll.js" type="text/javascript">
        </script>
		<script src="js/jquery-ui-1.8.17.custom.min.js" type="text/javascript"></script>
        <script type="text/javascript" src="js/jquery.xml2json.js">
        </script>
        <script type="text/javascript" src="js/jquery.imagemapster.1.2.5.js">
        </script>
        <script type="text/javascript" src="js/createMapData.js">
        </script>
    </head>
    <body>
        <div id="controlDiv">
            <ul id="controlList">
                <li>
                    <div id="zoomDiv">
                        <img src="images/plus.png" alt="放大" id="zoomIn" class="zoomImg" />
						<img alt="缩小" src="images/minus.png" id="zoomOut" class="zoomImg" />
						<div id='slider'></div>
                    </div>
					<span id="floorTxt"></span>
                </li>
                <li id="searchLi">
                    <input type="text" id="staffName" maxlength="25" size="8"><input type="submit" id="searchBtn" value="search">
                </li>
            </ul>
        </div>
        <div id="wrapper">
            <ul id="scroller">
                <li id="floorLi">
                    <img id="mapImg" usemap="#floors">
                </li>
            </ul>
        </div>
        <div id="previewDiv">
        	<img src="images/F2.png" usemap="#building" id="buildImg" />
        </div>
        <map name="floors" id="floors_Map">
        </map>
		<map name="building" id="building">
            <area shape="rect" coords="16,28,88,47" href="#" floor="9" title="9樓"/>
			<area shape="rect" coords="16,48,87,67" href="#" floor="8" title="8樓"/>
			<area shape="rect" coords="18,68,85,84" href="#" floor="7" title="7樓"/>
			<area shape="rect" coords="22,157,77,168" href="#" floor="1" title="1樓"/>
			<area shape="rect" coords="21,143,80,157" href="#" floor="2" title="2樓"/>
			<area shape="rect" coords="20,129,81,143" href="#" floor="3" title="3樓"/>
			<area shape="rect" coords="19,117,86,129" href="#" floor="4" title="4樓"/>
			<area shape="rect" coords="18,86,85,103" href="#" floor="6" title="6樓"/>
			<area shape="rect" coords="19,104,84,116" href="#" floor="5" title="5樓"/>
        </map>
    </body>
</html>
