let numbers = new Array(100);

let doc = document.getElementById("numbers");
console.log(numbers.length);

for (let i = 0; i < 102; i++) {

    numbers[i] = i;// Math.floor(Math.random() * 100) + 1;
    let card = document.createElement("div");

    card.classList.add("cont");
    if (isPrime(numbers[i])) {
        card.classList.add("prime");
    } else if (numbers[i] % 2 == 0) {
        card.classList.add("odd");
    } else {
        card.classList.add("even");
    }
    card.innerHTML = numbers[i];
    doc.appendChild(card);
}


function isPrime(number) {
    if (number <= 1) {
        return false;
    }

    for (let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) {
            return false;
        }
    }

    return true;
}