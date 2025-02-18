# TODO

- Move all markup out of the HTML document
- Load/run a script with movements and wire up to scrubber and controls
- Draw the doublons firing and the measurements (lose / reload the qubit?)
- Number the rows and columns
- Draw a from/to line when qubits move
- Fix the layout issues if initial size/scale is too large
- Figure out the config format for layout and trace
- Figure out status line and popup info for qubit hovering
- Figure out how to show measurement results, qubit loss, and reloading
- Figure out if/how to overlay noise or loss probabilities on qubits

## Layout

```json
{
    "regions": [
        {
            "title": "readout",
            "rows": 6,
            "columns": 16,
            "startIdx": 0,
            "position": "TODO"
        },
        {
            "title": "storage",
            "etc.": "TODO"
        }
    ]
}
```

## Trace

```json
{
    "mapping": "0 (0, 1)",
    "steps": [
        {"id": 0, "ops": ["cx 0, 1", "move 3, (0, 2)", "etc."]}
    ]
}
```
