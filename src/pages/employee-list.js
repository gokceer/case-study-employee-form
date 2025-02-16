import {LitElement, html, css} from 'lit';
import {localization} from '../localization/localization.js';
import '../components/custom-modal.js';
import '../components/navigation-bar.js';
import '../components/pagination-element.js';
import '../components/table-view.js';
import '../components/list-view.js';

export class EmployeeList extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }
    .main-container {
      padding: 0px 16px;
    }
    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    input {
      padding: 8px;
      font-size: 14px;
    }
    .pagination {
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    button {
      cursor: pointer;
      padding: 6px 12px;
      margin-left: 8px;
    }
    h3 {
      color: #ff6200;
    }
    .icon-button {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .icon-button.active {
      background-color: #ffdfcc;
      border-radius: 50%;
      width: 32px;
      height: 32px;
    }
    input {
      height: 40px;
      margin: 12px 0px;
      border: 2px solid #ffdfcc;
      border-radius: 8px;
      outline: none;
      padding: 0px 8px;
      resize: vertical;
    }
    input:focus {
      border-color: #ff6200;
    }
  `;

  static properties = {
    employees: {type: Array},
    searchQuery: {type: String},
    viewMode: {type: String},
    currentPage: {type: Number},
    itemsPerPage: {type: Number},
    isModalOpen: {type: Boolean},
    modalDescription: {type: String},
    modalAction: {type: Function},
  };

  constructor() {
    super();
    this.employees = JSON.parse(localStorage.getItem('employees')) || [];
    this.searchQuery = '';
    this.viewMode = 'table';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.isModalOpen = false;
    this.modalDescription = '';
    this.modalAction = () => null;

    window.addEventListener('language-changed', () => {
      this.requestUpdate();
    });
  }

  updateSearch(event) {
    this.searchQuery = event.target.value.toLowerCase();
    this.currentPage = 1;
  }

  switchView(mode) {
    this.viewMode = mode;
  }

  deleteEmployee(event) {
    const id = event.detail;
    const findEmployee = this.employees.find(
      (selectedEmployee) => selectedEmployee.id === id
    );
    if (findEmployee) {
      this.modalDescription = `Selected employee record of ${findEmployee.firstName} ${findEmployee.lastName} will be deleted`;
      this.isModalOpen = true;
      this.modalAction = () => this.confirmDelete(id);
    }
  }

  confirmDelete(employeeId) {
    this.employees = this.employees.filter((emp) => emp.id !== employeeId);
    this.requestUpdate();
    localStorage.setItem('employees', JSON.stringify(this.employees));
    this.isModalOpen = false;
  }

  get filteredEmployees() {
    return this.employees.filter((emp) =>
      `${emp.firstName} ${emp.lastName}`
        .toLowerCase()
        .includes(this.searchQuery)
    );
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees.slice(start, start + this.itemsPerPage);
  }

  navigateToNewEmployee() {
    // changes the URL without refreshing.
    window.history.pushState({}, '', '/create');
    window.dispatchEvent(new Event('popstate'));
  }

  navigateToEditEmployee(event) {
    window.location.href = `/create?id=${event.detail}`;
  }

  handleModalProceed() {
    if (this.modalAction) {
      this.modalAction();
    }
    this.isModalOpen = false;
  }

  handleModalCancel() {
    this.isModalOpen = false;
  }

  render() {
    return html`
      <navigation-bar
        .onNewEmployeeClick=${this.navigateToNewEmployee}
      ></navigation-bar>
      <custom-modal
        .visible=${this.isModalOpen}
        .description=${this.modalDescription}
        @proceed=${this.handleModalProceed}
        @cancel=${this.handleModalCancel}
      ></custom-modal>
      <div class="main-container">
        <div class="controls">
          <h3>${localization.getTranslation('employeeList')}</h3>
          <div>
            <input
              type="text"
              @input=${this.updateSearch}
              placeholder=${localization.getTranslation('searchEmployees')}
            />
            <button
              class="icon-button ${this.viewMode === 'table' ? 'active' : ''}"
              @click=${() => this.switchView('table')}
            >
              <svg fill="#ff6200" width="16" height="16" viewBox="0 0 512 512">
                <path
                  d="M64 256l0-96 160 0 0 96L64 256zm0 64l160 0 0 96L64 416l0-96zm224 96l0-96 160 0 0 96-160 0zM448 256l-160 0 0-96 160 0 0 96zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z"
                />
              </svg>
            </button>

            <button
              class="icon-button ${this.viewMode === 'list' ? 'active' : ''}"
              @click=${() => this.switchView('list')}
            >
              <svg fill="#ff6200" width="16" height="16" viewBox="0 0 448 512">
                <path
                  d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"
                />
              </svg>
            </button>
          </div>
        </div>

        ${this.viewMode === 'table'
          ? html`<table-view
              .paginatedEmployees=${this.paginatedEmployees}
              @edit=${this.navigateToEditEmployee}
              @delete=${this.deleteEmployee}
            ></table-view>`
          : html`<list-view
              .paginatedEmployees=${this.paginatedEmployees}
              @edit=${this.navigateToEditEmployee}
              @delete=${this.deleteEmployee}
            ></list-view>`}
        ${this.filteredEmployees.length !== 0
          ? html`
              <div class="pagination">
                <pagination-element
                  .currentPage="${this.currentPage}"
                  .totalPages="${Math.ceil(
                    this.filteredEmployees.length / this.itemsPerPage
                  )}"
                  @page-change="${(e) => (this.currentPage = e.detail)}"
                ></pagination-element>
              </div>
            `
          : ''}
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
