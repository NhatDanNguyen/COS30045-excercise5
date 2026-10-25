# Exercise 5.1 — Vertical bar chart with axes

Run a static HTTP server from this folder (for example, `python -m http.server 8000`) and open `http://localhost:8000`. D3 v7 loads from the CDN, so an internet connection is required.

## Implementation steps

1. `index.html` loads `css/style.css`, D3 and `js/barChart.js`, and provides the unique `#bar-chart` target.
2. The CSV uses the concise headers `Screen_Tech` and `Energy_Consumption`. The loader converts averages to numbers, logs them and sorts them from highest to lowest.
3. `drawBarChart` creates a responsive 1000 × 500 SVG and translates an inner group by the left and top margins.
4. A band scale positions screen types on x. A linear scale maps energy consumption from zero to the data maximum, rounds the domain with `.nice()`, and reverses the y range.
5. The bottom and left axes use these scales. The bottom axis is translated to the baseline; the energy label sits in the top margin.
6. Green `.bar` rectangles use the band width and `innerHeight - yScale(value)` for their height. Centred labels show rounded kWh values above the bars.

The final customisation removes x tick marks, increases label sizes and reserves space for the labels, as requested by the brief. The existing energy guide layout is retained.

## Supplied data

`data/screenTypeEnergy55inch.csv` was processed via a KNIME workflow using a descriptive file name and a streamlined energy column header, preserving the original file as the source. Due to minor variations from the assignment's worked example, the final labels are LCD (LED): 368 kWh, OLED: 368 kWh, and LCD: 338 kWh. Sorting and bar heights are based on unrounded values, ensuring LCD (LED) remains ranked first.

The chart treats the supplied file as the prepared averages for 55-inch TVs. The project contains no model-level source data or KNIME workflow, so the original filtering and grouping cannot be independently checked here.
