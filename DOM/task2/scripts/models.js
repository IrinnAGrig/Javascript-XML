

class User {
    constructor(id, firstName, lastName, email, phone, address, description) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.description = description;
    }
}

class Address {
    constructor(streetAddress, city, state, zip) {
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.zip = zip;
    }
}
