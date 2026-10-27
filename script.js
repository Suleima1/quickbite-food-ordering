const products = [
  {id:1,name:"Classic Beef Burger",category:"Burgers",price:4500,emoji:"🍔",desc:"Juicy beef patty, fresh lettuce and our house sauce.",badge:"BESTSELLER"},
  {id:2,name:"Jollof Rice & Chicken",category:"Meals",price:5500,emoji:"🍗",desc:"Smoky party-style jollof served with grilled chicken.",badge:"POPULAR"},
  {id:3,name:"Crispy Chicken Wrap",category:"Meals",price:4200,emoji:"🌯",desc:"Crispy chicken, crunchy vegetables and creamy dressing.",badge:""},
  {id:4,name:"Loaded Fries",category:"Sides",price:2500,emoji:"🍟",desc:"Golden fries topped with a tasty seasoning blend.",badge:""},
  {id:5,name:"Fresh Fruit Smoothie",category:"Drinks",price:2200,emoji:"🥤",desc:"A refreshing blend of seasonal fruits.",badge:"FRESH"},
  {id:6,name:"Double Cheese Burger",category:"Burgers",price:6000,emoji:"🍔",desc:"Two savoury patties with melted cheese and pickles.",badge:"FAN FAVOURITE"},
  {id:7,name:"Pepperoni Pizza",category:"Meals",price:7000,emoji:"🍕",desc:"Cheesy pizza with pepperoni and a crisp golden crust.",badge:""},
  {id:8,name:"Chilled Lemonade",category:"Drinks",price:1500,emoji:"🍋",desc:"Cool, citrusy lemonade served ice cold.",badge:""},
  {id:9,name:"Chicken Wings",category:"Sides",price:3500,emoji:"🍗",desc:"Tender wings coated in a sweet and spicy glaze.",badge:""},
  {id:10,name:"Chocolate Milkshake",category:"Drinks",price:2800,emoji:"🥛",desc:"Rich chocolate shake for a sweet treat.",badge:"SWEET TREAT"},
  {id:11,name:"Veggie Rice Bowl",category:"Meals",price:3800,emoji:"🥗",desc:"A colourful bowl of rice, vegetables and savoury sauce.",badge:""},
  {id:12,name:"Fish Burger",category:"Burgers",price:4800,emoji:"🐟",desc:"Crispy fish fillet, fresh greens and tangy mayo.",badge:""}
];
const cart = {};
const menuGrid = document.getElementById("menuGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const checkoutModal = document.getElementById("checkoutModal");
const toast = document.getElementById("toast");
let activeCategory = "All";
const naira = value => "₦" + value.toLocaleString("en-NG");

function renderMenu(category = "All") {
  activeCategory = category;
  const filtered = category === "All" ? products : products.filter(p => p.category === category);
  menuGrid.innerHTML = filtered.map(p => `
    <article class="food-card">
      <div class="food-art"><span>${p.emoji}</span>${p.badge ? `<b class="badge">${p.badge}</b>` : ""}</div>
      <div class="food-info"><h3>${p.name}</h3><p>${p.desc}</p>
        <div class="food-bottom"><span class="food-price">${naira(p.price)}</span><button class="add-button" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button></div>
      </div>
    </article>`).join("");
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  showToast(`${products.find(p => p.id === id).name} added to cart`);
}
function changeQuantity(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}
function renderCart() {
  const entries = Object.entries(cart);
  const count = entries.reduce((sum, [,qty]) => sum + qty, 0);
  const total = entries.reduce((sum, [id,qty]) => sum + products.find(p => p.id === Number(id)).price * qty, 0);
  cartCount.textContent = count;
  cartTotal.textContent = naira(total);
  if (!entries.length) {
    cartItems.innerHTML = `<div class="empty-cart"><span>🛍️</span><h3>Your cart is empty</h3><p>Add something delicious from the menu.</p></div>`;
    return;
  }
  cartItems.innerHTML = entries.map(([id,qty]) => {
    const p = products.find(item => item.id === Number(id));
    return `<div class="cart-item"><div class="cart-item-art">${p.emoji}</div><div><h4>${p.name}</h4><small>${naira(p.price)} each</small><div class="quantity"><button data-change="${id}" data-delta="-1" aria-label="Remove one">−</button><span>${qty}</span><button data-change="${id}" data-delta="1" aria-label="Add one">+</button></div></div><span class="cart-item-total">${naira(p.price * qty)}</span></div>`;
  }).join("");
}
function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden","false");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden","true");
}
document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === button));
  renderMenu(button.dataset.category);
});
menuGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-change]");
  if (button) changeQuantity(Number(button.dataset.change), Number(button.dataset.delta));
});
document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!Object.keys(cart).length) { showToast("Add at least one item before checkout."); return; }
  closeCart();
  checkoutModal.classList.add("open");
});
document.getElementById("closeModal").addEventListener("click", () => checkoutModal.classList.remove("open"));
checkoutModal.addEventListener("click", event => {
  if (event.target === checkoutModal) checkoutModal.classList.remove("open");
});
document.getElementById("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("customerName").value.trim();
  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const total = Object.entries(cart).reduce((sum, [id,qty]) => sum + products.find(p => p.id === Number(id)).price * qty, 0);
  checkoutModal.classList.remove("open");
  event.target.reset();
  Object.keys(cart).forEach(key => delete cart[key]);
  renderCart();
  showToast(`Thanks, ${name}! Demo order placed (${count} item${count === 1 ? "" : "s"}, ${naira(total)}).`);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") { closeCart(); checkoutModal.classList.remove("open"); }
});
document.getElementById("year").textContent = new Date().getFullYear();
renderMenu();
renderCart();
