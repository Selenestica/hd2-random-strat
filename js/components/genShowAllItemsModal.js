const showAllItemsModal = document.getElementById('showAllItemsModal');
const showAllItemsModalBody = document.getElementById('showAllItemsModalBody');
const showAllItemsModalTitle = document.getElementById('showAllItemsModalTitle');

const populateShowAllItemsModal = async (acc) => {
  showAllItemsModalBody.innerHTML = '';
  showAllItemsModalTitle.innerHTML = '';
  const title = acc.replace('AccordionBody', '');
  showAllItemsModalTitle.innerHTML = title;
  const accBodyElement = document.getElementById(acc);
  if (accBodyElement.children.length > 0) {
    showAllItemsModalBody.innerHTML = '';
    const childArray = Array.from(accBodyElement.children);
    const newElements = await childArray.map((el) => {
      const clone = el.cloneNode(true);
      clone.id = el.id + 'clone';
      return clone;
    });
    for (let i = 0; i < newElements.length; i++) {
      showAllItemsModalBody.append(newElements[i]);
    }
    const modal = new bootstrap.Modal(showAllItemsModal);
    modal.show();
  }
};
