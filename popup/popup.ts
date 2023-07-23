import { fillInputs } from './fill_inputs';

const inputFile = document.getElementById('upload_txt_file');
const fillButton = document.getElementById('fill_button');
const errorMessage = document.getElementById('error_message');
const uploadTextLabel = document.getElementById('upload_txt_label');

const go = new Go();

let txtFile: string;

function toggleErrorMessage(message: string | undefined) {
  if (errorMessage) {
    errorMessage.innerText = message || '';
    errorMessage.style.display = message ? 'block' : 'none';
  }
}

function clearErrorMessage() {
  toggleErrorMessage(undefined);
}

fillButton?.addEventListener('click', async function () {
  const [tab] = await chrome.tabs.query({ active: true });

  WebAssembly.instantiateStreaming(fetch('./wasm/fill_deposit_slips.wasm'), go.importObject).then((result) => {
    if (!txtFile) {
      toggleErrorMessage('Please upload a file first');
      return;
    }

    clearErrorMessage();

    go.run(result.instance);
    const depositSlipOutput = getDepositSlipOutput(txtFile);

    if (typeof depositSlipOutput === 'string') {
      toggleErrorMessage(depositSlipOutput);
      return;
    }

    if (tab.id) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          args: [depositSlipOutput.PioMio],
          func: fillInputs,
        },
        function (results) {
          console.log('-------results-------');
          console.log(results);
          console.log('-------results-------\n');
        },
      );
    }
  });
});

inputFile?.addEventListener('change', function (e) {
  if (e.target && e.target instanceof HTMLInputElement && e.target.files) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      txtFile = e.target?.result as string;

      if (txtFile && uploadTextLabel) {
        clearErrorMessage();
        uploadTextLabel.innerHTML = file.name;
      }
    };

    reader.readAsText(file);
  }
});
