const calculator = [['(', ')', '<-', 'AC'],
                    ['7', '8', '9', '/'],
                    ['4', '5', '6', 'x'],
                    ['1', '2', '3', '-'],
                    ['0', '.', '=', '+'],
                    ];

let table = document.querySelector('table');
let ecuation = document.getElementById('ecuation');
let result = document.getElementById('result');

var currentTextDysplayed = "0";
ecuation.textContent = currentTextDysplayed;
result.textContent = " ";
let operations = [];
let reservedOperations = [];
let operators = ['+', '/', '*'];
var afterEgal = false;

calculator.forEach(data => {
    const row = document.createElement('tr');

    data.forEach(column => {
        const cell = document.createElement('td');
        cell.textContent = column;
        cell.addEventListener('click', () => managePressedKey(column))
        row.appendChild(cell);
    });
    table.appendChild(row);
});


function managePressedKey(key){
    switch(key){
        case '<-': operations.length != 0 ? ( afterEgal ? operations = [] : operations.pop(key)) : '';break;
        case 'AC': operations.length = 0; result.textContent = ""; break;
        case '0': operations.length != 0 ? operations.push(key) : ""; break;
        case '(': !isNaN(operations[operations.length-1]) || operations[operations.length-1] == ')'  ? operations.push('*', key) : operations.push(key); break;
        case ')': operations.push(key); break;
        case '-': manageMinus(); break;
        case '+': manageOperator('+'); break;
        case '/': manageOperator('/'); break;
        case 'x': manageOperator('*'); break;
        case '.': managePoint(); break;
        case '=': evaluateExpresion(); break;
        default: {
                if(operations[operations.length-1] == ')'){
                    operations.push('*', key)
                }else if ((afterEgal && !isNaN(operations[operations.length - 1])) || (afterEgal && !'.+-*/()'.includes(operations[operations.length - 1]))){
                    operations = [];
                    operations.push(key);
                    afterEgal = false;
                } else {
                    operations.push(key);
                }}
                
                break;
    }

    if(key != '='){
        fromOperationsToText();
        
        ecuation.textContent =  currentTextDysplayed;
    }else{
        reservedOperations = operations;
        operations = [];
        currentTextDysplayed.toString().split('').forEach(char => {
            operations.push(char);
        });
        afterEgal = true;
    }
}

function evaluateExpresion(){
    if(operations.length != 0){
        try{
            var expression = "";
            let openParantheses = 0;
            let closedParantheses = 0;
            if('+-*/'.includes(operations[operations.length - 1])){
                operations.pop();
            }
            for(let k = 0; k< operations.length; k++){
                if(isNaN(operations[k-1]) && isNaN(operations[k+1]) && operations[k] =='.'){
                    expression += "0";
                }else{
                    if(operations[k] == '('){
                        openParantheses++;
                        closedParantheses--;
                    }else if(operations[k] == ')'){
                        if(openParantheses > 0){
                            openParantheses--;
                        }else{
                            closedParantheses++;
                        }
                    }
                    expression += operations[k];
                }
            }
            expression += ')'.repeat(openParantheses);
            if(closedParantheses > 0){
                expression = '('.repeat(closedParantheses) + expression;
            }

            ecuation.textContent = expression + ')'.repeat(openParantheses) + "=";
            console.log(expression);
            let temp = eval(expression);
            console.log(expression);
            if (!isFinite(temp)) {
                result.textContent = "= Can't divide by 0";
            }else{
                try{
                    if (temp && temp.toString().split('.')[1].length > 8 && temp % 1 === 0) {
                        temp = parseFloat(temp.toFixed(8)).toString();
                    } else {
                       
                        if (temp && temp.toString().length > 10) {
                            temp = parseFloat(temp.toFixed(8)).toString();
                        } else {
                            temp = temp.toString(); 
                        }
                    }
                }catch{
                    result.textContent = "= AltaEroare";
                }

                currentTextDysplayed = temp;
                result.textContent = '= ' + currentTextDysplayed.toString();
            }
            
        }catch(e){
            result.textContent = "= Eroare";
        };
     
    }
}
function manageMinus(){
    if(operations.length != 0){
        if(operators.includes(operations[operations.length - 1])){
            operations.push('(');
            operations.push('-');
        }else if(operations[operations.length - 1] != '-'){
            operations.push('-');
        }
    }else{
        operations.push('-');
    }
}
function manageOperator(op){
    if(operations.length != 0 ){
        if(afterEgal){
            operations.push(op);
            afterEgal = false;
        }else{
            if(operators.includes(operations[operations.length - 1])){
                operations[operations.length - 1] = op;
            }else if(operations[operations.length - 1] != '(' ){
                if(operations[operations.length - 1] == '-'){
                    operations.pop();
                    operations.push(op);
                }else{
                    operations.push(op);
                    //console.log(afterEgal);
                }
            }
        }
    }else{
        operations.push('0',op);  ;
    }
}
function managePoint(){
    currentText = currentTextDysplayed.toString();
    if(operations.length != 0){
        if(operations[operations.length - 1] != '.'){
            if(operators.includes(operations[operations.length - 1])){
                operations.push('.');
            }else{
                const regex = /(\d*\.\d+|\d+\.\d*)/g;
                const matches = currentText.match(regex);

                if (matches && matches.length > 0) {
                    const lastMatchIndex = currentText.lastIndexOf(matches[matches.length - 1]);
                    if (lastMatchIndex !== currentText.length - matches[matches.length - 1].length) {
                        operations.push('.');
                    } 
                } else {
                    operations.push('.');
                }
            }
        }
    }else{
        operations.push('0','.');  ;
    }
}
function fromOperationsToText(){
    if(operations.length == 0){
        currentTextDysplayed = "0";
    }else{
        currentTextDysplayed = "";
        for(let k in operations){
            currentTextDysplayed += operations[k];
        }
    }
}