var iStartDelay = 4000;
var iDelay = 2800;
var iStartFrame = 0;

initSlideshow = function () {
	var aSlides = $('slideshow').getElementsByTagName('li');
	for( i=0; i < aSlides.length; i++) {
		if(aSlides[i].className!='static') {
			aSlides[i].style.display = 'none';
		}
	}
	iEndFrame = aSlides.length - 1;
	startSlideshow(iStartFrame, iEndFrame, iDelay, aSlides);
}

startSlideshow = function (iStartFrame, iEndFrame, iDelay, aSlides) {
	setTimeout(nextSlide(iStartFrame, iStartFrame, iEndFrame, iDelay, aSlides), iStartDelay);
}


nextSlide = function(iFrame, iStartFrame, iEndFrame, iDelay, aSlides) {
	return (function() {
		aSlides = $('slideshow').getElementsByTagName('li');
		Effect.Fade(aSlides[iFrame]);
		if (iFrame == iEndFrame) { iFrame = iStartFrame; } else { iFrame++; }
		aSlidesAppear = aSlides[iFrame];
		setTimeout("Effect.Appear(aSlidesAppear);", 0);

		// Set a longer pause for Holiday Cards
		oImage = aSlides[iFrame].getElementsByTagName('img')[0];
		var iSlideDelay = (oImage.title.toLowerCase() == "holiday cards") ? 3700 : 1850;
		
		setTimeout(nextSlide(iFrame, iStartFrame, iEndFrame, iDelay), iDelay + iSlideDelay);
	})
}