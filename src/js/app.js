class Schedule {
  constructor() {
    this.container = document.querySelector('.container');
    this.body = document.querySelector('body');
    this.insertCard = (content = '') => `
    <div draggable="true" class="column-line_item">
      <div class="column-line_item__cross-close">&#10006;</div>
      <textarea
        class="column-line_item_content"
        autocomplete="on"
        placeholder="Enter a title for this card..."
      >${content}</textarea>
    </div>`;
  }

  addTaskCard() {
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('button_add')) {
        const addCards = e.target
          .closest('.column-line')
          .querySelectorAll('.column-line_item');
        if (addCards.length !== 0) {
          addCards[addCards.length - 1].insertAdjacentHTML(
            'afterEnd',
            this.insertCard(),
          );
        } else {
          e.target.insertAdjacentHTML('beforeBegin', this.insertCard());
        }
        this.updateLocalStorage();
      }
    });
  }

  deleteTaskCard() {
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('column-line_item__cross-close')) {
        e.target.closest('.column-line_item').remove();
      }
      this.updateLocalStorage();
    });
  }

  cardDragget() {
    let actulElement;
    const onDragover = (e) => {
      e.preventDefault();
      const currentEl = e.target.closest('.column-line_item');
      const moveEl = actulElement !== currentEl;
      if (!moveEl) return;
      if (currentEl) {
        e.target.closest('.column-line').insertBefore(actulElement, currentEl);
      } else if (e.target.closest('.column-line')) {
        const botton = e.target
          .closest('.column-line')
          .querySelector('.button_add');
        botton.insertAdjacentElement('beforebegin', actulElement);
      }
    };
    const onDragend = (e) => {
      if (e.target.classList.contains('column-line_item')) {
        actulElement.classList.remove('dragget');
        this.updateLocalStorage();
      }
    };
    this.container.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('column-line_item')) {
        actulElement = e.target;
        actulElement.classList.add('dragget');
        document.documentElement.addEventListener('dragend', onDragend);
        document.documentElement.addEventListener('dragover', onDragover);
      }
    });
  }

  updateLocalStorage() {
    const condition = [];
    const columnLine = document.querySelectorAll('.column-line');
    columnLine.forEach((line, indexLine) => {
      condition[indexLine] = [];
      const taskCard = line.querySelectorAll('.column-line_item');
      taskCard.forEach((card, indexCard) => {
        const content = card.querySelector('.column-line_item_content').value;
        const dataBody = [content];
        condition[indexLine][indexCard] = dataBody;
      });
    });
    const database = JSON.stringify(condition);
    window.localStorage.setItem('database', database);
  }

  expandTextArea() {
    this.container.addEventListener('input', (e) => {
      const { target } = e;
      if (target.classList.contains('column-line_item_content')) {
        target.style.height = 'inherit';
        target.style.height = `${target.scrollHeight}px`;
      }
    });
  }

  loadFromLocalStorage() {
    if (!localStorage.getItem('database')) return;
    const getDataBase = localStorage.getItem('database');
    const dataBase = JSON.parse(getDataBase);
    const columnLine = document.querySelectorAll('.column-line');
    for (let i = 0; i < dataBase.length; i++) {
      for (let j = 0; j < dataBase[i].length; j++) {
        const cardHTML = this.insertCard(dataBase[i][j]);
        columnLine[i].querySelector('.button_add').insertAdjacentHTML(
          'beforeBegin',
          cardHTML,
        );

        const insertedCard = columnLine[i].querySelector('.column-line_item_content:last-child');
        insertedCard.style.height = 'inherit';
        insertedCard.style.height = `${insertedCard.scrollHeight}px`;
      }
    }
  }
}

const Trello = new Schedule();
Trello.loadFromLocalStorage();
Trello.addTaskCard();
Trello.deleteTaskCard();
Trello.cardDragget();
Trello.expandTextArea();
