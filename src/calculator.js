function add(a, b) {
  return a + b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

function totalPrice(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

module.exports = {
  add,
  divide,
  totalPrice,
};
