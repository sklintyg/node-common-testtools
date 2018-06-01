/*
 * Copyright (C) 2018 Inera AB (http://www.inera.se)
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

'use strict';

function anyRandomString(L) {
	if (typeof(L) === 'undefined') {
		L = Math.floor(Math.random() * 100) + 5;
	}
	var common = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstuvwxyzåäö0123456789';
	var sanitizerTestStrings = [
	//These are just some random strings and should not be trusted as a complete collection.
	'&#x0022;',
	'&euro;',
	'&#8364;',
	'&#x20AC;',
	'<',
	'>',
	'&lt;',
	'&gt;',
	'<script><script>alert(1234)</script>',
	'<scr<script>ipt>alert(1234)</script>',
	'/',
	'//',
	'///',
	'\\',
	'\\\\',
	'\\\\\\',
	'//',
	'#',
	'<!--',
	'-->'
	];
	
	var s = '';
	var randomChar = function() {
		var n = Math.floor(Math.random() * 65536);
		return String.fromCharCode('0x' + n);
	}
	var randomCommonChar = function(){
		return common.charAt(Math.floor(Math.random() * common.length))
	}
	var randomSanitizercheck = function(){
		return sanitizerTestStrings[Math.floor(Math.random() * sanitizerTestStrings.length)];
	}
		  
	while (s.length < L) { 
		s += randomChar();
		s += randomCommonChar();
		s += randomSanitizercheck();
    }	  
    return s.substr(0,L);
}
function ctrlcharsString(L) {
	if (typeof(L) === 'undefined') {
		L = 100;
	}
	var common = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstuvwxyzåäö0123456789';
	var ctrlCharString = '';
	
	while (ctrlCharString.length < 20) { 
		ctrlCharString += String.fromCharCode('0x' + ctrlCharString.length);
    }	 
	ctrlCharString += String.fromCharCode('0x1a');
	ctrlCharString += String.fromCharCode('0x1b');
	ctrlCharString += String.fromCharCode('0x1c');
	ctrlCharString += String.fromCharCode('0x1d');
	ctrlCharString += String.fromCharCode('0x1e');
	ctrlCharString += String.fromCharCode('0x1f');
	
	
	var s = '';
	var randomChar = function() {
		var n = Math.floor(Math.random() * 65536);
		return String.fromCharCode('0x' + n);
	}
	var randomSanitizercheck = function(){
		return sanitizerTestStrings[Math.floor(Math.random() * sanitizerTestStrings.length)];
	}
		  
	while (s.length < L) { 
		s += randomChar();
		s += ctrlCharString;
    }	  
    return s.substr(0,L);
}


function commonRandomString(min, max){
	if (typeof(min) === 'undefined') {
		min = 1;
	}
	
	if (typeof(max) === 'undefined') {
		max = min + 5;
	}
	
    var s = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstuvwxyzåäö0123456789';

	var length = this.shuffle([min, min, min, min, min, max, (min + max) / 2])[0];
	
    while (s.length < length) { 
        s += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return s;
}


module.exports = {
    shuffle: function(o) {
        for (var j, x, i = o.length; i;) {
            j = Math.floor(Math.random() * i);
            x = o[--i];
            o[i] = o[j];
            o[j] = x;
        }
        return o;
    },
    generateTestGuid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },
    randomTrueFalse: function() {
        return this.shuffle([true, false])[0];
    },
	
	/* Normal characterSet */
	randomTextString: commonRandomString,
	
	/* Any UTF-8 + sanitizerTestStrings*/
	anyRandomTextString: anyRandomString,
    
	dateFormat: function(date) {
        var d = date.toISOString().slice(0, 10).replace(/-/g, '-');
        return d;
    },
    dateToText: function(prop) {
        if (prop) {
            var date = new Date(prop);
            var monthNames = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
            var month = monthNames[date.getUTCMonth()];
            return date.getDate() + ' ' + month + ' ' + date.getFullYear();
        }
        return 'Ej angivet';
    },
    ejAngivetIfNull: function(prop) {
        if (prop && prop !== '') {
            return prop;
        }
        return 'Ej angivet';
    },
	boolTillJaEllerEjAngivet: function(val) {
        if (val) {
            return 'Ja';
        } else {
            return 'Ej angivet';
        }
    },
    boolTillJaNej: function(val) {
        if (val) {
            return 'Ja';
        } else {
            return 'Nej';
        }
    }
};
