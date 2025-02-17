import { appendChildren, createSvgElements, setAttributes } from "./utils";

type MachineLayout = {
  cols: number;
  readoutRows: number;
  interactionRows: number;
  storageRows: number;
};

type Location = [number, number, SVGElement?];

const qubitSize = 10;
const zoneSpacing = 10;
const colPadding = 10;
const initialScale = 3.0;
const scaleStep = 0.25;
const zoneBoxCornerRadius = 3;
const doublonCornerRadius = 5;

export function fillQubitLocations(
  rows: number,
  cols: number,
  startRow: number
): Location[] {
  const qubits: Location[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      qubits.push([row + startRow, col]);
    }
  }
  return qubits;
}

export class Layout {
  container: SVGSVGElement;
  width: number;
  height: number;
  scale: number = initialScale;

  constructor(public layout: MachineLayout, public qubits: Location[] = []) {
    if (layout.interactionRows != 1) {
      throw "Only 1 interaction row supported";
    }
    this.container = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    const totalRows =
      layout.readoutRows + layout.interactionRows + layout.storageRows;
    this.height = totalRows * qubitSize + zoneSpacing * 4;
    this.width = layout.cols * qubitSize + colPadding;

    setAttributes(this.container, {
      viewBox: `-5 0 ${this.width} ${this.height}`,
      width: `${this.width * this.scale}px`,
      height: `${this.height * this.scale}px`,
    });

    const readoutOffset = this.getQubitRowOffset(0);
    const interactionOffset = this.getQubitRowOffset(layout.readoutRows);
    const storageOffset = this.getQubitRowOffset(
      layout.readoutRows + layout.interactionRows
    );

    this.renderZone(readoutOffset, "Readout", layout.readoutRows, layout.cols);
    this.renderDoublons(interactionOffset, "Interaction", layout.cols);
    this.renderZone(storageOffset, "Storage", layout.storageRows, layout.cols);
    this.renderQubits();
  }

  private renderZone(offset: number, title: string, rows: number, cols: number) {
    const g = createSvgElements("g")[0];
    setAttributes(g, {
      transform: `translate(0 ${offset})`,
      class: "minpage-zonebox",
    });
    const rect = createSvgElements("rect")[0];
    setAttributes(rect, {
      x: "0",
      y: "0",
      width: `${cols * qubitSize}`,
      height: `${rows * qubitSize}`,
      rx: `${zoneBoxCornerRadius}`,
    });
    appendChildren(g, [rect]);

    // Draw the lines between the rows
    for (let i = 1; i < rows; i++) {
      const path = createSvgElements("path")[0];
      setAttributes(path, {
        d: `M 0,${i * qubitSize} h${cols * qubitSize}`,
      });
      appendChildren(g, [path]);
    }

    // Draw the lines between the columns
    for (let i = 1; i < cols; i++) {
      const path = createSvgElements("path")[0];
      setAttributes(path, {
        d: `M ${i * qubitSize},0 v${rows * qubitSize}`,
      });
      appendChildren(g, [path]);
    }

    // Draw the title
    const text = createSvgElements("text")[0];
    setAttributes(text, {
      x: "1",
      y: "-1",
      class: "minpage-zone-text",
    });
    text.textContent = title;

    appendChildren(g, [text]);
    appendChildren(this.container, [g]);
  }

  private renderDoublons(offset: number, title: string, cols: number) {
    const g = createSvgElements("g")[0];
    setAttributes(g, {
      transform: `translate(0 ${offset})`,
      class: "minpage-zonebox",
    });

    // Draw each doublon
    for (let i = 0; i < cols; i += 2) {
      const rect = createSvgElements("rect")[0];
      setAttributes(rect, {
        x: `${i * qubitSize}`,
        y: "0",
        width: `${qubitSize * 2}`,
        height: `${qubitSize}`,
        rx: `${doublonCornerRadius}`,
      });
      const path = createSvgElements("path")[0];
      setAttributes(path, {
        d: `M ${(i + 1) * qubitSize},0 v${qubitSize}`,
      });
      appendChildren(g, [rect, path]);
    }

    // Draw the title
    const text = createSvgElements("text")[0];
    setAttributes(text, {
      x: "1",
      y: "-1",
      class: "minpage-zone-text",
    });
    text.textContent = title;

    appendChildren(g, [text]);
    appendChildren(this.container, [g]);
  }

  private renderQubits() {
    const elems = this.qubits.map((location, index, array) => {
      const [x, y] = this.getQubitCenter(index);

      const circle = createSvgElements("circle")[0];
      setAttributes(circle, {
        cx: `${x}`,
        cy: `${y}`,
        r: `2`,
        class: "minpage-qubit",
      });
      location[2] = circle;
      return circle;
    });

    appendChildren(this.container, elems);
  }

  zoomIn() {
    this.scale += scaleStep * this.scale;
    setAttributes(this.container, {
      width: `${this.width * this.scale}px`,
      height: `${this.height * this.scale}px`,
    });
  }

  zoomOut() {
    this.scale -= scaleStep * this.scale;
    setAttributes(this.container, {
      width: `${this.width * this.scale}px`,
      height: `${this.height * this.scale}px`,
    });
  }

  getQubitRowOffset(row: number) {
    if (row < this.layout.readoutRows) {
      return zoneSpacing + row * qubitSize;
    } else if (row < this.layout.readoutRows + this.layout.interactionRows) {
      return 2 * zoneSpacing + row * qubitSize;
    } else {
      return 3 * zoneSpacing + row * qubitSize;
    }
  }

  getQubitCenter(qubit: number): [number, number] {
    if (this.qubits[qubit] == undefined) {
      throw "Qubit not found";
    }

    const [row, col] = this.qubits[qubit];
    const x = col * qubitSize + qubitSize / 2;
    const y = this.getQubitRowOffset(row) + qubitSize / 2;
    return [x, y];
  }
}
