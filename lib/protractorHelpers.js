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
 * Holds helper functions for protractor selectors.
 */
/*globals protractor,element,Promise, logger */
'use strict';
var moveAndSendKeys = require('./uiHelpers').moveAndSendKeys;

function init() {
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

module.exports = {
	init: init
};