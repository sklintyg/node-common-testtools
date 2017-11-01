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
	var cursor = element(by.id('cursorId932wjadokvfi929q3ij'));
	
	return cursor.isPresent().then(function(elm){
		if (elm) {
			
			var moveCursorScript = 'if (!Element.prototype.documentOffsetTop) {'
			moveCursorScript += 'Element.prototype.documentOffsetTop = function () {';
			moveCursorScript += ' return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );';
			moveCursorScript += ' };';
			moveCursorScript += '}';
			
			moveCursorScript = 'if (!Element.prototype.documentOffsetLeft) {'
			moveCursorScript += 'Element.prototype.documentOffsetLeft = function () {';
			moveCursorScript += ' return this.offsetLeft + ( this.offsetParent ? this.offsetParent.documentOffsetLeft() : -24 );';
			moveCursorScript += ' };';
			moveCursorScript += '}';
			
			moveCursorScript += 'var top = document.getElementById("' + id + '").documentOffsetTop(); '
			moveCursorScript += 'var left = document.getElementById("' + id + '").documentOffsetLeft(); '
			
			moveCursorScript += 'document.getElementById("cursorId932wjadokvfi929q3ij").style.top = top + "px"; ';
			moveCursorScript += 'document.getElementById("cursorId932wjadokvfi929q3ij").style.left = left + "px"; ';
			
			//debug in frontend
			//moveCursorScript += 'console.log("Flyttar cursor till kordinater top: " + top + ", left: " + left);';
			
			logger.silly('cursor is present');
			
			return browser.executeScript(moveCursorScript);
		} else {
			logger.silly('cursor is not present');
			return createCursor().then(function(){
				moveCursor(id);
			});	
		}
	});
}

function scrollToCenterElement(id) {
	//Scroll to center the element in the middle of the screen
	logger.silly('scrollar till ' + id);
	var centerScript = 'if (!Element.prototype.documentOffsetTop) {'
	centerScript += 'Element.prototype.documentOffsetTop = function () {';
	centerScript += ' return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );';
	centerScript += ' };';
	centerScript += '}';
	centerScript += 'var top = document.getElementById("' + id + '").documentOffsetTop() - (window.innerHeight / 2 );'
	centerScript += ' window.scrollTo( 0, top );';
	
	//Front-end debug
	//centerScript += ' console.log( "skrollar till : " + top );';
	
	return browser.executeScript(centerScript);
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
				logger.info('hittade element med id="' + id + '" class= "' + elmClass + '"');
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
						return logger.info('sendKeys OK - ' + description + "Sträng: " + string + ', skickat till element med id: ' + elmId);
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

function moveAndSendKeys(elm, keys, description) {
			if (typeof description === 'undefined') {
				description = '';
			}
			return getId(elm).then(function(elmId){
				return scrollToCenterElement(elmId)
				.then(function(){
					return moveCursor(elmId);
				})
				.then(function(){
					return browser.actions().mouseMove(elm).perform();
				})
				.then(function () {
						logger.silly('Musen och fönstret är flyttat nu skickar vi');
						//Använder paste istället för sendKeys om det är en lång sträng som ska in i textArea, eftersom sendKeys är välldigt långsammt (skickar en bokstav i taget)
						return elm.getTagName().then(function(tagName){
							if (tagName === 'textarea') {
								logger.silly('Lägger in text i textArea');
								return pasteString(elm, keys, description, elmId);
							} else {
								return elm.sendKeys(keys).then(function() {
									if (typeof keys !== 'string') {
										description += ', Protractor key';
									}
									return logger.info('sendKeys OK - ' + description + ' skickat till element med id: ' + elmId);
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
}

module.exports = {
	moveAndSendKeys: moveAndSendKeys,
	pasteString: pasteString,
	getId: getId,
	scrollToCenterElement: scrollToCenterElement,
	moveCursor: moveCursor
};
