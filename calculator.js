// My remake of the iPhone calculator in vanilla JS
//
// by Wanjiru Njuguna
//
// August 2023
//
//  https://github.com/wanjiru-njuguna/iPhone-Calc
//


//Global variables
const maximumdisplay = 9; // maximum digits displayed on the calculator's screen.

let previousnumber = '';        //Number previously displayed
let currentnumber = '';         //Number currently displayed in the readout
let operatorsclicked = false;   //true if any operator button was previously clicked
let dualoperatorclicked ='';    // to store the dual opeartaor that the user clicks.
let rptequalpreviousno = null;  // to store previous number when the equal button is clicked multiple times.
let operationalstate = 0;       //0=default, 1=overflowed; 2=division-by-zero









//an array of the button ids for the calculator
const button_ids = ["clear", "additional", "remainder","division", "seven", "eight", 'nine', 'multiply', 'four', 'five', 'six', 'subtraction', 'one', 'two', 'three', 'addition', 'zero', 'decimal', 'equals'];

//Setting up click events for the calc buttons
for(let i = 0; i < button_ids.length; i++ )
{
    let digit = document.getElementById(button_ids[i]);
    //adding a click event listener to the button
    digit.addEventListener("click", buttonclicked); 
}




//Setting up a global keypress event
document.addEventListener("keypress", keypressed);




//Reset the readout
resetthedisplay();





//This function is called when any button is clicked
function buttonclicked(event)
{
    let whatwasclicked = event.target.innerHTML;

    mainbuttonlogic(whatwasclicked);
}






//This function is called when any key is pressed on the keyboard
function keypressed(event)
{
    //Select which key was pressed
    let keystroked = event.key;

    //Decide if the key is acceptable
    if(checkfordigits(keystroked) === true || 
        checkforoperators(keystroked)=== true)
    {
        mainbuttonlogic(keystroked);
    }
}



//Main button logic for a click or a keyboard keystroke
//'btn' = is what was clicked or pressed 
function mainbuttonlogic(btn)
{
    if (btn == 'AC') 
    {
        //Reset button
        resetthedisplay();
    }
    
    //Check operational-state
    if(operationalstate != 0)
    {
        //Don't do anything if we overflowed, or if previous result is division by zero
        return;
    }
    

    //Separate digits from anything else
    if(checkfordigits(btn) == true)
    {
        //Processing of a digit
        if(operatorsclicked == true)
        {
            currentnumber = '';
            operatorsclicked = false;

            // change back the color to default.
            changeoperatorcolor(null);
        }


        if(calculatedigits(currentnumber) < maximumdisplay)
        {
            currentnumber += '' + btn;

            document.getElementById("idReadout").innerText = currentnumber;
        }
        
    }
    else if(checkfordualoperators(btn) == true)
    {
        //Processing of a dual operator, ex: 2+3, 5-5, etc.
        if(currentnumber != '')
        {
            previousnumber = currentnumber;
            operatorsclicked = true;
        }
        
        
        rptequalpreviousno = null;



        const btnid = changetexttoid(btn);

        // highlights the operator when clicked.

        changeoperatorcolor(btnid);

        dualoperatorclicked = btn;


        



    }
    else if(checkforperiod(btn)== true)
    {

        if ((checkforperiodincurrentno(currentnumber)== false)
             && (calculatedigits(currentnumber) < maximumdisplay))
        {   
            if(currentnumber === '')
            {
                currentnumber = '0'+ btn;
                document.getElementById("idReadout").innerText = currentnumber;
            }
            else
            {
                currentnumber += ''+ btn;
                document.getElementById("idReadout").innerText = currentnumber;
            }
        }
        
    }
    else if((btn == '+/-') && (currentnumber != ''))
    {
        currentnumber = changenotonegativeandpositive(currentnumber);
        document.getElementById("idReadout").innerText = currentnumber;
    }
    else if (btn == '=')
    {
        let result;
        if(rptequalpreviousno === null)
        {
            result = carryoutopeartions(previousnumber, dualoperatorclicked, currentnumber);
            result = checkforoverflow(result);

        
        }
        else
        {
            //Repeated = button press
            result = carryoutopeartions(currentnumber, dualoperatorclicked, rptequalpreviousno);
            result = checkforoverflow(result);


        }
        document.getElementById("idReadout").innerText = limitdisplaysize(result);
        
        if(rptequalpreviousno === null)
        {
            rptequalpreviousno = currentnumber;
        }

        previousnumber = currentnumber; // updating previous number
        currentnumber = result; // updating current number

        

    }
    else if (btn == '%')
    {
        let result = findthepercentage(currentnumber);
        result = checkforoverflow(result);

        document.getElementById("idReadout").innerText = limitdisplaysize(result);
        
        currentnumber = result
    }


   
}




//Checks if 'key' is a digit.
//RETURN: true if yes
function checkfordigits(key)
{
    switch(key)
    {
        case '0':
        case '1':
        case '2':
        case '3': 
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            return true;  
    
    }
    return false;
}





//Checks if 'key' is an operator that requires two values. Ex: 2+3
//RETURN: true if yes
function checkfordualoperators(key)
{
    switch(key)
    {
        case '/':
        case '*':
        case '-':
        case '+':
            return true;
    }

    return false;
}




//Checks if 'key' is any operator
//RETURN: true if yes
function checkforoperators(key)
{
    if(checkfordualoperators(key))
    {
        return true;
    }

    switch(key)
    {
        case '%':
        case '=':
        case '+/-':
        case '.':
            return true;
    }

    return false;
}






function changeoperatorcolor(btnid)
{
    const operatorbtns = ["division", "multiply", "subtraction", "addition"];
    for(let i = 0; i < operatorbtns.length; i++)
    {
        const btn = document.getElementById(operatorbtns[i]);
        if(btnid == operatorbtns[i])
        {
            btn.className = "highlightedoperators";
        }
       else 
       {
            btn.className = "operators";
       }

    }


}
 function changetexttoid(text)
 {
    let id = '';
    switch(text)
    {
        case "AC":
        id = "clear";
        break;

        case "+/-":
        id = "additional";
        break;

        case "7":
        id = "seven";
        break;

        case "8":
        id = "eight";
        break;

        case "9":
        id = "nine";
        break;

        case "*":
        id = "multiply";
        break;

        case "/":
        id = "division";
        break;
       
        case "4":
        id = "four";
        break;

        case "5":
        id = "five";
        break;

        case "6":
        id = "six";
        break;

        case "-":
        id = "subtraction";
        break;

        case "1":
        id = "one";
        break;

        case "2":
        id = "two";
        break;
        
        case "3":
        id = "three";
        break;

        case "+":
        id = "addition";
        break;

        case "0":
        id = "zero";
        break;

        case ".":
        id = "decimal";
        break;

        case "=":
        id = "equals";
        break;

        case "%":
        id = "remainder";
        break;
              
    }
    return id;

 }

 function checkforperiod(btn)
 {
    if(btn === '.')
    {
        return true;
    }
    return false;

 }
 function checkforperiodincurrentno(currentno)
 {
    if (currentno.includes('.'))
    {
        return true;
    }
    return false;
 }

function calculatedigits(displayedno)
{
    let numbercount = 0;
    displayedno = displayedno.toString();
    for(let i = 0; i < displayedno.length; i++)
    {
        if(checkfordigits(displayedno[i]) == true)
        {
            numbercount++;
        }

    }
    return numbercount;
}

function changenotonegativeandpositive(currentno)
{
    if(currentno.length == 0)
    {
        return currentno;
    }
    
    if(currentno[0] != '-')
    {
        currentno = '-' + currentno
        return currentno;
        
    }
    else
    {
       currentno = currentno.substr(1, currentno.length);
       return currentno;
    }

}


function carryoutopeartions(value1, operator, value2)
{
    value1 = Number(value1);
    value2 = Number(value2);
    let result = "";

    if(operator == '+')
    {
        result = value1 + value2;
       
    }
    else if (operator == '-')
    {
        result = value1 - value2;
    }
    else if (operator == '*')
    {
        result = value1 * value2;
    }
    else if (operator == '/')
    {
        if(value2 !== 0)
        {
            result = value1 / value2;
        }
        else
        {
            //Division by zero - error
            result = 'Error';
            operationalstate = 2;
        }
    }
    
    return result;

}

function findthepercentage(currentno)
{
    let result = '';
    currentno = Number(currentno);
    result = currentno /100;
    
    return result;
}

function resetthedisplay()
{  
    document.getElementById("idReadout").innerText = '0';
    currentnumber = '';
    previousnumber = '';
    operatorsclicked = false;
    dualoperatorclicked = '';
    rptequalpreviousno = null;
    operationalstate = 0;

    // change back the color to default.
    changeoperatorcolor(null);

}

function limitdisplaysize(result)
{
   let displayedresultcount = calculatedigits(result);
    if(displayedresultcount > maximumdisplay)
    {
        result = result.toString();
        result = result.slice(0,maximumdisplay+1);
        operationalstate = 0;
    }

    return result;
}

function checkforoverflow(result)
{
    if((result < -999999999) ||(result > 999999999))
    {
        result = 'Overflowed';
        operationalstate = 1;

    }
    return result;
}


 

