const { client } = require("../data/impl_integration");

module.exports = async function(globalConfig, projectConfig) {
  try {
    await client.orderStatus.createMany({
      data: [
        { name: "Initialized", id: 1 },
        { name: "Confirmed", id: 2 },
        { name: "Cooking", id: 3 },
        { name: "Delivering", id: 4 },
        { name: "Completed", id: 5 },
        { name: "Cancelled", id: 6 },
      ],
    });
  } catch (e) {
    console.log("Seems like db is already populated");
  }
};
