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
  temp += "<td>" + student.student_id_number + "</td>";
  temp += "<td>" + student.name + "</td>";
  temp += "<td>" + student.age + "</td>";
  temp += `<td>
              <button type="button" class="btn btn-primary" onclick="viewStudent(${student.student_id_number})">View</button>
              <button type="button" class="btn btn-success" onclick="updateStudent(${student.student_id_number})">Update</button>
              <button type="button" class="btn btn-danger" onclick="deleteStudent(${student.student_id_number})">Delete</button>
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
}

function viewStudent(id) {
  var modalID = "viewModal"
  var title = "Student detail";
  var actionType = "view";
  var actionConfirm = "OK";
  request(apiUrl + "/" + id, "GET")
    .then(student => {
      var body = renderForm(student, actionType);
      action(modalID, title, body, actionConfirm);
    })
}

function updateStudent(id) {
  var modalID = "updateModal"
  var title = "Update student";
  var actionType = "update";
  var actionConfirm = "Update";

  request(apiUrl + "/" + id, "GET")
    .then(student => {
      var body = renderForm(student, actionType);
      action(modalID, title, body, actionConfirm, id);
    })
}

function deleteStudent(id) {
  var modalID = "deleteModal"
  var title = "Delete student";
  var body = "Delete this student?";
  var actionConfirm = "Delete";

  action(modalID, title, body, actionConfirm, id);
}

function renderForm(student, actionType) {
  var data = {};
  var actions = ["add", "view", "update"]
  if (actions.includes(actionType) ) {
    data = {
      idField: {
        placeHolder: "Enter Student ID Number",
        value: student ? student.student_id_number : ""
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
      <input type="text" class="form-control" id="student_id_number" 
        placeholder="${data.idField.placeHolder}" 
        value="${data.idField.value}" name="student_id_number" 
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

function action(modalID, title, body, actionConfirm, id=null) {
  renderModal(modalID, title, body, actionConfirm, id);
  toggleModal(modalID);
}

function renderModal(modalID, title, body, actionConfirm, id=null) {
  const customModal = document.getElementById("customModal");
  const confirmButtonClass = {
    "Submit": "btn-primary",
    "OK": "btn-primary",
    "Update": "btn-success",
    "Delete": "btn-danger",
  };

  // have to map to number
  // not sure how to enter string to innerHTML bellow, if enter actionConfirm it raised error
  // i.e. when actionConfirm = "Submit", it handle that as Submit variable, so not defined
  const handleConfirm = {
    "Submit": 1,
    "OK": 2,
    "Update": 3,
    "Delete": 4,
  }

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
            <button type="button" class="btn ${confirmButtonClass[actionConfirm]}" onclick="handleSubmit(${handleConfirm[actionConfirm]}, ${id})">${actionConfirm}</button>
          </div>
        </div>
      </div>
    </div>
  `
}

function toggleModal(modalID) {
  const modal = new bootstrap.Modal(document.getElementById(modalID));
  modal.toggle();
}

function handleSubmit(actionConfirm, id=null) {
  switch (actionConfirm) {
    case 1:
      confirmCreate();
      break
    case 2:
      confirmOK();
      break
    case 3:
      confirmUpdate(id);
      break
    case 4:
      confirmDelete(id);
  }
}

function confirmCreate() {
  const form = document.getElementById("student-modal-form");
  const student_id_number = form.elements["student_id_number"].value;
  const name = form.elements["name"].value;
  const age = form.elements["age"].value;
  const data = {
    student_id_number: student_id_number,
    name: name,
    age: age
  };
  request(apiUrl, "POST", data).then(() => {
    location.reload()
  })
}

function confirmOK() {
  location.reload();
}

function confirmUpdate(id) {
  const form = document.getElementById("student-modal-form");
  const student_id_number = form.elements["student_id_number"].value;
  const name = form.elements["name"].value;
  const age = form.elements["age"].value;
  const data = {
    student_id_number: student_id_number,
    name: name,
    age: age
  };
  request(apiUrl + "/" + id, "PUT", data).then(() => {
    location.reload()
  })
}

function confirmDelete(id) {
  request(apiUrl + "/" + id, "DELETE").then(() => {
    location.reload()
  })
}
