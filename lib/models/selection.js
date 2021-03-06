'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _warn = require('../utils/warn');

var _warn2 = _interopRequireDefault(_warn);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS = {
  anchorKey: null,
  anchorOffset: 0,
  focusKey: null,
  focusOffset: 0,
  isBackward: null,
  isFocused: false,
  marks: null
};

/**
 * Selection.
 *
 * @type {Selection}
 */

var Selection = function (_ref) {
  _inherits(Selection, _ref);

  function Selection() {
    _classCallCheck(this, Selection);

    return _possibleConstructorReturn(this, (Selection.__proto__ || Object.getPrototypeOf(Selection)).apply(this, arguments));
  }

  _createClass(Selection, [{
    key: 'hasAnchorAtStartOf',


    /**
     * Check whether anchor point of the selection is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

    value: function hasAnchorAtStartOf(node) {
      // PERF: Do a check for a `0` offset first since it's quickest.
      if (this.anchorOffset != 0) return false;
      var first = getFirst(node);
      return this.anchorKey == first.key;
    }

    /**
     * Check whether anchor point of the selection is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorAtEndOf',
    value: function hasAnchorAtEndOf(node) {
      var last = getLast(node);
      return this.anchorKey == last.key && this.anchorOffset == last.length;
    }

    /**
     * Check whether the anchor edge of a selection is in a `node` and at an
     * offset between `start` and `end`.
     *
     * @param {Node} node
     * @param {Number} start
     * @param {Number} end
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorBetween',
    value: function hasAnchorBetween(node, start, end) {
      return this.anchorOffset <= end && start <= this.anchorOffset && this.hasAnchorIn(node);
    }

    /**
     * Check whether the anchor edge of a selection is in a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorIn',
    value: function hasAnchorIn(node) {
      return node.kind == 'text' ? node.key == this.anchorKey : node.hasDescendant(this.anchorKey);
    }

    /**
     * Check whether focus point of the selection is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusAtEndOf',
    value: function hasFocusAtEndOf(node) {
      var last = getLast(node);
      return this.focusKey == last.key && this.focusOffset == last.length;
    }

    /**
     * Check whether focus point of the selection is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusAtStartOf',
    value: function hasFocusAtStartOf(node) {
      if (this.focusOffset != 0) return false;
      var first = getFirst(node);
      return this.focusKey == first.key;
    }

    /**
     * Check whether the focus edge of a selection is in a `node` and at an
     * offset between `start` and `end`.
     *
     * @param {Node} node
     * @param {Number} start
     * @param {Number} end
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusBetween',
    value: function hasFocusBetween(node, start, end) {
      return start <= this.focusOffset && this.focusOffset <= end && this.hasFocusIn(node);
    }

    /**
     * Check whether the focus edge of a selection is in a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusIn',
    value: function hasFocusIn(node) {
      return node.kind == 'text' ? node.key == this.focusKey : node.hasDescendant(this.focusKey);
    }

    /**
     * Check whether the selection is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'isAtStartOf',
    value: function isAtStartOf(node) {
      return this.isCollapsed && this.hasAnchorAtStartOf(node);
    }

    /**
     * Check whether the selection is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'isAtEndOf',
    value: function isAtEndOf(node) {
      return this.isCollapsed && this.hasAnchorAtEndOf(node);
    }

    /**
     * Focus the selection.
     *
     * @return {Selection}
     */

  }, {
    key: 'focus',
    value: function focus() {
      return this.merge({
        isFocused: true
      });
    }

    /**
     * Blur the selection.
     *
     * @return {Selection}
     */

  }, {
    key: 'blur',
    value: function blur() {
      return this.merge({
        isFocused: false
      });
    }

    /**
     * Unset the selection.
     *
     * @return {Selection}
     */

  }, {
    key: 'deselect',
    value: function deselect() {
      return this.merge({
        anchorKey: null,
        anchorOffset: 0,
        focusKey: null,
        focusOffset: 0,
        isFocused: false,
        isBackward: false
      });
    }

    /**
     * Flip the selection.
     *
     * @return {Selection}
     */

  }, {
    key: 'flip',
    value: function flip() {
      return this.merge({
        anchorKey: this.focusKey,
        anchorOffset: this.focusOffset,
        focusKey: this.anchorKey,
        focusOffset: this.anchorOffset,
        isBackward: this.isBackward == null ? null : !this.isBackward
      });
    }

    /**
     * Move the anchor offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveAnchor',
    value: function moveAnchor() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var anchorKey = this.anchorKey,
          focusKey = this.focusKey,
          focusOffset = this.focusOffset,
          isBackward = this.isBackward;

      var anchorOffset = this.anchorOffset + n;
      return this.merge({
        anchorOffset: anchorOffset,
        isBackward: anchorKey == focusKey ? anchorOffset > focusOffset : isBackward
      });
    }

    /**
     * Move the anchor offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveFocus',
    value: function moveFocus() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var anchorKey = this.anchorKey,
          anchorOffset = this.anchorOffset,
          focusKey = this.focusKey,
          isBackward = this.isBackward;

      var focusOffset = this.focusOffset + n;
      return this.merge({
        focusOffset: focusOffset,
        isBackward: focusKey == anchorKey ? anchorOffset > focusOffset : isBackward
      });
    }

    /**
     * Move the selection's anchor point to a `key` and `offset`.
     *
     * @param {String} key
     * @param {Number} offset
     * @return {Selection}
     */

  }, {
    key: 'moveAnchorTo',
    value: function moveAnchorTo(key, offset) {
      var anchorKey = this.anchorKey,
          focusKey = this.focusKey,
          focusOffset = this.focusOffset,
          isBackward = this.isBackward;

      return this.merge({
        anchorKey: key,
        anchorOffset: offset,
        isBackward: key == focusKey ? offset > focusOffset : key == anchorKey ? isBackward : null
      });
    }

    /**
     * Move the selection's focus point to a `key` and `offset`.
     *
     * @param {String} key
     * @param {Number} offset
     * @return {Selection}
     */

  }, {
    key: 'moveFocusTo',
    value: function moveFocusTo(key, offset) {
      var focusKey = this.focusKey,
          anchorKey = this.anchorKey,
          anchorOffset = this.anchorOffset,
          isBackward = this.isBackward;

      return this.merge({
        focusKey: key,
        focusOffset: offset,
        isBackward: key == anchorKey ? anchorOffset > offset : key == focusKey ? isBackward : null
      });
    }

    /**
     * Move the selection to `anchorOffset`.
     *
     * @param {Number} anchorOffset
     * @return {Selection}
     */

  }, {
    key: 'moveAnchorOffsetTo',
    value: function moveAnchorOffsetTo(anchorOffset) {
      return this.merge({
        anchorOffset: anchorOffset,
        isBackward: this.anchorKey == this.focusKey ? anchorOffset > this.focusOffset : this.isBackward
      });
    }

    /**
     * Move the selection to `focusOffset`.
     *
     * @param {Number} focusOffset
     * @return {Selection}
     */

  }, {
    key: 'moveFocusOffsetTo',
    value: function moveFocusOffsetTo(focusOffset) {
      return this.merge({
        focusOffset: focusOffset,
        isBackward: this.anchorKey == this.focusKey ? this.anchorOffset > focusOffset : this.isBackward
      });
    }

    /**
     * Move the selection to `anchorOffset` and `focusOffset`.
     *
     * @param {Number} anchorOffset
     * @param {Number} focusOffset (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveOffsetsTo',
    value: function moveOffsetsTo(anchorOffset) {
      var focusOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : anchorOffset;

      return this.moveAnchorOffsetTo(anchorOffset).moveFocusOffsetTo(focusOffset);
    }

    /**
     * Move the focus point to the anchor point.
     *
     * @return {Selection}
     */

  }, {
    key: 'moveToAnchor',
    value: function moveToAnchor() {
      return this.moveFocusTo(this.anchorKey, this.anchorOffset);
    }

    /**
     * Move the anchor point to the focus point.
     *
     * @return {Selection}
     */

  }, {
    key: 'moveToFocus',
    value: function moveToFocus() {
      return this.moveAnchorTo(this.focusKey, this.focusOffset);
    }

    /**
     * Move the selection's anchor point to the start of a `node`.
     *
     * @param {Node} node
     * @return {Selection}
     */

  }, {
    key: 'moveAnchorToStartOf',
    value: function moveAnchorToStartOf(node) {
      node = getFirst(node);
      return this.moveAnchorTo(node.key, 0);
    }

    /**
     * Move the selection's anchor point to the end of a `node`.
     *
     * @param {Node} node
     * @return {Selection}
     */

  }, {
    key: 'moveAnchorToEndOf',
    value: function moveAnchorToEndOf(node) {
      node = getLast(node);
      return this.moveAnchorTo(node.key, node.length);
    }

    /**
     * Move the selection's focus point to the start of a `node`.
     *
     * @param {Node} node
     * @return {Selection}
     */

  }, {
    key: 'moveFocusToStartOf',
    value: function moveFocusToStartOf(node) {
      node = getFirst(node);
      return this.moveFocusTo(node.key, 0);
    }

    /**
     * Move the selection's focus point to the end of a `node`.
     *
     * @param {Node} node
     * @return {Selection}
     */

  }, {
    key: 'moveFocusToEndOf',
    value: function moveFocusToEndOf(node) {
      node = getLast(node);
      return this.moveFocusTo(node.key, node.length);
    }

    /**
     * Move to the entire range of `start` and `end` nodes.
     *
     * @param {Node} start
     * @param {Node} end (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveToRangeOf',
    value: function moveToRangeOf(start) {
      var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : start;

      return this.moveAnchorToStartOf(start).moveFocusToEndOf(end);
    }

    /**
     * Normalize the selection, relative to a `node`, ensuring that the anchor
     * and focus nodes of the selection always refer to leaf text nodes.
     *
     * @param {Node} node
     * @return {Selection}
     */

  }, {
    key: 'normalize',
    value: function normalize(node) {
      var selection = this;
      var anchorKey = selection.anchorKey,
          anchorOffset = selection.anchorOffset,
          focusKey = selection.focusKey,
          focusOffset = selection.focusOffset,
          isBackward = selection.isBackward;

      // If the selection isn't formed yet or is malformed, ensure that it is
      // properly zeroed out.

      if (anchorKey == null || focusKey == null || !node.hasDescendant(anchorKey) || !node.hasDescendant(focusKey)) {
        return selection.merge({
          anchorKey: null,
          anchorOffset: 0,
          focusKey: null,
          focusOffset: 0,
          isBackward: false
        });
      }

      // Get the anchor and focus nodes.
      var anchorNode = node.getDescendant(anchorKey);
      var focusNode = node.getDescendant(focusKey);

      // If the anchor node isn't a text node, match it to one.
      if (anchorNode.kind != 'text') {
        (0, _warn2.default)('The selection anchor was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:', anchorNode);
        var anchorText = anchorNode.getTextAtOffset(anchorOffset);
        var offset = anchorNode.getOffset(anchorText.key);
        anchorOffset = anchorOffset - offset;
        anchorNode = anchorText;
      }

      // If the focus node isn't a text node, match it to one.
      if (focusNode.kind != 'text') {
        (0, _warn2.default)('The selection focus was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:', focusNode);
        var focusText = focusNode.getTextAtOffset(focusOffset);
        var _offset = focusNode.getOffset(focusText.key);
        focusOffset = focusOffset - _offset;
        focusNode = focusText;
      }

      // If `isBackward` is not set, derive it.
      if (isBackward == null) {
        if (anchorNode.key === focusNode.key) {
          isBackward = anchorOffset > focusOffset;
        } else {
          isBackward = !node.areDescendantsSorted(anchorNode.key, focusNode.key);
        }
      }

      // Merge in any updated properties.
      return selection.merge({
        anchorKey: anchorNode.key,
        anchorOffset: anchorOffset,
        focusKey: focusNode.key,
        focusOffset: focusOffset,
        isBackward: isBackward
      });
    }

    /**
     * Unset the selection.
     *
     * @return {Selection}
     */

  }, {
    key: 'unset',
    value: function unset() {
      (0, _warn2.default)('The `Selection.unset` method is deprecated, please switch to using `Selection.deselect` instead.');
      return this.deselect();
    }

    /**
     * Move the selection forward `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveForward',
    value: function moveForward() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      (0, _warn2.default)('The `Selection.moveForward(n)` method is deprecated, please switch to using `Selection.move(n)` instead.');
      return this.move(n);
    }

    /**
     * Move the selection backward `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveBackward',
    value: function moveBackward() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      (0, _warn2.default)('The `Selection.moveBackward(n)` method is deprecated, please switch to using `Selection.move(-n)` (with a negative number) instead.');
      return this.move(0 - n);
    }

    /**
     * Move the anchor offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveAnchorOffset',
    value: function moveAnchorOffset() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      (0, _warn2.default)('The `Selection.moveAnchorOffset(n)` method is deprecated, please switch to using `Selection.moveAnchor(n)` instead.');
      return this.moveAnchor(n);
    }

    /**
     * Move the focus offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveFocusOffset',
    value: function moveFocusOffset() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      (0, _warn2.default)('The `Selection.moveFocusOffset(n)` method is deprecated, please switch to using `Selection.moveFocus(n)` instead.');
      return this.moveFocus(n);
    }

    /**
     * Move the start offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveStartOffset',
    value: function moveStartOffset() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      (0, _warn2.default)('The `Selection.moveStartOffset(n)` method is deprecated, please switch to using `Selection.moveStart(n)` instead.');
      return this.moveStart(n);
    }

    /**
     * Move the focus offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveEndOffset',
    value: function moveEndOffset() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      (0, _warn2.default)('The `Selection.moveEndOffset(n)` method is deprecated, please switch to using `Selection.moveEnd(n)` instead.');
      return this.moveEnd(n);
    }

    /**
     * Extend the focus point forward `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'extendForward',
    value: function extendForward() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      (0, _warn2.default)('The `Selection.extendForward(n)` method is deprecated, please switch to using `Selection.extend(n)` instead.');
      return this.extend(n);
    }

    /**
     * Extend the focus point backward `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Selection}
     */

  }, {
    key: 'extendBackward',
    value: function extendBackward() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      (0, _warn2.default)('The `Selection.extendBackward(n)` method is deprecated, please switch to using `Selection.extend(-n)` (with a negative number) instead.');
      return this.extend(0 - n);
    }

    /**
     * Move the selection to `anchorOffset` and `focusOffset`.
     *
     * @param {Number} anchorOffset
     * @param {Number} focusOffset (optional)
     * @return {Selection}
     */

  }, {
    key: 'moveToOffsets',
    value: function moveToOffsets(anchorOffset) {
      var focusOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : anchorOffset;

      (0, _warn2.default)('The `Selection.moveToOffsets` method is deprecated, please switch to using `Selection.moveOffsetsTo` instead.');
      return this.moveOffsetsTo(anchorOffset, focusOffset);
    }
  }, {
    key: 'kind',


    /**
     * Get the kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'selection';
    }

    /**
     * Check whether the selection is blurred.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isBlurred',
    get: function get() {
      return !this.isFocused;
    }

    /**
     * Check whether the selection is collapsed.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isCollapsed',
    get: function get() {
      return this.anchorKey == this.focusKey && this.anchorOffset == this.focusOffset;
    }

    /**
     * Check whether the selection is expanded.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isExpanded',
    get: function get() {
      return !this.isCollapsed;
    }

    /**
     * Check whether the selection is forward.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isForward',
    get: function get() {
      return this.isBackward == null ? null : !this.isBackward;
    }

    /**
     * Check whether the selection's keys are set.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isSet',
    get: function get() {
      return this.anchorKey != null && this.focusKey != null;
    }

    /**
     * Check whether the selection's keys are not set.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isUnset',
    get: function get() {
      return !this.isSet;
    }

    /**
     * Get the start key.
     *
     * @return {String}
     */

  }, {
    key: 'startKey',
    get: function get() {
      return this.isBackward ? this.focusKey : this.anchorKey;
    }

    /**
     * Get the start offset.
     *
     * @return {String}
     */

  }, {
    key: 'startOffset',
    get: function get() {
      return this.isBackward ? this.focusOffset : this.anchorOffset;
    }

    /**
     * Get the end key.
     *
     * @return {String}
     */

  }, {
    key: 'endKey',
    get: function get() {
      return this.isBackward ? this.anchorKey : this.focusKey;
    }

    /**
     * Get the end offset.
     *
     * @return {String}
     */

  }, {
    key: 'endOffset',
    get: function get() {
      return this.isBackward ? this.anchorOffset : this.focusOffset;
    }
  }], [{
    key: 'create',


    /**
     * Create a new `Selection` with `properties`.
     *
     * @param {Object|Selection} properties
     * @return {Selection}
     */

    value: function create() {
      var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (properties instanceof Selection) return properties;
      return new Selection(properties);
    }
  }]);

  return Selection;
}(new _immutable.Record(DEFAULTS));

/**
 * Mix in some "move" convenience methods.
 */

var MOVE_METHODS = [['move', ''], ['move', 'To'], ['move', 'ToStartOf'], ['move', 'ToEndOf']];

MOVE_METHODS.forEach(function (_ref2) {
  var _ref3 = _slicedToArray(_ref2, 2),
      p = _ref3[0],
      s = _ref3[1];

  Selection.prototype['' + p + s] = function () {
    var _ref4;

    return (_ref4 = this[p + 'Anchor' + s].apply(this, arguments))[p + 'Focus' + s].apply(_ref4, arguments);
  };
});

/**
 * Mix in the "start", "end" and "edge" convenience methods.
 */

var EDGE_METHODS = [['has', 'AtStartOf', true], ['has', 'AtEndOf', true], ['has', 'Between', true], ['has', 'In', true], ['collapseTo', ''], ['move', ''], ['moveTo', ''], ['move', 'To'], ['move', 'OffsetTo']];

EDGE_METHODS.forEach(function (_ref5) {
  var _ref6 = _slicedToArray(_ref5, 3),
      p = _ref6[0],
      s = _ref6[1],
      hasEdge = _ref6[2];

  var anchor = p + 'Anchor' + s;
  var focus = p + 'Focus' + s;

  Selection.prototype[p + 'Start' + s] = function () {
    return this.isBackward ? this[focus].apply(this, arguments) : this[anchor].apply(this, arguments);
  };

  Selection.prototype[p + 'End' + s] = function () {
    return this.isBackward ? this[anchor].apply(this, arguments) : this[focus].apply(this, arguments);
  };

  if (hasEdge) {
    Selection.prototype[p + 'Edge' + s] = function () {
      return this[anchor].apply(this, arguments) || this[focus].apply(this, arguments);
    };
  }
});

/**
 * Mix in some aliases for convenience / parallelism with the browser APIs.
 */

var ALIAS_METHODS = [['collapseTo', 'moveTo'], ['collapseToAnchor', 'moveToAnchor'], ['collapseToFocus', 'moveToFocus'], ['collapseToStart', 'moveToStart'], ['collapseToEnd', 'moveToEnd'], ['collapseToStartOf', 'moveToStartOf'], ['collapseToEndOf', 'moveToEndOf'], ['extend', 'moveFocus'], ['extendTo', 'moveFocusTo'], ['extendToStartOf', 'moveFocusToStartOf'], ['extendToEndOf', 'moveFocusToEndOf']];

ALIAS_METHODS.forEach(function (_ref7) {
  var _ref8 = _slicedToArray(_ref7, 2),
      alias = _ref8[0],
      method = _ref8[1];

  Selection.prototype[alias] = function () {
    return this[method].apply(this, arguments);
  };
});

/**
 * Get the first text of a `node`.
 *
 * @param {Node} node
 * @return {Text}
 */

function getFirst(node) {
  return node.kind == 'text' ? node : node.getFirstText();
}

/**
 * Get the last text of a `node`.
 *
 * @param {Node} node
 * @return {Text}
 */

function getLast(node) {
  return node.kind == 'text' ? node : node.getLastText();
}

/**
 * Export.
 *
 * @type {Selection}
 */

exports.default = Selection;