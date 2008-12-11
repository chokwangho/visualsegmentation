var iBorderOffset = 1;

function setupAllCroppers (){
	
	var aCroppers = document.getElementsByClassName("cropper");
	
	get("divCroppers").style.display="block";
		
	for (ii=0; ii < aCroppers.length; ii++) {
		aSplit = aCroppers[ii].id.split("_");
		setupCropper(aSplit[1], false, 'preview');
	}
	
	get ("divLoadingInfo").style.display="none";
	get("divCropperIntro").style.display="block";

	//clear values
	aCroppers = null;
}

function setupCropper (sPhotoId, bReset, sDisplayMode){
	
    //Get the image and dragger for this cropper
    aDimensions = get('hidImageDimensions_' + sPhotoId).value.split('_');
    iWidth = parseInt(aDimensions[0]);
    iHeight = parseInt(aDimensions[1]);
	
	if(sDisplayMode == 'preview') {
		oImage = get('imgFullPreview_' + sPhotoId);
	} else {
		oImage = get('imgFlickr_' + sPhotoId);
	}
    
    oDragger = get('divDragger_' + sPhotoId);
	oCropper = get('divCropper_' + sPhotoId);


    //Setup the slider
  	sImageID = oImage.id;
    sCropperID = oCropper.id;
    sDraggerID = oDragger.id;
	sSliderHandleId = 'divSliderHandle_' + sPhotoId;
	sSliderTrackId = 'divSliderTrack_' + sPhotoId;
	
	//Get any existing zoom
	var aImageInfo = getImageInfo(sPhotoId, true, sDisplayMode);
	if(sDisplayMode == "preview"){
		var nExistingZoom = get("hidZoom_" + sPhotoId).value;
		if(isNaN(nExistingZoom) || nExistingZoom ==undefined) {
			nExistingZoom = 1;
		} 
	} else {
		var nExistingZoom = safeInt(oImage.width) / safeInt(aImageInfo[3]);
	}
	//console.log('nExistingZoom = %d', nExistingZoom)
	setZoomText(sPhotoId, nExistingZoom * 100);
	//Build slider
  	oSlider = new Control.Slider(sSliderHandleId,sSliderTrackId,{sliderValue:(nExistingZoom -1), axis:'horizontal', range: $R(0, 1)});

    oSlider.options.onSlide = function(value){
      	scaleIt(value,sPhotoId);
    };

    oSlider.options.onChange = function(value){
      	scaleIt(value, sPhotoId);
		onZoomed(sPhotoId);
    };

    //Setup the dragger
    new Draggable(oDragger.id,{revert:false,
		change: function (value){
	        dragged(value, sPhotoId);},
		snap:function(x,y,draggable) {

	      aDraggerDimensions = Element.getDimensions(draggable.element);
		  sPhotoId = draggable.element.id.replace("divDragger_", "");
		  oCropper = get("divCropper_" + sPhotoId);
	      aCropperDimensions = Element.getDimensions(oCropper);
   		  
		  	//work out bleed
		  	aBleed = get("hidBleed_" + sPhotoId).value.split("|");
			xBleed=0;
			yBleed=0;
			//bleed comes from a hidden input, to save recalculating each time
		  	if (aCropperDimensions.width > aCropperDimensions.height){
				xBleed = aBleed[0];
				yBleed = aBleed[1];
			}else{
				xBleed = aBleed[1];
				yBleed = aBleed[0];
			}
		
 	      return constrainByCropper(x, parseInt(oCropper.style.left), aCropperDimensions.width, aDraggerDimensions.width, xBleed, 
			y, parseInt(oCropper.style.top), aCropperDimensions.height, aDraggerDimensions.height, yBleed);
	    },
		endeffect: function (value){
			setCroppedInformation(sPhotoId);
		}
	});

	//Zoom warning
	//showHideZoom(sPhotoId);	
	
	//Set crop info
	if(bReset == true){
		setCroppedInformation(sPhotoId);
	}
	
	if(sDisplayMode != 'preview') {
		//make sure the tools are the correct height
		get("divImageControls_" + sPhotoId).style.height = oImage.parentNode.style.height;
	}
	
}

function scaleIt(iScale, sPhotoId) {
	 oImage = get('imgFlickr_' + sPhotoId);
	 oCropper = get('divCropper_' + sPhotoId);
	
    //old values
    iOldWidth = parseInt(oImage.width);
    iOldHeight = parseInt(oImage.height);

    //Work out the new scale
    iRealScale = 1 + iScale;

    aDimensions = get('hidSafeImageDimensions_' + sPhotoId).value.split('_');

   //set new size
   oImage.width  = parseInt(aDimensions[0]) * iRealScale;
   oImage.height  = parseInt(aDimensions[1]) * iRealScale;

	if (iScale == 0){
		oImage.style.top = "0";
		oImage.style.left = "0";
	}else{
	  if (iOldWidth < oImage.width) {
	      oImage.style.top = (parseInt(oImage.style.top) -  (oImage.height - iOldHeight)/2)  + 'px';
	      oImage.style.left = (parseInt(oImage.style.left) -  (oImage.width - iOldWidth)/2)  + 'px';
	   }
	   if (iOldWidth >= oImage.width) {
	      oImage.style.top = (parseInt(oImage.style.top) +  (iOldHeight - oImage.height)/2)  + 'px';
	      oImage.style.left = (parseInt(oImage.style.left) +  (iOldWidth - oImage.width)/2)   + 'px';
	   }

	}

	//Make sure we are within the box
	iLeft = parseInt(oCropper.style.left) - parseInt(oImage.style.left);
	iTop = parseInt(oCropper.style.top) - parseInt(oImage.style.top);
	iCropperWidth = parseInt(oCropper.style.width);
	iCropperHeight = parseInt(oCropper.style.height);
	
	aCropperDimensions = Element.getDimensions(oCropper);
	//work out bleed
	aBleed = get("hidBleed_" + sPhotoId).value.split("|");
	xBleed=0;
	yBleed=0;
	//bleed comes from a hidden input, to save recalculating each time
	if (aCropperDimensions.width > aCropperDimensions.height){
		xBleed = aBleed[0];
		yBleed = aBleed[1];
	}else{
		xBleed = aBleed[1];
		yBleed = aBleed[0];
	}

	//These checks are in place to ensure that Zooming doesn't end up with the image crop
	//sitting outside the scope of the image itself
	if (iLeft < xBleed){
		//This means there is a crop disrepancy to the left of the image.
		//Slide the image to the left to compensate for this
		oImage.style.left = (parseInt(oCropper.style.left)-10) + 'px';
	}
	
	if (iTop < yBleed){
		//There is a crop discrepancy at the top of the image
		//move the image up to compensate
		oImage.style.top = (parseInt(oCropper.style.top)-10) + 'px';
	}
	if (parseInt(oImage.style.left) < (parseInt(oCropper.style.left) - parseInt(oImage.width) + parseInt(oCropper.style.width) + parseInt(xBleed))){
		//There is a crop discrepancy on the right hand side of the image
		//try to slide the image back to an acceptable position
		//left position calculated as cropperleft - imagewidth + cropperwidth + bleed
		oImage.style.left = (parseInt(oCropper.style.left) - parseInt(oImage.width) + parseInt(oCropper.style.width) + parseInt(xBleed)) + 'px';
	}
	if (parseInt(oImage.style.top) < (parseInt(oCropper.style.top) - parseInt(oImage.height) + parseInt(oCropper.style.height) + parseInt(yBleed))){
		//there is a crop discrepancy to the base of the image
		//try to move the image down slightly
		//top position calculated as croppertop - imageheight + cropperheight + bleed
		oImage.style.top = (parseInt(oCropper.style.top) - parseInt(oImage.height) + parseInt(oCropper.style.height) + parseInt(yBleed)) + 'px';
	}	
	
   //make sure the dragger is in place
	oDragger = get('divDragger_' + sPhotoId);

 	oDragger.style.width = oImage.width + 'px';
    oDragger.style.height = oImage.height + 'px';
   	oDragger.style.top = oImage.style.top;
	oDragger.style.left = oImage.style.left;
  
   //display the zoom level for a bit of fun
   setZoomText(sPhotoId, iRealScale * 100);
   
   // display a warning if ptinted image will be all pixelated
   oScaleInput = get('hidOrignalImageScale_' + sPhotoId);
   aScaleValue = oScaleInput.value.split('_')
 
   bWillPixelate = willPixelate(parseInt(oCropper.style.width), parseInt(oCropper.style.height), 
		parseFloat(aScaleValue[0]), parseFloat(aScaleValue[1]), iRealScale)
	
	oMessage = get('pMessage_' + sPhotoId);
	if (bWillPixelate == true){
		oMessage.style.display = 'block';
		oSliderZoom.style.display = "none";
	}else{
		oMessage.style.display = 'none';
		oSliderZoom.style.display = "block";
	}
}

function setZoomText(sPhotoId, nPercent){
   oSliderZoom = get('spnZoomPercent_' + sPhotoId);
   oSliderZoom.innerHTML = parseInt(nPercent) + '%';	
}

function onZoomed (sPhotoId){

	setCroppedInformation(sPhotoId);
	
}

function willPixelate (iCropAreaWidth, iCropAreaHeight, nOriginalRatioWidth, nOriginalRatioHeight, nZoomLevel){

	bReturn = false

	nCroppedWidthPixels = (iCropAreaWidth / nZoomLevel) * nOriginalRatioWidth;
	nCroppedHeightPixels = (iCropAreaHeight / nZoomLevel) * nOriginalRatioHeight;

	if (((nCroppedWidthPixels * nCroppedHeightPixels))  < getMinimimPrintPixels()){
		bReturn = true;
	}

	return bReturn;

}

function getBleedRatioFromLong(){
	return get('hidBleedRatioFromLong').value;
}

function getBleedRatioFromShort(){
	return get('hidBleedRatioFromShort').value;
}

function getBleedPercentLong(){
	return get('hidBleedPercentLong').value;
}

function getBleedPercentShort(){
	return get('hidBleedPercentShort').value;
}

function getMinimimPrintPixels (){
	return get('hidPrintPixelMinimum').value;
}

function rotateCropper (sPhotoId, sDisplayMode) {
	
	var oImage = get('imgFlickr_' + sPhotoId);
		
    oImage.style.top='0px';
	oImage.style.left='0px';	
    setupCropper(sPhotoId, true, sDisplayMode);
    
    oDragger = get('divDragger_' + sPhotoId);
	oDragger.style.top='0px';
	oDragger.style.left='0px';
	
	oCropper = get("divCropper_" + sPhotoId);
	
	//also set rotation for showing correct preview orientation later
    if (parseInt(oCropper.style.width) > parseInt(oCropper.style.height)) {
        centreCropper(sPhotoId, 'p', sDisplayMode);
		if (sDisplayMode == 'preview') {
			get("hidNewRotatePreview_" + sPhotoId).value = "portrait";	
		}
    }else{
        centreCropper(sPhotoId, 'l', sDisplayMode);
		if (sDisplayMode == 'preview') {
			get("hidNewRotatePreview_" + sPhotoId).value = "landscape";	
		}
    }

	//Swap the preview width and height values
	var iResizeWidth = get('hidResizeWidth_'+sPhotoId).value;
	var iResizeHeight = get('hidResizeHeight_'+sPhotoId).value;
	get('hidResizeWidth_'+sPhotoId).value = iResizeHeight;
	get('hidResizeHeight_'+sPhotoId).value = iResizeWidth;
	

	//Show any zoom warnings
	//showHideZoom(sPhotoId);
 	
	 //save info
	 setCroppedInformation(sPhotoId);
	 
	 if(sDisplayMode == "preview") {
	 	get("hidRotatedPreview_" + sPhotoId).value = 1;
	 }
}

function swapFullPreviewOrientation(sPhotoId) {
	
	var sNewOrientation = get('hidNewRotatePreview_' + sPhotoId).value;
	
	// change all the background image dropshadowy things round
	// and make sure all the classes that use orientation generally are reset
	//there could probably be less of these.
	var oDivFrame = get('divPreviFrameControls_' + sPhotoId);
	var oDivFrameClass = "fullpreviewimageCropper " + sNewOrientation;
	oDivFrame.setAttribute('class', oDivFrameClass);
	oDivFrame.setAttribute('className', oDivFrameClass);	//ie6
	
	var oImageFrame = get('divFullPreviewImageFrame_' + sPhotoId);
	var oImageFrameClass = "fullpreviewimage " + sNewOrientation;
	oImageFrame.setAttribute('class', oImageFrameClass);
	oImageFrame.setAttribute('className', oImageFrameClass);	//ie6
	
	var oPreviewFrame = get('divFullPreviewFrame_' + sPhotoId);
	var oPreviewFrameClass = "divFullPreviewFrameCropper " + sNewOrientation;
	oPreviewFrame.setAttribute('class', oPreviewFrameClass);
	oPreviewFrame.setAttribute('className', oPreviewFrameClass);	//ie6
	
	//update the new orientation
	get("hidRotatePreview_" + sPhotoId).value = get("hidNewRotatePreview_" + sPhotoId).value;
	
	var oImage = get('imgFullPreview_' + sPhotoId);
	oImage.height = get('hidResizeHeight_' + sPhotoId).value;
	oImage.width = get('hidResizeWidth_' + sPhotoId).value;
	
	//reset rotated
	get("hidRotatedPreview_" + sPhotoId).value = 0;
}

function showHideZoom(sPhotoId){

	// display a warning if ptinted image will be all pixelated
   oMessage = get('pMessage_' + sPhotoId); 
   oScaleInput = get('hidOrignalImageScale_' + sPhotoId) ;
   aScaleValue = oScaleInput.value.split('_')

   bWillPixelate = 	willPixelate(parseInt(oCropper.style.width), parseInt(oCropper.style.height), 
		parseFloat(aScaleValue[0]), parseFloat(aScaleValue[1]), 1)

	if (bWillPixelate == true){
		oMessage.style.display = 'block';
		get("spnZoomPercent_" + sPhotoId).style.display = "none";
	}else{
		oMessage.style.display = 'none';
	}

}

function getImageInfo (sPhotoId, bSafe, sDisplayMode){
	
	if(sDisplayMode == 'preview'){
		oImage = get('imgFullPreview_' + sPhotoId);	
	} else {
		oImage = get('imgFlickr_' + sPhotoId);
	}
	
	aInfo = new Array(3);
    if (oImage.height > oImage.width ){
    	aInfo[1] = 'p';
    }else{
    	aInfo[1] = 'l';
    }
    if(bSafe){
		aDimensions = get('hidSafeImageDimensions_' + sPhotoId).value.split('_');	
	} else {
		aDimensions = get('hidImageDimensions_' + sPhotoId).value.split('_');
	}
    
    aInfo[2] = parseInt(aDimensions[1]);
    aInfo[3] = parseInt(aDimensions[0]);
	
    return aInfo;

}


function centreCropper (sPhotoId, sOrientation, sDisplayMode){

	oImage = get('imgFlickr_' + sPhotoId);
    iWidth = 0;
	iHeight = 0;
	iBleedShort = 0;

    aImageInfo = getImageInfo(sPhotoId, true, sDisplayMode);	
	
	//Work out orientation if in auto mode
	if (sOrientation == 'a'){
		sOrientation  = aImageInfo[1];
	}
		
	var img_width = aImageInfo[3];
	var img_height = aImageInfo[2];

	var index = img_width < img_height ? 2 : 3;

    if (sOrientation=='l'){
		if ((aImageInfo[3] / aImageInfo[2]) > getBleedRatioFromLong()){
		    iHeightPlusBleed =  aImageInfo[2];
 		    iWidthPlusBleed = (aImageInfo[2] * getBleedRatioFromLong());
	    }else{
		    iWidthPlusBleed = aImageInfo[3];
		    iHeightPlusBleed =  aImageInfo[3] * getBleedRatioFromShort();
        }

		iWidth = iWidthPlusBleed / getBleedPercentLong();		
		iHeight = iHeightPlusBleed / getBleedPercentShort();
		iBleedShort = parseInt((iWidthPlusBleed - iWidth) /2);
		iBleedLong = parseInt((iHeightPlusBleed - iHeight) /2);		

    }

    if (sOrientation=='p'){
		if ((aImageInfo[3] / aImageInfo[2]) < getBleedRatioFromShort()){
		    iWidthPlusBleed =  aImageInfo[3];
 		    iHeightPlusBleed = aImageInfo[3] * getBleedRatioFromLong();
	    }else{
		    iHeightPlusBleed = aImageInfo[2];
		    iWidthPlusBleed = aImageInfo[2] * getBleedRatioFromShort();
        }

		iWidth = iWidthPlusBleed / getBleedPercentShort();
    	iHeight = iHeightPlusBleed / getBleedPercentLong();
		iBleedShort = parseInt((iHeightPlusBleed - iHeight) /2);
		iBleedLong = parseInt((iWidthPlusBleed - iWidth) /2);		
    }

	//Save the bleed info so we dont have to recalculate later
	get ("hidBleed_" + sPhotoId).value = iBleedLong + "|" + iBleedShort;

	//position cropper
	oCropper = get('divCropper_' + sPhotoId);
	oMask1 = get('divCropperMask1_' + sPhotoId);
	oMask2 = get('divCropperMask2_' + sPhotoId);
	oBleed1 = get('divCropperBleed1_' + sPhotoId);
	oBleed2 = get('divCropperBleed2_' + sPhotoId);	
    oCropper.style.height =  parseInt(iHeight) +'px';
    oCropper.style.width = parseInt(iWidth) +'px';

	oCropper.style.top = parseInt(aImageInfo[2] / 2 - (iHeight / 2)) + 'px';
	oCropper.style.left = parseInt(aImageInfo[3] / 2 - (iWidth / 2)) + 'px';
	
	if (sOrientation == 'l'){
		oMask1.style.height = oCropper.offsetTop + "px";
		oMask1.style.width = parseInt(oCropper.style.width) + (iBorderOffset * 2) + "px" ;
		oMask1.style.top = "0";
		oMask1.style.left = oCropper.offsetLeft + "px";
		oMask2.style.height = (oCropper.offsetTop) + "px";
		oMask2.style.width = parseInt(oCropper.style.width)  + (iBorderOffset * 2) + "px" ;
		oMask2.style.top = oCropper.offsetTop + oCropper.offsetHeight + "px";
		oMask2.style.left = oCropper.offsetLeft + "px";
		oBleed1.style.width = oCropper.offsetLeft + "px";		
		oBleed1.style.height = "100%";
		oBleed1.style.left= 0;
		oBleed2.style.height = "100%";
		oBleed2.style.left = parseInt(oCropper.offsetWidth) + oCropper.offsetLeft + "px";
		oBleed2.style.top = 0;
	}

	if (sOrientation == 'p'){
		oMask1.style.height = parseInt(oCropper.style.height)  + (iBorderOffset * 2) + "px";
		oMask1.style.width = oCropper.offsetLeft + "px";
		oMask1.style.top = oCropper.offsetTop + "px";
		oMask1.style.left = "0";
		oMask2.style.height =  parseInt(oCropper.style.height)  + (iBorderOffset * 2) + "px";
		oMask2.style.width = (oCropper.offsetLeft) + 'px';
		oMask2.style.top = oCropper.offsetTop + "px"; 
		oMask2.style.left = oCropper.offsetLeft + oCropper.offsetWidth + "px";
		oBleed1.style.height = oCropper.offsetTop + "px";
		oBleed1.style.width = aImageInfo[3] + "px";		
		oBleed2.style.height = oCropper.offsetHeight + "px";
		oBleed2.style.width = aImageInfo[3] + "px";
		oBleed2.style.top = parseInt(oCropper.offsetHeight) + oCropper.offsetTop + "px";
		oBleed2.style.left = 0;
	}

}

function resetCropper (sPhotoId, sDisplayMode){

	var oImage = get('imgFlickr_' + sPhotoId);
    var aImageInfo = getImageInfo(sPhotoId, true, sDisplayMode);
    oImage.width = aImageInfo[3];
    oImage.height = aImageInfo[2];
	
	oImage.style.top=0;
	oImage.style.left=0;	
    
	setupCropper(sPhotoId, true, sDisplayMode);

	oSliderZoom = get('spnZoomPercent_' + sPhotoId);
	
	oSliderZoom.innerHTML = '100%';

	var oDragger = get('divDragger_' + sPhotoId);
	oDragger.style.width= oImage.width + 'px';
	oDragger.style.height= oImage.height + 'px';
	oDragger.style.top=0;
	oDragger.style.left=0;
	
	//get resize width and height
	var iResizeWidth = get('hidResizeWidth_'+sPhotoId).value;
	var iResizeHeight = get('hidResizeHeight_'+sPhotoId).value;
	
	if (oImage.height > oImage.width) {
		if (iResizeWidth > iResizeHeight){
			get('hidResizeWidth_'+sPhotoId).value = iResizeHeight;
			get('hidResizeHeight_'+sPhotoId).value = iResizeWidth;
		}
	}
	if (oImage.height < oImage.width) {
		if (iResizeWidth < iResizeHeight){
			get('hidResizeWidth_'+sPhotoId).value = iResizeHeight;
			get('hidResizeHeight_'+sPhotoId).value = iResizeWidth;
		}
	}
	
	//reset rotation value
	get('hidNewRotatePreview_' + sPhotoId).value = get('hidRotatePreview_' + sPhotoId).value;
	
	centreCropper(sPhotoId, 'a', sDisplayMode);
	//showHideZoom(sPhotoId);
	
}

function dragged (oValue, sPhotoId) {

	oDragger = get('divDragger_' + sPhotoId);
	oCropper = get('divCropper_' + sPhotoId);
	oImage = get('imgFlickr_' + sPhotoId); 
    oImage.style.top =  oDragger.style.top;
    oImage.style.left =  oDragger.style.left;
}

function setCroppedInformation (sPhotoId){
	
	oImage = get('imgFlickr_' + sPhotoId);
	oCropper = get("divCropper_" + sPhotoId);
	oCroppedInfo = get("hidCropped_" + sPhotoId);
	
	//get values
	iLeft = parseInt(oCropper.style.left) - parseInt(oImage.style.left);
	iTop = parseInt(oCropper.style.top) - parseInt(oImage.style.top);
	iCropperWidth = parseInt(oCropper.style.width);
	iCropperHeight = parseInt(oCropper.style.height);

	//sanity check
	if (iLeft =="NaN"){iLeft = 0}
	if (iTop =="NaN"){iTop = 0}
	if (iCropperWidth =="NaN"){iCropperWidth = 0}		
	if (iCropperHeight =="NaN"){iCropperHeight = 0}
	
	//build string
	sInfo = oImage.id.replace("imgFlickr_","") + '|' + oImage.src + '|' + oImage.width + '|' + oImage.height + '|' +
		iLeft + '|' + iTop + '|' + iCropperWidth + '|' + iCropperHeight;
		
    oCroppedInfo.value = sInfo;

}

function previewCropper (sPhotoId, sDisplayMode){

   //Get objects
	oBody = document.getElementsByTagName("body").item(0);
	oImage = get('imgFlickr_' + sPhotoId);
	oCropper = get("divCropper_" + sPhotoId);

  //Work out orientation
  sOrientation = 'vertical';
  if (parseInt(oCropper.style.width) > parseInt(oCropper.style.height)){
      sOrientation = 'horizontal';    
  }

  sPreviewId = "divPreview_" + getproductType() + "_" + sOrientation;

	//showMask(sPhotoId);
	displayMask("divPreview_" + getproductType() + "_" + sOrientation);

  	//Build preview html
  	oPreview = document.createElement('div');
  	oPreview.setAttribute('id',sPreviewId);
	oPreview.setAttribute('class', "previewcard");
	oPreview.setAttribute('className', "previewcard");	//ie6
	
	//original image
	var sUrl = get('hidOrignalImageUrl_' + sPhotoId).value;
    aScaleValues = get('hidOrignalImageScale_' + sPhotoId).value.split('_');
 
	var aImageInfo = getImageInfo(sPhotoId, true, sDisplayMode);
	var iZoom = safeInt(oImage.width) / aImageInfo[3];

	var iCropX = ((safeInt(oCropper.style.left) - safeInt(oImage.style.left))/ iZoom) * aScaleValues[1];
	var iCropY = ((safeInt(oCropper.style.top)  - safeInt(oImage.style.top))/iZoom) * aScaleValues[0];	
	var iCropWidth = (safeInt(oCropper.style.width) / iZoom)  * aScaleValues[0];
	var iCropHeight = (safeInt(oCropper.style.height) / iZoom) * aScaleValues[1];
	
	var iResizeWidth = get('hidResizeWidth_'+sPhotoId).value;
	var iResizeHeight = get('hidResizeHeight_'+sPhotoId).value;

	var originalRotation = safeInt(get('hidOrignalRoteBy_' + sPhotoId).value);
	var rotateSkew = 	safeInt(get('hidPrintRotationSkew_' + sPhotoId).value);
	
	var iRotation = safeInt(originalRotation + rotateSkew);
   
	sPreviewHtml  = '<img id="imgLoading" src="../images/loading.gif" /><p id="pDownloadWarning">' + string00056 + '</p><img id="imgPreviewPopup" src = "../crop.php?url={url}&crop_w={crop_width}&crop_h={crop_height}&crop_x={crop_x}&crop_y={crop_y}&resize_w={resize_width}&resize_h={resize_height}&r={rotation}" />' + 
		'<div id="divClose"><a id="aClosePreview" href="javascript:closePreview(' +  "'{id}'"  + ');">' + string00057 + '</a></div>';
	sPreviewHtml = sPreviewHtml.replace("{url}", sUrl).replace("{id}", sPreviewId).replace("{crop_x}", iCropX).replace("{crop_y}", iCropY)
	sPreviewHtml = sPreviewHtml.replace("{crop_width}", iCropWidth).replace("{crop_height}", iCropHeight);
	sPreviewHtml = sPreviewHtml.replace("{resize_width}", iResizeWidth).replace("{resize_height}", iResizeHeight);	
	sPreviewHtml = sPreviewHtml.replace("{rotation}", iRotation)

	oPreview.innerHTML = sPreviewHtml;

//Position the preview
  iPageWidth = oBody.scrollWidth;  
  iCardWidth = 376;
  if (sOrientation == 'vertical'){
	  var iCardWidth = 157;  
  }

  iScrollTop = document.body.parentNode.scrollTop;
  if (iScrollTop == 0){
	iScrollTop = document.body.scrollTop; //safari fix
  }	

//  oPreview.style.left = parseInt((iPageWidth/2) - (iCardWidth/2)) + 'px';
  oPreview.style.top = iScrollTop + 100 + 'px';
  oBody.insertBefore(oPreview, oBody.firstChild);

	//set focus
	setFocus('aClosePreview');

}

function findPosition(obj){
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
			} 
		while (obj = obj.offsetParent);
		
		return [curleft,curtop];	
	}
	
}

function showMask(sPhotoId){
  //Add mask
  var oMask = document.createElement('div');
  var sId = 'divMask';
  oMask.setAttribute('id',sId);
  oBody.insertBefore(oMask, oBody.firstChild);
  //Ensure mask fills entire screen
  if (window.screen.availHeight && window.document.height) {
  	
  	if (window.screen.availHeight > window.document.height) {
		oMask.style.height = window.screen.availHeight + 'px';
		oBody.style.overflow = 'hidden';
	} else {
		oMask.style.height = window.document.height + 'px';
	}
  } else {
  	//add extra masks for IE as it won't let us use a simple x-index. groan.
  	var oFrame = get("divImageFrameControls_" + sPhotoId);
	
	//we have to set width & height here, or we can't retrieve and use it later
	//ain't javascript grand?
	if(get("hidOrientation_"+sPhotoId).value == "landscape"){
		oFrame.style.height = 300 + "px";	
	} else {
		oFrame.style.height = 400 + "px";
	}
	
  	var aPos = findPosition(oFrame);
	var iTop = aPos[1];
	var iLeft = aPos[0];
	var offsetLeft = 20;
	var iScrollTop = document.body.parentNode.scrollTop;
	if (iScrollTop == 0){
		iScrollTop = document.body.scrollTop; //safari fix
	}
	
	var oFrameLeft = parseInt(iLeft) + parseInt(offsetLeft);
	
	oFrame.style.left = "-" + oFrameLeft + "px";
	oFrame.style.width = document.body.clientWidth;
	
	oMask.style.height = iTop + "px";
	
	var oBottomMask = document.createElement('div');
	oBottomMask.setAttribute('id', "divBottomMask");
	
	//mask + cropper
	oBottomMask.style.top = parseInt(oMask.style.height) + parseInt(oFrame.style.height) + 'px';
	//document - cropper - top mask
	oBottomMask.style.height = parseInt(document.body.offsetHeight) - parseInt(oFrame.style.height) - parseInt(oMask.style.height) + "px"; 
	
	oBody.style.overflow = "hidden";
	
	//stop the bottom of the page from poking through in IE
	var oBlockBottom = document.getElementsByClassName('blockbottom');
	oBlockBottom[0].style.zIndex = "-1";
	
	//attach oBottomMask to body
	oBody.insertBefore(oBottomMask, oBody.firstChild);
	
  }

}



function hideMask(){
   oBody = document.getElementsByTagName("body").item(0);
   oMask = get('divMask');
   oBody.style.overflow = 'auto';
   
   //check this in IE6
   if (oMask) {
   		oBody.removeChild(oMask);
		
		if(get("divBottomMask")){
			oBody.removeChild(get("divBottomMask"));
		}
		
		if(get("divRightMask")){
			oRightMask = get("divRightMask");
			oRightMask.parentNode.removeChild(oRightMask);
		}
		
		if(get("divLeftMask")){
			oLeftMask = get("divLeftMask");
			oLeftMask.parentNode.removeChild(oLeftMask);
		}
		
   }
   
   var oBlockBottom = document.getElementsByClassName('blockbottom');
   oBlockBottom[0].style.zIndex = "1";
   
}

function closePreview(sPreviewId){
   	oBody = document.getElementsByTagName("body").item(0);
   	oPreview = get(sPreviewId);
   	oBody.removeChild(oPreview);
	hideMask();
}

function clearDragHints(){
  aCroppers = document.getElementsByClassName('cropper');
  for (ii=0; ii < aCroppers.length; ii++) {
     aCroppers[ii].innerHTML = '';
  }
}

function returnToPicker(){
	if(get("hidReturnToPicker")) {
		get("hidReturnToPicker").value= "1";
		saveCroppers();
	}
}

function saveCroppers (bCheckImages) {

	//if we have some images still selected postback
	var aCheckboxes = document.getElementsByClassName('ignorecheck');
	var iImageCount = getElementsByClass('imageframeandcontrols').length;
	var iPreviewImageCount = getElementsByClass('imageframeandcontrolspreview').length;
	var iIgnoreCount = 0;
	if(aCheckboxes.length > 0){
		for (var i=0; i < aCheckboxes.length; i++) {
			if(aCheckboxes[i].checked ==  true){
				iIgnoreCount ++;
			}
		}
	}

	if(iIgnoreCount < iImageCount || iIgnoreCount < iPreviewImageCount || bCheckImages != true){
		var sPostback = "";
		var aCropperInfo = document.getElementsByClassName('croppedinput');
	
		for (var i=0; i < aCropperInfo.length; i++) {
			sPostback += (aCropperInfo[i].value);
			if (i < aCropperInfo.length -1){
				sPostback += ",";
			}
		}
	
		get("hidPostbackData").value = sPostback;
	
	    var oForm
	    oForm = get('frmStage3');
	    postBackForm('frmStage3');
	}else{
		alert(string00058);	
	}

}

function hideCropperPhoto(sPhotoId, sDisplayMode){
	
	//Get all the cards the user has on this page.
	//This include all those that have been dropped, so we still need to distinguish
	if (sDisplayMode == 'preview') {
		var aCards = getElementsByClass('fullpreviewimageCropper');
		var oCheckbox = get('chkIgnorePreview_' + sPhotoId);
		var oCropperPhoto = get('divPhotoMask_' + sPhotoId);
	} else {
		var aCards = getElementsByClass('imageframeandcontrols');
		var oCheckbox = get('chkIgnore_' + sPhotoId);
		var oCropperPhoto = get('divPhotoMask_' + sPhotoId);
	}
	
	//Get the div with the checkbox checked and either hide or show it
	//depending on previous status
	if (oCheckbox.checked == true) {
		oCropperPhoto.style.display = 'block';
	}
	else {
		oCropperPhoto.style.display = 'none';
	}
	
	//create arrays for those cards that have been deselected and those that remain selected
	var aSelectedCards = new Array();
	var aUnselectedCards = new Array();
	
	//Populate these arrays depending on display status as dealt with above
	for (var i = 0; i< aCards.length; i++){
		var oCard = aCards[i];
		var iId = oCard.id.substring(22, oCard.id.length);
		var oPhotoMask = get('divPhotoMask_'+iId);
		if (oPhotoMask.style.display == 'none'){
			aSelectedCards[aSelectedCards.length] = iId;
		}else{
			aUnselectedCards[aUnselectedCards.length] = iId;
		}
	}
	
	//calculate the number of each card for displaying to the user
	var iCardCount = get('hidPackSize').value;
	var iNumberOfEach = Math.floor(iCardCount / aSelectedCards.length);
	
	if(iNumberOfEach == Infinity){
		iNumberOfEach = -1;
	}
	var iRemander = iCardCount - (iNumberOfEach * aSelectedCards.length);

	//update the visual display for the user.  Cos we're helpful like that!
	//First the numbers of cards that they are getting
	//First preview mode
	if (sDisplayMode == "preview") {
		
		oQuantity = get('spnQuantity');
		oRoughly = get('spnRoughly');
		
		iNewNumberOfEach = 0;
		if (i < iRemander) {
			iNewNumberOfEach = iNumberOfEach + 1;
		}
		else {
			iNewNumberOfEach = iNumberOfEach;
		}
		
		oQuantity.innerHTML = '<strong>' + iNewNumberOfEach + '</strong>';
		if(iRemander == 0 || iNewNumberOfEach == 0) {
			oRoughly.innerHTML = "";
		} else {
			oRoughly.innerHTML =  " " + string00077 + " ";
		}
		
	}
	else {
		//normal (old style) crop mode
		for (var i = 0; i < aSelectedCards.length; i++) {
		
			oQuantity = get('spnQuantity_' + aSelectedCards[i]);
			oCopyText = get('spnCopy_' + aSelectedCards[i]);
			
			iNewNumberOfEach = 0;
			if (i < iRemander) {
				iNewNumberOfEach = iNumberOfEach + 1;
			}
			else {
				iNewNumberOfEach = iNumberOfEach;
			}
			
			oQuantity.innerHTML = '<strong>' + iNewNumberOfEach + '</strong>';
			if (iNewNumberOfEach == 1) {
				oCopyText.innerHTML = string00060;
			}
			else {
				oCopyText.innerHTML = string00059;
			}
		}
		
		//Now reassure them that they are getting none of the ones they deselected
		
		for (var i = 0; i < aUnselectedCards.length; i++) {
			oCopyText = get('spnCopy_' + aUnselectedCards[i]);
			oQuantity = get('spnQuantity_' + aUnselectedCards[i]);
			oQuantity.innerHTML = '<strong>0</strong>';
			oCopyText.innerHTML = string00059;
		}
	}

}

	//This method is called only when we have had to remove some of the user's images on the sly
	//and thus have to update the display
	function calculateQuantities(){
		//Get all the cards the user has on this page.
		//All cards are selected as this is run before user does anything
		var aCards = getElementsByClass('imageframeandcontrols');
		var aSelectedCards = new Array();
		
		for (var i = 0; i< aCards.length; i++){
			var oCard = aCards[i];
			var iId = oCard.id.substring(22, oCard.id.length);
			aSelectedCards[aSelectedCards.length] = iId;
		}
		
		//calculate the number of each card for displaying to the user
		var iCardCount = get('hidPackSize').value;
		var iNumOfEach = Math.floor(iCardCount / aSelectedCards.length);
		var iRemander = iCardCount - (iNumOfEach * aSelectedCards.length);
		
		//update the visual display for the user.  Cos we're helpful like that!
		//First the numbers of cards that they are getting
		for (var i = 0; i<aSelectedCards.length; i++){
			oQuantity = get('spnQuantity_' + aSelectedCards[i]);
			if (i < iRemander){
				oQuantity.innerHTML = '<strong>'+(iNumOfEach+1)+'</strong>';
			}else{
				oQuantity.innerHTML = '<strong>'+ iNumOfEach+'</strong>';
			}
		}	
}

function getproductType(){
	return get('hidProductType').value;
}


function showEdit(sPhotoId, sDisplayMode){
	displayMask("divImageFrameControls_" + sPhotoId);
	setupCropper(sPhotoId, false, sDisplayMode);
}

function loadCropperCallback(){
	
}

function closeEdit(sPhotoId, bSafe, sDisplayMode){
	//show loading gif
	if(sDisplayMode == 'crop'){
		hidePreviewImage(sPhotoId);
	}
	
	oImage = get('imgFullPreview_' + sPhotoId);
	
	//work oout the url
	var sUrl = get('hidOrignalImageUrl_' + sPhotoId).value;
	aScaleValues = get('hidOrignalImageScale_' + sPhotoId).value.split('_');
	
	var aImageInfo = getImageInfo(sPhotoId, bSafe, sDisplayMode);
	
	var oDragger = get("divDragger_" + sPhotoId);
	
		
	var oScale = get("hidOriginalToPreviewScale_" + sPhotoId).value;
	var oCropper = get("divCropper_" + sPhotoId);

	if (sDisplayMode == "crop") {
		var iZoom = safeInt(oImage.width) / aImageInfo[3];
		get('hidZoom_' + sPhotoId).value = iZoom;

		var iCropX = ((safeInt(oCropper.style.left) - safeInt(oImage.style.left)) / iZoom) / oScale;
		var iCropY = ((safeInt(oCropper.style.top) - safeInt(oImage.style.top)) / iZoom) / oScale;
		var iCropWidth = (safeInt(oCropper.style.width) / iZoom) / oScale;
		var iCropHeight = (safeInt(oCropper.style.height) / iZoom) / oScale;
	}
	else {
		var iZoom = safeInt(oDragger.style.width) / aImageInfo[3];
		get('hidZoom_' + sPhotoId).value = iZoom;

		var iCropX = ((safeInt(oCropper.style.left) - safeInt(oDragger.style.left)) / iZoom) / oScale;
		var iCropY = ((safeInt(oCropper.style.top) - safeInt(oDragger.style.top)) / iZoom) / oScale;
		var iCropWidth = (safeInt(oCropper.style.width) / iZoom) / oScale;
		var iCropHeight = (safeInt(oCropper.style.height) / iZoom) / oScale;

	}	

	var iResizeWidth = get('hidResizeWidth_'+sPhotoId).value;
	var iResizeHeight = get('hidResizeHeight_'+sPhotoId).value;
	var iResizeMax = get('hidResizeMax_' + sPhotoId).value;

	var iRotation = safeInt(get('hidOrignalRoteBy_' + sPhotoId).value);	
	//sCropUrl = "../crop.php?url={url}&crop_w={crop_width}&crop_h={crop_height}&crop_x={crop_x}&crop_y={crop_y}&resize_w={resize_width}&resize_h={resize_height}&r={rotation}";
	sCropUrl = "../crop.php?url={url}&crop_w={crop_width}&crop_h={crop_height}&crop_x={crop_x}&crop_y={crop_y}&max={resize_max}&r={rotation}";	sCropUrl = sCropUrl.replace("{url}", escape(sUrl)).replace("{crop_x}", Math.round(iCropX)).replace("{crop_y}", Math.round(iCropY))
	sCropUrl = sCropUrl.replace("{crop_width}", Math.round(iCropWidth)).replace("{crop_height}", Math.round(iCropHeight));
	sCropUrl = sCropUrl.replace("{resize_width}", iResizeWidth).replace("{resize_height}", iResizeHeight);	
	sCropUrl = sCropUrl.replace("{resize_max}", iResizeMax);	
	sCropUrl = sCropUrl.replace("{rotation}", iRotation);
	
	//update the preview image
	oFullPreview = get('imgFullPreview_' + sPhotoId);
	//hide loading gif
	if (sDisplayMode) {
		//this image was hidden when the cropper was opened
		//let's show it again on the onload
		oFullPreview.onload = function ()  {
			showPreviewImage(sPhotoId);
		};
	}
	
	oFullPreview.src = sCropUrl;
	
	//close the preivew and hide the mask
	//sPreviewID = "divNewPreview" + sPhotoId
	//closePreview(sPreviewID)
	hideMask();
	oPreview = get("divImageFrameControls_" + sPhotoId);
	oPreview.style.display = "none";
	
	if(sDisplayMode == "crop" && get("hidRotatedPreview_" + sPhotoId).value == 1){ 
		if(get('hidRotatePreview_' + sPhotoId).value != get('hidNewRotatePreview_' + sPhotoId).value) {
			// the crop was rotated - lets change the preview bg to match
			swapFullPreviewOrientation(sPhotoId);
		}
	}
	
	
}


function getImageLoaders(sJsonUrl, sImageType) {
	//this runs from <script> tag on the cropper page.
	//It collects all the images on the page which have a class="getImageLoaders"
	//And adds them to a list of large images we now need to grab.
	var aImages = getElementsByClass('getImageLoaders');
	
	for (var i = 0; i < aImages.length; i++) {
		var sPhotoId = getPhotoIdFromImageId(aImages[i].id);
		
		if (sImageType != "" &&  sPhotoId!= "") {
			aImages[i].onload = function(){
				updateTinyImagesLoadedQuantity(sPhotoId);
			};
			
			//reset image class so if this function is called again, we don't find these images
			aImages[i].setAttribute('class', "transparent");
			aImages[i].setAttribute('className', "transparent"); //ie6
		}
	}
}

function updateTinyImagesLoadedQuantity(sPhotoId) {
	
	//get the proper id of the image
	var sImageId = getPhotoIdFromImageId(sPhotoId);
	//get the list of small loaded images
	var aTinyImagesLoaded = get("hidLoadedImages").value
	//update with the newest id 
	get("hidLoadedImages").value = get("hidLoadedImages").value + sImageId + ",";	
	var aImages = get("hidLoadedImages").value.split(",");
	if(aImages.length < 4) {
		//get the larger images for these 4 
		for (var i = 0; i < aImages.length; i++) {
			if(aImages[i] != "," && aImages[i] != ""){
				loadLargeImage(aImages[i]);
			}
		}
		
		
		//call getImageLoaders again, so that we can get the next  of  the 4 small images
		getImageLoaders(get("hidJsonUrl").value, 'original');
		
	} else {
		//reset the loaded image list so we can start again with the next batch .
		get("hidLoadedImages").value = "";
	}
	
}

function getPhotoIdFromImageId(sPhotoId) {
	if(sPhotoId.match("_")) {
		sPhotoId = sPhotoId.split("_");
		sPhotoId = sPhotoId[1];
	}
	//alert('setting ' + sPhotoId)
	return sPhotoId;
}


function loadLargeImage(sPhotoId) {
	
	var sPhotoId = getPhotoIdFromImageId(sPhotoId);
	
	//called from onload attribute of small cropper images (above)
	//or from checkLoadedImages if we didn't get them all first time round
	//we can now start to pull in the larger images
	var aLoadedImages = get("hidLargeLoadedImages").value;
	
	// don't try it with one we already have though
	if (sPhotoId == "" || aLoadedImages.match(sPhotoId)) {
		//something went wrong here, don't get this id
	} else {
		var sJsonUrl = get("hidJsonUrl").value;
		var sPost = "";
		sPost = "image_type=original&image_id=" + sPhotoId + "&builder_key=" + get("hid_builder_key").value;
		var oAjax = new Ajax.Request(sJsonUrl, { method: 'post', postBody: sPost, onComplete: this.loadImagesCallback });
		
		//store the id we've just used so we don't do it again.
		if(!aLoadedImages.match(sPhotoId)){
			get("hidLargeLoadedImages").value = get("hidLargeLoadedImages").value + sPhotoId + ",";	
		}
	}
	
	//run through the lists again and check we got them all
	checkLoadedImages();
}


function loadImagesCallback(originalRequest) {

	//get the response and convert to js
	var oResponse = originalRequest.responseText;
	var oPhotos = eval('('+oResponse+')');
	
	//get the larger size url and set it as the crop image src.
	for(i=0;i<oPhotos.length;i++) {
		
		var sPhotoId = oPhotos[i].id;
		var oPreLoadedImage = new Image();
		//show the larger image - but only once the new Image() has loaded
		
		
		oPreLoadedImage.onload = function ()  {
			//showPreviewImage(sPhotoId);
		};
		
		//preload the image (set the onload before the src)
		oPreLoadedImage.src = oPhotos[i].url_large;
		
		//reset the image url to the larger one, scale and dimensions
		get('hidOrignalImageUrl_' + sPhotoId).value = oPhotos[i].url_large;
		
		var oImage = get('imgFullPreview_' + sPhotoId);
		var sDisplayMode = get('hidDisplayMode').value;
		
		oImage.onload = function ()  {
			//showPreviewImage(sPhotoId);
		};
		
		
		//reset all the crop info
		closeEdit(sPhotoId, false, sDisplayMode);
	}
}

function showPreviewImage(sPhotoId) {
	//turn the image back on
	//should do some nice fading or something here.
	var imgFullPreview = get('imgFullPreview_' + sPhotoId);
	imgFullPreview.setAttribute('class', "");
	imgFullPreview.setAttribute('className', "");	//ie6
	imgFullPreview.style.display = "block";
	//hide the loading P
	get('pImgLoading_' + sPhotoId).style.display = "none";
}

function hidePreviewImage(sPhotoId) {
	//turn the image transparent
	//should do some nice fading or something here.
	var oImage = get('imgFullPreview_' + sPhotoId);
	oImage.setAttribute('class', "transparent");
	oImage.setAttribute('className', "transparent");	//ie6
	//hide the loading P
	get('pImgLoading_' + sPhotoId).style.display = "block";
}

function cancelEdit(sPhotoId, sDisplayMode) {
	//reset rotated
	get("hidRotatedPreview_" + sPhotoId).value = 0;
	//turn the image back on
	showPreviewImage(sPhotoId);
	//hide the cropper & mask
	var oFrame = get("divImageFrameControls_" + sPhotoId);
	oFrame.style.display = "none";
	hideMask();
	//sPreviewID = "divNewPreview" + sPhotoId
	//closePreview(sPreviewID)
}

function checkLoadedImages() {
	
	if(get("hidLargeLoadedImages")) {
		//get the images we have loaded
		var aAlreadyLoaded = get("hidLargeLoadedImages").value.split(",");
		//and the ones we know we need to
		var aOriginalNeedLoading = get("hidIdsToCrop").value.split(",");
		
		//get them in the same order as each other 
		//default sort() is alphabetical-numberical (not actual numberical)
		//but this should be fine.
		aAlreadyLoaded.sort();
		aOriginalNeedLoading.sort();
		
		//check the lists against each other
		for (i = 0; i < aOriginalNeedLoading.length; i++) {
			//make sure we're not passing rubbish in
			if (isValidId(aOriginalNeedLoading[i]) && isValidId(aAlreadyLoaded[i])) {
				//check whether new id is already loaded
				if (aOriginalNeedLoading[i] != aAlreadyLoaded[i]) {
					//if we don't have it, go fetch
					loadLargeImage("imgFullPreview_" + aOriginalNeedLoading[i]);
				} else {
					//we have them all?
					//aUpdater.stop();
				}
			}
		}
	}
	
}

function isValidId(sId) {
	var bValid;
	if(sId == "," || sId == "undefined" || sId == ""){
		bValid = false;
	} else {
		bValid = true;
	}
	
	return bValid;
	
}

function runUpdater(){
	//check if we have downloaded all the images yet
	var aUpdater = new PeriodicalExecuter(checkLoadedImages, 5);
}