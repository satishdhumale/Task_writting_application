//All the cards will be here
const state = {
  tasklist: [],
};

// dom manipulations
// this is to get the div from HTML
const taskModel = document.querySelector(".task__modal__body");
// This is for new modal
const taskcontent = document.querySelector(".task__content");

// This is to push the data to HTML
const htmlTaskContent = ({ id, title, description, type, url }) =>
  `
  <div class='col-md-6 col-lg-4 mt-3' id=${id}key=${id}>
    <div class='card shadow-sm task__card'>
      <div class='card-header d-flex justify-content-end task__card__header'>
        <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick="editTask.apply(this, arguments)">
          <i class='fa fa-pencil-alt' name=${id}></i>
        </button>
        <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick="deleteTask.apply(this, arguments)">
          <i class='fa fa-trash-alt' name=${id}></i>
        </button> 
</div>
          <div class='card-body'>
            ${
              url
                ? `<img width='100%' src=${url} alt='card image here' class='card-image-top md-3 rounded-lg '/>`
                : `<img width='100%' src='https://complianz.io/wp-content/uploads/2019/03/placeholder-300x202.jpg' alt='card image here' class='card-image-top md-3 rounded-lg '/>`
            }
            <h4 class='task__card__title'> ${title}</h4>
            <p class='description trim-3-lines text-muted' data-gram_editor='true'>${description}
            </p>
            <div class='tags text-white d-flex flex-wrap'>
              <span class='badge bg-primary m-1'>${type}</span>
            </div>
          </div>
          <div class='card-footer'>
            <button type='button' 
            class='btn btn-outline-primary float-right'
            data-bs-toggle='modal'
            data-bs-target='#showTask'
            id=${id}
            onclick='openTask.apply(this, arguments)'>
            Open Task
            </button> 
        </div>
      
    </div>
  </div>
`;

// modal in big view
const htmlModalcontent = ({ id, title, description, type, url }) => {
  const date = new Date(parseInt(id));
  // for converting date to int
  return `
  <div id=${id}>
   ${
     url
       ? `<img width='100%' src=${url} alt='card image here' class='img-fluid place__holder__image mb-3'/>`
       : `<img width='100%' src='https://complianz.io/wp-content/uploads/2019/03/placeholder-300x202.jpg' alt='card image here' class='card-image-top md-3 rounded-lg '/>`
   }
   <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
  <h2 class='my-3'>${title}</h2>
  <p class='lead '>${description}</p> 
  <span class='badge bg-primary m-1'>${type}</span>
  </div>
  `;
};

// updating local storage
const updatelocalstorage = () => {
  // to work on group of objects(i.e id, url etc) we are using JSON
  // JSON.stringify is array of objects
  localStorage.setItem(
    "task",
    JSON.stringify({
      // to access array from object
      tasks: state.tasklist,
    })
  );
};
// this is now for localstorage use, now we want it back in readable
// object to string for reading on UI
const loadinitialdata = () => {
  const localStoragecopy = JSON.parse(localStorage.task);
  // we are storing the data object in "task"

  if (localStoragecopy) state.tasklist = localStoragecopy.tasks;
  // if localstorage is true or false means if it has any data or not
  state.tasklist.map((cardDate) => {
    taskcontent.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
    // adjacenthtml has to do with positions, beforebegin etc named based on div/p/span
  });
};
// for saving data of form
const handlesubmit = (event) => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageurl").value,
    title: document.getElementById("tasktitle").value,
    type: document.getElementById("tasktype").value,
    description: document.getElementById("taskdesc").value,

    // .value to access the data
  };
  if (input.title === "" || input.type === "" || input.description === "") {
    return alert("Please Fill all the Fields");
  }
  taskcontent.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({
      // ... we get data in object within an object so we use spread operator
      ...input,
      id,
    })
  );
  state.tasklist.push({ ...input, id });
  // update data on localstorage even after reloading
  updatelocalstorage();
};

// to open modal on click of open task button
const openTask = (e) => {
  // give current card
  if (!e) e = window.event;
  // find current card
  const getTask = state.tasklist.find(({ id }) => id === e.target.id);
  taskModel.innerHTML = htmlModalcontent(getTask);
};

// to delete modal
const deleteTask = (e) => {
  if (!e) e = window.event;
  // in delete class we have umique name for delete icon so we target name
  const targetId = e.target.getAttribute("name");
  const type = e.target.tagName;
  // tagname to get if its Icon or Button
  const removeTask = state.tasklist.filter(({ id }) => id !== targetId);
  // we will have all cards except this once with filter
  // to remove from localstorage
  state.tasklist = removeTask;
  updatelocalstorage();

  if (type === "BUTTON") {
    // to access the whole card from button(parent div)
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};

// edit operation

const editTask = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.id;
  const type = e.target.tagname;

  let parentNode;
  let tasklist;
  let taskdesc;
  let tasktype;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }
  // to access the respective div of child element
  tasktitle = parentNode.childNodes[3].childNodes[3];
  taskdesc = parentNode.childNodes[3].childNodes[5];
  tasktype = parentNode.childNodes[3].childNodes[7].childNodes[1];
  submitButton = parentNode.childNodes[5].childNodes[1];
  // to make it editable
  tasktitle.setAttribute("contenteditable", "true");
  tasktype.setAttribute("contenteditable", "true");
  taskdesc.setAttribute("contenteditable", "true");

  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  // to remove toggle modal from showtask
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  // to change the open task to save changes
  submitButton.innerHTML = "Save Changes";
};
// to save edit
const saveEdit = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.id;
  const parentNode = e.target.parentNode.parentNode;

  const tasktitle = parentNode.childNodes[3].childNodes[3];
  const taskdesc = parentNode.childNodes[3].childNodes[5];
  const tasktype = parentNode.childNodes[3].childNodes[7].childNodes[1];
  const submitButton = parentNode.childNodes[5].childNodes[1];

  const updatedData = {
    tasktitle: tasktitle.innerHTML,
    taskdesc: taskdesc.innerHTML,
    tasktype: tasktype.innerHTML,
  };

  let stateCopy = state.tasklist;
  stateCopy = stateCopy.map((task) =>
    task.id === targetId
      ? {
          id: task.id,
          title: updatedData.tasktitle,
          description: updatedData.taskdesc,
          type: updatedData.tasktype,
          url: task.url,
        }
      : task
  );
  state.tasklist = stateCopy;
  updatelocalstorage();

  tasktitle.setAttribute("contenteditable", "false");
  tasktype.setAttribute("contenteditable", "false");
  taskdesc.setAttribute("contenteditable", "false");

  submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};
// for search operation
const searchTask = (e) => {
  if (!e) e = window.event;
  while (taskcontent.firstChild) {
    taskcontent.removeChild(taskcontent.firstChild);
  }

  const resultData = state.tasklist.filter(({ title }) =>
    title.toLowerCase().includes(e.target.value.toLowerCase())
  );
  resultData.map((cardDate) =>
    taskcontent.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate))
  );
};
