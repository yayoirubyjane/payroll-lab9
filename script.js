const empNameInput = document.getElementById("empName");
const hoursInput = document.getElementById("hours");
const rateInput = document.getElementById("rate");
const taxInput = document.getElementById("tax");
const otherDedInput = document.getElementById("otherDed");

const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const tableBody = document.getElementById("payrollTbody");

submitBtn.addEventListener('click', ()=> {
    let empName = empName.value;
    let hours = hours.value;
    let rate = rate.value;
    let tax = tax.value;
    let otherDed = otherDed.value;

    let gross =  hours * rate;
    let taxDeduction = gross * (tax / 100);
    let netPay = gross - taxDeduction - otherDed;




})

