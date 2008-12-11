/*
 * JTip
 * By Cody Lindley (http://www.codylindley.com)
 * Under an Attribution, Share Alike License
 * JTip is built on top of the very light weight jquery library.
 */


function JT_init()
{
	$("a.jTip").hover
	(
		function(e)
		{
			JT_show(this.href,this.id,this.name,e)
		},
		function()
		{
			$('#JT').remove()
		}
	)
        .click
        (
        	function()
        	{
        		return false
        	}
        );
}

function JT_show(url,linkId,title,e)
{
	if(title == false)title="&nbsp;";
	var de      = document.documentElement;
	var w       = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var hasArea = w - getAbsoluteLeft(linkId);   
	var clickElementy = getAbsoluteTop(linkId) + 40;
	var queryString = url.replace(/^[^\?]+\??/,'');
	var params = parseQuery( queryString );
	if(params['width'] === undefined)
	{
		params['width'] = 250
	};
	if(params['link'] !== undefined)
	{
		$('#' + linkId).bind('click',function(){window.location = params['link']});
		$('#' + linkId).css('cursor','pointer');
	}
	
	$("body").append("<div id='JT' style='width:"+params['width']*1+"px'><div id='JT_arrow_left'></div><div id='JT_close_left'>"+title+"</div><div id='JT_copy'><div class='JT_loader'><div></div></div>");
	var arrowOffset = getElementWidth(linkId)+11;
	var clickElementx = e.pageX - 75;
	$('#JT').css({left: clickElementx+"px", top: clickElementy+"px"});
	$('#JT').show();

    	if(params['link'] !== undefined)
    	{
        	no_link_url = url.replace('&link','&link_no_follow');
    	}
	$('#JT_copy').load(no_link_url);
}



function getElementWidth(objectId) {
	x = document.getElementById(objectId);
	return x.offsetWidth;
}

function getAbsoluteLeft(objectId) {
	// Get an object left position from the upper left viewport corner
	o = document.getElementById(objectId)
	oLeft = o.offsetLeft                // Get left position from the parent object
	while(o.offsetParent!=null) {       // Parse the parent hierarchy up to the document element
		oParent = o.offsetParent    // Get parent object reference
		oLeft += oParent.offsetLeft // Add parent left position
		o = oParent
	}
	return oLeft
}

function getAbsoluteTop(objectId) {
	// Get an object top position from the upper left viewport corner
	o = document.getElementById(objectId)
	oTop = o.offsetTop                  // Get top position from the parent object
	while(o.offsetParent!=null) {       // Parse the parent hierarchy up to the document element
		oParent = o.offsetParent    // Get parent object reference
		oTop += oParent.offsetTop   // Add parent top position
		o = oParent
	}
	return oTop
}

function parseQuery ( query ) {
   var Params = new Object ();
   if ( ! query ) return Params; // return empty object
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) continue;
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   return Params;
}

function blockEvents(evt) {
              if(evt.target){
              evt.preventDefault();
              }else{
              evt.returnValue = false;
              }
}