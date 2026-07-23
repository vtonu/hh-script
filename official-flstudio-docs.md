# FL Studio Piano Roll Scripting Reference

This is a short working guide to FL Studio's Piano roll scripting API. It keeps the parts most useful for building a hi-hat MIDI generator.

## What Piano Roll Scripts Can Do

Piano roll scripts use Python to:

- Create, edit, copy, and delete notes
- Read note data from the current Piano roll
- Create, edit, and delete markers
- Show a custom control panel
- Preview changes as controls are changed

Import the API with:

```python
import flpianoroll as flp
```

## Script Files

Scripts must use the `.pyscript` file type.

Put custom scripts in:

```text
Documents\Image-Line\FL Studio\Settings\Piano roll scripts
```

Subfolders in this path become folders in FL Studio's Piano roll script menu.

Do not edit the stock scripts in the FL Studio install folder. Copy one to the user scripts folder first if you want to change it.

Other script paths:

- Browser downloads: `Documents\Image-Line\Downloads\Piano roll scripts`
- Windows stock scripts: `FL Studio 2024\System\Config\Piano roll scripts`
- macOS stock scripts: `/Applications/FL Studio 2024/Contents/Resources/FL/System/Config/Piano roll scripts`

The stock script folder may contain a newer `Piano roll script reference.txt`.

## Basic Script Shape

A script will most often have two main functions:

```python
import flpianoroll as flp


def createDialog() -> flp.ScriptDialog:
    form = flp.ScriptDialog(
        'Script Name',
        'Short script description.'
    )
    return form


def apply(form: flp.ScriptDialog) -> None:
    # Read the form values and change the score here.
    pass
```

`createDialog()` defines the script panel and its controls.

`apply(form)` reads those controls and changes the Piano roll. FL Studio may call it more than once while it shows a preview, so its output should be based on the current form values.

## Timing

All note and marker times use ticks.

```python
flp.score.PPQ
```

`PPQ` is the number of ticks in one quarter note, or one beat in common time. It is read-only.

Use `PPQ` for all time math so the script works with any project PPQ:

```python
beat = flp.score.PPQ
half_beat = flp.score.PPQ // 2
quarter_beat = flp.score.PPQ // 4
sixteenth_note = flp.score.PPQ // 4
```

For a 4/4 step grid:

```python
step_time = step_index * (flp.score.PPQ // 4)
```

The current time signature is available through:

```python
flp.score.tsnum
flp.score.tsden
```

Both values are read-only.

## Notes

Create a note with:

```python
note = flp.Note()
```

### Note Fields

| Field | Meaning | Range or default |
| --- | --- | --- |
| `number` | MIDI note number | `48 = C4` in the API table |
| `time` | Start time in ticks | Integer |
| `length` | Length in ticks | Integer |
| `group` | Note group | `0` means no group |
| `pan` | Stereo pan | `0.0` left to `1.0` right; default `0.5` |
| `velocity` | Note velocity | `0.0` to `1.0`; default `0.8` |
| `release` | Release velocity | `0.0` to `1.0` |
| `color` | Note color or MIDI channel | `0` to `15`; default `0` |
| `fcut` | Filter cutoff or Mod X | `0.0` to `1.0`; default `0.5` |
| `fres` | Filter resonance or Mod Y | `0.0` to `1.0`; default `0.5` |
| `pitchofs` | Fine pitch offset | `-120` to `120`, in tenths of a semitone |
| `slide` | Slide note | `True` or `False` |
| `porta` | Portamento note | `True` or `False` |
| `muted` | Muted state | `True` or `False` |
| `selected` | Selected state | `True` or `False` |
| `repeats` | Built-in note repeat mode | `0` to `14` |

Copy a note with:

```python
copy = note.clone()
```

### Repeat Values

| Value | Repeat rate |
| ---: | --- |
| `0` | No repeat |
| `1` | 1/4 |
| `2` | 1/8 dotted |
| `3` | 1/4 triplet |
| `4` | 1/8 |
| `5` | 1/16 dotted |
| `6` | 1/8 triplet |
| `7` | 1/16 step |
| `8` | 1/32 dotted |
| `9` | 1/16 triplet |
| `10` | 1/32 half step |
| `11` | 1/64 dotted |
| `12` | 1/32 triplet |
| `13` | 1/64 quarter step |
| `14` | 1/64 triplet |

### Add a Note

```python
note = flp.Note()
note.number = 42
note.time = 0
note.length = flp.score.PPQ // 4
note.velocity = 0.8

flp.score.addNote(note)
```

The source examples treat valid Piano roll pitches as `0` through `131`.

## Score API

Use the global `flp.score` object.

### Score Data

| Member | Use |
| --- | --- |
| `PPQ` | Ticks per quarter note |
| `tsnum` | Time signature numerator |
| `tsden` | Time signature denominator |
| `noteCount` | Number of notes |
| `markerCount` | Number of markers |

These values are read-only.

### Note Functions

| Function | Use |
| --- | --- |
| `addNote(note)` | Add a note |
| `getNote(index)` | Get a note by index |
| `deleteNote(index)` | Delete a note by index |
| `clearNotes()` | Clear selected notes |
| `clearNotes(True)` | Clear all notes |

### Marker Functions

| Function | Use |
| --- | --- |
| `addMarker(marker)` | Add a marker |
| `getMarker(index)` | Get a marker by index |
| `deleteMarker(index)` | Delete a marker by index |
| `clearMarkers()` | Clear selected markers |
| `clearMarkers(True)` | Clear all markers |

Use `clear()` or `clear(True)` to clear both notes and markers.

## Editing Existing Notes

Read each note by index:

```python
for index in range(flp.score.noteCount):
    note = flp.score.getNote(index)
    note.velocity = 0.75
```

The note returned by `getNote()` can be edited in place.

When deleting more than one note, delete in reverse index order. This keeps the other indexes valid:

```python
notes_to_delete.sort(reverse=True)

for index in notes_to_delete:
    flp.score.deleteNote(index)
```

If a time shift puts part of a note before tick `0`, move its start to `0` and cut its length. If the full note ends before tick `0`, delete it.

## Script Dialog Controls

Create a dialog with:

```python
form = flp.ScriptDialog('Title', 'Description')
```

Add controls with:

| Function | Control |
| --- | --- |
| `addInput(name, value)` | Generic `0.0` to `1.0` input |
| `addInputKnob(name, value, min, max)` | Float knob |
| `addInputKnobInt(name, value, min, max)` | Integer knob |
| `addInputCombo(name, value_list, value_index)` | List menu |
| `addInputText(name, value)` | Text box |
| `addInputCheckbox(name, value)` | Boolean checkbox |

Some controls also accept a `hint`:

```python
form.addInputKnobInt(
    'Steps',
    16,
    1,
    64,
    hint='Pattern length in sixteenth-note steps'
)
```

Read a value with the same control name:

```python
steps = form.getInputValue('Steps')
```

`Execute` returns `True` when the user presses OK and `False` when the dialog is closed.

## Markers

Create a marker with:

```python
marker = flp.Marker()
```

Marker fields:

| Field | Meaning |
| --- | --- |
| `time` | Marker time in ticks |
| `name` | Marker name |
| `mode` | Marker mode as an integer |
| `tsnum` | Time signature numerator |
| `tsden` | Time signature denominator |
| `scale_root` | Scale tonic, with C as `0` |
| `scale_helper` | 12 comma-separated scale flags |

`scale_helper` lists note classes from C through B. The source says `0` means in the scale and `1` means out of the scale.

## Messages and Debugging

```python
flp.Utils.ShowMessage('Hello world')
flp.Utils.ProgressMsg('Working...', position, total)
flp.Utils.log('Debug text')
```

- `ShowMessage()` opens a dialog.
- `ProgressMsg()` shows progress.
- `log()` writes to FL Studio's debug log.

Do not call `ShowMessage()` from `apply()`. Since `apply()` can run for each preview update, this may open the same dialog many times. Use `log()` while testing `apply()`.

## Lessons From the Stock Tutorials

### Add a note

Create `flp.Note()`, set its fields, then pass it to `flp.score.addNote()`.

### Modify notes

Loop through `noteCount`, get each note, and edit it in place. Track bad note indexes and delete them in reverse order after the loop.

### Snap to a scale

Store a scale as 12 flags, find the note's pitch class with `% 12`, then move up or down until it reaches an allowed pitch.

### Make a random pattern

Use a density value from `0.0` to `1.0` as the chance that each step gets a note:

```python
if random.random() < density:
    # Add a note on this step.
```

### Repeat notes

Clone the source note, add a time offset, change its velocity or pitch, then add the clone to the score.

### Copy markers

Create a new `flp.Marker()`, copy the source data, add a tick offset, then call `addMarker()`.

## Hi-Hat Generator Notes

The first hi-hat generator will likely need:

- A fixed or user-set hi-hat note number
- Pattern length in steps
- Step size based on `flp.score.PPQ`
- Closed, open, or mixed hat note choices
- Density or hit chance
- Velocity range and accents
- Timing shift or swing
- Roll and repeat rates
- An option to clear existing notes first
- An optional random seed for repeatable output

A basic step loop will look like:

```python
step_ticks = flp.score.PPQ // 4

for step in range(step_count):
    note = flp.Note()
    note.number = hat_note
    note.time = step * step_ticks
    note.length = step_ticks
    note.velocity = 0.8
    flp.score.addNote(note)
```

Any random value should be kept within the API range before the note is added:

```python
note.velocity = max(0.0, min(1.0, velocity))
note.number = max(0, min(131, note_number))
```

This gives us the core needed to build a safe, timed, user-controlled hi-hat pattern generator.
