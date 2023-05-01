
import { SigningCosmosClient } from '@cosmjs/launchpad'
import {
    DirectSecp256k1HdWallet
} from '@cosmjs/proto-signing'

import {
    assertIsBroadcastTxSuccess,
    SigningStargateClient,
} from '@cosmjs/stargate'

let isWalletConnected = false;
document.getElementById("connect").addEventListener("click", async () => {
  async function add() {
    if (!window.keplr) {
      alert("Please install Keplr extension");
    } else {
      if (window.keplr.experimentalSuggestChain) {
        try {
          await window.keplr.experimentalSuggestChain({
            chainId: "blockspacerace-0",
            chainName: "Blockspace Race Testnet",
            rpc: "https://rpc-blockspacerace.pops.one",
            rest: "https://api-blockspacerace.pops.one",
            bip44: {
              coinType: 118,
            },
            bech32Config: {
              bech32PrefixAccAddr: "celestia",
              bech32PrefixAccPub: "celestia" + "pub",
              bech32PrefixValAddr: "celestia" + "valoper",
              bech32PrefixValPub: "celestia" + "valoperpub",
              bech32PrefixConsAddr: "celestia" + "valcons",
              bech32PrefixConsPub: "celestia" + "valconspub",
            },
            currencies: [
              {
                coinDenom: "TIA",
                coinMinimalDenom: "utia",
                coinDecimals: 6,
                coinGeckoId: "celestia",
              },
            ],
            feeCurrencies: [
              {
                coinDenom: "TIA",
                coinMinimalDenom: "utia",
                coinDecimals: 6,
                coinGeckoId: "celestia",
                gasPriceStep: {
                  low: 0.01,
                  average: 0.025,
                  high: 0.04,
                },
              },
            ],
            stakeCurrency: {
              coinDenom: "TIA",
              coinMinimalDenom: "utia",
              coinDecimals: 6,
              coinGeckoId: "celestia",
            },
          });
        } catch (error) {
          console.error("Failed to suggest the chain", error);
          alert("Failed to suggest the chain");
        }
      }
      const chainId = "blockspacerace-0";
      // Enabling before using the Keplr is recommended.
      // This method will ask the user whether to allow access if they haven't visited this website.
      // Also, it will request that the user unlock the wallet if the wallet is locked.
      await window.keplr.enable(chainId);
      const offlineSigner = window.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      const address = accounts[0].address;
      // Display the address on the page
      const resultElement = document.getElementById("connected-address");
      resultElement.innerText = `Connected: ${address}`;
    }
  }
  
  await add();
  isWalletConnected = true;
});

async function submitPFBRequest(apiUrl, requestBody, retries = 200, delay = 4000) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error ${response.status}: ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error) {
        if (retries > 0) {
            console.warn(`Error: ${error.message}. Retrying in ${delay} ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return submitPFBRequest(apiUrl, requestBody, retries - 1, delay);
        } else {
            throw new Error(`Failed to submit request after ${retries} retries: ${error.message}`);
        }
    }
}

// Store the transaction state in sessionStorage
function updateSessionStorage(txHashTransfer = '', txHashPFB = '') {
    window.sessionStorage.setItem('txHashTransfer', txHashTransfer);
    window.sessionStorage.setItem('txHashPFB', txHashPFB);
}

// Get the transaction state from sessionStorage
function getSessionStorage() {
    return {
        txHashTransfer: window.sessionStorage.getItem('txHashTransfer') || '',
        txHashPFB: window.sessionStorage.getItem('txHashPFB') || '',
    };
}

// Update the UI with the transaction state
function updateUI(txHashTransfer, txHashPFB) {
    document.getElementById("txHashTransfer").innerHTML = txHashTransfer || '<img src="images/spinner.gif" alt="Loading..." width="16" height="16">';
    document.getElementById("txHashPFB").innerHTML = txHashPFB || '<img src="images/spinner.gif" alt="Loading..." width="16" height="16">';
}

// Initialize the UI with sessionStorage data
document.addEventListener("DOMContentLoaded", () => {
    const { txHashTransfer, txHashPFB } = getSessionStorage();
    updateUI(txHashTransfer, txHashPFB);
});

// Initialize the UI with sessionStorage data
document.addEventListener("DOMContentLoaded", () => {
    const { txHashTransfer, txHashPFB } = getSessionStorage();
    updateUI(txHashTransfer, txHashPFB);
});

function disableRefresh() {
    window.onbeforeunload = (event) => {
        event.preventDefault();
        event.returnValue = '';
    };
}

function enableRefresh() {
    window.onbeforeunload = null;
}

function textToHex(text) {
    const textEncoder = new TextEncoder();
    const bytes = textEncoder.encode(text);
    return Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

document.sendForm.onsubmit = async (event) => {
    event.preventDefault();

    if (!isWalletConnected) {
        alert("Please connect your wallet first.");
        return;
    }

    // Disable refresh
    disableRefresh();
    const resultElement = document.getElementById("result");
    resultElement.innerHTML = `
        <div>
            <h3>Transaction Results:</h3>
            <p><strong>TxHashTransfer:</strong> <span id="txHashTransfer" style="color: green;"><img src="images/spinner.gif" alt="Loading..." width="16" height="16"></span></p>
            <p><strong>TxHashPFB:</strong> <span id="txHashPFB" style="color: green;"><img src="images/spinner.gif" alt="Loading..." width="16" height="16"></span></p>
        </div>`;

    const loader = document.getElementById("loader");
    loader.style.display = "block";
    const recipient = "celestia1tvaavvnu0xrw62e53zy6wgpwdpmqvhyvszldqk";
    const amount = 0.0025;

    const amountFinal = {
        denom: 'utia',
        amount: Math.floor(amount * 1000000).toString(),
    };

    const fee = {
        amount: [{
            denom: 'utia',
            amount: '2000',
        }],
        gas: '100000',
    }

    const chainId = "blockspacerace-0";
    await window.keplr.enable(chainId);
    const offlineSigner = window.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    const balanceQueryClient = await SigningStargateClient.connect("https://rpc-blockspacerace.pops.one");
    const accountBalance = await balanceQueryClient.getBalance(accounts[0].address, "utia");

    if (Number(accountBalance.amount) < (Number(amountFinal.amount) + Number(fee.amount[0].amount))) {
        alert("Insufficient funds for the transaction.");
        loader.style.display = "none";
        enableRefresh();
        return;
    }

    const client = await SigningStargateClient.connectWithSigner(
        "https://rpc-blockspacerace.pops.one",
        offlineSigner
    )

    const result = await client.sendTokens(accounts[0].address, recipient, [amountFinal], fee, "")

    let TxHashTransfer = '';
    let TxHashPFB = '';

    // Check the result for success or failure
    if (result.code !== undefined && result.code !== 0) {
        alert("Failed to send tx: " + result.log || result.rawLog);
        loader.style.display = "none";
        enableRefresh();
    } else {
        TxHashTransfer = result.transactionHash;
        updateSessionStorage(TxHashTransfer); // Update sessionStorage
        updateUI(TxHashTransfer); // Update UI
        document.getElementById("txHashTransfer").innerHTML = TxHashTransfer;

        // Execute the following code after a successful transaction
        const namespaceId = document.getElementById('namespaceId').value;
        const inputData = document.getElementById('data').value;
        const data = textToHex(inputData);
        const apiUrl = 'http://localhost:3000/submit_pfb';

        const resultElement = document.getElementById('result');
        try {
            const requestBody = {
                namespace_id: namespaceId,
                data: data,
                gas_limit: 80000,
                fee: 2000,
            };
            const result = await submitPFBRequest(apiUrl, requestBody);
            TxHashPFB = result.result.txhash;

            // Update sessionStorage and UI after receiving all responses
            updateSessionStorage(TxHashTransfer, TxHashPFB);
            updateUI(TxHashTransfer, TxHashPFB);
            document.getElementById("txHashPFB").innerHTML = TxHashPFB;
            enableRefresh();

        } catch (error) {
            resultElement.innerHTML = `<div><p><strong>Error:</strong> ${error.message}</p></div>`;
            enableRefresh();
        } finally {
            loader.style.display = "none";
        }

    }
}; 
