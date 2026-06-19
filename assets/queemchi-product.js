(() => {
  function money(cents, format) {
    if (window.Shopify && typeof window.Shopify.formatMoney === 'function') {
      return window.Shopify.formatMoney(cents, format);
    }

    return (cents / 100).toLocaleString(undefined, {
      style: 'currency',
      currency: window.Shopify?.currency?.active || 'COP'
    });
  }

  function initProduct(root) {
    const form = root.querySelector('.qm-product__form');
    const radios = [...root.querySelectorAll('[data-qm-variant]')];
    const price = root.querySelector('[data-qm-price]');
    const compare = root.querySelector('[data-qm-compare]');
    const gramaje = root.querySelector('[data-qm-gramaje]');
    const image = root.querySelector('[data-qm-product-image]');
    const addButton = root.querySelector('[data-qm-add]');
    const quantity = root.querySelector('[data-qm-quantity]');
    const minus = root.querySelector('[data-qm-minus]');
    const plus = root.querySelector('[data-qm-plus]');
    const moneyFormat = root.dataset.moneyFormat;

    if (!form || !radios.length) return;

    const update = () => {
      const selected = radios.find((radio) => radio.checked) || radios[0];
      if (!selected) return;

      if (price) price.textContent = money(Number(selected.dataset.price || 0), moneyFormat);

      if (compare) {
        const compareValue = Number(selected.dataset.compare || 0);
        compare.textContent = compareValue > Number(selected.dataset.price || 0) ? money(compareValue, moneyFormat) : '';
        compare.hidden = !compare.textContent;
      }

      if (gramaje) {
        gramaje.textContent = selected.dataset.gramaje || gramaje.dataset.fallback || '';
      }

      if (image && selected.dataset.image) {
        image.src = selected.dataset.image;
        image.alt = selected.dataset.imageAlt || image.alt;
      }

      const available = selected.dataset.available === 'true';
      if (addButton) {
        addButton.disabled = !available;
        addButton.textContent = available ? addButton.dataset.availableText : addButton.dataset.soldOutText;
      }
    };

    radios.forEach((radio) => radio.addEventListener('change', update));

    if (minus && plus && quantity) {
      minus.addEventListener('click', () => {
        quantity.value = Math.max(Number(quantity.min || 1), Number(quantity.value || 1) - 1);
      });

      plus.addEventListener('click', () => {
        quantity.value = Number(quantity.value || 1) + 1;
      });
    }

    update();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-qm-product]').forEach(initProduct);
  });

  document.addEventListener('shopify:section:load', (event) => {
    event.target.querySelectorAll('[data-qm-product]').forEach(initProduct);
  });
})();
