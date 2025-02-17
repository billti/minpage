# TODO

- Figure out the config format for layout and trace
- Number the rows and columns
- Have a max zoom and make it centered and aligned with toolbar
- Move zoom controls to left, player controls to center, and scrubber to the right
- Figure out how to draw the operations on each qubit (including params)
- Figure out status line and popup info for qubit hovering
- Figure out how to move/animate qubits between regions
- Draw a from/to line when qubits move
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
