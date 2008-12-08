$(document).ready(function(){
});		
   

function loadPage(event)
{
    var urlbox = document.getElementById("url");
    var contentview = document.getElementById("contentview");	
	contentview.setAttribute("src", urlbox.value);
}

// Make all font-weight properties into integer
function getFontWeight(inputWeight)
{
	var weight = inputWeight;
	
	//normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | inherit 
	switch(inputWeight)
	{
		case "normal":
			weight = 400;
		break;
		case "bold":
			weight = 700;
		break;
		// The rest is unexpected: it's handled by jQuery css function. so just set it to 400
		case "bolder":
		case "lighter":
		case "inherit":
			weight = 400;
		break;
	}
	return weight;
}
				
function retrieve(event)
{
	var embedded_doc = document.getElementById("contentview").contentDocument;
	
	var nodes = embedded_doc.getElementsByTagName("html")[0].getElementsByTagName("*");
	var result = "";
	var fontWeight; 
	for(var i = 0 ; i < nodes.length ; i++) 
	{
		fontWeight = getFontWeight(embedded_doc.defaultView.getComputedStyle(nodes[i],null).getPropertyValue("font-weight"));
		$(nodes[i]).attr( { 
			//myOffsetLeft:nodes[i].offsetLeft, 
			//myOffsetTop:nodes[i].offsetTop, 
			myOffsetLeft:$(nodes[i]).offset().left, 
			myOffsetTop:$(nodes[i]).offset().top, 			
			myWidth:$(nodes[i]).width(), 
			myHeight:$(nodes[i]).height(), 
			myBackgroundColor:embedded_doc.defaultView.getComputedStyle(nodes[i],null).getPropertyValue("background-color"),
			myColor:embedded_doc.defaultView.getComputedStyle(nodes[i],null).getPropertyValue("color"), 
			myFontFamily:embedded_doc.defaultView.getComputedStyle(nodes[i],null).getPropertyValue("font-family"), 
			myFontSize:embedded_doc.defaultView.getComputedStyle(nodes[i],null).getPropertyValue("font-size"), 
			myFontWeight:fontWeight 
		} );	
	}
	//alert($(embedded_doc.getElementById("header")).offset().left + " " + embedded_doc.getElementById("header").offsetLeft);
	alert("Style retrieved successfully.");
}


function save(event)
{
	var embedded_doc = document.getElementById("contentview").contentDocument
	var data = 	embedded_doc.getElementsByTagName("html")[0].innerHTML;	
	
	var filename = "retrieved.html"
	var file = Components.classes["@mozilla.org/file/directory_service;1"]
	                     .getService(Components.interfaces.nsIProperties)
	                     .get("ProfD", Components.interfaces.nsIFile);
	file.append(filename);
	file.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0666);	
	// file is nsIFile, data is a string
	var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
	                         .createInstance(Components.interfaces.nsIFileOutputStream);
							 
	// use 0x02 | 0x10 to open file for appending.
	foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0); 
	// write, create, truncate
	// In a c file operation, we have no need to set file mode with or operation,
	// directly using "r" or "w" usually.
	//foStream.write(data, data.length);
	foStream.write(data, data.length);
	foStream.close();	
	alert(filename + " written successfully.");
}
