(function (global) {
  const WIDGET_NAMESPACE = 'deposit-widget';

  const defaultCountries = [
    {
      name: 'Greece',
      methods: [
        { id: 'gr-card', name: 'Visa / Mastercard', amountLabel: 'Up to €2,000', checkoutUrl: 'https://example.com/gr/cards' },
        { id: 'gr-wallet', name: 'Digital Wallet', amountLabel: 'Up to €1,500', checkoutUrl: 'https://example.com/gr/wallet' },
      ],
    },
    {
      name: 'Cyprus',
      methods: [
        { id: 'cy-bank', name: 'Bank Transfer', amountLabel: 'Up to €5,000', checkoutUrl: 'https://example.com/cy/bank' },
        { id: 'cy-wallet', name: 'Wallet', amountLabel: 'Up to €1,200', checkoutUrl: 'https://example.com/cy/wallet' },
      ],
    },
    {
      name: 'Argentina',
      methods: [
        { id: 'ar-card', name: 'Tarjeta Crédito', amountLabel: 'Hasta $2.000', checkoutUrl: 'https://example.com/ar/cards' },
        { id: 'ar-cash', name: 'Pago en efectivo', amountLabel: 'Hasta $1.200', checkoutUrl: 'https://example.com/ar/cash' },
      ],
    },
    {
      name: 'Brazil',
      methods: [
        { id: 'br-pix', name: 'Pix', amountLabel: 'Até R$1.500', checkoutUrl: 'https://example.com/br/pix' },
        { id: 'br-boleto', name: 'Boleto', amountLabel: 'Até R$800', checkoutUrl: 'https://example.com/br/boleto' },
      ],
    },
    {
      name: 'Peru',
      methods: [
        { id: 'pe-card', name: 'Tarjeta Crédito', amountLabel: 'Hasta S/1.500', checkoutUrl: 'https://example.com/pe/cards' },
        { id: 'pe-wallet', name: 'Billetera', amountLabel: 'Hasta S/900', checkoutUrl: 'https://example.com/pe/wallet' },
      ],
    },
  ];

  const styles = `
    .${WIDGET_NAMESPACE} * { box-sizing: border-box; font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif; }
    .${WIDGET_NAMESPACE} { background: #0a0c10; color: #f7f9fc; border: 1px solid #1d2330; border-radius: 16px; padding: 20px; width: 100%; max-width: 960px; margin: 0 auto; box-shadow: 0 20px 60px rgba(0,0,0,0.45); }
    .${WIDGET_NAMESPACE} h2 { margin: 0 0 12px; font-size: 22px; letter-spacing: -0.02em; }
    .${WIDGET_NAMESPACE} .widget-subtitle { color: #9aa4b5; margin-bottom: 20px; font-size: 14px; }
    .${WIDGET_NAMESPACE} .amount-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 18px; }
    .${WIDGET_NAMESPACE} .amount-row label { font-weight: 600; color: #c8d1e0; }
    .${WIDGET_NAMESPACE} .amount-input { flex: 1; min-width: 180px; background: #0f131a; border: 1px solid #1f2634; border-radius: 12px; padding: 10px 12px; color: #e8eefc; outline: none; transition: border 0.2s ease, box-shadow 0.2s ease; }
    .${WIDGET_NAMESPACE} .amount-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.25); }
    .${WIDGET_NAMESPACE} .country { border: 1px solid #1f2634; border-radius: 14px; background: linear-gradient(145deg, #0f131a, #0b0f16); margin-bottom: 12px; overflow: hidden; }
    .${WIDGET_NAMESPACE} .country-header { cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; font-weight: 700; color: #e8eefc; transition: background 0.2s ease, color 0.2s ease; }
    .${WIDGET_NAMESPACE} .country-header:hover { background: #111724; color: #ffffff; }
    .${WIDGET_NAMESPACE} .country-methods { display: none; border-top: 1px solid #1f2634; background: #0d1118; }
    .${WIDGET_NAMESPACE} .country-methods.open { display: block; }
    .${WIDGET_NAMESPACE} .method-card { display: grid; grid-template-columns: 1fr auto auto; gap: 14px; align-items: center; padding: 14px 16px; border-bottom: 1px solid #151b27; }
    .${WIDGET_NAMESPACE} .method-card:last-child { border-bottom: none; }
    .${WIDGET_NAMESPACE} .method-info { display: flex; flex-direction: column; gap: 6px; }
    .${WIDGET_NAMESPACE} .method-name { font-weight: 700; font-size: 15px; }
    .${WIDGET_NAMESPACE} .method-amount { color: #9aa4b5; font-size: 13px; }
    .${WIDGET_NAMESPACE} .method-action { display: flex; align-items: center; gap: 8px; }
    .${WIDGET_NAMESPACE} .proceed-btn { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; border-radius: 12px; padding: 10px 16px; font-weight: 700; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .${WIDGET_NAMESPACE} .proceed-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(37, 99, 235, 0.45); }
    .${WIDGET_NAMESPACE} .proceed-btn:active { transform: translateY(0); }
    .${WIDGET_NAMESPACE} .pill { background: #111827; color: #9aa4b5; padding: 6px 10px; border-radius: 20px; font-size: 12px; border: 1px solid #1f2937; }
    .${WIDGET_NAMESPACE} .modal { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.6); z-index: 9999; padding: 20px; }
    .${WIDGET_NAMESPACE} .modal.open { display: flex; }
    .${WIDGET_NAMESPACE} .modal-card { background: #0d1118; border: 1px solid #1f2634; border-radius: 16px; width: min(800px, 100%); max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.55); }
    .${WIDGET_NAMESPACE} .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-bottom: 1px solid #1f2634; }
    .${WIDGET_NAMESPACE} .modal-body { padding: 16px; overflow-y: auto; background: #0b0f16; }
    .${WIDGET_NAMESPACE} .close-btn { background: none; border: 1px solid #1f2634; color: #c8d1e0; border-radius: 10px; padding: 8px 12px; cursor: pointer; }
    .${WIDGET_NAMESPACE} .loader { display: flex; align-items: center; gap: 10px; color: #9aa4b5; font-size: 14px; }
    .${WIDGET_NAMESPACE} .loader-dot { width: 10px; height: 10px; border-radius: 50%; background: #3b82f6; animation: loaderPulse 1.2s infinite ease-in-out; }
    .${WIDGET_NAMESPACE} .loader-dot:nth-child(2) { animation-delay: 0.2s; }
    .${WIDGET_NAMESPACE} .loader-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes loaderPulse { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
    @media (max-width: 720px) {
      .${WIDGET_NAMESPACE} { padding: 16px; }
      .${WIDGET_NAMESPACE} .method-card { grid-template-columns: 1fr; align-items: flex-start; }
      .${WIDGET_NAMESPACE} .method-action { justify-content: flex-start; }
    }
  `;

  function injectStyles() {
    if (document.getElementById(`${WIDGET_NAMESPACE}-styles`)) return;
    const style = document.createElement('style');
    style.id = `${WIDGET_NAMESPACE}-styles`;
    style.textContent = styles;
    document.head.appendChild(style);
  }

  function createElement(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function toggleMethods(container) {
    container.classList.toggle('open');
  }

  function executeScripts(container) {
    const scripts = Array.from(container.querySelectorAll('script'));
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.textContent = script.textContent;
      }
      document.body.appendChild(newScript);
      document.body.removeChild(newScript);
    });
  }

  function createModal(root) {
    const modal = createElement('div', `${WIDGET_NAMESPACE} modal`);
    const card = createElement('div', 'modal-card');
    const header = createElement('div', 'modal-header');
    const title = createElement('div', 'method-name', 'Processing payment');
    const closeBtn = createElement('button', 'close-btn', 'Close');
    const body = createElement('div', 'modal-body');

    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.classList.remove('open');
      }
    });

    header.appendChild(title);
    header.appendChild(closeBtn);
    card.appendChild(header);
    card.appendChild(body);
    modal.appendChild(card);
    root.appendChild(modal);

    const loader = createElement('div', 'loader');
    loader.appendChild(createElement('div', 'loader-dot'));
    loader.appendChild(createElement('div', 'loader-dot'));
    loader.appendChild(createElement('div', 'loader-dot'));
    loader.appendChild(createElement('span', null, 'Loading checkout...'));

    return {
      element: modal,
      body,
      title,
      loader,
      open: (method) => {
        title.textContent = `Processing ${method.name}`;
        body.innerHTML = '';
        body.appendChild(loader);
        modal.classList.add('open');
      },
      setContent: (html) => {
        body.innerHTML = html;
        executeScripts(body);
      },
    };
  }

  function createMethodCard(method, amountInput, modal, onProceed) {
    const card = createElement('div', 'method-card');

    const info = createElement('div', 'method-info');
    const name = createElement('div', 'method-name', method.name);
    const amount = createElement('div', 'method-amount', method.amountLabel || 'No limit provided');
    info.appendChild(name);
    info.appendChild(amount);

    const pill = createElement('div', 'pill', method.id);

    const action = createElement('div', 'method-action');
    const btn = createElement('button', 'proceed-btn', 'Proceed');
    btn.addEventListener('click', async () => {
      const amountValue = amountInput ? amountInput.value.trim() : '';
      const selectedAmount = amountValue || method.amount || '';
      modal.open(method);
      if (typeof onProceed === 'function') {
        onProceed({ method, amount: selectedAmount });
      }
      if (!method.checkoutUrl) {
        modal.setContent('<p>No checkout URL configured for this method.</p>');
        return;
      }
      try {
        const response = await fetch(method.checkoutUrl, { cache: 'no-cache' });
        const content = await response.text();
        modal.setContent(content);
      } catch (error) {
        modal.setContent(`<p style="color:#ef4444;">Failed to load payment flow: ${error}</p>`);
      }
    });
    action.appendChild(pill);
    action.appendChild(btn);

    card.appendChild(info);
    card.appendChild(action);
    return card;
  }

  function createCountryBlock(country, amountInput, modal, onProceed) {
    const wrapper = createElement('div', 'country');
    const header = createElement('div', 'country-header');
    header.textContent = country.name;
    const chevron = createElement('span', null, '▾');
    header.appendChild(chevron);

    const methodsContainer = createElement('div', 'country-methods');
    country.methods.forEach((method) => {
      methodsContainer.appendChild(createMethodCard(method, amountInput, modal, onProceed));
    });

    header.addEventListener('click', () => toggleMethods(methodsContainer));
    wrapper.appendChild(header);
    wrapper.appendChild(methodsContainer);
    return wrapper;
  }

  function buildWidget(config) {
    const {
      container,
      countries = defaultCountries,
      showAmount = true,
      heading = 'Select your deposit method',
      subtitle = 'Choose a region and continue with your preferred payment option',
      onProceed,
    } = config;

    if (!container) {
      throw new Error('container is required to render the deposit widget');
    }

    injectStyles();

    const host = typeof container === 'string' ? document.querySelector(container) : container;
    if (!host) {
      throw new Error('Could not find container element for deposit widget');
    }

    const root = createElement('div', WIDGET_NAMESPACE);

    const title = createElement('h2');
    title.textContent = heading;
    const subtitleEl = createElement('div', 'widget-subtitle', subtitle);
    root.appendChild(title);
    root.appendChild(subtitleEl);

    let amountInput = null;
    if (showAmount) {
      const row = createElement('div', 'amount-row');
      const label = createElement('label', null, 'Amount (optional)');
      amountInput = createElement('input', 'amount-input');
      amountInput.type = 'number';
      amountInput.placeholder = 'Enter amount';
      row.appendChild(label);
      row.appendChild(amountInput);
      root.appendChild(row);
    }

    const modal = createModal(document.body);

    countries.forEach((country) => {
      root.appendChild(createCountryBlock(country, amountInput, modal, onProceed));
    });

    host.innerHTML = '';
    host.appendChild(root);

    return {
      updateCountries(newCountries) {
        root.querySelectorAll('.country').forEach((el) => el.remove());
        newCountries.forEach((c) => root.appendChild(createCountryBlock(c, amountInput, modal, onProceed)));
      },
      setAmount(value) {
        if (amountInput) amountInput.value = value;
      },
      open() {
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    };
  }

  global.DepositWidget = {
    render: buildWidget,
  };
})(typeof window !== 'undefined' ? window : globalThis);
