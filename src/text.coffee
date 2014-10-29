###

Class: Cursor

Usage:

```javascript

textarea = document.getElementById('#myTextarea');
var cursor = new Text.Cursor(textarea);

var position = cursor.position; // Returns integer index
cursor.position = 25; // Sets position to index
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
var current = new Text.CurrentWord(textarea);

// Returns the string "guys"
current.get();

// Returns an object with the signature {before: string, after: string}
// => {before: 'guy', after: 's'}
current.parts();

// Returns the indices of the current word
// => {start: 10, end: 14}
current.indices();

// Replaces the current word, and places
// the current cursor position at the end of the
// current word. Returns that new position
current.replace('someString');

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



###

Class: Resize

Usage:

Given a textarea, automatically resize it to fit the content.

```javascript

textarea = document.getElementById('#myTextarea');
var resizer = new Text.Resize(textarea);

// Resize whenever the content of the textarea is changed
resizer.on('input');

// Manually force a resize
resizer.resize();

// Unbind a specific event from causing a resize
resizer.unbind('input');

// Unbind all events, delete the clone, and remove references
// to the elements.
resizer.destroy();

```

###

class Resize

  cssAttributes = [
    'overflowY'      # Overflows
    'overflowX'      # Overflows
    'height'         # Dimensions
    'width'          # Dimensions
    'maxHeight'      # Dimensions
    'minHeight'      # Dimensions
    'maxWidth'       # Dimensions
    'minWidth'       # Dimensions
    'paddingTop'     # Padding
    'paddingRight'   # Padding
    'paddingBottom'  # Padding
    'paddingLeft'    # Padding
    'marginTop'      # Margin
    'marginRight'    # Margin
    'marginLeft'     # Margin
    'marginBottom'   # Margin
    'fontFamily'     # Font
    'fontSize'       # Font
    'borderStyle'    # Border
    'borderWidth'    # Border
    'outline'        # Border
    'wordWrap'       # Text
    'lineHeight'     # Text
    'textAlign'      # Text
  ]

  UUID = 0

  getStyle = (element) ->
    return element.currentStyle or document.defaultView.getComputedStyle(element, "")

  cloneStyle = (element) ->
    css =
      visibility: 'hidden'
      position:   'absolute'
      left: 0
      top:  0
      'pointer-events': 'none'

    elementStyle = getStyle(element)
    css[attribute] = elementStyle[attribute] for attribute in cssAttributes

    return css

  constructor: (@element) ->
    @UUID = (UUID += 1)
    @events = []

  clone: ->

    # Find the clone for the given element
    name = "_resizer-clone-#{@UUID}"
    clone = @copy or document.getElementById(name)

    # Unless the clone already exists, make a new one
    unless clone?
      clone = document.createElement 'textarea'
      clone.id = name
      document.body.appendChild clone

      style = cloneStyle(@element)
      clone.style[key] = value for key, value of style

    @copy = clone

  update: ->
    @clone()
    @copy.value = @element.value

  resize: ->
    @update()
    @copy.style.height = 'auto'
    setTimeout =>
      @element.style.height = "#{@copy.scrollHeight}px"
    , 0

  on: (event) ->
    unless event in @events
      @events.push event
      @element.addEventListener event, => @resize()

  unbind: (event) ->
    if event in @events
      @events.splice @events.indexOf(event), 1
      @element.removeEventListener event, => @resize()

  destroy: ->
    # Unbind all events
    @unbind event for event in events

    # Remove copy from DOM
    @copy.remove()

    # Remove references to elements
    delete @copy
    delete @element

# Export things.

Text = { Cursor, CurrentWord, Resize }

if module?.exports
  module.exports = Text
else
  @Text = Text
