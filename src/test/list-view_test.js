import {fixture, assert, html} from '@open-wc/testing';
import '../components/list-view.js';

describe('ListView', () => {
  let element;
  const sampleEmployees = [
    {
      id: 1,
      firstName: 'Test Name',
      lastName: 'Test LastName',
      email: 'test.name@example.com',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phoneNumber: '123-456-7890',
      department: 'Tech',
      position: 'Medior',
    },
  ];

  beforeEach(async () => {
    element = await fixture(html`<list-view></list-view>`);
    element.paginatedEmployees = sampleEmployees;
    await element.updateComplete;
  });

  it('renders the list of employees', () => {
    const listItems = element.shadowRoot.querySelectorAll('.list-item');
    assert.equal(listItems.length, sampleEmployees.length);
    assert.include(listItems[0].textContent, 'Test Name');
    assert.include(listItems[0].textContent, 'test.name@example.com');
  });

  it('dispatches an edit event when the edit button is clicked', async () => {
    const editButton = element.shadowRoot.querySelector('.icon-button');
    let eventDetail;

    element.addEventListener('edit', (event) => {
      eventDetail = event.detail;
    });

    editButton.click();
    await element.updateComplete;

    assert.equal(eventDetail, sampleEmployees[0].id);
  });

  it('dispatches a delete event when the delete button is clicked', async () => {
    const deleteButton = element.shadowRoot.querySelectorAll('.icon-button')[1];
    let eventDetail;

    element.addEventListener('delete', (event) => {
      eventDetail = event.detail;
    });

    deleteButton.click();
    await element.updateComplete;

    assert.equal(eventDetail, sampleEmployees[0].id);
  });
});
