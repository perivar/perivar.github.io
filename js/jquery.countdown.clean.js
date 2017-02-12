/*
 * jquery-countdown plugin
 *
 * Copyright (c) 2009 Martin Conte Mac Donell <Reflejo@gmail.com>
 * https://github.com/Reflejo/jquery-countdown
 * Enhanced to work with several counters on one page by
 * lhoeppner (http://jsfiddle.net/lhoeppner/RGyPQ/)
 * Cleaned up by Per Ivar Nerseth, 2017
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 */
// convert a date object to the format specified
var formatCompute = function(d, options) {
	var format = options.format;
	var parse = {
		d: Math.floor((d - new Date(d.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24)),
		h: d.getUTCHours(),
		m: d.getUTCMinutes(),
		s: d.getUTCSeconds()
	};
	return format.replace(/(dd|hh|mm|ss)/g, function($0, form) {
		return pad(parse[form[0]]);
	});
};
// add leading zeros
var pad = function(x) {
	return (1e15 + "" + x).slice(-2)
};
jQuery.fn.countdown = function(userOptions) {
	// Default options
	var options = {
		stepTime: 60,
		// startTime and format MUST follow the same format.
		// also you cannot specify a format unordered (e.g. hh:ss:mm is wrong)
		format: "dd:hh:mm:ss",
		startTime: "01:12:32:55",
		digitImages: 6,
		digitWidth: 67,
		digitHeight: 90,
		timerEnd: function() {},
		image: "digits.png",
		continuous: false,
		start: true
	};
	$.extend(options, userOptions);
	var digits = [],
		intervals = [];
	var start = function(element) {
		if (element.attr('started') != 'true') {
			element.attr('started', true)
			intervals.main = setInterval(function() {
				moveDigit(digits.length - 1, element.data('options'));
			}, 1000);
		}
	};
	// Draw digits in given container
	var createDigits = function(where, options) {
		var counter = 0;
		// Iterate each startTime digit, if it is not a digit
		// we'll asume that it's a separator
		var mFirstPos, sFirstPos;
		// reset digits and intervals array.
		digits = [];
		intervals = [];
		for (var i = 0; i < options.startTime.length; i++) {
			if (parseInt(options.startTime[i]) >= 0) {
				elem = $('<div id="cnt_' + counter + '" class="cntDigit" />').css({
					height: options.digitHeight,
					float: 'left',
					background: 'url(\'' + options.image + '\')',
					width: options.digitWidth
				});
				elem.current = parseInt(options.startTime[i]);
				digits.push(elem);
				margin(counter, -elem.current * options.digitHeight * options.digitImages);
				if (options.continuous === true) {
					digits[counter]._max = function() {
						return 9;
					};
				} else {
					// Add max digits, for example, first digit of minutes (mm) has
					// a max of 5. Conditional max is used when the left digit has reach
					// the max. For example second "hours" digit has a conditional max of 4
					switch (options.format[i]) {
						case 'h':
							digits[counter]._max = function(pos, isStart) {
								if (pos % 2 == 0) return 2;
								else return (isStart) ? 3 : 9;
							};
							break;
						case 'd':
							digits[counter]._max = function() {
								return 9;
							};
							break;
						case 'm':
							digits[counter]._max = function(pos) {
								if (!mFirstPos) {
									mFirstPos = pos;
								}
								return pos == mFirstPos ? 9 : 5;
							};
							break;
						case 's':
							digits[counter]._max = function(pos) {
								if (!sFirstPos) {
									sFirstPos = pos;
								}
								return pos == sFirstPos ? 9 : 5;
							};
					}
				}
				counter += 1;
			} else {
				elem = $('<div class="cntSeparator"/>').css({
					float: 'left'
				}).text(options.startTime[i]);
			}
			where.append(elem)
		}
	};
	var makeMovement = function(elem, steps, isForward, options) {
		// Stop any other movement over the same digit.
		if (intervals[elem]) window.clearInterval(intervals[elem]);
		// Move to the initial position (We force that because in chrome
		// there are some scenarios where digits lost sync)
		var initialPos = -(options.digitHeight * options.digitImages * digits[elem].current);
		margin(elem, initialPos);
		digits[elem].current = digits[elem].current + ((isForward) ? steps : -steps);
		var x = 0;
		intervals[elem] = setInterval(function() {
			if (x++ === options.digitImages * steps) {
				window.clearInterval(intervals[elem]);
				delete intervals[elem];
				return;
			}
			var diff = isForward ? -options.digitHeight : options.digitHeight;
			margin(elem, initialPos + (x * diff));
		}, options.stepTime / steps);
	};
	// Set or get element margin
	var margin = function(elem, val) {
		if (val !== undefined) {
			digits[elem].margin = val;
			return digits[elem].css({
				'backgroundPosition': '0 ' + val + 'px'
			});
		}
		return digits[elem].margin || 0;
	};
	// Makes the movement. This is done by "digitImages" steps.
	var moveDigit = function(elem, options) {
		if (digits[elem].current == 0) {
			// Is there still time left?
			if (elem > 0) {
				var isStart = (digits[elem - 1].current == 0);
				makeMovement(elem, digits[elem]._max(elem, isStart), true, options);
				moveDigit(elem - 1, options);
			} else { // That condition means that we reach the end! 00:00.
				for (var i = 0; i < digits.length; i++) {
					clearInterval(intervals[i]);
					clearInterval(intervals.main);
					margin(i, 0);
				}
				options.timerEnd();
			}
			return;
		}
		makeMovement(elem, 1, false, options);
	};
	// if an endTime is provided...
	if (userOptions.endTime) {
		// calculate the difference between endTime and present time
		var diff = 0;
		if (userOptions.endTime instanceof Date) {
			diff = userOptions.endTime.getTime() - (new Date()).getTime();
		}
		if (diff > 0) {
			// and set that as the startTime
			userOptions.startTime = formatCompute(new Date(diff), options);
		} else {
			// if already expired - ignore
			userOptions.startTime = "00:00:00";
			//userOptions.timerEnd = function() {};
		}
		delete userOptions.endTime;
	}
	$.extend(options, userOptions);
	if (this.length) {
		clearInterval(intervals.main);
		createDigits(this, options);
		this.data('options', options);
		if (options.start === true) {
			start(this);
		}
	}
};