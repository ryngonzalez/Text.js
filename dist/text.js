
/*

Class: Cursor

Usage:

```javascript

textarea = document.getElementById('#myTextarea');
var cursor = new Cursor(textarea);

var position = cursor.position // Returns integer index
cursor.position = 25 // Sets position to index
```
 */

(function() {
  var CurrentWord, Cursor, Resize, Text, cssAttributes;

  Cursor = (function() {
    var lastPosition;

    lastPosition = null;

    function Cursor(element) {
      this.element = element;
    }

    Object.defineProperties(Cursor.prototype, {
      position: {
        get: function() {
          return lastPosition = this.element.selectionEnd;
        },
        set: function(position) {
          return this.element.setSelectionRange(position, position);
        }
      }
    });

    return Cursor;

  })();


  /*
  
  Class: CurrentWord
  
  Usage:
  
  Given textarea with text and cursor (represented by the pipe character |):
  
  "
  hey there guy|s this is my textarea
  it is multiline too i guess
  "
  
  ```javascript
  
  textarea = document.getElementById('#myTextarea');
  var current = new CurrentWord(textarea);
  
  // Returns the string "guys"
  current.get()
  
  // Returns an object with the signature {before: string, after: string}
  // => {before: 'guy', after: 's'}
  current.parts()
  
  // Returns the indices of the current word
  // => {start: 10, end: 14}
  current.indices()
  
  // Replaces the current word, and places
  // the current cursor position at the end of the
  // current word. Returns that new position
  current.replace('someString')
  
  ```
   */

  CurrentWord = (function() {
    var space, split;

    space = {
      before: /\S+$/,
      after: /^\S+/,
      regular: /(\s)/
    };

    function CurrentWord(element) {
      this.element = element;
      this.cursor = new Cursor(this.element);
    }

    CurrentWord.prototype.parts = function(position) {
      var after, before, cursor, text;
      text = this.element.value;
      cursor = position || this.cursor.position;
      before = space.before.exec(text.slice(0, cursor));
      after = space.after.exec(text.slice(cursor));
      return {
        before: (before != null ? before.length : void 0) ? before[0] : '',
        after: (after != null ? after.length : void 0) ? after[0] : ''
      };
    };

    CurrentWord.prototype.get = function() {
      var after, before, _ref;
      _ref = this.parts(), before = _ref.before, after = _ref.after;
      return before + after;
    };

    CurrentWord.prototype.indices = function(position) {
      var after, before, cursor, _ref;
      cursor = position || this.cursor.position;
      _ref = this.parts(cursor), before = _ref.before, after = _ref.after;
      return {
        start: cursor - before.length,
        end: cursor + after.length
      };
    };

    split = function(text, start, end) {
      return {
        before: text.substr(0, start),
        after: text.substr(end)
      };
    };

    CurrentWord.prototype.replace = function(text) {
      var after, before, currentText, indices, newPosition, _ref;
      currentText = this.element.value;
      indices = this.indices(this.cursor.position);
      _ref = split(currentText, indices.start, indices.end), before = _ref.before, after = _ref.after;
      this.element.value = before + text + after;
      newPosition = before.length + text.length;
      this.cursor.position = newPosition;
      return newPosition;
    };

    return CurrentWord;

  })();

  cssAttributes = ['overflowY', 'overflowX', 'height', 'width', 'maxHeight', 'minHeight', 'maxWidth', 'minWidth', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginLeft', 'marginBottom', 'fontFamily', 'fontSize', 'borderStyle', 'borderWidth', 'outline', 'wordWrap', 'lineHeight', 'textAlign'];

  Resize = (function() {
    var UUID, cloneStyle, getStyle;

    UUID = 0;

    getStyle = function(element) {
      return element.currentStyle || document.defaultView.getComputedStyle(element, "");
    };

    cloneStyle = function(element) {
      var attribute, css, elementStyle, _i, _len;
      css = {
        visibility: 'hidden',
        position: 'absolute',
        left: 0,
        top: 0,
        'pointer-events': 'none'
      };
      elementStyle = getStyle(element);
      for (_i = 0, _len = cssAttributes.length; _i < _len; _i++) {
        attribute = cssAttributes[_i];
        css[attribute] = elementStyle[attribute];
      }
      return css;
    };

    function Resize(element) {
      this.element = element;
      this.UUID = (UUID += 1);
    }

    Resize.prototype.clone = function() {
      var clone, key, name, style, value;
      name = "_resizer-clone-" + this.UUID;
      clone = this.copy || document.getElementById(name);
      if (clone == null) {
        clone = document.createElement('textarea');
        clone.id = name;
        document.body.appendChild(clone);
        style = cloneStyle(this.element);
        for (key in style) {
          value = style[key];
          clone.style[key] = value;
        }
      }
      return this.copy = clone;
    };

    Resize.prototype.update = function() {
      this.clone();
      return this.copy.value = this.element.value;
    };

    Resize.prototype.resize = function() {
      this.update();
      this.copy.style.height = 'auto';
      return setTimeout((function(_this) {
        return function() {
          return _this.element.style.height = "" + _this.copy.scrollHeight + "px";
        };
      })(this), 0);
    };

    Resize.prototype.on = function(event) {
      return this.element.addEventListener(event, (function(_this) {
        return function() {
          return _this.resize();
        };
      })(this));
    };

    Resize.prototype.unbind = function(event) {
      this.element.removeEventListener(event, (function(_this) {
        return function() {
          return _this.resize();
        };
      })(this));
      this.copy.remove();
      delete this.copy;
      return delete this.element;
    };

    return Resize;

  })();

  Text = {
    Cursor: Cursor,
    CurrentWord: CurrentWord,
    Resize: Resize
  };

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    module.exports = Text;
  } else {
    this.Text = Text;
  }

}).call(this);
