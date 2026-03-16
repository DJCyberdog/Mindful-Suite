export function createAmbientLayer() {
  const layer = document.createElement('div');
  layer.className = 'ambient-layer';
  return layer;
}

export function createShell(): HTMLElement {
  const shell = document.createElement('main');
  shell.className = 'mf-app';
  const container = document.createElement('div');
  container.className = 'shell';
  shell.append(container);
  return shell;
}

export function getShellStack(root: HTMLElement) {
  return root.querySelector('.shell') as HTMLElement;
}
