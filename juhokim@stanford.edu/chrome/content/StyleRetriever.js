$(document).ready(function(){
	//alert(JS_LIB_VERSION);
				

	// do whatever you need to the created file
	//alert(file.path);
	


});		
//function fileIO()
//{
//	var fileIn = FileIO.open('test.txt');
//	alert(fileIn.exists());
//	if (fileIn.exists()) {
//		var fileOut = FileIO.open('copytest.txt');
//		var str = FileIO.read(fileIn);
//		var rv = FileIO.write(fileOut, str);
//	 	alert('File write: ' + rv);
//	 	rv = FileIO.write(fileOut, str, 'a');
//	 	alert('File append: ' + rv);
//	 	rv = FileIO.unlink(fileOut);
//	 	alert('File unlink: ' + rv);
//	 }	
//}
     

function loadPage(event)
{
    var urlbox = document.getElementById("url");
    var contentview = document.getElementById("contentview");	
	contentview.setAttribute("src", urlbox.value);
}
				
//Invoked in response to a click on the "Go!" button
//		
//font-family
//font-size
//font-weight
//background-color
//height: length / percentage / auto
//width: length / percentage / auto
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
	return [curleft,curtop];
}

				
function retrieve(event)
{
	var embedded_doc = document.getElementById("contentview").contentDocument;
	alert($(embedded_doc).find("html > body > div").children().css("font-size"));
    
	var res="";
      $(embedded_doc).find("html > body").children().each(function (i) 
	  {
		//res = res + $(this).width();
		//$(this).css({ backgroundColor:"gray", border:"1px dashed red" });
		res = res + " " + $(this).width() + "/" + $(this).height();

		//res = res + " " + $(this).css("font-size");
      });
    //alert(res);

	
	var nodes = embedded_doc.getElementsByTagName("html")[0].getElementsByTagName("*");
	var result = "";
	for(var i = 0 ; i < nodes.length ; i++) 
	{
		$(nodes[i]).attr( { myOffsetLeft:nodes[i].offsetLeft, myOffsetTop:nodes[i].offsetTop, myWidth:$(nodes[i]).width(), myHeight:$(nodes[i]).height(), myBackgroundColor:$(nodes[i]).css("background-color"), myColor:$(nodes[i]).css("color"), myFontFamily:$(nodes[i]).css("font-family"), myFontSize:$(nodes[i]).css("font-size"), myFontWeight:$(nodes[i]).css("font-weight") } );
		//result = result + " " + left + " " + top;
	}
	//alert (nodes.length);
	//alert (result);
	alert("Style retrieved successfully.");
	//alert(embedded_doc.getElementsByTagName("html")[0].innerHTML);
//	alert($(embedded_doc).find("html > body > div").size());
//	alert(findPos(embedded_doc.getElementById("briefinfo")));
//	alert($(embedded_doc).find("html > body > div").children().css("font-size"));
//	temp = $(embedded_doc).find("html > body").css("font-size");
//	$(embedded_doc).find("html > body").css("font-size", "32px");
//	alert($(embedded_doc).find("html > body").css("font-size"));
//	$(embedded_doc).find("html > body").append("<b>Hello</b>");
//	alert("temp: " + temp);
	//alert($(embedded_doc).find("html > body > #maininfo").children().css("font-size"));	
	//alert($(embedded_doc).find("html > body > #briefinfo").children().css("font-size"));	
//	alert($(embedded_doc).find("html > body").css("width"));
	  	   
//	$(embedded_doc).find("html > body > div > #briefinfo").css("background-color", "green");  	   
//	$(embedded_doc).find("html > body > #maininfo").css("font-weight", "bold");  		
//	$(embedded_doc).find("html > body > div").children().each(function() {

    // now add a paragraph count in front of each of them.  Notice how we use the
    // $(this) variable to reference each of the paragraph elements individually.
	//	alert(increment);	
    //$(this).text(increment + ". " + $(this).text());
    //increment++;
	
	//});


	//document.getElementById("contentview").contentDocument.documentElement.innerHTML = "hello";		
}


function save(event)
{
	var embedded_doc = document.getElementById("contentview").contentDocument
	var data = 	embedded_doc.getElementsByTagName("html")[0].innerHTML;	
	//alert(data);
	//alert(data.length);
	
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
