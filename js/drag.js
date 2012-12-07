$(document).ready(function($){
    initDrag();
    function initDrag(){
        $("#flagDiv").css({
            'top': 50,
            'left': 0
        });
        
        // Set the Z-Index (used to display images on top while dragging)
        var zindexnr = 1;
        
        // boolean to check if the user is dragging
        var dragging = false;
        var scroll = myScroll;
        
        // Make the polaroid draggable & display a shadow when dragging
        $("#flagDiv").draggable({
            cursor: 'hand',
            start: function(event, ui){
                dragging = true;
                scroll.disable();
                zindexnr++;
                var cssObj = {
                    'box-shadow': '#888 5px 5px 8px', // added in case CSS3 is standard
                    '-webkit-box-shadow': '#888 5px 5px 8px', // safari only
                    '-moz-box-shadow': '#888 5px 5px 8px'
                };
                $(this).css(cssObj);
            },
            stop: function(event, ui){
                var cssObj = {
                    'box-shadow': '', // added in case CSS3 is standard
                    '-webkit-box-shadow': '', // safari only
                    '-moz-box-shadow': '' // ff only
                };
                $(this).css(cssObj);
                dragging = false;
                scroll.enable();
                currentFlagPosition.x = ($(this).offset().left - $("#bindLi").offset().left + $("#flagImg").width() * 0.5) / $("#bindImg").width();
                currentFlagPosition.y = ($(this).offset().top - $("#bindLi").offset().top + $("#flagImg").height()) / $("#bindImg").height();
                var coords = JSON.stringify(currentFlagPosition);
				if ($("#coordinate") != undefined) {
                    //设置父页面的input
                    $("#coordinate").attr("value", coords);
                }
                if ($bindMap.mapster("state")) {
                    $bindMap.mapster("setFlagCircle", currentFlagPosition);
                }else{
                	console.log("please refresh");
                }
            }
        });
    }
});
