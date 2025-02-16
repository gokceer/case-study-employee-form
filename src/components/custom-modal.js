import {LitElement, css, html} from 'lit';

export class CustomModal extends LitElement {
  static styles = css`
    :host {
      font-family: Arial, sans-serif;
      padding: 16px;
    }
    .modal {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.2);
    }
    .hidden {
      display: none;
    }
    .modal-content {
      background-color: #fefefe;
      margin: auto;
      padding: 20px;
      border: 1px solid #d3d3d3;
      width: 35%;
    }
    .close {
      color: #ff6200;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }
    .close:hover,
    .close:focus {
      color: #000;
      text-decoration: none;
      cursor: pointer;
    }
    h3 {
      color: #ff6200;
    }
    .buttonContainer {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .buttonStyle {
      border: none;
      background-color: #ff6200;
      color: white;
      padding: 12px 24px;
      cursor: pointer;
    }
    .cancel {
      background-color: white;
      color: black;
      border: 1px solid #d3d3d3;
    }
  `;

  static properties = {
    visible: {type: Boolean},
    description: {type: String},
  };

  constructor() {
    super();
    this.visible = false;
    this.description = '';
  }

  onProceedClick() {
    this.dispatchEvent(new CustomEvent('proceed'));
  }

  onCancelClick() {
    this.visible = false;
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  render() {
    return html`
      <div class="modal ${this.visible ? '' : 'hidden'}">
        <div class="modal-content">
          <div>
            <span @click=${this.onCancelClick} class="close">&times;</span>
            <h3>Are you sure?</h3>
          </div>

          <p>${this.description}</p>

          <div class="buttonContainer">
            <button @click=${this.onProceedClick} class="buttonStyle">
              Proceed
            </button>

            <button @click=${this.onCancelClick} class="buttonStyle cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('custom-modal', CustomModal);
