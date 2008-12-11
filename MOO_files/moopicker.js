function MooPicker (sJsonUrl, iPackSize, bIsHolidayCards){

	this.jsonUrl = sJsonUrl;
	this.packSize = iPackSize;
	this.hasPhotos = false;
	this.hasSets = false;
	this.hasTags = false;
	this.hasYears = false;
	this.hasGroupTags = false;
	this.isBot = false;
	this.scrollAlertUnit = 2000;
	this.nextScrollAlert = -2000;
	this.currentScrollPage = 0;
	this.lastActiveDuplicatorId = "";
	this.originalTag='';
	this.isHolidayCards = bIsHolidayCards;
	this.originalOtherTag='';
	this.groupId = ''; 
	this.oDelay = 0;
	
	this.setup = function(){
		//got any piccies / tags / sets? years?
		if (get("hidHasPhotos").value == 1){this.hasPhotos = 1;}
		if (get("hidHasSets").value == 1){this.hasSets = 1;}
		if (get("hidHasTags").value == 1){this.hasTags = 1;}
		if (get("hidHasYears").value == 1){this.hasYears = 1;}
		if (get("hidIsBot").value == 1){this.isBot = 1;}
		if (get("hidIsGroup").value == 1){this.hasOtherTags = 1; this.groupId = get('hidGroupId').value;}		

		//set defaults
		if (get("hidProductId").value == '171') {
			this.changeTab("other");
		} else {
			
			if(this.isBot == false){
				this.changeTab("photostream");
			}else{
				this.changeTab("other");
			}
				
		}
		
		//make any existing images draggable
		var aPicked = document.getElementsByClassName('picked');
			for(i=0;i<aPicked.length;i++) {	
				oDrag = new Draggable(aPicked[i].id,{revert:true});
				oDrag.options.change = function (value){
			        if (get("divDeletePicked")) {
						get("divDeletePicked").className="hover";					
					}
			    }	
			}

		//drop area
		if (!this.isHolidayCards) {
			Droppables.add('divPickedImages', 
		  	   {
		  	       hoverclass:'imagehover',
		  	       onDrop: function(element, dropon, event){
		  	           oMooPicker.onImageDropped(element, dropon, event);
		  	       }
		  	   });			
		} else {
			Droppables.add('divFrontCanvas',
		  	   {
					hoverclass:'imagehover',
					onDrop: function(element, dropon, event){
						oMooHolidayCard.updateCanvas(element.id);
					}
		  	   });
		}
	
		//delete area
		if (get("divDeletePicked")) {
			Droppables.add("divDeletePicked", {
				hoverclass: 'hover',
				onDrop: function(element, dropon, event){
					oMooPicker.onImageDelete(element, dropon, event);
				}
			});
		}
	
		//show count message
		this.showCounter();
		if(this.getImageCount() ==0){
			this.showDragHint();
		}

		//Remove validator elements
		if(get("ulPickedImages")) {
			get("ulPickedImages").removeChild(get("liValidate"))		
		}

		//Scriptaculous autocomplete
		if (this.hasTags == true){
			var oAjaxAC = new Ajax.Autocompleter("txtTag", "div_autocomplete_choices", this.jsonUrl + "?search_type=taglist&builder_key=" + get("hid_builder_key").value, {afterUpdateElement: this.tagSelected, frequency:0.1});
			this.originalTag = get('txtTag').value;
		}
		
		if (this.hasOtherTags == true){
			var oAjaxACG = new Ajax.Autocompleter("txtGroupTag", "div_group", this.jsonUrl + "?search_type=taglist&builder_key=" + get("hid_builder_key").value + "&group=" + this.groupId, {afterUpdateElement: this.groupTagSelected, frequency:0.1});
			this.originalOtherTag = get('txtGroupTag').value;
		}
		
	}
	
	this.resetFilmstrip = function (){
		get("ulBrowserImages").innerHTML = "";
		get("pLoadingInfo").style.display ="block";
		this.currentScrollPage = 0;
		this.resetScroll();
	}
	
	this.loadingEnd = function (){
		get("pLoadingInfo").style.display ="none";
	}

	this.changeTab = function(sSelectedTab){
		
		//reset selected
		aTabs = document.getElementsByClassName('browsertab');
		for(i=0;i<aTabs.length;i++) {		
			aTabs[i].className = "browsertab";
		}
		
		//reset filters and tools
		get("ddlSetFilter").style.display="none";
		get("ddlYearFilter").style.display="none";
		get("txtTag").style.display="none";
		get("txtGroupTag").style.display="none";
		get("lbl_autocomplete").style.display="none";
		get("lblTag").style.display="none";
		//get("pCompHint").style.display="none";

		var oRandomFill = get("aRandomFill");
		var oRandom10 = get("aRandom10");	
		if (oRandomFill) {
			oRandomFill.className = "";
			oRandomFill.href="javascript:oMooPicker.fillRandom()";			
		}
		if (oRandom10) {
			oRandom10.className = "";
			oRandom10.href="javascript:oMooPicker.random(10)";			
		}
		
		this.mode = sSelectedTab;
		
		//get the piccies
		switch (sSelectedTab){
			case "photostream":
				
				sSelectedTab ="aTab_PhotoStream";
				if (this.hasPhotos == true){
					this.setImages('photostream', '', true);
					this.setPhotoBrowserWarning("");
				}else{
					this.setPhotoBrowserWarning(string00061);	
					this.clearImageBrowser();
				}
				//this.mode = "photostream";
			break;
			case "set":
				oFilterDropdown = get("ddlSetFilter");
				
				get("txtTag").style.display="none";
				get("ddlYearFilter").style.display="none";
				get("lbl_autocomplete").style.display="none";
				
				oFilterDropdown.style.display = "inline";
				
				sSelectedTab ="aTab_Set";
				if (this.hasSets == true){
					this.setImages('set', oFilterDropdown.value, true);
					this.setPhotoBrowserWarning("");
				}else{
					this.setPhotoBrowserWarning(string00062);	
					this.clearImageBrowser();
				}
				//this.mode = "set";
				if (this.hasSets == true){
					oFilterDropdown.style.display="inline";
				}else{
					if (oRandomFill && oRandom10) {
						oRandomFill.className += " disabled";
						oRandomFill.href=""
						oRandom10.className += " disabled";
						oRandom10.href="";						
					}
				}	
			break;
			
			case "year":
				
				//this.mode = "year";
				oFilterDropdown = get("ddlYearFilter");
				
				get("txtTag").style.display="none";
				get("ddlSetFilter").style.display="none";
				get("lbl_autocomplete").style.display="none";
				oFilterDropdown.style.display = "inline";
				sSelectedTab ="aTab_Year";
				
				if (this.hasYears == true){
					this.setImages('year', oFilterDropdown.value, true);
					this.setPhotoBrowserWarning("");
				}else{
					this.setPhotoBrowserWarning(string00063 + ' ' + oFilterDropdown.value);	
					this.clearImageBrowser();
				}
				
				
				
				if (this.hasYears == true){
					oFilterDropdown.style.display="inline";
				}else{
					if (oRandomFill && oRandom10) {
						oRandomFill.className += " disabled";
						oRandomFill.href=""
						oRandom10.className += " disabled";
						oRandom10.href="";						
					}
				}
				
				
			break;
			
			case "tag":
				
				get("txtTag").value = this.originalTag;
				
				oDivAutoCompleteChoices = get("div_autocomplete_choices");
				oLblAutoComplete = get("lbl_autocomplete");
				oInputAutoComplete = get('txtTag');
				
				
				oInputAutoComplete.style.display='inline';
				oLblAutoComplete.style.display='inline';
				
				oMooPicker.setImages('tag', get('txtTag').value, true);
				oInputAutoComplete.select();
				oInputAutoComplete.focus();
				
				//reset suggestions
				oDivAutoCompleteChoices.innerHTML = "";
				sSelectedTab ="aTab_Tag";

				if (this.hasTags == true){
					this.setPhotoBrowserWarning("");
				}else{
					this.setPhotoBrowserWarning(string00064);
					this.clearImageBrowser();
				}
				
				//this.mode = "tag";
				
				if (this.hasTags == true) {
					
					//style and select
					oDivAutoCompleteChoices.style.display = 'inline';
					oDivAutoCompleteChoices.style.top = 24 + 'px';
					oDivAutoCompleteChoices.style.right = 1 + 'px';
					//for Safari and Opera to stop them hiding suggestions behind save button
					oDivAutoCompleteChoices.style.zIndex = 3;
					get('ulBrowserImages').style.zIndex = 1;
					
					oInputAutoComplete.select();
					oInputAutoComplete.focus();
					
				}else{
					if (oRandomFill && oRandom10) {
						oRandomFill.className += " disabled";
						oRandomFill.href = ""
						oRandom10.className += " disabled";
						oRandom10.href = "";
					}
				}
				
				
			break;
			
			case "group":
					sSelectedTab ="aTab_Comp";
					this.setImages('group', '', true);
					this.setPhotoBrowserWarning("");
				//	get("pCompHint").style.display = "block";
					//this.mode = "group";
					
					var selectedgallery = get("hidSelectedGallery");
					selectedgallery.value = "true";	
			break;
			case "other":
					get('aResetGroupPhotos').className = "disabled";
					get("txtGroupTag").value = this.originalOtherTag;
					
					oDivAutoCompleteChoices = get("div_group");
					//for Safari and Opera to stop them hiding suggestions behind save button
					oDivAutoCompleteChoices.style.zIndex = 3;
					get('ulBrowserImages').style.zIndex = 1;
					oLblAutoComplete = get("lblTag");
					oInputAutoComplete = get('txtGroupTag');
					
					sSelectedTab = "aTab_Holidays";
					this.setImages('other', '', true);
					
					this.setPhotoBrowserWarning("");
					//this.mode = "holiday";
					
					
					//reset suggestions
					oDivAutoCompleteChoices.innerHTML = "";
					oInputAutoComplete.value="";
					oInputAutoComplete.style.display='inline';
					oLblAutoComplete.style.display='inline';
					oInputAutoComplete.select();
					oInputAutoComplete.focus();
					
					
					var selectedgallery = get("hidSelectedGallery");
					selectedgallery.value = "true";	
			break;
			
		}
		
		//Set selected
		get(sSelectedTab).className = "browsertab selected";	
	}
	
	this.tagSelected  = function () {
		oMooPicker.setImages('tag', get('txtTag').value, true);
	}
	
	this.groupTagSelected  = function () {
		get('aResetGroupPhotos').className = "";
		oMooPicker.setImages('otherowner', get('txtGroupTag').value, true);
	}
	
	
	this.setImages = function (sSearchType, sSearchArgument, bReset, bNoCache){
		
		if (bReset == true){
			this.resetFilmstrip();
		}
		
		if (bNoCache == true){
			sNoCache = "&nocache=1";
		}
		else{
			sNoCache = "";
		}

		//increase the scroll page
		this.currentScrollPage +=1;
		
		var sPost = "";
		sPost = "search_type=" + sSearchType + "&search_argument=" + sSearchArgument + "&search_count=" + 100 + "&search_page=" + (this.currentScrollPage) + "&builder_key=" + get("hid_builder_key").value + sNoCache;
		var oAjax = new Ajax.Request(this.jsonUrl, {method: 'post',  postBody: sPost,  onComplete: this.addImagesCallback});
		
	}
	
	this.addImagesCallback = function (originalRequest){
		
		oFilmStrip = get("ulBrowserImages");
		
		//get the response and convert to js
		var oResponse = originalRequest.responseText;
		
		var oPhotos = eval('('+oResponse+')');

		//loop through images and add to the list
		var aImageId = new Array();
		sImageHtml = "";
		var imgTitle = "";
		
		if(oPhotos.length < iPackSize){
			if (get("aRandomFill")) {
				get("aRandomFill").innerHTML = string00065;
				get("aRandomFill").setAttribute("title", string00147);				
			}
		} else {
			if (get("aRandomFill")) {
				get("aRandomFill").innerHTML = string00066;			
			}
		}
		
		for(i=0;i<oPhotos.length;i++) {			
			
			oImage = document.createElement('li');
			
			if(oPhotos[i].title == undefined) {
				//just empty the title if we don't have it
				oPhotos[i].title = "";
			}
			
			// Check for mag URL
			var sMagUrl = oPhotos[i].url_mag;
			
			if (sMagUrl) {
				oImage.innerHTML = '<img id="imgBrowser_' + oPhotos[i].id +  '" class="browserimage" src="' + oPhotos[i].url +  '" alt="' + oPhotos[i].title + '"  title="'  + oPhotos[i].title + '" onmouseover="oMooPicker.imgMagnifyDisplay(true, this.id, \'' + oPhotos[i].url_mag + '\');" onmouseout="oMooPicker.imgMagnifyDisplay(false);" />';
				oImage.firstChild.url_mag = oPhotos[i].url_mag;
			} else {
				oImage.innerHTML = '<img id="imgBrowser_' + oPhotos[i].id +  '" class="browserimage" src="' + oPhotos[i].url +  '" alt="' + oPhotos[i].title + '"  title="'  + oPhotos[i].title + '" />';				
			}
			
			oFilmStrip.appendChild(oImage);
			
			oSubsDraggable = new SubsDraggable('imgBrowser_' + oPhotos[i].id,{dragelement:oMooPicker.getDragElement});
		}

		get("pLoadingInfo").style.display ="none";

		// what to do if no photos are returned?
		if(oPhotos.length < 1 && oFilmStrip.childNodes.length == 0){
			var oWarning = get("pNoPhotos");
			// TODO
			// This is really a non-instantiated version of this.setPhotoBrowserWarning(),
			// and possibly not the best way to do things, but it's a temporary solution1
			// until fotolog starts using YEARS instead of TAGS, or we can work out another way
			// to test and warn for an empty image array.
			//
			// we don't want to override any warnings that have already been set
			if (oWarning.childNodes[0].innerHTML == "") {
				oWarning.innerHTML = '<span class="infobox">' + string00067 + '</span>';
				oWarning.style.display="block";
			}
		}else{
			var oWarning = get("pNoPhotos");
			oWarning.childNodes[0].innerHTML = "";
			oWarning.style.display="none";
		}
		
		if (this.mode == 'year') {
			oBrowserTab = get("aTab_Year");
			var oRandomFill = get("aRandomFill");
			var oRandom10 = get("aRandom10");
			if (oBrowserTab.className == 'browsertab' && (oRandomFill && oRandom10)) {
				this.hasYears = false;
				oRandomFill.className += " disabled";
				oRandomFill.href = ""
				oRandom10.className += " disabled";
				oRandom10.href = "";
			}
			else 
				if (oBrowserTab.className == 'browsertab selected' && (oRandomFill && oRandom10)) {
				
					this.hasYears = true;
					oRandomFill.className = "";
					oRandomFill.href = "javascript:oMooPicker.fillRandom()";
					oRandom10.className = "";
					oRandom10.href = "javascript:oMooPicker.random(10)";
				}
		}
	}
	
	// Image magnifier
	this.imgMagnifyDisplay = function(bState, oThumbId, sMagnifyUrl) {
		if (bState == true) { // Show
			var oContainer = get('divPage');

			imgMagnifyBuilder = function(){
				oMagnify = new Image();
				oMagnify.onload = function(){
					oThumb = get(oThumbId);
					if (!oThumb) return false;
					
					var oMagnifyHolder = Element.extend(document.createElement("div"));
					oMagnifyHolder.id = "divMagnifyHolder";
					
					var iOrientationOffset = (oMagnify.width - 160) / 2; // we want the preview centered
					var iTopPos = Position.cumulativeOffset(oThumb)[1] + 8 + oThumb.height;
					if (isIE) iTopPos +=8; // IE fix
					var iLeftPos = Position.positionedOffset(oThumb)[0] + 44 - oThumb.width - iOrientationOffset;

					if (oThumb.parentNode.parentNode.id == 'ulBrowserImages') {
						iLeftPos = Position.positionedOffset(oThumb)[0] + Position.positionedOffset(oThumb.parentNode.parentNode)[0] - iOrientationOffset + 19; 
					}

					oMagnifyHolder.style.left = iLeftPos + "px";
					oMagnifyHolder.style.top = iTopPos + "px";
					if (isIE) oMagnifyHolder.style.width = (oMagnify.width + 18) + "px"; // IE fix
					oMagnifyHolder.innerHTML = '<div id="divMagnifyArrow"></div><div id="divMagnifyImage" style="width: ' + oMagnify.width + 'px; height: ' + oMagnify.height + 'px"><img src="' + oMagnify.src + '" /></div>'; // Styles for IE 6
					if (get("divMagnifyHolder")) 
						oContainer.replaceChild(oMagnifyHolder, get("divMagnifyHolder")); //replace existing preview
					else
						oContainer.appendChild(oMagnifyHolder);
				}
				oMagnify.src = sMagnifyUrl; // must be after onload, or strange things happen in IE
			}
			this.oDelay = setTimeout("imgMagnifyBuilder()", 1000); // Start timeout
		} else if (bState == false) { // Hide
			clearTimeout(this.oDelay); // Stop timeout in progress if we have any
			if (!get("divMagnifyHolder")) 
				return false; // Check holder exists before remove
			get("divMagnifyHolder").remove();
		}
	}
	
	this.clearImageBrowser = function() {
		get("ulBrowserImages").innerHTML = "";
		get("pLoadingInfo").hide();
	}

	this.scroll = function(sDirection) {
		
		//stop double clicking by disabling links
		showOrHideById('divScrollRight','block');
		showOrHideById('divScrollLeft','block');
		
		var iShift = 648;
		
		if (this.canScroll(sDirection, iShift) == true || sDirection == "right"){
			var oImageHolder = get("ulBrowserImages");
			var bScrollAlert = false;
			if (sDirection == "right"){
				// When final list item appears in viewer, stop scrolling right
				var iLastPos = get("ulBrowserImages").lastChild.offsetLeft + parseInt(get('ulBrowserImages').style.left);
				if (iLastPos >= iShift) {
					new Effect.MoveBy('ulBrowserImages', 0, parseInt("-" + iShift));
				}
				if (parseInt(get('ulBrowserImages').style.left) <= this.nextScrollAlert){
					bScrollAlert = true;
				}
			}else{
				new Effect.MoveBy('ulBrowserImages', 0, iShift);
			}
			if (bScrollAlert == true){
				setTimeout("oMooPicker.topUpPhotos();", 1000);
			}
		}
		
		//put the links back!
		setTimeout("showOrHideById('divScrollRight','none')", 1000);
		setTimeout("showOrHideById('divScrollLeft','none')", 1000);
		
	}
	
	this.resetScroll = function(){
		get("ulBrowserImages").style.left = 0;
	}
	
	this.canScroll =  function (sDirection, iProposed){	
		
		var oImageHolder = get("ulBrowserImages");
		var oImageScroller = get("divBrowserScroller");	
		var bCanScroll = true;
		
		if (sDirection == "left" && (parseInt(oImageHolder.style.left) + iProposed) <=0){
			bCanScroll = true;
		}else{
			bCanScroll = false;
		}

		if (sDirection == "right"){
			var iScrollerWidth = oImageHolder.offsetWidth;
			var iStripWidth = oImageHolder.offsetWidth;
			var iStripPosition = parseInt(oImageHolder.style.left);

			if ((iStripPosition - iProposed) < (iStripWidth - iScrollerWidth)){
				bCanScroll = false;
			}else{
				bCanScroll = true;
			}
		}
		return bCanScroll;

	}

	this.topUpPhotos = function(){
		//only do this for photostream and tags
		if (this.mode == "photostream" || this.mode == "comp" || this.mode == "holiday" || this.mode == "other"){
			this.setImages(this.mode);
		}
		if (this.mode == "tag"){
			this.setImages(this.mode, get("txtTag").value);
		}
		this.nextScrollAlert = this.nextScrollAlert - this.scrollAlertUnit;
	}
	
	this.getDragElement = function(element) {
		var oElement = element.cloneNode(true);
	 	oElement.id = 'sub'+element.id;
	 	oElement.style.position = 'relative';
		oElement.style.zIndex = 99;
		oElement.style.width = "75px";
		oElement.style.height = "75px";		
		oElement.style.cursor = "move";
		if (element.url_mag) {
			oElement.url_mag = element.url_mag;
			//hide preview while when dragging
	        oMooPicker.imgMagnifyDisplay(false);
	    }
	 	document.body.appendChild(oElement);
	 	return oElement;
	}
	
	this.onImageDropped = function(oImage, oDestination, oEvent) {
			oImage.display= "none";
			if (oImage.className=="browserimage"){
				if (this.getImageCount() < this.packSize){
					this.pickImage(oImage , true);
				}else{
					oImage.style.display="none";
					alert(string00068);
				}
			}else if(oImage.className == "picked"){
				if (get("divDeletePicked")) {
					get("divDeletePicked").className = "";
				}
			}	
	}

	this.imageHasBeenPicked = function (oImage, bFlash){
		var sImageId = new String(oImage.id);
		sImageId = sImageId.replace(/sub|img|Browser_/g, '');
		//hide preview
		if (oImage.url_mag) {
	        oMooPicker.imgMagnifyDisplay(false);
	    }

		var bExists = false;
		
		if (document.getElementById('hidPicked_' + sImageId)){
			bExists = true;
			if (bFlash == true){
				 Effect.Pulsate('img' + sImageId, {duration: 2, from:0.5});
			}
		}
		
		return bExists;
	}
	
	this.onImageDelete = function(oImage, oDestination, oEvent) {
		
		if (oImage.className == "picked"){
			//funky image fade thingy
			Effect.Puff(oImage.id, {duration:0.4});
	
			var aSplit = oImage.id.split("_");
			var iDuplicateNumber = aSplit[1];

			this.deleteImage(oImage, iDuplicateNumber);
			this.showMessage(string00069, true);
		}
	}
	
	this.clearAllImages = function(){
		get("fstPickedImages").innerHTML = "";
		get('ulPickedImages').innerHTML = "";
		get('ulPickedImages').hide();

		this.showCounter();
		this.showDragHint();
	}
	
	this.deleteImages = function(iCount, bConfirm){

		var oImages = document.getElementsByClassName('picked');
		var iImageCount = oImages.length;
		for((i=iImageCount - 1);i>=((iImageCount) - iCount) ;i--) {	
			this.deleteImage(oImages[i]);
		}			
	}

	this.deleteImage = function(oImage){

		//remove hidden input	 		
		var sImageId = oImage.id.replace(/sub|img|Browser_/g, '');
		var oPickedInput = get("hidPicked_" + sImageId);
				
		get("fstPickedImages").removeChild(oPickedInput);
		
		var oListItem = get("li" + sImageId);
		get("ulPickedImages").removeChild(oListItem);
		
		//if no images left, reshow the drag hint
		if (this.getImageCount() == 0 ){
			this.showDragHint();
		}
	}

	this.pickImage = function(oImage, bShowMessages){
		sImageUrl = oImage.src ? oImage.src : new String(oImage.url);

		if (this.imageHasBeenPicked(oImage, bShowMessages) == false){
			//hide the intro message
			if (get('pPickedHint')) {
				get('pPickedHint').style.display = "none";	
			}

			//Get the ID
	        sImageId = new String(oImage.id)
			sImageId = sImageId.replace(/sub|img|Browser_/g, '');
			
	        //Create hidden element
			var iCount = 1;
			var oPickedImageFieldset = get("fstPickedImages");
			var sInput = '<input type="hidden" id="hidPicked_' + sImageId + '" name="hidPicked_' + sImageId + '" class="pickedinfo" value="' + sImageUrl + '" />';
			oPickedImageFieldset.innerHTML += sInput;

			//create and add the image
			var oContainer = get('ulPickedImages');
			var oPickedImage = Element.extend(document.createElement('li'));
			oPickedImage.id = "li" + sImageId;

			var oPickedImageThumb = Element.extend(document.createElement('img'));
			oPickedImageThumb.id = 'img' + sImageId;
			oPickedImageThumb.onload = function() {
				oPickedImageThumb.addClassName('picked');
				oPickedImageThumb.title = oImage.title || '';
				if (oImage.url_mag) {
					oPickedImageThumb.onmouseover = function() {
							oMooPicker.imgMagnifyDisplay(true, this.id, oImage.url_mag);
					}
					oPickedImageThumb.onmouseout = function() {
							oMooPicker.imgMagnifyDisplay(false);
					}
				}
				oPickedImage.appendChild(oPickedImageThumb);
				oContainer.appendChild(oPickedImage);
				oContainer.show();
				//make draggable	
				oDrag = new Draggable( oPickedImageThumb.id, {revert:true});
				oDrag.options.change = function (value){
			        get("divDeletePicked").className="hover";
			    }
			}
			oPickedImageThumb.src = sImageUrl; // must be after onload, or strange things happen in IE
			
			if (bShowMessages == true){
				this.showMessage(string00070, true);	
			}
		} else {
			if(bShowMessages == true){
				this.showMessage(string00071, true, false, "#f03b1f");				
			}
		}
	}

	this.fillRandom = function(){
		if (this.getImageCount() != this.packSize){
			this.pickBulkImages("random", this.packSize - this.getImageCount());
		}else{
			alert(string00072);
		}
	}

	this.random = function (iCount){
		if (this.getImageCount() + iCount <= this.packSize){
			this.pickBulkImages("random", 10);
		}else if (this.getImageCount() == this.packSize){
			alert(string00072);
		}else{
			alert(string00073);
		}
	}

	this.pickBulkImages = function (sType, iCount){
		setCursor("wait");
		this.showMessage(string00074, false);

		var bProceed = false;
		var iExistingPickedCount = this.getImageCount();

		//clear photos
		if ((iCount + iExistingPickedCount) > this.packSize){
			oMooPicker.deleteImages(iCount - (this.packSize - iExistingPickedCount), false);
		}

		//get new ones
		var sSearchType
		
		if (this.mode =="holiday"){
			sSearchType = "holidaytagrandom";
		} else {
			sSearchType = this.mode + sType;
		}
		
		var sPost = "search_type=" + sSearchType + "&search_argument=";

		if (this.mode =="tag"){
			sPost += get("txtTag").value;
		}
		
		if (this.mode == "holiday") {
			sPost += get("txtGroupTag").value;
		}
		
		if (this.mode =="set"){
			sPost += get("ddlSetFilter").value;
		}
		
		if (this.mode =="year"){
			sPost += get("ddlYearFilter").value;
		}
		
		sPost += "&search_count=" + iCount;
		sPost += "&exclude_ids=" + this.getPickedCsv();
		sPost += "&builder_key=" + get("hid_builder_key").value;	
		
		var oAjax = new Ajax.Request(this.jsonUrl, {method: 'post',  postBody: sPost,  onComplete: this.pickBulkImagesCallback});
	}
	
	this.pickBulkImagesCallback = function(oResponse){
		//add photos 
		var oPhotos = eval('('+oResponse.responseText+')');
		iCurrentCount = oMooPicker.getImageCount();

		for(i=0;i<oPhotos.length;i++) {			
			if (iCurrentCount <= oMooPicker.packSize){
				try{
					oMooPicker.pickImage(oPhotos[i]);
					iCurrentCount += 1;
				}catch(e){

				}
			}
		}

		setCursor("default");
		//oMooPicker.showCounter();
		setTimeout('oMooPicker.showCounter()', 100);

	}
	
	this.getImageCount = function(){
		var iCount  = 0;
		var aImages = document.getElementsByClassName('picked');
		iCount = aImages.length;
		return iCount;
	}
	
	this.showDragHint = function (){	
		
		if (get('pPickedHint')) {
			get('pPickedHint').style.display = "none";
			var o = new Effect.Appear(get('pPickedHint'), {
				duration: 0.5
			});
		}
	
	}
	
	this.hideDragHint = function (){
		if (get('pPickedHint')) {
			get('pPickedHint').style.display = "none";
		}
	}
	
	this.showCounter = function(){
		
		var sMessage = "{y}" + ' ' + string00075 + ' ' + "{x}";
		var iImageCount = this.getImageCount();
		var iMultiples = Math.floor(this.packSize / iImageCount);
		var iRemainder = this.packSize - iMultiples * iImageCount;
		if (iImageCount == 0){
			sMessage = string00076;
		}else if (iRemainder == 0){
			sMessage = sMessage.replace("{y}", iMultiples).replace("{x}","");
		}else{
			sMessage = sMessage.replace("{y}", iMultiples).replace("{x}", string00077);
		}
		this.showMessage(sMessage, false);

	}
	
	this.showMessage = function (sMessage, bRevertToCounter, bNoFade, sBackgroundColour){
		var oMessage = get("liPickerInfo");
		if (oMessage) {
			if (sBackgroundColour == undefined){
					oMessage.style.backgroundColor = "";
					oMessage.style.color = "";
			}else{
					oMessage.style.backgroundColor = sBackgroundColour;
					oMessage.style.color = "white";
			}			
		}

		if(bNoFade == false){
			if (get("sPickerInfo")) {
				get("sPickerInfo").style.display = "none";
				Effect.Appear('sPickerInfo', {
					duration: 0.2
				});
			}
		}
		if (get("sPickerInfo")) {
			get("sPickerInfo").innerHTML = sMessage;
		}
		if(bRevertToCounter == true){
			setTimeout('oMooPicker.showCounter()', 2000);
		}

	}
	
	this.setPhotoBrowserWarning  = function (sText){
		var oWarning = get("pNoPhotos");
		if (sText!=""){
			oWarning.innerHTML = '<span class="infobox">' + sText + "</span>";
			oWarning.style.display="block";
		}else{
			oWarning.childNodes[0].innerHTML = "";
			oWarning.style.display="none";
		}
	}
	
	this.getPickedCsv = function(){
		var sCsv = "";

		var aPicked = document.getElementsByClassName('picked');
		var aPickedImages = new Array();

		for(i=0;i<aPicked.length;i++) {
			aPickedImages[i] = new String(aPicked[i].id);
			sCsv += aPickedImages[i].replace(/sub|img|Browser_/g, '');
			if (1 < aPicked.length){
				sCsv +=",";
			}
		}
		return sCsv.replace(/,$/, '');
	}
	
	this.save = function(){
		if (this.getImageCount() == 0){
		    alert(string00078);
		}else{
			get('frmStudio').className = "disappear";
			get('divImport').style.display = "block";
			
			postBackForm("frmStudio");
		}		
	}

	//call setup
	if (!document.getElementById('hidDontLoad')){
		this.setup();
	}
}
