# TODO

- Figure out the config format for layout and trace
- Figure out how to render each region (with title) and calculate its dimensions
- Figure out how to draw the qubits (and number them)
- Figure out the toolbar to pause, play, step, and scroll the timeline
  - See <https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/textLength> for laying
    out the `n / count` area (and the slider for scrubbing the timeline)
  - Draw the toolbar controls using SVG icons for standard play/pause/prev/next controls
- Figure out how to draw the operations on each qubit (including params)
- Figure out how to move/animate qubits between regions
- Figure out how to zoom with ctrl+mouse wheel or pinch gesture
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
