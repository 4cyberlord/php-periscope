function getComposerJsonPath(workspacePath)
{
  return `${workspacePath}/composer.json`;
}

module.exports = {
  getComposerJsonPath
};
