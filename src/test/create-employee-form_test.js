import {html, fixture, expect} from '@open-wc/testing';
import '../pages/create-employee-form.js';

describe('CreateEmployeeForm', () => {
  let element;
  const employees = [
    {
      id: 1,
      firstName: 'Test',
      lastName: 'Test',
      dateOfEmployment: '2020-01-15',
      dateOfBirth: '1990-05-20',
      phoneNumber: '1234567890',
      email: 'test@example.com',
      department: 'Tech',
      position: 'Junior',
    },
  ];

  beforeEach(async () => {
    localStorage.setItem('employees', JSON.stringify(employees));

    element = await fixture(
      html`<create-employee-form></create-employee-form>`
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders the form correctly', () => {
    expect(element.shadowRoot.querySelector('h3')).to.exist;
    expect(element.shadowRoot.querySelector('form')).to.exist;
  });

  it('updates input fields correctly', async () => {
    const input = element.shadowRoot.querySelector('input[name="firstName"]');
    input.value = 'Test2';
    input.dispatchEvent(new Event('input'));
    await element.updateComplete;

    expect(element.employee.firstName).to.equal('Test2');
  });

  it('navigates back when cancel is clicked in the modal', async () => {
    element.isModalOpen = true;
    await element.updateComplete;

    element.handleModalCancel();
    await element.updateComplete;

    expect(element.isModalOpen).to.be.false;
  });
  it('adds a new employee to localStorage on submit', async () => {
    localStorage.setItem('employees', JSON.stringify([]));

    const form = element.shadowRoot.querySelector('form');

    element.navigateBack = () => {};

    element.employee = {
      firstName: 'Test 2',
      lastName: 'Test',
      email: 'test2@example.com',
      dateOfEmployment: '2024-02-16',
      dateOfBirth: '1990-05-12',
      phoneNumber: '123456789',
      position: 'Junior',
      department: 'Tech',
    };
    await element.updateComplete;

    form.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
    await element.updateComplete;

    const employees = JSON.parse(localStorage.getItem('employees')) || [];

    expect(employees.length).to.equal(2);
    expect(
      employees.some(
        (emp) => emp.firstName === 'Test 2' && emp.lastName === 'Test'
      )
    ).to.be.true;
  });
});
