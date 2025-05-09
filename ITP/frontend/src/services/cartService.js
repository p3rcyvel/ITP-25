class CartService {
  constructor() {
    // Initialize the cart from localStorage or an empty array
    this.cartKey = "cart"; // Key used to store cart data in localStorage
    this.cart = this.loadCart();
  }

  // Load cart from localStorage
  loadCart() {
    const cartData = localStorage.getItem(this.cartKey);
    return cartData ? JSON.parse(cartData) : [];
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
  }

  // Add item to cart (or increase quantity if item already exists)
  // Add item to cart (or increase quantity if item already exists)
  addItem(item) {
    const existingItem = this.cart.find(
      (cartItem) => cartItem._id === item._id
    );

    if (existingItem) {
      // If item exists, increase its quantity
      existingItem.quantity += 1;
    } else {
      // If item doesn't exist, add it with quantity 1
      this.cart.push({ ...item, quantity: 1 });
    }

    this.saveCart(); // Persist changes to localStorage
  }

  // Remove item from cart
  removeItem(itemId) {
    this.cart = this.cart.filter((item) => item._id !== itemId);
    this.saveCart(); // Persist changes to localStorage
  }

  // Increase the quantity of an item
  increaseQuantity(itemId) {
    const item = this.cart.find((cartItem) => cartItem._id === itemId);

    if (item) {
      item.quantity += 1;
      this.saveCart(); // Persist changes to localStorage
    }
  }

  // Decrease the quantity of an item (remove if quantity reaches 0)
  decreaseQuantity(itemId) {
    const item = this.cart.find((cartItem) => cartItem._id === itemId);

    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1; // Decrease quantity
      } else {
        this.removeItem(itemId); // Remove item if quantity is 1
      }

      this.saveCart(); // Persist changes to localStorage
    }
  }

  // Get the current cart
  getCart() {
    return this.cart;
  }

  // Clear the entire cart
  clearCart() {
    this.cart = [];
    this.saveCart(); // Persist changes to localStorage
  }

  // Calculate the total price of the cart
  calculateTotalPrice() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}

// Export a singleton instance of the CartService
const cartService = new CartService();
export default cartService;
