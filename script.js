const apiUrl = "http://localhost:8080"

onInitPage()

function onInitPage() {
  var data = fetchData(apiUrl);
  renderStudentRows(data);
}

function fetchData(url) {
  return fetch(url).then(response => response.json());
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
  console.log("created");
}

function viewStudent(id) {
  var title = "view student";
  var body = "student detail";
  renderModal(title, body);
  var viewModal = new bootstrap.Modal(document.getElementById('viewModal'));;
  viewModal.toggle();
  console.log("viewed", id);
}

function updateStudent(id) {
  console.log("updated", id);
}

function deleteStudent(id) {
  console.log("deleted", id);
}

function renderModal(title, body) {
  customModal = document.getElementById("customModal");
  customModal.innerHTML = `
  <div class="modal" id="viewModal" tabindex="-1">
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
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  `
}