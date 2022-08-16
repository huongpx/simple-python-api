const apiUrl = "http://localhost:8080/students"

onInitPage()

function onInitPage() {
  var data = request(apiUrl, "GET");
  renderStudentRows(data);
}

function request(url, method, data = {}) {
  var initRequest = {
    method: method,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  if (method !== "GET") {
    initRequest["body"] = JSON.stringify(data);
  }
  return fetch(url, initRequest).then(response => response.json());
}

function renderStudentRows(data) {
  data.then(data => {
    if (data.length > 0) {
      var temp = "";
      data.forEach((student) => {
        temp += renderStudentRow(student);
      });
      document.getElementById('data').innerHTML = temp;
    }
  })
}

function renderStudentRow(student) {
  var temp = "";
  temp += "<tr>";
  temp += "<td>" + student.id + "</td>";
  temp += "<td>" + student.name + "</td>";
  temp += "<td>" + student.age + "</td>";
  temp += `<td>
              <button type="button" class="btn btn-primary" onclick="viewStudent(${student.id})">View</button>
              <button type="button" class="btn btn-success" onclick="updateStudent(${student.id})">Update</button>
              <button type="button" class="btn btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
            </td>`;
  temp += "</tr>";
  return temp
}

function createStudent() {
  var modalID = "addModal"
  var title = "Create student";
  var student = null;
  var actionType = "add";
  var body = renderForm(student, actionType);
  var actionConfirm = "Submit";

  action(modalID, title, body, actionConfirm);
  console.log("created");
}

function viewStudent(id) {
  var modalID = "viewModal"
  var title = "view student";
  var actionType = "view";
  var actionConfirm = "OK";
  request(apiUrl + "/" + id, "GET")
    .then(student => {
      var body = renderForm(student, actionType);
      action(modalID, title, body, actionConfirm);
    })

  console.log("student detail", id);
}

function updateStudent(id) {
  var modalID = "updateModal"
  var title = "update student";
  var body = "student update form";
  var actionConfirm = "Update";

  action(modalID, title, body, actionConfirm);
  console.log("updated", id);
}

function deleteStudent(id) {
  var modalID = "deleteModal"
  var title = "delete student";
  var body = "Delete this student?";
  var actionConfirm = "Delete";

  action(modalID, title, body, actionConfirm);
  console.log("deleted", id);
}

function renderForm(student, actionType) {
  var data = {};
  var actions = ["add", "view", "update"]
  if (actions.includes(actionType) ) {
    data = {
      idField: {
        placeHolder: "Enter Student ID",
        value: student ? student.id : ""
      },
      nameField: {
        placeHolder: "Enter Student Name",
        value: student ? student.name : ""
      },
      ageField: {
        placeHolder: "Enter Student Age",
        value: student ? student.age : ""
      }
    }
  }
  var body = `
  <form id="student-modal-form">
    <div class="mb-3 mt-3">
      <label for="id" class="form-label">ID:</label>
      <input type="text" class="form-control" id="id" 
        placeholder="${data.idField.placeHolder}" 
        value="${data.idField.value}" name="id" 
        ${actionType === "view" ? "readonly" : ""}
      >
    </div>
    <div class="mb-3">
      <label for="name" class="form-label">Name:</label>
      <input type="text" class="form-control" id="name" 
        placeholder="${data.nameField.placeHolder}" 
        value="${data.nameField.value}" name="name" 
        ${actionType === "view" ? "readonly" : ""}
      >
    </div>
    <div class="mb-3">
      <label for="age" class="form-label">Age:</label>
      <input type="text" class="form-control" id="age" 
        placeholder="${data.ageField.placeHolder}" 
        value="${data.ageField.value}" name="age" 
        ${actionType === "view" ? "readonly" : ""}
      >
    </div>
  </form> 
  `;
  return body
}

function action(modalID, title, body, actionConfirm) {
  renderModal(modalID, title, body, actionConfirm);
  toggleModal(modalID);
}

function renderModal(modalID, title, body, actionConfirm) {
  const customModal = document.getElementById("customModal");
  const confirmButtonClass = {
    "Submit": "btn-primary",
    "OK": "btn-primary",
    "Update": "btn-success",
    "Delete": "btn-danger",
  };

  customModal.innerHTML = `
  <div class="modal" id="${modalID}" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>${body}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn ${confirmButtonClass[actionConfirm]}" onclick="handleSubmit()">${actionConfirm}</button>
          </div>
        </div>
      </div>
    </div>
  `
}

function toggleModal(modalID) {
  const modal = new bootstrap.Modal(document.getElementById(modalID));
  modal.toggle();
  console.log("toggled", modalID);
}

function handleSubmit() {
  const form = document.getElementById("student-modal-form");
  const id = form.elements["id"].value;
  const name = form.elements["name"].value;
  const age = form.elements["age"].value;
  const data = {
    id: id,
    name: name,
    age: age
  };
  request(apiUrl, "POST", data).then(() => {
    location.reload()
  })
}
