"use strict";

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

    return queryInterface.bulkInsert("customers", [
        {
          full_name: "Adhe Wahyu",
          username: "adhe-wahyu",
          email: "adhewahyu@mail.com",
          phone_number: "08394837987"
        }, {
          full_name: "Deanita Nabilla",
          username: "deanita",
          email: "deanita@mail.com",
          phone_number: "0819847983"
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
    return queryInterface.bulkDelete('customers', null, {});
  }
};
