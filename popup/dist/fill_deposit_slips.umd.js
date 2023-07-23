(function(c){typeof define=="function"&&define.amd?define(c):c()})(function(){"use strict";function c(t){const i={Reason:{input:document.getElementById("note"),type:"input"},Amount:{input:document.getElementById("amount"),type:"input"},DateFrom:{input:document.getElementById("taxation_date_from"),type:"input"},DateTo:{input:document.getElementById("taxation_date_to"),type:"input"},BankNumber:{input:document.querySelectorAll('[data-origin="beneficiary_account"]'),type:"node"},BudgetNumber:{input:document.querySelectorAll('[data-origin="budgetary_unit"]'),type:"node"},CallNumber:{input:document.querySelectorAll('[data-origin="payee_tax_ref_no"]'),type:"node"},Municipality:{input:document.getElementById("municipality"),type:"select",name:"municipality"},PaymentType:{input:document.getElementById("payment_type"),type:"select",name:"payment_type"},RevenueType:{input:document.getElementById("type_of_revenue"),type:"select",name:"type_of_revenue"}};Object.keys(i).forEach(n=>{const a=n,e=i[a],s=t[a];if(e!=null&&e.input&&s)switch(e.type){case"input":e.input.value=s;break;case"node":const E=s.split("");for(let o=0;o<e.input.length;o++){const u=e.input[o];u.value=E[o]}break;case"select":const _=e.input.options;for(let o=0;o<_.length;o++){const u=_[o];if(u.value.toLowerCase()===s.toLowerCase()){const b=document.getElementById(`select2-${e.name}-container`);b&&(b.innerHTML=e.name==="payment_type"?u.innerHTML:u.value),u.selected=!0;break}}break}})}const r=document.getElementById("upload_txt_file"),p=document.getElementById("fill_button"),d=document.getElementById("error_message"),y=document.getElementById("upload_txt_label"),f=new Go;let l;function m(t){d&&(d.innerText=t||"",d.style.display=t?"block":"none")}function g(){m(void 0)}p==null||p.addEventListener("click",async function(){const[t]=await chrome.tabs.query({active:!0});WebAssembly.instantiateStreaming(fetch("./wasm/fill_deposit_slips.wasm"),f.importObject).then(i=>{if(!l){m("Please upload a file first");return}g(),f.run(i.instance);const n=getDepositSlipOutput(l);if(typeof n=="string"){m(n);return}t.id&&chrome.scripting.executeScript({target:{tabId:t.id},args:[n.PioMio],func:c},function(a){console.log("-------results-------"),console.log(a),console.log(`-------results-------
`)})})}),r==null||r.addEventListener("change",function(t){if(t.target&&t.target instanceof HTMLInputElement&&t.target.files){const i=t.target.files[0],n=new FileReader;n.onload=function(a){var e;l=(e=a.target)==null?void 0:e.result,l&&y&&(g(),y.innerHTML=i.name)},n.readAsText(i)}})});