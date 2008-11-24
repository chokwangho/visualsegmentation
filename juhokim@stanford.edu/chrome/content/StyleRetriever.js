$(document).ready(function(){
	var showSize = $("hbox #contentview").size();
	alert(showSize);
	alert(document.getElementById("contentview").contentDocument);
	
//	var showSize3 = browser.contentWindow;
//	document.getElementById("contentview").contentDocument.documentElement.innerHTML = "hello";

//	browser.contentWindow.getElementsByTagName("div")[0].style.border = "solid red 1px";
//	alert(showSize3);
	//window.content.getElementsByTagName("html:div")[0].style.border = "solid red 1px";
	//content.document.getElementsByTagName("html:div")[0].style.border = "solid red 1px";
	//alert($("html:div").size());
//	var showSize2 = $("vbox").size();
//	alert(showSize2);
//	$("label").css("background-color", "green");
//	$("label").css("font-weight", "bold");

	//$("#contentview" > "html" > "body" > "#maininfo").css("border", "solid red 1px");  	   
	//$("#contentview" > html > body").css("background-color", "green");  	   
	//$("#contentview" > "html" > "body" > "#maininfo").css("font-weight", "bold");  	   
 });
function juhoload(){
      
  	   alert("As you can see, the link no longer took you to jquery.com");
	 
}          
function buttonPressed(event){
  alert('Button was pressed!');
}

function boxPressed(event){
  alert('Box was pressed!');
  event.stopPropagation();
}

function fileIO()
{
	var fileIn = FileIO.open('test.txt');
	alert(fileIn.exists());
	if (fileIn.exists()) {
		var fileOut = FileIO.open('copytest.txt');
		var str = FileIO.read(fileIn);
		var rv = FileIO.write(fileOut, str);
	 	alert('File write: ' + rv);
	 	rv = FileIO.write(fileOut, str, 'a');
	 	alert('File append: ' + rv);
	 	rv = FileIO.unlink(fileOut);
	 	alert('File unlink: ' + rv);
	 }	
}


				
//Invoked in response to a click on the "Go!" button
				
function change_url(event)
{
    //Variables for convenient access to specific elements in the XUL
//    var urlbox = document.getElementById("url");
//    var contentview = document.getElementById("contentview");
//    var wordcountbox = document.getElementById("wordcount");
//    var charcountbox = document.getElementById("charcount");
//    var elemcountbox = document.getElementById("elemcount");
//
//    //Setting this attribute, happens to change the visible contents of the panel
//    contentview.setAttribute("src", urlbox.value);
//
//    //Fake up the update code for now, to allow running in Firefox
//    wordcountbox.previousSibling.value += " (fake)";
//    wordcountbox.value = "1000";
//    charcountbox.previousSibling.value += " (fake)";
//    charcountbox.value = "100";
//    elemcountbox.previousSibling.value += " (fake)";
//    elemcountbox.value = "10";
	
	//window.content.document.getElementsByTagName("html:div")[0].style.border = "solid red 1px";
	//window.content.getElementsByTagName("html:div")[0].style.border = "solid red 1px";
	//content.document.getElementsByTagName("html:div")[0].style.border = "solid red 1px";
	//$(window.content.div).css("border", "solid red 1px");

	document.getElementById("contentview").contentDocument.documentElement.innerHTML = "hello";	
    var doc = event.originalTarget;
	//alert($("body", doc).size());
	var showSize = $("#contentview".html).size();
	alert(showSize);
	//var contentview = document.getElementById("contentview");
//	div < body < html < browser#contentview < hbox < vbox < window#statswindow
	//doc.getElementsByTagName("div")[0].style.border = "solid blue 1px";

	fileIO();
}

