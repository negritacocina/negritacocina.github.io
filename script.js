// Mostrar u ocultar el botón de pedido según el estado
function updateCartBtnVisibility() {
  const cartBtn = document.getElementById('cart-btn');
  let hasItems = false;
  for (const qty of Object.values(cart)) {
    if (qty > 0) {
      hasItems = true;
      break;
    }
  }
  cartBtn.style.display = hasItems ? 'block' : 'none';
}

// Animación de cierre de modal (debe estar en el scope global)
function closeModalWithAnimation(modalId, closeCallback) {
  const modal = document.getElementById(modalId);
  modal.classList.add('closing');
  setTimeout(() => {
    modal.classList.remove('closing');
    modal.style.display = 'none';
    if (closeCallback) closeCallback();
  }, 300);
}

// Modal de notificación
function showAlert(message) {
  const alertModal = document.getElementById('alert-modal');
  const alertMsg = document.getElementById('alert-message');
  alertMsg.textContent = message;
  alertModal.style.display = 'flex';
  // Barra de progreso visual
  let progressBar = document.getElementById('alert-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'alert-progress';
    progressBar.className = 'alert-progress';
    alertModal.querySelector('.cart-content').prepend(progressBar);
  }
  progressBar.style.transition = 'none';
  progressBar.style.width = '100%';
  setTimeout(() => {
    progressBar.style.transition = 'width 3s linear';
    progressBar.style.width = '0%';
  }, 10);
  // Cierre automático después de 3 segundos
  clearTimeout(alertModal._autoClose);
  alertModal._autoClose = setTimeout(() => {
    if (alertModal.style.display === 'flex') {
      closeModalWithAnimation('alert-modal');
    }
  }, 3000);
}
// Configuración inicial
let dishes = [];

// Cargar platos desde Google Sheets API
async function loadDishesFromGoogleAPI(apiUrl) {
  const response = await fetch(apiUrl);
  const data = await response.json();
  // data.values es un array de arrays, la primera fila son los encabezados
  // La segunda fila suele ser ejemplo o aclaración, los datos reales desde la tercera
  const rows = data.values.slice(2); // desde la tercera fila
  dishes = rows.map(cols => ({
    image: cols[0],
    name: cols[1],
    description: cols[2],
    price: parseFloat(cols[3]),
    stock: parseInt(cols[4]),
    public: (cols[5] || '').toLowerCase().includes('si'),
    quantity: 0
  })).filter(dish => dish.public);
  renderDishes();
}

// Renderizar platos en la página
function renderDishes() {
  const container = document.getElementById('dishes-container');
  if (!container) return;
  container.innerHTML = '';
  dishes.forEach(dish => {
    const dishElem = document.createElement('div');
    dishElem.className = 'dish';
    dishElem.setAttribute('data-name', dish.name);
    dishElem.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}">
      <div class="dish-info">
        <h2>${dish.name}</h2>
        <p>${dish.description}</p>
        ${!isNaN(dish.price) ? `<span class="price">$${dish.price}</span>` : '<span class="price" style="visibility:hidden">&nbsp;</span>'}
        <div class="quantity-controls">
          <button class="minus">-</button>
          <span class="quantity">0</span>
          <button class="plus">+</button>
        </div>
        <button class="add-cart">Agregar al pedido</button>
      </div>
    `;
    container.appendChild(dishElem);
  });
  // Reasignar eventos
  document.querySelectorAll('.plus').forEach(btn => {
    btn.onclick = function () {
      updateQuantity(btn.closest('.dish'), 1);
    };
  });
  document.querySelectorAll('.minus').forEach(btn => {
    btn.onclick = function () {
      updateQuantity(btn.closest('.dish'), -1);
    };
  });
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.onclick = function () {
      addToCart(btn.closest('.dish'));
    };
  });
}

const cart = {};

// Actualiza la cantidad en la UI y en el pedido
function updateQuantity(dishElem, delta) {
  const name = dishElem.getAttribute('data-name');
  const quantitySpan = dishElem.querySelector('.quantity');
  let quantity = parseInt(quantitySpan.textContent);
  quantity = Math.max(0, quantity + delta);
  quantitySpan.textContent = quantity;
}

// Agrega al pedido
function addToCart(dishElem) {
  const name = dishElem.getAttribute('data-name');
  const quantity = parseInt(dishElem.querySelector('.quantity').textContent);
  if (quantity > 0) {
    if (cart[name]) {
      cart[name] += quantity;
    } else {
      cart[name] = quantity;
    }
    showAlert(`${name} agregado al pedido (+${quantity})`);
    updateCartBtnVisibility();
  } else {
    showAlert('Selecciona al menos 1 unidad para agregar al pedido.');
  }
}

// Botón WhatsApp
function sendWhatsApp() {
  const phone = '5492241506823';
  let message = 'Hola negrita, quiero realizar el siguiente pedido:%0A';
  let hasItems = false;
  for (const [name, qty] of Object.entries(cart)) {
    if (qty > 0) {
      message += `- ${name}: ${qty}%0A`;
      hasItems = true;
    }
  }
  if (!hasItems) {
    showAlert('El pedido está vacío. Agrega platos antes de hacer el pedido.');
    return;
  }
  const url = `https://wa.me/${phone}?text=${message}`;
  window.open(url, '_blank');
}

// Eventos
window.onload = function () {
  // Cerrar modal de pedido al hacer clic/touch fuera del contenido
  function closeModalWithAnimation(modalId, closeCallback) {
    const modal = document.getElementById(modalId);
    modal.classList.add('closing');
    setTimeout(() => {
      modal.classList.remove('closing');
      modal.style.display = 'none';
      if (closeCallback) closeCallback();
    }, 300);
  }

  document.getElementById('cart-modal').addEventListener('mousedown', function (e) {
    if (e.target === this) {
      closeModalWithAnimation('cart-modal', function () {
        // Restaurar el estado original si no se guardó
        for (const key in cart) {
          if (!(key in cartBackup)) {
            delete cart[key];
          }
        }
        for (const key in cartBackup) {
          cart[key] = cartBackup[key];
        }
        updateCartBtnVisibility();
      });
    }
  });
  document.getElementById('cart-modal').addEventListener('touchstart', function (e) {
    if (e.target === this) {
      closeModalWithAnimation('cart-modal', function () {
        for (const key in cart) {
          if (!(key in cartBackup)) {
            delete cart[key];
          }
        }
        for (const key in cartBackup) {
          cart[key] = cartBackup[key];
        }
        updateCartBtnVisibility();
      });
    }
  });

  // Cerrar modal de alerta al hacer clic/touch fuera del contenido
  document.getElementById('alert-modal').addEventListener('mousedown', function (e) {
    if (e.target === this) {
      closeModalWithAnimation('alert-modal');
    }
  });
  document.getElementById('alert-modal').addEventListener('touchstart', function (e) {
    if (e.target === this) {
      closeModalWithAnimation('alert-modal');
    }
  });
  // Cerrar modal de notificación
  document.getElementById('close-alert').onclick = function () {
    closeModalWithAnimation('alert-modal');
  };
  document.querySelectorAll('.plus').forEach(btn => {
    btn.onclick = function () {
      updateQuantity(btn.closest('.dish'), 1);
    };
  });
  document.querySelectorAll('.minus').forEach(btn => {
    btn.onclick = function () {
      updateQuantity(btn.closest('.dish'), -1);
    };
  });
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.onclick = function () {
      addToCart(btn.closest('.dish'));
    };
  });
  document.getElementById('whatsapp-btn').onclick = sendWhatsApp;

  // Mostrar pedido
  const cartBtn = document.getElementById('cart-btn');
  let cartBackup = {};

  // Cargar platos desde Google Sheets API
  const apiUrl = 'https://sheets.googleapis.com/v4/spreadsheets/1cd014IXW4wJ1oiW8QltSGr0bJbpG-8NxNNM3qerVzac/values/negritabbdd?key=AIzaSyACqVLXtVuYzyXZVSD4BGvZ78oRuNOwd4w';
  loadDishesFromGoogleAPI(apiUrl);
  cartBtn.onclick = function () {
    // Guardar copia del estado original
    cartBackup = JSON.parse(JSON.stringify(cart));
    const modal = document.getElementById('cart-modal');
    const list = document.getElementById('cart-list');
    list.innerHTML = '';
    let hasItems = false;
    for (const [name, qty] of Object.entries(cart)) {
      if (qty > 0) {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
          <div class="cart-row">
            <span class="cart-item-name">${name}</span>
            <button class="cart-minus" aria-label="Restar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="9" width="12" height="2" rx="1" fill="white"/></svg>
            </button>
            <span class="cart-quantity-number">${qty}</span>
            <button class="cart-plus" aria-label="Sumar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="4" width="2" height="12" rx="1" fill="white"/><rect x="4" y="9" width="12" height="2" rx="1" fill="white"/></svg>
            </button>
            <button class="remove-item" data-name="${name}">🗑️</button>
          </div>
        `;
        list.appendChild(li);
        hasItems = true;
      }
    }
    if (!hasItems) {
      const li = document.createElement('li');
      li.textContent = 'El pedido está vacío.';
      list.appendChild(li);
    }
    modal.style.display = 'flex';

    // Agregar eventos a los botones + y - en el modal
    list.querySelectorAll('.cart-plus').forEach(btn => {
      btn.onclick = function () {
        const input = btn.parentElement.querySelector('.cart-quantity-input');
        const name = btn.closest('li').querySelector('.cart-item-name').textContent;
        let value = parseInt(input.value);
        value = value + 1;
        input.value = value;
        cart[name] = value;
      };
    });
    list.querySelectorAll('.cart-minus').forEach(btn => {
      btn.onclick = function () {
        const input = btn.parentElement.querySelector('.cart-quantity-input');
        const name = btn.closest('li').querySelector('.cart-item-name').textContent;
        let value = parseInt(input.value);
        value = Math.max(1, value - 1);
        input.value = value;
        cart[name] = value;
      };
    });
  };

  // Guardar cambios en el pedido
  document.getElementById('save-cart').onclick = function () {
    const list = document.getElementById('cart-list');
    const items = list.querySelectorAll('li');
    items.forEach(li => {
      const nameSpan = li.querySelector('span');
      const input = li.querySelector('input');
      if (nameSpan && input) {
        const name = nameSpan.textContent;
        let value = parseInt(input.value);
        if (isNaN(value) || value < 1) value = 1;
        cart[name] = value;
      }
    });
    showAlert('Cambios guardados en el pedido.');
    updateCartBtnVisibility();
    closeModalWithAnimation('cart-modal');
  };

  // Eliminar plato del pedido
  document.getElementById('cart-list').onclick = function (e) {
    if (e.target.classList.contains('remove-item')) {
      const name = e.target.getAttribute('data-name');
      delete cart[name];
      e.target.parentElement.remove();
      updateCartBtnVisibility();
    }
  };

  // Actualizar visibilidad al agregar al pedido
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.onclick = function () {
      addToCart(btn.closest('.dish'));
    };
  });

  // Actualizar visibilidad al cargar la página
  updateCartBtnVisibility();

  // Cerrar pedido
  document.getElementById('close-cart').onclick = function () {
    closeModalWithAnimation('cart-modal', function () {
      for (const key in cart) {
        if (!(key in cartBackup)) {
          delete cart[key];
        }
      }
      for (const key in cartBackup) {
        cart[key] = cartBackup[key];
      }
      updateCartBtnVisibility();
    });
  };
};
