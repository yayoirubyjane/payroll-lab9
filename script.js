const empName = document.getElementById("empName");
const hours = document.getElementById("hours");
const rate = document.getElementById("rate");
const tax = document.getElementById("tax");
const otherDed = document.getElementById("otherDed");

const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const tableBody = document.getElementById("payrollTbody");
const payrollForm = document.getElementById("payrollForm")

let editingRow = null;

payrollForm.addEventListener('submit', (e)=> {
    e.preventDefault();

    let name = empName.value;
    let hoursWorked = parseFloat(hours.value)
    let hourlyRate = parseFloat(rate.value);
    let taxPercent = parseFloat(tax.value);
    let otherDeductions = parseFloat(otherDed.value);

    let gross =  hoursWorked * hourlyRate;
    let taxDeduction = gross * (taxPercent / 100);
    let netPay = gross - taxDeduction - otherDeductions;

    if (editingRow) {
        let cells = editingRow.getElementsByTagName('td');
        let rowNum = cells[0].textContent;

        editingRow.innerHTML = `
        <td>${rowNum}</td>
        <td>${name}</td>
        <td>${hoursWorked}</td>
        <td>₱${hourlyRate.toFixed(2)}</td>
        <td>₱${gross.toFixed(2)}</td>
        <td>₱${taxDeduction.toFixed(2)}</td>
        <td>₱${otherDeductions.toFixed(2)}</td>
        <td>₱${netPay.toFixed(2)}</td>
        <td>
            <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</Button>
        </td>
        `;

        editingRow = null;
        submitBtn.textContent = 'Add Payroll';
    } else {
        let newRow = document.createElement('tr');
        let rowNum = tableBody.children.length + 1;

        newRow.innerHTML = `
        <td>${rowNum}</td>
        <td>${name}</td>
        <td>${hoursWorked}</td>
        <td>₱${hourlyRate.toFixed(2)}</td>
        <td>₱${gross.toFixed(2)}</td>
        <td>₱${taxDeduction.toFixed(2)}</td>
        <td>₱${otherDeductions.toFixed(2)}</td>
        <td>₱${netPay.toFixed(2)}</td>
        <td>
            <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</Button>
        </td>
        `;

        tableBody.appendChild(newRow);
    }
    updateSummaries();
    payrollForm.reset();
});

function updateSummaries() {
    let rows = tableBody.getElementsByTagName('tr');
    let totalEmployees = rows.length;
    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;

    // loop through each row and sum up values
    for (let row of rows) {
        let cells = row.getElementsByTagName('td');
        
        totalGross += parseFloat(cells[4].textContent.replace('₱', ''));
        totalDeductions += parseFloat(cells[5].textContent.replace('₱', '')) +
                            parseFloat(cells[6].textContent.replace('₱', ''));
        totalNet += parseFloat(cells[7].textContent.replace('₱', ''))
    }

    // update the summary display
    document.getElementById('sumEmployees').textContent = totalEmployees;
    document.getElementById('sumGross').textContent = `₱${totalGross.toFixed(2)}`;
    document.getElementById('sumDed').textContent = `₱${totalDeductions.toFixed(2)}`;
    document.getElementById('sumNet').textContent = `₱${totalNet.toFixed(2)}`;
}

tableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('deleteBtn')) {
        let row = e.target.closest('tr');
        row.remove();
        renumberRows();
        updateSummaries();

        if (editingRow == row) {
            editingRow = null;
            submitBtn.textContent = 'Add Payroll';
            payrollForm.reset();
        }
    }

    if (e.target.classList.contains('editBtn')) {
        let row = e.target.closest('tr');
        let cells = row.getElementsByTagName('td');

        empName.value = cells[1].textContent;
        hours.value = cells[2].textContent;
        rate.value = cells[3].textContent.replace('₱', '');
        tax.value = calculateTaxPercentFromRow(cells);
        otherDed.value = cells[6].textContent.replace('₱', '');
        
        editingRow = row;
        submitBtn.textContent = 'Update Payroll'; 
        
        payrollForm.scrollIntoView({ behavior: 'smooth' });
    }
});

function renumberRows() {
    let rows = tableBody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        rows[i].getElementsByTagName('td')[0].textContent = i + 1;
    }
}

resetBtn.addEventListener('click', () => {
    payrollForm.reset();

    if (editingRow) {
        editingRow = null;
        submitBtn.textContent = 'Add Payroll';
    }
});

const clearAllBtn = document.getElementById('clearAllBtn');
clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all payroll records?')) {
        tableBody.innerHTML = '';
        updateSummaries();
    }
});

function calculateTaxPercentFromRow(cells) {
    // cells[4] is Gross, cells[5] is Tax amount
    let gross = parseFloat(cells[4].textContent.replace('₱', ''));
    let taxAmount = parseFloat(cells[5].textContent.replace('₱', ''));
    
    if (gross === 0) return 0;
    
    let taxPercent = (taxAmount / gross) * 100;
    return taxPercent.toFixed(2);
}