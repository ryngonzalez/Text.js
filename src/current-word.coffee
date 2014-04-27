###

Class: Cursor

Usage:

```javascript

textarea = document.getElementById('#myTextarea');
var cursor = new Cursor(textarea);

var position = cursor.position // Returns integer index
cursor.position = 25 // Sets position to index
```

###

class Cursor
  lastPosition = null
  constructor: (@element) ->

  Object.defineProperties @prototype,
    position:
      get: ->
        lastPosition = @element.selectionEnd

      set: (position) ->
        @element.setSelectionRange position, position

###

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


###

class CurrentWord
  space =
    before: /\S+$/
    after: /^\S+/
    regular: /(\s)/

  constructor: (@element) ->
    @cursor = new Cursor @element

  parts: (position) ->
    text = @element.value
    cursor = position or @cursor.position

    # regexp.exec returns an array or null
    before = space.before.exec(text.slice(0, cursor))
    after = space.after.exec(text.slice(cursor))

    return {
      before: if before?.length then before[0] else ''
      after: if after?.length then after[0] else ''
    }

  get: ->
    {before, after} = @parts()
    before + after

  indices: (position) ->
    cursor = position or @cursor.position

    {before, after} = @parts(cursor)

    return {
      start: cursor - before.length
      end: cursor + after.length
    }

  split = (text, start, end) ->
    return {
      before: text.substr 0, start
      after: text.substr end
    }

  replace: (text) ->
    currentText = @element.value
    indices = @indices @cursor.position

    {before, after} = split currentText, indices.start, indices.end

    @element.value = before + text + after

    newPosition = before.length + text.length
    @cursor.position = newPosition
    return newPosition

# Export things.

Text = { Cursor, CurrentWord }

if module?.exports
  module.exports = Text
else
  @Text = Text
