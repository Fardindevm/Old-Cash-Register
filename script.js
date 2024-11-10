const CURRENCY_UNITS = {
  'ONE HUNDRED': 100,
  'TWENTY': 20,
  'TEN': 10,
  'FIVE': 5,
  'ONE': 1,
  'QUARTER': 0.25,
  'DIME': 0.1,
  'NICKEL': 0.05,
  'PENNY': 0.01
};

const changeDiv = document.getElementById("change-due");
const cashInfo = document.getElementById("cash-info");
const input = document.getElementById("cash");
const btn = document.getElementById("purchase-btn");
const price = 1.87;

let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

class CashRegister {
  constructor(initialDrawer) {
    this.drawer = initialDrawer;
    this.status = "OPEN";
  }

  calculateChange(price, cash) {
    let changeDue = parseFloat((cash - price).toFixed(2));
    let change = [];
    let totalAvailable = this.getTotalCash();

    if (changeDue === 0) {
      return { status: "CLOSED", change: [] };
    }

    if (changeDue > totalAvailable) {
      return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    let sortedDrawer = [...this.drawer].sort((a, b) => CURRENCY_UNITS[b[0]] - CURRENCY_UNITS[a[0]]);

    for (let [denomination, available] of sortedDrawer) {
      let value = CURRENCY_UNITS[denomination];
      let amount = 0;

      while (changeDue >= value && available > 0) {
        changeDue = parseFloat((changeDue - value).toFixed(2));
        available -= value;
        amount += value;
      }

      if (amount > 0) {
        change.push([denomination, amount]);
      }
    }

    if (changeDue > 0) {
      return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    return {
      status: this.getTotalCash() === 0 ? "CLOSED" : "OPEN",
      change: change
    };
  }

  getTotalCash() {
    return parseFloat(this.drawer.reduce((sum, [_, amount]) => sum + amount, 0).toFixed(2));
  }
}

function update() {
  cashInfo.innerHTML = '';

  cid.forEach(([name, amount]) => {
    const drawerItem = document.createElement("p");
    drawerItem.id = name.toLowerCase().replace(/\s+/g, '-');
    drawerItem.className = "lo";
    drawerItem.textContent = `${name}: $${amount.toFixed(2)}`;
    cashInfo.appendChild(drawerItem);
  });
}

function createElement(text) {
  const p = document.createElement("p");
  p.textContent = text;
  p.className = "jsP";
  changeDiv.appendChild(p);
}

function handlePurchase() {
  const cashInput = parseFloat(input.value);
  if (!cashInput) {
    changeDiv.innerHTML = `<p class="jsP">You forgot your wallet?</p>`;
    return;
  }

  if (cashInput < price) {
    alert("Customer does not have enough money to purchase the item.");
    changeDiv.innerHTML = "";
    return;
  }

  const register = new CashRegister(cid);
  const result = register.calculateChange(price, cashInput);

  if (result.status !== "INSUFFICIENT_FUNDS") {
    result.change.forEach(([denomination, amount]) => {
      const drawerIndex = cid.findIndex(([name]) => name === denomination);
      if (drawerIndex !== -1) {
        cid[drawerIndex][1] = parseFloat((cid[drawerIndex][1] - amount).toFixed(2));
      }
    });
    update();
  }

  displayChange(result);
  input.value = "";
}

function displayChange(result) {
  changeDiv.innerHTML = "";
  createElement(`Status: ${result.status}`);

  if (result.status === "INSUFFICIENT_FUNDS") {
    return;
  }

  if (result.change.length === 0) {
    changeDiv.innerHTML = "No change due - customer paid with exact cash";
    return;
  }

  result.change.forEach(([denomination, amount]) => {
    const changeElement = document.createElement("p");
    changeElement.textContent = `${denomination}: $${amount.toFixed(2)}`;
    changeDiv.appendChild(changeElement);
  });
}

btn.addEventListener("click", handlePurchase);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handlePurchase();
  }
});

window.onload = update;
