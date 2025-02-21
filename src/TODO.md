# TODO

- Load/run a script with movements and wire up to scrubber and controls
- Draw the doublons firing and the measurements (lose / reload the qubit?)
- Number the rows and columns
- Draw a from/to line when qubits move
- Fix the layout issues if initial size/scale is too large
- Figure out status line and popup info for qubit hovering
- Figure out how to show measurement results, qubit loss, and reloading
- Figure out if/how to overlay noise or loss probabilities on qubits


## Trace

```json
{
    "metadata": {"name": "foo"}, // whatever
    "qubits": [                  // index is qubit id, value is location
        [3,0], [3,1], [3,2]      // etc..
    ],
    "steps": [ // id is just a (unique) label and doesn't matter
        {"id": 0, "ops": ["cx 0, 1", "move 3, (0, 2)", "etc."]}
    ]
}
```
