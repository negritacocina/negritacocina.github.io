// Modal de notificación
function showAlert(message) {
  const alertModal = document.getElementById('alert-modal');
  const alertMsg = document.getElementById('alert-message');
  alertMsg.textContent = message;
  alertModal.style.display = 'flex';
}
// Configuración inicial
const dishes = [
  {
    name: "Empanadas",
    price: 1200,
    quantity: 0
  },
  {
    name: "Tarta de Verdura",
    price: 1500,
    quantity: 0
  }
];

const cart = {};

// Actualiza la cantidad en la UI y en el carrito
function updateQuantity(dishElem, delta) {
  const name = dishElem.getAttribute('data-name');
  const quantitySpan = dishElem.querySelector('.quantity');
  let quantity = parseInt(quantitySpan.textContent);
  quantity = Math.max(0, quantity + delta);
  quantitySpan.textContent = quantity;
}

// Agrega al carrito
function addToCart(dishElem) {
  const name = dishElem.getAttribute('data-name');
  const quantity = parseInt(dishElem.querySelector('.quantity').textContent);
  if (quantity > 0) {
    cart[name] = quantity;
    showAlert(`${name} agregado al carrito (${quantity})`);
  } else {
    showAlert('Selecciona al menos 1 unidad para agregar al carrito.');
  }
}

// Botón WhatsApp
function sendWhatsApp() {
  const phone = '5491123456789'; // Cambia por tu número real
  let message = 'Hola negrita, quiero realizar el siguiente pedido:%0A';
  let hasItems = false;
  for (const [name, qty] of Object.entries(cart)) {
    if (qty > 0) {
      message += `- ${name}: ${qty}%0A`;
      hasItems = true;
    }
  }
  if (!hasItems) {
    showAlert('El carrito está vacío. Agrega platos antes de hacer el pedido.');
    return;
  }
  const url = `https://wa.me/${phone}?text=${message}`;
  window.open(url, '_blank');
}

// Eventos
window.onload = function() {
  // Cerrar modal de notificación
  document.getElementById('close-alert').onclick = function() {
    document.getElementById('alert-modal').style.display = 'none';
  };
  document.querySelectorAll('.plus').forEach(btn => {
    btn.onclick = function() {
      updateQuantity(btn.closest('.dish'), 1);
    };
  });
  document.querySelectorAll('.minus').forEach(btn => {
    btn.onclick = function() {
      updateQuantity(btn.closest('.dish'), -1);
    };
  });
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.onclick = function() {
      addToCart(btn.closest('.dish'));
    };
  });
  document.getElementById('whatsapp-btn').onclick = sendWhatsApp;

  // Mostrar carrito
  const cartBtn = document.getElementById('cart-btn');
  cartBtn.onclick = function() {
    const modal = document.getElementById('cart-modal');
    const list = document.getElementById('cart-list');
    list.innerHTML = '';
    let hasItems = false;
    for (const [name, qty] of Object.entries(cart)) {
      if (qty > 0) {
        const li = document.createElement('li');
        li.textContent = `${name}: ${qty}`;
        list.appendChild(li);
        hasItems = true;
      }
    }
    if (!hasItems) {
      const li = document.createElement('li');
      li.textContent = 'El carrito está vacío.';
      list.appendChild(li);
    }
    modal.style.display = 'flex';
  };

  // Mostrar u ocultar el botón de carrito según el estado
  function updateCartBtnVisibility() {
    let hasItems = false;
    for (const qty of Object.values(cart)) {
      if (qty > 0) {
        hasItems = true;
        break;
      }
    }
    cartBtn.style.display = hasItems ? 'block' : 'none';
  }

  // Actualizar visibilidad al agregar al carrito
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.onclick = function() {
      addToCart(btn.closest('.dish'));
      updateCartBtnVisibility();
    };
  });

  // Actualizar visibilidad al cargar la página
  updateCartBtnVisibility();

  // Cerrar carrito
  document.getElementById('close-cart').onclick = function() {
    document.getElementById('cart-modal').style.display = 'none';
  };
};
