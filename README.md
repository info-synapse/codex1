# Deposit widget

A lightweight JavaScript widget for selecting deposit methods by region. It renders HTML and CSS on load, supports an optional amount field, and opens a modal that loads checkout content from a configured URL.

## Usage

1. Add the script to your page (ES module bundlers can import the file or you can include it directly):

```html
<script src="/src/depositWidget.js"></script>
```

2. Render the widget by providing a container selector or element:

```html
<div id="widget"></div>
<script>
  DepositWidget.render({
    container: '#widget',
    countries: [
      {
        name: 'Greece',
        methods: [
          { id: 'gr-card', name: 'Visa / Mastercard', amountLabel: 'Up to €2,000', checkoutUrl: 'https://your-checkout-url' },
        ],
      },
      // ... add Cyprus, Argentina, Brazil, Peru, etc.
    ],
    onProceed: ({ method, amount }) => {
      console.log('Proceed clicked', method, amount);
    },
  });
</script>
```

3. Each Proceed button opens a modal, fetches `method.checkoutUrl`, injects the returned HTML, and executes any scripts inside the response. Provide endpoints that return the appropriate payment flow markup/JS.

## Demo

Open `demo/index.html` in a browser to see the widget in action. Replace the sample URLs with working endpoints to load a live checkout flow.
