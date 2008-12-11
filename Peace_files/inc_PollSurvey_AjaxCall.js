<!--
   var http_request = false;
   function makeRequest(url, parameters) {
      http_request = false;
      if (window.XMLHttpRequest) { // Mozilla, Safari,...
         http_request = new XMLHttpRequest();
         if (http_request.overrideMimeType) {
         	// set type accordingly to anticipated content type
            //http_request.overrideMimeType('text/xml');
            http_request.overrideMimeType('text/html');
         }
      } else if (window.ActiveXObject) { // IE
         try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
         } catch (e) {
            try {
               http_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
         }
      }
      if (!http_request) {
         alert('Cannot create XMLHTTP instance');
         return false;
      }
      http_request.onreadystatechange = alertContents;
      http_request.open('GET', url + parameters, true);
      http_request.send(null);
   }

   function alertContents() {
      if (http_request.readyState == 4) {
         if (http_request.status == 200) {
            //alert(http_request.responseText);
            result = http_request.responseText;
			//alert(result);
   		    document.getElementById('poll').style.display = 'none';			
			document.getElementById('poll').id = 'poll_hide';			
   		    document.getElementById('pollresults').style.display = 'block';						
            document.getElementById('pollresults').innerHTML = result;      
			document.getElementById('pollresults').id = 'poll';	
         } else {
            alert('Please select an item before voting.');
         }
      }
   }
   
   function get(obj,n) {   	
      var getstr = "?";
      for (i=0; i<obj.childNodes.length; i++) {
	  	
         if (obj.childNodes[i].tagName == "INPUT") {
            if (obj.childNodes[i].type == "text") {
               getstr += obj.childNodes[i].name + "=" + obj.childNodes[i].value + "&";
            }
            if (obj.childNodes[i].type == "hidden") {
               getstr += obj.childNodes[i].name + "=" + obj.childNodes[i].value + "&";
            }			
            if (obj.childNodes[i].type == "checkbox") {
               if (obj.childNodes[i].checked) {
                  getstr += obj.childNodes[i].name + "=" + obj.childNodes[i].value + "&";
               } else {
                  getstr += obj.childNodes[i].name + "=&";
               }
            }
            if (obj.childNodes[i].type == "radio") {
               if (obj.childNodes[i].checked) {
                  getstr += obj.childNodes[i].name + "=" + obj.childNodes[i].value + "&";			  
               }
            }
         }   
         if (obj.childNodes[i].tagName == "SELECT") {
            var sel = obj.childNodes[i];
            getstr += sel.name + "=" + sel.options[sel.selectedIndex].value + "&";
         }
       
	   /*
		if (obj.childNodes[i].tagName == "LABEL") {
			var a = document.getElementsByTagName('label');
			for (j=0; j<a.length; j++) {
	            if (a[j].childNodes.item(0).type == "radio") {
	                  getstr += a[j].childNodes.item(0).name + "=" +a[j].childNodes.item(0).value + "&";			  					  	  
	            }
					
			}
		}
		*/ 
      }	
	  var xurl = "http://"+location.host+"/teens/includes/poll/PollResults.cfm";	  
	  if (n==2) {	
      makeRequest(xurl, getstr);
	  }
   }

-->