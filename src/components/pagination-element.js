import {LitElement, html, css} from 'lit';

class PaginationElement extends LitElement {
  static properties = {
    totalPages: {type: Number},
    currentPage: {type: Number},
  };

  static styles = css`
    .pagination {
      display: flex;
      list-style: none;
      gap: 4px;
      padding-inline-start: 0px;
    }
    .page-item {
      padding: 5px 10px;
      cursor: pointer;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .page-item.active {
      background-color: #ff6200;
      color: white;
    }
    .page-item.disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  `;

  constructor() {
    super();
    this.totalPages = 1;
    this.currentPage = 1;
  }

  updatePage(newPage) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.dispatchEvent(
        new CustomEvent('page-change', {detail: this.currentPage})
      );
    }
  }

  getPages() {
    const pages = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (this.currentPage > 3) {
        pages.push('...');
      }

      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.totalPages - 1, this.currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (this.currentPage < this.totalPages - 2) {
        pages.push('...');
      }

      pages.push(this.totalPages);
    }
    return pages;
  }

  render() {
    return html`
      <ul class="pagination">
        <li
          class="page-item ${this.currentPage === 1 ? 'disabled' : ''}"
          @click="${() => this.updatePage(this.currentPage - 1)}"
        >
          &lt;
        </li>
        ${this.getPages().map(
          (page) => html`
            <li
              class="page-item ${page === this.currentPage
                ? 'active'
                : ''} ${page === '...' ? 'disabled' : ''}"
              @click="${() =>
                typeof page === 'number' ? this.updatePage(page) : null}"
            >
              ${page}
            </li>
          `
        )}
        <li
          class="page-item ${this.currentPage === this.totalPages
            ? 'disabled'
            : ''}"
          @click="${() => this.updatePage(this.currentPage + 1)}"
        >
          &gt;
        </li>
      </ul>
    `;
  }
}

customElements.define('pagination-element', PaginationElement);
