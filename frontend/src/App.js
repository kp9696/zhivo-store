import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const products = [
  // Tech Accessories
  { id: 1, name: "Premium Laptop Bag", price: 1899, category: "Bags", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format", rating: 4.5, inStock: true },
  { id: 2, name: "Ergonomic Wireless Mouse", price: 899, category: "Accessories", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format", rating: 4.3, inStock: true },
  { id: 3, name: "Mechanical Keyboard", price: 2499, category: "Accessories", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format", rating: 4.8, inStock: true },
  { id: 4, name: "7-in-1 USB-C Hub", price: 1299, category: "Accessories", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format", rating: 4.2, inStock: true },
  { id: 5, name: "Adjustable Laptop Stand", price: 1599, category: "Furniture", image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&auto=format", rating: 4.6, inStock: true },
  { id: 6, name: "Noise Cancelling Headset", price: 3499, category: "Audio", image: "https://images.unsplash.com/photo-1518444028993-76dca4b2df4d?w=500&auto=format", rating: 4.7, inStock: true },
  { id: 7, name: "Wireless Charging Pad", price: 1199, category: "Accessories", image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=500&auto=format", rating: 4.4, inStock: true },
  { id: 8, name: "4K Webcam", price: 2799, category: "Electronics", image: "https://images.unsplash.com/photo-1587826085292-6d8b2f1e55f5?w=500&auto=format", rating: 4.5, inStock: true },
  { id: 9, name: "Premium Notebook Set", price: 599, category: "Stationery", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format", rating: 4.1, inStock: true },
  { id: 10, name: "Executive Pen Set", price: 899, category: "Stationery", image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&auto=format", rating: 4.3, inStock: true },
  { id: 11, name: "Desk Organizer", price: 699, category: "Office", image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&auto=format", rating: 4.2, inStock: true },
  { id: 12, name: "Anti-Fatigue Mat", price: 1299, category: "Office", image: "https://images.unsplash.com/photo-1587826085292-6d8b2f1e55f5?w=500&auto=format", rating: 4.0, inStock: true }
];

// Generate unique order ID
const generateOrderId = () => {
  const prefix = "ZHV";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

function App() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCheckout, setShowCheckout] = useState(false);
  const checkoutRef = useRef(null);
  
  const [form, setForm] = useState({
    name: "",
    company: "",
    address: "",
    mobile: "",
    email: "",
    gstRequired: false,
    gstNumber: ""
  });

  // Get unique categories
  const categories = ["All", ...new Set(products.map(p => p.category))];

  // Filter products by category
  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  // Scroll to checkout section when showCheckout becomes true
  useEffect(() => {
    if (showCheckout && checkoutRef.current) {
      setTimeout(() => {
        checkoutRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 300);
    }
  }, [showCheckout]);

  const addToCart = (product) => {
    const exist = cart.find(item => item.id === product.id);
    if (exist) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
      showNotificationMessage(`Increased ${product.name} quantity`);
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
      showNotificationMessage(`${product.name} added to cart!`);
    }
    setShowCart(true);
  };

  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const updateQty = (id, qty) => {
    if (qty < 1) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, qty: Number(qty) } : item
      ));
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
    showNotificationMessage("Item removed from cart");
  };

  const clearCart = () => {
    setCart([]);
    setShowCheckout(false);
    showNotificationMessage("Cart cleared");
  };

  const total = cart.reduce((sum, item) =>
    sum + item.price * item.qty, 0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const validateForm = () => {
    if (!form.name || !form.address || !/^\d{10}$/.test(form.mobile)) {
      alert("Please fill all required fields correctly. Mobile must be 10 digits.");
      return false;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("Please enter a valid email address");
      return false;
    }
    if (form.gstRequired && !form.gstNumber) {
      alert("Please enter GST number");
      return false;
    }
    return true;
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setShowCart(false);
    setShowCheckout(true);
  };

  const orderWhatsApp = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    if (!validateForm()) return;

    const orderId = generateOrderId();
    const date = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    let message = `┌─────────────────────────┐\n`;
    message += `│   ZHIVO CONSULTING      │\n`;
    message += `│     ORDER CONFIRMATION  │\n`;
    message += `└─────────────────────────┘\n\n`;
    
    message += `🆔 *ORDER ID:* ${orderId}\n`;
    message += `📅 *Date & Time:* ${date}\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `👤 *CUSTOMER DETAILS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `📋 *Name:* ${form.name}\n`;
    message += `🏢 *Company:* ${form.company || 'N/A'}\n`;
    message += `📍 *Address:* ${form.address}\n`;
    message += `📱 *Mobile:* ${form.mobile}\n`;
    message += `✉️ *Email:* ${form.email || 'N/A'}\n`;
    message += `📋 *GST Required:* ${form.gstRequired ? '✅ Yes' : '❌ No'}\n`;
    
    if (form.gstRequired) {
      message += `🔖 *GST Number:* ${form.gstNumber}\n`;
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━━\n`;
    message += `🛒 *ORDER SUMMARY*\n`;
    message += `━━━━━━━━━━━━━━━━━━━\n\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   📦 Qty: ${item.qty} × ₹${item.price}\n`;
      message += `   💰 Amount: ₹${(item.price * item.qty).toLocaleString()}\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `📊 *ORDER TOTAL*\n`;
    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `📦 Total Items: ${totalItems}\n`;
    message += `💰 Subtotal: ₹${total.toLocaleString()}\n`;
    message += `🚚 Shipping: FREE\n`;
    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `💵 *GRAND TOTAL: ₹${total.toLocaleString()}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `📍 *Delivery Address:*\n`;
    message += `${form.address}\n\n`;
    
    message += `📱 *Contact:* ${form.mobile}\n\n`;
    
    message += `✨ *Thank you for shopping with Zhivo Consulting!*\n`;
    message += `🌟 We'll process your order shortly.\n\n`;
    message += `🔔 *Save this order ID for future reference: ${orderId}*`;

    const encoded = encodeURIComponent(message);

    window.open(
      `https://wa.me/917398102456?text=${encoded}`,
      "_blank"
    );

    // Optional: Show success message
    showNotificationMessage("Order placed successfully! Redirecting to WhatsApp...");
  };

  return (
    <div className="app">
      {/* Notification Toast */}
      <div className={`notification ${showNotification ? 'show' : ''}`}>
        {notificationMessage}
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>🛍️ Zhivo Consulting</h1>
            <span className="tagline">Premium Office Supplies</span>
          </div>
          <div className="header-actions">
            <button className="cart-icon" onClick={() => setShowCart(!showCart)}>
              🛒
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${showCart ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Shopping Cart</h2>
          <button className="close-btn" onClick={() => setShowCart(false)}>×</button>
        </div>
        
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started!</p>
            <button className="browse-btn" onClick={() => setShowCart(false)}>
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
                    <div className="qty-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-footer">
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className="free-shipping">FREE</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="cart-actions">
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Cart
                </button>
                <button className="checkout-btn" onClick={handleProceedToCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <section className="products-section">
          <h2>{activeCategory} Products</h2>
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  {!product.inStock && <span className="out-of-stock">Out of Stock</span>}
                  <span className="product-category">{product.category}</span>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-rating">
                    {'★'.repeat(Math.floor(product.rating))}
                    {'☆'.repeat(5 - Math.floor(product.rating))}
                    <span className="rating-value">{product.rating}</span>
                  </div>
                  <p className="product-price">₹{product.price.toLocaleString()}</p>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Checkout Section - Shows when cart has items AND showCheckout is true */}
        {totalItems > 0 && showCheckout && (
          <section className="checkout-section" ref={checkoutRef} id="checkout-section">
            <div className="checkout-container">
              <div className="checkout-header">
                <h2>📋 Complete Your Order</h2>
                <p className="section-subtitle">Please provide your details to proceed</p>
                {showCheckout && (
                  <div className="checkout-badge">
                    <span>🔔 You're almost there! Fill in your details to place order</span>
                  </div>
                )}
              </div>
              
              <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="company"
                      placeholder="Enter company name"
                      value={form.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Delivery Address *</label>
                  <textarea
                    name="address"
                    placeholder="Enter complete delivery address"
                    value={form.address}
                    onChange={handleChange}
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="10 digit mobile number"
                      value={form.mobile}
                      onChange={handleChange}
                      maxLength="10"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="gst-section">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      name="gstRequired"
                      checked={form.gstRequired}
                      onChange={handleChange}
                    />
                    <span className="checkbox-label">I need GST invoice for this order</span>
                  </label>

                  {form.gstRequired && (
                    <div className="gst-input-group">
                      <input
                        type="text"
                        name="gstNumber"
                        placeholder="Enter GST Number"
                        value={form.gstNumber}
                        onChange={handleChange}
                        className="gst-input"
                      />
                    </div>
                  )}
                </div>

                <div className="order-preview">
                  <h3>Order Preview</h3>
                  <div className="preview-items">
                    {cart.map(item => (
                      <div key={item.id} className="preview-item">
                        <span className="item-name">{item.name} x{item.qty}</span>
                        <span className="item-price">₹{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="preview-total">
                    <span>Total Amount:</span>
                    <strong>₹{total.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="checkout-actions">
                  <button 
                    type="button" 
                    className="back-to-cart-btn"
                    onClick={() => {
                      setShowCheckout(false);
                      setShowCart(true);
                    }}
                  >
                    ← Back to Cart
                  </button>
                  <button type="button" className="whatsapp-order-btn" onClick={orderWhatsApp}>
                    <span className="btn-icon">📱</span>
                    Confirm Order via WhatsApp
                  </button>
                </div>
                
                <p className="form-note">
                  By placing this order, you agree to our terms and conditions.
                  You will be redirected to WhatsApp to confirm your order.
                </p>
              </form>
            </div>
          </section>
        )}

        {/* Quick Checkout Button (floating) - Shows when cart has items but checkout is not shown */}
        {totalItems > 0 && !showCheckout && (
          <div className="floating-checkout">
            <div className="floating-checkout-content">
              <div className="floating-cart-summary">
                <span className="floating-item-count">{totalItems} items</span>
                <span className="floating-total">₹{total.toLocaleString()}</span>
              </div>
              <button 
                className="floating-checkout-btn"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Zhivo Consulting</h4>
            <p>Your trusted partner for premium office supplies and tech accessories.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#products">Products</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>📞 +91 7398102456</p>
            <p>✉️ store@zhivo.com</p>
            <p>📍 Mumbai, India</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Zhivo Consulting. All rights reserved. | Designed with ❤️ for business</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
