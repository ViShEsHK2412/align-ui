/**
 * A custom element with three levels inside a shadow root. The `closed`
 * attribute switches which kind — an open root can be descended into, a closed
 * one cannot be pierced by anything, so it measures as the host.
 */
class FancyCard extends HTMLElement {
  connectedCallback() {
    const mode = this.hasAttribute('closed') ? 'closed' : 'open';
    const root = this.attachShadow({ mode });
    const style = document.createElement('style');
    style.textContent = `
      .frame {
        width: 220px; padding: 16px;
        background: #1b2029; border: 1px solid #2b3341;
        font: 12px system-ui, sans-serif; color: #cbd3e1;
      }
      .body { padding: 12px; background: #232a36; margin-top: 10px; }
      .pill {
        display: inline-flex; align-items: center; justify-content: center;
        width: 96px; height: 26px; background: #2f3a4a;
      }
    `;
    const frame = document.createElement('div');
    frame.className = 'frame';
    const title = document.createElement('div');
    title.textContent = this.getAttribute('label') ?? 'card';
    const body = document.createElement('div');
    body.className = 'body';
    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.textContent = 'inner pill';
    body.appendChild(pill);
    frame.append(title, body);
    root.append(style, frame);
  }
}
customElements.define('fancy-card', FancyCard);

if (import.meta.env.DEV) {
  import('../../align/index').then((m) => m.initAlign());
}
