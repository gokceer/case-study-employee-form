import {LitElement, html} from 'lit';
import {Router} from '@lit-labs/router';
import './src/pages/employee-list.js';
import './src/pages/create-employee-form.js';
import './src/components/custom-modal.js';
import './src/components/navigation-bar.js';

export class AppMain extends LitElement {
  constructor() {
    super();
    this.router = new Router(this, [
      {path: '/', render: () => html`<employee-list></employee-list>`},
      {
        path: '/create',
        render: () => html`<create-employee-form></create-employee-form>`,
      },
    ]);
  }

  render() {
    return html`${this.router.outlet()}`;
  }
}

customElements.define('app-main', AppMain);
