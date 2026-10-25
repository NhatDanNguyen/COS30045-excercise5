// COS30045 — Exercise 5.2: build a line chart from scaled scatter points.
const drawLineChart = data => {
  // 1. Match Exercise 5.1 so both charts share dimensions and plotting margins.
  const margin = { top: 60, right: 30, bottom: 45, left: 60 };
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // 2. Both variables are continuous; extent returns the earliest/latest years.
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.averagePrice)])
    .range([innerHeight, 0]);

  // 3. Integer formatting prevents commas or decimal places in year labels.
  const bottomAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"));
  const leftAxis = d3.axisLeft(yScale);

  // 4. Translate the plotting group once; all axes and marks use this origin.
  const svg = d3.select("#line-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-labelledby", "line-chart-title line-chart-description");

  svg.append("title")
    .attr("id", "line-chart-title")
    .text("Average Australian electricity spot prices, 1998–2024");

  svg.append("desc")
    .attr("id", "line-chart-description")
    .text("Annual averages for Queensland, New South Wales, Victoria and South Australia, in dollars per megawatt hour. " +
      data.map(d => `${d.year}: $${d.averagePrice}`).join("; ") + ".");

  const innerChart = svg.append("g")
    .attr("class", "inner-chart")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  innerChart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(bottomAxis);

  innerChart.append("g")
    .attr("class", "y-axis")
    .call(leftAxis);

  innerChart.append("text")
    .attr("class", "axis-label")
    .attr("x", -margin.left + 10)
    .attr("y", -25)
    .text("Average Price ($ per MWh)");

  innerChart.append("text")
    .attr("class", "axis-label x-axis-label")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 39)
    .attr("text-anchor", "middle")
    .text("Year");

  // 5. Draw the scatter points first, using the same scales as the axes.
  innerChart.selectAll(".price-point")
    .data(data)
    .join("circle")
    .attr("class", "price-point")
    .attr("r", 4)
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.averagePrice))
    .attr("fill", "green")
    .append("title")
    .text(d => `${d.year}: $${d3.format(".2f")(d.averagePrice)} per MWh`);

  // 6. Connect the points chronologically with the brief's straight green line.
  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.averagePrice));

  innerChart.append("path")
    .attr("class", "price-line")
    .attr("d", lineGenerator(data))
    .attr("fill", "none")
    .attr("stroke", "green");
};

// Read the CSV's exact headers, then convert both fields before scaling.
d3.csv("./data/ARE_Spot_Prices.csv", d => ({
  year: +d.Year,
  averagePrice: +d.averagePrice
})).then(data => {
  if (!data.length || data.some(d => !Number.isInteger(d.year) || d.year <= 0 ||
      !Number.isFinite(d.averagePrice) || d.averagePrice < 0)) {
    throw new Error("Expected numeric years and non-negative average electricity prices.");
  }

  // A line connects rows in order, so preserve the time sequence.
  data.sort((a, b) => d3.ascending(a.year, b.year));
  console.log("Electricity spot prices (numeric year and averagePrice):", data);
  drawLineChart(data);
}).catch(error => {
  d3.select("#line-chart-error")
    .property("hidden", false)
    .text("The electricity price chart could not be loaded. Serve this folder over HTTP and check data/ARE_Spot_Prices.csv.");
  console.error("Unable to draw the electricity price chart:", error);
});
