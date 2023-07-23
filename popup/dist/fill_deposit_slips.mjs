function E(t) {
  const i = {
    Reason: {
      input: document.getElementById("note"),
      type: "input"
    },
    Amount: {
      input: document.getElementById("amount"),
      type: "input"
    },
    DateFrom: {
      input: document.getElementById("taxation_date_from"),
      type: "input"
    },
    DateTo: {
      input: document.getElementById("taxation_date_to"),
      type: "input"
    },
    BankNumber: {
      input: document.querySelectorAll('[data-origin="beneficiary_account"]'),
      type: "node"
    },
    BudgetNumber: {
      input: document.querySelectorAll('[data-origin="budgetary_unit"]'),
      type: "node"
    },
    CallNumber: {
      input: document.querySelectorAll('[data-origin="payee_tax_ref_no"]'),
      type: "node"
    },
    Municipality: {
      input: document.getElementById("municipality"),
      type: "select",
      name: "municipality"
    },
    PaymentType: {
      input: document.getElementById("payment_type"),
      type: "select",
      name: "payment_type"
    },
    RevenueType: {
      input: document.getElementById("type_of_revenue"),
      type: "select",
      name: "type_of_revenue"
    }
  };
  Object.keys(i).forEach((n) => {
    const a = n, e = i[a], l = t[a];
    if (e != null && e.input && l)
      switch (e.type) {
        case "input":
          e.input.value = l;
          break;
        case "node":
          const b = l.split("");
          for (let o = 0; o < e.input.length; o++) {
            const u = e.input[o];
            u.value = b[o];
          }
          break;
        case "select":
          const m = e.input.options;
          for (let o = 0; o < m.length; o++) {
            const u = m[o];
            if (u.value.toLowerCase() === l.toLowerCase()) {
              const y = document.getElementById(`select2-${e.name}-container`);
              y && (y.innerHTML = e.name === "payment_type" ? u.innerHTML : u.value), u.selected = !0;
              break;
            }
          }
          break;
      }
  });
}
const s = document.getElementById("upload_txt_file"), r = document.getElementById("fill_button"), p = document.getElementById("error_message"), g = document.getElementById("upload_txt_label"), f = new Go();
let c;
function d(t) {
  p && (p.innerText = t || "", p.style.display = t ? "block" : "none");
}
function _() {
  d(void 0);
}
r == null || r.addEventListener("click", async function() {
  const [t] = await chrome.tabs.query({ active: !0 });
  WebAssembly.instantiateStreaming(fetch("./wasm/fill_deposit_slips.wasm"), f.importObject).then((i) => {
    if (!c) {
      d("Please upload a file first");
      return;
    }
    _(), f.run(i.instance);
    const n = getDepositSlipOutput(c);
    if (typeof n == "string") {
      d(n);
      return;
    }
    t.id && chrome.scripting.executeScript(
      {
        target: { tabId: t.id },
        args: [n.PioMio],
        func: E
      },
      function(a) {
        console.log("-------results-------"), console.log(a), console.log(`-------results-------
`);
      }
    );
  });
});
s == null || s.addEventListener("change", function(t) {
  if (t.target && t.target instanceof HTMLInputElement && t.target.files) {
    const i = t.target.files[0], n = new FileReader();
    n.onload = function(a) {
      var e;
      c = (e = a.target) == null ? void 0 : e.result, c && g && (_(), g.innerHTML = i.name);
    }, n.readAsText(i);
  }
});
