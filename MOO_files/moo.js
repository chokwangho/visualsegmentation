//A .js file for useful functions

// IE version
var isIE = 0/*@cc_on+ScriptEngineMajorVersion()@*/;
var isStrict = document.compatMode == "CSS1Compat";

var Cookie = {

	get : function ( name ) {
		var ca = document.cookie.split(";");
		for ( var i = 0; i < ca.length; i ++ ) {
			var c = ca[0].replace(/^ * /, '');
			if ( c.indexOf(name+"=") == 0 ) {
				return c.substring ( name.length + 1 );
			}
		}
		return null;
	},

	set : function ( name, value, seconds ) {
		
		if ( seconds ) {
			var date = new Date();
			date.setTime ( date.getTime() + ( seconds * 1000 ) );
			var expires = "; expires=" + date.toGMTString();
		} else {
			var expires = "";
		}
		document.cookie = name + "=" + escape(value) + expires + "; path=/; domain=.moo.com";
	},

	clear : function ( name ) {
		Cookie.set ( name, "", -1 );
	}

}

//Changing currency
function setCurrency(sCurrency){
	Cookie.set('chosenCurrency', sCurrency, 1000*24*60*60);
	location.href = location.href;
	return false;
}


// Closes GC preview mask
function closeProductLinkPreview() {
    Effect.Fade('divProductLinkPreview');
    Effect.Fade('divMask');
    return true;
}

function showWarning (sWarnings, bReset) {
    var sWarningHtml = '';

	if(typeof bReset != "undefined"){
		if(bReset == true){
			get('divWarning').innerHTML = "";
		}
	}

	if(sWarnings.indexOf('\n') > 0){
        var aWarnings = sWarnings.split('\n');
        sWarningHtml += '<ul>'
	    for (var i=0;i<aWarnings.length -1;i++) {
	       if (aWarnings[i]!= ''){
    	       sWarningHtml += '<li>' + aWarnings[i] + '</li>';
    	   }
        }
        sWarningHtml += '</ul>'
	}else{
	   sWarningHtml = sWarnings;
	}
    var oWarning;
    oWarning = get('divWarning');
    
    oWarning.innerHTML = sWarningHtml;
    window.scroll(0,0);    
    oWarning.style.display = 'block' 
  
}

function hideWarning (){
    oWarning = get('divWarning');
	oWarning.style.display = 'none'
    oWarning.innerHTML = '';
}

function postBackForm(sForm, sPostbackCommand, sPostbackArgument) {

	if(sPostbackCommand){

		get("_postback_command").value = sPostbackCommand;
	}
	
	if(sPostbackArgument){
		get("_postback_argument").value = sPostbackArgument;
	}
	
   var oForm = get(sForm);
	oForm.submit();
}

function setFocus(sID) {
	if(get(sID).disabled != true){
    	get(sID).focus();
	}
}

function showOrHideById(sID, sStyle) {
	get(sID).style.display = sStyle;
}

function validateEmail(sEmail) {
     //var sEmailRegEx = "^[\\w-_\.]*[\\w-_\.]\@[\\w]\.+[\\w]+[\\w]$";
	 // now allowing + before @
	 var sEmailRegEx = "^[\\w-_\.\+]*[\\w-_\.]\@[\\w]\.+[\\w]+[\\w]$";
     var oRegEx = new RegExp(sEmailRegEx);
     return oRegEx.test(sEmail);
}


function textboxNotEmpty (oTextbox, bSetWarnings){
    var bReturn
    if (oTextbox.value == ''){
        bReturn = false;
    }else{
        bReturn = true;
    }

    if(bSetWarnings != undefined && bSetWarnings != false && bReturn == false){
        oTextbox.className += ' error';
    } else {
        oTextbox.className = oTextbox.className.replace(' error', '' )
    }
    
    return bReturn
}

function textboxIsEmail (oTextbox, bSetWarnings){
    var bReturn
    if (oTextbox.value == ''){
        bReturn = false;
    }else{
        bReturn = true;
    }
    
    if(bSetWarnings != undefined && bSetWarnings != null && bReturn == false){
        oTextbox.className += ' error';
    } else {
        oTextbox.className = oTextbox.className.replace(' error', '' )
    }

    return bReturn
}

function textboxIsNumeric (oTextbox, bSetWarnings){
    var bReturn
    if (oTextbox.value == '' || IsNumeric(oTextbox.value) == false){
        bReturn = false;
    }else{
        bReturn = true;
    }

    if(bSetWarnings != undefined && bSetWarnings != null && bReturn == false && bSetWarnings == true){
        oTextbox.className += ' error';
    } else {
        oTextbox.className = oTextbox.className.replace(' error', '' )
    }
    
    return bReturn
}

function textboxIsCreditCard (oTextbox, bSetWarnings){

    var bReturn = true;
	var sWarning = '';
	
	if (isCreditCardNumber(oTextbox.value) == false){
		bReturn = false;
	}
    if (oTextbox.value == ''){
        bReturn = false;
    }
	
	if(bSetWarnings != undefined && bSetWarnings != null && bReturn == false){
        oTextbox.className += ' error';
    } else {
        oTextbox.className = oTextbox.className.replace(' error', '' )
    }

    return bReturn; 

}

function textboxIsPhoneNumber(oTextbox, bSetWarnings) {
    var bReturn = true;
	var sWarning = '';
	
	if (isPhoneNumber(oTextbox.value) == false){
		bReturn = false;
	}
    if (oTextbox.value == ''){
        bReturn = false;
    }
	
	if(bSetWarnings != undefined && bSetWarnings != null && bReturn == false){
        oTextbox.className += ' error';
    } else {
        oTextbox.className = oTextbox.className.replace(' error', '' )
    }

    return bReturn; 
	
}

function textboxIsPOBox(oTextbox, bSetWarnings) {
	var bReturn = true;
	var sWarning = '';
	
	var sTest = oTextbox.value;
	sTest = sTest.replace(/[^a-z]+/gi, '');
	
	if (sTest.search(/pobox/) == 0){
		bReturn = false;
	}
	
	if(bSetWarnings != undefined && bSetWarnings != null && bReturn == false){
        oTextbox.className += ' error';
    } else {
        oTextbox.className = oTextbox.className.replace(' error', '' )
    }

    return bReturn; 
	
}

function textboxSubmit(oEvent, sForm, sCommand, sArgument) {

	if (oEvent.keyCode == 13) {
		if(sCommand){
			get("_postback_command").value = sCommand;
		}
		if(sArgument){
			get("_postback_argument").value = sArgument;
		}		
		
		document.getElementById(sForm).submit();
		oEvent.cancelBubble = true;
		oEvent.returnValue = false;
	}
}


function noEnterSubmit(oEvent) {
	
	var bReturn = true;
	
	if(!oEvent){ 
		oEvent=window.event;
	}
	
	if (oEvent.keyCode == 13) {
		bReturn = false;
	}
	
	return bReturn;
	
}

function numericOnlyTextbox(oEvent){

	var bReturn = true;
	if(!oEvent){ 
		oEvent=window.event;
	}

	var sChar = oEvent.which;
	if (IsNumeric(String.fromCharCode(sChar)) == false && sChar != 8) {
		bReturn = false;
	}

	return bReturn
	
}

function dropdownNotEmpty (oDropdown, bSetWarnings){

    var bReturn
    if (oDropdown.value == ''){
        bReturn = false;
    }else{
        bReturn = true;
    }
    if(bReturn == false && bSetWarnings==true){
        oDropdown.className += ' error';
    } else {
        oDropdown.className = oDropdown.className.replace(' error', '' );
    }
    
    return bReturn
}

function setControlWarning (oControl, bState){

    if(bState == true){
        oControl.className += ' error';
    } else {
        oControl.className = oControl.className.replace('error', '' );
    }

}

function setControlDisabled (oControl, bState){

    if(bState == false){
		oControl.disabled = "disabled";
        oControl.className += " disabled";
    } else {
		oControl.disabled = "";
        oControl.className = oControl.className.replace('disabled', '' );
    }

}

function radioButtonSelected(oRadio) {
	var iCount = -1;
	var bReturn
	for (var i=oRadio.length-1; i > -1; i--) {
	   if (oRadio[i].checked) {iCount = i; i = -1;}
	   }
	if (iCount > -1) {
	   bReturn = true;
	}else{
	   bReturn = false;
	}
	
	return bReturn
}

function selectRadio(sId) {
	
	get(sId).checked = true;
	
}

function dropdownTextValue(sDropdownId){
	
	var iIndex = get(sDropdownId).selectedIndex;
	var sText = get(sDropdownId).options[iIndex].text;
	
	return sText;
}

function isAlphanumeric (c){
    var bReturn = true;
    
    if ((('abcdefghijklmnopqrstuvwxyz0123456789~@#?><\|!?$%^&*"()-_+=?{}[]').indexOf(c) <0)){
        bReturn = false;
    }

    return bReturn
}

function isExpiryDate (sExpiry) {

    bSuccess = false

    // make sure it is the correct format
    if (sExpiry.search(/^((0[1-9])|(1[0-2]))\/(\d{2})$/) >=0){
        bSuccess  = true
    }

   return bSuccess;
}

function isCardDate(sDate){
    bSuccess = false

    // make sure it is the correct format
    if (sDate.search(/^((0[1-9])|(1[0-2]))\/(\d{2})$/) >=0){
        bSuccess  = true
    }    
}

function IsNumeric(sText)

{
   var sValidChars = " 0123456789.";
   var bNumber=true;
   var sChar;

   for (i = 0; i < sText.length && bNumber == true; i++)
      { 
      sChar = sText.charAt(i); 
      if (sValidChars.indexOf(sChar) == -1) 
         {
         bNumber = false;
         }
      }
   return bNumber;
   
 }

function isCreditCardNumber(sCC){
	bReturn = true;

	sCC = 	sCC.replace(' ', '');
	if (sCC.length != 16){
		bReturn = false;
	}

	if (IsNumeric(sCC) == false){
		bReturn = false;
	}
	return bReturn;
}

function isPhoneNumber(sPhone) {
	bReturn = true;

	var sValidChars = " 0123456789+-()";	
   var sChar;

   for (i = 0; i < sPhone.length && bReturn == true; i++)
      { 
      sChar = sPhone.charAt(i); 
      if (sValidChars.indexOf(sChar) == -1) 
         {
         bReturn = false;
         }
      }
   return bReturn;	
}

function concatControlValues (aControlIDs){

	sConcat = "";
    for (var i=aControlIDs.length-1; i > -1; i--) {
    	if (get(aControlIDs[i]) != "undefined"){
        	sConcat += get(aControlIDs[i]).value;
		}
    }
    return sConcat
}

 function isInteger(oEvent){
	var sChar = (oEvent.which) ? oEvent.which : event.keyCode
	if (sChar > 31 && (sChar < 48 || sChar > 57)) 
	   return false;

	return true;

 }

function get(sElementId){

	
//	if(!document.getElementById(sElementId)){
//		sPost = "q=" + sElementId;
//		var oAjax = new Ajax.Request('/ajaxrequests/missingelement.php',{method: 'post',  postBody: sPost,  onComplete: this.addImagesCallback});
//	}

	return $(sElementId);
}

function currentTime(){

	var oDate = new Date();
	var iHours = oDate.getHours();
	var iMinutes = oDate.getMinutes();
	var iSeconds = oDate.getSeconds();
	var iMilliSeconds = oDate.getMilliseconds();

	return iHours + ":" + iMinutes + ":" + iSeconds + ":" + iMilliSeconds;

}

function randomNumber(iMax, b1Indexed){
		var iRandom = Math.floor(Math.random()*iMax);
		
		// if 0 the try again
		if (iRandom == 0 && b1Indexed == true){
			while(iRandom < 1 || iRandom > iMax){
				iRandom = Math.floor(Math.random()*iMax);
			}
		}
		
		return iRandom;
}

function setCursor (sCursor){
	document.body.style.cursor  = sCursor;
}

function safeInt(sNumber){
	
	var iNumber = parseInt(sNumber);
	if (iNumber == "NaN"){
		iNumber = 0;
	}
	
	return iNumber;
	
}

function replaceAll (sSubject,sSearch,sReplace){

	var sTemp = sSubject;
	var i = sTemp.indexOf(sSearch);
	
	while(i > -1) {
		sTemp = sTemp.replace(sSearch, sReplace);
		i = sTemp.indexOf(sSearch, i + sReplace.length);
	}

	return sTemp;
}

function constrainByCropper(xDragger, xCropper, widthCropper, widthDragger, xBleed, 
	yDragger, yCropper, heightCropper, heightDragger, yBleed) {

//debug_write(xDragger + " " + xCropper  + " " +  widthCropper  + " " +  widthDragger  + " " +  xBleed  + " " + yDragger  + " " +  yCropper  + " " +  heightCropper  + " " +  heightDragger  + " " +  yBleed);

	//return vars
	returnY = yDragger;
	returnX = xDragger;
	
	//Y
  if (yDragger > (yCropper - yBleed)){
		returnY = (yCropper - yBleed);	
  }else if ((yDragger + heightDragger) < (yCropper + heightCropper + (yBleed * 2))){
		returnY = yCropper - (heightDragger - heightCropper - yBleed)
  }else{
		returnY = yDragger;
	}
	
	//X
	if (xDragger > xCropper - xBleed){
		returnX = xCropper - xBleed;	
  }else if ((xDragger + widthDragger) < (xCropper + widthCropper + (xBleed * 2))){
		returnX = xCropper - (widthDragger - widthCropper - xBleed)
  }else{
		returnX = xDragger;
	}

	return [returnX, returnY];
}


function makeStringSafeByCode(sString, iMaxCode, sReplacementChar){
	
	var sReturn = "";
	
	for (var i=0; i < sString.length; i++) {
		if (sString.charCodeAt(i) > iMaxCode){
			sReturn += sReplacementChar;
		}else{
			sReturn += sString.charAt(i);			
		}
	}
	
	return sReturn;
}

function stringContainsCharsByCode(sString, iMaxCode){
	
	var bReturn = false;
	
	for (var i=0; i < sString.length; i++) {
		if (sString.charCodeAt(i) > iMaxCode){
			bReturn = true;
		}		
	}
	
	return bReturn;
}

function unescape_from_input_element(sString){
	return replaceAll(sString, '@||@', '"');	
}
 
 //Get all the elements on a page that share a class name
 // to be removed, duplicates prototype.js function, used in canvas.js, designbusinesscardback.js & moocropper.js
 function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp('(^|\\s)'+searchClass+'(\\s|$)');
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}
 
function charCount(sNeedle, sHaystack){

	var iCharCount = 0;
  	var aSplit = sHaystack.split(sNeedle);
  	return aSplit.length - 1;	 
	
}

function newWindow(sUrl){
	window.open(sUrl);	
}

function caretPosition (oInput) {

	var iCaretPosistion = 0;
	
	//IE Support
	if (document.selection) {
		oInput.focus ();
		var Sel = document.selection.createRange ();
		Sel.moveStart ('character', -oInput.value.length);
		iCaretPosition = Sel.text.length;
	}
	
	//Firefox et al support
	else if (oInput.selectionStart || oInput.selectionStart == '0')
		iCaretPosition = oInput.selectionStart;

	//Return
	return iCaretPosition;

}

function stringToLines(sString, iLineLength){
	var aTemp = sString.split(' ');	
 	var aLines = new Array(); 
	var iMaxIterations = 40;
	aLines[0] = "";

	for (var i=0; i < aTemp.length; i++) {
		if(i <= iMaxIterations){
			sTempString = aLines[aLines.length -1] + ' ' + aTemp[i];
			if (sTempString.length <= iLineLength){
				aLines[aLines.length -1] = aLines[aLines.length -1] + " " + aTemp[i];
			}else{
				aLines[aLines.length] = aTemp[i]
			}
		}else{
			break;
		}
	}
	
	return aLines;
}

function safeImage (sUrl){
	var sReturn = sUrl;
	if (sReturn == '' || sReturn == ' '){
		sReturn == '#';
	}
	return sReturn;
}

// getPageSize()
// Returns array with page width, height and window width, height
// Core code from - quirksmode.org
function getPageSize(){
	
	var iXScroll, iYScroll;

	if (window.innerHeight && window.scrollMaxY) {	
		iXScroll = document.body.scrollWidth;
		iYScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		iXScroll = document.body.scrollWidth;
		iYScroll = document.body.scrollHeight;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		iXScroll = document.body.offsetWidth;
		iYScroll = document.body.offsetHeight;
	}
	
	var iWindowWidth, iWindowHeight;
	if (self.innerHeight) {	// all except Explorer
		iWindowWidth = self.innerWidth;
		iWindowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		iWindowWidth = document.documentElement.clientWidth;
		iWindowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		iWindowWidth = document.body.clientWidth;
		iWindowHeight = document.body.clientHeight;
	}	
	
	// for small pages with total height less then height of the viewport
	if(iYScroll < iWindowHeight){
		iPageHeight = iWindowHeight;
	} else { 
		iPageHeight = iYScroll;
	}

	// for small pages with total width less then width of the viewport
	if(iXScroll < iWindowWidth){	
		iPageWidth = iWindowWidth;
	} else {
		iPageWidth = iXScroll;
	}

	aPageSize = new Array(iPageWidth,iPageHeight,iWindowWidth,iWindowHeight) 
	return aPageSize;
}

function isUrl (sUrl){
	var oRegEx = new RegExp("http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w-\\+ ./?%:&=#\\[\\]]*)?"); 
    return oRegEx.test(sUrl);
}

function getHTMLCurrencySymbol(sCode){
	sReturn = '';
    switch(sCode){
        case "GBP": sReturn = '&pound;';break;
        case "USD": sReturn = '&#36;';break;
        case "EUR": sReturn = ' &euro;';break;
    }
    return sReturn;
}

function nToBr(sString){
	return 	replaceAll(sString, '\n', "<br/>");
}

function escapeHtml(sText){
	sReturn = sText.replace("<", "&#60;").replace(">", "&#62;").replace("/", "&#47;");	
	return sReturn;
}


function trim(str, chars) {
    return ltrim(rtrim(str, chars), chars);
}

function ltrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

function rtrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

function getTime(){
	var oDate = new Date();
	var iTime = oDate.getTime();
	return iTime;
}

function editInPlace(sDummyControl, sTextControl, sHiddenControl, sHintControl, sEditTab, sDisplay){
	//added sDisplay so we can choose whether to set display: inline/block
	oDummyControl = get(sDummyControl);
	oTextControl = get(sTextControl);
	oHintControl = get(sHintControl);
	oEditTab = get(sEditTab);
	
	this.showEdit = function(event, sDummyControl, sTextControl, sHintControl, sEditTab){
		get(sDummyControl).style.display = 'none';
		get(sTextControl).style.display = sDisplay;		
		get(sHintControl).style.display = 'none';
		get(sEditTab).style.display = sDisplay;
		setFocus(sTextControl);
	}

	this.hideEdit = function(event, sDummyControl, sTextControl, sHiddenControl, sHintControl, sEditTab){

	  	var oInput = get(sTextControl);
		var iMaxRows = oInput.getAttribute("rows");			
		var iMaxChars = oInput.getAttribute("maxlength");
		var iRowLength = iMaxChars / iMaxRows;

		//Add any line breaks
		var aNewLines = new Array();
		var aSplit = oInput.value.split('\n');		
		for (var ii=0; ii < aSplit.length; ii++) {			
			/*if(aSplit[ii].length > iRowLength){
				//find wrap lines longer than 30 chars
				var aTempLines = stringToLines(aSplit[ii], iRowLength);
				if(aTempLines.length >0){
					for (var iii=0; iii < aTempLines.length; iii++) {
						aNewLines[aNewLines.length] = aTempLines[iii];
					}
				}
			}else{*/
				aNewLines[aNewLines.length] = aSplit[ii];
			/*}*/
		}

		//grab the text
		sText = aNewLines.join('\n');
		sText = escapeHtml(sText);

		//save data and hide controls
		get(sDummyControl).style.display = sDisplay;
		get(sTextControl).style.display = 'none';
		//get(sDummyControl).innerHTML = sText;
		get(sDummyControl).innerHTML = nToBr(sText);

		get(sHiddenControl).value = sText;
		oInput.value = sText;
		get(sEditTab).style.display = 'none';		

	}


	this.checkLength = function(oEvent, sDummyControl, sTextControl){
		
		if(!oEvent) {oEvent=window.event;}
			
		var bCanProceed = true;
	  	var oInput = get(sTextControl);
		var sCheckText = oInput.value;
		var iMaxRows = oInput.getAttribute("rows");			
		var iMaxChars = oInput.getAttribute("maxlength");
		
		//add the type charecter into the check text (enter key, or a normal char)
		/*if((oEvent.keyCode == 13 && oEvent.keyCode < 3000) || (oEvent.charCode >30 && oEvent.charCode < 3000)){
			var iCaretPosition = caretPosition(oInput);
			var sChar = String.fromCharCode(oEvent.keyCode);
			if(oEvent.keyCode  ==13){
				sChar = '\n';
			}

			sCheckText = sCheckText.substring(0, iCaretPosition) + sChar + sCheckText.substring(iCaretPosition +1, sCheckText.length);
			iCharCount = sCheckText.length;

			//new line count
			var aSplit = sCheckText.split('\n');			
			var iLineCount = aSplit.length;

		*//*
			//would any line breaks be added?
			for (var i=0; i < aSplit.length -1; i++) {
				if(aSplit[i].length > iMaxRows + 1){
					iLineCount +=1;
				}
			}
		*//*
			if(iLineCount > iMaxRows || iCharCount > iMaxChars){
				bCanProceed = false;
				oEvent.cancelBubble = true;
				oEvent.returnValue = false;
			}
		}*/
		
		return bCanProceed;
		
	}
	
	//Dummy control
	oDummyControl.onclick = this.showEdit.bindAsEventListener(this, sDummyControl, sTextControl, sHintControl, sEditTab);
	oHintControl.onclick  = this.showEdit.bindAsEventListener(this, sDummyControl, sTextControl, sHintControl, sEditTab);
	
	//text control
	oTextControl.onblur = this.hideEdit.bindAsEventListener(this, sDummyControl, sTextControl, 
			sHiddenControl, sHintControl, sEditTab);
	oTextControl.style.display = 'none';
	oTextControl.onkeypress = this.checkLength.bindAsEventListener(this, sDummyControl, sTextControl);

}

//Studio search
function setupSearch() {	
	suggestionsUrl = "/ajaxrequests/tagsearch.php";

	var searchAutocomplete = new Ajax.Autocompleter ( "txtDesignSearch", "divSearchDropdown", suggestionsUrl, {
		paramName: 'query',
		minChars: 2,
		frequency: 0.1,
		useCache: true
	} );
}

// Closes GC preview mask
function closeProductLinkPreview() {
	Effect.Fade('divProductLinkPreview');
	Effect.Fade('divMask');
	return true;
}

// if the dirty switch on a form is tripped,
// ask the user to confirm they really want to leave the page
// set confirmBeforeExit = false before postback on the button that does in fact save the page
var confirmBeforeExit = true;
function confirmExit(e) {
	
	if(confirmBeforeExit == false){
		//straight through, no alert
		return;
	} else {
		
		if (get('_is_dirty').value == 1) {
			sMsg = string00054
			if(get('btnStage4')) {
				get('btnStage4').className = get('btnStage4').className + ' error';	
			} else if(get('btnSave')) {
				get('btnSave').className = get('btnSave').className + ' error';
			}
			
			return sMsg;
		}
	}
}

function makeDirty(sFrom){
	//ooh, this form feels so... dirty
	get('_is_dirty').value = 1;
	//reset this incase we came from IE not-link
	confirmBeforeExit = true;
}

function makeClean(){
	get('_is_dirty').value = 0;
}

function showOnChange(sId, sValue, sSelect){
	//function which shows an element depending on the value of a select element.
	if(get(sSelect).value == sValue){
		get(sId).style.display = "block";
	} else {
		get(sId).style.display = "none";
	}
}


/* shows/hides fields on egghunt form */
function showFields(){
	var ulList = get('ulFields').getElementsByTagName('LI');
	
	//clear old fields
	for (var i = 0; i < ulList.length; i++) {
		if(ulList[i].id != "") {
			ulList[i].style.display = 'none';
		}
	}
	//show new fields
	if(get('ddlEgg').value == 'optRealWorld'){
		showOnChange('liInfo', 'optRealWorld', 'ddlEgg');
		showOnChange('liCountry', 'optRealWorld', 'ddlEgg');	
		showOnChange('file_input_parent', 'optRealWorld', 'ddlEgg');
	} else if (get('ddlEgg').value == 'optWeb') {
		showOnChange('liUrl', 'optWeb', 'ddlEgg');
		showOnChange('liCode', 'optWeb', 'ddlEgg');
	} else if (get('ddlEgg').value == 'optMoo') {
		showOnChange('liCode', 'optMoo', 'ddlEgg');
	}
}

function changeQuantity(){
	if(get('ddlQuantity').value == '0'){
		get('txtQuantity').style.display = "inline";
		setFocus('txtQuantity');		
	}else{
		get('txtQuantity').style.display = "none";		
	}
}

// Displays a mask and popup
function displayMask(targetWrapper, iMaskIndex) {
	oDialog = $(targetWrapper);
	if (!$('divMask')) {
		// Add mask
		$(document.body).insert(new Element('div', { 'id' : 'divMask'}));
		$('divMask').setStyle({backgroundColor : "#333", top : 0, right : 0, bottom : 0, left : 0, opacity: 0.3, zIndex : (iMaskIndex) ? iMaskIndex : 100});

		
		// Fix IE < 7
		if(typeof document.body.style.maxHeight == "undefined") {
	        var arrayPageSize = getPageSize();
       		$("divMask").setStyle({width : arrayPageSize[0] + 'px', height : arrayPageSize[1] + 'px'});

			// cover form elements so they don't show above overlay
			var oDialogWidth = oDialog.getWidth();
			var oDialogHeight = oDialog.getHeight();
			var oIframe = oDialog.insert( new Element('iframe', {'id': 'iframeIEFixer'}));
			$('iframeIEFixer').setStyle({zIndex : '-1', display: 'block', position: 'absolute', top:0, left:0, border: 0, filter : 'mask()', width: oDialogWidth+'px', height: oDialogHeight+'px'});
			var sProtocol = String(self.location).substring(0,5);
			if (sProtocol=="https") {
				oIframe.src = "javascript:'<html></html>';"
			} else {
				oIframe.src = "about:blank";
			}
		}
	
		// Show popup
		if (oDialog) {
			$(document.body).insert({ bottom: oDialog }); // Be careful! If the popup element contains input elements, values are reset on append (or maybe not any more?)
			oDialog.setStyle({display : "block"});
			Element.centerInViewport(oDialog, {zIndex : (iMaskIndex) ? iMaskIndex + 10 : 110});
		}
	} else {
		if (oDialog) {
			oDialog.hide();
		}
		$('divMask').remove();
	}
	
}

//colour picker
function ColourPicker(sId, sColourCsv, fOnClickFunction){

	//properties
	this.controlId = sId;
	this.onClickFunction = fOnClickFunction;
	this.selectedColour = null;
	
	this.getSelector = function(){
		return get(this.controlId).down().down('a');
	}
	
	this.getButton = function(){
		return get(this.controlId).down().down('.clickbutton');
	}
	
	this.getColourBox = function(){
		return get(this.controlId).down('dd').down('ul');
	}
	
	//constructor
	
	// setup the selector button

	oSelector = this.getSelector();
	oButton = this.getButton();
	oSelector.href = "#";
	oButton.href = "#";

	oButton.onclick = function(){
		var oColours = oColourPicker.getColourBox();
		if (oColours.style.display == "none") {
			Effect.BlindDown(oColours, {
				duration: 0.2
			});
		}
		else {
			Effect.BlindUp(oColours, {
				duration: 0.2
			});
		}
		return false;
	}
	oSelector.onclick = oButton.onclick;
	var oColourBox = this.getColourBox();
	
	//add the colours
	var aColours = sColoursCsv.split(',');
	for (var i = 0; i < aColours.length; i++) {
		var oItem = document.createElement("li");
		var oLink = document.createElement("a");
		oLink.id = "aColour_" + aColours[i];
		
		oLink.href = "#";
		oItem.style.backgroundColor = '#' + aColours[i];
		oLink.destination = aColours[i];
		oLink.onmousedown = fOnClickFunction;
		oLink.onmouseup = function(){
			var oColours = oColourPicker.getColourBox();
			oColours.style.display = 'none';
			var oSelector = oColourPicker.getSelector();
			oSelector.style.backgroundColor = '#' + this.destination;
			oColourPicker.selectedColour = this.destination;
		};
		oLink.onclick = function() {return false;};
		
		oItem.appendChild(oLink);
		oColourBox.appendChild(oItem);
	}
}


//font picker
function FontPicker(sId, sFontCsv, fOnClickFunction){

	//properties
	this.controlId = sId;
	this.onClickFunction = fOnClickFunction;
	this.selectedFont = null;
	
	this.getSelector = function(){
		return get(this.controlId).down().down('a');
	}
	
	this.getButton = function(){
		return get(this.controlId).down().down('.clickbutton');
	}
	
	this.getFontBox = function(){
		return get(this.controlId).down('dd').down('ul');
	}
	
	//constructor
	
	// setup the selector button
	oSelector = this.getSelector();
	oButton = this.getButton();
	oSelector.href = "#";
	oButton.href = "#";
	oButton.onclick = function(){
		var oFonts = oFontPicker.getFontBox();
		if (oFonts.style.display == "none") {
			Effect.BlindDown(oFonts, {
				duration: 0.2
			});
		}
		else {
			Effect.BlindUp(oFonts, {
				duration: 0.2
			});
		}
		return false;
	}
	oSelector.onclick = oButton.onclick;
	var oFontBox = this.getFontBox();
	
	//add the fonts
	var aFonts = sFontsCsv.split(',');
	for (var i = 0; i < aFonts.length; i++) {
		var oItem = document.createElement("li");
		var oLink = document.createElement("a");
		
		oLink.id = "aFont_" + aFonts[i];
		oLink.style.background = "url('/images/fonts/" + aFonts[i] + ".png')";
		oLink.href = "#";
		oLink.destination = aFonts[i];
		oLink.onmousedown = fOnClickFunction;
		oLink.onmouseup = function(){
			var oFonts = oFontPicker.getFontBox();
			oFonts.style.display = 'none';
			var oSelector = oFontPicker.getSelector();
			oSelector.style.background = "url('/images/fonts/" + this.destination + ".png')";
			oFontPicker.selectedFont = this.destination;
		};
		oLink.onclick = function() {return false;};
		
		oItem.appendChild(oLink);
		oFontBox.appendChild(oItem);
	}
}

//template picker
function TemplatePicker(sId, sTemplateCsv, fOnClickFunction){

	//properties
	this.controlId = sId;
	this.onClickFunction = fOnClickFunction;
	this.selectedTemplate = null;
	
	this.getSelector = function(){
		return get(this.controlId).down().down('a');
	}
	
	this.getButton = function(){
		return get(this.controlId).down().down('.clickbutton');
	}
	
	this.getTemplateBox = function(){
		return get(this.controlId).down('dd').down('ul');
	}
	
	//constructor
	
	// setup the selector button
	oSelector = this.getSelector();
	oButton = this.getButton();
	oSelector.href = "#";
	oButton.href = "#";
	oButton.onclick = function(){
		var oTemplates = oTemplatePicker.getTemplateBox();
		if (oTemplates.style.display == "none") {
			Effect.BlindDown(oTemplates, {
				duration: 0.2
			});
		}
		else {
			Effect.BlindUp(oTemplates, {
				duration: 0.2
			});
		}
		return false;
	}
	oSelector.onclick = oButton.onclick;
	var oTemplateBox = this.getTemplateBox();
	
	//add the templates
	var aTemplates = sTemplatesCsv.split(',');
	for (var i = 0; i < aTemplates.length; i++) {
		var oItem = document.createElement("li");
		var oLink = document.createElement("a");
		
		oLink.id = "aTemplate_" + aTemplates[i];
		oLink.style.background = "url('/images/templates/small_" + aTemplates[i] + ".png')";
		oLink.href = "#";
		oLink.destination = aTemplates[i];
		oLink.onmousedown = fOnClickFunction;
		oLink.onmouseup = function(){
			var oTemplates = oTemplatePicker.getTemplateBox();
			oTemplates.style.display = 'none';
			var oSelector = oTemplatePicker.getSelector();
			oSelector.style.background = "url('/images/templates/small_" + this.destination + ".png')";
			oTemplatePicker.selectedTemplate = this.destination;
		};
		oLink.onclick = function() {return false;};
		
		oItem.appendChild(oLink);
		oTemplateBox.appendChild(oItem);
	}	
}

// Show three random quotes on hompage for non-English languages
showRandomQuote = function() {
	if (!$('divQuotes')) return false; // Die if no quote container
	var oQuotes = $('divQuotes').getElementsByTagName('li');
	var iNumQuotes = oQuotes.length;
	var iLoopCount = 3;
	for (var i=0; i<iLoopCount; i++) {
		var iRandNum = Math.floor(Math.random()*iNumQuotes) + 1;
		var oQuoteCont = $('liRandomQuote' + iRandNum);
		if (oQuoteCont && oQuoteCont.style.display != "block") {
			oQuoteCont.style.display = "block";
		} else {
			iLoopCount++;
		}
	}
}

AIM = {

    frame : function(c) {

        var n = 'f' + Math.floor(Math.random() * 99999);
        var d = document.createElement('DIV');
        d.innerHTML = '<iframe style="display:none" src="about:blank" id="'+n+'" name="'+n+'" onload="AIM.loaded(\''+n+'\')"></iframe>';
        document.body.appendChild(d);

        var i = document.getElementById(n);
        if (c && typeof(c.onComplete) == 'function') {
            i.onComplete = c.onComplete;
        }

        return n;
    },

    form : function(f, name) {
        f.setAttribute('target', name);
    },

    submit : function(f, c) {
        AIM.form(f, AIM.frame(c));
        if (c && typeof(c.onStart) == 'function') {
            return c.onStart();
        } else {
            return true;
        }
    },

    loaded : function(id) {
        var i = document.getElementById(id);
        if (i.contentDocument) {
            var d = i.contentDocument;
        } else if (i.contentWindow) {
            var d = i.contentWindow.document;
        } else {
            var d = window.frames[id].document;
        }
        if (d.location.href == "about:blank") {
            return;
        }

        if (typeof(i.onComplete) == 'function') {
            i.onComplete(d.body.innerHTML);
        }
    }

}


function textLengthOverflowWarning(sTextId, bOverflow) {
	
	var sInputId = 'txtLine_' + sTextId;
	//reset error class on textbox 
	get(sInputId).className = get(sInputId).className.replace("error", "");
	
	if (bOverflow == 1 || bOverflow == true) {
		
		if(get(sInputId).className.indexOf("error") == -1) {
			get(sInputId).className = get(sInputId).className + " error";
			showWarning(string00159, true);
		} 
			
	} else {
		if(get(sInputId).className.indexOf("textbox") == -1) {
			get(sInputId).className = get(sInputId).className + " textbox";
		}
		hideWarning();
	}
	
}
