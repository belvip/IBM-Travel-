// Currency Converter functionality - Hero Section Popup
window.showCurrencyConverter = function() {
    // Remove existing popup if any
    const existingPopup = document.getElementById('currencyPopup');
    if (existingPopup) {
        existingPopup.remove();
        return;
    }

    const popup = document.createElement('div');
    popup.id = 'currencyPopup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        min-width: 320px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    popup.innerHTML = `
        <div style="margin-bottom: 16px;">
            <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Currency Converter</h3>
            <button onclick="window.closeCurrencyPopup()" style="position: absolute; top: 12px; right: 12px; background: none; border: none; font-size: 20px; color: #6b7280; cursor: pointer;">×</button>
        </div>
        
        <div style="margin-bottom: 16px;">
            <input type="number" id="amount" placeholder="Amount" value="100" 
                style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 8px;">
            <select id="fromCurrency" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="XAF">XAF - Central African CFA Franc</option>
            </select>
        </div>
        
        <div style="text-align: center; margin-bottom: 16px;">
            <button onclick="window.swapCurrencies()" style="background: #3b82f6; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer;">
                <i class="fas fa-exchange-alt"></i>
            </button>
        </div>
        
        <div style="margin-bottom: 16px;">
            <input type="number" id="result" placeholder="Result" readonly 
                style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 8px; background: #f9fafb;">
            <select id="toCurrency" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - US Dollar</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="XAF">XAF - Central African CFA Franc</option>
            </select>
        </div>
        
        <button onclick="window.convertCurrency()" style="width: 100%; background: #10b981; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: 500; cursor: pointer; margin-bottom: 12px;">
            Convert
        </button>
        
        <div id="exchangeRate" style="text-align: center; font-size: 14px; color: #6b7280;"></div>
    `;
    
    // Add to body instead of hero section
    document.body.appendChild(popup);
    
    // Auto-convert on load
    window.convertCurrency();
}

window.convertCurrency = async function() {
    const amount = document.getElementById('amount').value;
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    
    if (!amount || amount <= 0) return;
    
    try {
        const rate = await getExchangeRate(from, to);
        const result = (amount * rate).toFixed(2);
        document.getElementById('result').value = result;
        document.getElementById('exchangeRate').innerHTML = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    } catch (error) {
        document.getElementById('exchangeRate').innerHTML = 'Unable to fetch exchange rates';
    }
}

async function getExchangeRate(from, to) {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    const data = await response.json();
    return data.rates[to] || 1;
}

window.swapCurrencies = function() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    window.convertCurrency();
}

window.closeCurrencyPopup = function() {
    const popup = document.getElementById('currencyPopup');
    if (popup) popup.remove();
}