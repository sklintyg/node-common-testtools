/*
 * Copyright (C) 2016 Inera AB (http://www.inera.se)
 *
 * This file is part of sklintyg (https://github.com/sklintyg).
 *
 * sklintyg is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * sklintyg is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Holds helper functions for protractor selectors and actions that are needed often in pages.
 */
/*globals protractor,element,Promise, logger */
'use strict';
var containers = [];

function init(scrollableContainers) {
	containers = scrollableContainers;
	
	protractor.ElementArrayFinder.prototype.getByText = function (compareText) {
		var foundElement;
		return this.each(function (element) {
			element.getText().then(function (elementText) {
				if (elementText.trim() === compareText) {
					foundElement = element;
				}
			});
		}).then(function () {
			return foundElement;
		});
	};
	protractor.ElementFinder.prototype.typeKeys = function (input) {
		return moveAndSendKeys(this, input, input);
	};
}


function getId(elm) {
	//funktion för att ta fram Id för elementet, om det saknas kollar vi om överordnat element har ett ID
	return elm.getAttribute('Id').then(function(id){
			if (!id) {
				logger.silly('hittade inget ID på elementet, kollar överordnat element');
				return id = getId(elm.element(by.xpath('..'))).then(function(id){
					return id;	
				});
			} else {
				return elm.getAttribute('Class').then(function(elmClass){
					logger.silly('hittade element med id="' + id + '" class= "' + elmClass + '"');
					return id;
				});
			}
		});
}

function moveAndSendKeys(elm, keys, description) {
			if (typeof description === 'undefined') {
				description = '';
			}
			
			var EC = protractor.ExpectedConditions;
			
			return browser.wait(elm.isPresent(), 5000).then(function(){
					return getId(elm)
				.then(function(elmId){
					//console.log(elmId);
					return scrollTo(elmId)
					.then(function(){
						return browser.wait(EC.visibilityOf(elm), 5000);
					})
					.then(function(){
						return elm.sendKeys(keys).then(function() {
							if (typeof keys !== 'string') {
								description += ', Protractor key';
							}
								return logger.silly('sendKeys OK - ' + description + ' skickat till element med id: ' + elmId);
							}, function(reason) {
								console.trace(reason);
								throw ('FEL, ' + description + ', ' + reason);
										});
					})
					.then(function(){
						// clean up and make sure no special keys are in use.
						// https://github.com/angular/protractor/issues/698
						return browser.actions()
							.sendKeys(protractor.Key.NULL)
							.perform();
					});
				});
				
			});
			
}

function scrollContainer(containerId, elmId){
	/* 
		containerId - Id på scrollable container
		elmId - Id på element att scrolla till
	*/
	
	// Den här funktionen är bara till för "scrollable" element.
	// Den här funktionen scrollar bara vertikalt.
	
	if (elmId) {
		var script = 'var elm = document.getElementById("' + elmId + '"); ';
		
		script += 'parent = document.getElementById("' + containerId + '");';
		script += 'if (!Element.prototype.documentOffsetTop) {';
		script += 'Element.prototype.documentOffsetTop = function () {';
		script += ' return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );';
		script += ' };';
		script += '}';
			
		script += 'if (!Element.prototype.documentOffsetBottom) {'
		script += 'Element.prototype.documentOffsetBottom = function () {';
		script += ' return window.height - this.offsetTop - this.offsetHeight + ( this.offsetParent ? this.offsetParent.documentOffsetBottom() : 0 );';
		script += ' };';
		script += '}';

		script += 'elm.scrollIntoView();';
		script += ' parent.scrollTop = parent.scrollTop - parent.clientHeight/2;';
	
		return browser.executeScript(script);
	} else {
		throw('funktionen scrollContainer hittade inget ID på elementet och kunde inte skrolla');
	}
}

function isParentAScrollableContainer(elmId, containers, offset){
	/* 
		elmId - id of element
		offset - number of offset parents ( 0 = no parents, 1 = 1 parent etc.. )
	
	*/
	
	var script = 'var elm = document.getElementById("' + elmId + '")'
	
	for (var i = 0; i < offset; i++) {
		script += '.parentNode';
	}
		
	script += ';';
	script += 'var containers = [';
	
	for (var i = 0; i < containers; i++) {
		script += containers[i] + ',';
	}	
	script += '];';

	script += ' function isParentContainer(element) { ';
	script += ' if (document.body === element) {return "body";}';
	
	script += ' if (element.id !== "" && containers.indexOf(element.id) !== -1) { ';
	script += ' return elm.id; } else { return false; }';
	script += '}';
	script += 'return isParentContainer(elm);';
	return browser.executeScript(script);
}

function getScrollableContainer(elmId, containers, offset) {
	//Notis: Iteration kan inte användas i  executeScript i firefox. https://bugzilla.mozilla.org/show_bug.cgi?id=1106913 
	//Loopar server-side med offset.
	return isParentAScrollableContainer(elmId, containers, offset).then(function(result){
		if (result !== false) {
			logger.silly('offset: ' + offset);
			return result;
		} else {
			return getScrollableContainer(elmId, containers, offset + 1);
		}
	});
}


function scrollTo(elmId) {
	//Notis: Iteration kan inte användas i  executeScript i firefox. https://bugzilla.mozilla.org/show_bug.cgi?id=1106913 
	//Loopar server-side med offset.
			
	return getScrollableContainer(elmId, containers, 1).then(function(containerId){
		if (containerId === 'body') {
			return windowScrollTo(elmId);
		} else {
			return scrollContainer(containerId, elmId);
		}
		
	});		
}

function windowScrollTo(id) {
	//Scroll to center the element in the middle of the screen
	logger.silly('scrollar till ' + id);
	var centerScript = 'if (!Element.prototype.documentOffsetTop) {'
	centerScript += 'Element.prototype.documentOffsetTop = function () {';
	centerScript += ' return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );';
	centerScript += ' };';
	centerScript += '}';
	centerScript += 'var top = document.getElementById("' + id + '").documentOffsetTop() - (window.innerHeight / 2 );'
	centerScript += ' window.scrollTo( 0, top );';
	
	return browser.executeScript(centerScript);
}

module.exports = {
	init: init,
	moveAndSendKeys: moveAndSendKeys,
	getId: getId,
	scrollContainer: scrollContainer,
	scrollTo: scrollTo,
	windowScrollTo: windowScrollTo
};