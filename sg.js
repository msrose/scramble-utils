(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["sg"] = factory();
	else
		root["sg"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Axes = {
	  X: 'X',
	  Y: 'Y',
	  Z: 'Z'
	};

	var FaceAxisInfo = {
	  RIGHT: Axes.X,
	  LEFT: Axes.X,
	  UP: Axes.Y,
	  DOWN: Axes.Y,
	  FRONT: Axes.Z,
	  BACK: Axes.Z
	};

	var LONG_FACES = Object.keys(FaceAxisInfo);

	var randomInRange = function randomInRange(min, max) {
	  return Math.floor(Math.random() * (max - min) + min);
	};

	var coinFlip = function coinFlip() {
	  return !!randomInRange(0, 2);
	};

	var generators = {
	  '3x3x3': function x3x3() {
	    var scramble = [];
	    var lastAxis = void 0;
	    for (var i = 0; i < 20; i++) {
	      var faceSelections = LONG_FACES.filter(function (face) {
	        return FaceAxisInfo[face] !== lastAxis;
	      });
	      var rand = randomInRange(0, faceSelections.length);
	      var inverted = coinFlip();
	      var double = coinFlip();
	      var longFace = faceSelections[rand];
	      lastAxis = FaceAxisInfo[longFace];
	      scramble.push({
	        inverted: !double && inverted,
	        double: double,
	        face: longFace[0],
	        longFace: longFace
	      });
	    }
	    return scramble;
	  }
	};

	var Faces = exports.Faces = LONG_FACES.reduce(function (faceMap, faceName) {
	  faceMap[faceName] = faceName;
	  var shortName = faceName[0];
	  faceMap[shortName] = shortName;
	  return faceMap;
	}, {});

	var generate = exports.generate = function generate(puzzle) {
	  return generators[puzzle]();
	};

	var format = exports.format = function format(scramble) {
	  if (!Array.isArray(scramble)) return '';
	  return scramble.filter(function (move) {
	    return Faces[move.face];
	  }).map(function (move) {
	    var modifier = '';
	    if (move.double) {
	      modifier = '2';
	    } else if (move.inverted) {
	      modifier = "'";
	    }
	    return '' + Faces[move.face[0]] + modifier;
	  }).join(' ');
	};

	var formatted = exports.formatted = function formatted(puzzle) {
	  return format(generate(puzzle));
	};

/***/ }
/******/ ])
});
;