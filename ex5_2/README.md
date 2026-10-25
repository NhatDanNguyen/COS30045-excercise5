# Exercise 5.2 — Scatter plot and line chart

Run a static HTTP server from this folder (for example, `python -m http.server 8000`) and open `http://localhost:8000`. D3 v7 loads from the CDN, so an internet connection is required.

The Exercise 5.1 bar chart remains above the new Exercise 5.2 line chart. Both use a 1000 × 500 viewBox with margins `{ top: 60, right: 30, bottom: 45, left: 60 }`.

## Exercise 5.2 implementation steps

1. `index.html` adds the unique `#line-chart` container below the bar chart and loads `js/line-chart.js` with `defer`, after D3.
2. Load `data/ARE_Spot_Prices.csv`. Read the exact headers `Year` and `averagePrice`, converting them to numeric `year` and `averagePrice` fields. Validate the values, sort by ascending year and log the 27 records to the console.
3. Define `drawLineChart(data)` with the same dimensions and margins as Exercise 5.1.
4. Create two `d3.scaleLinear()` scales. The x domain uses `d3.extent(data, d => d.year)` (1998–2024); the y domain runs from zero to the maximum average price (144.5). Reverse the y range because SVG coordinates increase downwards.
5. Create the bottom and left axes. Use `.tickFormat(d3.format("d"))` to display integer year ticks.
6. Create a responsive SVG and translate an inner group by the left and top margins. Add both axes, an average price label in $/MWh and a year label.
7. Draw the scatter plot with one green circle per year, setting `r`, `cx`, `cy` and `fill`. Each circle includes a native SVG title with its exact price.
8. Define `d3.line()` with the same x and y scales, then append a path with `fill="none"` and `stroke="green"`. This connects all 27 points chronologically, matching the brief's completed line chart.

The curve, area fill and removal of circles are optional experiments in the brief. The submitted chart retains the straight line and visible circles from the required worked example.


## Supplied data

`data/ARE_Spot_Prices.csv` contains 27 annual records for 1998–2024. The provided `averagePrice` averages Queensland, New South Wales, Victoria and South Australia; Tasmania and Snowy are excluded because their series do not cover the full period. Prices are dollars per megawatt hour, not TV energy consumption. The prices are retained unchanged.

## AI declaration

OpenAI Codex was used to implement the D3 line chart, fix script loading and data parsing, and add code comments and implementation documentation. It also assisted with JavaScript syntax checks and browser checks of chart rendering and data positions. The author remain responsible for carefully reviewing and have a good understanding before submission.

