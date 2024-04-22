
let userData = [];
let sortedData = [];
let url = "";
currentSorting = "";
directionSorting = 0;
let selectedUser;
sortedElement = {
  element: 'id',
  direction: 'nor' | 'asc' | 'desc'
}
let pagedData;
let actualPage = 1;
let pages = [];
let itemsPerPage = 50;
let totalPages = 0;

function getData(type) {
  if (type) {
    url = "http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D"
  } else {
    url = "http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D"
  }

  document.getElementById("buttonAdd").disabled = false;
  document.getElementById("user-table").style.display = "block";
  document.getElementById("prompt-data").style.display = "none";

  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      if (Array.isArray(json)) {
        userData = json.map(userJson => {
          const address = new Address(
            userJson.address.streetAddress,
            userJson.address.city,
            userJson.address.state,
            userJson.address.zip
          );

          return new User(
            userJson.id,
            userJson.firstName,
            userJson.lastName,
            userJson.email,
            userJson.phone,
            address,
            userJson.description
          );
        });
        document.getElementById("spinn").style.display = "none";
        calcPageNumbers(userData.length);
        pagedData = getDataPaged(userData);
        displayUserInfo(pagedData);
      }
    });
}
function getDataPaged(data) {
  return data.slice((actualPage - 1) * itemsPerPage, (actualPage - 1) * itemsPerPage + itemsPerPage);
}

function calcPageNumbers(totalPag) {
  totalPages = Math.ceil(totalPag / itemsPerPage);
  let pagesEx = Array(7);

  if (totalPages <= 7) {
    pagesEx = Array.from({ length: totalPages }, (_, index) => index + 1);
  } else {
    pagesEx[0] = 1;
    pagesEx[6] = totalPages;
    if (actualPage >= 5 && actualPage < totalPages - 2) {
      pagesEx[1] = 0;
      pagesEx[2] = actualPage - 1;
      pagesEx[3] = actualPage;
      pagesEx[4] = actualPage + 1;
      pagesEx[5] = 0;
    } else if (actualPage > totalPages - 5) {
      pagesEx[1] = 0;
      pagesEx[2] = totalPages - 4;
      pagesEx[3] = totalPages - 3;
      pagesEx[4] = totalPages - 2;
      pagesEx[5] = totalPages - 1;
    } else {
      pagesEx[1] = 2;
      pagesEx[2] = 3;
      pagesEx[3] = 4;
      pagesEx[4] = 5;
      pagesEx[5] = 0;
    }
  }
  pages = pagesEx;
  remakePagination();
}

function duobleStep(step) {
  if (step == 1) {
    if (actualPage - 2 > 0) {
      actualPage -= 2;
      goToPage(actualPage);
    }
  } else {
    if (actualPage + 2 <= userData.length) {
      actualPage += 2;
      goToPage(actualPage);
    }
  }
  managePagination();
}

function remakePagination() {
  const paginationList = document.getElementById('pagination-list');

  const liPrev = document.createElement('li');
  liPrev.classList.add('page-item');
  const aPrev = document.createElement('a');
  aPrev.classList.add('page-link');
  aPrev.textContent = 'Previous';
  aPrev.onclick = () => goToPage(actualPage - 1);
  liPrev.appendChild(aPrev);
  paginationList.appendChild(liPrev);

  pages.forEach((pageNumber, index) => {
    const li = document.createElement('li');
    li.classList.add('page-item');

    if (pageNumber !== 0) {
      li.classList.toggle('active', pageNumber === actualPage);

      const a = document.createElement('a');
      a.classList.add('page-link');
      a.textContent = pageNumber;
      a.onclick = () => goToPage(pageNumber);
      li.appendChild(a);
    } else {
      const a = document.createElement('a');
      a.classList.add('page-link');
      a.onclick = () => duobleStep(pages[index - 1]);

      const p = document.createElement('p');
      p.textContent = '...';
      p.style.marginBottom = '0';

      a.appendChild(p);
      li.appendChild(a);
    }
    paginationList.appendChild(li);
  });

  const liNext = document.createElement('li');
  liNext.classList.add('page-item');
  const aNext = document.createElement('a');
  aNext.classList.add('page-link');
  aNext.textContent = 'Next';
  aNext.onclick = () => goToPage(actualPage + 1);
  liNext.appendChild(aNext);
  paginationList.appendChild(liNext);
}

function displayUserInfo(userData) {
  var tableBody = document.querySelector("tbody");

  userData.forEach(function (user) {
    var row = document.createElement("tr");
    row.addEventListener("click", function () {
      this.selectedUser = user;
      let data = document.getElementById("single-card");
      data.style.display = "block";

      data.querySelector("#description").textContent = user.description;
      data.querySelector("#streetAddress").textContent = user.address.streetAddress;
      data.querySelector("#city").textContent = user.address.city;
      data.querySelector("#state").textContent = user.address.state;
      data.querySelector("#zip").textContent = user.address.zip;
    });

    var idCell = document.createElement("td");
    idCell.textContent = user.id;
    row.appendChild(idCell);

    var nameCell = document.createElement("td");
    nameCell.textContent = user.firstName;
    row.appendChild(nameCell);

    var secondNameCell = document.createElement("td");
    secondNameCell.textContent = user.lastName;
    row.appendChild(secondNameCell);

    var emailCell = document.createElement("td");
    emailCell.textContent = user.email;
    row.appendChild(emailCell);

    var phoneCell = document.createElement("td");
    phoneCell.textContent = user.phone;
    row.appendChild(phoneCell);

    tableBody.appendChild(row);
  });
}


function submitForm() {

  const id = document.getElementById("id").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const streetAddress = document.getElementById("streetAddress").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const zip = document.getElementById("zip").value;
  const description = document.getElementById("description").value;

  if (!id || !firstName || !lastName || !email || !phone || !streetAddress || !city || !state || !zip) {
    alert("Please complete all the inputs.");
  } else {
    let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^\(\d{3}\)\d{3}-\d{4}$/;
    if (pattern.test(email)) {
      if (phonePattern.test(phone)) {
        const address = new Address(streetAddress, city, state, zip);

        const user = new User(id, firstName, lastName, email, phone, address, description);

        userData.push(user);

        managePagination();
        document.getElementById("user-form").style.display = "none";
        document.getElementById("user-table").style.display = "block";
      } else {
        alert("Respect patern:   (xxx)xxx-xxxx");
      }

    } else {
      alert("Put a valid email");
    }

  }
}

function showForm() {
  document.getElementById("user-form").style.display = "block";
  document.getElementById("user-table").style.display = "none";
}
function cancelAddingProces() {
  document.getElementById("user-form").style.display = "none";
  document.getElementById("user-table").style.display = "block";
}

function sortTable(field) {
  if (sortedElement.element === field) {
    sortedElement.direction = sortedElement.direction === 'asc' ? 'desc' : (sortedElement.direction == 'desc' ? 'nor' : 'asc');
  } else {
    document.getElementById(sortedElement.element + "-image").style.display = "none";
    sortedElement.element = field;
    sortedElement.direction = 'asc';
  }
  var img = document.getElementById(sortedElement.element + "-image");
  if (sortedElement.direction !== 'nor') {
    img.style.display = "inline-block";
    if (sortedElement.direction == "asc") {
      img.style.transform = "rotate(180deg)";
    } else {
      img.style.transform = "rotate(0deg)";
    }

    userData.sort((a, b) => {
      const aValue = a[sortedElement.element];
      const bValue = b[sortedElement.element];
      if (sortedElement.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    clearTable();
    pagedData = getDataPaged(userData);
    displayUserInfo(pagedData);
  } else {
    img.style.display = "none";
    clearTable();
    pagedData = getDataPaged(userData);
    displayUserInfo(pagedData);
  }
}

function clearTable() {
  var tableBody = document.querySelector("tbody");
  tableBody.innerHTML = '';
}

function clearPagination() {
  var data = document.getElementById("pagination-list");
  data.innerHTML = '';
}

function goToPage(pageNumber) {
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    actualPage = pageNumber;
  }
  managePagination();
}

function managePagination() {
  clearPagination();
  calcPageNumbers(userData.length);
  clearTable();
  pagedData = getDataPaged(userData);
  displayUserInfo(pagedData);
}
function cancelCard() {
  document.getElementById("single-card").style.display = "none";
}