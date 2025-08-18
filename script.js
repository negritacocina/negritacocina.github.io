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
    alert(`${name} agregado al carrito (${quantity})`);
  } else {
    alert('Selecciona al menos 1 unidad para agregar al carrito.');
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
    alert('El carrito está vacío. Agrega platos antes de hacer el pedido.');
    return;
  }
  const url = `https://wa.me/${phone}?text=${message}`;
  window.open(url, '_blank');
}

// Eventos
window.onload = function() {
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
};
