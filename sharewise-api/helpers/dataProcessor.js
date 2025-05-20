export const aggregateRequestsData = (requestsData) => {
  const aggregated = {};

  requestsData.forEach((request) => {
    const { itemName, quantity } = request;

    if (!aggregated[itemName]) {
      aggregated[itemName] = 0;
    }

    aggregated[itemName] += quantity;
  });

  const x = [];
  const y = [];

  Object.entries(aggregated).forEach(([itemName, totalQuantity]) => {
    x.push(itemName);
    y.push(totalQuantity);
  });

  return { x, y };
};
