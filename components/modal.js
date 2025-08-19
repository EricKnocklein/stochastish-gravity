class Modal {
  constructor(content) {
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    // this.modal.style.display = 'none';
    document.body.appendChild(this.modal);

    if (typeof content === 'string') {
      this.modal.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this.modal.innerHTML = '';
      this.modal.appendChild(content);
    } else {
      return;
    }

    this.modal.setAttribute('tabindex', '-1');
    this.modal.focus();

    this.addBackdrop();

    this.modal.addEventListener('blur', () => this.close());
  }

  addBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';

    // Insert backdrop before modal in the DOM
    document.body.insertBefore(backdrop, this.modal);

    this.backdrop = backdrop;
  }

  close() {
    this.destroy();
  }

  destroy() {
    this.backdrop.remove();
    this.modal.remove();
  }
}

export default Modal;