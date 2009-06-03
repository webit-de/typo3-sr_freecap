/***************************************************************
*  Copyright notice
*
*  (c) 2007-2008 Stanislas Rolland <typo3(arobas)sjbr.ca>
*  All rights reserved
*
*  This script is part of the TYPO3 project. The TYPO3 project is
*  free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*  A copy is found in the textfile GPL.txt and important notices to the license
*  from the author is found in LICENSE.txt distributed with these scripts.
*
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*
*  This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/
/*
 * Javascript functions for TYPO3 plugin freeCap (sr_freecap)
 *
 * TYPO3 CVS ID: $Id$
 */

/*
 * Loads a new freeCap image
 *
 * @param	string		id: identifier used to uniiquely identify the image
 *
 * @return	void
 */
function newFreeCap(id, noImageMessage) {
	if (document.getElementById) {
			// extract image name from image source (i.e. cut off ?randomness)
		var theImage = document.getElementById("tx_srfreecap_pi2_captcha_image_"+id);
		var parts = theImage.src.split("&");
			// add ?(random) to prevent browser/isp caching
			// parts[0] should be base url up to eID parameter
			// parts[1] should be id=page_id
			// parts[2] should be L=sys_language_uid
		var LParameterInUse = (typeof(parts[2]) != "undefined") && (parts[2].indexOf("L=") != -1);
		theImage.src = parts[0] + "&" + parts[1] + (LParameterInUse ? "&" + parts[2] : "") + "&set=" + Math.round(Math.random()*100000);
	} else {
		alert(noImageMessage ? noImageMessage : "Sorry, we cannot autoreload a new image. Submit the form and a new image will be loaded.");
	}
}

/*
 * Plays the audio captcha
 *
 * @param	string		id: identifier used to uniquely identify the wav file
 * @param	string		wavURL: url of the wave file generating script
 *
 * @return	void
 *
 * Note: In order for this to work with IE8, [SYS][cookieDomain] must be set using the TYPO3 Install Tool
 */
function playCaptcha(id, wavURL, noPlayMessage) {
	if (document.getElementById) {
		var theAudio = document.getElementById("tx_srfreecap_pi2_captcha_playAudio_"+id);
		var wavURLForOpera = wavURL + "&nocache=" + Math.random();
		while (theAudio.firstChild) {
			theAudio.removeChild(theAudio.firstChild);
		}
		var objectElement = document.createElement("object");
		objectElement.setAttribute("id", "audio/x-wav");
		objectElement.setAttribute("type", "audio/x-wav");
		objectElement.setAttribute("data", wavURLForOpera);
		objectElement.setAttribute("height", 0);
		objectElement.setAttribute("width", 0);
		try {
			objectElement.innerHTML = '<a href="' + wavURLForOpera + '">' + (noPlayMessage ? noPlayMessage : 'Sorry, we cannot play the word of the image.') + '</a>';
		} catch (e) {
				// IE8 does not allow any element other than param as child of object
			objectElement.setAttribute("altHTML", '<a href="' + wavURLForOpera + '">' + (noPlayMessage ? noPlayMessage : 'Sorry, we cannot play the word of the image.') + '</a>');
		}
		theAudio.appendChild(objectElement);
			// IE8 needs a delay before the param children are appended...
		window.setTimeout("addAudioCaptchaParams(" + id + ");", 50);
	} else {
		alert(noPlayMessage ? noPlayMessage : "Sorry, we cannot play the word of the image.");
	}
}

function addAudioCaptchaParams(id) {
	var theAudio = document.getElementById("tx_srfreecap_pi2_captcha_playAudio_"+id);
	var objectElement = theAudio.firstChild;
	var parameters = {
		"type"		: "audio/x-wav",
		"filename"	: wavURLForOpera,
		"src"		: wavURLForOpera,
		"autoplay"	: true,
		"autoStart"	: 1,
		"hidden"	: true,
		"controller"	: false
	};
	for (var parameter in parameters) {
		if (parameters.hasOwnProperty(parameter)) {
			var paramElement = document.createElement("param");
			paramElement.setAttribute("value", parameters[parameter]);
			paramElement.setAttribute("name", parameter);
			paramElement = objectElement.appendChild(paramElement);
		}
	}
}
