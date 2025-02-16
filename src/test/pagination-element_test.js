import {html, fixture, expect} from '@open-wc/testing';
import '../components/pagination-element.js';

describe('PaginationElement', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(
      html`<pagination-element
        totalPages="10"
        currentPage="1"
      ></pagination-element>`
    );
  });

  it('should highlight the current page', async () => {
    const activePage = element.shadowRoot.querySelector('.page-item.active');
    expect(activePage).to.exist;
    expect(activePage.textContent.trim()).to.equal('1');
  });

  it('should disable previous button on first page', async () => {
    const prevButton = element.shadowRoot.querySelector(
      '.page-item:first-child'
    );
    expect(prevButton.classList.contains('disabled')).to.be.true;
  });

  it('should disable next button on last page', async () => {
    element.currentPage = 10;
    await element.updateComplete;

    const nextButton = element.shadowRoot.querySelector(
      '.page-item:last-child'
    );
    expect(nextButton.classList.contains('disabled')).to.be.true;
  });

  it('should emit "page-change" event when clicking on a page number', async () => {
    const pageButton = element.shadowRoot.querySelector(
      '.page-item:nth-child(3)'
    );
    let eventFired = false;

    element.addEventListener('page-change', (e) => {
      eventFired = true;
      expect(e.detail).to.equal(2);
    });

    pageButton.click();
    await element.updateComplete;

    expect(eventFired).to.be.true;
  });

  it('should update current page when a page number is clicked', async () => {
    const pageButton = element.shadowRoot.querySelector(
      '.page-item:nth-child(3)'
    );
    pageButton.click();
    await element.updateComplete;

    expect(element.currentPage).to.equal(2);
    const newActivePage = element.shadowRoot.querySelector('.page-item.active');
    expect(newActivePage.textContent.trim()).to.equal('2');
  });

  it('should render ellipses (...) when there are more than 5 pages', async () => {
    element.currentPage = 5;
    await element.updateComplete;

    const ellipses = [
      ...element.shadowRoot.querySelectorAll('.page-item'),
    ].filter((el) => el.textContent.trim() === '...');
    expect(ellipses.length).to.be.greaterThan(0);
  });
});
