if (import.meta.env.DEV) {
  // Every kind of layer at once: the page's columns, a component's own
  // columns inside each instance, rows down the document, and a baseline.
  import('../../align/index').then((m) => m.initAlign({
    grid: [
      { type: 'columns', count: 12, gutter: 24, margin: 24, maxWidth: 960 },
      { type: 'columns', count: 4, gutter: 8, selector: '.card', color: '#2dd4bf' },
      { type: 'rows', height: 48, gutter: 16, color: '#a78bfa' },
      { type: 'baseline', size: 4 },
    ],
  }));
}
