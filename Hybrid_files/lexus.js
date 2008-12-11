function pageload(hash)
{
	if(hash)
	{
		$(".content_overlay").remove();
		$(".overlay_layer").hide();
		$(".overlay_layer").empty();
		$(".preloader").removeClass("hidden");
		$(".overlay_layer").load
		(
			hash,
			function()
			{
				$(".preloader").addClass("hidden");
			}
		);
		$(".overlay_layer").fadeIn("normal");
	}
	else
	{
		$(".overlay_layer").empty();
	}
}


$(document).ready
(
	function()
	{
        	// jTIP
        	JT_init();
        
		//ATTACH SCRIPTS FOR DYNAMICALLY LOADED CONTENT TO BODY CLICK EVENT
		$("body").click
		(
			function(event)
			{
				var target = $(event.target);

				//EXTERNAL LINKS
				if ((target.is("a.external")) || (target.is("a.blog_post")))
				{
					window.open(target.attr("href"));
					return false;
				}

				//CLOSE BUTTONS
   				if ($(event.target).is("a.close"))
   				{
					$(".content_overlay").remove();
					return false;
				}

				//PAGINATION
				if ($(event.target).is("a.pagination"))
   				{
   					target.parent().empty().load(target.attr("href") + "ajax/",{}, JT_init);
                    
                    
   					return false;
				}
  			}
 		);

 		//VIEW SWITCHER
		$(".view_switcher").removeClass("hidden");
		
		//BLOGGERS SCROLL LINKS
		$(".bloggers_scroll_link_wrapper").removeClass("invisible");
		
		//NAVIGATION
		// Initialize history plugin.
		// The callback is called at once by present location.hash.
		$.historyInit(pageload);
		
		// Set onlick event for buttons.
		$("a.internal").click
		(
			function()
			{
				var hash = $(this).attr("href") + "ajax/";
				hash = hash.replace(/^.*#/, '');
				// Moves to a new page.
				// Pageload is called at once.
				$.historyLoad(hash);
				return false;
			}
		);

		//DRAGGABLE BLOG SPOTLIGHTS
		var globalIndex  = 0;
		$(".draggable").mousedown
		(
			function()
			{
				$(this).css("z-index", ++globalIndex);
			}
		)
		$(".draggable").draggable();
	}
);