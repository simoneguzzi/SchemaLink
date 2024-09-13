export const gettingDiagramNameSucceeded = (diagramName: string) => ({
  type: 'GETTING_DIAGRAM_NAME_SUCCEEDED',
  diagramName,
});

export const renameDiagram = (diagramName: string) => ({
  type: 'RENAME_DIAGRAM',
  diagramName,
});
