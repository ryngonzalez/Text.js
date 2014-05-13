![Text.js](http://i.imgur.com/bKsWSRK.png)

A collection of utilities for manipulating and editing text, with no dependencies. Text.js
provides easy interfaces to some of the most common things you need when managing textareas
(and other text inputs). Everything is separated into modules as needed.

## Current Modules

###1. `Cursor`

#### Usage

```javascript

textarea = document.getElementById('#myTextarea');
var cursor = new Text.Cursor(textarea);

var position = cursor.position // Returns integer index
cursor.position = 25 // Sets position to index
```

### 2. `CurrentWord`

#### Usage:

Given a textarea with the following text and cursor (represented by the pipe character `|`):

> hey there guy`|`s this is my textarea

> it is multiline too i guess

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

### 3. `Resizer`

#### Usage:

Given a textarea, automatically resize it to fit the content.

```javascript

textarea = document.getElementById('#myTextarea');
var resizer = new Text.Resize(textarea);

// Resize for a given event on the textarea
// Ex. input: when the content of the textarea is changed
resizer.on('input');

// Manually force a resize
resizer.resize();

// Unbind a specific event from causing a resize
resizer.unbind('input');

// Unbind all events, delete the clone,
// and remove references to the elements.
resizer.destroy();
```


