const { client } = require("../data/impl_integration");

module.exports = async function(globalConfig, projectConfig) {
  try {
    await client.orderStatus.deleteMany({
      where: {
        id: {
          in: [1, 2, 3, 4, 5, 6],
        },
      },
    });
  } catch (e) {
    console.log(`Could not teardown tests: ${e}`);
  }
};
