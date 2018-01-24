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
 * Holds helper functions for actions that are needed often in pages.
 */
/*globals protractor,element,Promise, logger */
'use strict';

function createCursor() {
	var cursor = 'var cursor = document.createElement("IMG"); ';
	cursor += 'cursor.setAttribute("id", "cursorId932wjadokvfi929q3ij");';
	cursor += 'cursor.style.height = "24px";';
	cursor += 'cursor.style.width = "24px";';
	cursor += 'cursor.style.position = "absolute";';
	cursor += 'cursor.style.zIndex = "10000";';
	cursor += 'cursor.style.backgroundColor = "white";';
	cursor += 'cursor.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAeklEQVR4Ae3NvQ0CMAwF4UvHBHHHCCzBZBFMwC60MARJloAFqIzkwhISP3afV9+nx1p4Oy7UDLii3DKk0p0EX514fkfpv8lwYjnPKNlbfmbL/EfEiFq+AcTIQIBC+0ym57yRA/rt5eQ5Th72G5xYHgaFI5oBDc2BNXgBgWZAImyX2FkAAAAASUVORK5CYII=";';
	cursor += 'var body = document.getElementsByTagName("BODY")[0];';
	cursor += 'body.appendChild(cursor);';
	
	return browser.executeScript(cursor);
}

function moveCursor(id) {
	var cursorId = 'cursorId932wjadokvfi929q3ij';
	var cursor = element(by.id(cursorId));
	
	return cursor.isPresent().then(function(elm){
		if (elm) {
			
			var moveCursorScript = 'if (!Element.prototype.documentOffsetTop) {';
			moveCursorScript += 'Element.prototype.documentOffsetTop = function () {';
			moveCursorScript += ' return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );';
			moveCursorScript += ' };';
			moveCursorScript += '}';
			
			moveCursorScript += 'if (!Element.prototype.documentOffsetLeft) {'
			moveCursorScript += 'Element.prototype.documentOffsetLeft = function () {';
			moveCursorScript += ' return this.offsetLeft + ( this.offsetParent ? this.offsetParent.documentOffsetLeft() : -24 );';
			moveCursorScript += ' };';
			moveCursorScript += '}';
			
			moveCursorScript += 'var top = document.getElementById("' + id + '").documentOffsetTop(); ';
			moveCursorScript += 'var left = document.getElementById("' + id + '").documentOffsetLeft(); ';
			
			moveCursorScript += 'document.getElementById("' + cursorId + '").style.top = top + "px"; ';
			moveCursorScript += 'document.getElementById("' + cursorId + '").style.left = left + "px"; ';
			
			//debug in frontend
			//moveCursorScript += 'console.log("Flyttar cursor till kordinater top: " + top + ", left: " + left);';
			//console.log(moveCursorScript);
			
			//logger.silly('cursor is present');
			
			return browser.executeScript(moveCursorScript);
		} else {
			//logger.silly('cursor is not present');
			return createCursor().then(function(){
				moveCursor(id);
			});	
		}
	});
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

function createContainer(){
	var ContainerScript = 'var txtAreaContainer = document.createElement("DIV"); ';
	
	ContainerScript += 'var txtArea = document.createElement("TEXTAREA"); ';
	ContainerScript += 'txtArea.setAttribute("id", "textareaOadfsgq23dfs"); ';
	ContainerScript += 'txtAreaContainer.appendChild(txtArea); ';
	
	ContainerScript += 'txtAreaContainer.setAttribute("id", "containerIddegf34qSrf34");';
	ContainerScript += 'txtAreaContainer.style.width = "auto";';
	ContainerScript += 'txtAreaContainer.style.height = "auto";';
	ContainerScript += 'txtAreaContainer.style.position = "fixed";';
	ContainerScript += 'var body = document.getElementsByTagName("BODY")[0];';
	ContainerScript += 'body.appendChild(txtAreaContainer); ';
	
	
	return browser.executeScript(ContainerScript);
}

function pasteString(elm, string, description, elmId) {
	//vi copy-pastar texten till elementet eftersom att elementet ofta inte har ett ID. och CSS selection kan bli fel om vi antar att det är en <textarea>.
	if (process.platform !== 'win32') {
		//På MacOS funkar det inte att skicka CTRL eller MacOs motsvarighet COMMAND + a/c/v så där faller vi tillbaka till protractors element.sendKeys
		return elm.sendKeys(string).then(function(){
			return logger.silly('sendKeys OK - ' + "Sträng: " + string + ', skickat till element med id: ' + elmId);
		});
	} else {		
		var textArea = element(by.id('textareaOadfsgq23dfs'));
		
		return textArea.isPresent().then(function(textAreaPresent){
			if (textAreaPresent) {
				
				var showAndCopyTextScript = 'document.getElementById("containerIddegf34qSrf34").style.zIndex="20000"; ';
				showAndCopyTextScript += 'var textNode = document.createTextNode(' + JSON.stringify(string) + '); ';
				showAndCopyTextScript += 'document.getElementById("textareaOadfsgq23dfs").appendChild(textNode); ';
				
				var hideAndClean = 'document.getElementById("containerIddegf34qSrf34").style.zIndex="-20000"; ';
				hideAndClean += 'document.getElementById("textareaOadfsgq23dfs").innerHTML = ""';
				
				//console.log(showAndCopyTextScript);
				return browser.executeScript(showAndCopyTextScript)
				.then(function(){
					return textArea.sendKeys(protractor.Key.CONTROL + "a");
				})
				.then(function(){
					return textArea.sendKeys(protractor.Key.CONTROL + "c")
				})
				.then(function(){
					return browser.executeScript(hideAndClean);
				})
				.then(function(){
					return elm.sendKeys(protractor.Key.CONTROL + "v")
						.then(function(){
							if (description !== '') {
								description += ', ';
							}
							return logger.silly('sendKeys OK - ' + description + "Sträng: " + string + ', skickat till element med id: ' + elmId);
						}, function(reason) {
							console.trace(reason);
						throw ('FEL, ' + description + ', ' + reason);
						});
					});
			} else {
				return createContainer().then(function(){
					return pasteString(elm, string);
				});
			}
		});
	}
}

function moveAndSendKeys(elm, keys, description) {
			if (typeof description === 'undefined') {
				description = '';
			}
			
			var EC = protractor.ExpectedConditions;
			
			return browser.wait(elm.isPresent(), 5000).then(function(){
				return browser.wait(EC.visibilityOf(elm), 5000)
				.then(function(){
					return scrollTo(elm);
				})
				.then(function() {
					return getId(elm);
				})
				.then(function(elmId){
					console.log(elmId);
					
					return moveCursor(elmId)
					
					/*.then(function(){
						return browser.actions().mouseMove(elm).perform();
					})*/
					.then(function () {
							//logger.silly('Musen och fönstret är flyttat nu skickar vi');
							//Använder paste istället för sendKeys om det är en lång sträng som ska in i textArea, eftersom sendKeys är välldigt långsammt (skickar en bokstav i taget)
							//console.log(process.platform);
							return elm.getTagName().then(function(tagName){
								if (tagName === 'textarea') {
									//logger.silly('Lägger in text i textArea');
									return pasteString(elm, keys, description, elmId);
								} else {
									return elm.sendKeys(keys).then(function() {
										if (typeof keys !== 'string') {
											description += ', Protractor key';
										}
										return logger.silly('sendKeys OK - ' + description + ' skickat till element med id: ' + elmId);
									}, function(reason) {
										console.trace(reason);
										throw ('FEL, ' + description + ', ' + reason);
									});
								}
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

function scrollContainer(elmId, parents){
	// Den här funktionen är bara till för "scrollable" element.
	// Den här funktionen scrollar bara vertikalt.
	
	if (elmId) {
		var script = 'var elm = document.getElementById("' + elmId + '"); ';
		
		script += 'var parent = elm';
		for (var i = 0; i < parents; i++) { 
		script += '.parentNode';
		}
		script += ';';	
		script += 'var innerHeight = (parent.height > window.innerHeight) ? window.innerHeight - parent.offsetTop : window.innerHeight;'
		script += ' parent.scrollTop = elm.offsetTop - parent.offsetTop - innerHeight/2; ';
		
		return browser.executeScript(script);
	} else {
		throw('funktionen scrollContainer hittade inget ID på elementet och kunde inte skrolla');
	}
}

function isParentScrollable(elmId, offset){
	/* 
		elmId - id of element
		offset - number of parents ( 0 = no parents, 1 = 1 parent etc.. )
	
	*/
	
	var script = 'var elm = document.getElementById("' + elmId + '")'
	
	for (var i = 0; i < offset; i++) {
		script += '.parentNode';
	}
	
	script += ';';
	script += 'function isScrollable(element) { ';
	script += ' console.log("element.scrollHeight: " + element.scrollHeight); ';
	script += ' if ((element.scrollHeight > element.clientHeight) || (element.scrollWidth > element.clientWidth)) { ';
	script += ' return elm.id; } else { return false; }';
	script += '}';
	script += 'return isScrollable(elm);';
	return browser.executeScript(script).then(function(result){
			return result;
	});
}

function getScrollableParentOffset(elmId, offset) {
	//Notis: Iteration kan inte användas i  executeScript i firefox. https://bugzilla.mozilla.org/show_bug.cgi?id=1106913 
	//Använder funktion loop server-side.
	return isParentScrollable(elmId, offset).then(function(result){
		if (result !== false) {
			console.log(result);
			return offset;
		} else {
			return getScrollableParentOffset(elmId, offset + 1);
		}
	});
}


function scrollTo(elm) {
	
	return getId(elm)
	.then(function(elmId){
		if (elmId) {
			//Notis: Iteration kan inte användas i  executeScript i firefox. https://bugzilla.mozilla.org/show_bug.cgi?id=1106913 
			//Använder funktion loop server-side.
			return getScrollableParentOffset(elmId, 1).then(function(offset){
				return scrollContainer(elmId, offset);
			});	
		} else {
			throw('funktionen scrollContainer hittade inget ID på elementet och kunde inte skrolla');
		}
	});	
}

module.exports = {
	moveAndSendKeys: moveAndSendKeys,
	pasteString: pasteString,
	getId: getId,
	moveCursor: moveCursor,
	scrollContainer: scrollContainer, //Använder parent offset
	scrollTo: scrollTo //Använder isScrollable logik
};
