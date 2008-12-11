function MooTextomatic(sWWWServer, sAppName, iRandomCount, iPackSize, sCardSize){

	//Properties
	this.wwwServer = sWWWServer;
	this.randomCount = iRandomCount;
	this.appName = sAppName;
	this.packSize = iPackSize;
	this.zoom = 3;
	this.angle = 0;
	this.text = "";
	this.colour = 0;
	this.rotationIncrement = 15;
	this.inverse = false;
	this.errorEnoughCards = string00082;
	this.status = '';
	this.layout = '';
	this.align='left';
	this.cardSize = sCardSize;
	
	if(sCardSize == "minicard") {
		this.left = 0;
		this.top = 0;	
		this.resetLeft = -249;
		this.resetTop = -340;
	} else {
		//businesscards 
		this.left = 0;
		this.top = 0;
		this.resetLeft = -225;
		this.resetTop = -285;
	}
	

	//Constructor
	this.setup = function(){
		
		//Make the card dragable
		oCardImage = get("divCardImage");
		oCardImage = new Draggable(oCardImage.id,{revert:false,
			change: function (value){

			},
			snap:function(x,y,draggable) {
	
		      aDraggerDimensions = Element.getDimensions(draggable.element);
			  oCropper = get("divCardScroller");
		      aCropperDimensions = Element.getDimensions(oCropper);
			  xBleed = 5;
			  yBleed = 5;
			
	 	      return constrainByCropper(x, parseInt(oCropper.style.left), aCropperDimensions.width, aDraggerDimensions.width, xBleed, 
				y, parseInt(oCropper.style.top), aCropperDimensions.height, aDraggerDimensions.height, yBleed);
		    },
			endeffect: function (value){
				oMooTextFront.setPositionInformation();
			}
		});
		
		//set focus & colour
		setFocus('txtFrontText');
		
		if (get("li_c4151c") != null){
			get("li_c4151c").className = 'selected';	
		}
		
		confirmBeforeExit = true;
	}
	
	this.getFont = function(){
		
		var sFont = "";
		var aFonts = document.getElementsByName('radTextFont');
		
		for(i=0;i<aFonts.length;i++) {
			if(aFonts[i].checked==true){
				sFont = aFonts[i].value;
			}
		}
		this.setStatus('edited');
		return sFont;
	}
	
	this.getColour = function(){
		
		var sColour = "";
		var aColours = document.getElementsByName("radTextColour");
		for(i=0;i<aColours.length;i++) {
			if(aColours[i].checked==true){
				sColour = aColours[i].value;
			}
		}
		this.setStatus('edited');
		return sColour;
		
	}
	
	this.getPattern = function(){
		
		var sPattern = "";
		var aPatterns = document.getElementsByName("radPattern");
		for(i=0;i<aPatterns.length;i++) {
			if(aPatterns[i].checked==true){
				sPattern = aPatterns[i].value;
			}
		}
		this.setStatus('edited');
		return sPattern;
	}
	
	this.getBackgroundColour = function(){
		//Get the background colour
		sBackgroundColour = "";
		if (this.inverse == true){
			sBackgroundColour = "ffffff";
		}else{
			sBackgroundColour = this.getColour();	
		}
		this.setStatus('edited');
		return sBackgroundColour;
	}
	
	this.getGreetingForegroundColour = function(){
		//Get the background colour
		return get('hidforegroundColour').value;
	}
	
	this.getGreetingBackgroundColour = function(){
		//Get the background colour
		return get('hidbackgroundColour').value;
	}
	
	this.getGreetingLayout = function(){
		//Get the layout
		var aLayout = "";
		var aLayout = document.getElementsByName("radLayout");
		for(i=0;i<aLayout.length;i++) {
			if(aLayout[i].checked==true){
				aLayout = aLayout[i].value;
			}
		}
		this.setStatus('edited');
		return aLayout;
	}
	
	this.getGreetingAlign = function(){
		//Get the layout
		var aAlign = "";
		var aAlign = document.getElementsByName("radAlign");
		for(i=0;i<aAlign.length;i++) {
			if(aAlign[i].checked==true){
				aAlign = aAlign[i].value;
			}
		}
		this.setStatus('edited');
		return aAlign;
	}
	
	this.rotateCard = function(sDirection){
		this.setStatus('edited');
		var newAngle = 0;
		if (sDirection == "right"){
			if (this.angle==0){
				newAngle = 360 - this.rotationIncrement;
			}else{
				newAngle = this.angle - this.rotationIncrement;
			}
		}else{
			if ((this.angle + this.rotationIncrement) ==360){
				newAngle = 0;
			}else{
				newAngle = this.angle + this.rotationIncrement;
			}
		}	
		
		this.angle = newAngle;
		this.makeCard();
		
	 }

	this.zoomCard = function(sDirection){
		this.setStatus('edited');
		if(sDirection == "in"){
			if(this.zoom<=7){
				this.zoom +=1;
			}else{
				//disable
			}
		}else{
			if (this.zoom >=1){
				this.zoom -= 1;	
			}else{
				//disable
			}
		}

		this.makeCard();
	}
	
	this.inverseColours = function (){
		this.setStatus('edited');
		if (this.inverse == true){
			this.inverse = false;
		}else{
			this.inverse = true;			
		}
		
		this.makeCard();
	}
	
	this.setPositionInformation = function(){
		this.left = parseInt(get("divCardImage").style.left);
		this.top = parseInt(get("divCardImage").style.top);
		
	}
	
	//return textbox
	this.textboxReturn = function(oEvent) {
		iKeyPress= "";
		if (oEvent.keyCode){
			iKeyPress= oEvent.keyCode;
		}else{
			iKeyPress=oEvent.which;			
		}
		
		if (iKeyPress == 13) {
			this.makeCard(true);
			setFocus('btnSaveCard');
			oEvent.cancelBubble = true;
			oEvent.returnValue = false;
			return false;
		}else{
			return true;
		}
	}
	
	this.setColour = function(sColourName) {
		ulColours = get('ulFrontColourPicker');
		for(i=0;i<ulColours.childNodes.length;i++){
			ulColours.childNodes[i].className = '';
		}
		get('li_' + sColourName).className = 'selected';
		get('radTextColour_' + sColourName).checked = 'checked';
		this.setStatus('edited');
		this.makeCard(false);
		
	}
	
	this.setGreetingColour = function(sForegroundColourName, sBackgroundColourName) {
		ulColours = get('ulDoubleColourPicker');
		for(i=0;i<ulColours.childNodes.length;i++){
			ulColours.childNodes[i].className = '';
		}
		get('hidbackgroundColour').value = sBackgroundColourName;
		get('hidforegroundColour').value = sForegroundColourName;
		
		this.setStatus('edited');
		this.makeGreetingCard(false);
		
	}
	
	this.setGreetingText = function(){
		get('hidtext').value = get("txtFrontText").value;
		this.makeGreetingCard(true);
	}
	
	this.setGreetingLayout = function(layout){
		this.layout = get('radLayout_' + layout).value;
		this.makeGreetingCard(false);
	}
	
	this.setGreetingAlign = function(align){
		this.align = get('radAlign_' + align).value;
		this.makeGreetingCard(false);
	}
	
	this.setFont = function(sFontName) {
		
		get(sFontName).checked = true;
		this.setStatus('edited');
		this.makeCard(false);
	}
	
	this.setPattern = function(sPatternName) {
		ulPatterns = get('ulFrontPatternPicker');
		for(i=0;i<ulPatterns.childNodes.length;i++){
			ulPatterns.childNodes[i].className = '';
			ulPatterns.childNodes[i].checked = false;
		}
		get(sPatternName).className = 'selected';
		get('radTextPattern_' + sPatternName).checked = 'checked';
		this.setStatus('edited');
		this.makeCard(false);
	}
	
	this.showLoader = function() {
		
		if(this.status == "edited" || this.status == "") {
		
			if(this.inverse == true){
				get("pLoading").style.color="#333";
				//get("pLoading").style.backgroundColor="#fff";
			} else {
				get("pLoading").style.color="#fff";
				//get("pLoading").style.backgroundColor="#333";
			}
			
			showOrHideById('pLoading', 'block');
			
		}
	}
	
	//Make a card
	this.makeCard = function (bReset){
		
		this.showLoader();
		hideWarning();
		
		var bSave = true;
		
		//reset
		if(bReset == true){
			//Check if they have any text
			if (get("txtFrontText").value == ""){
				if (confirm(string00083) == false){
					this.showEditMask();
					setFocus('txtFrontText');
					bSave = false;
				}
			}else{
				this.resetCard();
			}
		}
			
		if (bSave == true){
			this.text =  get("txtFrontText").value;
			var sUrl = this.getImageUrl("preview");
			var sBackgroundColour = this.getBackgroundColour();
			get("divCardImage").style.display="block";
			get("divCardImage").style.background = "#" + sBackgroundColour +" url(" + sUrl + ") no-repeat 50% 50%";
			this.hideEditMask();
		}
		this.setStatus('made');
		setTimeout("hideLoadingP()", 400);
		makeDirty();
	}
	
	
	this.makeGreetingCard = function (bReset){
		
		this.showLoader();
		hideWarning();
		
		//set layout horizontal or vertical
		var sLayout = this.getGreetingLayout(); 
		get('divGreetingsCardMiddle').className = sLayout;
		
		var bSave = true;
		
		//reset
		if(bReset == true){
			//Check if they have any text
			if (get('hidtext').value == ""){
				if (confirm(string00083) == false){
					this.showGreetingEditMask();
					setFocus('txtFrontText');
					bSave = false;
				}
			}else{
				this.resetGreetingCard();
			}
		}
			
		if (bSave == true){
			this.text =  get('hidtext').value;
			var sUrl = this.getGreetingImageUrl("preview");
			
			var sBackgroundColour = "ffffff";
			get("divCardImage").style.display="block";
			get("divCardImage").style.background = "#" + sBackgroundColour +" url(" + sUrl + ") no-repeat 50% 50%";
			this.hideGreetingEditMask();
		}
		this.setStatus('made');
		setTimeout("hideLoadingP()", 400);
		
		
	}
	
	//Get Image Url
	this.getImageUrl = function(sMode){
		
		var sFont = this.getFont();
		
		var sPattern = this.getPattern();
		
		var sBackgroundColour = this.getColour();
		var sForgroundColour = "ffffff";
		
		if (this.inverse == true){
			sBackgroundColour = "ffffff";
			sForgroundColour = this.getColour();
		}
		
		//This is a small workaround to ensure + gets rendered properly
		var userText = escape(this.text);
		userText = userText.replace("+", "%2B");
		
		var sUrl = this.wwwServer + "/dynamic/card_image.php?text=" + userText + "&background_colour=" + sBackgroundColour + "&forground_colour=" + sForgroundColour + "&font=" + sFont + "&angle=" + this.angle + "&zoom=" + this.zoom + "&mode=" + sMode + "&pattern=" + sPattern;
		return sUrl;
	}
	
	this.getGreetingImageUrl = function(sMode){
		
		var sFont = this.getFont();
		//var sAlign = this.setGreetingAlign();
		//var sLayout = this.getGreetingLayout();
		var sPattern = "solid";
		
		var sBackgroundColour = this.getGreetingBackgroundColour();
		var sForgroundColour = this.getGreetingForegroundColour();
		
		//This is a small workaround to ensure + gets rendered properly
		var userText = escape(this.text);
		userText = userText.replace("+", "%2B");
		
		var sUrl = this.wwwServer + "/dynamic/greetingcard_image.php?text=" + userText + "&background_colour=" + sBackgroundColour + "&forground_colour=" + sForgroundColour + "&font=" + sFont + "&angle=" + this.angle + "&zoom=" + this.zoom + "&mode=" + sMode + "&pattern=" + sPattern;
		return sUrl;
	}
	
	this.makeRandom = function() {
		
		var iCardCount = this.currentCardCount();
		this.text = get("txtFrontText").value;
		var userText = escape(this.text);
		userText = userText.replace("+", "%2B");
		
		if (iCardCount +1 > this.packSize){
			alert(this.errorEnoughCards);
		}else{
			
			var bSave = true;
					
			//Check if they have any text
			if (get("txtFrontText").value == ""){
				if (confirm(string00083) == false){
					bSave = false;
				}
			}
		
			if (bSave){
				
				//Text reamins the same for all cards
				this.text =  get("txtFrontText").value;
				
				//No need to overcomplicate things.  These also remain the same for all cards
				this.zoom = 3;
				this.angle = 0;
				
				this.left = this.resetLeft;
				this.top = this.resetTop;
				/*
				this.left = -249;
				this.top = -340;
				*/
				var lastCard = iCardCount + 10;
				if (this.packSize < iCardCount + 10){
					lastCard = this.packSize
				}
				
				for (var i = iCardCount; i < lastCard; i++){
					//Generate a random number between 0 and 1
					//if 1 we inverse, if 0 we dont.  Simple as that
					var randomInverse = Math.floor(Math.random()*2);
					if (randomInverse > 0){
						this.inverse = true;
					}else{
						this.inverse = false;
					}
					
					//Generate a random colour for the card.
					//text or background, depending on inverse value
					if (this.inverse == true){
						currentBackColour = "ffffff";
						currentFrontColour = this.getRandomColour();
					}else{
						currentBackColour = this.getRandomColour();
						currentFrontColour = "ffffff";
					}
	
					//Set the other random variables - font and pattern
					var sFont = this.getRandomFont();
					var sPattern = this.getRandomPattern();
					
					this.autoSaveCard(i, currentBackColour, currentFrontColour, sFont, sPattern, userText);
				}
				this.resetCard();
				this.showEditMask();
				}
			}
		//hide the design hint
		get('pDesignHint').style.display="none";
		
		makeDirty();
		
	}
	
	this.setStatus = function(sStatus) {
		this.status = sStatus;
	}
	
	
	this.makeRainbow = function() {
		
		var iCardCount = this.currentCardCount();
		var currentCard;
		var sFont = this.getFont();		
		var sPattern = this.getPattern();
		this.text = get("txtFrontText").value;
		var userText = escape(this.text);
		userText = userText.replace("+", "%2B");
		
		//hide the design hint
		get('pDesignHint').style.display="none";
		
		if (iCardCount == 0){
			//This is a bona fide rainbow pack. like the old folks used to make
			
			var currentCard = 0;
			
			//A rainbow pack is 20 cards, so we do this 5 times to make the 100 cards
			for (var j = 0; j < 20; j++){
				for (var i = 0; i < 5; i++){
					if (this.inverse == true){
						currentBackColour = "ffffff";
						currentFrontColour = this.getRainbowColour(j);
					}else{
						currentBackColour = this.getRainbowColour(j);
						currentFrontColour = "ffffff";
					}
					this.autoSaveCard(currentCard, currentBackColour, currentFrontColour, sFont, sPattern, userText);
					currentCard++;
				}
			}
		}
		else if (iCardCount < 100){
			iRemainingCards = 100 - iCardCount;
			iNumOfEach = Math.floor(iRemainingCards / 20);
			iRem = iRemainingCards % 20;
			var currentCard = iCardCount;
			
			
			for (var i = 0; i < 20; i++){
				
				for (var j = 0; j < iNumOfEach; j++){
					if (this.inverse == true){
						currentBackColour = "ffffff";
						currentFrontColour = this.getRainbowColour(i);
					}else{
						currentBackColour = this.getRainbowColour(i);
						currentFrontColour = "ffffff";
					}
					this.autoSaveCard(currentCard, currentBackColour, currentFrontColour, sFont, sPattern, userText);
					currentCard++;
				}
				
				if (i < iRem){
					if (this.inverse == true){
						currentBackColour = "ffffff";
						currentFrontColour = this.getRainbowColour(j);
					}else{
						currentBackColour = this.getRainbowColour(j);
						currentFrontColour = "ffffff";
					}
					this.autoSaveCard(currentCard, currentBackColour, currentFrontColour, sFont, sPattern, userText);
				}
				
			}		
		}
		
		this.resetCard();
		setCursor("default");
		makeDirty();
	}

	//Reset card
	this.resetCard = function(){
		this.zoom = 3;
		this.angle = 0;
		this.text = "";
		
		this.left = this.resetLeft;
		this.top = this.resetTop;
		
		/*
		this.left = -249;
		this.top = -340;
		*/
		
		this.inverse = false;
		get("divCardImage").style.left= this.left + "px";
		get("divCardImage").style.top= this.top + "px";		
		//get("divCardImage").style.background ="";
		get("divCardImage").style.display ="none";	
		//get("radTextFront_Friendly").checked = true;		
		//get("radTextColour_000000").checked = true;
	}
	
	//Reset card
	this.resetGreetingCard = function(){
		this.zoom = 3;
		this.angle = 0;
		this.text = "";
		this.left = 0;
		this.top = 0;
		this.inverse = false;
		get("divCardImage").style.left= this.left + "px";
		get("divCardImage").style.top= this.top + "px";		
		get("divCardImage").style.display ="none";	
	}
	
	this.showEditMask = function(){
		get("divEditMask").style.display="block";
		get("btnSaveCard").disabled= true;
	}

	this.hideEditMask = function(){
		get("divEditMask").style.display="none";
		get("btnSaveCard").disabled= false;	
	}
	
	this.showGreetingEditMask = function(){
		get("divEditMask").style.display="block";
	}

	this.hideGreetingEditMask = function(){
		get("divEditMask").style.display="none";
	}
	
	
	//Save design
	this.saveCard = function(){
		//console.log('saveCard');
		//Get the current count
		var iCardCount = this.currentCardCount();
	
		//hide the design hint
		get('pDesignHint').style.display="none";
	
		if (iCardCount +1 > this.packSize){
			alert(this.errorEnoughCards);
		}else{
			//Create new element
			var oFinishedCards = document.getElementById('divFinishedCardThumnbnails');
			var oNewCard = document.createElement('div');
			oNewCard.id = "divFinishedCardWrapper_" + (iCardCount + 1);
			oNewCard.className = "finishedcardwrapper";
	
			//Build up info for storage in string
			var sCardInfo = this.getCardInfo();
	
			//Get the  thumbnail image url
			var sUrl = this.getImageUrl("thumbnail");
			
			//Get the background colour
			sBackgroundColour = "";
			if (this.inverse == true){
				sBackgroundColour = "ffffff";
			}else{
				sBackgroundColour = this.getColour();	
			}
	
			//get and populate html (uses a template to prevent allergic reaction from some browsers)
			var sHtml = "";
			if(iCardCount>0){
				sHtml = this.getThumbnailTemplate(false);
			}else{
				sHtml = this.getThumbnailTemplate(true);					
			}
			
			sHtml = replaceAll(sHtml, "{id}", iCardCount +1);
			sHtml = sHtml.replace("{info}",sCardInfo);
			sHtml = sHtml.replace("{left}",parseInt(this.left * 0.5) + "px"); // thumbnails are 0.5 the preview size
			sHtml = sHtml.replace("{top}",parseInt(this.top * 0.5) + "px");
			sHtml = sHtml.replace("{image}",sUrl);
			sHtml = sHtml.replace("{background_colour}", sBackgroundColour);

			oNewCard.innerHTML = sHtml;
			
			//add to document
			oFinishedCards.appendChild(oNewCard);
			

			//reset the card
			//this.resetCard();
	
			//display messege / count
			this.showMessage("Card saved", true);
			
			//Clear the textbox ready for the next message
			//get("txtFrontText").value = "";
			
		}
		this.fixFooter();
		this.setStatus('saved');
	}
	
	//Save design for when save is being called multiple times.
	//ie from a rainbow, or random10 pack
	this.autoSaveCard = function(sCurrentCard, sBackgroundColour, sForegroundColour, sFont, sPattern, userText){
		
		//Create new element
		var oFinishedCards = document.getElementById('divFinishedCardThumnbnails');
		var oNewCard = document.createElement('div');
		oNewCard.id = "divFinishedCardWrapper_" + (sCurrentCard + 1);
		oNewCard.className = "finishedcardwrapper";
	
		//Build up info for storage in string
		//var sCardInfo = this.getCardInfo();
	
		var sCardInfo =  "{url}|{left}|{top}|{text}|{colour}";
		
		var previewUrl = this.wwwServer + "/dynamic/card_image.php?text=" + userText + "&background_colour=" + sBackgroundColour + "&forground_colour=" + sForegroundColour + "&font=" + sFont + "&angle=" + this.angle + "&zoom=" + this.zoom + "&mode=preview&pattern=" + sPattern;
		
		sCardInfo = sCardInfo.replace("{url}", previewUrl);
		sCardInfo = sCardInfo.replace("{left}", this.left);
		sCardInfo = sCardInfo.replace("{top}", this.top);
		sCardInfo = sCardInfo.replace("{text}", this.text);
		sCardInfo = sCardInfo.replace("{colour}", sBackgroundColour);
	
		//Get the  thumbnail image url
		var sUrl = this.wwwServer + "/dynamic/card_image.php?text=" + userText + "&background_colour=" + sBackgroundColour + "&forground_colour=" + sForegroundColour + "&font=" + sFont + "&angle=" + this.angle + "&zoom=" + this.zoom + "&mode=thumbnail&pattern=" + sPattern;
			
		//get and populate html (uses a template to prevent allergic reaction from some browsers)
		var sHtml = "";
		if(sCurrentCard>0){
			sHtml = this.getThumbnailTemplate(false);
		}else{
			sHtml = this.getThumbnailTemplate(true);					
		}
			
		sHtml = replaceAll(sHtml, "{id}", sCurrentCard +1);
		sHtml = sHtml.replace("{info}",sCardInfo);
		sHtml = sHtml.replace("{left}",parseInt(this.left * 0.5) + "px"); // thumbnails are 0.5 the preview size
		sHtml = sHtml.replace("{top}",parseInt(this.top * 0.5) + "px");
		sHtml = sHtml.replace("{image}",sUrl);
		sHtml = sHtml.replace("{background_colour}", sBackgroundColour);

		oNewCard.innerHTML = sHtml;
			
		//add to document
		oFinishedCards.appendChild(oNewCard);
			

		//reset the card
		//this.resetCard();
	
		//display messege / count
		this.showMessage(string00084, true);
			
		//Clear the textbox ready for the next message
		//get("txtFrontText").value = "";
			
		this.fixFooter();
		this.setStatus('saved');
	}
	
	//  card
	this.removeCard = function(sId){
		
		var oCard = get("divFinishedCardWrapper_" + sId);
		var oFinishedCards = document.getElementById('divFinishedCardThumnbnails');
		oFinishedCards.removeChild(oCard);
		this.showMessage(string00085, true);
		
		//check if the remove all option is there
		var iCurrentCardCount = this.currentCardCount();

		this.fixFooter();
		
		//hide the design hint
		var iCardCount = this.currentCardCount();
		if(iCardCount == 0){
			get('pDesignHint').style.display="block";
		}
		makeDirty();
	}
	
	this.removeAll = function(){
		if (confirm(string00086) == true){
			get("divFinishedCardThumnbnails").innerHTML = "";
			this.showMessage(string00087, true);
		}
		
		get('pDesignHint').style.display="block";
		this.fixFooter(-1);
		this.setStatus('');
		makeDirty();
	}
	
	this.currentCardCount = function(){
		
		return document.getElementsByClassName("finishedcardwrapper").length
		
	}
	
	this.showCounter = function(){
		
		var sMessage = "{y}" + ' ' + string00075 + ' ' + "{x}";
		var iCardCount = this.currentCardCount();
		var iMultiples = Math.floor(this.packSize / iCardCount);
		var iRemainder = this.packSize - iMultiples * iCardCount;
		if (iCardCount == 0){
			sMessage = string00088;
		}else if (iRemainder == 0){
			sMessage = sMessage.replace("{y}", iMultiples).replace("{x}","");
		}else{
			sMessage = sMessage.replace("{y}", iMultiples).replace("{x}", string00077);
		}
		this.showMessage(sMessage, false);

	}

	this.showMessage = function (sMessage, bRevertToCounter, bNoFade, sBackgroundColour){
		var oMessege = get("sPickerInfo");
		if (sBackgroundColour == undefined){
				oMessege.style.backgroundColor = "";
				oMessege.style.color = "";
		}else{
				oMessege.style.backgroundColor = sBackgroundColour;
				oMessege.style.color = "white";
		}

		if(bNoFade == false){
			get("sPickerInfo").style.display = "none";
			Effect.Appear('sPickerInfo', {duration: 0.2 });
		}
		
		oMessege.innerHTML = sMessage;
		
		if(bRevertToCounter == true){
			setTimeout('oMooTextFront.showCounter()', 2000);
		}
	}
	
	
	//thumbnail template	
	this.getThumbnailTemplate = function(bHasRemoveAll){
		
		sReturn = '<input type="hidden" id="hidFinishedCard_{id}" name="hidFinishedCard_{id}" value="{info}" /><div class="finishedcardscroller"><div id="divFinishedCard_{id}" class="finishedcardimage" style="left:{left};top:{top};background: #{background_colour} url({image})  no-repeat 50% 50%;"></div></div><a href="#" onclick="oMooTextFront.removeCard({id});return false">Remove</a>';
		return  sReturn;
	}
		
	this.fixFooter = function(px) {
		//alert('fixing footer: ' + footerHeight);
		//pretty nasty hack which sets the footer div to the bottom of the page
		divMainContent = get('divContent');
		divMainHeader = get('divHeader');
		footerHeight = divMainContent.offsetHeight + divMainHeader.offsetHeight;
		spanBlockBottom = document.getElementsByClassName('blockbottom');
		if(px) {
			style = px + 'px';
		} else {
			style = footerHeight + 'px';
		}
		
		//spanBlockBottom[0].style.bottom = style;
		
	}
	
	//card info template
	this.getCardInfo = function(){
		
		var sCardInfo =  "{url}|{left}|{top}|{text}|{colour}";
		
		sCardInfo = sCardInfo.replace("{url}", this.getImageUrl("preview"));
		sCardInfo = sCardInfo.replace("{left}", this.left);
		sCardInfo = sCardInfo.replace("{top}", this.top);
		sCardInfo = sCardInfo.replace("{text}", this.text);
		sCardInfo = sCardInfo.replace("{colour}", this.getBackgroundColour());
				
		return sCardInfo;

	}
	
	this.saveAll = function(){
		
		var sWarnings = "";
		
		//sanity check
		if (this.currentCardCount() == 0){
			sWarnings = string00089;
			showWarning(sWarnings);
		
		} else{
			//check if current card is saved
			if(this.status == 'made' || this.status == 'edited'){
				if (confirm(string00090) == true){
					postBackForm('frmDesignFront');
				}
			} else if (this.status == 'saved') {
				postBackForm('frmDesignFront');
			}
			else if (this.status == '') {
				//This in theory should cover the case where a user comes back to the page
				//from a point further along in the process
				postBackForm('frmDesignFront');
			} 
		}
		
		this.setStatus('');
		
	}
	
	this.getRandomColour = function(){
		var aColours = new Array("c4151c", "ed1c24", "faa61a", "f36f21", "a7a038", 
								 "023f88", "005aaa", "007dc5", "6f2b90", "482f92", "b9bd17", 
								 "007236", "72bf44", "0092c8", "00aab5", "7961aa", "ed0e69", 
								 "a2238e", "c40063", "000000");
		var randomKey = Math.floor(Math.random()*20);
		return aColours[randomKey];
		
	}
	
	this.getRandomFont = function(){
		var aFonts = new Array("ArialMTStd.otf", "HypatiaSansPro-Semibold.otf", "FetteFrakturLTStd.otf", "Dymo.ttf", "Machiarge.otf", 
								 "CooperBlackStd.otf", "Cursivestandard.ttf", "carimbo.ttf", "Stencilia-A.ttf", "Rounded.ttf");
		var randomKey = Math.floor(Math.random()*10);
		return aFonts[randomKey];
	}
	
	this.getRandomPattern = function(){
		var aFonts = new Array("solid", "cammo", "dots", "flower", "stripe");
		var randomKey = Math.floor(Math.random()*5);
		return aFonts[randomKey];
	}
	
	this.getRainbowColour = function(colourKey){
		
		
		var aColours = new Array("c4151c", "ed1c24", "f36f21", "faa61a", "b9bd17", "a7a038", 
								 "007236", "72bf44", "00aab5", "0092c8", "007dc5", "005aaa", 
								 "023f88", "482f92", "6f2b90", "7961aa", "a2238e",  "ed0e69", 
								 "c40063", "000000");
		
		return aColours[colourKey];
	}
	
	this.setGreetingAlign = function() {
		//alert('setting text align');
	}
	
	this.setup();
}

function hideLoadingP() {
	get("pLoading").style.display = "none";
}