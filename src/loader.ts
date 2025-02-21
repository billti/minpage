const machineLayout = {
  cols: 16,
  readoutRows: 2,
  interactionRows: 1,
  storageRows: 16,
}

export type MachineLayout = typeof machineLayout;

export function getMachine(): MachineLayout {
    return machineLayout;
}

export function getTrace() {

}