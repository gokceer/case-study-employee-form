import {html, fixture, expect} from '@open-wc/testing';
import '../pages/employee-list.js';

describe('EmployeeList Page', () => {
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
    {
      id: 2,
      firstName: 'Test 2',
      lastName: 'Test',
      dateOfEmployment: '2019-03-10',
      dateOfBirth: '1985-08-25',
      phoneNumber: '0987654321',
      email: 'test@example.com',
      department: 'Analytics',
      position: 'Senior',
    },
  ];

  beforeEach(async () => {
    localStorage.setItem('employees', JSON.stringify(employees));

    element = await fixture(html`<employee-list></employee-list>`);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render the navigation bar', () => {
    const navBar = element.shadowRoot.querySelector('navigation-bar');
    expect(navBar).to.exist;
  });

  it('should display employees in table view by default', async () => {
    const table = element.shadowRoot.querySelector('table-view');
    expect(table).to.exist;
  });

  it('should switch to list view when the list button is clicked', async () => {
    const listButton = element.shadowRoot.querySelector(
      '.icon-button:nth-child(3)'
    );
    listButton.click();
    await element.updateComplete;

    const listView = element.shadowRoot.querySelector('list-view');
    expect(listView).to.exist;
  });

  it('should filter employees based on search query', async () => {
    const input = element.shadowRoot.querySelector('input');
    input.value = 'Test 2';
    input.dispatchEvent(new Event('input'));
    await element.updateComplete;

    expect(element.filteredEmployees.length).to.equal(1);
    expect(element.filteredEmployees[0].firstName).to.equal('Test 2');
  });

  it('should open a modal when deleting an employee', async () => {
    element.deleteEmployee({detail: 1});
    await element.updateComplete;

    expect(element.isModalOpen).to.be.true;
    expect(element.modalDescription).to.include('Test Test');
  });

  it('should remove an employee when confirmDelete is called', async () => {
    element.confirmDelete(1);
    await element.updateComplete;

    expect(element.employees.length).to.equal(1);
    expect(element.employees[0].firstName).to.equal('Test 2');
  });

  it('should update current page when pagination changes', async () => {
    element.shadowRoot
      .querySelector('pagination-element')
      .dispatchEvent(new CustomEvent('page-change', {detail: 2}));

    await element.updateComplete;
    expect(element.currentPage).to.equal(2);
  });
});
