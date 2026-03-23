const { add, divide, totalPrice } = require('../src/calculator');
const allure = require('allure-js-commons');

describe('Calculator demo for Allure + Jenkins', () => {
  test('add two numbers', async () => {
    await allure.owner('seminar-team');
    await allure.severity('normal');
    await allure.epic('Seminar Demo');
    await allure.feature('Math');
    await allure.story('Addition');

    await allure.step('Add 2 and 3', async () => {
      expect(add(2, 3)).toBe(5);
    });
  });

  test('divide two numbers', async () => {
    await allure.owner('seminar-team');
    await allure.severity('critical');
    await allure.feature('Math');
    await allure.story('Division');

    await allure.step('Divide 10 by 2', async () => {
      expect(divide(10, 2)).toBe(5);
    });
  });

  test('prevent divide by zero', async () => {
    await allure.owner('seminar-team');
    await allure.severity('critical');
    await allure.feature('Math');
    await allure.story('Validation');

    await allure.step('Throw error on zero divisor', async () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
    });
  });

  test('calculate total order price', async () => {
    await allure.owner('seminar-team');
    await allure.severity('normal');
    await allure.feature('Order');
    await allure.story('Total price');

    const items = [
      { name: 'book', price: 10, quantity: 2 },
      { name: 'pen', price: 2, quantity: 5 },
    ];

    await allure.attachment('order-items', JSON.stringify(items, null, 2), {
      contentType: 'application/json',
      fileExtension: 'json',
    });

    await allure.step('Sum all line items', async () => {
      expect(totalPrice(items)).toBe(30);
    });
  });

  test.skip('example skipped test', async () => {
    await allure.feature('Demo');
    expect(true).toBe(true);
  });
});
