//** Selectors */
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById("grocery");
const groceryContainer = document.querySelector('.grocery-container');
const submitBtn = document.querySelector('.submit-btn');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

//Editing
let editElement;
let editFlag = false;
let editID = "";

//Event Listeners
form.addEventListener("submit", addItem);

//clear items
clearBtn.addEventListener("click", clearItems);

const deleteBtn = document.querySelector('.delete-btn');
console.log(deleteBtn);

//Functions
function addItem(e) {
  e.preventDefault();

  const item = grocery.value;
  //unique id, easy hack without lib etc by just using miliseconds new date
  const id = new Date().getTime().toString();

  if (item && !editFlag) {
    const element = document.createElement('article');
    //add class to element
    element.classList.add('grocery-item');
    //add id to element
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${item}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;

    const deleteBtn = element.querySelector('.delete-btn')
    const editBtn = element.querySelector('.edit-btn')
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);

    //append child (list)
    list.appendChild(element);
    displayAlert('Item added to the List!', 'success');
    //show container
    groceryContainer.classList.add("show-container");
    //local storage
    addToLocalStorage(id, item);
    setBackToDefault();

  } else if (item && editFlag) {
    editElement.innerHTML = item;
    displayAlert("Item Changed!", "success");
    //edit local storage
    editLocalStorage(editID.value);
    setBackToDefault();
  } else {
    displayAlert("Please Enter an Item!", "danger");
  }
}

//alerts
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
};

//clear items from list
function clearItems() {
  const items = document.querySelectorAll('.grocery-item');

  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    })
  }
  groceryContainer.classList.remove("show-container");
  displayAlert('Empy List', "danger");
  setBackToDefault();
  localStorage.removeItem('list');
};

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length == 0) {
    groceryContainer.classList.remove("show-container");
  }
  displayAlert('Item Removed!', "danger");
  setBackToDefault();
  //remove local storage
  removeFromLocalStorage(id);
};

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  //set the item to edit
  editElement = e.currentTarget.parentElement.previousElementSibling;
  //set form
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
};

//set to default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
};

//Local Storage

function addToLocalStorage(id, value) {
  const list = {
    id,
    value
  };
  let items = localStorage.getItem("list") ? JSON.parse(localStorage.getItem('list')) : [];
  items.push(list)
  localStorage.setItem('list', JSON.stringify(items))
};

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      //filter out mismatching ID param
      return item;
    }
  })
}

function editLocalStorage(id, value) {
  localStorage.setItem("orange", JSON.stringify(["item", "item2"]));
}

function getLocalStorage() {
  return localStorage.getItem("list") ? JSON.parse(localStorage.getItem('list')) : [];
}