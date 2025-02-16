import {html, fixture, expect} from '@open-wc/testing';
import '../components/table-view.js';

describe('TableView', () => {
  it('renders the table with employees', async () => {
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

    const el = await fixture(
      html`<table-view .paginatedEmployees=${employees}></table-view>`
    );
    const rows = el.shadowRoot.querySelectorAll('tr');

    expect(rows.length).to.equal(3);

    const row1Text = rows[1].textContent.replace(/\s+/g, ' ').trim();
    const row2Text = rows[2].textContent.replace(/\s+/g, ' ').trim();

    expect(row1Text).to.include(
      'Test Test 2020-01-15 1990-05-20 1234567890 test@example.com Teknik Kıdemsiz'
    );
    expect(row2Text).to.include(
      'Test 2 Test 2019-03-10 1985-08-25 0987654321 test@example.com Analitik Kıdemli'
    );
  });

  it('dispatches edit event when edit button is clicked', async () => {
    const employee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2020-01-15',
      dateOfBirth: '1990-05-20',
      phoneNumber: '1234567890',
      email: 'john@example.com',
      department: 'HR',
      position: 'Manager',
    };
    const el = await fixture(
      html`<table-view .paginatedEmployees=${[employee]}></table-view>`
    );

    const editButton = el.shadowRoot.querySelector(
      '.icon-button:first-of-type'
    );
    const eventSpy = new Promise((resolve) =>
      el.addEventListener('edit', resolve)
    );

    editButton.click();
    const event = await eventSpy;

    expect(event.detail).to.equal(1);
  });

  it('dispatches delete event when delete button is clicked', async () => {
    const employee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2020-01-15',
      dateOfBirth: '1990-05-20',
      phoneNumber: '1234567890',
      email: 'john@example.com',
      department: 'HR',
      position: 'Manager',
    };
    const el = await fixture(
      html`<table-view .paginatedEmployees=${[employee]}></table-view>`
    );

    const deleteButton = el.shadowRoot.querySelectorAll('.icon-button')[1];
    const eventSpy = new Promise((resolve) =>
      el.addEventListener('delete', resolve)
    );

    deleteButton.click();
    const event = await eventSpy;

    expect(event.detail).to.equal(1);
  });
});
