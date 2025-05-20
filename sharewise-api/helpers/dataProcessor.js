const aggregateRequestsData = (requestsData) => {
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

const aggregateStylesData = (styleSaleResults) => {
  return styleSaleResults.reduce((acc, sale) => {
    acc[sale.style] = (acc[sale.style] || 0) + sale.saleNumber;
    return acc;
  }, {});
};

const formatStylesData = (aggregatedData) => {
  return {
    styles: Object.keys(aggregatedData),
    sales: Object.values(aggregatedData),
  };
};

module.exports = {
  aggregateRequestsData,
  aggregateStylesData,
  formatStylesData,
};
