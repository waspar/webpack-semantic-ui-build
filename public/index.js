var index =
webpackJsonp_name_([0],[
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {//! moment.js
//! version : 2.18.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
     true ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

var hookCallback;

function hooks () {
    return hookCallback.apply(null, arguments);
}

// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback (callback) {
    hookCallback = callback;
}

function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

function isObject(input) {
    // IE8 will treat undefined and null as object if it wasn't for
    // input != null
    return input != null && Object.prototype.toString.call(input) === '[object Object]';
}

function isObjectEmpty(obj) {
    var k;
    for (k in obj) {
        // even if its not own property I'd still call it non-empty
        return false;
    }
    return true;
}

function isUndefined(input) {
    return input === void 0;
}

function isNumber(input) {
    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}

function map(arr, fn) {
    var res = [], i;
    for (i = 0; i < arr.length; ++i) {
        res.push(fn(arr[i], i));
    }
    return res;
}

function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}

function extend(a, b) {
    for (var i in b) {
        if (hasOwnProp(b, i)) {
            a[i] = b[i];
        }
    }

    if (hasOwnProp(b, 'toString')) {
        a.toString = b.toString;
    }

    if (hasOwnProp(b, 'valueOf')) {
        a.valueOf = b.valueOf;
    }

    return a;
}

function createUTC (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, true).utc();
}

function defaultParsingFlags() {
    // We need to deep clone this object.
    return {
        empty           : false,
        unusedTokens    : [],
        unusedInput     : [],
        overflow        : -2,
        charsLeftOver   : 0,
        nullInput       : false,
        invalidMonth    : null,
        invalidFormat   : false,
        userInvalidated : false,
        iso             : false,
        parsedDateParts : [],
        meridiem        : null,
        rfc2822         : false,
        weekdayMismatch : false
    };
}

function getParsingFlags(m) {
    if (m._pf == null) {
        m._pf = defaultParsingFlags();
    }
    return m._pf;
}

var some;
if (Array.prototype.some) {
    some = Array.prototype.some;
} else {
    some = function (fun) {
        var t = Object(this);
        var len = t.length >>> 0;

        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(this, t[i], i, t)) {
                return true;
            }
        }

        return false;
    };
}

var some$1 = some;

function isValid(m) {
    if (m._isValid == null) {
        var flags = getParsingFlags(m);
        var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
            return i != null;
        });
        var isNowValid = !isNaN(m._d.getTime()) &&
            flags.overflow < 0 &&
            !flags.empty &&
            !flags.invalidMonth &&
            !flags.invalidWeekday &&
            !flags.nullInput &&
            !flags.invalidFormat &&
            !flags.userInvalidated &&
            (!flags.meridiem || (flags.meridiem && parsedParts));

        if (m._strict) {
            isNowValid = isNowValid &&
                flags.charsLeftOver === 0 &&
                flags.unusedTokens.length === 0 &&
                flags.bigHour === undefined;
        }

        if (Object.isFrozen == null || !Object.isFrozen(m)) {
            m._isValid = isNowValid;
        }
        else {
            return isNowValid;
        }
    }
    return m._isValid;
}

function createInvalid (flags) {
    var m = createUTC(NaN);
    if (flags != null) {
        extend(getParsingFlags(m), flags);
    }
    else {
        getParsingFlags(m).userInvalidated = true;
    }

    return m;
}

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties = hooks.momentProperties = [];

function copyConfig(to, from) {
    var i, prop, val;

    if (!isUndefined(from._isAMomentObject)) {
        to._isAMomentObject = from._isAMomentObject;
    }
    if (!isUndefined(from._i)) {
        to._i = from._i;
    }
    if (!isUndefined(from._f)) {
        to._f = from._f;
    }
    if (!isUndefined(from._l)) {
        to._l = from._l;
    }
    if (!isUndefined(from._strict)) {
        to._strict = from._strict;
    }
    if (!isUndefined(from._tzm)) {
        to._tzm = from._tzm;
    }
    if (!isUndefined(from._isUTC)) {
        to._isUTC = from._isUTC;
    }
    if (!isUndefined(from._offset)) {
        to._offset = from._offset;
    }
    if (!isUndefined(from._pf)) {
        to._pf = getParsingFlags(from);
    }
    if (!isUndefined(from._locale)) {
        to._locale = from._locale;
    }

    if (momentProperties.length > 0) {
        for (i = 0; i < momentProperties.length; i++) {
            prop = momentProperties[i];
            val = from[prop];
            if (!isUndefined(val)) {
                to[prop] = val;
            }
        }
    }

    return to;
}

var updateInProgress = false;

// Moment prototype object
function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    if (!this.isValid()) {
        this._d = new Date(NaN);
    }
    // Prevent infinite loop in case updateOffset creates new moment
    // objects.
    if (updateInProgress === false) {
        updateInProgress = true;
        hooks.updateOffset(this);
        updateInProgress = false;
    }
}

function isMoment (obj) {
    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
}

function absFloor (number) {
    if (number < 0) {
        // -0 -> 0
        return Math.ceil(number) || 0;
    } else {
        return Math.floor(number);
    }
}

function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
    }

    return value;
}

// compare two arrays, return the number of differences
function compareArrays(array1, array2, dontConvert) {
    var len = Math.min(array1.length, array2.length),
        lengthDiff = Math.abs(array1.length - array2.length),
        diffs = 0,
        i;
    for (i = 0; i < len; i++) {
        if ((dontConvert && array1[i] !== array2[i]) ||
            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
            diffs++;
        }
    }
    return diffs + lengthDiff;
}

function warn(msg) {
    if (hooks.suppressDeprecationWarnings === false &&
            (typeof console !==  'undefined') && console.warn) {
        console.warn('Deprecation warning: ' + msg);
    }
}

function deprecate(msg, fn) {
    var firstTime = true;

    return extend(function () {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(null, msg);
        }
        if (firstTime) {
            var args = [];
            var arg;
            for (var i = 0; i < arguments.length; i++) {
                arg = '';
                if (typeof arguments[i] === 'object') {
                    arg += '\n[' + i + '] ';
                    for (var key in arguments[0]) {
                        arg += key + ': ' + arguments[0][key] + ', ';
                    }
                    arg = arg.slice(0, -2); // Remove trailing comma and space
                } else {
                    arg = arguments[i];
                }
                args.push(arg);
            }
            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
            firstTime = false;
        }
        return fn.apply(this, arguments);
    }, fn);
}

var deprecations = {};

function deprecateSimple(name, msg) {
    if (hooks.deprecationHandler != null) {
        hooks.deprecationHandler(name, msg);
    }
    if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
    }
}

hooks.suppressDeprecationWarnings = false;
hooks.deprecationHandler = null;

function isFunction(input) {
    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
}

function set (config) {
    var prop, i;
    for (i in config) {
        prop = config[i];
        if (isFunction(prop)) {
            this[i] = prop;
        } else {
            this['_' + i] = prop;
        }
    }
    this._config = config;
    // Lenient ordinal parsing accepts just a number in addition to
    // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
    // TODO: Remove "ordinalParse" fallback in next major release.
    this._dayOfMonthOrdinalParseLenient = new RegExp(
        (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
            '|' + (/\d{1,2}/).source);
}

function mergeConfigs(parentConfig, childConfig) {
    var res = extend({}, parentConfig), prop;
    for (prop in childConfig) {
        if (hasOwnProp(childConfig, prop)) {
            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                res[prop] = {};
                extend(res[prop], parentConfig[prop]);
                extend(res[prop], childConfig[prop]);
            } else if (childConfig[prop] != null) {
                res[prop] = childConfig[prop];
            } else {
                delete res[prop];
            }
        }
    }
    for (prop in parentConfig) {
        if (hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])) {
            // make sure changes to properties don't modify parent config
            res[prop] = extend({}, res[prop]);
        }
    }
    return res;
}

function Locale(config) {
    if (config != null) {
        this.set(config);
    }
}

var keys;

if (Object.keys) {
    keys = Object.keys;
} else {
    keys = function (obj) {
        var i, res = [];
        for (i in obj) {
            if (hasOwnProp(obj, i)) {
                res.push(i);
            }
        }
        return res;
    };
}

var keys$1 = keys;

var defaultCalendar = {
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    nextWeek : 'dddd [at] LT',
    lastDay : '[Yesterday at] LT',
    lastWeek : '[Last] dddd [at] LT',
    sameElse : 'L'
};

function calendar (key, mom, now) {
    var output = this._calendar[key] || this._calendar['sameElse'];
    return isFunction(output) ? output.call(mom, now) : output;
}

var defaultLongDateFormat = {
    LTS  : 'h:mm:ss A',
    LT   : 'h:mm A',
    L    : 'MM/DD/YYYY',
    LL   : 'MMMM D, YYYY',
    LLL  : 'MMMM D, YYYY h:mm A',
    LLLL : 'dddd, MMMM D, YYYY h:mm A'
};

function longDateFormat (key) {
    var format = this._longDateFormat[key],
        formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
        return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
        return val.slice(1);
    });

    return this._longDateFormat[key];
}

var defaultInvalidDate = 'Invalid date';

function invalidDate () {
    return this._invalidDate;
}

var defaultOrdinal = '%d';
var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

function ordinal (number) {
    return this._ordinal.replace('%d', number);
}

var defaultRelativeTime = {
    future : 'in %s',
    past   : '%s ago',
    s  : 'a few seconds',
    ss : '%d seconds',
    m  : 'a minute',
    mm : '%d minutes',
    h  : 'an hour',
    hh : '%d hours',
    d  : 'a day',
    dd : '%d days',
    M  : 'a month',
    MM : '%d months',
    y  : 'a year',
    yy : '%d years'
};

function relativeTime (number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return (isFunction(output)) ?
        output(number, withoutSuffix, string, isFuture) :
        output.replace(/%d/i, number);
}

function pastFuture (diff, output) {
    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
}

var aliases = {};

function addUnitAlias (unit, shorthand) {
    var lowerCase = unit.toLowerCase();
    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
}

function normalizeUnits(units) {
    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}

function normalizeObjectUnits(inputObject) {
    var normalizedInput = {},
        normalizedProp,
        prop;

    for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
                normalizedInput[normalizedProp] = inputObject[prop];
            }
        }
    }

    return normalizedInput;
}

var priorities = {};

function addUnitPriority(unit, priority) {
    priorities[unit] = priority;
}

function getPrioritizedUnits(unitsObj) {
    var units = [];
    for (var u in unitsObj) {
        units.push({unit: u, priority: priorities[u]});
    }
    units.sort(function (a, b) {
        return a.priority - b.priority;
    });
    return units;
}

function makeGetSet (unit, keepTime) {
    return function (value) {
        if (value != null) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
        } else {
            return get(this, unit);
        }
    };
}

function get (mom, unit) {
    return mom.isValid() ?
        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
}

function set$1 (mom, unit, value) {
    if (mom.isValid()) {
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }
}

// MOMENTS

function stringGet (units) {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
        return this[units]();
    }
    return this;
}


function stringSet (units, value) {
    if (typeof units === 'object') {
        units = normalizeObjectUnits(units);
        var prioritized = getPrioritizedUnits(units);
        for (var i = 0; i < prioritized.length; i++) {
            this[prioritized[i].unit](units[prioritized[i].unit]);
        }
    } else {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units](value);
        }
    }
    return this;
}

function zeroFill(number, targetLength, forceSign) {
    var absNumber = '' + Math.abs(number),
        zerosToFill = targetLength - absNumber.length,
        sign = number >= 0;
    return (sign ? (forceSign ? '+' : '') : '-') +
        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}

var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

var formatFunctions = {};

var formatTokenFunctions = {};

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken (token, padded, ordinal, callback) {
    var func = callback;
    if (typeof callback === 'string') {
        func = function () {
            return this[callback]();
        };
    }
    if (token) {
        formatTokenFunctions[token] = func;
    }
    if (padded) {
        formatTokenFunctions[padded[0]] = function () {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
    }
    if (ordinal) {
        formatTokenFunctions[ordinal] = function () {
            return this.localeData().ordinal(func.apply(this, arguments), token);
        };
    }
}

function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
    var array = format.match(formattingTokens), i, length;

    for (i = 0, length = array.length; i < length; i++) {
        if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
        } else {
            array[i] = removeFormattingTokens(array[i]);
        }
    }

    return function (mom) {
        var output = '', i;
        for (i = 0; i < length; i++) {
            output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
        }
        return output;
    };
}

// format date using native date object
function formatMoment(m, format) {
    if (!m.isValid()) {
        return m.localeData().invalidDate();
    }

    format = expandFormat(format, m.localeData());
    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

    return formatFunctions[format](m);
}

function expandFormat(format, locale) {
    var i = 5;

    function replaceLongDateFormatTokens(input) {
        return locale.longDateFormat(input) || input;
    }

    localFormattingTokens.lastIndex = 0;
    while (i >= 0 && localFormattingTokens.test(format)) {
        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        localFormattingTokens.lastIndex = 0;
        i -= 1;
    }

    return format;
}

var match1         = /\d/;            //       0 - 9
var match2         = /\d\d/;          //      00 - 99
var match3         = /\d{3}/;         //     000 - 999
var match4         = /\d{4}/;         //    0000 - 9999
var match6         = /[+-]?\d{6}/;    // -999999 - 999999
var match1to2      = /\d\d?/;         //       0 - 99
var match3to4      = /\d\d\d\d?/;     //     999 - 9999
var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
var match1to3      = /\d{1,3}/;       //       0 - 999
var match1to4      = /\d{1,4}/;       //       0 - 9999
var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

var matchUnsigned  = /\d+/;           //       0 - inf
var matchSigned    = /[+-]?\d+/;      //    -inf - inf

var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


var regexes = {};

function addRegexToken (token, regex, strictRegex) {
    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
        return (isStrict && strictRegex) ? strictRegex : regex;
    };
}

function getParseRegexForToken (token, config) {
    if (!hasOwnProp(regexes, token)) {
        return new RegExp(unescapeFormat(token));
    }

    return regexes[token](config._strict, config._locale);
}

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function unescapeFormat(s) {
    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
        return p1 || p2 || p3 || p4;
    }));
}

function regexEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var tokens = {};

function addParseToken (token, callback) {
    var i, func = callback;
    if (typeof token === 'string') {
        token = [token];
    }
    if (isNumber(callback)) {
        func = function (input, array) {
            array[callback] = toInt(input);
        };
    }
    for (i = 0; i < token.length; i++) {
        tokens[token[i]] = func;
    }
}

function addWeekParseToken (token, callback) {
    addParseToken(token, function (input, array, config, token) {
        config._w = config._w || {};
        callback(input, config._w, config, token);
    });
}

function addTimeToArrayFromToken(token, input, config) {
    if (input != null && hasOwnProp(tokens, token)) {
        tokens[token](input, config._a, config, token);
    }
}

var YEAR = 0;
var MONTH = 1;
var DATE = 2;
var HOUR = 3;
var MINUTE = 4;
var SECOND = 5;
var MILLISECOND = 6;
var WEEK = 7;
var WEEKDAY = 8;

var indexOf;

if (Array.prototype.indexOf) {
    indexOf = Array.prototype.indexOf;
} else {
    indexOf = function (o) {
        // I know
        var i;
        for (i = 0; i < this.length; ++i) {
            if (this[i] === o) {
                return i;
            }
        }
        return -1;
    };
}

var indexOf$1 = indexOf;

function daysInMonth(year, month) {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

// FORMATTING

addFormatToken('M', ['MM', 2], 'Mo', function () {
    return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function (format) {
    return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function (format) {
    return this.localeData().months(this, format);
});

// ALIASES

addUnitAlias('month', 'M');

// PRIORITY

addUnitPriority('month', 8);

// PARSING

addRegexToken('M',    match1to2);
addRegexToken('MM',   match1to2, match2);
addRegexToken('MMM',  function (isStrict, locale) {
    return locale.monthsShortRegex(isStrict);
});
addRegexToken('MMMM', function (isStrict, locale) {
    return locale.monthsRegex(isStrict);
});

addParseToken(['M', 'MM'], function (input, array) {
    array[MONTH] = toInt(input) - 1;
});

addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    // if we didn't find a month name, mark the date as invalid.
    if (month != null) {
        array[MONTH] = month;
    } else {
        getParsingFlags(config).invalidMonth = input;
    }
});

// LOCALES

var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
function localeMonths (m, format) {
    if (!m) {
        return isArray(this._months) ? this._months :
            this._months['standalone'];
    }
    return isArray(this._months) ? this._months[m.month()] :
        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
}

var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
function localeMonthsShort (m, format) {
    if (!m) {
        return isArray(this._monthsShort) ? this._monthsShort :
            this._monthsShort['standalone'];
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
}

function handleStrictParse(monthName, format, strict) {
    var i, ii, mom, llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
        // this is not used
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
        for (i = 0; i < 12; ++i) {
            mom = createUTC([2000, i]);
            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeMonthsParse (monthName, format, strict) {
    var i, mom, regex;

    if (this._monthsParseExact) {
        return handleStrictParse.call(this, monthName, format, strict);
    }

    if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
    }

    // TODO: add sorting
    // Sorting makes sure if one month (or abbr) is a prefix of another
    // see sorting in computeMonthsParse
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
        }
        if (!strict && !this._monthsParse[i]) {
            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
            return i;
        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
            return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
        }
    }
}

// MOMENTS

function setMonth (mom, value) {
    var dayOfMonth;

    if (!mom.isValid()) {
        // No op
        return mom;
    }

    if (typeof value === 'string') {
        if (/^\d+$/.test(value)) {
            value = toInt(value);
        } else {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (!isNumber(value)) {
                return mom;
            }
        }
    }

    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
}

function getSetMonth (value) {
    if (value != null) {
        setMonth(this, value);
        hooks.updateOffset(this, true);
        return this;
    } else {
        return get(this, 'Month');
    }
}

function getDaysInMonth () {
    return daysInMonth(this.year(), this.month());
}

var defaultMonthsShortRegex = matchWord;
function monthsShortRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsShortStrictRegex;
        } else {
            return this._monthsShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsShortRegex')) {
            this._monthsShortRegex = defaultMonthsShortRegex;
        }
        return this._monthsShortStrictRegex && isStrict ?
            this._monthsShortStrictRegex : this._monthsShortRegex;
    }
}

var defaultMonthsRegex = matchWord;
function monthsRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsStrictRegex;
        } else {
            return this._monthsRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsRegex')) {
            this._monthsRegex = defaultMonthsRegex;
        }
        return this._monthsStrictRegex && isStrict ?
            this._monthsStrictRegex : this._monthsRegex;
    }
}

function computeMonthsParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom;
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        shortPieces.push(this.monthsShort(mom, ''));
        longPieces.push(this.months(mom, ''));
        mixedPieces.push(this.months(mom, ''));
        mixedPieces.push(this.monthsShort(mom, ''));
    }
    // Sorting makes sure if one month (or abbr) is a prefix of another it
    // will match the longer piece.
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 12; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
    }
    for (i = 0; i < 24; i++) {
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}

// FORMATTING

addFormatToken('Y', 0, 0, function () {
    var y = this.year();
    return y <= 9999 ? '' + y : '+' + y;
});

addFormatToken(0, ['YY', 2], 0, function () {
    return this.year() % 100;
});

addFormatToken(0, ['YYYY',   4],       0, 'year');
addFormatToken(0, ['YYYYY',  5],       0, 'year');
addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// ALIASES

addUnitAlias('year', 'y');

// PRIORITIES

addUnitPriority('year', 1);

// PARSING

addRegexToken('Y',      matchSigned);
addRegexToken('YY',     match1to2, match2);
addRegexToken('YYYY',   match1to4, match4);
addRegexToken('YYYYY',  match1to6, match6);
addRegexToken('YYYYYY', match1to6, match6);

addParseToken(['YYYYY', 'YYYYYY'], YEAR);
addParseToken('YYYY', function (input, array) {
    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
});
addParseToken('YY', function (input, array) {
    array[YEAR] = hooks.parseTwoDigitYear(input);
});
addParseToken('Y', function (input, array) {
    array[YEAR] = parseInt(input, 10);
});

// HELPERS

function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// HOOKS

hooks.parseTwoDigitYear = function (input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
};

// MOMENTS

var getSetYear = makeGetSet('FullYear', true);

function getIsLeapYear () {
    return isLeapYear(this.year());
}

function createDate (y, m, d, h, M, s, ms) {
    // can't just apply() to create a date:
    // https://stackoverflow.com/q/181348
    var date = new Date(y, m, d, h, M, s, ms);

    // the date constructor remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
        date.setFullYear(y);
    }
    return date;
}

function createUTCDate (y) {
    var date = new Date(Date.UTC.apply(null, arguments));

    // the Date.UTC function remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
    }
    return date;
}

// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
        fwd = 7 + dow - doy,
        // first-week day local weekday -- which local weekday is fwd
        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

    return -fwdlw + fwd - 1;
}

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    var localWeekday = (7 + weekday - dow) % 7,
        weekOffset = firstWeekOffset(year, dow, doy),
        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
        resYear, resDayOfYear;

    if (dayOfYear <= 0) {
        resYear = year - 1;
        resDayOfYear = daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > daysInYear(year)) {
        resYear = year + 1;
        resDayOfYear = dayOfYear - daysInYear(year);
    } else {
        resYear = year;
        resDayOfYear = dayOfYear;
    }

    return {
        year: resYear,
        dayOfYear: resDayOfYear
    };
}

function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
        resWeek, resYear;

    if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
    } else {
        resYear = mom.year();
        resWeek = week;
    }

    return {
        week: resWeek,
        year: resYear
    };
}

function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy),
        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
}

// FORMATTING

addFormatToken('w', ['ww', 2], 'wo', 'week');
addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

// ALIASES

addUnitAlias('week', 'w');
addUnitAlias('isoWeek', 'W');

// PRIORITIES

addUnitPriority('week', 5);
addUnitPriority('isoWeek', 5);

// PARSING

addRegexToken('w',  match1to2);
addRegexToken('ww', match1to2, match2);
addRegexToken('W',  match1to2);
addRegexToken('WW', match1to2, match2);

addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input);
});

// HELPERS

// LOCALES

function localeWeek (mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
}

var defaultLocaleWeek = {
    dow : 0, // Sunday is the first day of the week.
    doy : 6  // The week that contains Jan 1st is the first week of the year.
};

function localeFirstDayOfWeek () {
    return this._week.dow;
}

function localeFirstDayOfYear () {
    return this._week.doy;
}

// MOMENTS

function getSetWeek (input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, 'd');
}

function getSetISOWeek (input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, 'd');
}

// FORMATTING

addFormatToken('d', 0, 'do', 'day');

addFormatToken('dd', 0, 0, function (format) {
    return this.localeData().weekdaysMin(this, format);
});

addFormatToken('ddd', 0, 0, function (format) {
    return this.localeData().weekdaysShort(this, format);
});

addFormatToken('dddd', 0, 0, function (format) {
    return this.localeData().weekdays(this, format);
});

addFormatToken('e', 0, 0, 'weekday');
addFormatToken('E', 0, 0, 'isoWeekday');

// ALIASES

addUnitAlias('day', 'd');
addUnitAlias('weekday', 'e');
addUnitAlias('isoWeekday', 'E');

// PRIORITY
addUnitPriority('day', 11);
addUnitPriority('weekday', 11);
addUnitPriority('isoWeekday', 11);

// PARSING

addRegexToken('d',    match1to2);
addRegexToken('e',    match1to2);
addRegexToken('E',    match1to2);
addRegexToken('dd',   function (isStrict, locale) {
    return locale.weekdaysMinRegex(isStrict);
});
addRegexToken('ddd',   function (isStrict, locale) {
    return locale.weekdaysShortRegex(isStrict);
});
addRegexToken('dddd',   function (isStrict, locale) {
    return locale.weekdaysRegex(isStrict);
});

addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
    var weekday = config._locale.weekdaysParse(input, token, config._strict);
    // if we didn't get a weekday name, mark the date as invalid
    if (weekday != null) {
        week.d = weekday;
    } else {
        getParsingFlags(config).invalidWeekday = input;
    }
});

addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
    week[token] = toInt(input);
});

// HELPERS

function parseWeekday(input, locale) {
    if (typeof input !== 'string') {
        return input;
    }

    if (!isNaN(input)) {
        return parseInt(input, 10);
    }

    input = locale.weekdaysParse(input);
    if (typeof input === 'number') {
        return input;
    }

    return null;
}

function parseIsoWeekday(input, locale) {
    if (typeof input === 'string') {
        return locale.weekdaysParse(input) % 7 || 7;
    }
    return isNaN(input) ? null : input;
}

// LOCALES

var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
function localeWeekdays (m, format) {
    if (!m) {
        return isArray(this._weekdays) ? this._weekdays :
            this._weekdays['standalone'];
    }
    return isArray(this._weekdays) ? this._weekdays[m.day()] :
        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
}

var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
function localeWeekdaysShort (m) {
    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
}

var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
function localeWeekdaysMin (m) {
    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
}

function handleStrictParse$1(weekdayName, format, strict) {
    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._minWeekdaysParse = [];

        for (i = 0; i < 7; ++i) {
            mom = createUTC([2000, 1]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeWeekdaysParse (weekdayName, format, strict) {
    var i, mom, regex;

    if (this._weekdaysParseExact) {
        return handleStrictParse$1.call(this, weekdayName, format, strict);
    }

    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._minWeekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._fullWeekdaysParse = [];
    }

    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already

        mom = createUTC([2000, 1]).day(i);
        if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
        }
        if (!this._weekdaysParse[i]) {
            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
            return i;
        }
    }
}

// MOMENTS

function getSetDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
        input = parseWeekday(input, this.localeData());
        return this.add(input - day, 'd');
    } else {
        return day;
    }
}

function getSetLocaleDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return input == null ? weekday : this.add(input - weekday, 'd');
}

function getSetISODayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }

    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.

    if (input != null) {
        var weekday = parseIsoWeekday(input, this.localeData());
        return this.day(this.day() % 7 ? weekday : weekday - 7);
    } else {
        return this.day() || 7;
    }
}

var defaultWeekdaysRegex = matchWord;
function weekdaysRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysStrictRegex;
        } else {
            return this._weekdaysRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            this._weekdaysRegex = defaultWeekdaysRegex;
        }
        return this._weekdaysStrictRegex && isStrict ?
            this._weekdaysStrictRegex : this._weekdaysRegex;
    }
}

var defaultWeekdaysShortRegex = matchWord;
function weekdaysShortRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysShortStrictRegex;
        } else {
            return this._weekdaysShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
        }
        return this._weekdaysShortStrictRegex && isStrict ?
            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
    }
}

var defaultWeekdaysMinRegex = matchWord;
function weekdaysMinRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysMinStrictRegex;
        } else {
            return this._weekdaysMinRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
        }
        return this._weekdaysMinStrictRegex && isStrict ?
            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
    }
}


function computeWeekdaysParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom, minp, shortp, longp;
    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, 1]).day(i);
        minp = this.weekdaysMin(mom, '');
        shortp = this.weekdaysShort(mom, '');
        longp = this.weekdays(mom, '');
        minPieces.push(minp);
        shortPieces.push(shortp);
        longPieces.push(longp);
        mixedPieces.push(minp);
        mixedPieces.push(shortp);
        mixedPieces.push(longp);
    }
    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
    // will match the longer piece.
    minPieces.sort(cmpLenRev);
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 7; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._weekdaysShortRegex = this._weekdaysRegex;
    this._weekdaysMinRegex = this._weekdaysRegex;

    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}

// FORMATTING

function hFormat() {
    return this.hours() % 12 || 12;
}

function kFormat() {
    return this.hours() || 24;
}

addFormatToken('H', ['HH', 2], 0, 'hour');
addFormatToken('h', ['hh', 2], 0, hFormat);
addFormatToken('k', ['kk', 2], 0, kFormat);

addFormatToken('hmm', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
});

addFormatToken('hmmss', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

addFormatToken('Hmm', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2);
});

addFormatToken('Hmmss', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

function meridiem (token, lowercase) {
    addFormatToken(token, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
    });
}

meridiem('a', true);
meridiem('A', false);

// ALIASES

addUnitAlias('hour', 'h');

// PRIORITY
addUnitPriority('hour', 13);

// PARSING

function matchMeridiem (isStrict, locale) {
    return locale._meridiemParse;
}

addRegexToken('a',  matchMeridiem);
addRegexToken('A',  matchMeridiem);
addRegexToken('H',  match1to2);
addRegexToken('h',  match1to2);
addRegexToken('k',  match1to2);
addRegexToken('HH', match1to2, match2);
addRegexToken('hh', match1to2, match2);
addRegexToken('kk', match1to2, match2);

addRegexToken('hmm', match3to4);
addRegexToken('hmmss', match5to6);
addRegexToken('Hmm', match3to4);
addRegexToken('Hmmss', match5to6);

addParseToken(['H', 'HH'], HOUR);
addParseToken(['k', 'kk'], function (input, array, config) {
    var kInput = toInt(input);
    array[HOUR] = kInput === 24 ? 0 : kInput;
});
addParseToken(['a', 'A'], function (input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
});
addParseToken(['h', 'hh'], function (input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
    getParsingFlags(config).bigHour = true;
});
addParseToken('Hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
});
addParseToken('Hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
});

// LOCALES

function localeIsPM (input) {
    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    // Using charAt should be more compatible.
    return ((input + '').toLowerCase().charAt(0) === 'p');
}

var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
function localeMeridiem (hours, minutes, isLower) {
    if (hours > 11) {
        return isLower ? 'pm' : 'PM';
    } else {
        return isLower ? 'am' : 'AM';
    }
}


// MOMENTS

// Setting the hour should keep the time, because the user explicitly
// specified which hour he wants. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
var getSetHour = makeGetSet('Hours', true);

// months
// week
// weekdays
// meridiem
var baseConfig = {
    calendar: defaultCalendar,
    longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    ordinal: defaultOrdinal,
    dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
    relativeTime: defaultRelativeTime,

    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,

    week: defaultLocaleWeek,

    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultLocaleWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,

    meridiemParse: defaultLocaleMeridiemParse
};

// internal storage for locale config files
var locales = {};
var localeFamilies = {};
var globalLocale;

function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
    var i = 0, j, next, locale, split;

    while (i < names.length) {
        split = normalizeLocale(names[i]).split('-');
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split('-') : null;
        while (j > 0) {
            locale = loadLocale(split.slice(0, j).join('-'));
            if (locale) {
                return locale;
            }
            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                //the next array item is better than a shallower substring of this one
                break;
            }
            j--;
        }
        i++;
    }
    return null;
}

function loadLocale(name) {
    var oldLocale = null;
    // TODO: Find a better way to register and load all the locales in Node
    if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
        try {
            oldLocale = globalLocale._abbr;
            __webpack_require__(7)("./" + name);
            // because defineLocale currently also sets the global locale, we
            // want to undo that for lazy loaded locales
            getSetGlobalLocale(oldLocale);
        } catch (e) { }
    }
    return locales[name];
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale (key, values) {
    var data;
    if (key) {
        if (isUndefined(values)) {
            data = getLocale(key);
        }
        else {
            data = defineLocale(key, values);
        }

        if (data) {
            // moment.duration._locale = moment._locale = data;
            globalLocale = data;
        }
    }

    return globalLocale._abbr;
}

function defineLocale (name, config) {
    if (config !== null) {
        var parentConfig = baseConfig;
        config.abbr = name;
        if (locales[name] != null) {
            deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
            parentConfig = locales[name]._config;
        } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
                parentConfig = locales[config.parentLocale]._config;
            } else {
                if (!localeFamilies[config.parentLocale]) {
                    localeFamilies[config.parentLocale] = [];
                }
                localeFamilies[config.parentLocale].push({
                    name: name,
                    config: config
                });
                return null;
            }
        }
        locales[name] = new Locale(mergeConfigs(parentConfig, config));

        if (localeFamilies[name]) {
            localeFamilies[name].forEach(function (x) {
                defineLocale(x.name, x.config);
            });
        }

        // backwards compat for now: also set the locale
        // make sure we set the locale AFTER all child locales have been
        // created, so we won't end up with the child locale set.
        getSetGlobalLocale(name);


        return locales[name];
    } else {
        // useful for testing
        delete locales[name];
        return null;
    }
}

function updateLocale(name, config) {
    if (config != null) {
        var locale, parentConfig = baseConfig;
        // MERGE
        if (locales[name] != null) {
            parentConfig = locales[name]._config;
        }
        config = mergeConfigs(parentConfig, config);
        locale = new Locale(config);
        locale.parentLocale = locales[name];
        locales[name] = locale;

        // backwards compat for now: also set the locale
        getSetGlobalLocale(name);
    } else {
        // pass null for config to unupdate, useful for tests
        if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
                locales[name] = locales[name].parentLocale;
            } else if (locales[name] != null) {
                delete locales[name];
            }
        }
    }
    return locales[name];
}

// returns locale data
function getLocale (key) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
    }

    if (!key) {
        return globalLocale;
    }

    if (!isArray(key)) {
        //short-circuit everything else
        locale = loadLocale(key);
        if (locale) {
            return locale;
        }
        key = [key];
    }

    return chooseLocale(key);
}

function listLocales() {
    return keys$1(locales);
}

function checkOverflow (m) {
    var overflow;
    var a = m._a;

    if (a && getParsingFlags(m).overflow === -2) {
        overflow =
            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
            -1;

        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
        }
        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
            overflow = WEEK;
        }
        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
            overflow = WEEKDAY;
        }

        getParsingFlags(m).overflow = overflow;
    }

    return m;
}

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

var isoDates = [
    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
    ['YYYY-DDD', /\d{4}-\d{3}/],
    ['YYYY-MM', /\d{4}-\d\d/, false],
    ['YYYYYYMMDD', /[+-]\d{10}/],
    ['YYYYMMDD', /\d{8}/],
    // YYYYMM is NOT allowed by the standard
    ['GGGG[W]WWE', /\d{4}W\d{3}/],
    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
    ['YYYYDDD', /\d{7}/]
];

// iso time formats and regexes
var isoTimes = [
    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
    ['HH:mm', /\d\d:\d\d/],
    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
    ['HHmmss', /\d\d\d\d\d\d/],
    ['HHmm', /\d\d\d\d/],
    ['HH', /\d\d/]
];

var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

// date from iso format
function configFromISO(config) {
    var i, l,
        string = config._i,
        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
        allowTime, dateFormat, timeFormat, tzFormat;

    if (match) {
        getParsingFlags(config).iso = true;

        for (i = 0, l = isoDates.length; i < l; i++) {
            if (isoDates[i][1].exec(match[1])) {
                dateFormat = isoDates[i][0];
                allowTime = isoDates[i][2] !== false;
                break;
            }
        }
        if (dateFormat == null) {
            config._isValid = false;
            return;
        }
        if (match[3]) {
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(match[3])) {
                    // match[2] should be 'T' or space
                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (timeFormat == null) {
                config._isValid = false;
                return;
            }
        }
        if (!allowTime && timeFormat != null) {
            config._isValid = false;
            return;
        }
        if (match[4]) {
            if (tzRegex.exec(match[4])) {
                tzFormat = 'Z';
            } else {
                config._isValid = false;
                return;
            }
        }
        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
        configFromStringAndFormat(config);
    } else {
        config._isValid = false;
    }
}

// RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
var basicRfcRegex = /^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(?:\d\d)?\d\d\s)(\d\d:\d\d)(\:\d\d)?(\s(?:UT|GMT|[ECMP][SD]T|[A-IK-Za-ik-z]|[+-]\d{4}))$/;

// date and time from ref 2822 format
function configFromRFC2822(config) {
    var string, match, dayFormat,
        dateFormat, timeFormat, tzFormat;
    var timezones = {
        ' GMT': ' +0000',
        ' EDT': ' -0400',
        ' EST': ' -0500',
        ' CDT': ' -0500',
        ' CST': ' -0600',
        ' MDT': ' -0600',
        ' MST': ' -0700',
        ' PDT': ' -0700',
        ' PST': ' -0800'
    };
    var military = 'YXWVUTSRQPONZABCDEFGHIKLM';
    var timezone, timezoneIndex;

    string = config._i
        .replace(/\([^\)]*\)|[\n\t]/g, ' ') // Remove comments and folding whitespace
        .replace(/(\s\s+)/g, ' ') // Replace multiple-spaces with a single space
        .replace(/^\s|\s$/g, ''); // Remove leading and trailing spaces
    match = basicRfcRegex.exec(string);

    if (match) {
        dayFormat = match[1] ? 'ddd' + ((match[1].length === 5) ? ', ' : ' ') : '';
        dateFormat = 'D MMM ' + ((match[2].length > 10) ? 'YYYY ' : 'YY ');
        timeFormat = 'HH:mm' + (match[4] ? ':ss' : '');

        // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
        if (match[1]) { // day of week given
            var momentDate = new Date(match[2]);
            var momentDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][momentDate.getDay()];

            if (match[1].substr(0,3) !== momentDay) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return;
            }
        }

        switch (match[5].length) {
            case 2: // military
                if (timezoneIndex === 0) {
                    timezone = ' +0000';
                } else {
                    timezoneIndex = military.indexOf(match[5][1].toUpperCase()) - 12;
                    timezone = ((timezoneIndex < 0) ? ' -' : ' +') +
                        (('' + timezoneIndex).replace(/^-?/, '0')).match(/..$/)[0] + '00';
                }
                break;
            case 4: // Zone
                timezone = timezones[match[5]];
                break;
            default: // UT or +/-9999
                timezone = timezones[' GMT'];
        }
        match[5] = timezone;
        config._i = match.splice(1).join('');
        tzFormat = ' ZZ';
        config._f = dayFormat + dateFormat + timeFormat + tzFormat;
        configFromStringAndFormat(config);
        getParsingFlags(config).rfc2822 = true;
    } else {
        config._isValid = false;
    }
}

// date from iso format or fallback
function configFromString(config) {
    var matched = aspNetJsonRegex.exec(config._i);

    if (matched !== null) {
        config._d = new Date(+matched[1]);
        return;
    }

    configFromISO(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    configFromRFC2822(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    // Final attempt, use Input Fallback
    hooks.createFromInputFallback(config);
}

hooks.createFromInputFallback = deprecate(
    'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
    'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
    'discouraged and will be removed in an upcoming major release. Please refer to ' +
    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
    function (config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    }
);

// Pick the first defined of two or three arguments.
function defaults(a, b, c) {
    if (a != null) {
        return a;
    }
    if (b != null) {
        return b;
    }
    return c;
}

function currentDateArray(config) {
    // hooks is actually the exported moment object
    var nowValue = new Date(hooks.now());
    if (config._useUTC) {
        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
    }
    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
}

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function configFromArray (config) {
    var i, date, input = [], currentDate, yearToUse;

    if (config._d) {
        return;
    }

    currentDate = currentDateArray(config);

    //compute day of the year from weeks and weekdays
    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
        dayOfYearFromWeekInfo(config);
    }

    //if the day of the year is set, figure out what it is
    if (config._dayOfYear != null) {
        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

        if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
            getParsingFlags(config)._overflowDayOfYear = true;
        }

        date = createUTCDate(yearToUse, 0, config._dayOfYear);
        config._a[MONTH] = date.getUTCMonth();
        config._a[DATE] = date.getUTCDate();
    }

    // Default to current date.
    // * if no year, month, day of month are given, default to today
    // * if day of month is given, default month and year
    // * if month is given, default only year
    // * if year is given, don't default anything
    for (i = 0; i < 3 && config._a[i] == null; ++i) {
        config._a[i] = input[i] = currentDate[i];
    }

    // Zero out whatever was not defaulted, including time
    for (; i < 7; i++) {
        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
    }

    // Check for 24:00:00.000
    if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
        config._nextDay = true;
        config._a[HOUR] = 0;
    }

    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
    // Apply timezone offset from input. The actual utcOffset can be changed
    // with parseZone.
    if (config._tzm != null) {
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    }

    if (config._nextDay) {
        config._a[HOUR] = 24;
    }
}

function dayOfYearFromWeekInfo(config) {
    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

    w = config._w;
    if (w.GG != null || w.W != null || w.E != null) {
        dow = 1;
        doy = 4;

        // TODO: We need to take the current isoWeekYear, but that depends on
        // how we interpret now (local, utc, fixed offset). So create
        // a now version of current config (take local/utc/offset flags, and
        // create now).
        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
        week = defaults(w.W, 1);
        weekday = defaults(w.E, 1);
        if (weekday < 1 || weekday > 7) {
            weekdayOverflow = true;
        }
    } else {
        dow = config._locale._week.dow;
        doy = config._locale._week.doy;

        var curWeek = weekOfYear(createLocal(), dow, doy);

        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

        // Default to current week.
        week = defaults(w.w, curWeek.week);

        if (w.d != null) {
            // weekday -- low day numbers are considered next week
            weekday = w.d;
            if (weekday < 0 || weekday > 6) {
                weekdayOverflow = true;
            }
        } else if (w.e != null) {
            // local weekday -- counting starts from begining of week
            weekday = w.e + dow;
            if (w.e < 0 || w.e > 6) {
                weekdayOverflow = true;
            }
        } else {
            // default to begining of week
            weekday = dow;
        }
    }
    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
        getParsingFlags(config)._overflowWeeks = true;
    } else if (weekdayOverflow != null) {
        getParsingFlags(config)._overflowWeekday = true;
    } else {
        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }
}

// constant that refers to the ISO standard
hooks.ISO_8601 = function () {};

// constant that refers to the RFC 2822 form
hooks.RFC_2822 = function () {};

// date from string and format string
function configFromStringAndFormat(config) {
    // TODO: Move this to another part of the creation flow to prevent circular deps
    if (config._f === hooks.ISO_8601) {
        configFromISO(config);
        return;
    }
    if (config._f === hooks.RFC_2822) {
        configFromRFC2822(config);
        return;
    }
    config._a = [];
    getParsingFlags(config).empty = true;

    // This array is used to make a Date, either with `new Date` or `Date.UTC`
    var string = '' + config._i,
        i, parsedInput, tokens, token, skipped,
        stringLength = string.length,
        totalParsedInputLength = 0;

    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

    for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
        // console.log('token', token, 'parsedInput', parsedInput,
        //         'regex', getParseRegexForToken(token, config));
        if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
                getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
        }
        // don't parse if it's not a known token
        if (formatTokenFunctions[token]) {
            if (parsedInput) {
                getParsingFlags(config).empty = false;
            }
            else {
                getParsingFlags(config).unusedTokens.push(token);
            }
            addTimeToArrayFromToken(token, parsedInput, config);
        }
        else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token);
        }
    }

    // add remaining unparsed input length to the string
    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
        getParsingFlags(config).unusedInput.push(string);
    }

    // clear _12h flag if hour is <= 12
    if (config._a[HOUR] <= 12 &&
        getParsingFlags(config).bigHour === true &&
        config._a[HOUR] > 0) {
        getParsingFlags(config).bigHour = undefined;
    }

    getParsingFlags(config).parsedDateParts = config._a.slice(0);
    getParsingFlags(config).meridiem = config._meridiem;
    // handle meridiem
    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

    configFromArray(config);
    checkOverflow(config);
}


function meridiemFixWrap (locale, hour, meridiem) {
    var isPm;

    if (meridiem == null) {
        // nothing to do
        return hour;
    }
    if (locale.meridiemHour != null) {
        return locale.meridiemHour(hour, meridiem);
    } else if (locale.isPM != null) {
        // Fallback
        isPm = locale.isPM(meridiem);
        if (isPm && hour < 12) {
            hour += 12;
        }
        if (!isPm && hour === 12) {
            hour = 0;
        }
        return hour;
    } else {
        // this is not supposed to happen
        return hour;
    }
}

// date from string and array of format strings
function configFromStringAndArray(config) {
    var tempConfig,
        bestMoment,

        scoreToBeat,
        i,
        currentScore;

    if (config._f.length === 0) {
        getParsingFlags(config).invalidFormat = true;
        config._d = new Date(NaN);
        return;
    }

    for (i = 0; i < config._f.length; i++) {
        currentScore = 0;
        tempConfig = copyConfig({}, config);
        if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
        }
        tempConfig._f = config._f[i];
        configFromStringAndFormat(tempConfig);

        if (!isValid(tempConfig)) {
            continue;
        }

        // if there is any input that was not parsed add a penalty for that format
        currentScore += getParsingFlags(tempConfig).charsLeftOver;

        //or tokens
        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

        getParsingFlags(tempConfig).score = currentScore;

        if (scoreToBeat == null || currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
        }
    }

    extend(config, bestMoment || tempConfig);
}

function configFromObject(config) {
    if (config._d) {
        return;
    }

    var i = normalizeObjectUnits(config._i);
    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
        return obj && parseInt(obj, 10);
    });

    configFromArray(config);
}

function createFromConfig (config) {
    var res = new Moment(checkOverflow(prepareConfig(config)));
    if (res._nextDay) {
        // Adding is smart enough around DST
        res.add(1, 'd');
        res._nextDay = undefined;
    }

    return res;
}

function prepareConfig (config) {
    var input = config._i,
        format = config._f;

    config._locale = config._locale || getLocale(config._l);

    if (input === null || (format === undefined && input === '')) {
        return createInvalid({nullInput: true});
    }

    if (typeof input === 'string') {
        config._i = input = config._locale.preparse(input);
    }

    if (isMoment(input)) {
        return new Moment(checkOverflow(input));
    } else if (isDate(input)) {
        config._d = input;
    } else if (isArray(format)) {
        configFromStringAndArray(config);
    } else if (format) {
        configFromStringAndFormat(config);
    }  else {
        configFromInput(config);
    }

    if (!isValid(config)) {
        config._d = null;
    }

    return config;
}

function configFromInput(config) {
    var input = config._i;
    if (isUndefined(input)) {
        config._d = new Date(hooks.now());
    } else if (isDate(input)) {
        config._d = new Date(input.valueOf());
    } else if (typeof input === 'string') {
        configFromString(config);
    } else if (isArray(input)) {
        config._a = map(input.slice(0), function (obj) {
            return parseInt(obj, 10);
        });
        configFromArray(config);
    } else if (isObject(input)) {
        configFromObject(config);
    } else if (isNumber(input)) {
        // from milliseconds
        config._d = new Date(input);
    } else {
        hooks.createFromInputFallback(config);
    }
}

function createLocalOrUTC (input, format, locale, strict, isUTC) {
    var c = {};

    if (locale === true || locale === false) {
        strict = locale;
        locale = undefined;
    }

    if ((isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)) {
        input = undefined;
    }
    // object construction must be done this way.
    // https://github.com/moment/moment/issues/1423
    c._isAMomentObject = true;
    c._useUTC = c._isUTC = isUTC;
    c._l = locale;
    c._i = input;
    c._f = format;
    c._strict = strict;

    return createFromConfig(c);
}

function createLocal (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
}

var prototypeMin = deprecate(
    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

var prototypeMax = deprecate(
    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function pickBy(fn, moments) {
    var res, i;
    if (moments.length === 1 && isArray(moments[0])) {
        moments = moments[0];
    }
    if (!moments.length) {
        return createLocal();
    }
    res = moments[0];
    for (i = 1; i < moments.length; ++i) {
        if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
        }
    }
    return res;
}

// TODO: Use [].sort instead?
function min () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isBefore', args);
}

function max () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isAfter', args);
}

var now = function () {
    return Date.now ? Date.now() : +(new Date());
};

var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

function isDurationValid(m) {
    for (var key in m) {
        if (!(ordering.indexOf(key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
            return false;
        }
    }

    var unitHasDecimal = false;
    for (var i = 0; i < ordering.length; ++i) {
        if (m[ordering[i]]) {
            if (unitHasDecimal) {
                return false; // only allow non-integers for smallest unit
            }
            if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                unitHasDecimal = true;
            }
        }
    }

    return true;
}

function isValid$1() {
    return this._isValid;
}

function createInvalid$1() {
    return createDuration(NaN);
}

function Duration (duration) {
    var normalizedInput = normalizeObjectUnits(duration),
        years = normalizedInput.year || 0,
        quarters = normalizedInput.quarter || 0,
        months = normalizedInput.month || 0,
        weeks = normalizedInput.week || 0,
        days = normalizedInput.day || 0,
        hours = normalizedInput.hour || 0,
        minutes = normalizedInput.minute || 0,
        seconds = normalizedInput.second || 0,
        milliseconds = normalizedInput.millisecond || 0;

    this._isValid = isDurationValid(normalizedInput);

    // representation for dateAddRemove
    this._milliseconds = +milliseconds +
        seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
    // Because of dateAddRemove treats 24 hours as different from a
    // day when working around DST, we need to store them separately
    this._days = +days +
        weeks * 7;
    // It is impossible translate months into days without knowing
    // which months you are are talking about, so we have to store
    // it separately.
    this._months = +months +
        quarters * 3 +
        years * 12;

    this._data = {};

    this._locale = getLocale();

    this._bubble();
}

function isDuration (obj) {
    return obj instanceof Duration;
}

function absRound (number) {
    if (number < 0) {
        return Math.round(-1 * number) * -1;
    } else {
        return Math.round(number);
    }
}

// FORMATTING

function offset (token, separator) {
    addFormatToken(token, 0, 0, function () {
        var offset = this.utcOffset();
        var sign = '+';
        if (offset < 0) {
            offset = -offset;
            sign = '-';
        }
        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
    });
}

offset('Z', ':');
offset('ZZ', '');

// PARSING

addRegexToken('Z',  matchShortOffset);
addRegexToken('ZZ', matchShortOffset);
addParseToken(['Z', 'ZZ'], function (input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(matchShortOffset, input);
});

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var chunkOffset = /([\+\-]|\d\d)/gi;

function offsetFromString(matcher, string) {
    var matches = (string || '').match(matcher);

    if (matches === null) {
        return null;
    }

    var chunk   = matches[matches.length - 1] || [];
    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    var minutes = +(parts[1] * 60) + toInt(parts[2]);

    return minutes === 0 ?
      0 :
      parts[0] === '+' ? minutes : -minutes;
}

// Return a moment from input, that is local/utc/zone equivalent to model.
function cloneWithOffset(input, model) {
    var res, diff;
    if (model._isUTC) {
        res = model.clone();
        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
        // Use low-level api, because this fn is low-level api.
        res._d.setTime(res._d.valueOf() + diff);
        hooks.updateOffset(res, false);
        return res;
    } else {
        return createLocal(input).local();
    }
}

function getDateOffset (m) {
    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
    // https://github.com/moment/moment/pull/1871
    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
}

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
hooks.updateOffset = function () {};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function getSetOffset (input, keepLocalTime, keepMinutes) {
    var offset = this._offset || 0,
        localAdjust;
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    if (input != null) {
        if (typeof input === 'string') {
            input = offsetFromString(matchShortOffset, input);
            if (input === null) {
                return this;
            }
        } else if (Math.abs(input) < 16 && !keepMinutes) {
            input = input * 60;
        }
        if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
        }
        this._offset = input;
        this._isUTC = true;
        if (localAdjust != null) {
            this.add(localAdjust, 'm');
        }
        if (offset !== input) {
            if (!keepLocalTime || this._changeInProgress) {
                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
            } else if (!this._changeInProgress) {
                this._changeInProgress = true;
                hooks.updateOffset(this, true);
                this._changeInProgress = null;
            }
        }
        return this;
    } else {
        return this._isUTC ? offset : getDateOffset(this);
    }
}

function getSetZone (input, keepLocalTime) {
    if (input != null) {
        if (typeof input !== 'string') {
            input = -input;
        }

        this.utcOffset(input, keepLocalTime);

        return this;
    } else {
        return -this.utcOffset();
    }
}

function setOffsetToUTC (keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
}

function setOffsetToLocal (keepLocalTime) {
    if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;

        if (keepLocalTime) {
            this.subtract(getDateOffset(this), 'm');
        }
    }
    return this;
}

function setOffsetToParsedOffset () {
    if (this._tzm != null) {
        this.utcOffset(this._tzm, false, true);
    } else if (typeof this._i === 'string') {
        var tZone = offsetFromString(matchOffset, this._i);
        if (tZone != null) {
            this.utcOffset(tZone);
        }
        else {
            this.utcOffset(0, true);
        }
    }
    return this;
}

function hasAlignedHourOffset (input) {
    if (!this.isValid()) {
        return false;
    }
    input = input ? createLocal(input).utcOffset() : 0;

    return (this.utcOffset() - input) % 60 === 0;
}

function isDaylightSavingTime () {
    return (
        this.utcOffset() > this.clone().month(0).utcOffset() ||
        this.utcOffset() > this.clone().month(5).utcOffset()
    );
}

function isDaylightSavingTimeShifted () {
    if (!isUndefined(this._isDSTShifted)) {
        return this._isDSTShifted;
    }

    var c = {};

    copyConfig(c, this);
    c = prepareConfig(c);

    if (c._a) {
        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
        this._isDSTShifted = this.isValid() &&
            compareArrays(c._a, other.toArray()) > 0;
    } else {
        this._isDSTShifted = false;
    }

    return this._isDSTShifted;
}

function isLocal () {
    return this.isValid() ? !this._isUTC : false;
}

function isUtcOffset () {
    return this.isValid() ? this._isUTC : false;
}

function isUtc () {
    return this.isValid() ? this._isUTC && this._offset === 0 : false;
}

// ASP.NET json date format regex
var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

function createDuration (input, key) {
    var duration = input,
        // matching against regexp is expensive, do it on demand
        match = null,
        sign,
        ret,
        diffRes;

    if (isDuration(input)) {
        duration = {
            ms : input._milliseconds,
            d  : input._days,
            M  : input._months
        };
    } else if (isNumber(input)) {
        duration = {};
        if (key) {
            duration[key] = input;
        } else {
            duration.milliseconds = input;
        }
    } else if (!!(match = aspNetRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y  : 0,
            d  : toInt(match[DATE])                         * sign,
            h  : toInt(match[HOUR])                         * sign,
            m  : toInt(match[MINUTE])                       * sign,
            s  : toInt(match[SECOND])                       * sign,
            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
        };
    } else if (!!(match = isoRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y : parseIso(match[2], sign),
            M : parseIso(match[3], sign),
            w : parseIso(match[4], sign),
            d : parseIso(match[5], sign),
            h : parseIso(match[6], sign),
            m : parseIso(match[7], sign),
            s : parseIso(match[8], sign)
        };
    } else if (duration == null) {// checks for null or undefined
        duration = {};
    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

        duration = {};
        duration.ms = diffRes.milliseconds;
        duration.M = diffRes.months;
    }

    ret = new Duration(duration);

    if (isDuration(input) && hasOwnProp(input, '_locale')) {
        ret._locale = input._locale;
    }

    return ret;
}

createDuration.fn = Duration.prototype;
createDuration.invalid = createInvalid$1;

function parseIso (inp, sign) {
    // We'd normally use ~~inp for this, but unfortunately it also
    // converts floats to ints.
    // inp may be undefined, so careful calling replace on it.
    var res = inp && parseFloat(inp.replace(',', '.'));
    // apply sign while we're at it
    return (isNaN(res) ? 0 : res) * sign;
}

function positiveMomentsDifference(base, other) {
    var res = {milliseconds: 0, months: 0};

    res.months = other.month() - base.month() +
        (other.year() - base.year()) * 12;
    if (base.clone().add(res.months, 'M').isAfter(other)) {
        --res.months;
    }

    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

    return res;
}

function momentsDifference(base, other) {
    var res;
    if (!(base.isValid() && other.isValid())) {
        return {milliseconds: 0, months: 0};
    }

    other = cloneWithOffset(other, base);
    if (base.isBefore(other)) {
        res = positiveMomentsDifference(base, other);
    } else {
        res = positiveMomentsDifference(other, base);
        res.milliseconds = -res.milliseconds;
        res.months = -res.months;
    }

    return res;
}

// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
    return function (val, period) {
        var dur, tmp;
        //invert the arguments, but complain about it
        if (period !== null && !isNaN(+period)) {
            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
            tmp = val; val = period; period = tmp;
        }

        val = typeof val === 'string' ? +val : val;
        dur = createDuration(val, period);
        addSubtract(this, dur, direction);
        return this;
    };
}

function addSubtract (mom, duration, isAdding, updateOffset) {
    var milliseconds = duration._milliseconds,
        days = absRound(duration._days),
        months = absRound(duration._months);

    if (!mom.isValid()) {
        // No op
        return;
    }

    updateOffset = updateOffset == null ? true : updateOffset;

    if (milliseconds) {
        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
    }
    if (days) {
        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
    }
    if (months) {
        setMonth(mom, get(mom, 'Month') + months * isAdding);
    }
    if (updateOffset) {
        hooks.updateOffset(mom, days || months);
    }
}

var add      = createAdder(1, 'add');
var subtract = createAdder(-1, 'subtract');

function getCalendarFormat(myMoment, now) {
    var diff = myMoment.diff(now, 'days', true);
    return diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
            diff < 0 ? 'lastDay' :
            diff < 1 ? 'sameDay' :
            diff < 2 ? 'nextDay' :
            diff < 7 ? 'nextWeek' : 'sameElse';
}

function calendar$1 (time, formats) {
    // We want to compare the start of today, vs this.
    // Getting start-of-today depends on whether we're local/utc/offset or not.
    var now = time || createLocal(),
        sod = cloneWithOffset(now, this).startOf('day'),
        format = hooks.calendarFormat(this, sod) || 'sameElse';

    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
}

function clone () {
    return new Moment(this);
}

function isAfter (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() > localInput.valueOf();
    } else {
        return localInput.valueOf() < this.clone().startOf(units).valueOf();
    }
}

function isBefore (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() < localInput.valueOf();
    } else {
        return this.clone().endOf(units).valueOf() < localInput.valueOf();
    }
}

function isBetween (from, to, units, inclusivity) {
    inclusivity = inclusivity || '()';
    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
}

function isSame (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input),
        inputMs;
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(units || 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() === localInput.valueOf();
    } else {
        inputMs = localInput.valueOf();
        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
    }
}

function isSameOrAfter (input, units) {
    return this.isSame(input, units) || this.isAfter(input,units);
}

function isSameOrBefore (input, units) {
    return this.isSame(input, units) || this.isBefore(input,units);
}

function diff (input, units, asFloat) {
    var that,
        zoneDelta,
        delta, output;

    if (!this.isValid()) {
        return NaN;
    }

    that = cloneWithOffset(input, this);

    if (!that.isValid()) {
        return NaN;
    }

    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

    units = normalizeUnits(units);

    if (units === 'year' || units === 'month' || units === 'quarter') {
        output = monthDiff(this, that);
        if (units === 'quarter') {
            output = output / 3;
        } else if (units === 'year') {
            output = output / 12;
        }
    } else {
        delta = this - that;
        output = units === 'second' ? delta / 1e3 : // 1000
            units === 'minute' ? delta / 6e4 : // 1000 * 60
            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
            delta;
    }
    return asFloat ? output : absFloor(output);
}

function monthDiff (a, b) {
    // difference in months
    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
        // b is in (anchor - 1 month, anchor + 1 month)
        anchor = a.clone().add(wholeMonthDiff, 'months'),
        anchor2, adjust;

    if (b - anchor < 0) {
        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor - anchor2);
    } else {
        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor2 - anchor);
    }

    //check for negative zero, return zero if negative zero
    return -(wholeMonthDiff + adjust) || 0;
}

hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

function toString () {
    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}

function toISOString() {
    if (!this.isValid()) {
        return null;
    }
    var m = this.clone().utc();
    if (m.year() < 0 || m.year() > 9999) {
        return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
    if (isFunction(Date.prototype.toISOString)) {
        // native implementation is ~50x faster, use it when we can
        return this.toDate().toISOString();
    }
    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
}

/**
 * Return a human readable representation of a moment that can
 * also be evaluated to get a new moment which is the same
 *
 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
 */
function inspect () {
    if (!this.isValid()) {
        return 'moment.invalid(/* ' + this._i + ' */)';
    }
    var func = 'moment';
    var zone = '';
    if (!this.isLocal()) {
        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
        zone = 'Z';
    }
    var prefix = '[' + func + '("]';
    var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
    var suffix = zone + '[")]';

    return this.format(prefix + year + datetime + suffix);
}

function format (inputString) {
    if (!inputString) {
        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
    }
    var output = formatMoment(this, inputString);
    return this.localeData().postformat(output);
}

function from (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function fromNow (withoutSuffix) {
    return this.from(createLocal(), withoutSuffix);
}

function to (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function toNow (withoutSuffix) {
    return this.to(createLocal(), withoutSuffix);
}

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale (key) {
    var newLocaleData;

    if (key === undefined) {
        return this._locale._abbr;
    } else {
        newLocaleData = getLocale(key);
        if (newLocaleData != null) {
            this._locale = newLocaleData;
        }
        return this;
    }
}

var lang = deprecate(
    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
    function (key) {
        if (key === undefined) {
            return this.localeData();
        } else {
            return this.locale(key);
        }
    }
);

function localeData () {
    return this._locale;
}

function startOf (units) {
    units = normalizeUnits(units);
    // the following switch intentionally omits break keywords
    // to utilize falling through the cases.
    switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
        case 'date':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
    }

    // weeks are a special case
    if (units === 'week') {
        this.weekday(0);
    }
    if (units === 'isoWeek') {
        this.isoWeekday(1);
    }

    // quarters are also special
    if (units === 'quarter') {
        this.month(Math.floor(this.month() / 3) * 3);
    }

    return this;
}

function endOf (units) {
    units = normalizeUnits(units);
    if (units === undefined || units === 'millisecond') {
        return this;
    }

    // 'date' is an alias for 'day', so it should be considered as such.
    if (units === 'date') {
        units = 'day';
    }

    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
}

function valueOf () {
    return this._d.valueOf() - ((this._offset || 0) * 60000);
}

function unix () {
    return Math.floor(this.valueOf() / 1000);
}

function toDate () {
    return new Date(this.valueOf());
}

function toArray () {
    var m = this;
    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}

function toObject () {
    var m = this;
    return {
        years: m.year(),
        months: m.month(),
        date: m.date(),
        hours: m.hours(),
        minutes: m.minutes(),
        seconds: m.seconds(),
        milliseconds: m.milliseconds()
    };
}

function toJSON () {
    // new Date(NaN).toJSON() === null
    return this.isValid() ? this.toISOString() : null;
}

function isValid$2 () {
    return isValid(this);
}

function parsingFlags () {
    return extend({}, getParsingFlags(this));
}

function invalidAt () {
    return getParsingFlags(this).overflow;
}

function creationData() {
    return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
    };
}

// FORMATTING

addFormatToken(0, ['gg', 2], 0, function () {
    return this.weekYear() % 100;
});

addFormatToken(0, ['GG', 2], 0, function () {
    return this.isoWeekYear() % 100;
});

function addWeekYearFormatToken (token, getter) {
    addFormatToken(0, [token, token.length], 0, getter);
}

addWeekYearFormatToken('gggg',     'weekYear');
addWeekYearFormatToken('ggggg',    'weekYear');
addWeekYearFormatToken('GGGG',  'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

addUnitAlias('weekYear', 'gg');
addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

addUnitPriority('weekYear', 1);
addUnitPriority('isoWeekYear', 1);


// PARSING

addRegexToken('G',      matchSigned);
addRegexToken('g',      matchSigned);
addRegexToken('GG',     match1to2, match2);
addRegexToken('gg',     match1to2, match2);
addRegexToken('GGGG',   match1to4, match4);
addRegexToken('gggg',   match1to4, match4);
addRegexToken('GGGGG',  match1to6, match6);
addRegexToken('ggggg',  match1to6, match6);

addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
    week[token.substr(0, 2)] = toInt(input);
});

addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
    week[token] = hooks.parseTwoDigitYear(input);
});

// MOMENTS

function getSetWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy);
}

function getSetISOWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input, this.isoWeek(), this.isoWeekday(), 1, 4);
}

function getISOWeeksInYear () {
    return weeksInYear(this.year(), 1, 4);
}

function getWeeksInYear () {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
}

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
    var weeksTarget;
    if (input == null) {
        return weekOfYear(this, dow, doy).year;
    } else {
        weeksTarget = weeksInYear(input, dow, doy);
        if (week > weeksTarget) {
            week = weeksTarget;
        }
        return setWeekAll.call(this, input, week, weekday, dow, doy);
    }
}

function setWeekAll(weekYear, week, weekday, dow, doy) {
    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

    this.year(date.getUTCFullYear());
    this.month(date.getUTCMonth());
    this.date(date.getUTCDate());
    return this;
}

// FORMATTING

addFormatToken('Q', 0, 'Qo', 'quarter');

// ALIASES

addUnitAlias('quarter', 'Q');

// PRIORITY

addUnitPriority('quarter', 7);

// PARSING

addRegexToken('Q', match1);
addParseToken('Q', function (input, array) {
    array[MONTH] = (toInt(input) - 1) * 3;
});

// MOMENTS

function getSetQuarter (input) {
    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
}

// FORMATTING

addFormatToken('D', ['DD', 2], 'Do', 'date');

// ALIASES

addUnitAlias('date', 'D');

// PRIOROITY
addUnitPriority('date', 9);

// PARSING

addRegexToken('D',  match1to2);
addRegexToken('DD', match1to2, match2);
addRegexToken('Do', function (isStrict, locale) {
    // TODO: Remove "ordinalParse" fallback in next major release.
    return isStrict ?
      (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
      locale._dayOfMonthOrdinalParseLenient;
});

addParseToken(['D', 'DD'], DATE);
addParseToken('Do', function (input, array) {
    array[DATE] = toInt(input.match(match1to2)[0], 10);
});

// MOMENTS

var getSetDayOfMonth = makeGetSet('Date', true);

// FORMATTING

addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// ALIASES

addUnitAlias('dayOfYear', 'DDD');

// PRIORITY
addUnitPriority('dayOfYear', 4);

// PARSING

addRegexToken('DDD',  match1to3);
addRegexToken('DDDD', match3);
addParseToken(['DDD', 'DDDD'], function (input, array, config) {
    config._dayOfYear = toInt(input);
});

// HELPERS

// MOMENTS

function getSetDayOfYear (input) {
    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
}

// FORMATTING

addFormatToken('m', ['mm', 2], 0, 'minute');

// ALIASES

addUnitAlias('minute', 'm');

// PRIORITY

addUnitPriority('minute', 14);

// PARSING

addRegexToken('m',  match1to2);
addRegexToken('mm', match1to2, match2);
addParseToken(['m', 'mm'], MINUTE);

// MOMENTS

var getSetMinute = makeGetSet('Minutes', false);

// FORMATTING

addFormatToken('s', ['ss', 2], 0, 'second');

// ALIASES

addUnitAlias('second', 's');

// PRIORITY

addUnitPriority('second', 15);

// PARSING

addRegexToken('s',  match1to2);
addRegexToken('ss', match1to2, match2);
addParseToken(['s', 'ss'], SECOND);

// MOMENTS

var getSetSecond = makeGetSet('Seconds', false);

// FORMATTING

addFormatToken('S', 0, 0, function () {
    return ~~(this.millisecond() / 100);
});

addFormatToken(0, ['SS', 2], 0, function () {
    return ~~(this.millisecond() / 10);
});

addFormatToken(0, ['SSS', 3], 0, 'millisecond');
addFormatToken(0, ['SSSS', 4], 0, function () {
    return this.millisecond() * 10;
});
addFormatToken(0, ['SSSSS', 5], 0, function () {
    return this.millisecond() * 100;
});
addFormatToken(0, ['SSSSSS', 6], 0, function () {
    return this.millisecond() * 1000;
});
addFormatToken(0, ['SSSSSSS', 7], 0, function () {
    return this.millisecond() * 10000;
});
addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
    return this.millisecond() * 100000;
});
addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
    return this.millisecond() * 1000000;
});


// ALIASES

addUnitAlias('millisecond', 'ms');

// PRIORITY

addUnitPriority('millisecond', 16);

// PARSING

addRegexToken('S',    match1to3, match1);
addRegexToken('SS',   match1to3, match2);
addRegexToken('SSS',  match1to3, match3);

var token;
for (token = 'SSSS'; token.length <= 9; token += 'S') {
    addRegexToken(token, matchUnsigned);
}

function parseMs(input, array) {
    array[MILLISECOND] = toInt(('0.' + input) * 1000);
}

for (token = 'S'; token.length <= 9; token += 'S') {
    addParseToken(token, parseMs);
}
// MOMENTS

var getSetMillisecond = makeGetSet('Milliseconds', false);

// FORMATTING

addFormatToken('z',  0, 0, 'zoneAbbr');
addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

function getZoneAbbr () {
    return this._isUTC ? 'UTC' : '';
}

function getZoneName () {
    return this._isUTC ? 'Coordinated Universal Time' : '';
}

var proto = Moment.prototype;

proto.add               = add;
proto.calendar          = calendar$1;
proto.clone             = clone;
proto.diff              = diff;
proto.endOf             = endOf;
proto.format            = format;
proto.from              = from;
proto.fromNow           = fromNow;
proto.to                = to;
proto.toNow             = toNow;
proto.get               = stringGet;
proto.invalidAt         = invalidAt;
proto.isAfter           = isAfter;
proto.isBefore          = isBefore;
proto.isBetween         = isBetween;
proto.isSame            = isSame;
proto.isSameOrAfter     = isSameOrAfter;
proto.isSameOrBefore    = isSameOrBefore;
proto.isValid           = isValid$2;
proto.lang              = lang;
proto.locale            = locale;
proto.localeData        = localeData;
proto.max               = prototypeMax;
proto.min               = prototypeMin;
proto.parsingFlags      = parsingFlags;
proto.set               = stringSet;
proto.startOf           = startOf;
proto.subtract          = subtract;
proto.toArray           = toArray;
proto.toObject          = toObject;
proto.toDate            = toDate;
proto.toISOString       = toISOString;
proto.inspect           = inspect;
proto.toJSON            = toJSON;
proto.toString          = toString;
proto.unix              = unix;
proto.valueOf           = valueOf;
proto.creationData      = creationData;

// Year
proto.year       = getSetYear;
proto.isLeapYear = getIsLeapYear;

// Week Year
proto.weekYear    = getSetWeekYear;
proto.isoWeekYear = getSetISOWeekYear;

// Quarter
proto.quarter = proto.quarters = getSetQuarter;

// Month
proto.month       = getSetMonth;
proto.daysInMonth = getDaysInMonth;

// Week
proto.week           = proto.weeks        = getSetWeek;
proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
proto.weeksInYear    = getWeeksInYear;
proto.isoWeeksInYear = getISOWeeksInYear;

// Day
proto.date       = getSetDayOfMonth;
proto.day        = proto.days             = getSetDayOfWeek;
proto.weekday    = getSetLocaleDayOfWeek;
proto.isoWeekday = getSetISODayOfWeek;
proto.dayOfYear  = getSetDayOfYear;

// Hour
proto.hour = proto.hours = getSetHour;

// Minute
proto.minute = proto.minutes = getSetMinute;

// Second
proto.second = proto.seconds = getSetSecond;

// Millisecond
proto.millisecond = proto.milliseconds = getSetMillisecond;

// Offset
proto.utcOffset            = getSetOffset;
proto.utc                  = setOffsetToUTC;
proto.local                = setOffsetToLocal;
proto.parseZone            = setOffsetToParsedOffset;
proto.hasAlignedHourOffset = hasAlignedHourOffset;
proto.isDST                = isDaylightSavingTime;
proto.isLocal              = isLocal;
proto.isUtcOffset          = isUtcOffset;
proto.isUtc                = isUtc;
proto.isUTC                = isUtc;

// Timezone
proto.zoneAbbr = getZoneAbbr;
proto.zoneName = getZoneName;

// Deprecations
proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

function createUnix (input) {
    return createLocal(input * 1000);
}

function createInZone () {
    return createLocal.apply(null, arguments).parseZone();
}

function preParsePostFormat (string) {
    return string;
}

var proto$1 = Locale.prototype;

proto$1.calendar        = calendar;
proto$1.longDateFormat  = longDateFormat;
proto$1.invalidDate     = invalidDate;
proto$1.ordinal         = ordinal;
proto$1.preparse        = preParsePostFormat;
proto$1.postformat      = preParsePostFormat;
proto$1.relativeTime    = relativeTime;
proto$1.pastFuture      = pastFuture;
proto$1.set             = set;

// Month
proto$1.months            =        localeMonths;
proto$1.monthsShort       =        localeMonthsShort;
proto$1.monthsParse       =        localeMonthsParse;
proto$1.monthsRegex       = monthsRegex;
proto$1.monthsShortRegex  = monthsShortRegex;

// Week
proto$1.week = localeWeek;
proto$1.firstDayOfYear = localeFirstDayOfYear;
proto$1.firstDayOfWeek = localeFirstDayOfWeek;

// Day of Week
proto$1.weekdays       =        localeWeekdays;
proto$1.weekdaysMin    =        localeWeekdaysMin;
proto$1.weekdaysShort  =        localeWeekdaysShort;
proto$1.weekdaysParse  =        localeWeekdaysParse;

proto$1.weekdaysRegex       =        weekdaysRegex;
proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

// Hours
proto$1.isPM = localeIsPM;
proto$1.meridiem = localeMeridiem;

function get$1 (format, index, field, setter) {
    var locale = getLocale();
    var utc = createUTC().set(setter, index);
    return locale[field](utc, format);
}

function listMonthsImpl (format, index, field) {
    if (isNumber(format)) {
        index = format;
        format = undefined;
    }

    format = format || '';

    if (index != null) {
        return get$1(format, index, field, 'month');
    }

    var i;
    var out = [];
    for (i = 0; i < 12; i++) {
        out[i] = get$1(format, i, field, 'month');
    }
    return out;
}

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function listWeekdaysImpl (localeSorted, format, index, field) {
    if (typeof localeSorted === 'boolean') {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    } else {
        format = localeSorted;
        index = format;
        localeSorted = false;

        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    }

    var locale = getLocale(),
        shift = localeSorted ? locale._week.dow : 0;

    if (index != null) {
        return get$1(format, (index + shift) % 7, field, 'day');
    }

    var i;
    var out = [];
    for (i = 0; i < 7; i++) {
        out[i] = get$1(format, (i + shift) % 7, field, 'day');
    }
    return out;
}

function listMonths (format, index) {
    return listMonthsImpl(format, index, 'months');
}

function listMonthsShort (format, index) {
    return listMonthsImpl(format, index, 'monthsShort');
}

function listWeekdays (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
}

function listWeekdaysShort (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
}

function listWeekdaysMin (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
}

getSetGlobalLocale('en', {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (toInt(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});

// Side effect imports
hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

var mathAbs = Math.abs;

function abs () {
    var data           = this._data;

    this._milliseconds = mathAbs(this._milliseconds);
    this._days         = mathAbs(this._days);
    this._months       = mathAbs(this._months);

    data.milliseconds  = mathAbs(data.milliseconds);
    data.seconds       = mathAbs(data.seconds);
    data.minutes       = mathAbs(data.minutes);
    data.hours         = mathAbs(data.hours);
    data.months        = mathAbs(data.months);
    data.years         = mathAbs(data.years);

    return this;
}

function addSubtract$1 (duration, input, value, direction) {
    var other = createDuration(input, value);

    duration._milliseconds += direction * other._milliseconds;
    duration._days         += direction * other._days;
    duration._months       += direction * other._months;

    return duration._bubble();
}

// supports only 2.0-style add(1, 's') or add(duration)
function add$1 (input, value) {
    return addSubtract$1(this, input, value, 1);
}

// supports only 2.0-style subtract(1, 's') or subtract(duration)
function subtract$1 (input, value) {
    return addSubtract$1(this, input, value, -1);
}

function absCeil (number) {
    if (number < 0) {
        return Math.floor(number);
    } else {
        return Math.ceil(number);
    }
}

function bubble () {
    var milliseconds = this._milliseconds;
    var days         = this._days;
    var months       = this._months;
    var data         = this._data;
    var seconds, minutes, hours, years, monthsFromDays;

    // if we have a mix of positive and negative values, bubble down first
    // check: https://github.com/moment/moment/issues/2166
    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
            (milliseconds <= 0 && days <= 0 && months <= 0))) {
        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
        days = 0;
        months = 0;
    }

    // The following code bubbles up values, see the tests for
    // examples of what that means.
    data.milliseconds = milliseconds % 1000;

    seconds           = absFloor(milliseconds / 1000);
    data.seconds      = seconds % 60;

    minutes           = absFloor(seconds / 60);
    data.minutes      = minutes % 60;

    hours             = absFloor(minutes / 60);
    data.hours        = hours % 24;

    days += absFloor(hours / 24);

    // convert days to months
    monthsFromDays = absFloor(daysToMonths(days));
    months += monthsFromDays;
    days -= absCeil(monthsToDays(monthsFromDays));

    // 12 months -> 1 year
    years = absFloor(months / 12);
    months %= 12;

    data.days   = days;
    data.months = months;
    data.years  = years;

    return this;
}

function daysToMonths (days) {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    return days * 4800 / 146097;
}

function monthsToDays (months) {
    // the reverse of daysToMonths
    return months * 146097 / 4800;
}

function as (units) {
    if (!this.isValid()) {
        return NaN;
    }
    var days;
    var months;
    var milliseconds = this._milliseconds;

    units = normalizeUnits(units);

    if (units === 'month' || units === 'year') {
        days   = this._days   + milliseconds / 864e5;
        months = this._months + daysToMonths(days);
        return units === 'month' ? months : months / 12;
    } else {
        // handle milliseconds separately because of floating point math errors (issue #1867)
        days = this._days + Math.round(monthsToDays(this._months));
        switch (units) {
            case 'week'   : return days / 7     + milliseconds / 6048e5;
            case 'day'    : return days         + milliseconds / 864e5;
            case 'hour'   : return days * 24    + milliseconds / 36e5;
            case 'minute' : return days * 1440  + milliseconds / 6e4;
            case 'second' : return days * 86400 + milliseconds / 1000;
            // Math.floor prevents floating point math errors here
            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
            default: throw new Error('Unknown unit ' + units);
        }
    }
}

// TODO: Use this.as('ms')?
function valueOf$1 () {
    if (!this.isValid()) {
        return NaN;
    }
    return (
        this._milliseconds +
        this._days * 864e5 +
        (this._months % 12) * 2592e6 +
        toInt(this._months / 12) * 31536e6
    );
}

function makeAs (alias) {
    return function () {
        return this.as(alias);
    };
}

var asMilliseconds = makeAs('ms');
var asSeconds      = makeAs('s');
var asMinutes      = makeAs('m');
var asHours        = makeAs('h');
var asDays         = makeAs('d');
var asWeeks        = makeAs('w');
var asMonths       = makeAs('M');
var asYears        = makeAs('y');

function get$2 (units) {
    units = normalizeUnits(units);
    return this.isValid() ? this[units + 's']() : NaN;
}

function makeGetter(name) {
    return function () {
        return this.isValid() ? this._data[name] : NaN;
    };
}

var milliseconds = makeGetter('milliseconds');
var seconds      = makeGetter('seconds');
var minutes      = makeGetter('minutes');
var hours        = makeGetter('hours');
var days         = makeGetter('days');
var months       = makeGetter('months');
var years        = makeGetter('years');

function weeks () {
    return absFloor(this.days() / 7);
}

var round = Math.round;
var thresholds = {
    ss: 44,         // a few seconds to seconds
    s : 45,         // seconds to minute
    m : 45,         // minutes to hour
    h : 22,         // hours to day
    d : 26,         // days to month
    M : 11          // months to year
};

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
    var duration = createDuration(posNegDuration).abs();
    var seconds  = round(duration.as('s'));
    var minutes  = round(duration.as('m'));
    var hours    = round(duration.as('h'));
    var days     = round(duration.as('d'));
    var months   = round(duration.as('M'));
    var years    = round(duration.as('y'));

    var a = seconds <= thresholds.ss && ['s', seconds]  ||
            seconds < thresholds.s   && ['ss', seconds] ||
            minutes <= 1             && ['m']           ||
            minutes < thresholds.m   && ['mm', minutes] ||
            hours   <= 1             && ['h']           ||
            hours   < thresholds.h   && ['hh', hours]   ||
            days    <= 1             && ['d']           ||
            days    < thresholds.d   && ['dd', days]    ||
            months  <= 1             && ['M']           ||
            months  < thresholds.M   && ['MM', months]  ||
            years   <= 1             && ['y']           || ['yy', years];

    a[2] = withoutSuffix;
    a[3] = +posNegDuration > 0;
    a[4] = locale;
    return substituteTimeAgo.apply(null, a);
}

// This function allows you to set the rounding function for relative time strings
function getSetRelativeTimeRounding (roundingFunction) {
    if (roundingFunction === undefined) {
        return round;
    }
    if (typeof(roundingFunction) === 'function') {
        round = roundingFunction;
        return true;
    }
    return false;
}

// This function allows you to set a threshold for relative time strings
function getSetRelativeTimeThreshold (threshold, limit) {
    if (thresholds[threshold] === undefined) {
        return false;
    }
    if (limit === undefined) {
        return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    if (threshold === 's') {
        thresholds.ss = limit - 1;
    }
    return true;
}

function humanize (withSuffix) {
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var locale = this.localeData();
    var output = relativeTime$1(this, !withSuffix, locale);

    if (withSuffix) {
        output = locale.pastFuture(+this, output);
    }

    return locale.postformat(output);
}

var abs$1 = Math.abs;

function toISOString$1() {
    // for ISO strings we do not use the normal bubbling rules:
    //  * milliseconds bubble up until they become hours
    //  * days do not bubble at all
    //  * months bubble up until they become years
    // This is because there is no context-free conversion between hours and days
    // (think of clock changes)
    // and also not between days and months (28-31 days per month)
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var seconds = abs$1(this._milliseconds) / 1000;
    var days         = abs$1(this._days);
    var months       = abs$1(this._months);
    var minutes, hours, years;

    // 3600 seconds -> 60 minutes -> 1 hour
    minutes           = absFloor(seconds / 60);
    hours             = absFloor(minutes / 60);
    seconds %= 60;
    minutes %= 60;

    // 12 months -> 1 year
    years  = absFloor(months / 12);
    months %= 12;


    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
    var Y = years;
    var M = months;
    var D = days;
    var h = hours;
    var m = minutes;
    var s = seconds;
    var total = this.asSeconds();

    if (!total) {
        // this is the same as C#'s (Noda) and python (isodate)...
        // but not other JS (goog.date)
        return 'P0D';
    }

    return (total < 0 ? '-' : '') +
        'P' +
        (Y ? Y + 'Y' : '') +
        (M ? M + 'M' : '') +
        (D ? D + 'D' : '') +
        ((h || m || s) ? 'T' : '') +
        (h ? h + 'H' : '') +
        (m ? m + 'M' : '') +
        (s ? s + 'S' : '');
}

var proto$2 = Duration.prototype;

proto$2.isValid        = isValid$1;
proto$2.abs            = abs;
proto$2.add            = add$1;
proto$2.subtract       = subtract$1;
proto$2.as             = as;
proto$2.asMilliseconds = asMilliseconds;
proto$2.asSeconds      = asSeconds;
proto$2.asMinutes      = asMinutes;
proto$2.asHours        = asHours;
proto$2.asDays         = asDays;
proto$2.asWeeks        = asWeeks;
proto$2.asMonths       = asMonths;
proto$2.asYears        = asYears;
proto$2.valueOf        = valueOf$1;
proto$2._bubble        = bubble;
proto$2.get            = get$2;
proto$2.milliseconds   = milliseconds;
proto$2.seconds        = seconds;
proto$2.minutes        = minutes;
proto$2.hours          = hours;
proto$2.days           = days;
proto$2.weeks          = weeks;
proto$2.months         = months;
proto$2.years          = years;
proto$2.humanize       = humanize;
proto$2.toISOString    = toISOString$1;
proto$2.toString       = toISOString$1;
proto$2.toJSON         = toISOString$1;
proto$2.locale         = locale;
proto$2.localeData     = localeData;

// Deprecations
proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
proto$2.lang = lang;

// Side effect imports

// FORMATTING

addFormatToken('X', 0, 0, 'unix');
addFormatToken('x', 0, 0, 'valueOf');

// PARSING

addRegexToken('x', matchSigned);
addRegexToken('X', matchTimestamp);
addParseToken('X', function (input, array, config) {
    config._d = new Date(parseFloat(input, 10) * 1000);
});
addParseToken('x', function (input, array, config) {
    config._d = new Date(toInt(input));
});

// Side effect imports


hooks.version = '2.18.1';

setHookCallback(createLocal);

hooks.fn                    = proto;
hooks.min                   = min;
hooks.max                   = max;
hooks.now                   = now;
hooks.utc                   = createUTC;
hooks.unix                  = createUnix;
hooks.months                = listMonths;
hooks.isDate                = isDate;
hooks.locale                = getSetGlobalLocale;
hooks.invalid               = createInvalid;
hooks.duration              = createDuration;
hooks.isMoment              = isMoment;
hooks.weekdays              = listWeekdays;
hooks.parseZone             = createInZone;
hooks.localeData            = getLocale;
hooks.isDuration            = isDuration;
hooks.monthsShort           = listMonthsShort;
hooks.weekdaysMin           = listWeekdaysMin;
hooks.defineLocale          = defineLocale;
hooks.updateLocale          = updateLocale;
hooks.locales               = listLocales;
hooks.weekdaysShort         = listWeekdaysShort;
hooks.normalizeUnits        = normalizeUnits;
hooks.relativeTimeRounding = getSetRelativeTimeRounding;
hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
hooks.calendarFormat        = getCalendarFormat;
hooks.prototype             = proto;

return hooks;

})));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : English (United Kingdom) [en-gb]
//! author : Chris Gedrim : https://github.com/chrisgedrim

;(function (global, factory) {
    true ? factory(__webpack_require__(1)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


var enGb = moment.defineLocale('en-gb', {
    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd, D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'in %s',
        past : '%s ago',
        s : 'a few seconds',
        m : 'a minute',
        mm : '%d minutes',
        h : 'an hour',
        hh : '%d hours',
        d : 'a day',
        dd : '%d days',
        M : 'a month',
        MM : '%d months',
        y : 'a year',
        yy : '%d years'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (~~(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return enGb;

})));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Russian [ru]
//! author : Viktorminator : https://github.com/Viktorminator
//! Author : Menelion Elensúle : https://github.com/Oire
//! author : Коренберг Марк : https://github.com/socketpair

;(function (global, factory) {
    true ? factory(__webpack_require__(1)) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function plural(word, num) {
    var forms = word.split('_');
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
}
function relativeTimeWithPlural(number, withoutSuffix, key) {
    var format = {
        'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
        'hh': 'час_часа_часов',
        'dd': 'день_дня_дней',
        'MM': 'месяц_месяца_месяцев',
        'yy': 'год_года_лет'
    };
    if (key === 'm') {
        return withoutSuffix ? 'минута' : 'минуту';
    }
    else {
        return number + ' ' + plural(format[key], +number);
    }
}
var monthsParse = [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[йя]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i];

// http://new.gramota.ru/spravka/rules/139-prop : § 103
// Сокращения месяцев: http://new.gramota.ru/spravka/buro/search-answer?s=242637
// CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
var ru = moment.defineLocale('ru', {
    months : {
        format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_'),
        standalone: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_')
    },
    monthsShort : {
        // по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку ?
        format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split('_'),
        standalone: 'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_')
    },
    weekdays : {
        standalone: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
        format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_'),
        isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
    },
    weekdaysShort : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
    weekdaysMin : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
    monthsParse : monthsParse,
    longMonthsParse : monthsParse,
    shortMonthsParse : monthsParse,

    // полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
    monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

    // копия предыдущего
    monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

    // полные названия с падежами
    monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,

    // Выражение, которое соотвествует только сокращённым формам
    monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY г.',
        LLL : 'D MMMM YYYY г., HH:mm',
        LLLL : 'dddd, D MMMM YYYY г., HH:mm'
    },
    calendar : {
        sameDay: '[Сегодня в] LT',
        nextDay: '[Завтра в] LT',
        lastDay: '[Вчера в] LT',
        nextWeek: function (now) {
            if (now.week() !== this.week()) {
                switch (this.day()) {
                    case 0:
                        return '[В следующее] dddd [в] LT';
                    case 1:
                    case 2:
                    case 4:
                        return '[В следующий] dddd [в] LT';
                    case 3:
                    case 5:
                    case 6:
                        return '[В следующую] dddd [в] LT';
                }
            } else {
                if (this.day() === 2) {
                    return '[Во] dddd [в] LT';
                } else {
                    return '[В] dddd [в] LT';
                }
            }
        },
        lastWeek: function (now) {
            if (now.week() !== this.week()) {
                switch (this.day()) {
                    case 0:
                        return '[В прошлое] dddd [в] LT';
                    case 1:
                    case 2:
                    case 4:
                        return '[В прошлый] dddd [в] LT';
                    case 3:
                    case 5:
                    case 6:
                        return '[В прошлую] dddd [в] LT';
                }
            } else {
                if (this.day() === 2) {
                    return '[Во] dddd [в] LT';
                } else {
                    return '[В] dddd [в] LT';
                }
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'через %s',
        past : '%s назад',
        s : 'несколько секунд',
        m : relativeTimeWithPlural,
        mm : relativeTimeWithPlural,
        h : 'час',
        hh : relativeTimeWithPlural,
        d : 'день',
        dd : relativeTimeWithPlural,
        M : 'месяц',
        MM : relativeTimeWithPlural,
        y : 'год',
        yy : relativeTimeWithPlural
    },
    meridiemParse: /ночи|утра|дня|вечера/i,
    isPM : function (input) {
        return /^(дня|вечера)$/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'ночи';
        } else if (hour < 12) {
            return 'утра';
        } else if (hour < 17) {
            return 'дня';
        } else {
            return 'вечера';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
    ordinal: function (number, period) {
        switch (period) {
            case 'M':
            case 'd':
            case 'DDD':
                return number + '-й';
            case 'D':
                return number + '-го';
            case 'w':
            case 'W':
                return number + '-я';
            default:
                return number;
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1st is the first week of the year.
    }
});

return ru;

})));


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_underscore__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_moment__);




// Hi!
console.log(__WEBPACK_IMPORTED_MODULE_0_jquery___default.a.trim('Hello! I am first!'));

// Other module with import $ from 'jquery';
__webpack_require__(8);

// underscore
console.log('underscore - ' + __WEBPACK_IMPORTED_MODULE_1_underscore___default.a.isArray([0, 1]));

// moment
console.log('moment - ' + __WEBPACK_IMPORTED_MODULE_2_moment___default()().format());

/**
 * Semantic
 *
 * !Important to provide JQuery!
 *
plugins: [
...
new webpack.ProvidePlugin({
	$: 'jquery',
	jQuery: 'jquery'
}),
...
]
or
import $ from 'jquery'; window.$ = $; window.jQuery = $;
or
window.$ = window.jQuery = require("jquery");
 */

// all in one
// import '../semantic/dist/semantic.min.css';
__webpack_require__(9);
__WEBPACK_IMPORTED_MODULE_0_jquery___default()('#dropdown').dropdown();

// by parts
/*
import '../semantic/dist/components/reset.min.css';
import '../semantic/dist/components/site.min.css';
import '../semantic/dist/components/transition.min.css';
import '../semantic/dist/components/dropdown.min.css';
import '../semantic/dist/components/menu.min.css';

import '../semantic/dist/components/transition';
import '../semantic/dist/components/dropdown';
$('#dropdown').dropdown();
*/

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
      return _;
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}.call(this));


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./en-gb": 2,
	"./en-gb.js": 2,
	"./ru": 3,
	"./ru.js": 3
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 7;

/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) { /*
 * # Semantic UI - 2.2.13
 * https://github.com/Semantic-Org/Semantic-UI
 * http://www.semantic-ui.com/
 *
 * Copyright 2014 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
!function(e,t,n,i){e.site=e.fn.site=function(i){var o,a,r=(new Date).getTime(),s=[],l=arguments[0],c="string"==typeof l,u=[].slice.call(arguments,1),d=e.isPlainObject(i)?e.extend(!0,{},e.site.settings,i):e.extend({},e.site.settings),f=d.namespace,m=d.error,g="module-"+f,v=e(n),p=this,h=v.data(g);return o={initialize:function(){o.instantiate()},instantiate:function(){o.verbose("Storing instance of site",o),h=o,v.data(g,o)},normalize:function(){o.fix.console(),o.fix.requestAnimationFrame()},fix:{console:function(){o.debug("Normalizing window.console"),void 0!==console&&void 0!==console.log||(o.verbose("Console not available, normalizing events"),o.disable.console()),void 0!==console.group&&void 0!==console.groupEnd&&void 0!==console.groupCollapsed||(o.verbose("Console group not available, normalizing events"),t.console.group=function(){},t.console.groupEnd=function(){},t.console.groupCollapsed=function(){}),void 0===console.markTimeline&&(o.verbose("Mark timeline not available, normalizing events"),t.console.markTimeline=function(){})},consoleClear:function(){o.debug("Disabling programmatic console clearing"),t.console.clear=function(){}},requestAnimationFrame:function(){o.debug("Normalizing requestAnimationFrame"),void 0===t.requestAnimationFrame&&(o.debug("RequestAnimationFrame not available, normalizing event"),t.requestAnimationFrame=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)})}},moduleExists:function(t){return void 0!==e.fn[t]&&void 0!==e.fn[t].settings},enabled:{modules:function(t){var n=[];return t=t||d.modules,e.each(t,function(e,t){o.moduleExists(t)&&n.push(t)}),n}},disabled:{modules:function(t){var n=[];return t=t||d.modules,e.each(t,function(e,t){o.moduleExists(t)||n.push(t)}),n}},change:{setting:function(t,n,i,a){i="string"==typeof i?"all"===i?d.modules:[i]:i||d.modules,a=void 0===a||a,e.each(i,function(i,r){var s,l=!o.moduleExists(r)||(e.fn[r].settings.namespace||!1);o.moduleExists(r)&&(o.verbose("Changing default setting",t,n,r),e.fn[r].settings[t]=n,a&&l&&(s=e(":data(module-"+l+")")).length>0&&(o.verbose("Modifying existing settings",s),s[r]("setting",t,n)))})},settings:function(t,n,i){n="string"==typeof n?[n]:n||d.modules,i=void 0===i||i,e.each(n,function(n,a){var r;o.moduleExists(a)&&(o.verbose("Changing default setting",t,a),e.extend(!0,e.fn[a].settings,t),i&&f&&(r=e(":data(module-"+f+")")).length>0&&(o.verbose("Modifying existing settings",r),r[a]("setting",t)))})}},enable:{console:function(){o.console(!0)},debug:function(e,t){e=e||d.modules,o.debug("Enabling debug for modules",e),o.change.setting("debug",!0,e,t)},verbose:function(e,t){e=e||d.modules,o.debug("Enabling verbose debug for modules",e),o.change.setting("verbose",!0,e,t)}},disable:{console:function(){o.console(!1)},debug:function(e,t){e=e||d.modules,o.debug("Disabling debug for modules",e),o.change.setting("debug",!1,e,t)},verbose:function(e,t){e=e||d.modules,o.debug("Disabling verbose debug for modules",e),o.change.setting("verbose",!1,e,t)}},console:function(e){if(e){if(void 0===h.cache.console)return void o.error(m.console);o.debug("Restoring console function"),t.console=h.cache.console}else o.debug("Disabling console function"),h.cache.console=t.console,t.console={clear:function(){},error:function(){},group:function(){},groupCollapsed:function(){},groupEnd:function(){},info:function(){},log:function(){},markTimeline:function(){},warn:function(){}}},destroy:function(){o.verbose("Destroying previous site for",v),v.removeData(g)},cache:{},setting:function(t,n){if(e.isPlainObject(t))e.extend(!0,d,t);else{if(void 0===n)return d[t];d[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,o,t);else{if(void 0===n)return o[t];o[t]=n}},debug:function(){d.debug&&(d.performance?o.performance.log(arguments):(o.debug=Function.prototype.bind.call(console.info,console,d.name+":"),o.debug.apply(console,arguments)))},verbose:function(){d.verbose&&d.debug&&(d.performance?o.performance.log(arguments):(o.verbose=Function.prototype.bind.call(console.info,console,d.name+":"),o.verbose.apply(console,arguments)))},error:function(){o.error=Function.prototype.bind.call(console.error,console,d.name+":"),o.error.apply(console,arguments)},performance:{log:function(e){var t,n;d.performance&&(n=(t=(new Date).getTime())-(r||t),r=t,s.push({Element:p,Name:e[0],Arguments:[].slice.call(e,1)||"","Execution Time":n})),clearTimeout(o.performance.timer),o.performance.timer=setTimeout(o.performance.display,500)},display:function(){var t=d.name+":",n=0;r=!1,clearTimeout(o.performance.timer),e.each(s,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",(void 0!==console.group||void 0!==console.table)&&s.length>0&&(console.groupCollapsed(t),console.table?console.table(s):e.each(s,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(t,n,i){var r,s,l,c=h;return n=n||u,i=p||i,"string"==typeof t&&void 0!==c&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,i){var a=n!=r?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(void 0!==c[a])return s=c[a],!1;if(!e.isPlainObject(c[i])||n==r)return void 0!==c[i]?(s=c[i],!1):(o.error(m.method,t),!1);c=c[i]}})),e.isFunction(s)?l=s.apply(i,n):void 0!==s&&(l=s),e.isArray(a)?a.push(l):void 0!==a?a=[a,l]:void 0!==l&&(a=l),s}},c?(void 0===h&&o.initialize(),o.invoke(l)):(void 0!==h&&o.destroy(),o.initialize()),void 0!==a?a:this},e.site.settings={name:"Site",namespace:"site",error:{console:"Console cannot be restored, most likely it was overwritten outside of module",method:"The method you called is not defined."},debug:!1,verbose:!1,performance:!0,modules:["accordion","api","checkbox","dimmer","dropdown","embed","form","modal","nag","popup","rating","shape","sidebar","state","sticky","tab","transition","visit","visibility"],siteNamespace:"site",namespaceStub:{cache:{},config:{},sections:{},section:{},utilities:{}}},e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(n){return!!e.data(n,t)}}):function(t,n,i){return!!e.data(t,i[3])}})}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.form=function(t){var i,o=e(this),a=o.selector||"",r=(new Date).getTime(),s=[],l=arguments[0],c=arguments[1],u="string"==typeof l,d=[].slice.call(arguments,1);return o.each(function(){var f,m,g,v,p,h,b,y,x,C,w,k,S,T,A,R,P,E,F,O=e(this),D=this,q=[],j=!1;(F={initialize:function(){F.get.settings(),u?(void 0===E&&F.instantiate(),F.invoke(l)):(void 0!==E&&E.invoke("destroy"),F.verbose("Initializing form validation",O,y),F.bindEvents(),F.set.defaults(),F.instantiate())},instantiate:function(){F.verbose("Storing instance of module",F),E=F,O.data(R,F)},destroy:function(){F.verbose("Destroying previous module",E),F.removeEvents(),O.removeData(R)},refresh:function(){F.verbose("Refreshing selector cache"),f=O.find(w.field),m=O.find(w.group),g=O.find(w.message),v=O.find(w.prompt),p=O.find(w.submit),h=O.find(w.clear),b=O.find(w.reset)},submit:function(){F.verbose("Submitting form",O),O.submit()},attachEvents:function(t,n){n=n||"submit",e(t).on("click"+P,function(e){F[n](),e.preventDefault()})},bindEvents:function(){F.verbose("Attaching form events"),O.on("submit"+P,F.validate.form).on("blur"+P,w.field,F.event.field.blur).on("click"+P,w.submit,F.submit).on("click"+P,w.reset,F.reset).on("click"+P,w.clear,F.clear),y.keyboardShortcuts&&O.on("keydown"+P,w.field,F.event.field.keydown),f.each(function(){var t=e(this),n=t.prop("type"),i=F.get.changeEvent(n,t);e(this).on(i+P,F.event.field.change)})},clear:function(){f.each(function(){var t=e(this),n=t.parent(),i=t.closest(m),o=i.find(w.prompt),a=t.data(C.defaultValue)||"",r=n.is(w.uiCheckbox),s=n.is(w.uiDropdown);i.hasClass(k.error)&&(F.verbose("Resetting error on field",i),i.removeClass(k.error),o.remove()),s?(F.verbose("Resetting dropdown value",n,a),n.dropdown("clear")):r?t.prop("checked",!1):(F.verbose("Resetting field value",t,a),t.val(""))})},reset:function(){f.each(function(){var t=e(this),n=t.parent(),i=t.closest(m),o=i.find(w.prompt),a=t.data(C.defaultValue),r=n.is(w.uiCheckbox),s=n.is(w.uiDropdown),l=i.hasClass(k.error);void 0!==a&&(l&&(F.verbose("Resetting error on field",i),i.removeClass(k.error),o.remove()),s?(F.verbose("Resetting dropdown value",n,a),n.dropdown("restore defaults")):r?(F.verbose("Resetting checkbox value",n,a),t.prop("checked",a)):(F.verbose("Resetting field value",t,a),t.val(a)))})},determine:{isValid:function(){var t=!0;return e.each(x,function(e,n){F.validate.field(n,e,!0)||(t=!1)}),t}},is:{bracketedRule:function(e){return e.type&&e.type.match(y.regExp.bracket)},shorthandFields:function(e){var t=e[Object.keys(e)[0]];return F.is.shorthandRules(t)},shorthandRules:function(t){return"string"==typeof t||e.isArray(t)},empty:function(e){return!e||0===e.length||(e.is('input[type="checkbox"]')?!e.is(":checked"):F.is.blank(e))},blank:function(t){return""===e.trim(t.val())},valid:function(t){var n=!0;return t?(F.verbose("Checking if field is valid",t),F.validate.field(x[t],t,!1)):(F.verbose("Checking if form is valid"),e.each(x,function(e,t){F.is.valid(e)||(n=!1)}),n)}},removeEvents:function(){O.off(P),f.off(P),p.off(P),f.off(P)},event:{field:{keydown:function(t){var n=e(this),i=t.which,o=n.is(w.input),a=n.is(w.checkbox),r=n.closest(w.uiDropdown).length>0,s={enter:13,escape:27};i==s.escape&&(F.verbose("Escape key pressed blurring field"),n.blur()),t.ctrlKey||i!=s.enter||!o||r||a||(j||(n.one("keyup"+P,F.event.field.keyup),F.submit(),F.debug("Enter pressed on input submitting form")),j=!0)},keyup:function(){j=!1},blur:function(t){var n=e(this),i=n.closest(m),o=F.get.validation(n);i.hasClass(k.error)?(F.debug("Revalidating field",n,o),o&&F.validate.field(o)):"blur"!=y.on&&"change"!=y.on||o&&F.validate.field(o)},change:function(t){var n=e(this),i=n.closest(m),o=F.get.validation(n);o&&("change"==y.on||i.hasClass(k.error)&&y.revalidate)&&(clearTimeout(F.timer),F.timer=setTimeout(function(){F.debug("Revalidating field",n,F.get.validation(n)),F.validate.field(o)},y.delay))}}},get:{ancillaryValue:function(e){return!(!e.type||!e.value&&!F.is.bracketedRule(e))&&(void 0!==e.value?e.value:e.type.match(y.regExp.bracket)[1]+"")},ruleName:function(e){return F.is.bracketedRule(e)?e.type.replace(e.type.match(y.regExp.bracket)[0],""):e.type},changeEvent:function(e,t){return"checkbox"==e||"radio"==e||"hidden"==e||t.is("select")?"change":F.get.inputEvent()},inputEvent:function(){return void 0!==n.createElement("input").oninput?"input":void 0!==n.createElement("input").onpropertychange?"propertychange":"keyup"},fieldsFromShorthand:function(t){var n={};return e.each(t,function(t,i){"string"==typeof i&&(i=[i]),n[t]={rules:[]},e.each(i,function(e,i){n[t].rules.push({type:i})})}),n},prompt:function(e,t){var n,i,o,a=F.get.ruleName(e),r=F.get.ancillaryValue(e),s=e.prompt||y.prompt[a]||y.text.unspecifiedRule,l=-1!==s.search("{value}"),c=-1!==s.search("{name}");return(c||l)&&(i=F.get.field(t.identifier)),l&&(s=s.replace("{value}",i.val())),c&&(o=1==(n=i.closest(w.group).find("label").eq(0)).length?n.text():i.prop("placeholder")||y.text.unspecifiedField,s=s.replace("{name}",o)),s=s.replace("{identifier}",t.identifier),s=s.replace("{ruleValue}",r),e.prompt||F.verbose("Using default validation prompt for type",s,a),s},settings:function(){if(e.isPlainObject(t)){var n=Object.keys(t);n.length>0&&(void 0!==t[n[0]].identifier&&void 0!==t[n[0]].rules)?(y=e.extend(!0,{},e.fn.form.settings,c),x=e.extend({},e.fn.form.settings.defaults,t),F.error(y.error.oldSyntax,D),F.verbose("Extending settings from legacy parameters",x,y)):(t.fields&&F.is.shorthandFields(t.fields)&&(t.fields=F.get.fieldsFromShorthand(t.fields)),y=e.extend(!0,{},e.fn.form.settings,t),x=e.extend({},e.fn.form.settings.defaults,y.fields),F.verbose("Extending settings",x,y))}else y=e.fn.form.settings,x=e.fn.form.settings.defaults,F.verbose("Using default form validation",x,y);A=y.namespace,C=y.metadata,w=y.selector,k=y.className,S=y.regExp,T=y.error,R="module-"+A,P="."+A,E=O.data(R),F.refresh()},field:function(t){return F.verbose("Finding field with identifier",t),t=F.escape.string(t),f.filter("#"+t).length>0?f.filter("#"+t):f.filter('[name="'+t+'"]').length>0?f.filter('[name="'+t+'"]'):f.filter('[name="'+t+'[]"]').length>0?f.filter('[name="'+t+'[]"]'):f.filter("[data-"+C.validate+'="'+t+'"]').length>0?f.filter("[data-"+C.validate+'="'+t+'"]'):e("<input/>")},fields:function(t){var n=e();return e.each(t,function(e,t){n=n.add(F.get.field(t))}),n},validation:function(t){var n,i;return!!x&&(e.each(x,function(e,o){i=o.identifier||e,F.get.field(i)[0]==t[0]&&(o.identifier=i,n=o)}),n||!1)},value:function(e){var t=[];return t.push(e),F.get.values.call(D,t)[e]},values:function(t){var n={};return(e.isArray(t)?F.get.fields(t):f).each(function(t,i){var o=e(i),a=(o.prop("type"),o.prop("name")),r=o.val(),s=o.is(w.checkbox),l=o.is(w.radio),c=-1!==a.indexOf("[]"),u=!!s&&o.is(":checked");a&&(c?(a=a.replace("[]",""),n[a]||(n[a]=[]),s?u?n[a].push(r||!0):n[a].push(!1):n[a].push(r)):l?void 0===n[a]&&(n[a]=!!u):n[a]=s?!!u&&(r||!0):r)}),n}},has:{field:function(e){return F.verbose("Checking for existence of a field with identifier",e),"string"!=typeof(e=F.escape.string(e))&&F.error(T.identifier,e),f.filter("#"+e).length>0||(f.filter('[name="'+e+'"]').length>0||f.filter("[data-"+C.validate+'="'+e+'"]').length>0)}},escape:{string:function(e){return(e=String(e)).replace(S.escape,"\\$&")}},add:{rule:function(e,t){F.add.field(e,t)},field:function(t,n){var i={};F.is.shorthandRules(n)?(n=e.isArray(n)?n:[n],i[t]={rules:[]},e.each(n,function(e,n){i[t].rules.push({type:n})})):i[t]=n,x=e.extend({},x,i),F.debug("Adding rules",i,x)},fields:function(t){var n;n=t&&F.is.shorthandFields(t)?F.get.fieldsFromShorthand(t):t,x=e.extend({},x,n)},prompt:function(t,n){var i=F.get.field(t).closest(m),o=i.children(w.prompt),a=0!==o.length;n="string"==typeof n?[n]:n,F.verbose("Adding field error state",t),i.addClass(k.error),y.inline&&(a||(o=y.templates.prompt(n)).appendTo(i),o.html(n[0]),a?F.verbose("Inline errors are disabled, no inline error added",t):y.transition&&void 0!==e.fn.transition&&O.transition("is supported")?(F.verbose("Displaying error with css transition",y.transition),o.transition(y.transition+" in",y.duration)):(F.verbose("Displaying error with fallback javascript animation"),o.fadeIn(y.duration)))},errors:function(e){F.debug("Adding form error messages",e),F.set.error(),g.html(y.templates.error(e))}},remove:{rule:function(t,n){var i=e.isArray(n)?n:[n];if(void 0==n)return F.debug("Removed all rules"),void(x[t].rules=[]);void 0!=x[t]&&e.isArray(x[t].rules)&&e.each(x[t].rules,function(e,n){-1!==i.indexOf(n.type)&&(F.debug("Removed rule",n.type),x[t].rules.splice(e,1))})},field:function(t){var n=e.isArray(t)?t:[t];e.each(n,function(e,t){F.remove.rule(t)})},rules:function(t,n){e.isArray(t)?e.each(fields,function(e,t){F.remove.rule(t,n)}):F.remove.rule(t,n)},fields:function(e){F.remove.field(e)},prompt:function(t){var n=F.get.field(t).closest(m),i=n.children(w.prompt);n.removeClass(k.error),y.inline&&i.is(":visible")&&(F.verbose("Removing prompt for field",t),y.transition&&void 0!==e.fn.transition&&O.transition("is supported")?i.transition(y.transition+" out",y.duration,function(){i.remove()}):i.fadeOut(y.duration,function(){i.remove()}))}},set:{success:function(){O.removeClass(k.error).addClass(k.success)},defaults:function(){f.each(function(){var t=e(this),n=t.filter(w.checkbox).length>0?t.is(":checked"):t.val();t.data(C.defaultValue,n)})},error:function(){O.removeClass(k.success).addClass(k.error)},value:function(e,t){var n={};return n[e]=t,F.set.values.call(D,n)},values:function(t){e.isEmptyObject(t)||e.each(t,function(t,n){var i,o=F.get.field(t),a=o.parent(),r=e.isArray(n),s=a.is(w.uiCheckbox),l=a.is(w.uiDropdown),c=o.is(w.radio)&&s;o.length>0&&(r&&s?(F.verbose("Selecting multiple",n,o),a.checkbox("uncheck"),e.each(n,function(e,t){i=o.filter('[value="'+t+'"]'),a=i.parent(),i.length>0&&a.checkbox("check")})):c?(F.verbose("Selecting radio value",n,o),o.filter('[value="'+n+'"]').parent(w.uiCheckbox).checkbox("check")):s?(F.verbose("Setting checkbox value",n,a),!0===n?a.checkbox("check"):a.checkbox("uncheck")):l?(F.verbose("Setting dropdown value",n,a),a.dropdown("set selected",n)):(F.verbose("Setting field value",n,o),o.val(n)))})}},validate:{form:function(e,t){var n=F.get.values();if(j)return!1;if(q=[],F.determine.isValid()){if(F.debug("Form has no validation errors, submitting"),F.set.success(),!0!==t)return y.onSuccess.call(D,e,n)}else if(F.debug("Form has errors"),F.set.error(),y.inline||F.add.errors(q),void 0!==O.data("moduleApi")&&e.stopImmediatePropagation(),!0!==t)return y.onFailure.call(D,q,n)},field:function(t,n,i){i=void 0===i||i,"string"==typeof t&&(F.verbose("Validating field",t),n=t,t=x[t]);var o=t.identifier||n,a=F.get.field(o),r=!!t.depends&&F.get.field(t.depends),s=!0,l=[];return t.identifier||(F.debug("Using field name as identifier",o),t.identifier=o),a.prop("disabled")?(F.debug("Field is disabled. Skipping",o),s=!0):t.optional&&F.is.blank(a)?(F.debug("Field is optional and blank. Skipping",o),s=!0):t.depends&&F.is.empty(r)?(F.debug("Field depends on another value that is not present or empty. Skipping",r),s=!0):void 0!==t.rules&&e.each(t.rules,function(e,n){F.has.field(o)&&!F.validate.rule(t,n)&&(F.debug("Field is invalid",o,n.type),l.push(F.get.prompt(n,t)),s=!1)}),s?(i&&(F.remove.prompt(o,l),y.onValid.call(a)),!0):(i&&(q=q.concat(l),F.add.prompt(o,l),y.onInvalid.call(a,l)),!1)},rule:function(t,n){var i=F.get.field(t.identifier),o=(n.type,i.val()),a=F.get.ancillaryValue(n),r=F.get.ruleName(n),s=y.rules[r];{if(e.isFunction(s))return o=void 0===o||""===o||null===o?"":e.trim(o+""),s.call(i,o,a);F.error(T.noRule,r)}}},setting:function(t,n){if(e.isPlainObject(t))e.extend(!0,y,t);else{if(void 0===n)return y[t];y[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,F,t);else{if(void 0===n)return F[t];F[t]=n}},debug:function(){!y.silent&&y.debug&&(y.performance?F.performance.log(arguments):(F.debug=Function.prototype.bind.call(console.info,console,y.name+":"),F.debug.apply(console,arguments)))},verbose:function(){!y.silent&&y.verbose&&y.debug&&(y.performance?F.performance.log(arguments):(F.verbose=Function.prototype.bind.call(console.info,console,y.name+":"),F.verbose.apply(console,arguments)))},error:function(){y.silent||(F.error=Function.prototype.bind.call(console.error,console,y.name+":"),F.error.apply(console,arguments))},performance:{log:function(e){var t,n;y.performance&&(n=(t=(new Date).getTime())-(r||t),r=t,s.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:D,"Execution Time":n})),clearTimeout(F.performance.timer),F.performance.timer=setTimeout(F.performance.display,500)},display:function(){var t=y.name+":",n=0;r=!1,clearTimeout(F.performance.timer),e.each(s,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",a&&(t+=" '"+a+"'"),o.length>1&&(t+=" ("+o.length+")"),(void 0!==console.group||void 0!==console.table)&&s.length>0&&(console.groupCollapsed(t),console.table?console.table(s):e.each(s,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(t,n,o){var a,r,s,l=E;return n=n||d,o=D||o,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]&&(r=l[i],!1);l=l[i]}})),e.isFunction(r)?s=r.apply(o,n):void 0!==r&&(s=r),e.isArray(i)?i.push(s):void 0!==i?i=[i,s]:void 0!==s&&(i=s),r}}).initialize()}),void 0!==i?i:this},e.fn.form.settings={name:"Form",namespace:"form",debug:!1,verbose:!1,performance:!0,fields:!1,keyboardShortcuts:!0,on:"submit",inline:!1,delay:200,revalidate:!0,transition:"scale",duration:200,onValid:function(){},onInvalid:function(){},onSuccess:function(){return!0},onFailure:function(){return!1},metadata:{defaultValue:"default",validate:"validate"},regExp:{htmlID:/^[a-zA-Z][\w:.-]*$/g,bracket:/\[(.*)\]/i,decimal:/^\d+\.?\d*$/,email:/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,escape:/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,flags:/^\/(.*)\/(.*)?/,integer:/^\-?\d+$/,number:/^\-?\d*(\.\d+)?$/,url:/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i},text:{unspecifiedRule:"Please enter a valid value",unspecifiedField:"This field"},prompt:{empty:"{name} must have a value",checked:"{name} must be checked",email:"{name} must be a valid e-mail",url:"{name} must be a valid url",regExp:"{name} is not formatted correctly",integer:"{name} must be an integer",decimal:"{name} must be a decimal number",number:"{name} must be set to a number",is:'{name} must be "{ruleValue}"',isExactly:'{name} must be exactly "{ruleValue}"',not:'{name} cannot be set to "{ruleValue}"',notExactly:'{name} cannot be set to exactly "{ruleValue}"',contain:'{name} cannot contain "{ruleValue}"',containExactly:'{name} cannot contain exactly "{ruleValue}"',doesntContain:'{name} must contain  "{ruleValue}"',doesntContainExactly:'{name} must contain exactly "{ruleValue}"',minLength:"{name} must be at least {ruleValue} characters",length:"{name} must be at least {ruleValue} characters",exactLength:"{name} must be exactly {ruleValue} characters",maxLength:"{name} cannot be longer than {ruleValue} characters",match:"{name} must match {ruleValue} field",different:"{name} must have a different value than {ruleValue} field",creditCard:"{name} must be a valid credit card number",minCount:"{name} must have at least {ruleValue} choices",exactCount:"{name} must have exactly {ruleValue} choices",maxCount:"{name} must have {ruleValue} or less choices"},selector:{checkbox:'input[type="checkbox"], input[type="radio"]',clear:".clear",field:"input, textarea, select",group:".field",input:"input",message:".error.message",prompt:".prompt.label",radio:'input[type="radio"]',reset:'.reset:not([type="reset"])',submit:'.submit:not([type="submit"])',uiCheckbox:".ui.checkbox",uiDropdown:".ui.dropdown"},className:{error:"error",label:"ui prompt label",pressed:"down",success:"success"},error:{identifier:"You must specify a string identifier for each field",method:"The method you called is not defined.",noRule:"There is no rule matching the one you specified",oldSyntax:"Starting in 2.0 forms now only take a single settings object. Validation settings converted to new syntax automatically."},templates:{error:function(t){var n='<ul class="list">';return e.each(t,function(e,t){n+="<li>"+t+"</li>"}),n+="</ul>",e(n)},prompt:function(t){return e("<div/>").addClass("ui basic red pointing prompt label").html(t[0])}},rules:{empty:function(t){return!(void 0===t||""===t||e.isArray(t)&&0===t.length)},checked:function(){return e(this).filter(":checked").length>0},email:function(t){return e.fn.form.settings.regExp.email.test(t)},url:function(t){return e.fn.form.settings.regExp.url.test(t)},regExp:function(t,n){if(n instanceof RegExp)return t.match(n);var i,o=n.match(e.fn.form.settings.regExp.flags);return o&&(n=o.length>=2?o[1]:n,i=o.length>=3?o[2]:""),t.match(new RegExp(n,i))},integer:function(t,n){var i,o,a,r=e.fn.form.settings.regExp.integer;return n&&-1===["",".."].indexOf(n)&&(-1==n.indexOf("..")?r.test(n)&&(i=o=n-0):(a=n.split("..",2),r.test(a[0])&&(i=a[0]-0),r.test(a[1])&&(o=a[1]-0))),r.test(t)&&(void 0===i||t>=i)&&(void 0===o||t<=o)},decimal:function(t){return e.fn.form.settings.regExp.decimal.test(t)},number:function(t){return e.fn.form.settings.regExp.number.test(t)},is:function(e,t){return t="string"==typeof t?t.toLowerCase():t,(e="string"==typeof e?e.toLowerCase():e)==t},isExactly:function(e,t){return e==t},not:function(e,t){return e="string"==typeof e?e.toLowerCase():e,t="string"==typeof t?t.toLowerCase():t,e!=t},notExactly:function(e,t){return e!=t},contains:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1!==t.search(new RegExp(n,"i"))},containsExactly:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1!==t.search(new RegExp(n))},doesntContain:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1===t.search(new RegExp(n,"i"))},doesntContainExactly:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1===t.search(new RegExp(n))},minLength:function(e,t){return void 0!==e&&e.length>=t},length:function(e,t){return void 0!==e&&e.length>=t},exactLength:function(e,t){return void 0!==e&&e.length==t},maxLength:function(e,t){return void 0!==e&&e.length<=t},match:function(t,n){var i;e(this);return e('[data-validate="'+n+'"]').length>0?i=e('[data-validate="'+n+'"]').val():e("#"+n).length>0?i=e("#"+n).val():e('[name="'+n+'"]').length>0?i=e('[name="'+n+'"]').val():e('[name="'+n+'[]"]').length>0&&(i=e('[name="'+n+'[]"]')),void 0!==i&&t.toString()==i.toString()},different:function(t,n){var i;e(this);return e('[data-validate="'+n+'"]').length>0?i=e('[data-validate="'+n+'"]').val():e("#"+n).length>0?i=e("#"+n).val():e('[name="'+n+'"]').length>0?i=e('[name="'+n+'"]').val():e('[name="'+n+'[]"]').length>0&&(i=e('[name="'+n+'[]"]')),void 0!==i&&t.toString()!==i.toString()},creditCard:function(t,n){var i,o,a={visa:{pattern:/^4/,length:[16]},amex:{pattern:/^3[47]/,length:[15]},mastercard:{pattern:/^5[1-5]/,length:[16]},discover:{pattern:/^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,length:[16]},unionPay:{pattern:/^(62|88)/,length:[16,17,18,19]},jcb:{pattern:/^35(2[89]|[3-8][0-9])/,length:[16]},maestro:{pattern:/^(5018|5020|5038|6304|6759|676[1-3])/,length:[12,13,14,15,16,17,18,19]},dinersClub:{pattern:/^(30[0-5]|^36)/,length:[14]},laser:{pattern:/^(6304|670[69]|6771)/,length:[16,17,18,19]},visaElectron:{pattern:/^(4026|417500|4508|4844|491(3|7))/,length:[16]}},r={},s=!1,l="string"==typeof n&&n.split(",");if("string"==typeof t&&0!==t.length){if(t=t.replace(/[\-]/g,""),l&&(e.each(l,function(n,i){(o=a[i])&&(r={length:-1!==e.inArray(t.length,o.length),pattern:-1!==t.search(o.pattern)}).length&&r.pattern&&(s=!0)}),!s))return!1;if((i={number:-1!==e.inArray(t.length,a.unionPay.length),pattern:-1!==t.search(a.unionPay.pattern)}).number&&i.pattern)return!0;for(var c=t.length,u=0,d=[[0,1,2,3,4,5,6,7,8,9],[0,2,4,6,8,1,3,5,7,9]],f=0;c--;)f+=d[u][parseInt(t.charAt(c),10)],u^=1;return f%10==0&&f>0}},minCount:function(e,t){return 0==t||(1==t?""!==e:e.split(",").length>=t)},exactCount:function(e,t){return 0==t?""===e:1==t?""!==e&&-1===e.search(","):e.split(",").length==t},maxCount:function(e,t){return 0!=t&&(1==t?-1===e.search(","):e.split(",").length<=t)}}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.accordion=function(n){var i,o=e(this),a=(new Date).getTime(),r=[],s=arguments[0],l="string"==typeof s,c=[].slice.call(arguments,1);t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame;return o.each(function(){var u,d,f=e.isPlainObject(n)?e.extend(!0,{},e.fn.accordion.settings,n):e.extend({},e.fn.accordion.settings),m=f.className,g=f.namespace,v=f.selector,p=f.error,h="."+g,b="module-"+g,y=o.selector||"",x=e(this),C=x.find(v.title),w=x.find(v.content),k=this,S=x.data(b);d={initialize:function(){d.debug("Initializing",x),d.bind.events(),f.observeChanges&&d.observeChanges(),d.instantiate()},instantiate:function(){S=d,x.data(b,d)},destroy:function(){d.debug("Destroying previous instance",x),x.off(h).removeData(b)},refresh:function(){C=x.find(v.title),w=x.find(v.content)},observeChanges:function(){"MutationObserver"in t&&((u=new MutationObserver(function(e){d.debug("DOM tree modified, updating selector cache"),d.refresh()})).observe(k,{childList:!0,subtree:!0}),d.debug("Setting up mutation observer",u))},bind:{events:function(){d.debug("Binding delegated events"),x.on(f.on+h,v.trigger,d.event.click)}},event:{click:function(){d.toggle.call(this)}},toggle:function(t){var n=void 0!==t?"number"==typeof t?C.eq(t):e(t).closest(v.title):e(this).closest(v.title),i=n.next(w),o=i.hasClass(m.animating),a=i.hasClass(m.active),r=a&&!o,s=!a&&o;d.debug("Toggling visibility of content",n),r||s?f.collapsible?d.close.call(n):d.debug("Cannot close accordion content collapsing is disabled"):d.open.call(n)},open:function(t){var n=void 0!==t?"number"==typeof t?C.eq(t):e(t).closest(v.title):e(this).closest(v.title),i=n.next(w),o=i.hasClass(m.animating);i.hasClass(m.active)||o?d.debug("Accordion already open, skipping",i):(d.debug("Opening accordion content",n),f.onOpening.call(i),f.exclusive&&d.closeOthers.call(n),n.addClass(m.active),i.stop(!0,!0).addClass(m.animating),f.animateChildren&&(void 0!==e.fn.transition&&x.transition("is supported")?i.children().transition({animation:"fade in",queue:!1,useFailSafe:!0,debug:f.debug,verbose:f.verbose,duration:f.duration}):i.children().stop(!0,!0).animate({opacity:1},f.duration,d.resetOpacity)),i.slideDown(f.duration,f.easing,function(){i.removeClass(m.animating).addClass(m.active),d.reset.display.call(this),f.onOpen.call(this),f.onChange.call(this)}))},close:function(t){var n=void 0!==t?"number"==typeof t?C.eq(t):e(t).closest(v.title):e(this).closest(v.title),i=n.next(w),o=i.hasClass(m.animating),a=i.hasClass(m.active),r=!a&&o,s=a&&o;!a&&!r||s||(d.debug("Closing accordion content",i),f.onClosing.call(i),n.removeClass(m.active),i.stop(!0,!0).addClass(m.animating),f.animateChildren&&(void 0!==e.fn.transition&&x.transition("is supported")?i.children().transition({animation:"fade out",queue:!1,useFailSafe:!0,debug:f.debug,verbose:f.verbose,duration:f.duration}):i.children().stop(!0,!0).animate({opacity:0},f.duration,d.resetOpacity)),i.slideUp(f.duration,f.easing,function(){i.removeClass(m.animating).removeClass(m.active),d.reset.display.call(this),f.onClose.call(this),f.onChange.call(this)}))},closeOthers:function(t){var n,i,o,a=void 0!==t?C.eq(t):e(this).closest(v.title),r=a.parents(v.content).prev(v.title),s=a.closest(v.accordion),l=v.title+"."+m.active+":visible",c=v.content+"."+m.active+":visible";f.closeNested?o=(n=s.find(l).not(r)).next(w):(n=s.find(l).not(r),i=s.find(c).find(l).not(r),o=(n=n.not(i)).next(w)),n.length>0&&(d.debug("Exclusive enabled, closing other content",n),n.removeClass(m.active),o.removeClass(m.animating).stop(!0,!0),f.animateChildren&&(void 0!==e.fn.transition&&x.transition("is supported")?o.children().transition({animation:"fade out",useFailSafe:!0,debug:f.debug,verbose:f.verbose,duration:f.duration}):o.children().stop(!0,!0).animate({opacity:0},f.duration,d.resetOpacity)),o.slideUp(f.duration,f.easing,function(){e(this).removeClass(m.active),d.reset.display.call(this)}))},reset:{display:function(){d.verbose("Removing inline display from element",this),e(this).css("display",""),""===e(this).attr("style")&&e(this).attr("style","").removeAttr("style")},opacity:function(){d.verbose("Removing inline opacity from element",this),e(this).css("opacity",""),""===e(this).attr("style")&&e(this).attr("style","").removeAttr("style")}},setting:function(t,n){if(d.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,f,t);else{if(void 0===n)return f[t];e.isPlainObject(f[t])?e.extend(!0,f[t],n):f[t]=n}},internal:function(t,n){if(d.debug("Changing internal",t,n),void 0===n)return d[t];e.isPlainObject(t)?e.extend(!0,d,t):d[t]=n},debug:function(){!f.silent&&f.debug&&(f.performance?d.performance.log(arguments):(d.debug=Function.prototype.bind.call(console.info,console,f.name+":"),d.debug.apply(console,arguments)))},verbose:function(){!f.silent&&f.verbose&&f.debug&&(f.performance?d.performance.log(arguments):(d.verbose=Function.prototype.bind.call(console.info,console,f.name+":"),d.verbose.apply(console,arguments)))},error:function(){f.silent||(d.error=Function.prototype.bind.call(console.error,console,f.name+":"),d.error.apply(console,arguments))},performance:{log:function(e){var t,n;f.performance&&(n=(t=(new Date).getTime())-(a||t),a=t,r.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:k,"Execution Time":n})),clearTimeout(d.performance.timer),d.performance.timer=setTimeout(d.performance.display,500)},display:function(){var t=f.name+":",n=0;a=!1,clearTimeout(d.performance.timer),e.each(r,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",y&&(t+=" '"+y+"'"),(void 0!==console.group||void 0!==console.table)&&r.length>0&&(console.groupCollapsed(t),console.table?console.table(r):e.each(r,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),r=[]}},invoke:function(t,n,o){var a,r,s,l=S;return n=n||c,o=k||o,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]?(r=l[i],!1):(d.error(p.method,t),!1);l=l[i]}})),e.isFunction(r)?s=r.apply(o,n):void 0!==r&&(s=r),e.isArray(i)?i.push(s):void 0!==i?i=[i,s]:void 0!==s&&(i=s),r}},l?(void 0===S&&d.initialize(),d.invoke(s)):(void 0!==S&&S.invoke("destroy"),d.initialize())}),void 0!==i?i:this},e.fn.accordion.settings={name:"Accordion",namespace:"accordion",silent:!1,debug:!1,verbose:!1,performance:!0,on:"click",observeChanges:!0,exclusive:!0,collapsible:!0,closeNested:!1,animateChildren:!0,duration:350,easing:"easeOutQuad",onOpening:function(){},onOpen:function(){},onClosing:function(){},onClose:function(){},onChange:function(){},error:{method:"The method you called is not defined"},className:{active:"active",animating:"animating"},selector:{accordion:".accordion",title:".title",trigger:".title",content:".content"}},e.extend(e.easing,{easeOutQuad:function(e,t,n,i,o){return-i*(t/=o)*(t-2)+n}})}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.checkbox=function(i){var o,a=e(this),r=a.selector||"",s=(new Date).getTime(),l=[],c=arguments[0],u="string"==typeof c,d=[].slice.call(arguments,1);return a.each(function(){var a,f,m=e.extend(!0,{},e.fn.checkbox.settings,i),g=m.className,v=m.namespace,p=m.selector,h=m.error,b="."+v,y="module-"+v,x=e(this),C=e(this).children(p.label),w=e(this).children(p.input),k=w[0],S=!1,T=!1,A=x.data(y),R=this;f={initialize:function(){f.verbose("Initializing checkbox",m),f.create.label(),f.bind.events(),f.set.tabbable(),f.hide.input(),f.observeChanges(),f.instantiate(),f.setup()},instantiate:function(){f.verbose("Storing instance of module",f),A=f,x.data(y,f)},destroy:function(){f.verbose("Destroying module"),f.unbind.events(),f.show.input(),x.removeData(y)},fix:{reference:function(){x.is(p.input)&&(f.debug("Behavior called on <input> adjusting invoked element"),x=x.closest(p.checkbox),f.refresh())}},setup:function(){f.set.initialLoad(),f.is.indeterminate()?(f.debug("Initial value is indeterminate"),f.indeterminate()):f.is.checked()?(f.debug("Initial value is checked"),f.check()):(f.debug("Initial value is unchecked"),f.uncheck()),f.remove.initialLoad()},refresh:function(){C=x.children(p.label),w=x.children(p.input),k=w[0]},hide:{input:function(){f.verbose("Modifying <input> z-index to be unselectable"),w.addClass(g.hidden)}},show:{input:function(){f.verbose("Modifying <input> z-index to be selectable"),w.removeClass(g.hidden)}},observeChanges:function(){"MutationObserver"in t&&((a=new MutationObserver(function(e){f.debug("DOM tree modified, updating selector cache"),f.refresh()})).observe(R,{childList:!0,subtree:!0}),f.debug("Setting up mutation observer",a))},attachEvents:function(t,n){var i=e(t);n=e.isFunction(f[n])?f[n]:f.toggle,i.length>0?(f.debug("Attaching checkbox events to element",t,n),i.on("click"+b,n)):f.error(h.notFound)},event:{click:function(t){var n=e(t.target);n.is(p.input)?f.verbose("Using default check action on initialized checkbox"):n.is(p.link)?f.debug("Clicking link inside checkbox, skipping toggle"):(f.toggle(),w.focus(),t.preventDefault())},keydown:function(e){var t=e.which,n={enter:13,space:32,escape:27};t==n.escape?(f.verbose("Escape key pressed blurring field"),w.blur(),T=!0):e.ctrlKey||t!=n.space&&t!=n.enter?T=!1:(f.verbose("Enter/space key pressed, toggling checkbox"),f.toggle(),T=!0)},keyup:function(e){T&&e.preventDefault()}},check:function(){f.should.allowCheck()&&(f.debug("Checking checkbox",w),f.set.checked(),f.should.ignoreCallbacks()||(m.onChecked.call(k),m.onChange.call(k)))},uncheck:function(){f.should.allowUncheck()&&(f.debug("Unchecking checkbox"),f.set.unchecked(),f.should.ignoreCallbacks()||(m.onUnchecked.call(k),m.onChange.call(k)))},indeterminate:function(){f.should.allowIndeterminate()?f.debug("Checkbox is already indeterminate"):(f.debug("Making checkbox indeterminate"),f.set.indeterminate(),f.should.ignoreCallbacks()||(m.onIndeterminate.call(k),m.onChange.call(k)))},determinate:function(){f.should.allowDeterminate()?f.debug("Checkbox is already determinate"):(f.debug("Making checkbox determinate"),f.set.determinate(),f.should.ignoreCallbacks()||(m.onDeterminate.call(k),m.onChange.call(k)))},enable:function(){f.is.enabled()?f.debug("Checkbox is already enabled"):(f.debug("Enabling checkbox"),f.set.enabled(),m.onEnable.call(k),m.onEnabled.call(k))},disable:function(){f.is.disabled()?f.debug("Checkbox is already disabled"):(f.debug("Disabling checkbox"),f.set.disabled(),m.onDisable.call(k),m.onDisabled.call(k))},get:{radios:function(){var t=f.get.name();return e('input[name="'+t+'"]').closest(p.checkbox)},otherRadios:function(){return f.get.radios().not(x)},name:function(){return w.attr("name")}},is:{initialLoad:function(){return S},radio:function(){return w.hasClass(g.radio)||"radio"==w.attr("type")},indeterminate:function(){return void 0!==w.prop("indeterminate")&&w.prop("indeterminate")},checked:function(){return void 0!==w.prop("checked")&&w.prop("checked")},disabled:function(){return void 0!==w.prop("disabled")&&w.prop("disabled")},enabled:function(){return!f.is.disabled()},determinate:function(){return!f.is.indeterminate()},unchecked:function(){return!f.is.checked()}},should:{allowCheck:function(){return f.is.determinate()&&f.is.checked()&&!f.should.forceCallbacks()?(f.debug("Should not allow check, checkbox is already checked"),!1):!1!==m.beforeChecked.apply(k)||(f.debug("Should not allow check, beforeChecked cancelled"),!1)},allowUncheck:function(){return f.is.determinate()&&f.is.unchecked()&&!f.should.forceCallbacks()?(f.debug("Should not allow uncheck, checkbox is already unchecked"),!1):!1!==m.beforeUnchecked.apply(k)||(f.debug("Should not allow uncheck, beforeUnchecked cancelled"),!1)},allowIndeterminate:function(){return f.is.indeterminate()&&!f.should.forceCallbacks()?(f.debug("Should not allow indeterminate, checkbox is already indeterminate"),!1):!1!==m.beforeIndeterminate.apply(k)||(f.debug("Should not allow indeterminate, beforeIndeterminate cancelled"),!1)},allowDeterminate:function(){return f.is.determinate()&&!f.should.forceCallbacks()?(f.debug("Should not allow determinate, checkbox is already determinate"),!1):!1!==m.beforeDeterminate.apply(k)||(f.debug("Should not allow determinate, beforeDeterminate cancelled"),!1)},forceCallbacks:function(){return f.is.initialLoad()&&m.fireOnInit},ignoreCallbacks:function(){return S&&!m.fireOnInit}},can:{change:function(){return!(x.hasClass(g.disabled)||x.hasClass(g.readOnly)||w.prop("disabled")||w.prop("readonly"))},uncheck:function(){return"boolean"==typeof m.uncheckable?m.uncheckable:!f.is.radio()}},set:{initialLoad:function(){S=!0},checked:function(){f.verbose("Setting class to checked"),x.removeClass(g.indeterminate).addClass(g.checked),f.is.radio()&&f.uncheckOthers(),f.is.indeterminate()||!f.is.checked()?(f.verbose("Setting state to checked",k),w.prop("indeterminate",!1).prop("checked",!0),f.trigger.change()):f.debug("Input is already checked, skipping input property change")},unchecked:function(){f.verbose("Removing checked class"),x.removeClass(g.indeterminate).removeClass(g.checked),f.is.indeterminate()||!f.is.unchecked()?(f.debug("Setting state to unchecked"),w.prop("indeterminate",!1).prop("checked",!1),f.trigger.change()):f.debug("Input is already unchecked")},indeterminate:function(){f.verbose("Setting class to indeterminate"),x.addClass(g.indeterminate),f.is.indeterminate()?f.debug("Input is already indeterminate, skipping input property change"):(f.debug("Setting state to indeterminate"),w.prop("indeterminate",!0),f.trigger.change())},determinate:function(){f.verbose("Removing indeterminate class"),x.removeClass(g.indeterminate),f.is.determinate()?f.debug("Input is already determinate, skipping input property change"):(f.debug("Setting state to determinate"),w.prop("indeterminate",!1))},disabled:function(){f.verbose("Setting class to disabled"),x.addClass(g.disabled),f.is.disabled()?f.debug("Input is already disabled, skipping input property change"):(f.debug("Setting state to disabled"),w.prop("disabled","disabled"),f.trigger.change())},enabled:function(){f.verbose("Removing disabled class"),x.removeClass(g.disabled),f.is.enabled()?f.debug("Input is already enabled, skipping input property change"):(f.debug("Setting state to enabled"),w.prop("disabled",!1),f.trigger.change())},tabbable:function(){f.verbose("Adding tabindex to checkbox"),void 0===w.attr("tabindex")&&w.attr("tabindex",0)}},remove:{initialLoad:function(){S=!1}},trigger:{change:function(){var e=n.createEvent("HTMLEvents"),t=w[0];t&&(f.verbose("Triggering native change event"),e.initEvent("change",!0,!1),t.dispatchEvent(e))}},create:{label:function(){w.prevAll(p.label).length>0?(w.prev(p.label).detach().insertAfter(w),f.debug("Moving existing label",C)):f.has.label()||(C=e("<label>").insertAfter(w),f.debug("Creating label",C))}},has:{label:function(){return C.length>0}},bind:{events:function(){f.verbose("Attaching checkbox events"),x.on("click"+b,f.event.click).on("keydown"+b,p.input,f.event.keydown).on("keyup"+b,p.input,f.event.keyup)}},unbind:{events:function(){f.debug("Removing events"),x.off(b)}},uncheckOthers:function(){var e=f.get.otherRadios();f.debug("Unchecking other radios",e),e.removeClass(g.checked)},toggle:function(){f.can.change()?f.is.indeterminate()||f.is.unchecked()?(f.debug("Currently unchecked"),f.check()):f.is.checked()&&f.can.uncheck()&&(f.debug("Currently checked"),f.uncheck()):f.is.radio()||f.debug("Checkbox is read-only or disabled, ignoring toggle")},setting:function(t,n){if(f.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,m,t);else{if(void 0===n)return m[t];e.isPlainObject(m[t])?e.extend(!0,m[t],n):m[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,f,t);else{if(void 0===n)return f[t];f[t]=n}},debug:function(){!m.silent&&m.debug&&(m.performance?f.performance.log(arguments):(f.debug=Function.prototype.bind.call(console.info,console,m.name+":"),f.debug.apply(console,arguments)))},verbose:function(){!m.silent&&m.verbose&&m.debug&&(m.performance?f.performance.log(arguments):(f.verbose=Function.prototype.bind.call(console.info,console,m.name+":"),f.verbose.apply(console,arguments)))},error:function(){m.silent||(f.error=Function.prototype.bind.call(console.error,console,m.name+":"),f.error.apply(console,arguments))},performance:{log:function(e){var t,n;m.performance&&(n=(t=(new Date).getTime())-(s||t),s=t,l.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:R,"Execution Time":n})),clearTimeout(f.performance.timer),f.performance.timer=setTimeout(f.performance.display,500)},display:function(){var t=m.name+":",n=0;s=!1,clearTimeout(f.performance.timer),e.each(l,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",r&&(t+=" '"+r+"'"),(void 0!==console.group||void 0!==console.table)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,n,i){var a,r,s,l=A;return n=n||d,i=R||i,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]?(r=l[i],!1):(f.error(h.method,t),!1);l=l[i]}})),e.isFunction(r)?s=r.apply(i,n):void 0!==r&&(s=r),e.isArray(o)?o.push(s):void 0!==o?o=[o,s]:void 0!==s&&(o=s),r}},u?(void 0===A&&f.initialize(),f.invoke(c)):(void 0!==A&&A.invoke("destroy"),f.initialize())}),void 0!==o?o:this},e.fn.checkbox.settings={name:"Checkbox",namespace:"checkbox",silent:!1,debug:!1,verbose:!0,performance:!0,uncheckable:"auto",fireOnInit:!1,onChange:function(){},beforeChecked:function(){},beforeUnchecked:function(){},beforeDeterminate:function(){},beforeIndeterminate:function(){},onChecked:function(){},onUnchecked:function(){},onDeterminate:function(){},onIndeterminate:function(){},onEnable:function(){},onDisable:function(){},onEnabled:function(){},onDisabled:function(){},className:{checked:"checked",indeterminate:"indeterminate",disabled:"disabled",hidden:"hidden",radio:"radio",readOnly:"read-only"},error:{method:"The method you called is not defined"},selector:{checkbox:".ui.checkbox",label:"label, .box",input:'input[type="checkbox"], input[type="radio"]',link:"a[href]"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.dimmer=function(t){var i,o=e(this),a=(new Date).getTime(),r=[],s=arguments[0],l="string"==typeof s,c=[].slice.call(arguments,1);return o.each(function(){var u,d,f,m=e.isPlainObject(t)?e.extend(!0,{},e.fn.dimmer.settings,t):e.extend({},e.fn.dimmer.settings),g=m.selector,v=m.namespace,p=m.className,h=m.error,b="."+v,y="module-"+v,x=o.selector||"",C="ontouchstart"in n.documentElement?"touchstart":"click",w=e(this),k=this,S=w.data(y);(f={preinitialize:function(){f.is.dimmer()?(d=w.parent(),u=w):(d=w,u=f.has.dimmer()?m.dimmerName?d.find(g.dimmer).filter("."+m.dimmerName):d.find(g.dimmer):f.create(),f.set.variation())},initialize:function(){f.debug("Initializing dimmer",m),f.bind.events(),f.set.dimmable(),f.instantiate()},instantiate:function(){f.verbose("Storing instance of module",f),S=f,w.data(y,S)},destroy:function(){f.verbose("Destroying previous module",u),f.unbind.events(),f.remove.variation(),d.off(b)},bind:{events:function(){"hover"==m.on?d.on("mouseenter"+b,f.show).on("mouseleave"+b,f.hide):"click"==m.on&&d.on(C+b,f.toggle),f.is.page()&&(f.debug("Setting as a page dimmer",d),f.set.pageDimmer()),f.is.closable()&&(f.verbose("Adding dimmer close event",u),d.on(C+b,g.dimmer,f.event.click))}},unbind:{events:function(){w.removeData(y),d.off(b)}},event:{click:function(t){f.verbose("Determining if event occured on dimmer",t),(0===u.find(t.target).length||e(t.target).is(g.content))&&(f.hide(),t.stopImmediatePropagation())}},addContent:function(t){var n=e(t);f.debug("Add content to dimmer",n),n.parent()[0]!==u[0]&&n.detach().appendTo(u)},create:function(){var t=e(m.template.dimmer());return m.dimmerName&&(f.debug("Creating named dimmer",m.dimmerName),t.addClass(m.dimmerName)),t.appendTo(d),t},show:function(t){t=e.isFunction(t)?t:function(){},f.debug("Showing dimmer",u,m),f.is.dimmed()&&!f.is.animating()||!f.is.enabled()?f.debug("Dimmer is already shown or disabled"):(f.animate.show(t),m.onShow.call(k),m.onChange.call(k))},hide:function(t){t=e.isFunction(t)?t:function(){},f.is.dimmed()||f.is.animating()?(f.debug("Hiding dimmer",u),f.animate.hide(t),m.onHide.call(k),m.onChange.call(k)):f.debug("Dimmer is not visible")},toggle:function(){f.verbose("Toggling dimmer visibility",u),f.is.dimmed()?f.hide():f.show()},animate:{show:function(t){t=e.isFunction(t)?t:function(){},m.useCSS&&void 0!==e.fn.transition&&u.transition("is supported")?("auto"!==m.opacity&&f.set.opacity(),u.transition({animation:m.transition+" in",queue:!1,duration:f.get.duration(),useFailSafe:!0,onStart:function(){f.set.dimmed()},onComplete:function(){f.set.active(),t()}})):(f.verbose("Showing dimmer animation with javascript"),f.set.dimmed(),"auto"==m.opacity&&(m.opacity=.8),u.stop().css({opacity:0,width:"100%",height:"100%"}).fadeTo(f.get.duration(),m.opacity,function(){u.removeAttr("style"),f.set.active(),t()}))},hide:function(t){t=e.isFunction(t)?t:function(){},m.useCSS&&void 0!==e.fn.transition&&u.transition("is supported")?(f.verbose("Hiding dimmer with css"),u.transition({animation:m.transition+" out",queue:!1,duration:f.get.duration(),useFailSafe:!0,onStart:function(){f.remove.dimmed()},onComplete:function(){f.remove.active(),t()}})):(f.verbose("Hiding dimmer with javascript"),f.remove.dimmed(),u.stop().fadeOut(f.get.duration(),function(){f.remove.active(),u.removeAttr("style"),t()}))}},get:{dimmer:function(){return u},duration:function(){return"object"==typeof m.duration?f.is.active()?m.duration.hide:m.duration.show:m.duration}},has:{dimmer:function(){return m.dimmerName?w.find(g.dimmer).filter("."+m.dimmerName).length>0:w.find(g.dimmer).length>0}},is:{active:function(){return u.hasClass(p.active)},animating:function(){return u.is(":animated")||u.hasClass(p.animating)},closable:function(){return"auto"==m.closable?"hover"!=m.on:m.closable},dimmer:function(){return w.hasClass(p.dimmer)},dimmable:function(){return w.hasClass(p.dimmable)},dimmed:function(){return d.hasClass(p.dimmed)},disabled:function(){return d.hasClass(p.disabled)},enabled:function(){return!f.is.disabled()},page:function(){return d.is("body")},pageDimmer:function(){return u.hasClass(p.pageDimmer)}},can:{show:function(){return!u.hasClass(p.disabled)}},set:{opacity:function(e){var t=u.css("background-color"),n=t.split(","),i=n&&3==n.length,o=n&&4==n.length;e=0===m.opacity?0:m.opacity||e,i||o?(n[3]=e+")",t=n.join(",")):t="rgba(0, 0, 0, "+e+")",f.debug("Setting opacity to",e),u.css("background-color",t)},active:function(){u.addClass(p.active)},dimmable:function(){d.addClass(p.dimmable)},dimmed:function(){d.addClass(p.dimmed)},pageDimmer:function(){u.addClass(p.pageDimmer)},disabled:function(){u.addClass(p.disabled)},variation:function(e){(e=e||m.variation)&&u.addClass(e)}},remove:{active:function(){u.removeClass(p.active)},dimmed:function(){d.removeClass(p.dimmed)},disabled:function(){u.removeClass(p.disabled)},variation:function(e){(e=e||m.variation)&&u.removeClass(e)}},setting:function(t,n){if(f.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,m,t);else{if(void 0===n)return m[t];e.isPlainObject(m[t])?e.extend(!0,m[t],n):m[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,f,t);else{if(void 0===n)return f[t];f[t]=n}},debug:function(){!m.silent&&m.debug&&(m.performance?f.performance.log(arguments):(f.debug=Function.prototype.bind.call(console.info,console,m.name+":"),f.debug.apply(console,arguments)))},verbose:function(){!m.silent&&m.verbose&&m.debug&&(m.performance?f.performance.log(arguments):(f.verbose=Function.prototype.bind.call(console.info,console,m.name+":"),f.verbose.apply(console,arguments)))},error:function(){m.silent||(f.error=Function.prototype.bind.call(console.error,console,m.name+":"),f.error.apply(console,arguments))},performance:{log:function(e){var t,n;m.performance&&(n=(t=(new Date).getTime())-(a||t),a=t,r.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:k,"Execution Time":n})),clearTimeout(f.performance.timer),f.performance.timer=setTimeout(f.performance.display,500)},display:function(){var t=m.name+":",n=0;a=!1,clearTimeout(f.performance.timer),e.each(r,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",x&&(t+=" '"+x+"'"),o.length>1&&(t+=" ("+o.length+")"),(void 0!==console.group||void 0!==console.table)&&r.length>0&&(console.groupCollapsed(t),console.table?console.table(r):e.each(r,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),r=[]}},invoke:function(t,n,o){var a,r,s,l=S;return n=n||c,o=k||o,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]?(r=l[i],!1):(f.error(h.method,t),!1);l=l[i]}})),e.isFunction(r)?s=r.apply(o,n):void 0!==r&&(s=r),e.isArray(i)?i.push(s):void 0!==i?i=[i,s]:void 0!==s&&(i=s),r}}).preinitialize(),l?(void 0===S&&f.initialize(),f.invoke(s)):(void 0!==S&&S.invoke("destroy"),f.initialize())}),void 0!==i?i:this},e.fn.dimmer.settings={name:"Dimmer",namespace:"dimmer",silent:!1,debug:!1,verbose:!1,performance:!0,dimmerName:!1,variation:!1,closable:"auto",useCSS:!0,transition:"fade",on:!1,opacity:"auto",duration:{show:500,hide:500},onChange:function(){},onShow:function(){},onHide:function(){},error:{method:"The method you called is not defined."},className:{active:"active",animating:"animating",dimmable:"dimmable",dimmed:"dimmed",dimmer:"dimmer",disabled:"disabled",hide:"hide",pageDimmer:"page",show:"show"},selector:{dimmer:"> .ui.dimmer",content:".ui.dimmer > .content, .ui.dimmer > .content > .center"},template:{dimmer:function(){return e("<div />").attr("class","ui dimmer")}}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.dropdown=function(i){var o,a=e(this),r=e(n),s=a.selector||"",l="ontouchstart"in n.documentElement,c=(new Date).getTime(),u=[],d=arguments[0],f="string"==typeof d,m=[].slice.call(arguments,1);return a.each(function(g){var v,p,h,b,y,x,C,w,k=e.isPlainObject(i)?e.extend(!0,{},e.fn.dropdown.settings,i):e.extend({},e.fn.dropdown.settings),S=k.className,T=k.message,A=k.fields,R=k.keys,P=k.metadata,E=k.namespace,F=k.regExp,O=k.selector,D=k.error,q=k.templates,j="."+E,z="module-"+E,I=e(this),M=e(k.context),L=I.find(O.text),V=I.find(O.search),N=I.find(O.sizer),H=I.find(O.input),U=I.find(O.icon),W=I.prev().find(O.text).length>0?I.prev().find(O.text):I.prev(),B=I.children(O.menu),Q=B.find(O.item),X=!1,$=!1,Y=!1,Z=this,K=I.data(z);w={initialize:function(){w.debug("Initializing dropdown",k),w.is.alreadySetup()?w.setup.reference():(w.setup.layout(),k.values&&w.change.values(k.values),w.refreshData(),w.save.defaults(),w.restore.selected(),w.create.id(),w.bind.events(),w.observeChanges(),w.instantiate())},instantiate:function(){w.verbose("Storing instance of dropdown",w),K=w,I.data(z,w)},destroy:function(){w.verbose("Destroying previous dropdown",I),w.remove.tabbable(),I.off(j).removeData(z),B.off(j),r.off(b),w.disconnect.menuObserver(),w.disconnect.selectObserver()},observeChanges:function(){"MutationObserver"in t&&(x=new MutationObserver(w.event.select.mutation),C=new MutationObserver(w.event.menu.mutation),w.debug("Setting up mutation observer",x,C),w.observe.select(),w.observe.menu())},disconnect:{menuObserver:function(){C&&C.disconnect()},selectObserver:function(){x&&x.disconnect()}},observe:{select:function(){w.has.input()&&x.observe(I[0],{childList:!0,subtree:!0})},menu:function(){w.has.menu()&&C.observe(B[0],{childList:!0,subtree:!0})}},create:{id:function(){y=(Math.random().toString(16)+"000000000").substr(2,8),b="."+y,w.verbose("Creating unique id for element",y)},userChoice:function(t){var n,i,o;return!!(t=t||w.get.userValues())&&(t=e.isArray(t)?t:[t],e.each(t,function(t,a){!1===w.get.item(a)&&(o=k.templates.addition(w.add.variables(T.addResult,a)),i=e("<div />").html(o).attr("data-"+P.value,a).attr("data-"+P.text,a).addClass(S.addition).addClass(S.item),k.hideAdditions&&i.addClass(S.hidden),n=void 0===n?i:n.add(i),w.verbose("Creating user choices for value",a,i))}),n)},userLabels:function(t){var n=w.get.userValues();n&&(w.debug("Adding user labels",n),e.each(n,function(e,t){w.verbose("Adding custom user value"),w.add.label(t,t)}))},menu:function(){B=e("<div />").addClass(S.menu).appendTo(I)},sizer:function(){N=e("<span />").addClass(S.sizer).insertAfter(V)}},search:function(e){e=void 0!==e?e:w.get.query(),w.verbose("Searching for query",e),w.has.minCharacters(e)?w.filter(e):w.hide()},select:{firstUnfiltered:function(){w.verbose("Selecting first non-filtered element"),w.remove.selectedItem(),Q.not(O.unselectable).not(O.addition+O.hidden).eq(0).addClass(S.selected)},nextAvailable:function(e){var t=(e=e.eq(0)).nextAll(O.item).not(O.unselectable).eq(0),n=e.prevAll(O.item).not(O.unselectable).eq(0);t.length>0?(w.verbose("Moving selection to",t),t.addClass(S.selected)):(w.verbose("Moving selection to",n),n.addClass(S.selected))}},setup:{api:function(){var e={debug:k.debug,urlData:{value:w.get.value(),query:w.get.query()},on:!1};w.verbose("First request, initializing API"),I.api(e)},layout:function(){I.is("select")&&(w.setup.select(),w.setup.returnedObject()),w.has.menu()||w.create.menu(),w.is.search()&&!w.has.search()&&(w.verbose("Adding search input"),V=e("<input />").addClass(S.search).prop("autocomplete","off").insertBefore(L)),w.is.multiple()&&w.is.searchSelection()&&!w.has.sizer()&&w.create.sizer(),k.allowTab&&w.set.tabbable()},select:function(){var t=w.get.selectValues();w.debug("Dropdown initialized on a select",t),I.is("select")&&(H=I),H.parent(O.dropdown).length>0?(w.debug("UI dropdown already exists. Creating dropdown menu only"),I=H.closest(O.dropdown),w.has.menu()||w.create.menu(),B=I.children(O.menu),w.setup.menu(t)):(w.debug("Creating entire dropdown from select"),I=e("<div />").attr("class",H.attr("class")).addClass(S.selection).addClass(S.dropdown).html(q.dropdown(t)).insertBefore(H),H.hasClass(S.multiple)&&!1===H.prop("multiple")&&(w.error(D.missingMultiple),H.prop("multiple",!0)),H.is("[multiple]")&&w.set.multiple(),H.prop("disabled")&&(w.debug("Disabling dropdown"),I.addClass(S.disabled)),H.removeAttr("class").detach().prependTo(I)),w.refresh()},menu:function(e){B.html(q.menu(e,A)),Q=B.find(O.item)},reference:function(){w.debug("Dropdown behavior was called on select, replacing with closest dropdown"),I=I.parent(O.dropdown),K=I.data(z),Z=I.get(0),w.refresh(),w.setup.returnedObject()},returnedObject:function(){var e=a.slice(0,g),t=a.slice(g+1);a=e.add(I).add(t)}},refresh:function(){w.refreshSelectors(),w.refreshData()},refreshItems:function(){Q=B.find(O.item)},refreshSelectors:function(){w.verbose("Refreshing selector cache"),L=I.find(O.text),V=I.find(O.search),H=I.find(O.input),U=I.find(O.icon),W=I.prev().find(O.text).length>0?I.prev().find(O.text):I.prev(),B=I.children(O.menu),Q=B.find(O.item)},refreshData:function(){w.verbose("Refreshing cached metadata"),Q.removeData(P.text).removeData(P.value)},clearData:function(){w.verbose("Clearing metadata"),Q.removeData(P.text).removeData(P.value),I.removeData(P.defaultText).removeData(P.defaultValue).removeData(P.placeholderText)},toggle:function(){w.verbose("Toggling menu visibility"),w.is.active()?w.hide():w.show()},show:function(t){if(t=e.isFunction(t)?t:function(){},!w.can.show()&&w.is.remote()&&(w.debug("No API results retrieved, searching before show"),w.queryRemote(w.get.query(),w.show)),w.can.show()&&!w.is.active()){if(w.debug("Showing dropdown"),!w.has.message()||w.has.maxSelections()||w.has.allResultsFiltered()||w.remove.message(),w.is.allFiltered())return!0;!1!==k.onShow.call(Z)&&w.animate.show(function(){w.can.click()&&w.bind.intent(),w.has.menuSearch()&&w.focusSearch(),w.set.visible(),t.call(Z)})}},hide:function(t){t=e.isFunction(t)?t:function(){},w.is.active()&&(w.debug("Hiding dropdown"),!1!==k.onHide.call(Z)&&w.animate.hide(function(){w.remove.visible(),t.call(Z)}))},hideOthers:function(){w.verbose("Finding other dropdowns to hide"),a.not(I).has(O.menu+"."+S.visible).dropdown("hide")},hideMenu:function(){w.verbose("Hiding menu  instantaneously"),w.remove.active(),w.remove.visible(),B.transition("hide")},hideSubMenus:function(){var e=B.children(O.item).find(O.menu);w.verbose("Hiding sub menus",e),e.transition("hide")},bind:{events:function(){l&&w.bind.touchEvents(),w.bind.keyboardEvents(),w.bind.inputEvents(),w.bind.mouseEvents()},touchEvents:function(){w.debug("Touch device detected binding additional touch events"),w.is.searchSelection()||w.is.single()&&I.on("touchstart"+j,w.event.test.toggle),B.on("touchstart"+j,O.item,w.event.item.mouseenter)},keyboardEvents:function(){w.verbose("Binding keyboard events"),I.on("keydown"+j,w.event.keydown),w.has.search()&&I.on(w.get.inputEvent()+j,O.search,w.event.input),w.is.multiple()&&r.on("keydown"+b,w.event.document.keydown)},inputEvents:function(){w.verbose("Binding input change events"),I.on("change"+j,O.input,w.event.change)},mouseEvents:function(){w.verbose("Binding mouse events"),w.is.multiple()&&I.on("click"+j,O.label,w.event.label.click).on("click"+j,O.remove,w.event.remove.click),w.is.searchSelection()?(I.on("mousedown"+j,w.event.mousedown).on("mouseup"+j,w.event.mouseup).on("mousedown"+j,O.menu,w.event.menu.mousedown).on("mouseup"+j,O.menu,w.event.menu.mouseup).on("click"+j,O.icon,w.event.icon.click).on("focus"+j,O.search,w.event.search.focus).on("click"+j,O.search,w.event.search.focus).on("blur"+j,O.search,w.event.search.blur).on("click"+j,O.text,w.event.text.focus),w.is.multiple()&&I.on("click"+j,w.event.click)):("click"==k.on?I.on("click"+j,O.icon,w.event.icon.click).on("click"+j,w.event.test.toggle):"hover"==k.on?I.on("mouseenter"+j,w.delay.show).on("mouseleave"+j,w.delay.hide):I.on(k.on+j,w.toggle),I.on("mousedown"+j,w.event.mousedown).on("mouseup"+j,w.event.mouseup).on("focus"+j,w.event.focus),w.has.menuSearch()?I.on("blur"+j,O.search,w.event.search.blur):I.on("blur"+j,w.event.blur)),B.on("mouseenter"+j,O.item,w.event.item.mouseenter).on("mouseleave"+j,O.item,w.event.item.mouseleave).on("click"+j,O.item,w.event.item.click)},intent:function(){w.verbose("Binding hide intent event to document"),l&&r.on("touchstart"+b,w.event.test.touch).on("touchmove"+b,w.event.test.touch),r.on("click"+b,w.event.test.hide)}},unbind:{intent:function(){w.verbose("Removing hide intent event from document"),l&&r.off("touchstart"+b).off("touchmove"+b),r.off("click"+b)}},filter:function(e){var t=void 0!==e?e:w.get.query(),n=function(){w.is.multiple()&&w.filterActive(),(e||!e&&0==w.get.activeItem().length)&&w.select.firstUnfiltered(),w.has.allResultsFiltered()?k.onNoResults.call(Z,t)?k.allowAdditions?k.hideAdditions&&(w.verbose("User addition with no menu, setting empty style"),w.set.empty(),w.hideMenu()):(w.verbose("All items filtered, showing message",t),w.add.message(T.noResults)):(w.verbose("All items filtered, hiding dropdown",t),w.hideMenu()):(w.remove.empty(),w.remove.message()),k.allowAdditions&&w.add.userSuggestion(e),w.is.searchSelection()&&w.can.show()&&w.is.focusedOnSearch()&&w.show()};k.useLabels&&w.has.maxSelections()||(k.apiSettings?w.can.useAPI()?w.queryRemote(t,function(){k.filterRemoteData&&w.filterItems(t),n()}):w.error(D.noAPI):(w.filterItems(t),n()))},queryRemote:function(t,n){var i={errorDuration:!1,cache:"local",throttle:k.throttle,urlData:{query:t},onError:function(){w.add.message(T.serverError),n()},onFailure:function(){w.add.message(T.serverError),n()},onSuccess:function(e){w.remove.message(),w.setup.menu({values:e[A.remoteValues]}),n()}};I.api("get request")||w.setup.api(),i=e.extend(!0,{},i,k.apiSettings),I.api("setting",i).api("query")},filterItems:function(t){var n=void 0!==t?t:w.get.query(),i=null,o=w.escape.string(n),a=new RegExp("^"+o,"igm");w.has.query()&&(i=[],w.verbose("Searching for matching values",n),Q.each(function(){var t,o,r=e(this);if("both"==k.match||"text"==k.match){if(-1!==(t=String(w.get.choiceText(r,!1))).search(a))return i.push(this),!0;if("exact"===k.fullTextSearch&&w.exactSearch(n,t))return i.push(this),!0;if(!0===k.fullTextSearch&&w.fuzzySearch(n,t))return i.push(this),!0}if("both"==k.match||"value"==k.match){if(-1!==(o=String(w.get.choiceValue(r,t))).search(a))return i.push(this),!0;if("exact"===k.fullTextSearch&&w.exactSearch(n,o))return i.push(this),!0;if(!0===k.fullTextSearch&&w.fuzzySearch(n,o))return i.push(this),!0}})),w.debug("Showing only matched items",n),w.remove.filteredItem(),i&&Q.not(i).addClass(S.filtered)},fuzzySearch:function(e,t){var n=t.length,i=e.length;if(e=e.toLowerCase(),t=t.toLowerCase(),i>n)return!1;if(i===n)return e===t;e:for(var o=0,a=0;o<i;o++){for(var r=e.charCodeAt(o);a<n;)if(t.charCodeAt(a++)===r)continue e;return!1}return!0},exactSearch:function(e,t){return e=e.toLowerCase(),(t=t.toLowerCase()).indexOf(e)>-1},filterActive:function(){k.useLabels&&Q.filter("."+S.active).addClass(S.filtered)},focusSearch:function(e){w.has.search()&&!w.is.focusedOnSearch()&&(e?(I.off("focus"+j,O.search),V.focus(),I.on("focus"+j,O.search,w.event.search.focus)):V.focus())},forceSelection:function(){var e=Q.not(S.filtered).filter("."+S.selected).eq(0),t=Q.not(S.filtered).filter("."+S.active).eq(0),n=e.length>0?e:t;if(n.length>0&&!w.is.multiple())return w.debug("Forcing partial selection to selected item",n),void w.event.item.click.call(n,{},!0);k.allowAdditions?(w.set.selected(w.get.query()),w.remove.searchTerm()):w.remove.searchTerm()},change:{values:function(t){k.allowAdditions||w.clear(),w.debug("Creating dropdown with specified values",t),w.setup.menu({values:t}),e.each(t,function(e,t){if(1==t.selected)return w.debug("Setting initial selection to",t.value),w.set.selected(t.value),!0})}},event:{change:function(){Y||(w.debug("Input changed, updating selection"),w.set.selected())},focus:function(){k.showOnFocus&&!X&&w.is.hidden()&&!p&&w.show()},blur:function(e){p=n.activeElement===this,X||p||(w.remove.activeLabel(),w.hide())},mousedown:function(){w.is.searchSelection()?h=!0:X=!0},mouseup:function(){w.is.searchSelection()?h=!1:X=!1},click:function(t){e(t.target).is(I)&&(w.is.focusedOnSearch()?w.show():w.focusSearch())},search:{focus:function(){X=!0,w.is.multiple()&&w.remove.activeLabel(),k.showOnFocus&&w.search()},blur:function(e){p=n.activeElement===this,w.is.searchSelection()&&!h&&($||p||(k.forceSelection&&w.forceSelection(),w.hide())),h=!1}},icon:{click:function(e){w.toggle()}},text:{focus:function(e){X=!0,w.focusSearch()}},input:function(e){(w.is.multiple()||w.is.searchSelection())&&w.set.filtered(),clearTimeout(w.timer),w.timer=setTimeout(w.search,k.delay.search)},label:{click:function(t){var n=e(this),i=I.find(O.label),o=i.filter("."+S.active),a=n.nextAll("."+S.active),r=n.prevAll("."+S.active),s=a.length>0?n.nextUntil(a).add(o).add(n):n.prevUntil(r).add(o).add(n);t.shiftKey?(o.removeClass(S.active),s.addClass(S.active)):t.ctrlKey?n.toggleClass(S.active):(o.removeClass(S.active),n.addClass(S.active)),k.onLabelSelect.apply(this,i.filter("."+S.active))}},remove:{click:function(){var t=e(this).parent();t.hasClass(S.active)?w.remove.activeLabels():w.remove.activeLabels(t)}},test:{toggle:function(e){var t=w.is.multiple()?w.show:w.toggle;w.is.bubbledLabelClick(e)||w.is.bubbledIconClick(e)||w.determine.eventOnElement(e,t)&&e.preventDefault()},touch:function(e){w.determine.eventOnElement(e,function(){"touchstart"==e.type?w.timer=setTimeout(function(){w.hide()},k.delay.touch):"touchmove"==e.type&&clearTimeout(w.timer)}),e.stopPropagation()},hide:function(e){w.determine.eventInModule(e,w.hide)}},select:{mutation:function(t){w.debug("<select> modified, recreating menu");var n=!1;e.each(t,function(t,i){if(e(i.target).is("select")||e(i.addedNodes).is("select"))return n=!0,!0}),n&&(w.disconnect.selectObserver(),w.refresh(),w.setup.select(),w.set.selected(),w.observe.select())}},menu:{mutation:function(t){var n=t[0],i=e(n.addedNodes?n.addedNodes[0]:!1),o=e(n.removedNodes?n.removedNodes[0]:!1),a=i.add(o),r=a.is(O.addition)||a.closest(O.addition).length>0,s=a.is(O.message)||a.closest(O.message).length>0;r||s?(w.debug("Updating item selector cache"),w.refreshItems()):(w.debug("Menu modified, updating selector cache"),w.refresh())},mousedown:function(){$=!0},mouseup:function(){$=!1}},item:{mouseenter:function(t){var n=e(t.target),i=e(this),o=i.children(O.menu),a=i.siblings(O.item).children(O.menu),r=o.length>0;!(o.find(n).length>0)&&r&&(clearTimeout(w.itemTimer),w.itemTimer=setTimeout(function(){w.verbose("Showing sub-menu",o),e.each(a,function(){w.animate.hide(!1,e(this))}),w.animate.show(!1,o)},k.delay.show),t.preventDefault())},mouseleave:function(t){var n=e(this).children(O.menu);n.length>0&&(clearTimeout(w.itemTimer),w.itemTimer=setTimeout(function(){w.verbose("Hiding sub-menu",n),w.animate.hide(!1,n)},k.delay.hide))},click:function(t,i){var o=e(this),a=e(t?t.target:""),r=o.find(O.menu),s=w.get.choiceText(o),l=w.get.choiceValue(o,s),c=r.length>0,u=r.find(a).length>0;w.has.menuSearch()&&e(n.activeElement).blur(),u||c&&!k.allowCategorySelection||(w.is.searchSelection()&&(k.allowAdditions&&w.remove.userAddition(),w.remove.searchTerm(),w.is.focusedOnSearch()||1==i||w.focusSearch(!0)),k.useLabels||(w.remove.filteredItem(),w.set.scrollPosition(o)),w.determine.selectAction.call(this,s,l))}},document:{keydown:function(e){var t=e.which;if(w.is.inObject(t,R)){var n=I.find(O.label),i=n.filter("."+S.active),o=(i.data(P.value),n.index(i)),a=n.length,r=i.length>0,s=i.length>1,l=0===o,c=o+1==a,u=w.is.searchSelection(),d=w.is.focusedOnSearch(),f=w.is.focused(),m=d&&0===w.get.caretPosition();if(u&&!r&&!d)return;t==R.leftArrow?!f&&!m||r?r&&(e.shiftKey?w.verbose("Adding previous label to selection"):(w.verbose("Selecting previous label"),n.removeClass(S.active)),l&&!s?i.addClass(S.active):i.prev(O.siblingLabel).addClass(S.active).end(),e.preventDefault()):(w.verbose("Selecting previous label"),n.last().addClass(S.active)):t==R.rightArrow?(f&&!r&&n.first().addClass(S.active),r&&(e.shiftKey?w.verbose("Adding next label to selection"):(w.verbose("Selecting next label"),n.removeClass(S.active)),c?u?d?n.removeClass(S.active):w.focusSearch():s?i.next(O.siblingLabel).addClass(S.active):i.addClass(S.active):i.next(O.siblingLabel).addClass(S.active),e.preventDefault())):t==R.deleteKey||t==R.backspace?r?(w.verbose("Removing active labels"),c&&u&&!d&&w.focusSearch(),i.last().next(O.siblingLabel).addClass(S.active),w.remove.activeLabels(i),e.preventDefault()):m&&!r&&t==R.backspace&&(w.verbose("Removing last label on input backspace"),i=n.last().addClass(S.active),w.remove.activeLabels(i)):i.removeClass(S.active)}}},keydown:function(e){var t=e.which;if(w.is.inObject(t,R)){var n,i=Q.not(O.unselectable).filter("."+S.selected).eq(0),o=B.children("."+S.active).eq(0),a=i.length>0?i:o,r=a.length>0?a.siblings(":not(."+S.filtered+")").addBack():B.children(":not(."+S.filtered+")"),s=a.children(O.menu),l=a.closest(O.menu),c=l.hasClass(S.visible)||l.hasClass(S.animating)||l.parent(O.menu).length>0,u=s.length>0,d=a.length>0,f=a.not(O.unselectable).length>0,m=t==R.delimiter&&k.allowAdditions&&w.is.multiple();if(k.allowAdditions&&k.hideAdditions&&(t==R.enter||m)&&f&&(w.verbose("Selecting item from keyboard shortcut",a),w.event.item.click.call(a,e),w.is.searchSelection()&&w.remove.searchTerm()),w.is.visible()){if((t==R.enter||m)&&(t==R.enter&&d&&u&&!k.allowCategorySelection?(w.verbose("Pressed enter on unselectable category, opening sub menu"),t=R.rightArrow):f&&(w.verbose("Selecting item from keyboard shortcut",a),w.event.item.click.call(a,e),w.is.searchSelection()&&w.remove.searchTerm()),e.preventDefault()),d&&(t==R.leftArrow&&l[0]!==B[0]&&(w.verbose("Left key pressed, closing sub-menu"),w.animate.hide(!1,l),a.removeClass(S.selected),l.closest(O.item).addClass(S.selected),e.preventDefault()),t==R.rightArrow&&u&&(w.verbose("Right key pressed, opening sub-menu"),w.animate.show(!1,s),a.removeClass(S.selected),s.find(O.item).eq(0).addClass(S.selected),e.preventDefault())),t==R.upArrow){if(n=d&&c?a.prevAll(O.item+":not("+O.unselectable+")").eq(0):Q.eq(0),r.index(n)<0)return w.verbose("Up key pressed but reached top of current menu"),void e.preventDefault();w.verbose("Up key pressed, changing active item"),a.removeClass(S.selected),n.addClass(S.selected),w.set.scrollPosition(n),k.selectOnKeydown&&w.is.single()&&w.set.selectedItem(n),e.preventDefault()}if(t==R.downArrow){if(0===(n=d&&c?n=a.nextAll(O.item+":not("+O.unselectable+")").eq(0):Q.eq(0)).length)return w.verbose("Down key pressed but reached bottom of current menu"),void e.preventDefault();w.verbose("Down key pressed, changing active item"),Q.removeClass(S.selected),n.addClass(S.selected),w.set.scrollPosition(n),k.selectOnKeydown&&w.is.single()&&w.set.selectedItem(n),e.preventDefault()}t==R.pageUp&&(w.scrollPage("up"),e.preventDefault()),t==R.pageDown&&(w.scrollPage("down"),e.preventDefault()),t==R.escape&&(w.verbose("Escape key pressed, closing dropdown"),w.hide())}else m&&e.preventDefault(),t!=R.downArrow||w.is.visible()||(w.verbose("Down key pressed, showing dropdown"),w.show(),e.preventDefault())}else w.has.search()||w.set.selectedLetter(String.fromCharCode(t))}},trigger:{change:function(){var e=n.createEvent("HTMLEvents"),t=H[0];t&&(w.verbose("Triggering native change event"),e.initEvent("change",!0,!1),t.dispatchEvent(e))}},determine:{selectAction:function(t,n){w.verbose("Determining action",k.action),e.isFunction(w.action[k.action])?(w.verbose("Triggering preset action",k.action,t,n),w.action[k.action].call(Z,t,n,this)):e.isFunction(k.action)?(w.verbose("Triggering user action",k.action,t,n),k.action.call(Z,t,n,this)):w.error(D.action,k.action)},eventInModule:function(t,i){var o=e(t.target),a=o.closest(n.documentElement).length>0,r=o.closest(I).length>0;return i=e.isFunction(i)?i:function(){},a&&!r?(w.verbose("Triggering event",i),i(),!0):(w.verbose("Event occurred in dropdown, canceling callback"),!1)},eventOnElement:function(t,i){var o=e(t.target),a=o.closest(O.siblingLabel),r=n.body.contains(t.target),s=0===I.find(a).length,l=0===o.closest(B).length;return i=e.isFunction(i)?i:function(){},r&&s&&l?(w.verbose("Triggering event",i),i(),!0):(w.verbose("Event occurred in dropdown menu, canceling callback"),!1)}},action:{nothing:function(){},activate:function(t,n,i){if(n=void 0!==n?n:t,w.can.activate(e(i))){if(w.set.selected(n,e(i)),w.is.multiple()&&!w.is.allFiltered())return;w.hideAndClear()}},select:function(t,n,i){if(n=void 0!==n?n:t,w.can.activate(e(i))){if(w.set.value(n,e(i)),w.is.multiple()&&!w.is.allFiltered())return;w.hideAndClear()}},combo:function(t,n,i){n=void 0!==n?n:t,w.set.selected(n,e(i)),w.hideAndClear()},hide:function(e,t,n){w.set.value(t,e),w.hideAndClear()}},get:{id:function(){return y},defaultText:function(){return I.data(P.defaultText)},defaultValue:function(){return I.data(P.defaultValue)},placeholderText:function(){return"auto"!=k.placeholder&&"string"==typeof k.placeholder?k.placeholder:I.data(P.placeholderText)||""},text:function(){return L.text()},query:function(){return e.trim(V.val())},searchWidth:function(e){return e=void 0!==e?e:V.val(),N.text(e),Math.ceil(N.width()+1)},selectionCount:function(){var t=w.get.values();return w.is.multiple()?e.isArray(t)?t.length:0:""!==w.get.value()?1:0},transition:function(e){return"auto"==k.transition?w.is.upward(e)?"slide up":"slide down":k.transition},userValues:function(){var t=w.get.values();return!!t&&(t=e.isArray(t)?t:[t],e.grep(t,function(e){return!1===w.get.item(e)}))},uniqueArray:function(t){return e.grep(t,function(n,i){return e.inArray(n,t)===i})},caretPosition:function(){var e,t,i=V.get(0);return"selectionStart"in i?i.selectionStart:n.selection?(i.focus(),e=n.selection.createRange(),t=e.text.length,e.moveStart("character",-i.value.length),e.text.length-t):void 0},value:function(){var t=H.length>0?H.val():I.data(P.value),n=e.isArray(t)&&1===t.length&&""===t[0];return void 0===t||n?"":t},values:function(){var e=w.get.value();return""===e?"":!w.has.selectInput()&&w.is.multiple()?"string"==typeof e?e.split(k.delimiter):"":e},remoteValues:function(){var t=w.get.values(),n=!1;return t&&("string"==typeof t&&(t=[t]),e.each(t,function(e,t){var i=w.read.remoteData(t);w.verbose("Restoring value from session data",i,t),i&&(n||(n={}),n[t]=i)})),n},choiceText:function(t,n){if(n=void 0!==n?n:k.preserveHTML,t)return t.find(O.menu).length>0&&(w.verbose("Retrieving text of element with sub-menu"),(t=t.clone()).find(O.menu).remove(),t.find(O.menuIcon).remove()),void 0!==t.data(P.text)?t.data(P.text):n?e.trim(t.html()):e.trim(t.text())},choiceValue:function(t,n){return n=n||w.get.choiceText(t),!!t&&(void 0!==t.data(P.value)?String(t.data(P.value)):"string"==typeof n?e.trim(n.toLowerCase()):String(n))},inputEvent:function(){var e=V[0];return!!e&&(void 0!==e.oninput?"input":void 0!==e.onpropertychange?"propertychange":"keyup")},selectValues:function(){var t={};return t.values=[],I.find("option").each(function(){var n=e(this),i=n.html(),o=n.attr("disabled"),a=void 0!==n.attr("value")?n.attr("value"):i;"auto"===k.placeholder&&""===a?t.placeholder=i:t.values.push({name:i,value:a,disabled:o})}),k.placeholder&&"auto"!==k.placeholder&&(w.debug("Setting placeholder value to",k.placeholder),t.placeholder=k.placeholder),k.sortSelect?(t.values.sort(function(e,t){return e.name>t.name?1:-1}),w.debug("Retrieved and sorted values from select",t)):w.debug("Retrieved values from select",t),t},activeItem:function(){return Q.filter("."+S.active)},selectedItem:function(){var e=Q.not(O.unselectable).filter("."+S.selected);return e.length>0?e:Q.eq(0)},itemWithAdditions:function(e){var t=w.get.item(e),n=w.create.userChoice(e);return n&&n.length>0&&(t=t.length>0?t.add(n):n),t},item:function(t,n){var i,o,a=!1;return t=void 0!==t?t:void 0!==w.get.values()?w.get.values():w.get.text(),i=o?t.length>0:void 0!==t&&null!==t,o=w.is.multiple()&&e.isArray(t),n=""===t||0===t||(n||!1),i&&Q.each(function(){var i=e(this),r=w.get.choiceText(i),s=w.get.choiceValue(i,r);if(null!==s&&void 0!==s)if(o)-1===e.inArray(String(s),t)&&-1===e.inArray(r,t)||(a=a?a.add(i):i);else if(n){if(w.verbose("Ambiguous dropdown value using strict type check",i,t),s===t||r===t)return a=i,!0}else if(String(s)==String(t)||r==t)return w.verbose("Found select item by value",s,t),a=i,!0}),a}},check:{maxSelections:function(e){return!k.maxSelections||((e=void 0!==e?e:w.get.selectionCount())>=k.maxSelections?(w.debug("Maximum selection count reached"),k.useLabels&&(Q.addClass(S.filtered),w.add.message(T.maxSelections)),!0):(w.verbose("No longer at maximum selection count"),w.remove.message(),w.remove.filteredItem(),w.is.searchSelection()&&w.filterItems(),!1))}},restore:{defaults:function(){w.clear(),w.restore.defaultText(),w.restore.defaultValue()},defaultText:function(){var e=w.get.defaultText();e===w.get.placeholderText?(w.debug("Restoring default placeholder text",e),w.set.placeholderText(e)):(w.debug("Restoring default text",e),w.set.text(e))},placeholderText:function(){w.set.placeholderText()},defaultValue:function(){var e=w.get.defaultValue();void 0!==e&&(w.debug("Restoring default value",e),""!==e?(w.set.value(e),w.set.selected()):(w.remove.activeItem(),w.remove.selectedItem()))},labels:function(){k.allowAdditions&&(k.useLabels||(w.error(D.labels),k.useLabels=!0),w.debug("Restoring selected values"),w.create.userLabels()),w.check.maxSelections()},selected:function(){w.restore.values(),w.is.multiple()?(w.debug("Restoring previously selected values and labels"),w.restore.labels()):w.debug("Restoring previously selected values")},values:function(){w.set.initialLoad(),k.apiSettings&&k.saveRemoteData&&w.get.remoteValues()?w.restore.remoteValues():w.set.selected(),w.remove.initialLoad()},remoteValues:function(){var t=w.get.remoteValues();w.debug("Recreating selected from session data",t),t&&(w.is.single()?e.each(t,function(e,t){w.set.text(t)}):e.each(t,function(e,t){w.add.label(e,t)}))}},read:{remoteData:function(e){var n;{if(void 0!==t.Storage)return void 0!==(n=sessionStorage.getItem(e))&&n;w.error(D.noStorage)}}},save:{defaults:function(){w.save.defaultText(),w.save.placeholderText(),w.save.defaultValue()},defaultValue:function(){var e=w.get.value();w.verbose("Saving default value as",e),I.data(P.defaultValue,e)},defaultText:function(){var e=w.get.text();w.verbose("Saving default text as",e),I.data(P.defaultText,e)},placeholderText:function(){var e;!1!==k.placeholder&&L.hasClass(S.placeholder)&&(e=w.get.text(),w.verbose("Saving placeholder text as",e),I.data(P.placeholderText,e))},remoteData:function(e,n){void 0!==t.Storage?(w.verbose("Saving remote data to session storage",n,e),sessionStorage.setItem(n,e)):w.error(D.noStorage)}},clear:function(){w.is.multiple()&&k.useLabels?w.remove.labels():(w.remove.activeItem(),w.remove.selectedItem()),w.set.placeholderText(),w.clearValue()},clearValue:function(){w.set.value("")},scrollPage:function(e,t){var n,i,o=t||w.get.selectedItem(),a=o.closest(O.menu),r=a.outerHeight(),s=a.scrollTop(),l=Q.eq(0).outerHeight(),c=Math.floor(r/l),u=(a.prop("scrollHeight"),"up"==e?s-l*c:s+l*c),d=Q.not(O.unselectable);i="up"==e?d.index(o)-c:d.index(o)+c,(n=("up"==e?i>=0:i<d.length)?d.eq(i):"up"==e?d.first():d.last()).length>0&&(w.debug("Scrolling page",e,n),o.removeClass(S.selected),n.addClass(S.selected),k.selectOnKeydown&&w.is.single()&&w.set.selectedItem(n),a.scrollTop(u))},set:{filtered:function(){var e=w.is.multiple(),t=w.is.searchSelection(),n=e&&t,i=t?w.get.query():"",o="string"==typeof i&&i.length>0,a=w.get.searchWidth(),r=""!==i;e&&o&&(w.verbose("Adjusting input width",a,k.glyphWidth),V.css("width",a)),o||n&&r?(w.verbose("Hiding placeholder text"),L.addClass(S.filtered)):(!e||n&&!r)&&(w.verbose("Showing placeholder text"),L.removeClass(S.filtered))},empty:function(){I.addClass(S.empty)},loading:function(){I.addClass(S.loading)},placeholderText:function(e){e=e||w.get.placeholderText(),w.debug("Setting placeholder text",e),w.set.text(e),L.addClass(S.placeholder)},tabbable:function(){w.is.searchSelection()?(w.debug("Added tabindex to searchable dropdown"),V.val("").attr("tabindex",0),B.attr("tabindex",-1)):(w.debug("Added tabindex to dropdown"),void 0===I.attr("tabindex")&&(I.attr("tabindex",0),B.attr("tabindex",-1)))},initialLoad:function(){w.verbose("Setting initial load"),v=!0},activeItem:function(e){k.allowAdditions&&e.filter(O.addition).length>0?e.addClass(S.filtered):e.addClass(S.active)},partialSearch:function(e){var t=w.get.query().length;V.val(e.substr(0,t))},scrollPosition:function(e,t){var n,i,o,a,r,s;n=(e=e||w.get.selectedItem()).closest(O.menu),i=e&&e.length>0,t=void 0!==t&&t,e&&n.length>0&&i&&(e.position().top,n.addClass(S.loading),o=(a=n.scrollTop())-n.offset().top+e.offset().top,t||(s=a+n.height()<o+5,r=o-5<a),w.debug("Scrolling to active item",o),(t||r||s)&&n.scrollTop(o),n.removeClass(S.loading))},text:function(e){"select"!==k.action&&("combo"==k.action?(w.debug("Changing combo button text",e,W),k.preserveHTML?W.html(e):W.text(e)):(e!==w.get.placeholderText()&&L.removeClass(S.placeholder),w.debug("Changing text",e,L),L.removeClass(S.filtered),k.preserveHTML?L.html(e):L.text(e)))},selectedItem:function(e){var t=w.get.choiceValue(e),n=w.get.choiceText(e,!1),i=w.get.choiceText(e,!0);w.debug("Setting user selection to item",e),w.remove.activeItem(),w.set.partialSearch(n),w.set.activeItem(e),w.set.selected(t,e),w.set.text(i)},selectedLetter:function(t){var n,i=Q.filter("."+S.selected),o=!1;i.length>0&&w.has.firstLetter(i,t)&&(n=i.nextAll(Q).eq(0),w.has.firstLetter(n,t)&&(o=n)),o||Q.each(function(){if(w.has.firstLetter(e(this),t))return o=e(this),!1}),o&&(w.verbose("Scrolling to next value with letter",t),w.set.scrollPosition(o),i.removeClass(S.selected),o.addClass(S.selected),k.selectOnKeydown&&w.is.single()&&w.set.selectedItem(o))},direction:function(e){"auto"==k.direction?(w.remove.upward(),w.can.openDownward(e)?w.remove.upward(e):w.set.upward(e),w.is.leftward(e)||w.can.openRightward(e)||w.set.leftward(e)):"upward"==k.direction&&w.set.upward(e)},upward:function(e){(e||I).addClass(S.upward)},leftward:function(e){(e||B).addClass(S.leftward)},value:function(e,t,n){var i=w.escape.value(e),o=H.length>0,a=(w.has.value(e),w.get.values()),r=void 0!==e?String(e):e;if(o){if(!k.allowReselection&&r==a&&(w.verbose("Skipping value update already same value",e,a),!w.is.initialLoad()))return;w.is.single()&&w.has.selectInput()&&w.can.extendSelect()&&(w.debug("Adding user option",e),w.add.optionValue(e)),w.debug("Updating input value",i,a),Y=!0,H.val(i),!1===k.fireOnInit&&w.is.initialLoad()?w.debug("Input native change event ignored on initial load"):w.trigger.change(),Y=!1}else w.verbose("Storing value in metadata",i,H),i!==a&&I.data(P.value,r);!1===k.fireOnInit&&w.is.initialLoad()?w.verbose("No callback on initial load",k.onChange):k.onChange.call(Z,e,t,n)},active:function(){I.addClass(S.active)},multiple:function(){I.addClass(S.multiple)},visible:function(){I.addClass(S.visible)},exactly:function(e,t){w.debug("Setting selected to exact values"),w.clear(),w.set.selected(e,t)},selected:function(t,n){var i=w.is.multiple();(n=k.allowAdditions?n||w.get.itemWithAdditions(t):n||w.get.item(t))&&(w.debug("Setting selected menu item to",n),w.is.multiple()&&w.remove.searchWidth(),w.is.single()?(w.remove.activeItem(),w.remove.selectedItem()):k.useLabels&&w.remove.selectedItem(),n.each(function(){var t=e(this),o=w.get.choiceText(t),a=w.get.choiceValue(t,o),r=t.hasClass(S.filtered),s=t.hasClass(S.active),l=t.hasClass(S.addition),c=i&&1==n.length;i?!s||l?(k.apiSettings&&k.saveRemoteData&&w.save.remoteData(o,a),k.useLabels?(w.add.value(a,o,t),w.add.label(a,o,c),w.set.activeItem(t),w.filterActive(),w.select.nextAvailable(n)):(w.add.value(a,o,t),w.set.text(w.add.variables(T.count)),w.set.activeItem(t))):r||(w.debug("Selected active value, removing label"),w.remove.selected(a)):(k.apiSettings&&k.saveRemoteData&&w.save.remoteData(o,a),w.set.text(o),w.set.value(a,o,t),t.addClass(S.active).addClass(S.selected))}))}},add:{label:function(t,n,i){var o,a=w.is.searchSelection()?V:L,r=w.escape.value(t);o=e("<a />").addClass(S.label).attr("data-"+P.value,r).html(q.label(r,n)),o=k.onLabelCreate.call(o,r,n),w.has.label(t)?w.debug("Label already exists, skipping",r):(k.label.variation&&o.addClass(k.label.variation),!0===i?(w.debug("Animating in label",o),o.addClass(S.hidden).insertBefore(a).transition(k.label.transition,k.label.duration)):(w.debug("Adding selection label",o),o.insertBefore(a)))},message:function(t){var n=B.children(O.message),i=k.templates.message(w.add.variables(t));n.length>0?n.html(i):n=e("<div/>").html(i).addClass(S.message).appendTo(B)},optionValue:function(t){var n=w.escape.value(t);H.find('option[value="'+w.escape.string(n)+'"]').length>0||(w.disconnect.selectObserver(),w.is.single()&&(w.verbose("Removing previous user addition"),H.find("option."+S.addition).remove()),e("<option/>").prop("value",n).addClass(S.addition).html(t).appendTo(H),w.verbose("Adding user addition as an <option>",t),w.observe.select())},userSuggestion:function(e){var t,n=B.children(O.addition),i=w.get.item(e),o=i&&i.not(O.addition).length,a=n.length>0;k.useLabels&&w.has.maxSelections()||(""===e||o?n.remove():(a?(n.data(P.value,e).data(P.text,e).attr("data-"+P.value,e).attr("data-"+P.text,e).removeClass(S.filtered),k.hideAdditions||(t=k.templates.addition(w.add.variables(T.addResult,e)),n.html(t)),w.verbose("Replacing user suggestion with new value",n)):((n=w.create.userChoice(e)).prependTo(B),w.verbose("Adding item choice to menu corresponding with user choice addition",n)),k.hideAdditions&&!w.is.allFiltered()||n.addClass(S.selected).siblings().removeClass(S.selected),w.refreshItems()))},variables:function(e,t){var n,i,o=-1!==e.search("{count}"),a=-1!==e.search("{maxCount}"),r=-1!==e.search("{term}");return w.verbose("Adding templated variables to message",e),o&&(n=w.get.selectionCount(),e=e.replace("{count}",n)),a&&(n=w.get.selectionCount(),e=e.replace("{maxCount}",k.maxSelections)),r&&(i=t||w.get.query(),e=e.replace("{term}",i)),e},value:function(t,n,i){var o,a=w.get.values();""!==t?(e.isArray(a)?(o=a.concat([t]),o=w.get.uniqueArray(o)):o=[t],w.has.selectInput()?w.can.extendSelect()&&(w.debug("Adding value to select",t,o,H),w.add.optionValue(t)):(o=o.join(k.delimiter),w.debug("Setting hidden input to delimited value",o,H)),!1===k.fireOnInit&&w.is.initialLoad()?w.verbose("Skipping onadd callback on initial load",k.onAdd):k.onAdd.call(Z,t,n,i),w.set.value(o,t,n,i),w.check.maxSelections()):w.debug("Cannot select blank values from multiselect")}},remove:{active:function(){I.removeClass(S.active)},activeLabel:function(){I.find(O.label).removeClass(S.active)},empty:function(){I.removeClass(S.empty)},loading:function(){I.removeClass(S.loading)},initialLoad:function(){v=!1},upward:function(e){(e||I).removeClass(S.upward)},leftward:function(e){(e||B).removeClass(S.leftward)},visible:function(){I.removeClass(S.visible)},activeItem:function(){Q.removeClass(S.active)},filteredItem:function(){k.useLabels&&w.has.maxSelections()||(k.useLabels&&w.is.multiple()?Q.not("."+S.active).removeClass(S.filtered):Q.removeClass(S.filtered),w.remove.empty())},optionValue:function(e){var t=w.escape.value(e),n=H.find('option[value="'+w.escape.string(t)+'"]');n.length>0&&n.hasClass(S.addition)&&(x&&(x.disconnect(),w.verbose("Temporarily disconnecting mutation observer")),n.remove(),w.verbose("Removing user addition as an <option>",t),x&&x.observe(H[0],{childList:!0,subtree:!0}))},message:function(){B.children(O.message).remove()},searchWidth:function(){V.css("width","")},searchTerm:function(){w.verbose("Cleared search term"),V.val(""),w.set.filtered()},userAddition:function(){Q.filter(O.addition).remove()},selected:function(t,n){if(!(n=k.allowAdditions?n||w.get.itemWithAdditions(t):n||w.get.item(t)))return!1;n.each(function(){var t=e(this),n=w.get.choiceText(t),i=w.get.choiceValue(t,n);w.is.multiple()?k.useLabels?(w.remove.value(i,n,t),w.remove.label(i)):(w.remove.value(i,n,t),0===w.get.selectionCount()?w.set.placeholderText():w.set.text(w.add.variables(T.count))):w.remove.value(i,n,t),t.removeClass(S.filtered).removeClass(S.active),k.useLabels&&t.removeClass(S.selected)})},selectedItem:function(){Q.removeClass(S.selected)},value:function(e,t,n){var i,o=w.get.values();w.has.selectInput()?(w.verbose("Input is <select> removing selected option",e),i=w.remove.arrayValue(e,o),w.remove.optionValue(e)):(w.verbose("Removing from delimited values",e),i=(i=w.remove.arrayValue(e,o)).join(k.delimiter)),!1===k.fireOnInit&&w.is.initialLoad()?w.verbose("No callback on initial load",k.onRemove):k.onRemove.call(Z,e,t,n),w.set.value(i,t,n),w.check.maxSelections()},arrayValue:function(t,n){return e.isArray(n)||(n=[n]),n=e.grep(n,function(e){return t!=e}),w.verbose("Removed value from delimited string",t,n),n},label:function(e,t){var n=I.find(O.label).filter("[data-"+P.value+'="'+w.escape.string(e)+'"]');w.verbose("Removing label",n),n.remove()},activeLabels:function(e){e=e||I.find(O.label).filter("."+S.active),w.verbose("Removing active label selections",e),w.remove.labels(e)},labels:function(t){t=t||I.find(O.label),w.verbose("Removing labels",t),t.each(function(){var t=e(this),n=t.data(P.value),i=void 0!==n?String(n):n,o=w.is.userValue(i);!1!==k.onLabelRemove.call(t,n)?(w.remove.message(),o?(w.remove.value(i),w.remove.label(i)):w.remove.selected(i)):w.debug("Label remove callback cancelled removal")})},tabbable:function(){w.is.searchSelection()?(w.debug("Searchable dropdown initialized"),V.removeAttr("tabindex"),B.removeAttr("tabindex")):(w.debug("Simple selection dropdown initialized"),I.removeAttr("tabindex"),B.removeAttr("tabindex"))}},has:{menuSearch:function(){return w.has.search()&&V.closest(B).length>0},search:function(){return V.length>0},sizer:function(){return N.length>0},selectInput:function(){return H.is("select")},minCharacters:function(e){return!k.minCharacters||(e=void 0!==e?String(e):String(w.get.query())).length>=k.minCharacters},firstLetter:function(e,t){var n,i;return!(!e||0===e.length||"string"!=typeof t)&&(n=w.get.choiceText(e,!1),t=t.toLowerCase(),i=String(n).charAt(0).toLowerCase(),t==i)},input:function(){return H.length>0},items:function(){return Q.length>0},menu:function(){return B.length>0},message:function(){return 0!==B.children(O.message).length},label:function(e){var t=w.escape.value(e);return I.find(O.label).filter("[data-"+P.value+'="'+w.escape.string(t)+'"]').length>0},maxSelections:function(){return k.maxSelections&&w.get.selectionCount()>=k.maxSelections},allResultsFiltered:function(){var e=Q.not(O.addition);return e.filter(O.unselectable).length===e.length},userSuggestion:function(){return B.children(O.addition).length>0},query:function(){return""!==w.get.query()},value:function(t){var n=w.get.values();return!!(e.isArray(n)?n&&-1!==e.inArray(t,n):n==t)}},is:{active:function(){return I.hasClass(S.active)},bubbledLabelClick:function(t){return e(t.target).is("select, input")&&I.closest("label").length>0},bubbledIconClick:function(t){return e(t.target).closest(U).length>0},alreadySetup:function(){return I.is("select")&&void 0!==I.parent(O.dropdown).data(z)&&0===I.prev().length},animating:function(e){return e?e.transition&&e.transition("is animating"):B.transition&&B.transition("is animating")},leftward:function(e){return(e||B).hasClass(S.leftward)},disabled:function(){return I.hasClass(S.disabled)},focused:function(){return n.activeElement===I[0]},focusedOnSearch:function(){return n.activeElement===V[0]},allFiltered:function(){return(w.is.multiple()||w.has.search())&&!(0==k.hideAdditions&&w.has.userSuggestion())&&!w.has.message()&&w.has.allResultsFiltered()},hidden:function(e){return!w.is.visible(e)},initialLoad:function(){return v},inObject:function(t,n){var i=!1;return e.each(n,function(e,n){if(n==t)return i=!0,!0}),i},multiple:function(){return I.hasClass(S.multiple)},remote:function(){return k.apiSettings&&w.can.useAPI()},single:function(){return!w.is.multiple()},selectMutation:function(t){var n=!1;return e.each(t,function(t,i){if(i.target&&e(i.target).is("select"))return n=!0,!0}),n},search:function(){return I.hasClass(S.search)},searchSelection:function(){return w.has.search()&&1===V.parent(O.dropdown).length},selection:function(){return I.hasClass(S.selection)},userValue:function(t){return-1!==e.inArray(t,w.get.userValues())},upward:function(e){return(e||I).hasClass(S.upward)},visible:function(e){return e?e.hasClass(S.visible):B.hasClass(S.visible)},verticallyScrollableContext:function(){var e=M.get(0)!==t&&M.css("overflow-y");return"auto"==e||"scroll"==e},horizontallyScrollableContext:function(){var e=M.get(0)!==t&&M.css("overflow-X");return"auto"==e||"scroll"==e}},can:{activate:function(e){return!!k.useLabels||(!w.has.maxSelections()||!(!w.has.maxSelections()||!e.hasClass(S.active)))},openDownward:function(e){var t,n=e||B,i=!0,o={};return n.addClass(S.loading),t={context:{scrollTop:M.scrollTop(),height:M.outerHeight()},menu:{offset:n.offset(),height:n.outerHeight()}},w.is.verticallyScrollableContext()&&(t.menu.offset.top+=t.context.scrollTop),(o={above:t.context.scrollTop<=t.menu.offset.top-t.menu.height,below:t.context.scrollTop+t.context.height>=t.menu.offset.top+t.menu.height}).below?(w.verbose("Dropdown can fit in context downward",o),i=!0):o.below||o.above?(w.verbose("Dropdown cannot fit below, opening upward",o),i=!1):(w.verbose("Dropdown cannot fit in either direction, favoring downward",o),i=!0),n.removeClass(S.loading),i},openRightward:function(e){var t,n=e||B,i=!0,o=!1;return n.addClass(S.loading),t={context:{scrollLeft:M.scrollLeft(),width:M.outerWidth()},menu:{offset:n.offset(),width:n.outerWidth()}},w.is.horizontallyScrollableContext()&&(t.menu.offset.left+=t.context.scrollLeft),(o=t.menu.offset.left+t.menu.width>=t.context.scrollLeft+t.context.width)&&(w.verbose("Dropdown cannot fit in context rightward",o),i=!1),n.removeClass(S.loading),i},click:function(){return l||"click"==k.on},extendSelect:function(){return k.allowAdditions||k.apiSettings},show:function(){return!w.is.disabled()&&(w.has.items()||w.has.message())},useAPI:function(){return void 0!==e.fn.api}},animate:{show:function(t,n){var i,o=n||B,a=n?function(){}:function(){w.hideSubMenus(),w.hideOthers(),w.set.active()};t=e.isFunction(t)?t:function(){},w.verbose("Doing menu show animation",o),w.set.direction(n),i=w.get.transition(n),w.is.selection()&&w.set.scrollPosition(w.get.selectedItem(),!0),(w.is.hidden(o)||w.is.animating(o))&&("none"==i?(a(),o.transition("show"),t.call(Z)):void 0!==e.fn.transition&&I.transition("is supported")?o.transition({animation:i+" in",debug:k.debug,verbose:k.verbose,duration:k.duration,queue:!0,onStart:a,onComplete:function(){t.call(Z)}}):w.error(D.noTransition,i))},hide:function(t,n){var i=n||B,o=(n?k.duration:k.duration,n?function(){}:function(){w.can.click()&&w.unbind.intent(),w.remove.active()}),a=w.get.transition(n);t=e.isFunction(t)?t:function(){},(w.is.visible(i)||w.is.animating(i))&&(w.verbose("Doing menu hide animation",i),"none"==a?(o(),i.transition("hide"),t.call(Z)):void 0!==e.fn.transition&&I.transition("is supported")?i.transition({animation:a+" out",duration:k.duration,debug:k.debug,verbose:k.verbose,queue:!0,onStart:o,onComplete:function(){t.call(Z)}}):w.error(D.transition))}},hideAndClear:function(){w.remove.searchTerm(),w.has.maxSelections()||(w.has.search()?w.hide(function(){w.remove.filteredItem()}):w.hide())},delay:{show:function(){w.verbose("Delaying show event to ensure user intent"),clearTimeout(w.timer),w.timer=setTimeout(w.show,k.delay.show)},hide:function(){w.verbose("Delaying hide event to ensure user intent"),clearTimeout(w.timer),w.timer=setTimeout(w.hide,k.delay.hide)}},escape:{value:function(t){var n=e.isArray(t),i="string"==typeof t,o=!i&&!n,a=i&&-1!==t.search(F.quote),r=[];return o||!a?t:(w.debug("Encoding quote values for use in select",t),n?(e.each(t,function(e,t){r.push(t.replace(F.quote,"&quot;"))}),r):t.replace(F.quote,"&quot;"))},string:function(e){return(e=String(e)).replace(F.escape,"\\$&")}},setting:function(t,n){if(w.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,k,t);else{if(void 0===n)return k[t];e.isPlainObject(k[t])?e.extend(!0,k[t],n):k[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,w,t);else{if(void 0===n)return w[t];w[t]=n}},debug:function(){!k.silent&&k.debug&&(k.performance?w.performance.log(arguments):(w.debug=Function.prototype.bind.call(console.info,console,k.name+":"),w.debug.apply(console,arguments)))},verbose:function(){!k.silent&&k.verbose&&k.debug&&(k.performance?w.performance.log(arguments):(w.verbose=Function.prototype.bind.call(console.info,console,k.name+":"),w.verbose.apply(console,arguments)))},error:function(){k.silent||(w.error=Function.prototype.bind.call(console.error,console,k.name+":"),w.error.apply(console,arguments))},performance:{log:function(e){var t,n;k.performance&&(n=(t=(new Date).getTime())-(c||t),c=t,u.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:Z,"Execution Time":n})),clearTimeout(w.performance.timer),w.performance.timer=setTimeout(w.performance.display,500)},display:function(){var t=k.name+":",n=0;c=!1,clearTimeout(w.performance.timer),e.each(u,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",s&&(t+=" '"+s+"'"),(void 0!==console.group||void 0!==console.table)&&u.length>0&&(console.groupCollapsed(t),console.table?console.table(u):e.each(u,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),u=[]}},invoke:function(t,n,i){var a,r,s,l=K;return n=n||m,i=Z||i,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]?(r=l[i],!1):(w.error(D.method,t),!1);l=l[i]}})),e.isFunction(r)?s=r.apply(i,n):void 0!==r&&(s=r),e.isArray(o)?o.push(s):void 0!==o?o=[o,s]:void 0!==s&&(o=s),r}},f?(void 0===K&&w.initialize(),w.invoke(d)):(void 0!==K&&K.invoke("destroy"),w.initialize())}),void 0!==o?o:a},e.fn.dropdown.settings={silent:!1,debug:!1,verbose:!1,performance:!0,on:"click",action:"activate",values:!1,apiSettings:!1,selectOnKeydown:!0,minCharacters:0,filterRemoteData:!1,saveRemoteData:!0,throttle:200,context:t,direction:"auto",keepOnScreen:!0,match:"both",fullTextSearch:!1,placeholder:"auto",preserveHTML:!0,sortSelect:!1,forceSelection:!0,allowAdditions:!1,hideAdditions:!0,maxSelections:!1,useLabels:!0,delimiter:",",showOnFocus:!0,allowReselection:!1,allowTab:!0,allowCategorySelection:!1,fireOnInit:!1,transition:"auto",duration:200,glyphWidth:1.037,label:{transition:"scale",duration:200,variation:!1},delay:{hide:300,show:200,search:20,touch:50},onChange:function(e,t,n){},onAdd:function(e,t,n){},onRemove:function(e,t,n){},onLabelSelect:function(e){},onLabelCreate:function(t,n){return e(this)},onLabelRemove:function(e){return!0},onNoResults:function(e){return!0},onShow:function(){},onHide:function(){},name:"Dropdown",namespace:"dropdown",message:{addResult:"Add <b>{term}</b>",count:"{count} selected",maxSelections:"Max {maxCount} selections",noResults:"No results found.",serverError:"There was an error contacting the server"},error:{action:"You called a dropdown action that was not defined",alreadySetup:"Once a select has been initialized behaviors must be called on the created ui dropdown",labels:"Allowing user additions currently requires the use of labels.",missingMultiple:"<select> requires multiple property to be set to correctly preserve multiple values",method:"The method you called is not defined.",noAPI:"The API module is required to load resources remotely",noStorage:"Saving remote data requires session storage",noTransition:"This module requires ui transitions <https://github.com/Semantic-Org/UI-Transition>"},regExp:{escape:/[-[\]{}()*+?.,\\^$|#\s]/g,quote:/"/g},metadata:{defaultText:"defaultText",defaultValue:"defaultValue",placeholderText:"placeholder",text:"text",value:"value"},fields:{remoteValues:"results",values:"values",disabled:"disabled",name:"name",value:"value",text:"text"},keys:{backspace:8,delimiter:188,deleteKey:46,enter:13,escape:27,pageUp:33,pageDown:34,leftArrow:37,upArrow:38,rightArrow:39,downArrow:40},selector:{addition:".addition",dropdown:".ui.dropdown",hidden:".hidden",icon:"> .dropdown.icon",input:'> input[type="hidden"], > select',item:".item",label:"> .label",remove:"> .label > .delete.icon",siblingLabel:".label",menu:".menu",message:".message",menuIcon:".dropdown.icon",search:"input.search, .menu > .search > input, .menu input.search",sizer:"> input.sizer",text:"> .text:not(.icon)",unselectable:".disabled, .filtered"},className:{active:"active",addition:"addition",animating:"animating",disabled:"disabled",empty:"empty",dropdown:"ui dropdown",filtered:"filtered",hidden:"hidden transition",item:"item",label:"ui label",loading:"loading",menu:"menu",message:"message",multiple:"multiple",placeholder:"default",sizer:"sizer",search:"search",selected:"selected",selection:"selection",upward:"upward",leftward:"left",visible:"visible"}},e.fn.dropdown.settings.templates={dropdown:function(t){var n=t.placeholder||!1,i=(t.values,"");return i+='<i class="dropdown icon"></i>',t.placeholder?i+='<div class="default text">'+n+"</div>":i+='<div class="text"></div>',i+='<div class="menu">',e.each(t.values,function(e,t){i+=t.disabled?'<div class="disabled item" data-value="'+t.value+'">'+t.name+"</div>":'<div class="item" data-value="'+t.value+'">'+t.name+"</div>"}),i+="</div>"},menu:function(t,n){var i=t[n.values]||{},o="";return e.each(i,function(e,t){var i=t[n.text]?'data-text="'+t[n.text]+'"':"",a=t[n.disabled]?"disabled ":"";o+='<div class="'+a+'item" data-value="'+t[n.value]+'"'+i+">",o+=t[n.name],o+="</div>"}),o},label:function(e,t){return t+'<i class="delete icon"></i>'},message:function(e){return e},addition:function(e){return e}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.embed=function(n){var i,o=e(this),a=o.selector||"",r=(new Date).getTime(),s=[],l=arguments[0],c="string"==typeof l,u=[].slice.call(arguments,1);return o.each(function(){var d,f=e.isPlainObject(n)?e.extend(!0,{},e.fn.embed.settings,n):e.extend({},e.fn.embed.settings),m=f.selector,g=f.className,v=f.sources,p=f.error,h=f.metadata,b=f.namespace,y=f.templates,x="."+b,C="module-"+b,w=(e(t),e(this)),k=w.find(m.placeholder),S=w.find(m.icon),T=w.find(m.embed),A=this,R=w.data(C);d={initialize:function(){d.debug("Initializing embed"),d.determine.autoplay(),d.create(),d.bind.events(),d.instantiate()},instantiate:function(){d.verbose("Storing instance of module",d),R=d,w.data(C,d)},destroy:function(){d.verbose("Destroying previous instance of embed"),d.reset(),w.removeData(C).off(x)},refresh:function(){d.verbose("Refreshing selector cache"),k=w.find(m.placeholder),S=w.find(m.icon),T=w.find(m.embed)},bind:{events:function(){d.has.placeholder()&&(d.debug("Adding placeholder events"),w.on("click"+x,m.placeholder,d.createAndShow).on("click"+x,m.icon,d.createAndShow))}},create:function(){d.get.placeholder()?d.createPlaceholder():d.createAndShow()},createPlaceholder:function(e){var t=d.get.icon(),n=d.get.url();d.generate.embed(n);e=e||d.get.placeholder(),w.html(y.placeholder(e,t)),d.debug("Creating placeholder for embed",e,t)},createEmbed:function(t){d.refresh(),t=t||d.get.url(),T=e("<div/>").addClass(g.embed).html(d.generate.embed(t)).appendTo(w),f.onCreate.call(A,t),d.debug("Creating embed object",T)},changeEmbed:function(e){T.html(d.generate.embed(e))},createAndShow:function(){d.createEmbed(),d.show()},change:function(e,t,n){d.debug("Changing video to ",e,t,n),w.data(h.source,e).data(h.id,t),n?w.data(h.url,n):w.removeData(h.url),d.has.embed()?d.changeEmbed():d.create()},reset:function(){d.debug("Clearing embed and showing placeholder"),d.remove.active(),d.remove.embed(),d.showPlaceholder(),f.onReset.call(A)},show:function(){d.debug("Showing embed"),d.set.active(),f.onDisplay.call(A)},hide:function(){d.debug("Hiding embed"),d.showPlaceholder()},showPlaceholder:function(){d.debug("Showing placeholder image"),d.remove.active(),f.onPlaceholderDisplay.call(A)},get:{id:function(){return f.id||w.data(h.id)},placeholder:function(){return f.placeholder||w.data(h.placeholder)},icon:function(){return f.icon?f.icon:void 0!==w.data(h.icon)?w.data(h.icon):d.determine.icon()},source:function(e){return f.source?f.source:void 0!==w.data(h.source)?w.data(h.source):d.determine.source()},type:function(){var e=d.get.source();return void 0!==v[e]&&v[e].type},url:function(){return f.url?f.url:void 0!==w.data(h.url)?w.data(h.url):d.determine.url()}},determine:{autoplay:function(){d.should.autoplay()&&(f.autoplay=!0)},source:function(t){var n=!1;return(t=t||d.get.url())&&e.each(v,function(e,i){if(-1!==t.search(i.domain))return n=e,!1}),n},icon:function(){var e=d.get.source();return void 0!==v[e]&&v[e].icon},url:function(){var e,t=f.id||w.data(h.id),n=f.source||w.data(h.source);return(e=void 0!==v[n]&&v[n].url.replace("{id}",t))&&w.data(h.url,e),e}},set:{active:function(){w.addClass(g.active)}},remove:{active:function(){w.removeClass(g.active)},embed:function(){T.empty()}},encode:{parameters:function(e){var t,n=[];for(t in e)n.push(encodeURIComponent(t)+"="+encodeURIComponent(e[t]));return n.join("&amp;")}},generate:{embed:function(e){d.debug("Generating embed html");var t,n,i=d.get.source();return(e=d.get.url(e))?(n=d.generate.parameters(i),t=y.iframe(e,n)):d.error(p.noURL,w),t},parameters:function(t,n){var i=v[t]&&void 0!==v[t].parameters?v[t].parameters(f):{};return(n=n||f.parameters)&&(i=e.extend({},i,n)),i=f.onEmbed(i),d.encode.parameters(i)}},has:{embed:function(){return T.length>0},placeholder:function(){return f.placeholder||w.data(h.placeholder)}},should:{autoplay:function(){return"auto"===f.autoplay?f.placeholder||void 0!==w.data(h.placeholder):f.autoplay}},is:{video:function(){return"video"==d.get.type()}},setting:function(t,n){if(d.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,f,t);else{if(void 0===n)return f[t];e.isPlainObject(f[t])?e.extend(!0,f[t],n):f[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,d,t);else{if(void 0===n)return d[t];d[t]=n}},debug:function(){!f.silent&&f.debug&&(f.performance?d.performance.log(arguments):(d.debug=Function.prototype.bind.call(console.info,console,f.name+":"),d.debug.apply(console,arguments)))},verbose:function(){!f.silent&&f.verbose&&f.debug&&(f.performance?d.performance.log(arguments):(d.verbose=Function.prototype.bind.call(console.info,console,f.name+":"),d.verbose.apply(console,arguments)))},error:function(){f.silent||(d.error=Function.prototype.bind.call(console.error,console,f.name+":"),d.error.apply(console,arguments))},performance:{log:function(e){var t,n;f.performance&&(n=(t=(new Date).getTime())-(r||t),r=t,s.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:A,"Execution Time":n})),clearTimeout(d.performance.timer),d.performance.timer=setTimeout(d.performance.display,500)},display:function(){var t=f.name+":",n=0;r=!1,clearTimeout(d.performance.timer),e.each(s,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",a&&(t+=" '"+a+"'"),o.length>1&&(t+=" ("+o.length+")"),(void 0!==console.group||void 0!==console.table)&&s.length>0&&(console.groupCollapsed(t),console.table?console.table(s):e.each(s,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(t,n,o){var a,r,s,l=R;return n=n||u,o=A||o,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]?(r=l[i],!1):(d.error(p.method,t),!1);l=l[i]}})),e.isFunction(r)?s=r.apply(o,n):void 0!==r&&(s=r),e.isArray(i)?i.push(s):void 0!==i?i=[i,s]:void 0!==s&&(i=s),r}},c?(void 0===R&&d.initialize(),d.invoke(l)):(void 0!==R&&R.invoke("destroy"),d.initialize())}),void 0!==i?i:this},e.fn.embed.settings={name:"Embed",namespace:"embed",silent:!1,debug:!1,verbose:!1,performance:!0,icon:!1,source:!1,url:!1,id:!1,autoplay:"auto",color:"#444444",hd:!0,brandedUI:!1,parameters:!1,onDisplay:function(){},onPlaceholderDisplay:function(){},onReset:function(){},onCreate:function(e){},onEmbed:function(e){return e},metadata:{id:"id",icon:"icon",placeholder:"placeholder",source:"source",url:"url"},error:{noURL:"No URL specified",method:"The method you called is not defined"},className:{active:"active",embed:"embed"},selector:{embed:".embed",placeholder:".placeholder",icon:".icon"},sources:{youtube:{name:"youtube",type:"video",icon:"video play",domain:"youtube.com",url:"//www.youtube.com/embed/{id}",parameters:function(e){return{autohide:!e.brandedUI,autoplay:e.autoplay,color:e.color||void 0,hq:e.hd,jsapi:e.api,modestbranding:!e.brandedUI}}},vimeo:{name:"vimeo",type:"video",icon:"video play",domain:"vimeo.com",url:"//player.vimeo.com/video/{id}",parameters:function(e){return{api:e.api,autoplay:e.autoplay,byline:e.brandedUI,color:e.color||void 0,portrait:e.brandedUI,title:e.brandedUI}}}},templates:{iframe:function(e,t){var n=e;return t&&(n+="?"+t),'<iframe src="'+n+'" width="100%" height="100%" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'},placeholder:function(e,t){var n="";return t&&(n+='<i class="'+t+' icon"></i>'),e&&(n+='<img class="placeholder" src="'+e+'">'),n}},api:!1,onPause:function(){},onPlay:function(){},onStop:function(){}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.modal=function(i){var o,a=e(this),r=e(t),s=e(n),l=e("body"),c=a.selector||"",u=(new Date).getTime(),d=[],f=arguments[0],m="string"==typeof f,g=[].slice.call(arguments,1),v=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)};return a.each(function(){var a,p,h,b,y,x,C,w,k,S=e.isPlainObject(i)?e.extend(!0,{},e.fn.modal.settings,i):e.extend({},e.fn.modal.settings),T=S.selector,A=S.className,R=S.namespace,P=S.error,E="."+R,F="module-"+R,O=e(this),D=e(S.context),q=O.find(T.close),j=this,z=O.data(F),I=!1;k={initialize:function(){k.verbose("Initializing dimmer",D),k.create.id(),k.create.dimmer(),k.refreshModals(),k.bind.events(),S.observeChanges&&k.observeChanges(),k.instantiate()},instantiate:function(){k.verbose("Storing instance of modal"),z=k,O.data(F,z)},create:{dimmer:function(){var t={debug:S.debug,dimmerName:"modals"},n=e.extend(!0,t,S.dimmerSettings);void 0!==e.fn.dimmer?(k.debug("Creating dimmer"),b=D.dimmer(n),S.detachable?(k.verbose("Modal is detachable, moving content into dimmer"),b.dimmer("add content",O)):k.set.undetached(),y=b.dimmer("get dimmer")):k.error(P.dimmer)},id:function(){C=(Math.random().toString(16)+"000000000").substr(2,8),x="."+C,k.verbose("Creating unique id for element",C)}},destroy:function(){k.verbose("Destroying previous modal"),O.removeData(F).off(E),r.off(x),y.off(x),q.off(E),D.dimmer("destroy")},observeChanges:function(){"MutationObserver"in t&&((w=new MutationObserver(function(e){k.debug("DOM tree modified, refreshing"),k.refresh()})).observe(j,{childList:!0,subtree:!0}),k.debug("Setting up mutation observer",w))},refresh:function(){k.remove.scrolling(),k.cacheSizes(),k.set.screenHeight(),k.set.type(),k.set.position()},refreshModals:function(){p=O.siblings(T.modal),a=p.add(O)},attachEvents:function(t,n){var i=e(t);n=e.isFunction(k[n])?k[n]:k.toggle,i.length>0?(k.debug("Attaching modal events to element",t,n),i.off(E).on("click"+E,n)):k.error(P.notFound,t)},bind:{events:function(){k.verbose("Attaching events"),O.on("click"+E,T.close,k.event.close).on("click"+E,T.approve,k.event.approve).on("click"+E,T.deny,k.event.deny),r.on("resize"+x,k.event.resize)}},get:{id:function(){return(Math.random().toString(16)+"000000000").substr(2,8)}},event:{approve:function(){I||!1===S.onApprove.call(j,e(this))?k.verbose("Approve callback returned false cancelling hide"):(I=!0,k.hide(function(){I=!1}))},deny:function(){I||!1===S.onDeny.call(j,e(this))?k.verbose("Deny callback returned false cancelling hide"):(I=!0,k.hide(function(){I=!1}))},close:function(){k.hide()},click:function(t){var i=e(t.target).closest(T.modal).length>0,o=e.contains(n.documentElement,t.target);!i&&o&&(k.debug("Dimmer clicked, hiding all modals"),k.is.active()&&(k.remove.clickaway(),S.allowMultiple?k.hide():k.hideAll()))},debounce:function(e,t){clearTimeout(k.timer),k.timer=setTimeout(e,t)},keyboard:function(e){27==e.which&&(S.closable?(k.debug("Escape key pressed hiding modal"),k.hide()):k.debug("Escape key pressed, but closable is set to false"),e.preventDefault())},resize:function(){b.dimmer("is active")&&(k.is.animating()||k.is.active())&&v(k.refresh)}},toggle:function(){k.is.active()||k.is.animating()?k.hide():k.show()},show:function(t){t=e.isFunction(t)?t:function(){},k.refreshModals(),k.set.dimmerSettings(),k.showModal(t)},hide:function(t){t=e.isFunction(t)?t:function(){},k.refreshModals(),k.hideModal(t)},showModal:function(t){t=e.isFunction(t)?t:function(){},k.is.animating()||!k.is.active()?(k.showDimmer(),k.cacheSizes(),k.set.position(),k.set.screenHeight(),k.set.type(),k.set.clickaway(),!S.allowMultiple&&k.others.active()?k.hideOthers(k.showModal):(S.allowMultiple&&S.detachable&&O.detach().appendTo(y),S.onShow.call(j),S.transition&&void 0!==e.fn.transition&&O.transition("is supported")?(k.debug("Showing modal with css animations"),O.transition({debug:S.debug,animation:S.transition+" in",queue:S.queue,duration:S.duration,useFailSafe:!0,onComplete:function(){S.onVisible.apply(j),S.keyboardShortcuts&&k.add.keyboardShortcuts(),k.save.focus(),k.set.active(),S.autofocus&&k.set.autofocus(),t()}})):k.error(P.noTransition))):k.debug("Modal is already visible")},hideModal:function(t,n){t=e.isFunction(t)?t:function(){},k.debug("Hiding modal"),!1!==S.onHide.call(j,e(this))?(k.is.animating()||k.is.active())&&(S.transition&&void 0!==e.fn.transition&&O.transition("is supported")?(k.remove.active(),O.transition({debug:S.debug,animation:S.transition+" out",queue:S.queue,duration:S.duration,useFailSafe:!0,onStart:function(){k.others.active()||n||k.hideDimmer(),S.keyboardShortcuts&&k.remove.keyboardShortcuts()},onComplete:function(){S.onHidden.call(j),k.restore.focus(),t()}})):k.error(P.noTransition)):k.verbose("Hide callback returned false cancelling hide")},showDimmer:function(){b.dimmer("is animating")||!b.dimmer("is active")?(k.debug("Showing dimmer"),b.dimmer("show")):k.debug("Dimmer already visible")},hideDimmer:function(){b.dimmer("is animating")||b.dimmer("is active")?b.dimmer("hide",function(){k.remove.clickaway(),k.remove.screenHeight()}):k.debug("Dimmer is not visible cannot hide")},hideAll:function(t){var n=a.filter("."+A.active+", ."+A.animating);t=e.isFunction(t)?t:function(){},n.length>0&&(k.debug("Hiding all visible modals"),k.hideDimmer(),n.modal("hide modal",t))},hideOthers:function(t){var n=p.filter("."+A.active+", ."+A.animating);t=e.isFunction(t)?t:function(){},n.length>0&&(k.debug("Hiding other modals",p),n.modal("hide modal",t,!0))},others:{active:function(){return p.filter("."+A.active).length>0},animating:function(){return p.filter("."+A.animating).length>0}},add:{keyboardShortcuts:function(){k.verbose("Adding keyboard shortcuts"),s.on("keyup"+E,k.event.keyboard)}},save:{focus:function(){h=e(n.activeElement).blur()}},restore:{focus:function(){h&&h.length>0&&h.focus()}},remove:{active:function(){O.removeClass(A.active)},clickaway:function(){S.closable&&y.off("click"+x)},bodyStyle:function(){""===l.attr("style")&&(k.verbose("Removing style attribute"),l.removeAttr("style"))},screenHeight:function(){k.debug("Removing page height"),l.css("height","")},keyboardShortcuts:function(){k.verbose("Removing keyboard shortcuts"),s.off("keyup"+E)},scrolling:function(){b.removeClass(A.scrolling),O.removeClass(A.scrolling)}},cacheSizes:function(){O.addClass(A.loading);var i=O.prop("scrollHeight"),o=O.outerHeight();void 0!==k.cache&&0===o||(k.cache={pageHeight:e(n).outerHeight(),height:o+S.offset,scrollHeight:i+S.offset,contextHeight:"body"==S.context?e(t).height():b.height()},k.cache.topOffset=-k.cache.height/2),O.removeClass(A.loading),k.debug("Caching modal and container sizes",k.cache)},can:{fit:function(){var e=k.cache.contextHeight,t=k.cache.contextHeight/2,n=k.cache.topOffset,i=k.cache.scrollHeight,o=k.cache.height,a=S.padding,r=t+n;return i>o?r+i+a<e:o+2*a<e}},is:{active:function(){return O.hasClass(A.active)},animating:function(){return O.transition("is supported")?O.transition("is animating"):O.is(":visible")},scrolling:function(){return b.hasClass(A.scrolling)},modernBrowser:function(){return!(t.ActiveXObject||"ActiveXObject"in t)}},set:{autofocus:function(){var e=O.find("[tabindex], :input").filter(":visible"),t=e.filter("[autofocus]"),n=t.length>0?t.first():e.first();n.length>0&&n.focus()},clickaway:function(){S.closable&&y.on("click"+x,k.event.click)},dimmerSettings:function(){if(void 0!==e.fn.dimmer){var t={debug:S.debug,dimmerName:"modals",variation:!1,closable:"auto",duration:{show:S.duration,hide:S.duration}},n=e.extend(!0,t,S.dimmerSettings);S.inverted?(n.variation=void 0!==n.variation?n.variation+" inverted":"inverted",y.addClass(A.inverted)):y.removeClass(A.inverted),S.blurring?b.addClass(A.blurring):b.removeClass(A.blurring),D.dimmer("setting",n)}else k.error(P.dimmer)},screenHeight:function(){k.can.fit()?l.css("height",""):(k.debug("Modal is taller than page content, resizing page height"),l.css("height",k.cache.height+2*S.padding))},active:function(){O.addClass(A.active)},scrolling:function(){b.addClass(A.scrolling),O.addClass(A.scrolling)},type:function(){k.can.fit()?(k.verbose("Modal fits on screen"),k.others.active()||k.others.animating()||k.remove.scrolling()):(k.verbose("Modal cannot fit on screen setting to scrolling"),k.set.scrolling())},position:function(){k.verbose("Centering modal on page",k.cache),k.can.fit()?O.css({top:"",marginTop:k.cache.topOffset}):O.css({marginTop:"",top:s.scrollTop()})},undetached:function(){b.addClass(A.undetached)}},setting:function(t,n){if(k.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,S,t);else{if(void 0===n)return S[t];e.isPlainObject(S[t])?e.extend(!0,S[t],n):S[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,k,t);else{if(void 0===n)return k[t];k[t]=n}},debug:function(){!S.silent&&S.debug&&(S.performance?k.performance.log(arguments):(k.debug=Function.prototype.bind.call(console.info,console,S.name+":"),k.debug.apply(console,arguments)))},verbose:function(){!S.silent&&S.verbose&&S.debug&&(S.performance?k.performance.log(arguments):(k.verbose=Function.prototype.bind.call(console.info,console,S.name+":"),k.verbose.apply(console,arguments)))},error:function(){S.silent||(k.error=Function.prototype.bind.call(console.error,console,S.name+":"),k.error.apply(console,arguments))},performance:{log:function(e){var t,n;S.performance&&(n=(t=(new Date).getTime())-(u||t),u=t,d.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:j,"Execution Time":n})),clearTimeout(k.performance.timer),k.performance.timer=setTimeout(k.performance.display,500)},display:function(){var t=S.name+":",n=0;u=!1,clearTimeout(k.performance.timer),e.each(d,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",c&&(t+=" '"+c+"'"),(void 0!==console.group||void 0!==console.table)&&d.length>0&&(console.groupCollapsed(t),console.table?console.table(d):e.each(d,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),d=[]}},invoke:function(t,n,i){var a,r,s,l=z;return n=n||g,i=j||i,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]&&(r=l[i],!1);l=l[i]}})),e.isFunction(r)?s=r.apply(i,n):void 0!==r&&(s=r),e.isArray(o)?o.push(s):void 0!==o?o=[o,s]:void 0!==s&&(o=s),r}},m?(void 0===z&&k.initialize(),k.invoke(f)):(void 0!==z&&z.invoke("destroy"),k.initialize())}),void 0!==o?o:this},e.fn.modal.settings={name:"Modal",namespace:"modal",silent:!1,debug:!1,verbose:!1,performance:!0,observeChanges:!1,allowMultiple:!1,detachable:!0,closable:!0,autofocus:!0,inverted:!1,blurring:!1,dimmerSettings:{closable:!1,useCSS:!0},keyboardShortcuts:!0,context:"body",queue:!1,duration:500,offset:0,transition:"scale",padding:50,onShow:function(){},onVisible:function(){},onHide:function(){return!0},onHidden:function(){},onApprove:function(){return!0},onDeny:function(){return!0},selector:{close:"> .close",approve:".actions .positive, .actions .approve, .actions .ok",deny:".actions .negative, .actions .deny, .actions .cancel",modal:".ui.modal"},error:{dimmer:"UI Dimmer, a required component is not included in this page",method:"The method you called is not defined.",notFound:"The element you specified could not be found"},className:{active:"active",animating:"animating",blurring:"blurring",inverted:"inverted",loading:"loading",scrolling:"scrolling",undetached:"undetached"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.nag=function(n){var i,o=e(this),a=o.selector||"",r=(new Date).getTime(),s=[],l=arguments[0],c="string"==typeof l,u=[].slice.call(arguments,1);return o.each(function(){var o,d=e.isPlainObject(n)?e.extend(!0,{},e.fn.nag.settings,n):e.extend({},e.fn.nag.settings),f=(d.className,d.selector),m=d.error,g=d.namespace,v="."+g,p=g+"-module",h=e(this),b=(h.find(f.close),e(d.context?d.context:"body")),y=this,x=h.data(p);t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame;o={initialize:function(){o.verbose("Initializing element"),h.on("click"+v,f.close,o.dismiss).data(p,o),d.detachable&&h.parent()[0]!==b[0]&&h.detach().prependTo(b),d.displayTime>0&&setTimeout(o.hide,d.displayTime),o.show()},destroy:function(){o.verbose("Destroying instance"),h.removeData(p).off(v)},show:function(){o.should.show()&&!h.is(":visible")&&(o.debug("Showing nag",d.animation.show),"fade"==d.animation.show?h.fadeIn(d.duration,d.easing):h.slideDown(d.duration,d.easing))},hide:function(){o.debug("Showing nag",d.animation.hide),"fade"==d.animation.show?h.fadeIn(d.duration,d.easing):h.slideUp(d.duration,d.easing)},onHide:function(){o.debug("Removing nag",d.animation.hide),h.remove(),d.onHide&&d.onHide()},dismiss:function(e){d.storageMethod&&o.storage.set(d.key,d.value),o.hide(),e.stopImmediatePropagation(),e.preventDefault()},should:{show:function(){return d.persist?(o.debug("Persistent nag is set, can show nag"),!0):o.storage.get(d.key)!=d.value.toString()?(o.debug("Stored value is not set, can show nag",o.storage.get(d.key)),!0):(o.debug("Stored value is set, cannot show nag",o.storage.get(d.key)),!1)}},get:{storageOptions:function(){var e={};return d.expires&&(e.expires=d.expires),d.domain&&(e.domain=d.domain),d.path&&(e.path=d.path),e}},clear:function(){o.storage.remove(d.key)},storage:{set:function(n,i){var a=o.get.storageOptions();if("localstorage"==d.storageMethod&&void 0!==t.localStorage)t.localStorage.setItem(n,i),o.debug("Value stored using local storage",n,i);else if("sessionstorage"==d.storageMethod&&void 0!==t.sessionStorage)t.sessionStorage.setItem(n,i),o.debug("Value stored using session storage",n,i);else{if(void 0===e.cookie)return void o.error(m.noCookieStorage);e.cookie(n,i,a),o.debug("Value stored using cookie",n,i,a)}},get:function(n,i){var a;return"localstorage"==d.storageMethod&&void 0!==t.localStorage?a=t.localStorage.getItem(n):"sessionstorage"==d.storageMethod&&void 0!==t.sessionStorage?a=t.sessionStorage.getItem(n):void 0!==e.cookie?a=e.cookie(n):o.error(m.noCookieStorage),"undefined"!=a&&"null"!=a&&void 0!==a&&null!==a||(a=void 0),a},remove:function(n){var i=o.get.storageOptions();"localstorage"==d.storageMethod&&void 0!==t.localStorage?t.localStorage.removeItem(n):"sessionstorage"==d.storageMethod&&void 0!==t.sessionStorage?t.sessionStorage.removeItem(n):void 0!==e.cookie?e.removeCookie(n,i):o.error(m.noStorage)}},setting:function(t,n){if(o.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,d,t);else{if(void 0===n)return d[t];e.isPlainObject(d[t])?e.extend(!0,d[t],n):d[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,o,t);else{if(void 0===n)return o[t];o[t]=n}},debug:function(){!d.silent&&d.debug&&(d.performance?o.performance.log(arguments):(o.debug=Function.prototype.bind.call(console.info,console,d.name+":"),o.debug.apply(console,arguments)))},verbose:function(){!d.silent&&d.verbose&&d.debug&&(d.performance?o.performance.log(arguments):(o.verbose=Function.prototype.bind.call(console.info,console,d.name+":"),o.verbose.apply(console,arguments)))},error:function(){d.silent||(o.error=Function.prototype.bind.call(console.error,console,d.name+":"),o.error.apply(console,arguments))},performance:{log:function(e){var t,n;d.performance&&(n=(t=(new Date).getTime())-(r||t),r=t,s.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:y,"Execution Time":n})),clearTimeout(o.performance.timer),o.performance.timer=setTimeout(o.performance.display,500)},display:function(){var t=d.name+":",n=0;r=!1,clearTimeout(o.performance.timer),e.each(s,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",a&&(t+=" '"+a+"'"),(void 0!==console.group||void 0!==console.table)&&s.length>0&&(console.groupCollapsed(t),console.table?console.table(s):e.each(s,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(t,n,a){var r,s,l,c=x;return n=n||u,a=y||a,"string"==typeof t&&void 0!==c&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(n,i){var a=n!=r?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=r)c=c[a];else{if(void 0!==c[a])return s=c[a],!1;if(!e.isPlainObject(c[i])||n==r)return void 0!==c[i]?(s=c[i],!1):(o.error(m.method,t),!1);c=c[i]}})),e.isFunction(s)?l=s.apply(a,n):void 0!==s&&(l=s),e.isArray(i)?i.push(l):void 0!==i?i=[i,l]:void 0!==l&&(i=l),s}},c?(void 0===x&&o.initialize(),o.invoke(l)):(void 0!==x&&x.invoke("destroy"),o.initialize())}),void 0!==i?i:this},e.fn.nag.settings={name:"Nag",silent:!1,debug:!1,verbose:!1,performance:!0,namespace:"Nag",persist:!1,displayTime:0,animation:{show:"slide",hide:"slide"},context:!1,detachable:!1,expires:30,domain:!1,path:"/",storageMethod:"cookie",key:"nag",value:"dismiss",error:{noCookieStorage:"$.cookie is not included. A storage solution is required.",noStorage:"Neither $.cookie or store is defined. A storage solution is required for storing state",method:"The method you called is not defined."},className:{bottom:"bottom",fixed:"fixed"},selector:{close:".close.icon"},speed:500,easing:"easeOutQuad",onHide:function(){}},e.extend(e.easing,{easeOutQuad:function(e,t,n,i,o){return-i*(t/=o)*(t-2)+n}})}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.popup=function(i){var o,a=e(this),r=e(n),s=e(t),l=e("body"),c=a.selector||"",u=(new Date).getTime(),d=[],f=arguments[0],m="string"==typeof f,g=[].slice.call(arguments,1);return a.each(function(){var a,v,p,h,b,y,x=e.isPlainObject(i)?e.extend(!0,{},e.fn.popup.settings,i):e.extend({},e.fn.popup.settings),C=x.selector,w=x.className,k=x.error,S=x.metadata,T=x.namespace,A="."+x.namespace,R="module-"+T,P=e(this),E=e(x.context),F=e(x.scrollContext),O=e(x.boundary),D=x.target?e(x.target):P,q=0,j=!1,z=!1,I=this,M=P.data(R);y={initialize:function(){y.debug("Initializing",P),y.createID(),y.bind.events(),!y.exists()&&x.preserve&&y.create(),x.observeChanges&&y.observeChanges(),y.instantiate()},instantiate:function(){y.verbose("Storing instance",y),M=y,P.data(R,M)},observeChanges:function(){"MutationObserver"in t&&((p=new MutationObserver(y.event.documentChanged)).observe(n,{childList:!0,subtree:!0}),y.debug("Setting up mutation observer",p))},refresh:function(){x.popup?a=e(x.popup).eq(0):x.inline&&(a=D.nextAll(C.popup).eq(0),x.popup=a),x.popup?(a.addClass(w.loading),v=y.get.offsetParent(),a.removeClass(w.loading),x.movePopup&&y.has.popup()&&y.get.offsetParent(a)[0]!==v[0]&&(y.debug("Moving popup to the same offset parent as target"),a.detach().appendTo(v))):v=x.inline?y.get.offsetParent(D):y.has.popup()?y.get.offsetParent(a):l,v.is("html")&&v[0]!==l[0]&&(y.debug("Setting page as offset parent"),v=l),y.get.variation()&&y.set.variation()},reposition:function(){y.refresh(),y.set.position()},destroy:function(){y.debug("Destroying previous module"),p&&p.disconnect(),a&&!x.preserve&&y.removePopup(),clearTimeout(y.hideTimer),clearTimeout(y.showTimer),y.unbind.close(),y.unbind.events(),P.removeData(R)},event:{start:function(t){var n=e.isPlainObject(x.delay)?x.delay.show:x.delay;clearTimeout(y.hideTimer),z||(y.showTimer=setTimeout(y.show,n))},end:function(){var t=e.isPlainObject(x.delay)?x.delay.hide:x.delay;clearTimeout(y.showTimer),y.hideTimer=setTimeout(y.hide,t)},touchstart:function(e){z=!0,y.show()},resize:function(){y.is.visible()&&y.set.position()},documentChanged:function(t){[].forEach.call(t,function(t){t.removedNodes&&[].forEach.call(t.removedNodes,function(t){(t==I||e(t).find(I).length>0)&&(y.debug("Element removed from DOM, tearing down events"),y.destroy())})})},hideGracefully:function(t){var i=e(t.target),o=e.contains(n.documentElement,t.target),a=i.closest(C.popup).length>0;t&&!a&&o?(y.debug("Click occurred outside popup hiding popup"),y.hide()):y.debug("Click was inside popup, keeping popup open")}},create:function(){var t=y.get.html(),n=y.get.title(),i=y.get.content();t||i||n?(y.debug("Creating pop-up html"),t||(t=x.templates.popup({title:n,content:i})),a=e("<div/>").addClass(w.popup).data(S.activator,P).html(t),x.inline?(y.verbose("Inserting popup element inline",a),a.insertAfter(P)):(y.verbose("Appending popup element to body",a),a.appendTo(E)),y.refresh(),y.set.variation(),x.hoverable&&y.bind.popup(),x.onCreate.call(a,I)):0!==D.next(C.popup).length?(y.verbose("Pre-existing popup found"),x.inline=!0,x.popup=D.next(C.popup).data(S.activator,P),y.refresh(),x.hoverable&&y.bind.popup()):x.popup?(e(x.popup).data(S.activator,P),y.verbose("Used popup specified in settings"),y.refresh(),x.hoverable&&y.bind.popup()):y.debug("No content specified skipping display",I)},createID:function(){b=(Math.random().toString(16)+"000000000").substr(2,8),h="."+b,y.verbose("Creating unique id for element",b)},toggle:function(){y.debug("Toggling pop-up"),y.is.hidden()?(y.debug("Popup is hidden, showing pop-up"),y.unbind.close(),y.show()):(y.debug("Popup is visible, hiding pop-up"),y.hide())},show:function(e){if(e=e||function(){},y.debug("Showing pop-up",x.transition),y.is.hidden()&&(!y.is.active()||!y.is.dropdown())){if(y.exists()||y.create(),!1===x.onShow.call(a,I))return void y.debug("onShow callback returned false, cancelling popup animation");x.preserve||x.popup||y.refresh(),a&&y.set.position()&&(y.save.conditions(),x.exclusive&&y.hideAll(),y.animate.show(e))}},hide:function(e){if(e=e||function(){},y.is.visible()||y.is.animating()){if(!1===x.onHide.call(a,I))return void y.debug("onHide callback returned false, cancelling popup animation");y.remove.visible(),y.unbind.close(),y.restore.conditions(),y.animate.hide(e)}},hideAll:function(){e(C.popup).filter("."+w.popupVisible).each(function(){e(this).data(S.activator).popup("hide")})},exists:function(){return!!a&&(x.inline||x.popup?y.has.popup():a.closest(E).length>=1)},removePopup:function(){y.has.popup()&&!x.popup&&(y.debug("Removing popup",a),a.remove(),a=void 0,x.onRemove.call(a,I))},save:{conditions:function(){y.cache={title:P.attr("title")},y.cache.title&&P.removeAttr("title"),y.verbose("Saving original attributes",y.cache.title)}},restore:{conditions:function(){return y.cache&&y.cache.title&&(P.attr("title",y.cache.title),y.verbose("Restoring original attributes",y.cache.title)),!0}},supports:{svg:function(){return"undefined"==typeof SVGGraphicsElement}},animate:{show:function(t){t=e.isFunction(t)?t:function(){},x.transition&&void 0!==e.fn.transition&&P.transition("is supported")?(y.set.visible(),a.transition({animation:x.transition+" in",queue:!1,debug:x.debug,verbose:x.verbose,duration:x.duration,onComplete:function(){y.bind.close(),t.call(a,I),x.onVisible.call(a,I)}})):y.error(k.noTransition)},hide:function(t){t=e.isFunction(t)?t:function(){},y.debug("Hiding pop-up"),!1!==x.onHide.call(a,I)?x.transition&&void 0!==e.fn.transition&&P.transition("is supported")?a.transition({animation:x.transition+" out",queue:!1,duration:x.duration,debug:x.debug,verbose:x.verbose,onComplete:function(){y.reset(),t.call(a,I),x.onHidden.call(a,I)}}):y.error(k.noTransition):y.debug("onHide callback returned false, cancelling popup animation")}},change:{content:function(e){a.html(e)}},get:{html:function(){return P.removeData(S.html),P.data(S.html)||x.html},title:function(){return P.removeData(S.title),P.data(S.title)||x.title},content:function(){return P.removeData(S.content),P.data(S.content)||P.attr("title")||x.content},variation:function(){return P.removeData(S.variation),P.data(S.variation)||x.variation},popup:function(){return a},popupOffset:function(){return a.offset()},calculations:function(){var e,n=D[0],i=O[0]==t,o=x.inline||x.popup&&x.movePopup?D.position():D.offset(),r=i?{top:0,left:0}:O.offset(),l={},c=i?{top:s.scrollTop(),left:s.scrollLeft()}:{top:0,left:0};return l={target:{element:D[0],width:D.outerWidth(),height:D.outerHeight(),top:o.top,left:o.left,margin:{}},popup:{width:a.outerWidth(),height:a.outerHeight()},parent:{width:v.outerWidth(),height:v.outerHeight()},screen:{top:r.top,left:r.left,scroll:{top:c.top,left:c.left},width:O.width(),height:O.height()}},x.setFluidWidth&&y.is.fluid()&&(l.container={width:a.parent().outerWidth()},l.popup.width=l.container.width),l.target.margin.top=x.inline?parseInt(t.getComputedStyle(n).getPropertyValue("margin-top"),10):0,l.target.margin.left=x.inline?y.is.rtl()?parseInt(t.getComputedStyle(n).getPropertyValue("margin-right"),10):parseInt(t.getComputedStyle(n).getPropertyValue("margin-left"),10):0,e=l.screen,l.boundary={top:e.top+e.scroll.top,bottom:e.top+e.scroll.top+e.height,left:e.left+e.scroll.left,right:e.left+e.scroll.left+e.width},l},id:function(){return b},startEvent:function(){return"hover"==x.on?"mouseenter":"focus"==x.on&&"focus"},scrollEvent:function(){return"scroll"},endEvent:function(){return"hover"==x.on?"mouseleave":"focus"==x.on&&"blur"},distanceFromBoundary:function(e,t){var n,i,o={};return t=t||y.get.calculations(),n=t.popup,i=t.boundary,e&&(o={top:e.top-i.top,left:e.left-i.left,right:i.right-(e.left+n.width),bottom:i.bottom-(e.top+n.height)},y.verbose("Distance from boundaries determined",e,o)),o},offsetParent:function(t){var n=(void 0!==t?t[0]:P[0]).parentNode,i=e(n);if(n)for(var o="none"===i.css("transform"),a="static"===i.css("position"),r=i.is("html");n&&!r&&a&&o;)n=n.parentNode,o="none"===(i=e(n)).css("transform"),a="static"===i.css("position"),r=i.is("html");return i&&i.length>0?i:e()},positions:function(){return{"top left":!1,"top center":!1,"top right":!1,"bottom left":!1,"bottom center":!1,"bottom right":!1,"left center":!1,"right center":!1}},nextPosition:function(e){var t=e.split(" "),n=t[0],i=t[1],o={top:"bottom",bottom:"top",left:"right",right:"left"},a={left:"center",center:"right",right:"left"},r={"top left":"top center","top center":"top right","top right":"right center","right center":"bottom right","bottom right":"bottom center","bottom center":"bottom left","bottom left":"left center","left center":"top left"},s="top"==n||"bottom"==n,l=!1,c=!1,u=!1;return j||(y.verbose("All available positions available"),j=y.get.positions()),y.debug("Recording last position tried",e),j[e]=!0,"opposite"===x.prefer&&(u=(u=[o[n],i]).join(" "),l=!0===j[u],y.debug("Trying opposite strategy",u)),"adjacent"===x.prefer&&s&&(u=(u=[n,a[i]]).join(" "),c=!0===j[u],y.debug("Trying adjacent strategy",u)),(c||l)&&(y.debug("Using backup position",u),u=r[e]),u}},set:{position:function(e,t){if(0!==D.length&&0!==a.length){var n,i,o,r,s,l,c,u;if(t=t||y.get.calculations(),e=e||P.data(S.position)||x.position,n=P.data(S.offset)||x.offset,i=x.distanceAway,o=t.target,r=t.popup,s=t.parent,0===o.width&&0===o.height&&!y.is.svg(o.element))return y.debug("Popup target is hidden, no action taken"),!1;switch(x.inline&&(y.debug("Adding margin to calculation",o.margin),"left center"==e||"right center"==e?(n+=o.margin.top,i+=-o.margin.left):"top left"==e||"top center"==e||"top right"==e?(n+=o.margin.left,i-=o.margin.top):(n+=o.margin.left,i+=o.margin.top)),y.debug("Determining popup position from calculations",e,t),y.is.rtl()&&(e=e.replace(/left|right/g,function(e){return"left"==e?"right":"left"}),y.debug("RTL: Popup position updated",e)),q==x.maxSearchDepth&&"string"==typeof x.lastResort&&(e=x.lastResort),e){case"top left":l={top:"auto",bottom:s.height-o.top+i,left:o.left+n,right:"auto"};break;case"top center":l={bottom:s.height-o.top+i,left:o.left+o.width/2-r.width/2+n,top:"auto",right:"auto"};break;case"top right":l={bottom:s.height-o.top+i,right:s.width-o.left-o.width-n,top:"auto",left:"auto"};break;case"left center":l={top:o.top+o.height/2-r.height/2+n,right:s.width-o.left+i,left:"auto",bottom:"auto"};break;case"right center":l={top:o.top+o.height/2-r.height/2+n,left:o.left+o.width+i,bottom:"auto",right:"auto"};break;case"bottom left":l={top:o.top+o.height+i,left:o.left+n,bottom:"auto",right:"auto"};break;case"bottom center":l={top:o.top+o.height+i,left:o.left+o.width/2-r.width/2+n,bottom:"auto",right:"auto"};break;case"bottom right":l={top:o.top+o.height+i,right:s.width-o.left-o.width-n,left:"auto",bottom:"auto"}}if(void 0===l&&y.error(k.invalidPosition,e),y.debug("Calculated popup positioning values",l),a.css(l).removeClass(w.position).addClass(e).addClass(w.loading),c=y.get.popupOffset(),u=y.get.distanceFromBoundary(c,t),y.is.offstage(u,e)){if(y.debug("Position is outside viewport",e),q<x.maxSearchDepth)return q++,e=y.get.nextPosition(e),y.debug("Trying new position",e),!!a&&y.set.position(e,t);if(!x.lastResort)return y.debug("Popup could not find a position to display",a),y.error(k.cannotPlace,I),y.remove.attempts(),y.remove.loading(),y.reset(),x.onUnplaceable.call(a,I),!1;y.debug("No position found, showing with last position")}return y.debug("Position is on stage",e),y.remove.attempts(),y.remove.loading(),x.setFluidWidth&&y.is.fluid()&&y.set.fluidWidth(t),!0}y.error(k.notFound)},fluidWidth:function(e){e=e||y.get.calculations(),y.debug("Automatically setting element width to parent width",e.parent.width),a.css("width",e.container.width)},variation:function(e){(e=e||y.get.variation())&&y.has.popup()&&(y.verbose("Adding variation to popup",e),a.addClass(e))},visible:function(){P.addClass(w.visible)}},remove:{loading:function(){a.removeClass(w.loading)},variation:function(e){(e=e||y.get.variation())&&(y.verbose("Removing variation",e),a.removeClass(e))},visible:function(){P.removeClass(w.visible)},attempts:function(){y.verbose("Resetting all searched positions"),q=0,j=!1}},bind:{events:function(){y.debug("Binding popup events to module"),"click"==x.on&&P.on("click"+A,y.toggle),"hover"==x.on&&P.on("touchstart"+A,y.event.touchstart),y.get.startEvent()&&P.on(y.get.startEvent()+A,y.event.start).on(y.get.endEvent()+A,y.event.end),x.target&&y.debug("Target set to element",D),s.on("resize"+h,y.event.resize)},popup:function(){y.verbose("Allowing hover events on popup to prevent closing"),a&&y.has.popup()&&a.on("mouseenter"+A,y.event.start).on("mouseleave"+A,y.event.end)},close:function(){(!0===x.hideOnScroll||"auto"==x.hideOnScroll&&"click"!=x.on)&&y.bind.closeOnScroll(),"hover"==x.on&&z&&y.bind.touchClose(),"click"==x.on&&x.closable&&y.bind.clickaway()},closeOnScroll:function(){y.verbose("Binding scroll close event to document"),F.one(y.get.scrollEvent()+h,y.event.hideGracefully)},touchClose:function(){y.verbose("Binding popup touchclose event to document"),r.on("touchstart"+h,function(e){y.verbose("Touched away from popup"),y.event.hideGracefully.call(I,e)})},clickaway:function(){y.verbose("Binding popup close event to document"),r.on("click"+h,function(e){y.verbose("Clicked away from popup"),y.event.hideGracefully.call(I,e)})}},unbind:{events:function(){s.off(h),P.off(A)},close:function(){r.off(h),F.off(h)}},has:{popup:function(){return a&&a.length>0}},is:{offstage:function(t,n){var i=[];return e.each(t,function(e,t){t<-x.jitter&&(y.debug("Position exceeds allowable distance from edge",e,t,n),i.push(e))}),i.length>0},svg:function(e){return y.supports.svg()&&e instanceof SVGGraphicsElement},active:function(){return P.hasClass(w.active)},animating:function(){return void 0!==a&&a.hasClass(w.animating)},fluid:function(){return void 0!==a&&a.hasClass(w.fluid)},visible:function(){return void 0!==a&&a.hasClass(w.popupVisible)},dropdown:function(){return P.hasClass(w.dropdown)},hidden:function(){return!y.is.visible()},rtl:function(){return"rtl"==P.css("direction")}},reset:function(){y.remove.visible(),x.preserve?void 0!==e.fn.transition&&a.transition("remove transition"):y.removePopup()},setting:function(t,n){if(e.isPlainObject(t))e.extend(!0,x,t);else{if(void 0===n)return x[t];x[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,y,t);else{if(void 0===n)return y[t];y[t]=n}},debug:function(){!x.silent&&x.debug&&(x.performance?y.performance.log(arguments):(y.debug=Function.prototype.bind.call(console.info,console,x.name+":"),y.debug.apply(console,arguments)))},verbose:function(){!x.silent&&x.verbose&&x.debug&&(x.performance?y.performance.log(arguments):(y.verbose=Function.prototype.bind.call(console.info,console,x.name+":"),y.verbose.apply(console,arguments)))},error:function(){x.silent||(y.error=Function.prototype.bind.call(console.error,console,x.name+":"),y.error.apply(console,arguments))},performance:{log:function(e){var t,n;x.performance&&(n=(t=(new Date).getTime())-(u||t),u=t,d.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:I,"Execution Time":n})),clearTimeout(y.performance.timer),y.performance.timer=setTimeout(y.performance.display,500)},display:function(){var t=x.name+":",n=0;u=!1,clearTimeout(y.performance.timer),e.each(d,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",c&&(t+=" '"+c+"'"),(void 0!==console.group||void 0!==console.table)&&d.length>0&&(console.groupCollapsed(t),console.table?console.table(d):e.each(d,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),d=[]}},invoke:function(t,n,i){var a,r,s,l=M;return n=n||g,i=I||i,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]&&(r=l[i],!1);l=l[i]}})),e.isFunction(r)?s=r.apply(i,n):void 0!==r&&(s=r),e.isArray(o)?o.push(s):void 0!==o?o=[o,s]:void 0!==s&&(o=s),r}},m?(void 0===M&&y.initialize(),y.invoke(f)):(void 0!==M&&M.invoke("destroy"),y.initialize())}),void 0!==o?o:this},e.fn.popup.settings={name:"Popup",silent:!1,debug:!1,verbose:!1,performance:!0,namespace:"popup",observeChanges:!0,onCreate:function(){},onRemove:function(){},onShow:function(){},onVisible:function(){},onHide:function(){},onUnplaceable:function(){},onHidden:function(){},on:"hover",boundary:t,addTouchEvents:!0,position:"top left",variation:"",movePopup:!0,target:!1,popup:!1,inline:!1,preserve:!1,hoverable:!1,content:!1,html:!1,title:!1,closable:!0,hideOnScroll:"auto",exclusive:!1,context:"body",scrollContext:t,prefer:"opposite",lastResort:!1,delay:{show:50,hide:70},setFluidWidth:!0,duration:200,transition:"scale",distanceAway:0,jitter:2,offset:0,maxSearchDepth:15,error:{invalidPosition:"The position you specified is not a valid position",cannotPlace:"Popup does not fit within the boundaries of the viewport",method:"The method you called is not defined.",noTransition:"This module requires ui transitions <https://github.com/Semantic-Org/UI-Transition>",notFound:"The target or popup you specified does not exist on the page"},metadata:{activator:"activator",content:"content",html:"html",offset:"offset",position:"position",title:"title",variation:"variation"},className:{active:"active",animating:"animating",dropdown:"dropdown",fluid:"fluid",loading:"loading",popup:"ui popup",position:"top left center bottom right",visible:"visible",popupVisible:"visible"},selector:{popup:".ui.popup"},templates:{escape:function(e){var t=/[&<>"'`]/g,n={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"};return/[&<>"'`]/.test(e)?e.replace(t,function(e){return n[e]}):e},popup:function(t){var n="",i=e.fn.popup.settings.templates.escape;return void 0!==typeof t&&(void 0!==typeof t.title&&t.title&&(t.title=i(t.title),n+='<div class="header">'+t.title+"</div>"),void 0!==typeof t.content&&t.content&&(t.content=i(t.content),n+='<div class="content">'+t.content+"</div>")),n}}}}(jQuery,window,document),function(e,t,n,i){"use strict";void 0!==(t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")())&&t.Math==Math||("undefined"!=typeof self&&self.Math==Math?self:Function("return this")());e.fn.progress=function(t){var i,o=e(this),a=o.selector||"",r=(new Date).getTime(),s=[],l=arguments[0],c="string"==typeof l,u=[].slice.call(arguments,1);return o.each(function(){var o,d,f=e.isPlainObject(t)?e.extend(!0,{},e.fn.progress.settings,t):e.extend({},e.fn.progress.settings),m=f.className,g=f.metadata,v=f.namespace,p=f.selector,h=f.error,b="."+v,y="module-"+v,x=e(this),C=e(this).find(p.bar),w=e(this).find(p.progress),k=e(this).find(p.label),S=this,T=x.data(y),A=!1;d={initialize:function(){d.debug("Initializing progress bar",f),d.set.duration(),d.set.transitionEvent(),d.read.metadata(),d.read.settings(),d.instantiate()},instantiate:function(){d.verbose("Storing instance of progress",d),T=d,x.data(y,d)},destroy:function(){d.verbose("Destroying previous progress for",x),clearInterval(T.interval),d.remove.state(),x.removeData(y),T=void 0},reset:function(){d.remove.nextValue(),d.update.progress(0)},complete:function(){(void 0===d.percent||d.percent<100)&&(d.remove.progressPoll(),d.set.percent(100))},read:{metadata:function(){var e={percent:x.data(g.percent),total:x.data(g.total),value:x.data(g.value)};e.percent&&(d.debug("Current percent value set from metadata",e.percent),d.set.percent(e.percent)),e.total&&(d.debug("Total value set from metadata",e.total),d.set.total(e.total)),e.value&&(d.debug("Current value set from metadata",e.value),d.set.value(e.value),d.set.progress(e.value))},settings:function(){!1!==f.total&&(d.debug("Current total set in settings",f.total),d.set.total(f.total)),!1!==f.value&&(d.debug("Current value set in settings",f.value),d.set.value(f.value),d.set.progress(d.value)),!1!==f.percent&&(d.debug("Current percent set in settings",f.percent),d.set.percent(f.percent))}},bind:{transitionEnd:function(e){var t=d.get.transitionEnd();C.one(t+b,function(t){clearTimeout(d.failSafeTimer),e.call(this,t)}),d.failSafeTimer=setTimeout(function(){C.triggerHandler(t)},f.duration+f.failSafeDelay),d.verbose("Adding fail safe timer",d.timer)}},increment:function(e){var t,n;d.has.total()?n=(t=d.get.value())+(e=e||1):(n=(t=d.get.percent())+(e=e||d.get.randomValue()),100,d.debug("Incrementing percentage by",t,n)),n=d.get.normalizedValue(n),d.set.progress(n)},decrement:function(e){var t,n;d.get.total()?(n=(t=d.get.value())-(e=e||1),d.debug("Decrementing value by",e,t)):(n=(t=d.get.percent())-(e=e||d.get.randomValue()),d.debug("Decrementing percentage by",e,t)),n=d.get.normalizedValue(n),d.set.progress(n)},has:{progressPoll:function(){return d.progressPoll},total:function(){return!1!==d.get.total()}},get:{text:function(e){var t=d.value||0,n=d.total||0,i=A?d.get.displayPercent():d.percent||0,o=d.total>0?n-t:100-i;return e=e||"",e=e.replace("{value}",t).replace("{total}",n).replace("{left}",o).replace("{percent}",i),d.verbose("Adding variables to progress bar text",e),e},normalizedValue:function(e){if(e<0)return d.debug("Value cannot decrement below 0"),0;if(d.has.total()){if(e>d.total)return d.debug("Value cannot increment above total",d.total),d.total}else if(e>100)return d.debug("Value cannot increment above 100 percent"),100;return e},updateInterval:function(){return"auto"==f.updateInterval?f.duration:f.updateInterval},randomValue:function(){return d.debug("Generating random increment percentage"),Math.floor(Math.random()*f.random.max+f.random.min)},numericValue:function(e){return"string"==typeof e?""!==e.replace(/[^\d.]/g,"")&&+e.replace(/[^\d.]/g,""):e},transitionEnd:function(){var e,t=n.createElement("element"),i={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(e in i)if(void 0!==t.style[e])return i[e]},displayPercent:function(){var e=C.width(),t=x.width(),n=e>parseInt(C.css("min-width"),10)?e/t*100:d.percent;return f.precision>0?Math.round(n*(10*f.precision))/(10*f.precision):Math.round(n)},percent:function(){return d.percent||0},value:function(){return d.nextValue||d.value||0},total:function(){return d.total||!1}},create:{progressPoll:function(){d.progressPoll=setTimeout(function(){d.update.toNextValue(),d.remove.progressPoll()},d.get.updateInterval())}},is:{complete:function(){return d.is.success()||d.is.warning()||d.is.error()},success:function(){return x.hasClass(m.success)},warning:function(){return x.hasClass(m.warning)},error:function(){return x.hasClass(m.error)},active:function(){return x.hasClass(m.active)},visible:function(){return x.is(":visible")}},remove:{progressPoll:function(){d.verbose("Removing progress poll timer"),d.progressPoll&&(clearTimeout(d.progressPoll),delete d.progressPoll)},nextValue:function(){d.verbose("Removing progress value stored for next update"),delete d.nextValue},state:function(){d.verbose("Removing stored state"),delete d.total,delete d.percent,delete d.value},active:function(){d.verbose("Removing active state"),x.removeClass(m.active)},success:function(){d.verbose("Removing success state"),x.removeClass(m.success)},warning:function(){d.verbose("Removing warning state"),x.removeClass(m.warning)},error:function(){d.verbose("Removing error state"),x.removeClass(m.error)}},set:{barWidth:function(e){e>100?d.error(h.tooHigh,e):e<0?d.error(h.tooLow,e):(C.css("width",e+"%"),x.attr("data-percent",parseInt(e,10)))},duration:function(e){e="number"==typeof(e=e||f.duration)?e+"ms":e,d.verbose("Setting progress bar transition duration",e),C.css({"transition-duration":e})},percent:function(e){e="string"==typeof e?+e.replace("%",""):e,e=f.precision>0?Math.round(e*(10*f.precision))/(10*f.precision):Math.round(e),d.percent=e,d.has.total()||(d.value=f.precision>0?Math.round(e/100*d.total*(10*f.precision))/(10*f.precision):Math.round(e/100*d.total*10)/10,f.limitValues&&(d.value=d.value>100?100:d.value<0?0:d.value)),d.set.barWidth(e),d.set.labelInterval(),d.set.labels(),f.onChange.call(S,e,d.value,d.total)},labelInterval:function(){clearInterval(d.interval),d.bind.transitionEnd(function(){d.verbose("Bar finished animating, removing continuous label updates"),clearInterval(d.interval),A=!1,d.set.labels()}),A=!0,d.interval=setInterval(function(){e.contains(n.documentElement,S)||(clearInterval(d.interval),A=!1),d.set.labels()},f.framerate)},labels:function(){d.verbose("Setting both bar progress and outer label text"),d.set.barLabel(),d.set.state()},label:function(e){(e=e||"")&&(e=d.get.text(e),d.verbose("Setting label to text",e),k.text(e))},state:function(e){100===(e=void 0!==e?e:d.percent)?f.autoSuccess&&!(d.is.warning()||d.is.error()||d.is.success())?(d.set.success(),d.debug("Automatically triggering success at 100%")):(d.verbose("Reached 100% removing active state"),d.remove.active(),d.remove.progressPoll()):e>0?(d.verbose("Adjusting active progress bar label",e),d.set.active()):(d.remove.active(),d.set.label(f.text.active))},barLabel:function(e){void 0!==e?w.text(d.get.text(e)):"ratio"==f.label&&d.total?(d.verbose("Adding ratio to bar label"),w.text(d.get.text(f.text.ratio))):"percent"==f.label&&(d.verbose("Adding percentage to bar label"),w.text(d.get.text(f.text.percent)))},active:function(e){e=e||f.text.active,d.debug("Setting active state"),f.showActivity&&!d.is.active()&&x.addClass(m.active),d.remove.warning(),d.remove.error(),d.remove.success(),(e=f.onLabelUpdate("active",e,d.value,d.total))&&d.set.label(e),d.bind.transitionEnd(function(){f.onActive.call(S,d.value,d.total)})},success:function(e){e=e||f.text.success||f.text.active,d.debug("Setting success state"),x.addClass(m.success),d.remove.active(),d.remove.warning(),d.remove.error(),d.complete(),f.text.success?(e=f.onLabelUpdate("success",e,d.value,d.total),d.set.label(e)):(e=f.onLabelUpdate("active",e,d.value,d.total),d.set.label(e)),d.bind.transitionEnd(function(){f.onSuccess.call(S,d.total)})},warning:function(e){e=e||f.text.warning,d.debug("Setting warning state"),x.addClass(m.warning),d.remove.active(),d.remove.success(),d.remove.error(),d.complete(),(e=f.onLabelUpdate("warning",e,d.value,d.total))&&d.set.label(e),d.bind.transitionEnd(function(){f.onWarning.call(S,d.value,d.total)})},error:function(e){e=e||f.text.error,d.debug("Setting error state"),x.addClass(m.error),d.remove.active(),d.remove.success(),d.remove.warning(),d.complete(),(e=f.onLabelUpdate("error",e,d.value,d.total))&&d.set.label(e),d.bind.transitionEnd(function(){f.onError.call(S,d.value,d.total)})},transitionEvent:function(){o=d.get.transitionEnd()},total:function(e){d.total=e},value:function(e){d.value=e},progress:function(e){d.has.progressPoll()?(d.debug("Updated within interval, setting next update to use new value",e),d.set.nextValue(e)):(d.debug("First update in progress update interval, immediately updating",e),d.update.progress(e),d.create.progressPoll())},nextValue:function(e){d.nextValue=e}},update:{toNextValue:function(){var e=d.nextValue;e&&(d.debug("Update interval complete using last updated value",e),d.update.progress(e),d.remove.nextValue())},progress:function(e){var t;!1===(e=d.get.numericValue(e))&&d.error(h.nonNumeric,e),e=d.get.normalizedValue(e),d.has.total()?(d.set.value(e),t=e/d.total*100,d.debug("Calculating percent complete from total",t),d.set.percent(t)):(t=e,d.debug("Setting value to exact percentage value",t),d.set.percent(t))}},setting:function(t,n){if(d.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,f,t);else{if(void 0===n)return f[t];e.isPlainObject(f[t])?e.extend(!0,f[t],n):f[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,d,t);else{if(void 0===n)return d[t];d[t]=n}},debug:function(){!f.silent&&f.debug&&(f.performance?d.performance.log(arguments):(d.debug=Function.prototype.bind.call(console.info,console,f.name+":"),d.debug.apply(console,arguments)))},verbose:function(){!f.silent&&f.verbose&&f.debug&&(f.performance?d.performance.log(arguments):(d.verbose=Function.prototype.bind.call(console.info,console,f.name+":"),d.verbose.apply(console,arguments)))},error:function(){f.silent||(d.error=Function.prototype.bind.call(console.error,console,f.name+":"),d.error.apply(console,arguments))},performance:{log:function(e){var t,n;f.performance&&(n=(t=(new Date).getTime())-(r||t),r=t,s.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:S,"Execution Time":n})),clearTimeout(d.performance.timer),d.performance.timer=setTimeout(d.performance.display,500)},display:function(){var t=f.name+":",n=0;r=!1,clearTimeout(d.performance.timer),e.each(s,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",a&&(t+=" '"+a+"'"),(void 0!==console.group||void 0!==console.table)&&s.length>0&&(console.groupCollapsed(t),console.table?console.table(s):e.each(s,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(t,n,o){var a,r,s,l=T;return n=n||u,o=S||o,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]?(r=l[i],!1):(d.error(h.method,t),!1);l=l[i]}})),e.isFunction(r)?s=r.apply(o,n):void 0!==r&&(s=r),e.isArray(i)?i.push(s):void 0!==i?i=[i,s]:void 0!==s&&(i=s),r}},c?(void 0===T&&d.initialize(),d.invoke(l)):(void 0!==T&&T.invoke("destroy"),d.initialize())}),void 0!==i?i:this},e.fn.progress.settings={name:"Progress",namespace:"progress",silent:!1,debug:!1,verbose:!1,performance:!0,random:{min:2,max:5},duration:300,updateInterval:"auto",autoSuccess:!0,showActivity:!0,limitValues:!0,label:"percent",precision:0,framerate:1e3/30,percent:!1,total:!1,value:!1,failSafeDelay:100,onLabelUpdate:function(e,t,n,i){return t},onChange:function(e,t,n){},onSuccess:function(e){},onActive:function(e,t){},onError:function(e,t){},onWarning:function(e,t){},error:{method:"The method you called is not defined.",nonNumeric:"Progress value is non numeric",tooHigh:"Value specified is above 100%",tooLow:"Value specified is below 0%"},regExp:{variable:/\{\$*[A-z0-9]+\}/g},metadata:{percent:"percent",total:"total",value:"value"},selector:{bar:"> .bar",label:"> .label",progress:".bar > .progress"},text:{active:!1,error:!1,success:!1,warning:!1,percent:"{percent}%",ratio:"{value} of {total}"},className:{active:"active",error:"error",success:"success",warning:"warning"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.rating=function(t){var n,i=e(this),o=i.selector||"",a=(new Date).getTime(),r=[],s=arguments[0],l="string"==typeof s,c=[].slice.call(arguments,1);return i.each(function(){var u,d,f=e.isPlainObject(t)?e.extend(!0,{},e.fn.rating.settings,t):e.extend({},e.fn.rating.settings),m=f.namespace,g=f.className,v=f.metadata,p=f.selector,h=(f.error,"."+m),b="module-"+m,y=this,x=e(this).data(b),C=e(this),w=C.find(p.icon);d={initialize:function(){d.verbose("Initializing rating module",f),0===w.length&&d.setup.layout(),f.interactive?d.enable():d.disable(),d.set.initialLoad(),d.set.rating(d.get.initialRating()),d.remove.initialLoad(),d.instantiate()},instantiate:function(){d.verbose("Instantiating module",f),x=d,C.data(b,d)},destroy:function(){d.verbose("Destroying previous instance",x),d.remove.events(),C.removeData(b)},refresh:function(){w=C.find(p.icon)},setup:{layout:function(){var t=d.get.maxRating(),n=e.fn.rating.settings.templates.icon(t);d.debug("Generating icon html dynamically"),C.html(n),d.refresh()}},event:{mouseenter:function(){var t=e(this);t.nextAll().removeClass(g.selected),C.addClass(g.selected),t.addClass(g.selected).prevAll().addClass(g.selected)},mouseleave:function(){C.removeClass(g.selected),w.removeClass(g.selected)},click:function(){var t=e(this),n=d.get.rating(),i=w.index(t)+1;("auto"==f.clearable?1===w.length:f.clearable)&&n==i?d.clearRating():d.set.rating(i)}},clearRating:function(){d.debug("Clearing current rating"),d.set.rating(0)},bind:{events:function(){d.verbose("Binding events"),C.on("mouseenter"+h,p.icon,d.event.mouseenter).on("mouseleave"+h,p.icon,d.event.mouseleave).on("click"+h,p.icon,d.event.click)}},remove:{events:function(){d.verbose("Removing events"),C.off(h)},initialLoad:function(){u=!1}},enable:function(){d.debug("Setting rating to interactive mode"),d.bind.events(),C.removeClass(g.disabled)},disable:function(){d.debug("Setting rating to read-only mode"),d.remove.events(),C.addClass(g.disabled)},is:{initialLoad:function(){return u}},get:{initialRating:function(){return void 0!==C.data(v.rating)?(C.removeData(v.rating),C.data(v.rating)):f.initialRating},maxRating:function(){return void 0!==C.data(v.maxRating)?(C.removeData(v.maxRating),C.data(v.maxRating)):f.maxRating},rating:function(){var e=w.filter("."+g.active).length;return d.verbose("Current rating retrieved",e),e}},set:{rating:function(e){var t=e-1>=0?e-1:0,n=w.eq(t);C.removeClass(g.selected),w.removeClass(g.selected).removeClass(g.active),e>0&&(d.verbose("Setting current rating to",e),n.prevAll().addBack().addClass(g.active)),d.is.initialLoad()||f.onRate.call(y,e)},initialLoad:function(){u=!0}},setting:function(t,n){if(d.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,f,t);else{if(void 0===n)return f[t];e.isPlainObject(f[t])?e.extend(!0,f[t],n):f[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,d,t);else{if(void 0===n)return d[t];d[t]=n}},debug:function(){!f.silent&&f.debug&&(f.performance?d.performance.log(arguments):(d.debug=Function.prototype.bind.call(console.info,console,f.name+":"),d.debug.apply(console,arguments)))},verbose:function(){!f.silent&&f.verbose&&f.debug&&(f.performance?d.performance.log(arguments):(d.verbose=Function.prototype.bind.call(console.info,console,f.name+":"),d.verbose.apply(console,arguments)))},error:function(){f.silent||(d.error=Function.prototype.bind.call(console.error,console,f.name+":"),d.error.apply(console,arguments))},performance:{log:function(e){var t,n;f.performance&&(n=(t=(new Date).getTime())-(a||t),a=t,r.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:y,"Execution Time":n})),clearTimeout(d.performance.timer),d.performance.timer=setTimeout(d.performance.display,500)},display:function(){var t=f.name+":",n=0;a=!1,clearTimeout(d.performance.timer),e.each(r,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",o&&(t+=" '"+o+"'"),i.length>1&&(t+=" ("+i.length+")"),(void 0!==console.group||void 0!==console.table)&&r.length>0&&(console.groupCollapsed(t),console.table?console.table(r):e.each(r,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),r=[]}},invoke:function(t,i,o){var a,r,s,l=x;return i=i||c,o=y||o,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]&&(r=l[i],!1);l=l[i]}})),e.isFunction(r)?s=r.apply(o,i):void 0!==r&&(s=r),e.isArray(n)?n.push(s):void 0!==n?n=[n,s]:void 0!==s&&(n=s),r}},l?(void 0===x&&d.initialize(),d.invoke(s)):(void 0!==x&&x.invoke("destroy"),d.initialize())}),void 0!==n?n:this},e.fn.rating.settings={name:"Rating",namespace:"rating",slent:!1,debug:!1,verbose:!1,performance:!0,initialRating:0,interactive:!0,maxRating:4,clearable:"auto",fireOnInit:!1,onRate:function(e){},error:{method:"The method you called is not defined",noMaximum:"No maximum rating specified. Cannot generate HTML automatically"},metadata:{rating:"rating",maxRating:"maxRating"},className:{active:"active",disabled:"disabled",selected:"selected",loading:"loading"},selector:{icon:".icon"},templates:{icon:function(e){for(var t=1,n="";t<=e;)n+='<i class="icon"></i>',t++;return n}}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.search=function(i){var o,a=e(this),r=a.selector||"",s=(new Date).getTime(),l=[],c=arguments[0],u="string"==typeof c,d=[].slice.call(arguments,1);return e(this).each(function(){var f,m=e.isPlainObject(i)?e.extend(!0,{},e.fn.search.settings,i):e.extend({},e.fn.search.settings),g=m.className,v=m.metadata,p=m.regExp,h=m.fields,b=m.selector,y=m.error,x=m.namespace,C="."+x,w=x+"-module",k=e(this),S=k.find(b.prompt),T=k.find(b.searchButton),A=k.find(b.results),R=k.find(b.result),P=k.find(b.category),E=this,F=k.data(w),O=!1,D=!1;f={initialize:function(){f.verbose("Initializing module"),f.determine.searchFields(),f.bind.events(),f.set.type(),f.create.results(),f.instantiate()},instantiate:function(){f.verbose("Storing instance of module",f),F=f,k.data(w,f)},destroy:function(){f.verbose("Destroying instance"),k.off(C).removeData(w)},refresh:function(){f.debug("Refreshing selector cache"),S=k.find(b.prompt),T=k.find(b.searchButton),P=k.find(b.category),A=k.find(b.results),R=k.find(b.result)},refreshResults:function(){A=k.find(b.results),R=k.find(b.result)},bind:{events:function(){f.verbose("Binding events to search"),m.automatic&&(k.on(f.get.inputEvent()+C,b.prompt,f.event.input),S.attr("autocomplete","off")),k.on("focus"+C,b.prompt,f.event.focus).on("blur"+C,b.prompt,f.event.blur).on("keydown"+C,b.prompt,f.handleKeyboard).on("click"+C,b.searchButton,f.query).on("mousedown"+C,b.results,f.event.result.mousedown).on("mouseup"+C,b.results,f.event.result.mouseup).on("click"+C,b.result,f.event.result.click)}},determine:{searchFields:function(){i&&void 0!==i.searchFields&&(m.searchFields=i.searchFields)}},event:{input:function(){m.searchDelay?(clearTimeout(f.timer),f.timer=setTimeout(function(){f.is.focused()&&f.query()},m.searchDelay)):f.query()},focus:function(){f.set.focus(),m.searchOnFocus&&f.has.minimumCharacters()&&f.query(function(){f.can.show()&&f.showResults()})},blur:function(e){var t=function(){f.cancel.query(),f.remove.focus(),f.timer=setTimeout(f.hideResults,m.hideDelay)};n.activeElement===this||(D=!1,f.resultsClicked?(f.debug("Determining if user action caused search to close"),k.one("click.close"+C,b.results,function(e){f.is.inMessage(e)||O?S.focus():(O=!1,f.is.animating()||f.is.hidden()||t())})):(f.debug("Input blurred without user action, closing results"),t()))},result:{mousedown:function(){f.resultsClicked=!0},mouseup:function(){f.resultsClicked=!1},click:function(n){f.debug("Search result selected");var i=e(this),o=i.find(b.title).eq(0),a=i.is("a[href]")?i:i.find("a[href]").eq(0),r=a.attr("href")||!1,s=a.attr("target")||!1,l=(o.html(),o.length>0&&o.text()),c=f.get.results(),u=i.data(v.result)||f.get.result(l,c);if(e.isFunction(m.onSelect)&&!1===m.onSelect.call(E,u,c))return f.debug("Custom onSelect callback cancelled default select action"),void(O=!0);f.hideResults(),l&&f.set.value(l),r&&(f.verbose("Opening search link found in result",a),"_blank"==s||n.ctrlKey?t.open(r):t.location.href=r)}}},handleKeyboard:function(e){var t,n=k.find(b.result),i=k.find(b.category),o=n.filter("."+g.active),a=n.index(o),r=n.length,s=o.length>0,l=e.which,c={backspace:8,enter:13,escape:27,upArrow:38,downArrow:40};if(l==c.escape&&(f.verbose("Escape key pressed, blurring search field"),f.hideResults(),D=!0),f.is.visible())if(l==c.enter){if(f.verbose("Enter key pressed, selecting active result"),n.filter("."+g.active).length>0)return f.event.result.click.call(n.filter("."+g.active),e),e.preventDefault(),!1}else l==c.upArrow&&s?(f.verbose("Up key pressed, changing active result"),t=a-1<0?a:a-1,i.removeClass(g.active),n.removeClass(g.active).eq(t).addClass(g.active).closest(i).addClass(g.active),e.preventDefault()):l==c.downArrow&&(f.verbose("Down key pressed, changing active result"),t=a+1>=r?a:a+1,i.removeClass(g.active),n.removeClass(g.active).eq(t).addClass(g.active).closest(i).addClass(g.active),e.preventDefault());else l==c.enter&&(f.verbose("Enter key pressed, executing query"),f.query(),f.set.buttonPressed(),S.one("keyup",f.remove.buttonFocus))},setup:{api:function(t,n){var i={debug:m.debug,on:!1,cache:!0,action:"search",urlData:{query:t},onSuccess:function(e){f.parse.response.call(E,e,t),n()},onFailure:function(){f.displayMessage(y.serverError),n()},onAbort:function(e){},onError:f.error};e.extend(!0,i,m.apiSettings),f.verbose("Setting up API request",i),k.api(i)}},can:{useAPI:function(){return void 0!==e.fn.api},show:function(){return f.is.focused()&&!f.is.visible()&&!f.is.empty()},transition:function(){return m.transition&&void 0!==e.fn.transition&&k.transition("is supported")}},is:{animating:function(){return A.hasClass(g.animating)},hidden:function(){return A.hasClass(g.hidden)},inMessage:function(t){if(t.target){var i=e(t.target);return e.contains(n.documentElement,t.target)&&i.closest(b.message).length>0}},empty:function(){return""===A.html()},visible:function(){return A.filter(":visible").length>0},focused:function(){return S.filter(":focus").length>0}},get:{inputEvent:function(){var e=S[0];return void 0!==e&&void 0!==e.oninput?"input":void 0!==e&&void 0!==e.onpropertychange?"propertychange":"keyup"},value:function(){return S.val()},results:function(){return k.data(v.results)},result:function(t,n){var i=["title","id"],o=!1;return t=void 0!==t?t:f.get.value(),n=void 0!==n?n:f.get.results(),"category"===m.type?(f.debug("Finding result that matches",t),e.each(n,function(n,a){if(e.isArray(a.results)&&(o=f.search.object(t,a.results,i)[0]))return!1})):(f.debug("Finding result in results object",t),o=f.search.object(t,n,i)[0]),o||!1}},select:{firstResult:function(){f.verbose("Selecting first result"),R.first().addClass(g.active)}},set:{focus:function(){k.addClass(g.focus)},loading:function(){k.addClass(g.loading)},value:function(e){f.verbose("Setting search input value",e),S.val(e)},type:function(e){e=e||m.type,"category"==m.type&&k.addClass(m.type)},buttonPressed:function(){T.addClass(g.pressed)}},remove:{loading:function(){k.removeClass(g.loading)},focus:function(){k.removeClass(g.focus)},buttonPressed:function(){T.removeClass(g.pressed)}},query:function(t){t=e.isFunction(t)?t:function(){};var n=f.get.value(),i=f.read.cache(n);t=t||function(){},f.has.minimumCharacters()?(i?(f.debug("Reading result from cache",n),f.save.results(i.results),f.addResults(i.html),f.inject.id(i.results),t()):(f.debug("Querying for",n),e.isPlainObject(m.source)||e.isArray(m.source)?(f.search.local(n),t()):f.can.useAPI()?f.search.remote(n,t):(f.error(y.source),t())),m.onSearchQuery.call(E,n)):f.hideResults()},search:{local:function(e){var t,n=f.search.object(e,m.content);f.set.loading(),f.save.results(n),f.debug("Returned local search results",n),t=f.generateResults({results:n}),f.remove.loading(),f.addResults(t),f.inject.id(n),f.write.cache(e,{html:t,results:n})},remote:function(t,n){n=e.isFunction(n)?n:function(){},k.api("is loading")&&k.api("abort"),f.setup.api(t,n),k.api("query")},object:function(t,n,i){var o=[],a=[],r=t.toString().replace(p.escape,"\\$&"),s=new RegExp(p.beginsWith+r,"i"),l=function(t,n){var i=-1==e.inArray(n,o),r=-1==e.inArray(n,a);i&&r&&t.push(n)};return n=n||m.source,i=void 0!==i?i:m.searchFields,e.isArray(i)||(i=[i]),void 0===n||!1===n?(f.error(y.source),[]):(e.each(i,function(i,r){e.each(n,function(e,n){"string"==typeof n[r]&&(-1!==n[r].search(s)?l(o,n):m.searchFullText&&f.fuzzySearch(t,n[r])&&l(a,n))})}),e.merge(o,a))}},fuzzySearch:function(e,t){var n=t.length,i=e.length;if("string"!=typeof e)return!1;if(e=e.toLowerCase(),t=t.toLowerCase(),i>n)return!1;if(i===n)return e===t;e:for(var o=0,a=0;o<i;o++){for(var r=e.charCodeAt(o);a<n;)if(t.charCodeAt(a++)===r)continue e;return!1}return!0},parse:{response:function(e,t){var n=f.generateResults(e);f.verbose("Parsing server response",e),void 0!==e&&void 0!==t&&void 0!==e[h.results]&&(f.addResults(n),f.inject.id(e[h.results]),f.write.cache(t,{html:n,results:e[h.results]}),f.save.results(e[h.results]))}},cancel:{query:function(){f.can.useAPI()&&k.api("abort")}},has:{minimumCharacters:function(){return f.get.value().length>=m.minCharacters},results:function(){return 0!==A.length&&""!=A.html()}},clear:{cache:function(e){var t=k.data(v.cache);e?e&&t&&t[e]&&(f.debug("Removing value from cache",e),delete t[e],k.data(v.cache,t)):(f.debug("Clearing cache",e),k.removeData(v.cache))}},read:{cache:function(e){var t=k.data(v.cache);return!!m.cache&&(f.verbose("Checking cache for generated html for query",e),"object"==typeof t&&void 0!==t[e]&&t[e])}},create:{id:function(e,t){var n,i=e+1;return void 0!==t?(n=String.fromCharCode(97+t)+i,f.verbose("Creating category result id",n)):(n=i,f.verbose("Creating result id",n)),n},results:function(){0===A.length&&(A=e("<div />").addClass(g.results).appendTo(k))}},inject:{result:function(e,t,n){f.verbose("Injecting result into results");var i=void 0!==n?A.children().eq(n).children(b.result).eq(t):A.children(b.result).eq(t);f.verbose("Injecting results metadata",i),i.data(v.result,e)},id:function(t){f.debug("Injecting unique ids into results");var n=0,i=0;return"category"===m.type?e.each(t,function(t,o){i=0,e.each(o.results,function(e,t){var a=o.results[e];void 0===a.id&&(a.id=f.create.id(i,n)),f.inject.result(a,i,n),i++}),n++}):e.each(t,function(e,n){var o=t[e];void 0===o.id&&(o.id=f.create.id(i)),f.inject.result(o,i),i++}),t}},save:{results:function(e){f.verbose("Saving current search results to metadata",e),k.data(v.results,e)}},write:{cache:function(e,t){var n=void 0!==k.data(v.cache)?k.data(v.cache):{};m.cache&&(f.verbose("Writing generated html to cache",e,t),n[e]=t,k.data(v.cache,n))}},addResults:function(t){if(e.isFunction(m.onResultsAdd)&&!1===m.onResultsAdd.call(A,t))return f.debug("onResultsAdd callback cancelled default action"),!1;t?(A.html(t),f.refreshResults(),m.selectFirstResult&&f.select.firstResult(),f.showResults()):f.hideResults(function(){A.empty()})},showResults:function(t){t=e.isFunction(t)?t:function(){},D||!f.is.visible()&&f.has.results()&&(f.can.transition()?(f.debug("Showing results with css animations"),A.transition({animation:m.transition+" in",debug:m.debug,verbose:m.verbose,duration:m.duration,onComplete:function(){t()},queue:!0})):(f.debug("Showing results with javascript"),A.stop().fadeIn(m.duration,m.easing)),m.onResultsOpen.call(A))},hideResults:function(t){t=e.isFunction(t)?t:function(){},f.is.visible()&&(f.can.transition()?(f.debug("Hiding results with css animations"),A.transition({animation:m.transition+" out",debug:m.debug,verbose:m.verbose,duration:m.duration,onComplete:function(){t()},queue:!0})):(f.debug("Hiding results with javascript"),A.stop().fadeOut(m.duration,m.easing)),m.onResultsClose.call(A))},generateResults:function(t){f.debug("Generating html from response",t);var n=m.templates[m.type],i=e.isPlainObject(t[h.results])&&!e.isEmptyObject(t[h.results]),o=e.isArray(t[h.results])&&t[h.results].length>0,a="";return i||o?(m.maxResults>0&&(i?"standard"==m.type&&f.error(y.maxResults):t[h.results]=t[h.results].slice(0,m.maxResults)),e.isFunction(n)?a=n(t,h):f.error(y.noTemplate,!1)):m.showNoResults&&(a=f.displayMessage(y.noResults,"empty")),m.onResults.call(E,t),a},displayMessage:function(e,t){return t=t||"standard",f.debug("Displaying message",e,t),f.addResults(m.templates.message(e,t)),m.templates.message(e,t)},setting:function(t,n){if(e.isPlainObject(t))e.extend(!0,m,t);else{if(void 0===n)return m[t];m[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,f,t);else{if(void 0===n)return f[t];f[t]=n}},debug:function(){!m.silent&&m.debug&&(m.performance?f.performance.log(arguments):(f.debug=Function.prototype.bind.call(console.info,console,m.name+":"),f.debug.apply(console,arguments)))},verbose:function(){!m.silent&&m.verbose&&m.debug&&(m.performance?f.performance.log(arguments):(f.verbose=Function.prototype.bind.call(console.info,console,m.name+":"),f.verbose.apply(console,arguments)))},error:function(){m.silent||(f.error=Function.prototype.bind.call(console.error,console,m.name+":"),f.error.apply(console,arguments))},performance:{log:function(e){var t,n;m.performance&&(n=(t=(new Date).getTime())-(s||t),s=t,l.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:E,"Execution Time":n})),clearTimeout(f.performance.timer),f.performance.timer=setTimeout(f.performance.display,500)},display:function(){var t=m.name+":",n=0;s=!1,clearTimeout(f.performance.timer),e.each(l,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",r&&(t+=" '"+r+"'"),a.length>1&&(t+=" ("+a.length+")"),(void 0!==console.group||void 0!==console.table)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,n,i){var a,r,s,l=F;return n=n||d,i=E||i,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]&&(r=l[i],!1);l=l[i]}})),e.isFunction(r)?s=r.apply(i,n):void 0!==r&&(s=r),e.isArray(o)?o.push(s):void 0!==o?o=[o,s]:void 0!==s&&(o=s),r}},u?(void 0===F&&f.initialize(),f.invoke(c)):(void 0!==F&&F.invoke("destroy"),f.initialize())}),void 0!==o?o:this},e.fn.search.settings={name:"Search",namespace:"search",silent:!1,debug:!1,verbose:!1,performance:!0,type:"standard",minCharacters:1,selectFirstResult:!1,apiSettings:!1,source:!1,searchOnFocus:!0,searchFields:["title","description"],displayField:"",searchFullText:!0,automatic:!0,hideDelay:0,searchDelay:200,maxResults:7,cache:!0,showNoResults:!0,transition:"scale",duration:200,easing:"easeOutExpo",onSelect:!1,onResultsAdd:!1,onSearchQuery:function(e){},onResults:function(e){},onResultsOpen:function(){},onResultsClose:function(){},className:{animating:"animating",active:"active",empty:"empty",focus:"focus",hidden:"hidden",loading:"loading",results:"results",pressed:"down"},error:{source:"Cannot search. No source used, and Semantic API module was not included",noResults:"Your search returned no results",logging:"Error in debug logging, exiting.",noEndpoint:"No search endpoint was specified",noTemplate:"A valid template name was not specified.",serverError:"There was an issue querying the server.",maxResults:"Results must be an array to use maxResults setting",method:"The method you called is not defined."},metadata:{cache:"cache",results:"results",result:"result"},regExp:{escape:/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,beginsWith:"(?:s|^)"},fields:{categories:"results",categoryName:"name",categoryResults:"results",description:"description",image:"image",price:"price",results:"results",title:"title",url:"url",action:"action",actionText:"text",actionURL:"url"},selector:{prompt:".prompt",searchButton:".search.button",results:".results",message:".results > .message",category:".category",result:".result",title:".title, .name"},templates:{escape:function(e){var t=/[&<>"'`]/g,n={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"};return/[&<>"'`]/.test(e)?e.replace(t,function(e){return n[e]}):e},message:function(e,t){var n="";return void 0!==e&&void 0!==t&&(n+='<div class="message '+t+'">',n+="empty"==t?'<div class="header">No Results</div class="header"><div class="description">'+e+'</div class="description">':' <div class="description">'+e+"</div>",n+="</div>"),n},category:function(t,n){var i="";e.fn.search.settings.templates.escape;return void 0!==t[n.categoryResults]&&(e.each(t[n.categoryResults],function(t,o){void 0!==o[n.results]&&o.results.length>0&&(i+='<div class="category">',void 0!==o[n.categoryName]&&(i+='<div class="name">'+o[n.categoryName]+"</div>"),e.each(o.results,function(e,t){t[n.url]?i+='<a class="result" href="'+t[n.url]+'">':i+='<a class="result">',void 0!==t[n.image]&&(i+='<div class="image"> <img src="'+t[n.image]+'"></div>'),i+='<div class="content">',void 0!==t[n.price]&&(i+='<div class="price">'+t[n.price]+"</div>"),void 0!==t[n.title]&&(i+='<div class="title">'+t[n.title]+"</div>"),void 0!==t[n.description]&&(i+='<div class="description">'+t[n.description]+"</div>"),i+="</div>",i+="</a>"}),i+="</div>")}),t[n.action]&&(i+='<a href="'+t[n.action][n.actionURL]+'" class="action">'+t[n.action][n.actionText]+"</a>"),i)},standard:function(t,n){var i="";return void 0!==t[n.results]&&(e.each(t[n.results],function(e,t){t[n.url]?i+='<a class="result" href="'+t[n.url]+'">':i+='<a class="result">',void 0!==t[n.image]&&(i+='<div class="image"> <img src="'+t[n.image]+'"></div>'),i+='<div class="content">',void 0!==t[n.price]&&(i+='<div class="price">'+t[n.price]+"</div>"),void 0!==t[n.title]&&(i+='<div class="title">'+t[n.title]+"</div>"),void 0!==t[n.description]&&(i+='<div class="description">'+t[n.description]+"</div>"),i+="</div>",i+="</a>"}),t[n.action]&&(i+='<a href="'+t[n.action][n.actionURL]+'" class="action">'+t[n.action][n.actionText]+"</a>"),i)}}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.shape=function(i){var o,a=e(this),r=(e("body"),(new Date).getTime()),s=[],l=arguments[0],c="string"==typeof l,u=[].slice.call(arguments,1),d=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)};return a.each(function(){var t,f,m,g=a.selector||"",v=e.isPlainObject(i)?e.extend(!0,{},e.fn.shape.settings,i):e.extend({},e.fn.shape.settings),p=v.namespace,h=v.selector,b=v.error,y=v.className,x="."+p,C="module-"+p,w=e(this),k=w.find(h.sides),S=w.find(h.side),T=!1,A=this,R=w.data(C);m={initialize:function(){m.verbose("Initializing module for",A),m.set.defaultSide(),m.instantiate()},instantiate:function(){m.verbose("Storing instance of module",m),R=m,w.data(C,R)},destroy:function(){m.verbose("Destroying previous module for",A),w.removeData(C).off(x)},refresh:function(){m.verbose("Refreshing selector cache for",A),w=e(A),k=e(this).find(h.shape),S=e(this).find(h.side)},repaint:function(){m.verbose("Forcing repaint event");(k[0]||n.createElement("div")).offsetWidth},animate:function(e,n){m.verbose("Animating box with properties",e),n=n||function(e){m.verbose("Executing animation callback"),void 0!==e&&e.stopPropagation(),m.reset(),m.set.active()},v.beforeChange.call(f[0]),m.get.transitionEvent()?(m.verbose("Starting CSS animation"),w.addClass(y.animating),k.css(e).one(m.get.transitionEvent(),n),m.set.duration(v.duration),d(function(){w.addClass(y.animating),t.addClass(y.hidden)})):n()},queue:function(e){m.debug("Queueing animation of",e),k.one(m.get.transitionEvent(),function(){m.debug("Executing queued animation"),setTimeout(function(){w.shape(e)},0)})},reset:function(){m.verbose("Animating states reset"),w.removeClass(y.animating).attr("style","").removeAttr("style"),k.attr("style","").removeAttr("style"),S.attr("style","").removeAttr("style").removeClass(y.hidden),f.removeClass(y.animating).attr("style","").removeAttr("style")},is:{complete:function(){return S.filter("."+y.active)[0]==f[0]},animating:function(){return w.hasClass(y.animating)}},set:{defaultSide:function(){t=w.find("."+v.className.active),f=t.next(h.side).length>0?t.next(h.side):w.find(h.side).first(),T=!1,m.verbose("Active side set to",t),m.verbose("Next side set to",f)},duration:function(e){e="number"==typeof(e=e||v.duration)?e+"ms":e,m.verbose("Setting animation duration",e),(v.duration||0===v.duration)&&k.add(S).css({"-webkit-transition-duration":e,"-moz-transition-duration":e,"-ms-transition-duration":e,"-o-transition-duration":e,"transition-duration":e})},currentStageSize:function(){var e=w.find("."+v.className.active),t=e.outerWidth(!0),n=e.outerHeight(!0);w.css({width:t,height:n})},stageSize:function(){var e=w.clone().addClass(y.loading),t=e.find("."+v.className.active),n=T?e.find(h.side).eq(T):t.next(h.side).length>0?t.next(h.side):e.find(h.side).first(),i="next"==v.width?n.outerWidth(!0):"initial"==v.width?w.width():v.width,o="next"==v.height?n.outerHeight(!0):"initial"==v.height?w.height():v.height;t.removeClass(y.active),n.addClass(y.active),e.insertAfter(w),e.remove(),"auto"!=v.width&&(w.css("width",i+v.jitter),m.verbose("Specifying width during animation",i)),"auto"!=v.height&&(w.css("height",o+v.jitter),m.verbose("Specifying height during animation",o))},nextSide:function(e){T=e,f=S.filter(e),T=S.index(f),0===f.length&&(m.set.defaultSide(),m.error(b.side)),m.verbose("Next side manually set to",f)},active:function(){m.verbose("Setting new side to active",f),S.removeClass(y.active),f.addClass(y.active),v.onChange.call(f[0]),m.set.defaultSide()}},flip:{up:function(){if(!m.is.complete()||m.is.animating()||v.allowRepeats)if(m.is.animating())m.queue("flip up");else{m.debug("Flipping up",f);var e=m.get.transform.up();m.set.stageSize(),m.stage.above(),m.animate(e)}else m.debug("Side already visible",f)},down:function(){if(!m.is.complete()||m.is.animating()||v.allowRepeats)if(m.is.animating())m.queue("flip down");else{m.debug("Flipping down",f);var e=m.get.transform.down();m.set.stageSize(),m.stage.below(),m.animate(e)}else m.debug("Side already visible",f)},left:function(){if(!m.is.complete()||m.is.animating()||v.allowRepeats)if(m.is.animating())m.queue("flip left");else{m.debug("Flipping left",f);var e=m.get.transform.left();m.set.stageSize(),m.stage.left(),m.animate(e)}else m.debug("Side already visible",f)},right:function(){if(!m.is.complete()||m.is.animating()||v.allowRepeats)if(m.is.animating())m.queue("flip right");else{m.debug("Flipping right",f);var e=m.get.transform.right();m.set.stageSize(),m.stage.right(),m.animate(e)}else m.debug("Side already visible",f)},over:function(){!m.is.complete()||m.is.animating()||v.allowRepeats?m.is.animating()?m.queue("flip over"):(m.debug("Flipping over",f),m.set.stageSize(),m.stage.behind(),m.animate(m.get.transform.over())):m.debug("Side already visible",f)},back:function(){!m.is.complete()||m.is.animating()||v.allowRepeats?m.is.animating()?m.queue("flip back"):(m.debug("Flipping back",f),m.set.stageSize(),m.stage.behind(),m.animate(m.get.transform.back())):m.debug("Side already visible",f)}},get:{transform:{up:function(){var e={y:-(t.outerHeight(!0)-f.outerHeight(!0))/2,z:-t.outerHeight(!0)/2};return{transform:"translateY("+e.y+"px) translateZ("+e.z+"px) rotateX(-90deg)"}},down:function(){var e={y:-(t.outerHeight(!0)-f.outerHeight(!0))/2,z:-t.outerHeight(!0)/2};return{transform:"translateY("+e.y+"px) translateZ("+e.z+"px) rotateX(90deg)"}},left:function(){var e={x:-(t.outerWidth(!0)-f.outerWidth(!0))/2,z:-t.outerWidth(!0)/2};return{transform:"translateX("+e.x+"px) translateZ("+e.z+"px) rotateY(90deg)"}},right:function(){var e={x:-(t.outerWidth(!0)-f.outerWidth(!0))/2,z:-t.outerWidth(!0)/2};return{transform:"translateX("+e.x+"px) translateZ("+e.z+"px) rotateY(-90deg)"}},over:function(){return{transform:"translateX("+{x:-(t.outerWidth(!0)-f.outerWidth(!0))/2}.x+"px) rotateY(180deg)"}},back:function(){return{transform:"translateX("+{x:-(t.outerWidth(!0)-f.outerWidth(!0))/2}.x+"px) rotateY(-180deg)"}}},transitionEvent:function(){var e,t=n.createElement("element"),i={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(e in i)if(void 0!==t.style[e])return i[e]},nextSide:function(){return t.next(h.side).length>0?t.next(h.side):w.find(h.side).first()}},stage:{above:function(){var e={origin:(t.outerHeight(!0)-f.outerHeight(!0))/2,depth:{active:f.outerHeight(!0)/2,next:t.outerHeight(!0)/2}};m.verbose("Setting the initial animation position as above",f,e),k.css({transform:"translateZ(-"+e.depth.active+"px)"}),t.css({transform:"rotateY(0deg) translateZ("+e.depth.active+"px)"}),f.addClass(y.animating).css({top:e.origin+"px",transform:"rotateX(90deg) translateZ("+e.depth.next+"px)"})},below:function(){var e={origin:(t.outerHeight(!0)-f.outerHeight(!0))/2,depth:{active:f.outerHeight(!0)/2,next:t.outerHeight(!0)/2}};m.verbose("Setting the initial animation position as below",f,e),k.css({transform:"translateZ(-"+e.depth.active+"px)"}),t.css({transform:"rotateY(0deg) translateZ("+e.depth.active+"px)"}),f.addClass(y.animating).css({top:e.origin+"px",transform:"rotateX(-90deg) translateZ("+e.depth.next+"px)"})},left:function(){var e={active:t.outerWidth(!0),next:f.outerWidth(!0)},n={origin:(e.active-e.next)/2,depth:{active:e.next/2,next:e.active/2}};m.verbose("Setting the initial animation position as left",f,n),k.css({transform:"translateZ(-"+n.depth.active+"px)"}),t.css({transform:"rotateY(0deg) translateZ("+n.depth.active+"px)"}),f.addClass(y.animating).css({left:n.origin+"px",transform:"rotateY(-90deg) translateZ("+n.depth.next+"px)"})},right:function(){var e={active:t.outerWidth(!0),next:f.outerWidth(!0)},n={origin:(e.active-e.next)/2,depth:{active:e.next/2,next:e.active/2}};m.verbose("Setting the initial animation position as left",f,n),k.css({transform:"translateZ(-"+n.depth.active+"px)"}),t.css({transform:"rotateY(0deg) translateZ("+n.depth.active+"px)"}),f.addClass(y.animating).css({left:n.origin+"px",transform:"rotateY(90deg) translateZ("+n.depth.next+"px)"})},behind:function(){var e={active:t.outerWidth(!0),next:f.outerWidth(!0)},n={origin:(e.active-e.next)/2,depth:{active:e.next/2,next:e.active/2}};m.verbose("Setting the initial animation position as behind",f,n),t.css({transform:"rotateY(0deg)"}),f.addClass(y.animating).css({left:n.origin+"px",transform:"rotateY(-180deg)"})}},setting:function(t,n){if(m.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,v,t);else{if(void 0===n)return v[t];e.isPlainObject(v[t])?e.extend(!0,v[t],n):v[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,m,t);else{if(void 0===n)return m[t];m[t]=n}},debug:function(){!v.silent&&v.debug&&(v.performance?m.performance.log(arguments):(m.debug=Function.prototype.bind.call(console.info,console,v.name+":"),m.debug.apply(console,arguments)))},verbose:function(){!v.silent&&v.verbose&&v.debug&&(v.performance?m.performance.log(arguments):(m.verbose=Function.prototype.bind.call(console.info,console,v.name+":"),m.verbose.apply(console,arguments)))},error:function(){v.silent||(m.error=Function.prototype.bind.call(console.error,console,v.name+":"),m.error.apply(console,arguments))},performance:{log:function(e){var t,n;v.performance&&(n=(t=(new Date).getTime())-(r||t),r=t,s.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:A,"Execution Time":n})),clearTimeout(m.performance.timer),m.performance.timer=setTimeout(m.performance.display,500)},display:function(){var t=v.name+":",n=0;r=!1,clearTimeout(m.performance.timer),e.each(s,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",g&&(t+=" '"+g+"'"),a.length>1&&(t+=" ("+a.length+")"),(void 0!==console.group||void 0!==console.table)&&s.length>0&&(console.groupCollapsed(t),console.table?console.table(s):e.each(s,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(t,n,i){var a,r,s,l=R;return n=n||u,i=A||i,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]&&(r=l[i],!1);l=l[i]}})),e.isFunction(r)?s=r.apply(i,n):void 0!==r&&(s=r),e.isArray(o)?o.push(s):void 0!==o?o=[o,s]:void 0!==s&&(o=s),r}},c?(void 0===R&&m.initialize(),m.invoke(l)):(void 0!==R&&R.invoke("destroy"),m.initialize())}),void 0!==o?o:this},e.fn.shape.settings={name:"Shape",silent:!1,debug:!1,verbose:!1,jitter:0,performance:!0,namespace:"shape",width:"initial",height:"initial",beforeChange:function(){},onChange:function(){},allowRepeats:!1,duration:!1,error:{side:"You tried to switch to a side that does not exist.",method:"The method you called is not defined"},className:{animating:"animating",hidden:"hidden",loading:"loading",active:"active"},selector:{sides:".sides",side:".side"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.sidebar=function(i){var o,a=e(this),r=e(t),s=e(n),l=e("html"),c=e("head"),u=a.selector||"",d=(new Date).getTime(),f=[],m=arguments[0],g="string"==typeof m,v=[].slice.call(arguments,1),p=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)};return a.each(function(){var a,h,b,y,x,C,w=e.isPlainObject(i)?e.extend(!0,{},e.fn.sidebar.settings,i):e.extend({},e.fn.sidebar.settings),k=w.selector,S=w.className,T=w.namespace,A=w.regExp,R=w.error,P="."+T,E="module-"+T,F=e(this),O=e(w.context),D=F.children(k.sidebar),q=O.children(k.fixed),j=O.children(k.pusher),z=this,I=F.data(E);C={initialize:function(){C.debug("Initializing sidebar",i),C.create.id(),x=C.get.transitionEvent(),w.delaySetup?p(C.setup.layout):C.setup.layout(),p(function(){C.setup.cache()}),C.instantiate()},instantiate:function(){C.verbose("Storing instance of module",C),I=C,F.data(E,C)},create:{id:function(){b=(Math.random().toString(16)+"000000000").substr(2,8),h="."+b,C.verbose("Creating unique id for element",b)}},destroy:function(){C.verbose("Destroying previous module for",F),F.off(P).removeData(E),C.is.ios()&&C.remove.ios(),O.off(h),r.off(h),s.off(h)},event:{clickaway:function(e){var t=j.find(e.target).length>0||j.is(e.target),n=O.is(e.target);t&&(C.verbose("User clicked on dimmed page"),C.hide()),n&&(C.verbose("User clicked on dimmable context (scaled out page)"),C.hide())},touch:function(e){},containScroll:function(e){z.scrollTop<=0&&(z.scrollTop=1),z.scrollTop+z.offsetHeight>=z.scrollHeight&&(z.scrollTop=z.scrollHeight-z.offsetHeight-1)},scroll:function(t){0===e(t.target).closest(k.sidebar).length&&t.preventDefault()}},bind:{clickaway:function(){C.verbose("Adding clickaway events to context",O),w.closable&&O.on("click"+h,C.event.clickaway).on("touchend"+h,C.event.clickaway)},scrollLock:function(){w.scrollLock&&(C.debug("Disabling page scroll"),r.on("DOMMouseScroll"+h,C.event.scroll)),C.verbose("Adding events to contain sidebar scroll"),s.on("touchmove"+h,C.event.touch),F.on("scroll"+P,C.event.containScroll)}},unbind:{clickaway:function(){C.verbose("Removing clickaway events from context",O),O.off(h)},scrollLock:function(){C.verbose("Removing scroll lock from page"),s.off(h),r.off(h),F.off("scroll"+P)}},add:{inlineCSS:function(){var t,n=C.cache.width||F.outerWidth(),i=C.cache.height||F.outerHeight(),o=C.is.rtl(),r=C.get.direction(),s={left:n,right:-n,top:i,bottom:-i};o&&(C.verbose("RTL detected, flipping widths"),s.left=-n,s.right=n),t="<style>","left"===r||"right"===r?(C.debug("Adding CSS rules for animation distance",n),t+=" .ui.visible."+r+".sidebar ~ .fixed, .ui.visible."+r+".sidebar ~ .pusher {   -webkit-transform: translate3d("+s[r]+"px, 0, 0);           transform: translate3d("+s[r]+"px, 0, 0); }"):"top"!==r&&"bottom"!=r||(t+=" .ui.visible."+r+".sidebar ~ .fixed, .ui.visible."+r+".sidebar ~ .pusher {   -webkit-transform: translate3d(0, "+s[r]+"px, 0);           transform: translate3d(0, "+s[r]+"px, 0); }"),C.is.ie()&&("left"===r||"right"===r?(C.debug("Adding CSS rules for animation distance",n),t+=" body.pushable > .ui.visible."+r+".sidebar ~ .pusher:after {   -webkit-transform: translate3d("+s[r]+"px, 0, 0);           transform: translate3d("+s[r]+"px, 0, 0); }"):"top"!==r&&"bottom"!=r||(t+=" body.pushable > .ui.visible."+r+".sidebar ~ .pusher:after {   -webkit-transform: translate3d(0, "+s[r]+"px, 0);           transform: translate3d(0, "+s[r]+"px, 0); }"),t+=" body.pushable > .ui.visible.left.sidebar ~ .ui.visible.right.sidebar ~ .pusher:after, body.pushable > .ui.visible.right.sidebar ~ .ui.visible.left.sidebar ~ .pusher:after {   -webkit-transform: translate3d(0px, 0, 0);           transform: translate3d(0px, 0, 0); }"),a=e(t+="</style>").appendTo(c),C.debug("Adding sizing css to head",a)}},refresh:function(){C.verbose("Refreshing selector cache"),O=e(w.context),D=O.children(k.sidebar),j=O.children(k.pusher),q=O.children(k.fixed),C.clear.cache()},refreshSidebars:function(){C.verbose("Refreshing other sidebars"),D=O.children(k.sidebar)},repaint:function(){C.verbose("Forcing repaint event"),z.style.display="none";z.offsetHeight;z.scrollTop=z.scrollTop,z.style.display=""},setup:{cache:function(){C.cache={width:F.outerWidth(),height:F.outerHeight(),rtl:"rtl"==F.css("direction")}},layout:function(){0===O.children(k.pusher).length&&(C.debug("Adding wrapper element for sidebar"),C.error(R.pusher),j=e('<div class="pusher" />'),O.children().not(k.omitted).not(D).wrapAll(j),C.refresh()),0!==F.nextAll(k.pusher).length&&F.nextAll(k.pusher)[0]===j[0]||(C.debug("Moved sidebar to correct parent element"),C.error(R.movedSidebar,z),F.detach().prependTo(O),C.refresh()),C.clear.cache(),C.set.pushable(),C.set.direction()}},attachEvents:function(t,n){var i=e(t);n=e.isFunction(C[n])?C[n]:C.toggle,i.length>0?(C.debug("Attaching sidebar events to element",t,n),i.on("click"+P,n)):C.error(R.notFound,t)},show:function(t){if(t=e.isFunction(t)?t:function(){},C.is.hidden()){if(C.refreshSidebars(),w.overlay&&(C.error(R.overlay),w.transition="overlay"),C.refresh(),C.othersActive())if(C.debug("Other sidebars currently visible"),w.exclusive){if("overlay"!=w.transition)return void C.hideOthers(C.show);C.hideOthers()}else w.transition="overlay";C.pushPage(function(){t.call(z),w.onShow.call(z)}),w.onChange.call(z),w.onVisible.call(z)}else C.debug("Sidebar is already visible")},hide:function(t){t=e.isFunction(t)?t:function(){},(C.is.visible()||C.is.animating())&&(C.debug("Hiding sidebar",t),C.refreshSidebars(),C.pullPage(function(){t.call(z),w.onHidden.call(z)}),w.onChange.call(z),w.onHide.call(z))},othersAnimating:function(){return D.not(F).filter("."+S.animating).length>0},othersVisible:function(){return D.not(F).filter("."+S.visible).length>0},othersActive:function(){return C.othersVisible()||C.othersAnimating()},hideOthers:function(e){var t=D.not(F).filter("."+S.visible),n=t.length,i=0;e=e||function(){},t.sidebar("hide",function(){++i==n&&e()})},toggle:function(){C.verbose("Determining toggled direction"),C.is.hidden()?C.show():C.hide()},pushPage:function(t){var n,i,o,a=C.get.transition(),r="overlay"===a||C.othersActive()?F:j;t=e.isFunction(t)?t:function(){},"scale down"==w.transition&&C.scrollToTop(),C.set.transition(a),C.repaint(),n=function(){C.bind.clickaway(),C.add.inlineCSS(),C.set.animating(),C.set.visible()},i=function(){C.set.dimmed()},o=function(e){e.target==r[0]&&(r.off(x+h,o),C.remove.animating(),C.bind.scrollLock(),t.call(z))},r.off(x+h),r.on(x+h,o),p(n),w.dimPage&&!C.othersVisible()&&p(i)},pullPage:function(t){var n,i,o=C.get.transition(),a="overlay"==o||C.othersActive()?F:j;t=e.isFunction(t)?t:function(){},C.verbose("Removing context push state",C.get.direction()),C.unbind.clickaway(),C.unbind.scrollLock(),n=function(){C.set.transition(o),C.set.animating(),C.remove.visible(),w.dimPage&&!C.othersVisible()&&j.removeClass(S.dimmed)},i=function(e){e.target==a[0]&&(a.off(x+h,i),C.remove.animating(),C.remove.transition(),C.remove.inlineCSS(),("scale down"==o||w.returnScroll&&C.is.mobile())&&C.scrollBack(),t.call(z))},a.off(x+h),a.on(x+h,i),p(n)},scrollToTop:function(){C.verbose("Scrolling to top of page to avoid animation issues"),y=e(t).scrollTop(),F.scrollTop(0),t.scrollTo(0,0)},scrollBack:function(){C.verbose("Scrolling back to original page position"),t.scrollTo(0,y)},clear:{cache:function(){C.verbose("Clearing cached dimensions"),C.cache={}}},set:{ios:function(){l.addClass(S.ios)},pushed:function(){O.addClass(S.pushed)},pushable:function(){O.addClass(S.pushable)},dimmed:function(){j.addClass(S.dimmed)},active:function(){F.addClass(S.active)},animating:function(){F.addClass(S.animating)},transition:function(e){e=e||C.get.transition(),F.addClass(e)},direction:function(e){e=e||C.get.direction(),F.addClass(S[e])},visible:function(){F.addClass(S.visible)},overlay:function(){F.addClass(S.overlay)}},remove:{inlineCSS:function(){C.debug("Removing inline css styles",a),a&&a.length>0&&a.remove()},ios:function(){l.removeClass(S.ios)},pushed:function(){O.removeClass(S.pushed)},pushable:function(){O.removeClass(S.pushable)},active:function(){F.removeClass(S.active)},animating:function(){F.removeClass(S.animating)},transition:function(e){e=e||C.get.transition(),F.removeClass(e)},direction:function(e){e=e||C.get.direction(),F.removeClass(S[e])},visible:function(){F.removeClass(S.visible)},overlay:function(){F.removeClass(S.overlay)}},get:{direction:function(){return F.hasClass(S.top)?S.top:F.hasClass(S.right)?S.right:F.hasClass(S.bottom)?S.bottom:S.left},transition:function(){var e,t=C.get.direction();return e=C.is.mobile()?"auto"==w.mobileTransition?w.defaultTransition.mobile[t]:w.mobileTransition:"auto"==w.transition?w.defaultTransition.computer[t]:w.transition,C.verbose("Determined transition",e),e},transitionEvent:function(){var e,t=n.createElement("element"),i={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(e in i)if(void 0!==t.style[e])return i[e]}},is:{ie:function(){var e=!t.ActiveXObject&&"ActiveXObject"in t,n="ActiveXObject"in t;return e||n},ios:function(){var e=navigator.userAgent,t=e.match(A.ios),n=e.match(A.mobileChrome);return!(!t||n)&&(C.verbose("Browser was found to be iOS",e),!0)},mobile:function(){var e=navigator.userAgent;return e.match(A.mobile)?(C.verbose("Browser was found to be mobile",e),!0):(C.verbose("Browser is not mobile, using regular transition",e),!1)},hidden:function(){return!C.is.visible()},visible:function(){return F.hasClass(S.visible)},open:function(){return C.is.visible()},closed:function(){return C.is.hidden()},vertical:function(){return F.hasClass(S.top)},animating:function(){return O.hasClass(S.animating)},rtl:function(){return void 0===C.cache.rtl&&(C.cache.rtl="rtl"==F.css("direction")),C.cache.rtl}},setting:function(t,n){if(C.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,w,t);else{if(void 0===n)return w[t];e.isPlainObject(w[t])?e.extend(!0,w[t],n):w[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,C,t);else{if(void 0===n)return C[t];C[t]=n}},debug:function(){!w.silent&&w.debug&&(w.performance?C.performance.log(arguments):(C.debug=Function.prototype.bind.call(console.info,console,w.name+":"),C.debug.apply(console,arguments)))},verbose:function(){!w.silent&&w.verbose&&w.debug&&(w.performance?C.performance.log(arguments):(C.verbose=Function.prototype.bind.call(console.info,console,w.name+":"),C.verbose.apply(console,arguments)))},error:function(){w.silent||(C.error=Function.prototype.bind.call(console.error,console,w.name+":"),C.error.apply(console,arguments))},performance:{log:function(e){var t,n;w.performance&&(n=(t=(new Date).getTime())-(d||t),d=t,f.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:z,"Execution Time":n})),clearTimeout(C.performance.timer),C.performance.timer=setTimeout(C.performance.display,500)},display:function(){var t=w.name+":",n=0;d=!1,clearTimeout(C.performance.timer),e.each(f,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",u&&(t+=" '"+u+"'"),(void 0!==console.group||void 0!==console.table)&&f.length>0&&(console.groupCollapsed(t),console.table?console.table(f):e.each(f,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),f=[]}},invoke:function(t,n,i){var a,r,s,l=I;return n=n||v,i=z||i,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]?(r=l[i],!1):(C.error(R.method,t),!1);l=l[i]}})),e.isFunction(r)?s=r.apply(i,n):void 0!==r&&(s=r),e.isArray(o)?o.push(s):void 0!==o?o=[o,s]:void 0!==s&&(o=s),r}},g?(void 0===I&&C.initialize(),C.invoke(m)):(void 0!==I&&C.invoke("destroy"),C.initialize())}),void 0!==o?o:this},e.fn.sidebar.settings={name:"Sidebar",namespace:"sidebar",silent:!1,debug:!1,verbose:!1,performance:!0,transition:"auto",mobileTransition:"auto",defaultTransition:{computer:{left:"uncover",right:"uncover",top:"overlay",bottom:"overlay"},mobile:{left:"uncover",right:"uncover",top:"overlay",bottom:"overlay"}},context:"body",exclusive:!1,closable:!0,dimPage:!0,scrollLock:!1,returnScroll:!1,delaySetup:!1,duration:500,onChange:function(){},onShow:function(){},onHide:function(){},onHidden:function(){},onVisible:function(){},className:{active:"active",animating:"animating",dimmed:"dimmed",ios:"ios",pushable:"pushable",pushed:"pushed",right:"right",top:"top",left:"left",bottom:"bottom",visible:"visible"},selector:{fixed:".fixed",omitted:"script, link, style, .ui.modal, .ui.dimmer, .ui.nag, .ui.fixed",pusher:".pusher",sidebar:".ui.sidebar"},regExp:{ios:/(iPad|iPhone|iPod)/g,mobileChrome:/(CriOS)/g,mobile:/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/g},error:{method:"The method you called is not defined.",pusher:"Had to add pusher element. For optimal performance make sure body content is inside a pusher element",movedSidebar:"Had to move sidebar. For optimal performance make sure sidebar and pusher are direct children of your body tag",overlay:"The overlay setting is no longer supported, use animation: overlay",notFound:"There were no elements that matched the specified selector"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.sticky=function(i){var o,a=e(this),r=a.selector||"",s=(new Date).getTime(),l=[],c=arguments[0],u="string"==typeof c,d=[].slice.call(arguments,1);return a.each(function(){var a,f,m,g,v,p=e.isPlainObject(i)?e.extend(!0,{},e.fn.sticky.settings,i):e.extend({},e.fn.sticky.settings),h=p.className,b=p.namespace,y=p.error,x="."+b,C="module-"+b,w=e(this),k=e(t),S=e(p.scrollContext),T=(w.selector,w.data(C)),A=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)},R=this;v={initialize:function(){v.determineContainer(),v.determineContext(),v.verbose("Initializing sticky",p,a),v.save.positions(),v.checkErrors(),v.bind.events(),p.observeChanges&&v.observeChanges(),v.instantiate()},instantiate:function(){v.verbose("Storing instance of module",v),T=v,w.data(C,v)},destroy:function(){v.verbose("Destroying previous instance"),v.reset(),m&&m.disconnect(),g&&g.disconnect(),k.off("load"+x,v.event.load).off("resize"+x,v.event.resize),S.off("scrollchange"+x,v.event.scrollchange),w.removeData(C)},observeChanges:function(){"MutationObserver"in t&&(m=new MutationObserver(v.event.documentChanged),g=new MutationObserver(v.event.changed),m.observe(n,{childList:!0,subtree:!0}),g.observe(R,{childList:!0,subtree:!0}),g.observe(f[0],{childList:!0,subtree:!0}),v.debug("Setting up mutation observer",g))},determineContainer:function(){a=p.container?e(p.container):w.offsetParent()},determineContext:function(){0!==(f=p.context?e(p.context):a).length||v.error(y.invalidContext,p.context,w)},checkErrors:function(){if(v.is.hidden()&&v.error(y.visible,w),v.cache.element.height>v.cache.context.height)return v.reset(),void v.error(y.elementSize,w)},bind:{events:function(){k.on("load"+x,v.event.load).on("resize"+x,v.event.resize),S.off("scroll"+x).on("scroll"+x,v.event.scroll).on("scrollchange"+x,v.event.scrollchange)}},event:{changed:function(e){clearTimeout(v.timer),v.timer=setTimeout(function(){v.verbose("DOM tree modified, updating sticky menu",e),v.refresh()},100)},documentChanged:function(t){[].forEach.call(t,function(t){t.removedNodes&&[].forEach.call(t.removedNodes,function(t){(t==R||e(t).find(R).length>0)&&(v.debug("Element removed from DOM, tearing down events"),v.destroy())})})},load:function(){v.verbose("Page contents finished loading"),A(v.refresh)},resize:function(){v.verbose("Window resized"),A(v.refresh)},scroll:function(){A(function(){S.triggerHandler("scrollchange"+x,S.scrollTop())})},scrollchange:function(e,t){v.stick(t),p.onScroll.call(R)}},refresh:function(e){v.reset(),p.context||v.determineContext(),e&&v.determineContainer(),v.save.positions(),v.stick(),p.onReposition.call(R)},supports:{sticky:function(){var t=e("<div/>");t[0];return t.addClass(h.supported),t.css("position").match("sticky")}},save:{lastScroll:function(e){v.lastScroll=e},elementScroll:function(e){v.elementScroll=e},positions:function(){var e={height:S.height()},t={margin:{top:parseInt(w.css("margin-top"),10),bottom:parseInt(w.css("margin-bottom"),10)},offset:w.offset(),width:w.outerWidth(),height:w.outerHeight()},n={offset:f.offset(),height:f.outerHeight()};a.outerHeight();v.is.standardScroll()||(v.debug("Non-standard scroll. Removing scroll offset from element offset"),e.top=S.scrollTop(),e.left=S.scrollLeft(),t.offset.top+=e.top,n.offset.top+=e.top,t.offset.left+=e.left,n.offset.left+=e.left),v.cache={fits:t.height+p.offset<=e.height,sameHeight:t.height==n.height,scrollContext:{height:e.height},element:{margin:t.margin,top:t.offset.top-t.margin.top,left:t.offset.left,width:t.width,height:t.height,bottom:t.offset.top+t.height},context:{top:n.offset.top,height:n.height,bottom:n.offset.top+n.height}},v.set.containerSize(),v.stick(),v.debug("Caching element positions",v.cache)}},get:{direction:function(e){var t="down";return e=e||S.scrollTop(),void 0!==v.lastScroll&&(v.lastScroll<e?t="down":v.lastScroll>e&&(t="up")),t},scrollChange:function(e){return e=e||S.scrollTop(),v.lastScroll?e-v.lastScroll:0},currentElementScroll:function(){return v.elementScroll?v.elementScroll:v.is.top()?Math.abs(parseInt(w.css("top"),10))||0:Math.abs(parseInt(w.css("bottom"),10))||0},elementScroll:function(e){e=e||S.scrollTop();var t=v.cache.element,n=v.cache.scrollContext,i=v.get.scrollChange(e),o=t.height-n.height+p.offset,a=v.get.currentElementScroll(),r=a+i;return a=v.cache.fits||r<0?0:r>o?o:r}},remove:{lastScroll:function(){delete v.lastScroll},elementScroll:function(e){delete v.elementScroll},minimumSize:function(){a.css("min-height","")},offset:function(){w.css("margin-top","")}},set:{offset:function(){v.verbose("Setting offset on element",p.offset),w.css("margin-top",p.offset)},containerSize:function(){var e=a.get(0).tagName;"HTML"===e||"body"==e?v.determineContainer():Math.abs(a.outerHeight()-v.cache.context.height)>p.jitter&&(v.debug("Context has padding, specifying exact height for container",v.cache.context.height),a.css({height:v.cache.context.height}))},minimumSize:function(){var e=v.cache.element;a.css("min-height",e.height)},scroll:function(e){v.debug("Setting scroll on element",e),v.elementScroll!=e&&(v.is.top()&&w.css("bottom","").css("top",-e),v.is.bottom()&&w.css("top","").css("bottom",e))},size:function(){0!==v.cache.element.height&&0!==v.cache.element.width&&(R.style.setProperty("width",v.cache.element.width+"px","important"),R.style.setProperty("height",v.cache.element.height+"px","important"))}},is:{standardScroll:function(){return S[0]==t},top:function(){return w.hasClass(h.top)},bottom:function(){return w.hasClass(h.bottom)},initialPosition:function(){return!v.is.fixed()&&!v.is.bound()},hidden:function(){return!w.is(":visible")},bound:function(){return w.hasClass(h.bound)},fixed:function(){return w.hasClass(h.fixed)}},stick:function(e){var t=e||S.scrollTop(),n=v.cache,i=n.fits,o=n.sameHeight,a=n.element,r=n.scrollContext,s=n.context,l=v.is.bottom()&&p.pushing?p.bottomOffset:p.offset,e={top:t+l,bottom:t+l+r.height},c=(v.get.direction(e.top),i?0:v.get.elementScroll(e.top)),u=!i;0!==a.height&&!o&&(v.is.initialPosition()?e.top>=s.bottom?(v.debug("Initial element position is bottom of container"),v.bindBottom()):e.top>a.top&&(a.height+e.top-c>=s.bottom?(v.debug("Initial element position is bottom of container"),v.bindBottom()):(v.debug("Initial element position is fixed"),v.fixTop())):v.is.fixed()?v.is.top()?e.top<=a.top?(v.debug("Fixed element reached top of container"),v.setInitialPosition()):a.height+e.top-c>=s.bottom?(v.debug("Fixed element reached bottom of container"),v.bindBottom()):u&&(v.set.scroll(c),v.save.lastScroll(e.top),v.save.elementScroll(c)):v.is.bottom()&&(e.bottom-a.height<=a.top?(v.debug("Bottom fixed rail has reached top of container"),v.setInitialPosition()):e.bottom>=s.bottom?(v.debug("Bottom fixed rail has reached bottom of container"),v.bindBottom()):u&&(v.set.scroll(c),v.save.lastScroll(e.top),v.save.elementScroll(c))):v.is.bottom()&&(e.top<=a.top?(v.debug("Jumped from bottom fixed to top fixed, most likely used home/end button"),v.setInitialPosition()):p.pushing?v.is.bound()&&e.bottom<=s.bottom&&(v.debug("Fixing bottom attached element to bottom of browser."),v.fixBottom()):v.is.bound()&&e.top<=s.bottom-a.height&&(v.debug("Fixing bottom attached element to top of browser."),v.fixTop())))},bindTop:function(){v.debug("Binding element to top of parent container"),v.remove.offset(),w.css({left:"",top:"",marginBottom:""}).removeClass(h.fixed).removeClass(h.bottom).addClass(h.bound).addClass(h.top),p.onTop.call(R),p.onUnstick.call(R)},bindBottom:function(){v.debug("Binding element to bottom of parent container"),v.remove.offset(),w.css({left:"",top:""}).removeClass(h.fixed).removeClass(h.top).addClass(h.bound).addClass(h.bottom),p.onBottom.call(R),p.onUnstick.call(R)},setInitialPosition:function(){v.debug("Returning to initial position"),v.unfix(),v.unbind()},fixTop:function(){v.debug("Fixing element to top of page"),p.setSize&&v.set.size(),v.set.minimumSize(),v.set.offset(),w.css({left:v.cache.element.left,bottom:"",marginBottom:""}).removeClass(h.bound).removeClass(h.bottom).addClass(h.fixed).addClass(h.top),p.onStick.call(R)},fixBottom:function(){v.debug("Sticking element to bottom of page"),p.setSize&&v.set.size(),v.set.minimumSize(),v.set.offset(),w.css({left:v.cache.element.left,bottom:"",marginBottom:""}).removeClass(h.bound).removeClass(h.top).addClass(h.fixed).addClass(h.bottom),p.onStick.call(R)},unbind:function(){v.is.bound()&&(v.debug("Removing container bound position on element"),v.remove.offset(),w.removeClass(h.bound).removeClass(h.top).removeClass(h.bottom))},unfix:function(){v.is.fixed()&&(v.debug("Removing fixed position on element"),v.remove.minimumSize(),v.remove.offset(),w.removeClass(h.fixed).removeClass(h.top).removeClass(h.bottom),p.onUnstick.call(R))},reset:function(){v.debug("Resetting elements position"),v.unbind(),v.unfix(),v.resetCSS(),v.remove.offset(),v.remove.lastScroll()},resetCSS:function(){w.css({width:"",height:""}),a.css({height:""})},setting:function(t,n){if(e.isPlainObject(t))e.extend(!0,p,t);else{if(void 0===n)return p[t];p[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,v,t);else{if(void 0===n)return v[t];v[t]=n}},debug:function(){!p.silent&&p.debug&&(p.performance?v.performance.log(arguments):(v.debug=Function.prototype.bind.call(console.info,console,p.name+":"),v.debug.apply(console,arguments)))},verbose:function(){!p.silent&&p.verbose&&p.debug&&(p.performance?v.performance.log(arguments):(v.verbose=Function.prototype.bind.call(console.info,console,p.name+":"),v.verbose.apply(console,arguments)))},error:function(){p.silent||(v.error=Function.prototype.bind.call(console.error,console,p.name+":"),v.error.apply(console,arguments))},performance:{log:function(e){var t,n;p.performance&&(n=(t=(new Date).getTime())-(s||t),s=t,l.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:R,"Execution Time":n})),clearTimeout(v.performance.timer),v.performance.timer=setTimeout(v.performance.display,0)},display:function(){var t=p.name+":",n=0;s=!1,clearTimeout(v.performance.timer),e.each(l,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",r&&(t+=" '"+r+"'"),(void 0!==console.group||void 0!==console.table)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,n,i){var a,r,s,l=T;return n=n||d,i=R||i,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]&&(r=l[i],!1);l=l[i]}})),e.isFunction(r)?s=r.apply(i,n):void 0!==r&&(s=r),e.isArray(o)?o.push(s):void 0!==o?o=[o,s]:void 0!==s&&(o=s),r}},u?(void 0===T&&v.initialize(),v.invoke(c)):(void 0!==T&&T.invoke("destroy"),v.initialize())}),void 0!==o?o:this},e.fn.sticky.settings={name:"Sticky",namespace:"sticky",silent:!1,debug:!1,verbose:!0,performance:!0,pushing:!1,context:!1,container:!1,scrollContext:t,offset:0,bottomOffset:0,jitter:5,setSize:!0,observeChanges:!1,onReposition:function(){},onScroll:function(){},onStick:function(){},onUnstick:function(){},onTop:function(){},onBottom:function(){},error:{container:"Sticky element must be inside a relative container",visible:"Element is hidden, you must call refresh after element becomes visible. Use silent setting to surpress this warning in production.",method:"The method you called is not defined.",invalidContext:"Context specified does not exist",elementSize:"Sticky element is larger than its container, cannot create sticky."},className:{bound:"bound",fixed:"fixed",supported:"native",top:"top",bottom:"bottom"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.tab=function(i){var o,a=e(e.isFunction(this)?t:this),r=a.selector||"",s=(new Date).getTime(),l=[],c=arguments[0],u="string"==typeof c,d=[].slice.call(arguments,1),f=!1;return a.each(function(){var m,g,v,p,h,b,y=e.isPlainObject(i)?e.extend(!0,{},e.fn.tab.settings,i):e.extend({},e.fn.tab.settings),x=y.className,C=y.metadata,w=y.selector,k=y.error,S="."+y.namespace,T="module-"+y.namespace,A=e(this),R={},P=!0,E=0,F=this,O=A.data(T);h={initialize:function(){h.debug("Initializing tab menu item",A),h.fix.callbacks(),h.determineTabs(),h.debug("Determining tabs",y.context,g),y.auto&&h.set.auto(),h.bind.events(),y.history&&!f&&(h.initializeHistory(),f=!0),h.instantiate()},instantiate:function(){h.verbose("Storing instance of module",h),O=h,A.data(T,h)},destroy:function(){h.debug("Destroying tabs",A),A.removeData(T).off(S)},bind:{events:function(){e.isWindow(F)||(h.debug("Attaching tab activation events to element",A),A.on("click"+S,h.event.click))}},determineTabs:function(){var t;"parent"===y.context?(A.closest(w.ui).length>0?(t=A.closest(w.ui),h.verbose("Using closest UI element as parent",t)):t=A,m=t.parent(),h.verbose("Determined parent element for creating context",m)):y.context?(m=e(y.context),h.verbose("Using selector for tab context",y.context,m)):m=e("body"),y.childrenOnly?(g=m.children(w.tabs),h.debug("Searching tab context children for tabs",m,g)):(g=m.find(w.tabs),h.debug("Searching tab context for tabs",m,g))},fix:{callbacks:function(){e.isPlainObject(i)&&(i.onTabLoad||i.onTabInit)&&(i.onTabLoad&&(i.onLoad=i.onTabLoad,delete i.onTabLoad,h.error(k.legacyLoad,i.onLoad)),i.onTabInit&&(i.onFirstLoad=i.onTabInit,delete i.onTabInit,h.error(k.legacyInit,i.onFirstLoad)),y=e.extend(!0,{},e.fn.tab.settings,i))}},initializeHistory:function(){if(h.debug("Initializing page state"),void 0===e.address)return h.error(k.state),!1;if("state"==y.historyType){if(h.debug("Using HTML5 to manage state"),!1===y.path)return h.error(k.path),!1;e.address.history(!0).state(y.path)}e.address.bind("change",h.event.history.change)},event:{click:function(t){var n=e(this).data(C.tab);void 0!==n?(y.history?(h.verbose("Updating page state",t),e.address.value(n)):(h.verbose("Changing tab",t),h.changeTab(n)),t.preventDefault()):h.debug("No tab specified")},history:{change:function(t){var n=t.pathNames.join("/")||h.get.initialPath(),i=y.templates.determineTitle(n)||!1;h.performance.display(),h.debug("History change event",n,t),b=t,void 0!==n&&h.changeTab(n),i&&e.address.title(i)}}},refresh:function(){v&&(h.debug("Refreshing tab",v),h.changeTab(v))},cache:{read:function(e){return void 0!==e&&R[e]},add:function(e,t){e=e||v,h.debug("Adding cached content for",e),R[e]=t},remove:function(e){e=e||v,h.debug("Removing cached content for",e),delete R[e]}},set:{auto:function(){var t="string"==typeof y.path?y.path.replace(/\/$/,"")+"/{$tab}":"/{$tab}";h.verbose("Setting up automatic tab retrieval from server",t),e.isPlainObject(y.apiSettings)?y.apiSettings.url=t:y.apiSettings={url:t}},loading:function(e){var t=h.get.tabElement(e);t.hasClass(x.loading)||(h.verbose("Setting loading state for",t),t.addClass(x.loading).siblings(g).removeClass(x.active+" "+x.loading),t.length>0&&y.onRequest.call(t[0],e))},state:function(t){e.address.value(t)}},changeTab:function(n){var i=t.history&&t.history.pushState&&y.ignoreFirstLoad&&P,o=y.auto||e.isPlainObject(y.apiSettings),a=o&&!i?h.utilities.pathToArray(n):h.get.defaultPathArray(n);n=h.utilities.arrayToPath(a),e.each(a,function(t,r){var s,l,c,u,d=a.slice(0,t+1),f=h.utilities.arrayToPath(d),g=h.is.tab(f),w=t+1==a.length,S=h.get.tabElement(f);if(h.verbose("Looking for tab",r),g){if(h.verbose("Tab was found",r),v=f,p=h.utilities.filterArray(a,d),w?u=!0:(l=a.slice(0,t+2),c=h.utilities.arrayToPath(l),(u=!h.is.tab(c))&&h.verbose("Tab parameters found",l)),u&&o)return i?(h.debug("Ignoring remote content on first tab load",f),P=!1,h.cache.add(n,S.html()),h.activate.all(f),y.onFirstLoad.call(S[0],f,p,b),y.onLoad.call(S[0],f,p,b)):(h.activate.navigation(f),h.fetch.content(f,n)),!1;h.debug("Opened local tab",f),h.activate.all(f),h.cache.read(f)||(h.cache.add(f,!0),h.debug("First time tab loaded calling tab init"),y.onFirstLoad.call(S[0],f,p,b)),y.onLoad.call(S[0],f,p,b)}else{if(-1!=n.search("/")||""===n)return h.error(k.missingTab,A,m,f),!1;if(s=e("#"+n+', a[name="'+n+'"]'),f=s.closest("[data-tab]").data(C.tab),S=h.get.tabElement(f),s&&s.length>0&&f)return h.debug("Anchor link used, opening parent tab",S,s),S.hasClass(x.active)||setTimeout(function(){h.scrollTo(s)},0),h.activate.all(f),h.cache.read(f)||(h.cache.add(f,!0),h.debug("First time tab loaded calling tab init"),y.onFirstLoad.call(S[0],f,p,b)),y.onLoad.call(S[0],f,p,b),!1}})},scrollTo:function(t){var i=!!(t&&t.length>0)&&t.offset().top;!1!==i&&(h.debug("Forcing scroll to an in-page link in a hidden tab",i,t),e(n).scrollTop(i))},update:{content:function(t,n,i){var o=h.get.tabElement(t),a=o[0];i=void 0!==i?i:y.evaluateScripts,"string"==typeof y.cacheType&&"dom"==y.cacheType.toLowerCase()&&"string"!=typeof n?o.empty().append(e(n).clone(!0)):i?(h.debug("Updating HTML and evaluating inline scripts",t,n),o.html(n)):(h.debug("Updating HTML",t,n),a.innerHTML=n)}},fetch:{content:function(t,n){var i,o,a=h.get.tabElement(t),r={dataType:"html",encodeParameters:!1,on:"now",cache:y.alwaysRefresh,headers:{"X-Remote":!0},onSuccess:function(e){"response"==y.cacheType&&h.cache.add(n,e),h.update.content(t,e),t==v?(h.debug("Content loaded",t),h.activate.tab(t)):h.debug("Content loaded in background",t),y.onFirstLoad.call(a[0],t,p,b),y.onLoad.call(a[0],t,p,b),y.loadOnce?h.cache.add(n,!0):"string"==typeof y.cacheType&&"dom"==y.cacheType.toLowerCase()&&a.children().length>0?setTimeout(function(){var e=a.children().clone(!0);e=e.not("script"),h.cache.add(n,e)},0):h.cache.add(n,a.html())},urlData:{tab:n}},s=a.api("get request")||!1,l=s&&"pending"===s.state();n=n||t,o=h.cache.read(n),y.cache&&o?(h.activate.tab(t),h.debug("Adding cached content",n),y.loadOnce||("once"==y.evaluateScripts?h.update.content(t,o,!1):h.update.content(t,o)),y.onLoad.call(a[0],t,p,b)):l?(h.set.loading(t),h.debug("Content is already loading",n)):void 0!==e.api?(i=e.extend(!0,{},y.apiSettings,r),h.debug("Retrieving remote content",n,i),h.set.loading(t),a.api(i)):h.error(k.api)}},activate:{all:function(e){h.activate.tab(e),h.activate.navigation(e)},tab:function(e){var t=h.get.tabElement(e),n="siblings"==y.deactivate?t.siblings(g):g.not(t),i=t.hasClass(x.active);h.verbose("Showing tab content for",t),i||(t.addClass(x.active),n.removeClass(x.active+" "+x.loading),t.length>0&&y.onVisible.call(t[0],e))},navigation:function(e){var t=h.get.navElement(e),n="siblings"==y.deactivate?t.siblings(a):a.not(t),i=t.hasClass(x.active);h.verbose("Activating tab navigation for",t,e),i||(t.addClass(x.active),n.removeClass(x.active+" "+x.loading))}},deactivate:{all:function(){h.deactivate.navigation(),h.deactivate.tabs()},navigation:function(){a.removeClass(x.active)},tabs:function(){g.removeClass(x.active+" "+x.loading)}},is:{tab:function(e){return void 0!==e&&h.get.tabElement(e).length>0}},get:{initialPath:function(){return a.eq(0).data(C.tab)||g.eq(0).data(C.tab)},path:function(){return e.address.value()},defaultPathArray:function(e){return h.utilities.pathToArray(h.get.defaultPath(e))},defaultPath:function(e){var t=a.filter("[data-"+C.tab+'^="'+e+'/"]').eq(0).data(C.tab)||!1;if(t){if(h.debug("Found default tab",t),E<y.maxDepth)return E++,h.get.defaultPath(t);h.error(k.recursion)}else h.debug("No default tabs found for",e,g);return E=0,e},navElement:function(e){return e=e||v,a.filter("[data-"+C.tab+'="'+e+'"]')},tabElement:function(e){var t,n,i,o;return e=e||v,i=h.utilities.pathToArray(e),o=h.utilities.last(i),t=g.filter("[data-"+C.tab+'="'+e+'"]'),n=g.filter("[data-"+C.tab+'="'+o+'"]'),t.length>0?t:n},tab:function(){return v}},utilities:{filterArray:function(t,n){return e.grep(t,function(t){return-1==e.inArray(t,n)})},last:function(t){return!!e.isArray(t)&&t[t.length-1]},pathToArray:function(e){return void 0===e&&(e=v),"string"==typeof e?e.split("/"):[e]},arrayToPath:function(t){return!!e.isArray(t)&&t.join("/")}},setting:function(t,n){if(h.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,y,t);else{if(void 0===n)return y[t];e.isPlainObject(y[t])?e.extend(!0,y[t],n):y[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,h,t);else{if(void 0===n)return h[t];h[t]=n}},debug:function(){!y.silent&&y.debug&&(y.performance?h.performance.log(arguments):(h.debug=Function.prototype.bind.call(console.info,console,y.name+":"),h.debug.apply(console,arguments)))},verbose:function(){!y.silent&&y.verbose&&y.debug&&(y.performance?h.performance.log(arguments):(h.verbose=Function.prototype.bind.call(console.info,console,y.name+":"),h.verbose.apply(console,arguments)))},error:function(){y.silent||(h.error=Function.prototype.bind.call(console.error,console,y.name+":"),h.error.apply(console,arguments))},performance:{log:function(e){var t,n;y.performance&&(n=(t=(new Date).getTime())-(s||t),s=t,l.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:F,"Execution Time":n})),clearTimeout(h.performance.timer),h.performance.timer=setTimeout(h.performance.display,500)},display:function(){var t=y.name+":",n=0;s=!1,clearTimeout(h.performance.timer),e.each(l,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",r&&(t+=" '"+r+"'"),(void 0!==console.group||void 0!==console.table)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,n,i){var a,r,s,l=O;return n=n||d,i=F||i,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]?(r=l[i],!1):(h.error(k.method,t),!1);l=l[i]}})),e.isFunction(r)?s=r.apply(i,n):void 0!==r&&(s=r),e.isArray(o)?o.push(s):void 0!==o?o=[o,s]:void 0!==s&&(o=s),r}},u?(void 0===O&&h.initialize(),h.invoke(c)):(void 0!==O&&O.invoke("destroy"),h.initialize())}),void 0!==o?o:this},e.tab=function(){e(t).tab.apply(this,arguments)},e.fn.tab.settings={name:"Tab",namespace:"tab",silent:!1,debug:!1,verbose:!1,performance:!0,auto:!1,history:!1,historyType:"hash",path:!1,context:!1,childrenOnly:!1,maxDepth:25,deactivate:"siblings",alwaysRefresh:!1,cache:!0,loadOnce:!1,cacheType:"response",ignoreFirstLoad:!1,apiSettings:!1,evaluateScripts:"once",onFirstLoad:function(e,t,n){},onLoad:function(e,t,n){},onVisible:function(e,t,n){},onRequest:function(e,t,n){},templates:{determineTitle:function(e){}},error:{api:"You attempted to load content without API module",method:"The method you called is not defined",missingTab:"Activated tab cannot be found. Tabs are case-sensitive.",noContent:"The tab you specified is missing a content url.",path:"History enabled, but no path was specified",recursion:"Max recursive depth reached",legacyInit:"onTabInit has been renamed to onFirstLoad in 2.0, please adjust your code.",legacyLoad:"onTabLoad has been renamed to onLoad in 2.0. Please adjust your code",state:"History requires Asual's Address library <https://github.com/asual/jquery-address>"},metadata:{tab:"tab",loaded:"loaded",promise:"promise"},className:{loading:"loading",active:"active"},selector:{tabs:".ui.tab",ui:".ui"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.transition=function(){var i,o=e(this),a=o.selector||"",r=(new Date).getTime(),s=[],l=arguments,c=l[0],u=[].slice.call(arguments,1),d="string"==typeof c;t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame;return o.each(function(t){var f,m,g,v,p,h,b,y,x,C=e(this),w=this;(x={initialize:function(){f=x.get.settings.apply(w,l),v=f.className,g=f.error,p=f.metadata,y="."+f.namespace,b="module-"+f.namespace,m=C.data(b)||x,h=x.get.animationEndEvent(),d&&(d=x.invoke(c)),!1===d&&(x.verbose("Converted arguments into settings object",f),f.interval?x.delay(f.animate):x.animate(),x.instantiate())},instantiate:function(){x.verbose("Storing instance of module",x),m=x,C.data(b,m)},destroy:function(){x.verbose("Destroying previous module for",w),C.removeData(b)},refresh:function(){x.verbose("Refreshing display type on next animation"),delete x.displayType},forceRepaint:function(){x.verbose("Forcing element repaint");var e=C.parent(),t=C.next();0===t.length?C.detach().appendTo(e):C.detach().insertBefore(t)},repaint:function(){x.verbose("Repainting element");w.offsetWidth},delay:function(e){var n,i=x.get.animationDirection();i||(i=x.can.transition()?x.get.direction():"static"),e=void 0!==e?e:f.interval,n="auto"==f.reverse&&i==v.outward||1==f.reverse?(o.length-t)*f.interval:t*f.interval,x.debug("Delaying animation by",n),setTimeout(x.animate,n)},animate:function(e){if(f=e||f,!x.is.supported())return x.error(g.support),!1;if(x.debug("Preparing animation",f.animation),x.is.animating()){if(f.queue)return!f.allowRepeats&&x.has.direction()&&x.is.occurring()&&!0!==x.queuing?x.debug("Animation is currently occurring, preventing queueing same animation",f.animation):x.queue(f.animation),!1;if(!f.allowRepeats&&x.is.occurring())return x.debug("Animation is already occurring, will not execute repeated animation",f.animation),!1;x.debug("New animation started, completing previous early",f.animation),m.complete()}x.can.animate()?x.set.animating(f.animation):x.error(g.noAnimation,f.animation,w)},reset:function(){x.debug("Resetting animation to beginning conditions"),x.remove.animationCallbacks(),x.restore.conditions(),x.remove.animating()},queue:function(e){x.debug("Queueing animation of",e),x.queuing=!0,C.one(h+".queue"+y,function(){x.queuing=!1,x.repaint(),x.animate.apply(this,f)})},complete:function(e){x.debug("Animation complete",f.animation),x.remove.completeCallback(),x.remove.failSafe(),x.is.looping()||(x.is.outward()?(x.verbose("Animation is outward, hiding element"),x.restore.conditions(),x.hide()):x.is.inward()?(x.verbose("Animation is outward, showing element"),x.restore.conditions(),x.show()):(x.verbose("Static animation completed"),x.restore.conditions(),f.onComplete.call(w)))},force:{visible:function(){var e=C.attr("style"),t=x.get.userStyle(),n=x.get.displayType(),i=t+"display: "+n+" !important;",o=C.css("display"),a=void 0===e||""===e;o!==n?(x.verbose("Overriding default display to show element",n),C.attr("style",i)):a&&C.removeAttr("style")},hidden:function(){var e=C.attr("style"),t=C.css("display"),n=void 0===e||""===e;"none"===t||x.is.hidden()?n&&C.removeAttr("style"):(x.verbose("Overriding default display to hide element"),C.css("display","none"))}},has:{direction:function(t){var n=!1;return"string"==typeof(t=t||f.animation)&&(t=t.split(" "),e.each(t,function(e,t){t!==v.inward&&t!==v.outward||(n=!0)})),n},inlineDisplay:function(){var t=C.attr("style")||"";return e.isArray(t.match(/display.*?;/,""))}},set:{animating:function(e){var t;x.remove.completeCallback(),e=e||f.animation,t=x.get.animationClass(e),x.save.animation(t),x.force.visible(),x.remove.hidden(),x.remove.direction(),x.start.animation(t)},duration:function(e,t){((t="number"==typeof(t=t||f.duration)?t+"ms":t)||0===t)&&(x.verbose("Setting animation duration",t),C.css({"animation-duration":t}))},direction:function(e){(e=e||x.get.direction())==v.inward?x.set.inward():x.set.outward()},looping:function(){x.debug("Transition set to loop"),C.addClass(v.looping)},hidden:function(){C.addClass(v.transition).addClass(v.hidden)},inward:function(){x.debug("Setting direction to inward"),C.removeClass(v.outward).addClass(v.inward)},outward:function(){x.debug("Setting direction to outward"),C.removeClass(v.inward).addClass(v.outward)},visible:function(){C.addClass(v.transition).addClass(v.visible)}},start:{animation:function(e){e=e||x.get.animationClass(),x.debug("Starting tween",e),C.addClass(e).one(h+".complete"+y,x.complete),f.useFailSafe&&x.add.failSafe(),x.set.duration(f.duration),f.onStart.call(w)}},save:{animation:function(e){x.cache||(x.cache={}),x.cache.animation=e},displayType:function(e){"none"!==e&&C.data(p.displayType,e)},transitionExists:function(t,n){e.fn.transition.exists[t]=n,x.verbose("Saving existence of transition",t,n)}},restore:{conditions:function(){var e=x.get.currentAnimation();e&&(C.removeClass(e),x.verbose("Removing animation class",x.cache)),x.remove.duration()}},add:{failSafe:function(){var e=x.get.duration();x.timer=setTimeout(function(){C.triggerHandler(h)},e+f.failSafeDelay),x.verbose("Adding fail safe timer",x.timer)}},remove:{animating:function(){C.removeClass(v.animating)},animationCallbacks:function(){x.remove.queueCallback(),x.remove.completeCallback()},queueCallback:function(){C.off(".queue"+y)},completeCallback:function(){C.off(".complete"+y)},display:function(){C.css("display","")},direction:function(){C.removeClass(v.inward).removeClass(v.outward)},duration:function(){C.css("animation-duration","")},failSafe:function(){x.verbose("Removing fail safe timer",x.timer),x.timer&&clearTimeout(x.timer)},hidden:function(){C.removeClass(v.hidden)},visible:function(){C.removeClass(v.visible)},looping:function(){x.debug("Transitions are no longer looping"),x.is.looping()&&(x.reset(),C.removeClass(v.looping))},transition:function(){C.removeClass(v.visible).removeClass(v.hidden)}},get:{settings:function(t,n,i){return"object"==typeof t?e.extend(!0,{},e.fn.transition.settings,t):"function"==typeof i?e.extend({},e.fn.transition.settings,{animation:t,onComplete:i,duration:n}):"string"==typeof n||"number"==typeof n?e.extend({},e.fn.transition.settings,{animation:t,duration:n}):"object"==typeof n?e.extend({},e.fn.transition.settings,n,{animation:t}):"function"==typeof n?e.extend({},e.fn.transition.settings,{animation:t,onComplete:n}):e.extend({},e.fn.transition.settings,{animation:t})},animationClass:function(e){var t=e||f.animation,n=x.can.transition()&&!x.has.direction()?x.get.direction()+" ":"";return v.animating+" "+v.transition+" "+n+t},currentAnimation:function(){return!(!x.cache||void 0===x.cache.animation)&&x.cache.animation},currentDirection:function(){return x.is.inward()?v.inward:v.outward},direction:function(){return x.is.hidden()||!x.is.visible()?v.inward:v.outward},animationDirection:function(t){var n;return"string"==typeof(t=t||f.animation)&&(t=t.split(" "),e.each(t,function(e,t){t===v.inward?n=v.inward:t===v.outward&&(n=v.outward)})),n||!1},duration:function(e){return!1===(e=e||f.duration)&&(e=C.css("animation-duration")||0),"string"==typeof e?e.indexOf("ms")>-1?parseFloat(e):1e3*parseFloat(e):e},displayType:function(e){return e=void 0===e||e,f.displayType?f.displayType:(e&&void 0===C.data(p.displayType)&&x.can.transition(!0),C.data(p.displayType))},userStyle:function(e){return(e=e||C.attr("style")||"").replace(/display.*?;/,"")},transitionExists:function(t){return e.fn.transition.exists[t]},animationStartEvent:function(){var e,t=n.createElement("div"),i={animation:"animationstart",OAnimation:"oAnimationStart",MozAnimation:"mozAnimationStart",WebkitAnimation:"webkitAnimationStart"};for(e in i)if(void 0!==t.style[e])return i[e];return!1},animationEndEvent:function(){var e,t=n.createElement("div"),i={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"mozAnimationEnd",WebkitAnimation:"webkitAnimationEnd"};for(e in i)if(void 0!==t.style[e])return i[e];return!1}},can:{transition:function(t){var n,i,o,a,r,s,l=f.animation,c=x.get.transitionExists(l),u=x.get.displayType(!1);if(void 0===c||t){if(x.verbose("Determining whether animation exists"),n=C.attr("class"),i=C.prop("tagName"),o=e("<"+i+" />").addClass(n).insertAfter(C),a=o.addClass(l).removeClass(v.inward).removeClass(v.outward).addClass(v.animating).addClass(v.transition).css("animationName"),r=o.addClass(v.inward).css("animationName"),u||(u=o.attr("class",n).removeAttr("style").removeClass(v.hidden).removeClass(v.visible).show().css("display"),x.verbose("Determining final display state",u),x.save.displayType(u)),o.remove(),a!=r)x.debug("Direction exists for animation",l),s=!0;else{if("none"==a||!a)return void x.debug("No animation defined in css",l);x.debug("Static animation found",l,u),s=!1}x.save.transitionExists(l,s)}return void 0!==c?c:s},animate:function(){return void 0!==x.can.transition()}},is:{animating:function(){return C.hasClass(v.animating)},inward:function(){return C.hasClass(v.inward)},outward:function(){return C.hasClass(v.outward)},looping:function(){return C.hasClass(v.looping)},occurring:function(e){return e=e||f.animation,e="."+e.replace(" ","."),C.filter(e).length>0},visible:function(){return C.is(":visible")},hidden:function(){return"hidden"===C.css("visibility")},supported:function(){return!1!==h}},hide:function(){x.verbose("Hiding element"),x.is.animating()&&x.reset(),w.blur(),x.remove.display(),x.remove.visible(),x.set.hidden(),x.force.hidden(),f.onHide.call(w),f.onComplete.call(w)},show:function(e){x.verbose("Showing element",e),x.remove.hidden(),x.set.visible(),x.force.visible(),f.onShow.call(w),f.onComplete.call(w)},toggle:function(){x.is.visible()?x.hide():x.show()},stop:function(){x.debug("Stopping current animation"),C.triggerHandler(h)},stopAll:function(){x.debug("Stopping all animation"),x.remove.queueCallback(),C.triggerHandler(h)},clear:{queue:function(){x.debug("Clearing animation queue"),x.remove.queueCallback()}},enable:function(){x.verbose("Starting animation"),C.removeClass(v.disabled)},disable:function(){x.debug("Stopping animation"),C.addClass(v.disabled)},setting:function(t,n){if(x.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,f,t);else{if(void 0===n)return f[t];e.isPlainObject(f[t])?e.extend(!0,f[t],n):f[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,x,t);else{if(void 0===n)return x[t];x[t]=n}},debug:function(){!f.silent&&f.debug&&(f.performance?x.performance.log(arguments):(x.debug=Function.prototype.bind.call(console.info,console,f.name+":"),x.debug.apply(console,arguments)))},verbose:function(){!f.silent&&f.verbose&&f.debug&&(f.performance?x.performance.log(arguments):(x.verbose=Function.prototype.bind.call(console.info,console,f.name+":"),x.verbose.apply(console,arguments)))},error:function(){f.silent||(x.error=Function.prototype.bind.call(console.error,console,f.name+":"),x.error.apply(console,arguments))},performance:{log:function(e){var t,n;f.performance&&(n=(t=(new Date).getTime())-(r||t),r=t,s.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:w,"Execution Time":n})),clearTimeout(x.performance.timer),x.performance.timer=setTimeout(x.performance.display,500)},display:function(){var t=f.name+":",n=0;r=!1,clearTimeout(x.performance.timer),e.each(s,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",a&&(t+=" '"+a+"'"),o.length>1&&(t+=" ("+o.length+")"),(void 0!==console.group||void 0!==console.table)&&s.length>0&&(console.groupCollapsed(t),console.table?console.table(s):e.each(s,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(t,n,o){var a,r,s,l=m;return n=n||u,o=w||o,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]&&(r=l[i],!1);l=l[i]}})),e.isFunction(r)?s=r.apply(o,n):void 0!==r&&(s=r),e.isArray(i)?i.push(s):void 0!==i?i=[i,s]:void 0!==s&&(i=s),void 0!==r&&r}}).initialize()}),void 0!==i?i:this},e.fn.transition.exists={},e.fn.transition.settings={name:"Transition",silent:!1,debug:!1,verbose:!1,performance:!0,namespace:"transition",interval:0,reverse:"auto",onStart:function(){},onComplete:function(){},onShow:function(){},onHide:function(){},useFailSafe:!0,failSafeDelay:100,allowRepeats:!1,displayType:!1,animation:"fade",duration:!1,queue:!0,metadata:{displayType:"display"},className:{animating:"animating",disabled:"disabled",hidden:"hidden",inward:"in",loading:"loading",looping:"looping",outward:"out",transition:"transition",visible:"visible"},error:{noAnimation:"Element is no longer attached to DOM. Unable to animate.  Use silent setting to surpress this warning in production.",repeated:"That animation is already occurring, cancelling repeated animation",method:"The method you called is not defined",support:"This browser does not support CSS animations"}}}(jQuery,window,document),function(e,t,n,i){"use strict";var t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();e.api=e.fn.api=function(n){var i,o=e(e.isFunction(this)?t:this),a=o.selector||"",r=(new Date).getTime(),s=[],l=arguments[0],c="string"==typeof l,u=[].slice.call(arguments,1);return o.each(function(){var o,d,f,m,g,v=e.isPlainObject(n)?e.extend(!0,{},e.fn.api.settings,n):e.extend({},e.fn.api.settings),p=v.namespace,h=v.metadata,b=v.selector,y=v.error,x=v.className,C="."+p,w="module-"+p,k=e(this),S=k.closest(b.form),T=v.stateContext?e(v.stateContext):k,A=this,R=T[0],P=k.data(w);g={initialize:function(){c||g.bind.events(),g.instantiate()},instantiate:function(){g.verbose("Storing instance of module",g),P=g,k.data(w,P)},destroy:function(){g.verbose("Destroying previous module for",A),k.removeData(w).off(C)},bind:{events:function(){var e=g.get.event();e?(g.verbose("Attaching API events to element",e),k.on(e+C,g.event.trigger)):"now"==v.on&&(g.debug("Querying API endpoint immediately"),g.query())}},decode:{json:function(e){if(void 0!==e&&"string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}},read:{cachedResponse:function(e){var n;{if(void 0!==t.Storage)return n=sessionStorage.getItem(e),g.debug("Using cached response",e,n),n=g.decode.json(n);g.error(y.noStorage)}}},write:{cachedResponse:function(n,i){i&&""===i?g.debug("Response empty, not caching",i):void 0!==t.Storage?(e.isPlainObject(i)&&(i=JSON.stringify(i)),sessionStorage.setItem(n,i),g.verbose("Storing cached response for url",n,i)):g.error(y.noStorage)}},query:function(){if(g.is.disabled())g.debug("Element is disabled API request aborted");else{if(g.is.loading()){if(!v.interruptRequests)return void g.debug("Cancelling request, previous request is still pending");g.debug("Interrupting previous request"),g.abort()}if(v.defaultData&&e.extend(!0,v.urlData,g.get.defaultData()),v.serializeForm&&(v.data=g.add.formData(v.data)),!1===(d=g.get.settings()))return g.cancelled=!0,void g.error(y.beforeSend);if(g.cancelled=!1,(f=g.get.templatedURL())||g.is.mocked()){if((f=g.add.urlData(f))||g.is.mocked()){if(d.url=v.base+f,o=e.extend(!0,{},v,{type:v.method||v.type,data:void 0,url:v.base+f,beforeSend:v.beforeXHR,success:function(){},failure:function(){},complete:function(){}}),g.debug("Querying URL",o.url),g.verbose("Using AJAX settings",o),"local"===v.cache&&g.read.cachedResponse(f))return g.debug("Response returned from local cache"),g.request=g.create.request(),void g.request.resolveWith(R,[g.read.cachedResponse(f)]);v.throttle?v.throttleFirstRequest||g.timer?(g.debug("Throttling request",v.throttle),clearTimeout(g.timer),g.timer=setTimeout(function(){g.timer&&delete g.timer,g.debug("Sending throttled request",void 0,o.method),g.send.request()},v.throttle)):(g.debug("Sending request",void 0,o.method),g.send.request(),g.timer=setTimeout(function(){},v.throttle)):(g.debug("Sending request",void 0,o.method),g.send.request())}}else g.error(y.missingURL)}},should:{removeError:function(){return!0===v.hideError||"auto"===v.hideError&&!g.is.form()}},is:{disabled:function(){return k.filter(b.disabled).length>0},expectingJSON:function(){return"json"===v.dataType||"jsonp"===v.dataType},form:function(){return k.is("form")||T.is("form")},mocked:function(){return v.mockResponse||v.mockResponseAsync||v.response||v.responseAsync},input:function(){return k.is("input")},loading:function(){return!!g.request&&"pending"==g.request.state()},abortedRequest:function(e){return e&&void 0!==e.readyState&&0===e.readyState?(g.verbose("XHR request determined to be aborted"),!0):(g.verbose("XHR request was not aborted"),!1)},validResponse:function(t){return g.is.expectingJSON()&&e.isFunction(v.successTest)?(g.debug("Checking JSON returned success",v.successTest,t),v.successTest(t)?(g.debug("Response passed success test",t),!0):(g.debug("Response failed success test",t),!1)):(g.verbose("Response is not JSON, skipping validation",v.successTest,t),!0)}},was:{cancelled:function(){return g.cancelled||!1},succesful:function(){return g.request&&"resolved"==g.request.state()},failure:function(){return g.request&&"rejected"==g.request.state()},complete:function(){return g.request&&("resolved"==g.request.state()||"rejected"==g.request.state())}},add:{urlData:function(t,n){var i,o;return t&&(i=t.match(v.regExp.required),o=t.match(v.regExp.optional),n=n||v.urlData,i&&(g.debug("Looking for required URL variables",i),e.each(i,function(i,o){var a=-1!==o.indexOf("$")?o.substr(2,o.length-3):o.substr(1,o.length-2),r=e.isPlainObject(n)&&void 0!==n[a]?n[a]:void 0!==k.data(a)?k.data(a):void 0!==T.data(a)?T.data(a):n[a];if(void 0===r)return g.error(y.requiredParameter,a,t),t=!1,!1;g.verbose("Found required variable",a,r),r=v.encodeParameters?g.get.urlEncodedValue(r):r,t=t.replace(o,r)})),o&&(g.debug("Looking for optional URL variables",i),e.each(o,function(i,o){var a=-1!==o.indexOf("$")?o.substr(3,o.length-4):o.substr(2,o.length-3),r=e.isPlainObject(n)&&void 0!==n[a]?n[a]:void 0!==k.data(a)?k.data(a):void 0!==T.data(a)?T.data(a):n[a];void 0!==r?(g.verbose("Optional variable Found",a,r),t=t.replace(o,r)):(g.verbose("Optional variable not found",a),t=-1!==t.indexOf("/"+o)?t.replace("/"+o,""):t.replace(o,""))}))),t},formData:function(t){var n=void 0!==e.fn.serializeObject,i=n?S.serializeObject():S.serialize();return t=t||v.data,e.isPlainObject(t)?n?(g.debug("Extending existing data with form data",t,i),t=e.extend(!0,{},t,i)):(g.error(y.missingSerialize),g.debug("Cant extend data. Replacing data with form data",t,i),t=i):(g.debug("Adding form data",i),t=i),t}},send:{request:function(){g.set.loading(),g.request=g.create.request(),g.is.mocked()?g.mockedXHR=g.create.mockedXHR():g.xhr=g.create.xhr(),v.onRequest.call(R,g.request,g.xhr)}},event:{trigger:function(e){g.query(),"submit"!=e.type&&"click"!=e.type||e.preventDefault()},xhr:{always:function(){},done:function(t,n,i){var o=this,a=(new Date).getTime()-m,r=v.loadingDuration-a,s=!!e.isFunction(v.onResponse)&&(g.is.expectingJSON()?v.onResponse.call(o,e.extend(!0,{},t)):v.onResponse.call(o,t));r=r>0?r:0,s&&(g.debug("Modified API response in onResponse callback",v.onResponse,s,t),t=s),r>0&&g.debug("Response completed early delaying state change by",r),setTimeout(function(){g.is.validResponse(t)?g.request.resolveWith(o,[t,i]):g.request.rejectWith(o,[i,"invalid"])},r)},fail:function(e,t,n){var i=this,o=(new Date).getTime()-m,a=v.loadingDuration-o;(a=a>0?a:0)>0&&g.debug("Response completed early delaying state change by",a),setTimeout(function(){g.is.abortedRequest(e)?g.request.rejectWith(i,[e,"aborted",n]):g.request.rejectWith(i,[e,"error",t,n])},a)}},request:{done:function(e,t){g.debug("Successful API Response",e),"local"===v.cache&&f&&(g.write.cachedResponse(f,e),g.debug("Saving server response locally",g.cache)),v.onSuccess.call(R,e,k,t)},complete:function(e,t){var n,i;g.was.succesful()?(i=e,n=t):(n=e,i=g.get.responseFromXHR(n)),g.remove.loading(),v.onComplete.call(R,i,k,n)},fail:function(e,t,n){var i=g.get.responseFromXHR(e),a=g.get.errorFromRequest(i,t,n);if("aborted"==t)return g.debug("XHR Aborted (Most likely caused by page navigation or CORS Policy)",t,n),v.onAbort.call(R,t,k,e),!0;"invalid"==t?g.debug("JSON did not pass success test. A server-side error has most likely occurred",i):"error"==t&&void 0!==e&&(g.debug("XHR produced a server error",t,n),200!=e.status&&void 0!==n&&""!==n&&g.error(y.statusMessage+n,o.url),v.onError.call(R,a,k,e)),v.errorDuration&&"aborted"!==t&&(g.debug("Adding error state"),g.set.error(),g.should.removeError()&&setTimeout(g.remove.error,v.errorDuration)),g.debug("API Request failed",a,e),v.onFailure.call(R,i,k,e)}}},create:{request:function(){return e.Deferred().always(g.event.request.complete).done(g.event.request.done).fail(g.event.request.fail)},mockedXHR:function(){var t,n,i,o=v.mockResponse||v.response,a=v.mockResponseAsync||v.responseAsync;return i=e.Deferred().always(g.event.xhr.complete).done(g.event.xhr.done).fail(g.event.xhr.fail),o?(e.isFunction(o)?(g.debug("Using specified synchronous callback",o),n=o.call(R,d)):(g.debug("Using settings specified response",o),n=o),i.resolveWith(R,[n,!1,{responseText:n}])):e.isFunction(a)&&(t=function(e){g.debug("Async callback returned response",e),e?i.resolveWith(R,[e,!1,{responseText:e}]):i.rejectWith(R,[{responseText:e},!1,!1])},g.debug("Using specified async response callback",a),a.call(R,d,t)),i},xhr:function(){var t;return t=e.ajax(o).always(g.event.xhr.always).done(g.event.xhr.done).fail(g.event.xhr.fail),g.verbose("Created server request",t,o),t}},set:{error:function(){g.verbose("Adding error state to element",T),T.addClass(x.error)},loading:function(){g.verbose("Adding loading state to element",T),T.addClass(x.loading),m=(new Date).getTime()}},remove:{error:function(){g.verbose("Removing error state from element",T),T.removeClass(x.error)},loading:function(){g.verbose("Removing loading state from element",T),T.removeClass(x.loading)}},get:{responseFromXHR:function(t){return!!e.isPlainObject(t)&&(g.is.expectingJSON()?g.decode.json(t.responseText):t.responseText)},errorFromRequest:function(t,n,i){return e.isPlainObject(t)&&void 0!==t.error?t.error:void 0!==v.error[n]?v.error[n]:i},request:function(){return g.request||!1},xhr:function(){return g.xhr||!1},settings:function(){var t;return(t=v.beforeSend.call(R,v))&&(void 0!==t.success&&(g.debug("Legacy success callback detected",t),g.error(y.legacyParameters,t.success),t.onSuccess=t.success),void 0!==t.failure&&(g.debug("Legacy failure callback detected",t),g.error(y.legacyParameters,t.failure),t.onFailure=t.failure),void 0!==t.complete&&(g.debug("Legacy complete callback detected",t),g.error(y.legacyParameters,t.complete),t.onComplete=t.complete)),void 0===t&&g.error(y.noReturnedValue),!1===t?t:void 0!==t?e.extend(!0,{},t):e.extend(!0,{},v)},urlEncodedValue:function(e){var n=t.decodeURIComponent(e),i=t.encodeURIComponent(e);return n!==e?(g.debug("URL value is already encoded, avoiding double encoding",e),e):(g.verbose("Encoding value using encodeURIComponent",e,i),i)},defaultData:function(){var t={};return e.isWindow(A)||(g.is.input()?t.value=k.val():g.is.form()||(t.text=k.text())),t},event:function(){return e.isWindow(A)||"now"==v.on?(g.debug("API called without element, no events attached"),!1):"auto"==v.on?k.is("input")?void 0!==A.oninput?"input":void 0!==A.onpropertychange?"propertychange":"keyup":k.is("form")?"submit":"click":v.on},templatedURL:function(e){if(e=e||k.data(h.action)||v.action||!1,f=k.data(h.url)||v.url||!1)return g.debug("Using specified url",f),f;if(e){if(g.debug("Looking up url for action",e,v.api),void 0===v.api[e]&&!g.is.mocked())return void g.error(y.missingAction,v.action,v.api);f=v.api[e]}else g.is.form()&&(f=k.attr("action")||T.attr("action")||!1,g.debug("No url or action specified, defaulting to form action",f));return f}},abort:function(){var e=g.get.xhr();e&&"resolved"!==e.state()&&(g.debug("Cancelling API request"),e.abort())},reset:function(){g.remove.error(),g.remove.loading()},setting:function(t,n){if(g.debug("Changing setting",t,n),e.isPlainObject(t))e.extend(!0,v,t);else{if(void 0===n)return v[t];e.isPlainObject(v[t])?e.extend(!0,v[t],n):v[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,g,t);else{if(void 0===n)return g[t];g[t]=n}},debug:function(){!v.silent&&v.debug&&(v.performance?g.performance.log(arguments):(g.debug=Function.prototype.bind.call(console.info,console,v.name+":"),g.debug.apply(console,arguments)))},verbose:function(){!v.silent&&v.verbose&&v.debug&&(v.performance?g.performance.log(arguments):(g.verbose=Function.prototype.bind.call(console.info,console,v.name+":"),g.verbose.apply(console,arguments)))},error:function(){v.silent||(g.error=Function.prototype.bind.call(console.error,console,v.name+":"),g.error.apply(console,arguments))},performance:{log:function(e){var t,n;v.performance&&(n=(t=(new Date).getTime())-(r||t),r=t,s.push({Name:e[0],Arguments:[].slice.call(e,1)||"","Execution Time":n})),clearTimeout(g.performance.timer),g.performance.timer=setTimeout(g.performance.display,500)},display:function(){var t=v.name+":",n=0;r=!1,clearTimeout(g.performance.timer),e.each(s,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",a&&(t+=" '"+a+"'"),(void 0!==console.group||void 0!==console.table)&&s.length>0&&(console.groupCollapsed(t),console.table?console.table(s):e.each(s,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(t,n,o){var a,r,s,l=P;return n=n||u,o=A||o,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]?(r=l[i],!1):(g.error(y.method,t),!1);l=l[i]}})),e.isFunction(r)?s=r.apply(o,n):void 0!==r&&(s=r),e.isArray(i)?i.push(s):void 0!==i?i=[i,s]:void 0!==s&&(i=s),r}},c?(void 0===P&&g.initialize(),g.invoke(l)):(void 0!==P&&P.invoke("destroy"),g.initialize())}),void 0!==i?i:this},e.api.settings={name:"API",namespace:"api",debug:!1,verbose:!1,performance:!0,api:{},cache:!0,interruptRequests:!0,on:"auto",stateContext:!1,loadingDuration:0,hideError:"auto",errorDuration:2e3,encodeParameters:!0,action:!1,url:!1,base:"",urlData:{},defaultData:!0,serializeForm:!1,throttle:0,throttleFirstRequest:!0,method:"get",data:{},dataType:"json",mockResponse:!1,mockResponseAsync:!1,response:!1,responseAsync:!1,beforeSend:function(e){return e},beforeXHR:function(e){},onRequest:function(e,t){},onResponse:!1,onSuccess:function(e,t){},onComplete:function(e,t){},onFailure:function(e,t){},onError:function(e,t){},onAbort:function(e,t){},successTest:!1,error:{beforeSend:"The before send function has aborted the request",error:"There was an error with your request",exitConditions:"API Request Aborted. Exit conditions met",JSONParse:"JSON could not be parsed during error handling",legacyParameters:"You are using legacy API success callback names",method:"The method you called is not defined",missingAction:"API action used but no url was defined",missingSerialize:"jquery-serialize-object is required to add form data to an existing data object",missingURL:"No URL specified for api event",noReturnedValue:"The beforeSend callback must return a settings object, beforeSend ignored.",noStorage:"Caching responses locally requires session storage",parseError:"There was an error parsing your request",requiredParameter:"Missing a required URL parameter: ",statusMessage:"Server gave an error: ",timeout:"Your request timed out"},regExp:{required:/\{\$*[A-z0-9]+\}/g,optional:/\{\/\$*[A-z0-9]+\}/g},className:{loading:"loading",error:"error"},selector:{disabled:".disabled",form:"form"},metadata:{action:"action",url:"url"}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.state=function(t){var i,o=e(this),a=o.selector||"",r=(n.documentElement,(new Date).getTime()),s=[],l=arguments[0],c="string"==typeof l,u=[].slice.call(arguments,1);return o.each(function(){var n,d=e.isPlainObject(t)?e.extend(!0,{},e.fn.state.settings,t):e.extend({},e.fn.state.settings),f=d.error,m=d.metadata,g=d.className,v=d.namespace,p=d.states,h=d.text,b="."+v,y=v+"-module",x=e(this),C=this,w=x.data(y);n={initialize:function(){n.verbose("Initializing module"),d.automatic&&n.add.defaults(),d.context&&""!==a?e(d.context).on(a,"mouseenter"+b,n.change.text).on(a,"mouseleave"+b,n.reset.text).on(a,"click"+b,n.toggle.state):x.on("mouseenter"+b,n.change.text).on("mouseleave"+b,n.reset.text).on("click"+b,n.toggle.state),n.instantiate()},instantiate:function(){n.verbose("Storing instance of module",n),w=n,x.data(y,n)},destroy:function(){n.verbose("Destroying previous module",w),x.off(b).removeData(y)},refresh:function(){n.verbose("Refreshing selector cache"),x=e(C)},add:{defaults:function(){var i=t&&e.isPlainObject(t.states)?t.states:{};e.each(d.defaults,function(t,o){void 0!==n.is[t]&&n.is[t]()&&(n.verbose("Adding default states",t,C),e.extend(d.states,o,i))})}},is:{active:function(){return x.hasClass(g.active)},loading:function(){return x.hasClass(g.loading)},inactive:function(){return!x.hasClass(g.active)},state:function(e){return void 0!==g[e]&&x.hasClass(g[e])},enabled:function(){return!x.is(d.filter.active)},disabled:function(){return x.is(d.filter.active)},textEnabled:function(){return!x.is(d.filter.text)},button:function(){return x.is(".button:not(a, .submit)")},input:function(){return x.is("input")},progress:function(){return x.is(".ui.progress")}},allow:function(e){n.debug("Now allowing state",e),p[e]=!0},disallow:function(e){n.debug("No longer allowing",e),p[e]=!1},allows:function(e){return p[e]||!1},enable:function(){x.removeClass(g.disabled)},disable:function(){x.addClass(g.disabled)},setState:function(e){n.allows(e)&&x.addClass(g[e])},removeState:function(e){n.allows(e)&&x.removeClass(g[e])},toggle:{state:function(){var t;if(n.allows("active")&&n.is.enabled()){if(n.refresh(),void 0!==e.fn.api)if(t=x.api("get request"),x.api("was cancelled"))n.debug("API Request cancelled by beforesend"),d.activateTest=function(){return!1},d.deactivateTest=function(){return!1};else if(t)return void n.listenTo(t);n.change.state()}}},listenTo:function(t){n.debug("API request detected, waiting for state signal",t),t&&(h.loading&&n.update.text(h.loading),e.when(t).then(function(){"resolved"==t.state()?(n.debug("API request succeeded"),d.activateTest=function(){return!0},d.deactivateTest=function(){return!0}):(n.debug("API request failed"),d.activateTest=function(){return!1},d.deactivateTest=function(){return!1}),n.change.state()}))},change:{state:function(){n.debug("Determining state change direction"),n.is.inactive()?n.activate():n.deactivate(),d.sync&&n.sync(),d.onChange.call(C)},text:function(){n.is.textEnabled()&&(n.is.disabled()?(n.verbose("Changing text to disabled text",h.hover),n.update.text(h.disabled)):n.is.active()?h.hover?(n.verbose("Changing text to hover text",h.hover),n.update.text(h.hover)):h.deactivate&&(n.verbose("Changing text to deactivating text",h.deactivate),n.update.text(h.deactivate)):h.hover?(n.verbose("Changing text to hover text",h.hover),n.update.text(h.hover)):h.activate&&(n.verbose("Changing text to activating text",h.activate),n.update.text(h.activate)))}},activate:function(){d.activateTest.call(C)&&(n.debug("Setting state to active"),x.addClass(g.active),n.update.text(h.active),d.onActivate.call(C))},deactivate:function(){d.deactivateTest.call(C)&&(n.debug("Setting state to inactive"),x.removeClass(g.active),n.update.text(h.inactive),d.onDeactivate.call(C))},sync:function(){n.verbose("Syncing other buttons to current state"),n.is.active()?o.not(x).state("activate"):o.not(x).state("deactivate")},get:{text:function(){return d.selector.text?x.find(d.selector.text).text():x.html()},textFor:function(e){return h[e]||!1}},flash:{text:function(e,t,i){var o=n.get.text();n.debug("Flashing text message",e,t),e=e||d.text.flash,t=t||d.flashDuration,i=i||function(){},n.update.text(e),setTimeout(function(){n.update.text(o),i.call(C)},t)}},reset:{text:function(){var e=h.active||x.data(m.storedText),t=h.inactive||x.data(m.storedText);n.is.textEnabled()&&(n.is.active()&&e?(n.verbose("Resetting active text",e),n.update.text(e)):t&&(n.verbose("Resetting inactive text",e),n.update.text(t)))}},update:{text:function(e){var t=n.get.text();e&&e!==t?(n.debug("Updating text",e),d.selector.text?x.data(m.storedText,e).find(d.selector.text).text(e):x.data(m.storedText,e).html(e)):n.debug("Text is already set, ignoring update",e)}},setting:function(t,i){if(n.debug("Changing setting",t,i),e.isPlainObject(t))e.extend(!0,d,t);else{if(void 0===i)return d[t];e.isPlainObject(d[t])?e.extend(!0,d[t],i):d[t]=i}},internal:function(t,i){if(e.isPlainObject(t))e.extend(!0,n,t);else{if(void 0===i)return n[t];n[t]=i}},debug:function(){!d.silent&&d.debug&&(d.performance?n.performance.log(arguments):(n.debug=Function.prototype.bind.call(console.info,console,d.name+":"),n.debug.apply(console,arguments)))},verbose:function(){!d.silent&&d.verbose&&d.debug&&(d.performance?n.performance.log(arguments):(n.verbose=Function.prototype.bind.call(console.info,console,d.name+":"),n.verbose.apply(console,arguments)))},error:function(){d.silent||(n.error=Function.prototype.bind.call(console.error,console,d.name+":"),n.error.apply(console,arguments))},performance:{log:function(e){var t,i;d.performance&&(i=(t=(new Date).getTime())-(r||t),r=t,s.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:C,"Execution Time":i})),clearTimeout(n.performance.timer),n.performance.timer=setTimeout(n.performance.display,500)},display:function(){var t=d.name+":",i=0;r=!1,clearTimeout(n.performance.timer),e.each(s,function(e,t){i+=t["Execution Time"]}),t+=" "+i+"ms",a&&(t+=" '"+a+"'"),(void 0!==console.group||void 0!==console.table)&&s.length>0&&(console.groupCollapsed(t),console.table?console.table(s):e.each(s,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(t,o,a){var r,s,l,c=w;return o=o||u,a=C||a,"string"==typeof t&&void 0!==c&&(t=t.split(/[\. ]/),r=t.length-1,e.each(t,function(i,o){var a=i!=r?o+t[i+1].charAt(0).toUpperCase()+t[i+1].slice(1):t;if(e.isPlainObject(c[a])&&i!=r)c=c[a];else{if(void 0!==c[a])return s=c[a],!1;if(!e.isPlainObject(c[o])||i==r)return void 0!==c[o]?(s=c[o],!1):(n.error(f.method,t),!1);c=c[o]}})),e.isFunction(s)?l=s.apply(a,o):void 0!==s&&(l=s),e.isArray(i)?i.push(l):void 0!==i?i=[i,l]:void 0!==l&&(i=l),s}},c?(void 0===w&&n.initialize(),n.invoke(l)):(void 0!==w&&w.invoke("destroy"),n.initialize())}),void 0!==i?i:this},e.fn.state.settings={name:"State",debug:!1,verbose:!1,namespace:"state",performance:!0,onActivate:function(){},onDeactivate:function(){},onChange:function(){},activateTest:function(){return!0},deactivateTest:function(){return!0},automatic:!0,sync:!1,flashDuration:1e3,filter:{text:".loading, .disabled",active:".disabled"},context:!1,error:{beforeSend:"The before send function has cancelled state change",method:"The method you called is not defined."},metadata:{promise:"promise",storedText:"stored-text"},className:{active:"active",disabled:"disabled",error:"error",loading:"loading",success:"success",warning:"warning"},selector:{text:!1},defaults:{input:{disabled:!0,loading:!0,active:!0},button:{disabled:!0,loading:!0,active:!0},progress:{active:!0,success:!0,warning:!0,error:!0}},states:{active:!0,disabled:!0,error:!0,loading:!0,success:!0,warning:!0},text:{disabled:!1,flash:!1,hover:!1,active:!1,inactive:!1,activate:!1,deactivate:!1}}}(jQuery,window,document),function(e,t,n,i){"use strict";t=void 0!==t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.visibility=function(i){var o,a=e(this),r=a.selector||"",s=(new Date).getTime(),l=[],c=arguments[0],u="string"==typeof c,d=[].slice.call(arguments,1),f=a.length,m=0;return a.each(function(){var a,g,v,p,h=e.isPlainObject(i)?e.extend(!0,{},e.fn.visibility.settings,i):e.extend({},e.fn.visibility.settings),b=h.className,y=h.namespace,x=h.error,C=h.metadata,w="."+y,k="module-"+y,S=e(t),T=e(this),A=e(h.context),R=(T.selector,T.data(k)),P=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,0)},E=this,F=!1;p={initialize:function(){p.debug("Initializing",h),p.setup.cache(),p.should.trackChanges()&&("image"==h.type&&p.setup.image(),"fixed"==h.type&&p.setup.fixed(),h.observeChanges&&p.observeChanges(),p.bind.events()),p.save.position(),p.is.visible()||p.error(x.visible,T),h.initialCheck&&p.checkVisibility(),p.instantiate()},instantiate:function(){p.debug("Storing instance",p),T.data(k,p),R=p},destroy:function(){p.verbose("Destroying previous module"),v&&v.disconnect(),g&&g.disconnect(),S.off("load"+w,p.event.load).off("resize"+w,p.event.resize),A.off("scroll"+w,p.event.scroll).off("scrollchange"+w,p.event.scrollchange),"fixed"==h.type&&(p.resetFixed(),p.remove.placeholder()),T.off(w).removeData(k)},observeChanges:function(){"MutationObserver"in t&&(g=new MutationObserver(p.event.contextChanged),v=new MutationObserver(p.event.changed),g.observe(n,{childList:!0,subtree:!0}),v.observe(E,{childList:!0,subtree:!0}),p.debug("Setting up mutation observer",v))},bind:{events:function(){p.verbose("Binding visibility events to scroll and resize"),h.refreshOnLoad&&S.on("load"+w,p.event.load),S.on("resize"+w,p.event.resize),A.off("scroll"+w).on("scroll"+w,p.event.scroll).on("scrollchange"+w,p.event.scrollchange)}},event:{changed:function(e){p.verbose("DOM tree modified, updating visibility calculations"),p.timer=setTimeout(function(){p.verbose("DOM tree modified, updating sticky menu"),p.refresh()},100)},contextChanged:function(t){[].forEach.call(t,function(t){t.removedNodes&&[].forEach.call(t.removedNodes,function(t){(t==E||e(t).find(E).length>0)&&(p.debug("Element removed from DOM, tearing down events"),p.destroy())})})},resize:function(){p.debug("Window resized"),h.refreshOnResize&&P(p.refresh)},load:function(){p.debug("Page finished loading"),P(p.refresh)},scroll:function(){h.throttle?(clearTimeout(p.timer),p.timer=setTimeout(function(){A.triggerHandler("scrollchange"+w,[A.scrollTop()])},h.throttle)):P(function(){A.triggerHandler("scrollchange"+w,[A.scrollTop()])})},scrollchange:function(e,t){p.checkVisibility(t)}},precache:function(t,i){t instanceof Array||(t=[t]);for(var o=t.length,a=0,r=[],s=n.createElement("img"),l=function(){++a>=t.length&&e.isFunction(i)&&i()};o--;)(s=n.createElement("img")).onload=l,s.onerror=l,s.src=t[o],r.push(s)},enableCallbacks:function(){p.debug("Allowing callbacks to occur"),F=!1},disableCallbacks:function(){p.debug("Disabling all callbacks temporarily"),F=!0},should:{trackChanges:function(){return u?(p.debug("One time query, no need to bind events"),!1):(p.debug("Callbacks being attached"),!0)}},setup:{cache:function(){p.cache={occurred:{},screen:{},element:{}}},image:function(){var e=T.data(C.src);e&&(p.verbose("Lazy loading image",e),h.once=!0,h.observeChanges=!1,h.onOnScreen=function(){p.debug("Image on screen",E),p.precache(e,function(){p.set.image(e,function(){++m==f&&h.onAllLoaded.call(this),h.onLoad.call(this)})})})},fixed:function(){p.debug("Setting up fixed"),h.once=!1,h.observeChanges=!1,h.initialCheck=!0,h.refreshOnLoad=!0,i.transition||(h.transition=!1),p.create.placeholder(),p.debug("Added placeholder",a),h.onTopPassed=function(){p.debug("Element passed, adding fixed position",T),p.show.placeholder(),p.set.fixed(),h.transition&&void 0!==e.fn.transition&&T.transition(h.transition,h.duration)},h.onTopPassedReverse=function(){p.debug("Element returned to position, removing fixed",T),p.hide.placeholder(),p.remove.fixed()}}},create:{placeholder:function(){p.verbose("Creating fixed position placeholder"),a=T.clone(!1).css("display","none").addClass(b.placeholder).insertAfter(T)}},show:{placeholder:function(){p.verbose("Showing placeholder"),a.css("display","block").css("visibility","hidden")}},hide:{placeholder:function(){p.verbose("Hiding placeholder"),a.css("display","none").css("visibility","")}},set:{fixed:function(){p.verbose("Setting element to fixed position"),T.addClass(b.fixed).css({position:"fixed",top:h.offset+"px",left:"auto",zIndex:h.zIndex}),h.onFixed.call(E)},image:function(t,n){if(T.attr("src",t),h.transition)if(void 0!==e.fn.transition){if(T.hasClass(b.visible))return void p.debug("Transition already occurred on this image, skipping animation");T.transition(h.transition,h.duration,n)}else T.fadeIn(h.duration,n);else T.show()}},is:{onScreen:function(){return p.get.elementCalculations().onScreen},offScreen:function(){return p.get.elementCalculations().offScreen},visible:function(){return!(!p.cache||!p.cache.element)&&!(0===p.cache.element.width&&0===p.cache.element.offset.top)},verticallyScrollableContext:function(){var e=A.get(0)!==t&&A.css("overflow-y");return"auto"==e||"scroll"==e},horizontallyScrollableContext:function(){var e=A.get(0)!==t&&A.css("overflow-x");return"auto"==e||"scroll"==e}},refresh:function(){p.debug("Refreshing constants (width/height)"),"fixed"==h.type&&p.resetFixed(),p.reset(),p.save.position(),h.checkOnRefresh&&p.checkVisibility(),h.onRefresh.call(E)},resetFixed:function(){p.remove.fixed(),p.remove.occurred()},reset:function(){p.verbose("Resetting all cached values"),e.isPlainObject(p.cache)&&(p.cache.screen={},p.cache.element={})},checkVisibility:function(e){p.verbose("Checking visibility of element",p.cache.element),!F&&p.is.visible()&&(p.save.scroll(e),p.save.calculations(),p.passed(),p.passingReverse(),p.topVisibleReverse(),p.bottomVisibleReverse(),p.topPassedReverse(),p.bottomPassedReverse(),p.onScreen(),p.offScreen(),p.passing(),p.topVisible(),p.bottomVisible(),p.topPassed(),p.bottomPassed(),h.onUpdate&&h.onUpdate.call(E,p.get.elementCalculations()))},passed:function(t,n){var i=p.get.elementCalculations();if(t&&n)h.onPassed[t]=n;else{if(void 0!==t)return p.get.pixelsPassed(t)>i.pixelsPassed;i.passing&&e.each(h.onPassed,function(e,t){i.bottomVisible||i.pixelsPassed>p.get.pixelsPassed(e)?p.execute(t,e):h.once||p.remove.occurred(t)})}},onScreen:function(e){var t=p.get.elementCalculations(),n=e||h.onOnScreen;if(e&&(p.debug("Adding callback for onScreen",e),h.onOnScreen=e),t.onScreen?p.execute(n,"onScreen"):h.once||p.remove.occurred("onScreen"),void 0!==e)return t.onOnScreen},offScreen:function(e){var t=p.get.elementCalculations(),n=e||h.onOffScreen;if(e&&(p.debug("Adding callback for offScreen",e),h.onOffScreen=e),t.offScreen?p.execute(n,"offScreen"):h.once||p.remove.occurred("offScreen"),void 0!==e)return t.onOffScreen},passing:function(e){var t=p.get.elementCalculations(),n=e||h.onPassing;if(e&&(p.debug("Adding callback for passing",e),h.onPassing=e),t.passing?p.execute(n,"passing"):h.once||p.remove.occurred("passing"),void 0!==e)return t.passing},topVisible:function(e){var t=p.get.elementCalculations(),n=e||h.onTopVisible;if(e&&(p.debug("Adding callback for top visible",e),h.onTopVisible=e),t.topVisible?p.execute(n,"topVisible"):h.once||p.remove.occurred("topVisible"),void 0===e)return t.topVisible},bottomVisible:function(e){var t=p.get.elementCalculations(),n=e||h.onBottomVisible;if(e&&(p.debug("Adding callback for bottom visible",e),h.onBottomVisible=e),t.bottomVisible?p.execute(n,"bottomVisible"):h.once||p.remove.occurred("bottomVisible"),void 0===e)return t.bottomVisible},topPassed:function(e){var t=p.get.elementCalculations(),n=e||h.onTopPassed;if(e&&(p.debug("Adding callback for top passed",e),h.onTopPassed=e),t.topPassed?p.execute(n,"topPassed"):h.once||p.remove.occurred("topPassed"),void 0===e)return t.topPassed},bottomPassed:function(e){var t=p.get.elementCalculations(),n=e||h.onBottomPassed;if(e&&(p.debug("Adding callback for bottom passed",e),h.onBottomPassed=e),t.bottomPassed?p.execute(n,"bottomPassed"):h.once||p.remove.occurred("bottomPassed"),void 0===e)return t.bottomPassed},passingReverse:function(e){var t=p.get.elementCalculations(),n=e||h.onPassingReverse;if(e&&(p.debug("Adding callback for passing reverse",e),h.onPassingReverse=e),t.passing?h.once||p.remove.occurred("passingReverse"):p.get.occurred("passing")&&p.execute(n,"passingReverse"),void 0!==e)return!t.passing},topVisibleReverse:function(e){var t=p.get.elementCalculations(),n=e||h.onTopVisibleReverse;if(e&&(p.debug("Adding callback for top visible reverse",e),h.onTopVisibleReverse=e),t.topVisible?h.once||p.remove.occurred("topVisibleReverse"):p.get.occurred("topVisible")&&p.execute(n,"topVisibleReverse"),void 0===e)return!t.topVisible},bottomVisibleReverse:function(e){var t=p.get.elementCalculations(),n=e||h.onBottomVisibleReverse;if(e&&(p.debug("Adding callback for bottom visible reverse",e),h.onBottomVisibleReverse=e),t.bottomVisible?h.once||p.remove.occurred("bottomVisibleReverse"):p.get.occurred("bottomVisible")&&p.execute(n,"bottomVisibleReverse"),void 0===e)return!t.bottomVisible},topPassedReverse:function(e){var t=p.get.elementCalculations(),n=e||h.onTopPassedReverse;if(e&&(p.debug("Adding callback for top passed reverse",e),h.onTopPassedReverse=e),t.topPassed?h.once||p.remove.occurred("topPassedReverse"):p.get.occurred("topPassed")&&p.execute(n,"topPassedReverse"),void 0===e)return!t.onTopPassed},bottomPassedReverse:function(e){var t=p.get.elementCalculations(),n=e||h.onBottomPassedReverse;if(e&&(p.debug("Adding callback for bottom passed reverse",e),h.onBottomPassedReverse=e),t.bottomPassed?h.once||p.remove.occurred("bottomPassedReverse"):p.get.occurred("bottomPassed")&&p.execute(n,"bottomPassedReverse"),void 0===e)return!t.bottomPassed},execute:function(e,t){var n=p.get.elementCalculations(),i=p.get.screenCalculations();(e=e||!1)&&(h.continuous?(p.debug("Callback being called continuously",t,n),e.call(E,n,i)):p.get.occurred(t)||(p.debug("Conditions met",t,n),e.call(E,n,i))),p.save.occurred(t)},remove:{fixed:function(){p.debug("Removing fixed position"),T.removeClass(b.fixed).css({position:"",top:"",left:"",zIndex:""}),h.onUnfixed.call(E)},placeholder:function(){p.debug("Removing placeholder content"),a&&a.remove()},occurred:function(e){if(e){var t=p.cache.occurred;void 0!==t[e]&&!0===t[e]&&(p.debug("Callback can now be called again",e),p.cache.occurred[e]=!1)}else p.cache.occurred={}}},save:{calculations:function(){p.verbose("Saving all calculations necessary to determine positioning"),p.save.direction(),p.save.screenCalculations(),p.save.elementCalculations()},occurred:function(e){e&&(void 0!==p.cache.occurred[e]&&!0===p.cache.occurred[e]||(p.verbose("Saving callback occurred",e),p.cache.occurred[e]=!0))},scroll:function(e){e=e+h.offset||A.scrollTop()+h.offset,p.cache.scroll=e},direction:function(){var e,t=p.get.scroll(),n=p.get.lastScroll();return e=t>n&&n?"down":t<n&&n?"up":"static",p.cache.direction=e,p.cache.direction},elementPosition:function(){var e=p.cache.element,t=p.get.screenSize();return p.verbose("Saving element position"),e.fits=e.height<t.height,e.offset=T.offset(),e.width=T.outerWidth(),e.height=T.outerHeight(),p.is.verticallyScrollableContext()&&(e.offset.top+=A.scrollTop()-A.offset().top),p.is.horizontallyScrollableContext()&&(e.offset.left+=A.scrollLeft-A.offset().left),p.cache.element=e,e},elementCalculations:function(){var e=p.get.screenCalculations(),t=p.get.elementPosition();return h.includeMargin?(t.margin={},t.margin.top=parseInt(T.css("margin-top"),10),t.margin.bottom=parseInt(T.css("margin-bottom"),10),t.top=t.offset.top-t.margin.top,t.bottom=t.offset.top+t.height+t.margin.bottom):(t.top=t.offset.top,t.bottom=t.offset.top+t.height),t.topPassed=e.top>=t.top,t.bottomPassed=e.top>=t.bottom,t.topVisible=e.bottom>=t.top&&!t.bottomPassed,t.bottomVisible=e.bottom>=t.bottom&&!t.topPassed,t.pixelsPassed=0,t.percentagePassed=0,t.onScreen=t.topVisible&&!t.bottomPassed,t.passing=t.topPassed&&!t.bottomPassed,t.offScreen=!t.onScreen,t.passing&&(t.pixelsPassed=e.top-t.top,t.percentagePassed=(e.top-t.top)/t.height),p.cache.element=t,p.verbose("Updated element calculations",t),t},screenCalculations:function(){var e=p.get.scroll();return p.save.direction(),p.cache.screen.top=e,p.cache.screen.bottom=e+p.cache.screen.height,p.cache.screen},screenSize:function(){p.verbose("Saving window position"),p.cache.screen={height:A.height()}},position:function(){p.save.screenSize(),p.save.elementPosition()}},get:{pixelsPassed:function(e){var t=p.get.elementCalculations();return e.search("%")>-1?t.height*(parseInt(e,10)/100):parseInt(e,10)},occurred:function(e){return void 0!==p.cache.occurred&&(p.cache.occurred[e]||!1)},direction:function(){return void 0===p.cache.direction&&p.save.direction(),p.cache.direction},elementPosition:function(){return void 0===p.cache.element&&p.save.elementPosition(),p.cache.element},elementCalculations:function(){return void 0===p.cache.element&&p.save.elementCalculations(),p.cache.element},screenCalculations:function(){return void 0===p.cache.screen&&p.save.screenCalculations(),p.cache.screen},screenSize:function(){return void 0===p.cache.screen&&p.save.screenSize(),p.cache.screen},scroll:function(){return void 0===p.cache.scroll&&p.save.scroll(),p.cache.scroll},lastScroll:function(){return void 0===p.cache.screen?(p.debug("First scroll event, no last scroll could be found"),!1):p.cache.screen.top}},setting:function(t,n){if(e.isPlainObject(t))e.extend(!0,h,t);else{if(void 0===n)return h[t];h[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,p,t);else{if(void 0===n)return p[t];p[t]=n}},debug:function(){!h.silent&&h.debug&&(h.performance?p.performance.log(arguments):(p.debug=Function.prototype.bind.call(console.info,console,h.name+":"),p.debug.apply(console,arguments)))},verbose:function(){!h.silent&&h.verbose&&h.debug&&(h.performance?p.performance.log(arguments):(p.verbose=Function.prototype.bind.call(console.info,console,h.name+":"),p.verbose.apply(console,arguments)))},error:function(){h.silent||(p.error=Function.prototype.bind.call(console.error,console,h.name+":"),p.error.apply(console,arguments))},performance:{log:function(e){var t,n;h.performance&&(n=(t=(new Date).getTime())-(s||t),s=t,l.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:E,"Execution Time":n})),clearTimeout(p.performance.timer),p.performance.timer=setTimeout(p.performance.display,500)},display:function(){var t=h.name+":",n=0;s=!1,clearTimeout(p.performance.timer),e.each(l,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",r&&(t+=" '"+r+"'"),(void 0!==console.group||void 0!==console.table)&&l.length>0&&(console.groupCollapsed(t),console.table?console.table(l):e.each(l,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),l=[]}},invoke:function(t,n,i){var a,r,s,l=R;return n=n||d,i=E||i,"string"==typeof t&&void 0!==l&&(t=t.split(/[\. ]/),a=t.length-1,e.each(t,function(n,i){var o=n!=a?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(l[o])&&n!=a)l=l[o];else{if(void 0!==l[o])return r=l[o],!1;if(!e.isPlainObject(l[i])||n==a)return void 0!==l[i]?(r=l[i],!1):(p.error(x.method,t),!1);l=l[i]}})),e.isFunction(r)?s=r.apply(i,n):void 0!==r&&(s=r),e.isArray(o)?o.push(s):void 0!==o?o=[o,s]:void 0!==s&&(o=s),r}},u?(void 0===R&&p.initialize(),R.save.scroll(),R.save.calculations(),p.invoke(c)):(void 0!==R&&R.invoke("destroy"),p.initialize())}),void 0!==o?o:this},e.fn.visibility.settings={name:"Visibility",namespace:"visibility",debug:!1,verbose:!1,performance:!0,observeChanges:!0,initialCheck:!0,refreshOnLoad:!0,refreshOnResize:!0,checkOnRefresh:!0,once:!0,continuous:!1,offset:0,includeMargin:!1,context:t,throttle:!1,type:!1,zIndex:"10",transition:"fade in",duration:1e3,onPassed:{},onOnScreen:!1,onOffScreen:!1,onPassing:!1,onTopVisible:!1,onBottomVisible:!1,onTopPassed:!1,onBottomPassed:!1,onPassingReverse:!1,onTopVisibleReverse:!1,onBottomVisibleReverse:!1,onTopPassedReverse:!1,onBottomPassedReverse:!1,onLoad:function(){},onAllLoaded:function(){},onFixed:function(){},onUnfixed:function(){},onUpdate:!1,onRefresh:function(){},metadata:{src:"src"},className:{fixed:"fixed",placeholder:"placeholder",visible:"visible"},error:{method:"The method you called is not defined.",visible:"Element is hidden, you must call refresh after element becomes visible"}}}(jQuery,window,document);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ })
],[4]);