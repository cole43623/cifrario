const params = new URLSearchParams(window.location.search);

const raw = params.get("t");
if (raw !== null) {
    const testo = decodeURIComponent(raw);
    document.getElementById('input2').value = testo;
}

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return new Uint8Array(buf);
}

async function xorEncrypt(password, text) {
  const key = await sha256Hex(password);
  const textBytes = new TextEncoder().encode(text);
  const out = new Uint8Array(textBytes.length);

  for (let i = 0; i < textBytes.length; i++) {
    out[i] = textBytes[i] ^ key[i % key.length];
  }

  return btoa(String.fromCharCode(...out));
}

async function xorDecrypt(password, base64Cipher) {
  const key = await sha256Hex(password);
  const cipherBytes = Uint8Array.from(atob(base64Cipher), c => c.charCodeAt(0));
  const out = new Uint8Array(cipherBytes.length);

  for (let i = 0; i < cipherBytes.length; i++) {
    out[i] = cipherBytes[i] ^ key[i % key.length];
  }

  return new TextDecoder().decode(out);
}

async function pasteInput() {
    const input2 = document.getElementById('input2');
    const pasteBtn = document.querySelector('.paste-btn');
    
    try {
        const text = await navigator.clipboard.readText();
        input2.value = text;
        
        const originalText = pasteBtn.textContent;
        pasteBtn.textContent = 'Incollato!';
        pasteBtn.classList.add('pasted');
        
        setTimeout(() => {
            pasteBtn.textContent = originalText;
            pasteBtn.classList.remove('pasted');
        }, 2000);
    } catch (err) {
        alert('Errore nell\'incollare: ' + err.message);
    }
}

async function Encrypt() {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;
    const output = document.getElementById('output');
    
    if (!input1 || !input2) {
        output.textContent = 'Inserisci i valori negli input.';
        return;
    }

    try {
        const result = await xorEncrypt(input1, input2);
        output.textContent = result;
    } catch (error) {
        output.textContent = 'Errore durante la cifratura: ' + error.message;
    }
}

async function Decrypt() {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;
    const output = document.getElementById('output');
    
    if (!input1 || !input2) {
        output.textContent = 'Inserisci i valori negli input.';
        return;
    }

    try {
        const result = await xorDecrypt(input1, input2);
        output.textContent = result;
    } catch (error) {
        output.textContent = 'Errore durante la decifratura: ' + error.message;
    }
}

function clearAll() {
    document.getElementById('input1').value = '';
    document.getElementById('input2').value = '';
    document.getElementById('output').textContent = '';
}

function copyOutput() {
    const output = document.getElementById('output');
    const copyBtn = document.querySelector('.copy-btn.copy1');
    
    navigator.clipboard.writeText(output.textContent).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copiato!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        alert('Errore nella copia: ' + err);
    });
}

function copyOutput2() {
    const output = document.getElementById('output');
    const copyBtn = document.querySelector('.copy-btn.copy2');
    
    const t = "cole43623.github.io/cifrario?t=" + 
        encodeURIComponent(output.textContent);   // <--- QUI LA FIX

    navigator.clipboard.writeText(t).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Link copiato!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        alert('Errore nella copia: ' + err);
    });
}
