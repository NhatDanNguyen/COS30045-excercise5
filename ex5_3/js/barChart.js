// COS30045 — Exercise 5.1: vertical bars with scaled axes and labels.
const drawBarChart = data => {
  // 1. Reserve margins for axis ticks, the energy label and value labels.
  const margin = { top: 60, right: 30, bottom: 45, left: 60 };
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-labelledby", "bar-chart-title bar-chart-description");

  svg.append("title")
    .attr("id", "bar-chart-title")
    .text("Average annual energy consumption by screen type for 55-inch TVs");

  svg.append("desc")
    .attr("id", "bar-chart-description")
    .text("Screen types ordered from highest to lowest average annual energy use. " +
      data.map(d => `${d.Screen_Tech}: ${d.Energy_Consumption} kWh/year`).join("; ") + ".");

  // 2. Move the plotting origin inside the margins; all marks use this group.
  const innerChart = svg.append("g")
    .attr("class", "inner-chart")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // 3. Categories use bands; the reversed numeric range makes larger bars taller.
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.Screen_Tech))
    .range([0, innerWidth])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Energy_Consumption)])
    .nice() // Round the upper bound to leave space above the highest bar.
    .range([innerHeight, 0]);

  // 4. Remove category tick marks and move the bottom axis to the baseline.
  const bottomAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(12);
  const leftAxis = d3.axisLeft(yScale).ticks(8).tickSizeOuter(0);

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
    .attr("text-anchor", "start")
    .text("Energy Consumption (kWh/year)");

  // 5. SVG y starts at the top, so bar height is the baseline minus scaled y.
  innerChart.selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("width", xScale.bandwidth())
    .attr("height", d => innerHeight - yScale(d.Energy_Consumption))
    .attr("x", d => xScale(d.Screen_Tech))
    .attr("y", d => yScale(d.Energy_Consumption))
    .attr("fill", "green");

  // 6. Round only the displayed labels; scales retain the original precision.
  innerChart.selectAll(".value-label")
    .data(data)
    .join("text")
    .attr("class", "value-label")
    .attr("x", d => xScale(d.Screen_Tech) + xScale.bandwidth() / 2)
    .attr("y", d => yScale(d.Energy_Consumption) - 8)
    .attr("text-anchor", "middle")
    .text(d => `${d3.format(".0f")(d.Energy_Consumption)} kWh`);
};

// CSV values arrive as strings; convert the averages before sorting and scaling.
d3.csv("./data/screenTypeEnergy55inch.csv", d => ({
  Screen_Tech: d.Screen_Tech,
  Energy_Consumption: +d.Energy_Consumption
})).then(data => {
  if (!data.length || data.some(d => !d.Screen_Tech ||
      !Number.isFinite(d.Energy_Consumption) || d.Energy_Consumption <= 0)) {
    throw new Error("Expected screen types and positive numeric energy averages.");
  }

  data.sort((a, b) => d3.descending(a.Energy_Consumption, b.Energy_Consumption));
  console.log("55-inch TV energy averages (numeric), sorted descending:", data);
  drawBarChart(data);
}).catch(error => {
  d3.select("#chart-error")
    .property("hidden", false)
    .text("The chart could not be loaded. Serve this folder over HTTP and check data/screenTypeEnergy55inch.csv.");
  console.error("Unable to draw the screen type energy chart:", error);
});
