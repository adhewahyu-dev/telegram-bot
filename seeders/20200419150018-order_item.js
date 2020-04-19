'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('order_items', [
      {    
          order_id: 3,
          product_id: 1,
          quantity: 10
      }, {    
          order_id: 1,
          product_id: 3,
          quantity: 50
      }, {    
          order_id: 2,
          product_id: 2,
          quantity: 100
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('order_items', null, {});
  }
};
