
let userData = [];
let XMLuserData = [];
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
let itemsPerPage = 3;
let totalPages = 0;

function getData(type) {
  if (type) {
    url = "http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D"
  } else {
    url = "http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D"
  }

  $("#buttonAdd").prop("disabled", false);
  $("#user-table").show();
  $("#prompt-data").hide();

  $.getJSON(url, function (json) {
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
      $("#spinn").hide();
      convertToXML(userData);
      calcPageNumbers(XMLuserData.getElementsByTagName("user").length);
      pagedData = getDataPaged(XMLuserData);
      displayUserInfo(pagedData);
    }
  });
}

function convertToXML(data) {
  var xmlDoc = document.implementation.createDocument(null, 'users');

  data.forEach(user => {

    var userElement = xmlDoc.createElement('user');

    var idElement = xmlDoc.createElement('id');
    idElement.textContent = user.id;
    userElement.appendChild(idElement);

    var firstNameElement = xmlDoc.createElement('firstName');
    firstNameElement.textContent = user.firstName;
    userElement.appendChild(firstNameElement);

    var lastNameElement = xmlDoc.createElement('lastName');
    lastNameElement.textContent = user.lastName;
    userElement.appendChild(lastNameElement);

    var emailElement = xmlDoc.createElement('email');
    emailElement.textContent = user.email;
    userElement.appendChild(emailElement);

    var phoneElement = xmlDoc.createElement('phone');
    phoneElement.textContent = user.phone;
    userElement.appendChild(phoneElement);


    var addressElement = xmlDoc.createElement('address');

    var streetAddressElement = xmlDoc.createElement('streetAddress');
    streetAddressElement.textContent = user.address.streetAddress;
    addressElement.appendChild(streetAddressElement);

    var cityElement = xmlDoc.createElement('city');
    cityElement.textContent = user.address.city;
    addressElement.appendChild(cityElement);

    var stateElement = xmlDoc.createElement('state');
    stateElement.textContent = user.address.state;
    addressElement.appendChild(stateElement);

    var zipElement = xmlDoc.createElement('zip');
    zipElement.textContent = user.address.zip;
    addressElement.appendChild(zipElement);


    userElement.appendChild(addressElement);

    var descriptionElement = xmlDoc.createElement('description');
    descriptionElement.textContent = user.description;
    userElement.appendChild(descriptionElement);


    xmlDoc.documentElement.appendChild(userElement);
  });
  XMLuserData = xmlDoc;
}

function getDataPaged(data) {
  var x = data.getElementsByTagName("user");
  var userArray = Array.from(x);
  var startIndex = (actualPage - 1) * itemsPerPage;
  var endIndex = startIndex + itemsPerPage;
  var newArray = userArray.slice(startIndex, endIndex);

  return fromArrayToXML(newArray);
}

function fromArrayToXML(data) {
  var xmlString = "<users>";
  for (var i = 0; i < data.length; i++) {
    xmlString += data[i].outerHTML;
  }
  xmlString += "</users>";
  return jQuery.parseXML(xmlString);;
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
  const paginationList = $('#pagination-list');

  const liPrev = $('<li class="page-item"></li>');
  const aPrev = $('<a class="page-link">Previous</a>');
  aPrev.on('click', () => goToPage(actualPage - 1));
  liPrev.append(aPrev);
  paginationList.append(liPrev);

  pages.forEach((pageNumber, index) => {
    const li = $('<li class="page-item"></li>');

    if (pageNumber !== 0) {
      li.toggleClass('active', pageNumber === actualPage);

      const a = $('<a class="page-link"></a>');
      a.text(pageNumber);
      a.on('click', () => goToPage(pageNumber));
      li.append(a);
    } else {
      const a = $('<a class="page-link"></a>');
      a.on('click', () => doubleStep(pages[index - 1]));

      const p = $('<p>...</p>').css('margin-bottom', '0');

      a.append(p);
      li.append(a);
    }
    paginationList.append(li);
  });

  const liNext = $('<li class="page-item"></li>');
  const aNext = $('<a class="page-link">Next</a>');
  aNext.on('click', () => goToPage(actualPage + 1));
  liNext.append(aNext);
  paginationList.append(liNext);
}

function displayUserInfo(xmlData) {
  var x = xmlData.getElementsByTagName("user");
  var tableBody = $("tbody");

  for (let i = 0; i < x.length; i++) {

    var row = $("<tr></tr>");

    row.on("click", function () {
      $(this).data("selectedUser", x[i]);
      let data = $("#single-card");
      data.css("display", "block");

      let concreteData = x[i].getElementsByTagName("address")[0];
      data.find("#description").text(x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue ? x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue : "");
      data.find("#streetAddress").text(concreteData.getElementsByTagName("streetAddress")[0].childNodes[0].nodeValue);
      data.find("#city").text(concreteData.getElementsByTagName("city")[0].childNodes[0].nodeValue);
      data.find("#state").text(concreteData.getElementsByTagName("state")[0].childNodes[0].nodeValue);
      data.find("#zip").text(concreteData.getElementsByTagName("zip")[0].childNodes[0].nodeValue);
    });

    var idCell = $("<td></td>").text(x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
    row.append(idCell);

    var nameCell = $("<td></td>").text(x[i].getElementsByTagName("firstName")[0].childNodes[0].nodeValue);
    row.append(nameCell);

    var secondNameCell = $("<td></td>").text(x[i].getElementsByTagName("lastName")[0].childNodes[0].nodeValue);
    row.append(secondNameCell);

    var emailCell = $("<td></td>").text(x[i].getElementsByTagName("email")[0].childNodes[0].nodeValue);
    row.append(emailCell);

    var phoneCell = $("<td></td>").text(x[i].getElementsByTagName("phone")[0].childNodes[0].nodeValue);
    row.append(phoneCell);

    tableBody.append(row);
  }
}

function submitForm() {
  const id = $("#id").val();
  const firstName = $("#firstName").val();
  const lastName = $("#lastName").val();
  const email = $("#email").val();
  const phone = $("#phone").val();
  const streetAddress = $("#streetAddress").val();
  const city = $("#city").val();
  const state = $("#state").val();
  const zip = $("#zip").val();
  const description = $("#description").val();

  if (!id || !firstName || !lastName || !email || !phone || !streetAddress || !city || !state || !zip) {
    alert("Please complete all the inputs.");
  } else {
    let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /\(\d{3}\)\d{3}-\d{4}/;
    if (pattern.test(email)) {
      if (phonePattern.test(phone)) {
        const address = new Address(streetAddress, city, state, zip);

        const user = new User(id, firstName, lastName, email, phone, address, description);

        const xmlUser = userObjectToXMLString(user);

        XMLuserData.getElementsByTagName("users")[0].innerHTML += xmlUser;
        clearTable();
        pagedData = getDataPaged(XMLuserData);
        displayUserInfo(pagedData);
        managePagination();
        $("#user-form").hide();
        $("#user-table").show();
      } else {
        alert("Respect patern:   (xxx)xxx-xxxx");
      }

    } else {
      alert("Put a valid email");
    }
  }
}

function showForm() {
  $("#user-form").show();
  $("#user-table").hide();
}
function cancelAddingProces() {
  $("#user-form").hide();
  $("#user-table").show();
}

function sortTable(field) {
  if (sortedElement.element === field) {
    sortedElement.direction = sortedElement.direction === 'asc' ? 'desc' : (sortedElement.direction == 'desc' ? 'nor' : 'asc');
  } else {
    $("#" + sortedElement.element + "-image").hide();
    sortedElement.element = field;
    sortedElement.direction = 'asc';
  }
  var img = $("#" + sortedElement.element + "-image");
  if (sortedElement.direction !== 'nor') {
    img.show().css("display", "inline-block");
    if (sortedElement.direction == "asc") {
      img.css("transform", "rotate(180deg)");
    } else {
      img.css("transform", "rotate(0deg)");
    }

    var users = XMLuserData.getElementsByTagName("user");
    var userArray = Array.from(users);

    userArray.sort((a, b) => {
      const aValue = a.getElementsByTagName(sortedElement.element)[0].childNodes[0].nodeValue;
      const bValue = b.getElementsByTagName(sortedElement.element)[0].childNodes[0].nodeValue;

      if (sortedElement.direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    XMLuserData = fromArrayToXML(userArray);
    clearTable();
    pagedData = getDataPaged(XMLuserData);
    displayUserInfo(pagedData);
  } else {
    img.hide();
    clearTable();
    pagedData = getDataPaged(XMLuserData);
    displayUserInfo(pagedData);
  }
}
function userObjectToXMLString(userObject) {
  let xmlString = "<user>";

  for (const key in userObject) {
    if (key === "address") {
      const addressObject = userObject[key];
      xmlString += "<address>";
      for (const addressKey in addressObject) {
        xmlString += `<${addressKey}>${addressObject[addressKey]}</${addressKey}>`;
      }
      xmlString += "</address>";
    } else {
      xmlString += `<${key}>${userObject[key]}</${key}>`;
    }
  }

  xmlString += "</user>";

  return xmlString;
}

function clearTable() {
  $("tbody").empty();
}

function clearPagination() {
  $("#pagination-list").empty();
}

function goToPage(pageNumber) {
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    actualPage = pageNumber;
  }
  managePagination();
}

function managePagination() {
  clearPagination();
  clearTable();
  calcPageNumbers(XMLuserData.getElementsByTagName("user").length);
  pagedData = getDataPaged(XMLuserData);
  displayUserInfo(pagedData);
}
function cancelCard() {
  $("#single-card").hide();
}