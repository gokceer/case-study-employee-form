import {LitElement, html, css} from 'lit';
import {localization} from '../localization/localization.js';

export class CreateEmployeeForm extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }
    h3 {
      color: #ff6200;
      padding: 0px 16px;
    }
    form {
      padding: 16px;
    }
    div {
      display: flex;
      flex-direction: column;
    }
    select,
    input {
      width: 100%;
      height: 40px;
      margin: 12px 0px;
      border: 2px solid #ffdfcc;
      border-radius: 8px;
      outline: none;
      padding: 0px 8px;
      max-width: 300px;
    }
    input:focus {
      border-color: #ff6200;
    }
    button {
      border: none;
      background-color: #ff6200;
      color: white;
      padding: 15px 32px;
      cursor: pointer;
      margin: 24px 0px;
    }
    label {
      font-size: 14px;
      color: #ff6200;
    }
  `;

  static properties = {
    employees: {type: Array},
    employee: {type: Object},
    isModalOpen: {type: Boolean},
    modalDescription: {type: String},
    id: {type: String},
  };

  constructor() {
    super();
    const today = new Date();
    const minAge = 18;
    this.maxDate = new Date(
      today.getFullYear() - minAge,
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split('T')[0];

    this.id = '';
    this.employees = [];
    this.employee = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
      position: 'Junior',
      department: 'Analytics',
    };
    this.isModalOpen = false;
    this.modalDescription = '';
    window.addEventListener('language-changed', () => {
      this.requestUpdate();
    });
  }

  connectedCallback() {
    super.connectedCallback();
    const urlParams = new URLSearchParams(window.location.search);
    this.id = urlParams.get('id');
  }

  updated(changedProperties) {
    if (changedProperties.has('id')) {
      this.loadEmployeeData();
    }
  }

  loadEmployeeData() {
    this.employees = JSON.parse(localStorage.getItem('employees')) || [];

    if (!this.id) return;
    this.employee = this.employees.find((emp) => emp.id === this.id);
  }

  handleInputChange(event) {
    const {name, value} = event.target;
    this.employee = {...this.employee, [name]: value};
  }

  navigateBack() {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!event.target.checkValidity()) {
      alert('Please fill in all required fields.');
      return;
    }
    const index = this.employees.findIndex(
      (emp) => emp.id === this.employee.id
    );
    const emailExists = this.employees.some(
      (emp) => emp.email === this.employee.email && emp.id !== this.employee.id
    );

    if (index !== -1) {
      this.modalDescription = `Selected employee record of ${this.employee.firstName} ${this.employee.lastName} will be updated`;
      this.isModalOpen = true;
    } else {
      if (emailExists) {
        alert('An employee with this email already exists.');
        return;
      }

      this.employee.id = crypto.randomUUID();
      this.employees.push(this.employee);
      localStorage.setItem('employees', JSON.stringify(this.employees));

      this.navigateBack();
    }
  }

  handleModalProceed() {
    const index = this.employees.findIndex(
      (emp) => emp.id === this.employee.id
    );

    if (index !== -1) {
      this.employees[index] = this.employee;
      localStorage.setItem('employees', JSON.stringify(this.employees));
    }

    this.isModalOpen = false;
    this.navigateBack();
  }

  handleModalCancel() {
    this.isModalOpen = false;
  }

  render() {
    return html`
      <navigation-bar
        .onEmployeeListClick=${this.navigateBack}
      ></navigation-bar>
      <custom-modal
        .visible=${this.isModalOpen}
        .description=${this.modalDescription}
        @proceed=${this.handleModalProceed}
        @cancel=${this.handleModalCancel}
      ></custom-modal>

      <h3>
        ${this.employee.id
          ? `${localization.getTranslation('editEmployee')}`
          : `${localization.getTranslation('addNewEmployee')}`}
      </h3>
      <form @submit="${this.handleSubmit}">
        <div>
          <label>${localization.getTranslation('firstName')}</label>
          <input
            name="firstName"
            .value="${this.employee.firstName}"
            @input="${this.handleInputChange}"
            required
          />

          <label>${localization.getTranslation('lastName')}</label>
          <input
            name="lastName"
            .value="${this.employee.lastName}"
            @input="${this.handleInputChange}"
            required
          />

          <label>${localization.getTranslation('dateOfEmployment')}</label>
          <input
            name="dateOfEmployment"
            type="date"
            .value="${this.employee.dateOfEmployment}"
            @input="${this.handleInputChange}"
            required
          />

          <label>${localization.getTranslation('dateOfBirth')}</label>
          <input
            name="dateOfBirth"
            type="date"
            .value="${this.employee.dateOfBirth}"
            @input="${this.handleInputChange}"
            max=${this.maxDate}
            required
          />

          <label>${localization.getTranslation('phone')}</label>
          <input
            name="phoneNumber"
            type="tel"
            .value="${this.employee.phoneNumber}"
            @input="${this.handleInputChange}"
            required
          />

          <label>${localization.getTranslation('email')}</label>
          <input
            name="email"
            type="email"
            .value="${this.employee.email}"
            @input="${this.handleInputChange}"
            required
          />

          <label>${localization.getTranslation('position')}</label>
          <select
            name="position"
            .value="${this.employee.position}"
            @input="${this.handleInputChange}"
            required
          >
            <option value="Junior">
              ${localization.getTranslation('junior')}
            </option>
            <option value="Medior">
              ${localization.getTranslation('medior')}
            </option>
            <option value="Senior">
              ${localization.getTranslation('senior')}
            </option>
          </select>

          <label>${localization.getTranslation('department')}</label>
          <select
            name="department"
            .value="${this.employee.department}"
            @input="${this.handleInputChange}"
            required
          >
            <option value="Analytics">
              ${localization.getTranslation('analytics')}
            </option>
            <option value="Tech">${localization.getTranslation('tech')}</option>
          </select>
        </div>
        <button type="submit">
          ${this.employee.id
            ? `${localization.getTranslation('update')}`
            : `${localization.getTranslation('create')}`}
        </button>
      </form>
    `;
  }
}

customElements.define('create-employee-form', CreateEmployeeForm);
