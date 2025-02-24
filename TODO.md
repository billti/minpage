# TODO

- Wire up the play/pause controls
- *MVP at this line*
- Draw a from/to line when qubits move (and animate backwards if stepping backwards)
- Fix the layout issues if initial size/scale is too large
- Fix the qubit movement when != 2 readout zones
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

## Tracking

In the layout, the qubits are tracked in an array (possibly sparse) where each entry is
another array containing `[row, col, SVGElement]`. On loading the trace, it is processed
into a step-by-step array, where each step contains the location of each qubit. This makes
moving forwards and backwards, or jumping to arbitrary locations, easy without have to run
from the begining to the target step. The structure is:

```json
[
    {"qubits": [[3,0], [3,2],,[5,1]], "ops": ["cx 0,1", "rz(1.5) 2"]},
    "etc."
]
```
