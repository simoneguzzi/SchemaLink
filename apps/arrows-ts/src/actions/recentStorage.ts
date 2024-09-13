export const updateRecentStorage = (
  mode: string,
  fileId: string,
  diagramName: string
) => {
  return {
    type: 'UPDATE_RECENT_STORAGE',
    mode,
    fileId,
    diagramName,
    timestamp: Date.now(),
  };
};
