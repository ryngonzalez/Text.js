
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
  this.Cursor = (function() {
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

  this.CurrentWord = (function() {
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

}).call(this);
