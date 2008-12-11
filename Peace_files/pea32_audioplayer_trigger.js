var popUpWin=0;
function popUpWindow(URLStr, width, height)
{
  if(popUpWin)
  {
    if(!popUpWin.closed) popUpWin.close();
  }
  //popUpWin = open(URLStr, 'popUpWin', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=yes,width='+width+',height='+height+',left='+left+', top='+top+',screenX='+left+',screenY='+top+'');
	popUpWin = open(URLStr, 'popUpWin', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=yes,width='+width+',height='+height+'');
}

function showAlert(arg)
{
	alert(arg)
}

function openPopup(file)
{
	popUpWindow("/includes/webcameos/AudioPlayer.html?file=" + file, 400, 190);
}

function getFlash(moduleName)
{
	return  (navigator.appName.indexOf("Microsoft") != -1) ? window[moduleName] : document[moduleName];
}

var fTriggerReady = false;

function triggerReady(ready)
{
	fTriggerReady = ready;
}

function triggerAudio(filePath)
{
	// dynamically add DIV element to page??
	
	// for now, just targeting a special DIV
	// Check and see if the flash object is already available on the page
	if(getFlash("AudioPlayerTrigger") && fTriggerReady)
	{
		getFlash("AudioPlayerTrigger").triggerAudio(filePath);
	} else {
		//
		// Create AudioTrigger flash object
		var FO = { movie:"/includes/webcameos/AudioPlayerTrigger.swf", width:"20", height:"20", majorversion:"8", build:"0,0,0", id:"AudioPlayerTrigger", name:"AudioPlayerTrigger", swliveconnect:"true", bgcolor:"#ffffff", flashvars:"filePath=" + filePath};
		FO.allowscriptaccess = "always";
		UFO.create(FO, "flash_AudioPlayerTrigger");
	}
}

function fDebug(info)
{
	//alert("fDebug:\n" + info);
}