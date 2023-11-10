const { client } = require("../data/impl_integration");

module.exports = async function (globalConfig, projectConfig) {
  await client.orderStatus.deleteMany({
    where: {
      id: {
        in: [1, 2, 3, 4, 5, 6],
      },
    },
  });
};
