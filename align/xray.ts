/**
 * X-ray: outline every element on the page at once.
 *
 * The only thing in the tool that writes to the host document's styles, which
 * is why it is the whole of this file and why it cleans up after itself.
 */

const ID = '__align_xray';

/**
 * `outline` rather than `border`, because an outline is painted outside the box
 * and takes no part in layout — adding one moves nothing. A border would grow
 * every element on the page by two pixels and reflow the document, which in a
 * tool for measuring layout would be worse than useless.
 *
 * Neutral grey rather than one of the tool's three colours: red means a
 * measurement, blue a selection and cyan a guide, and structure is none of
 * those. Grey also stays visible on a light page and a dark one.
 *
 * One exclusion is enough. Our own UI lives in a closed shadow root, and a rule
 * in the page cannot match through a shadow boundary, so only the host element
 * itself is reachable from here.
 */
const CSS = `
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;

export function setXray(on: boolean): void {
  const root = document.documentElement;
  if (!on) {
    root.removeAttribute('data-align-xray');
    document.getElementById(ID)?.remove();
    return;
  }
  if (!document.getElementById(ID)) {
    const style = document.createElement('style');
    style.id = ID;
    style.textContent = CSS;
    style.setAttribute('data-align-ignore', '');
    document.head.appendChild(style);
  }
  root.setAttribute('data-align-xray', '');
}
