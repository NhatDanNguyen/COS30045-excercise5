// COS30045 Data Visualisation
const drawDonutChart = data => {

  const width = 1000;
  const height = 500;
  const radius = Math.min(width, height) / 2 - 20;

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.Size))
    .range(d3.schemeSet2);

  const pie = d3.pie()
    .value(d => d.Count)
    .sort(null);

  const arcGenerator = d3.arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius * 1);

  const svg = d3.select("#donut-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-labelledby", "donut-chart-title donut-chart-description")
    .style("border", "1px solid black");

  svg.append("title")
    .attr("id", "donut-chart-title")
    .text("Proportion of TV models by screen size");

  svg.append("desc")
    .attr("id", "donut-chart-description")
    .text(data.map(d => `${d.Size}: ${d.Count} models`).join("; ") + ".");

  const innerChart = svg.append("g")
    .attr("class", "inner-chart")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const slices = pie(data);
  innerChart.selectAll(".donut-slice")
    .data(slices)
    .join("path")
    .attr("class", "donut-slice")
    .attr("d", arcGenerator)
    .attr("fill", d => color(d.data.Size))
    .attr("stroke", "white")
    .attr("stroke-width", 2);

  innerChart.selectAll(".donut-label")
    .data(slices)
    .join("text")
    .attr("class", "donut-label")
    .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .text(d => d.data.Size);
};

d3.csv("./data/sizeCount.csv", d => ({
  Size: d.Size,
  Count: +d.Count
})).then(data => {
  if (!data.length || data.some(d => !d.Size ||
      !Number.isInteger(d.Count) || d.Count <= 0)) {
    throw new Error("Expected screen-size categories and positive integer counts.");
  }

  drawDonutChart(data);
}).catch(error => {
  d3.select("#donut-chart-error")
    .property("hidden", false)
    .text("The TV size chart could not be loaded. Serve this folder over HTTP and check data/sizeCount.csv.");
  console.error("Unable to draw the TV size donut chart:", error);
});
