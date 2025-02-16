import {html, fixture, expect} from '@open-wc/testing';
import '../components/navigation-bar.js';
import {localization} from '../localization/localization.js';

describe('NavigationBar', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<navigation-bar></navigation-bar>`);
  });

  it('should render correctly', () => {
    expect(element).to.exist;
  });

  it('should add active class to Employees button when pathname is "/"', async () => {
    window.history.pushState({}, '', '/');
    await element.requestUpdate(); // Force update

    const buttons = element.shadowRoot.querySelectorAll('button');
    expect(buttons[0].classList.contains('active')).to.be.true;
    expect(buttons[1].classList.contains('active')).to.be.false;
  });

  it('should add active class to Add New button when pathname is "/create"', async () => {
    window.history.pushState({}, '', '/create');
    await element.requestUpdate();

    const buttons = element.shadowRoot.querySelectorAll('button');
    expect(buttons[0].classList.contains('active')).to.be.false;
    expect(buttons[1].classList.contains('active')).to.be.true;
  });

  it('should toggle language when language buttons are clicked', async () => {
    const trButton = element.shadowRoot.querySelector('button:nth-child(3)');
    const enButton = element.shadowRoot.querySelector('button:nth-child(4)');
    const employeeButton = element.shadowRoot.querySelector(
      'button:nth-child(1)'
    );
    const addNewButton = element.shadowRoot.querySelector(
      'button:nth-child(2)'
    );
    trButton.click();
    await element.updateComplete;
    expect(employeeButton.textContent.trim()).to.equal('Çalışanlar');
    expect(addNewButton.textContent.trim()).to.equal('Yeni Ekle');

    enButton.click();
    await element.updateComplete;
    expect(employeeButton.textContent.trim()).to.equal('Employees');
    expect(addNewButton.textContent.trim()).to.equal('Add New');
  });
});
