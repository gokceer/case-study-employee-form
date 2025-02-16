import {fixture, assert, html, oneEvent} from '@open-wc/testing';
import '../components/custom-modal.js';

describe('CustomModal', () => {
  it('renders correctly when visible', async () => {
    const element = await fixture(html`<custom-modal visible></custom-modal>`);
    const modal = element.shadowRoot.querySelector('.modal');
    assert.isFalse(modal.classList.contains('hidden'));
  });

  it('renders correctly when hidden', async () => {
    const element = await fixture(html`<custom-modal></custom-modal>`);
    const modal = element.shadowRoot.querySelector('.modal');
    assert.isTrue(modal.classList.contains('hidden'));
  });

  it('updates description correctly', async () => {
    const element = await fixture(
      html`<custom-modal description="Test Description"></custom-modal>`
    );
    const paragraph = element.shadowRoot.querySelector('p');
    assert.equal(paragraph.textContent, 'Test Description');
  });

  it('emits a proceed event when the proceed button is clicked', async () => {
    const element = await fixture(html`<custom-modal visible></custom-modal>`);
    const button = element.shadowRoot.querySelector('.buttonStyle');
    setTimeout(() => button.click());
    const event = await oneEvent(element, 'proceed');
    assert.exists(event);
  });

  it('emits a cancel event when the cancel button is clicked', async () => {
    const element = await fixture(html`<custom-modal visible></custom-modal>`);
    const button = element.shadowRoot.querySelector('.cancel');
    setTimeout(() => button.click());
    const event = await oneEvent(element, 'cancel');
    assert.exists(event);
  });

  it('hides modal when cancel button is clicked', async () => {
    const element = await fixture(html`<custom-modal visible></custom-modal>`);
    const button = element.shadowRoot.querySelector('.cancel');
    button.click();
    await element.updateComplete;
    assert.isTrue(
      element.shadowRoot.querySelector('.modal').classList.contains('hidden')
    );
  });
});
