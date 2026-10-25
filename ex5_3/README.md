# COS30045 — Exercise 5.3: Donut Chart

The existing WattWise TV Energy Guide now includes the Exercise 5.3 donut chart below the completed Exercise 5.1 bar chart and Exercise 5.2 scatter/line chart. The existing page structure, colours and earlier chart implementations are retained.

## Run locally

1. Open a terminal in this `ex5_3` folder.
2. Start a local HTTP server:

   ```powershell
   python -m http.server 8000 --bind 127.0.0.1
   ```

   On Windows, `py -m http.server 8000 --bind 127.0.0.1` is an alternative. VS Code Live Server can also serve `index.html`.
3. Open <http://127.0.0.1:8000/> in a browser. Scroll to Exercise 5.3 below the earlier charts.
4. Open the browser developer tools Console to inspect the parsed TV size counts. Stop the server with Ctrl+C when finished.

Serve over HTTP rather than double-clicking the HTML file: D3 loads the CSV files with fetch. Internet access is needed for the existing D3 v7 script at `https://d3js.org/d3.v7.min.js`. No build or npm install is required.

## Implementation steps aligned with the brief

1. **Preparation:** Give the donut its own `#donut-chart` container and section in `index.html`. Retain the existing `js/donutChart.js` filename to match this project's `barChart.js` and `lineChart.js` convention; the brief calls its example file `donut-chart.js`. Load D3 first, followed by the three chart scripts, using `defer` to preserve execution order after HTML parsing.
2. **Load data:** Read `data/sizeCount.csv` with `d3.csv`, keep the category in `Size`, and convert `Count` from a string to a number. Validate positive integer counts, log the typed rows, then call `drawDonutChart` inside `.then()` after loading finishes. Display a useful error if loading or drawing fails.
3. **Dimensions:** Use width 1000 and height 500, as in the code screenshot and earlier exercises. Calculate `Math.min(width, height) / 2 - 20`, giving an outer radius of 230 SVG units.
4. **Colour scale:** Use `d3.scaleOrdinal()` with the categories as the domain and `d3.schemeSet2` as the range. Large is teal, Medium orange and Small blue/purple.
5. **Angles:** Use `d3.pie().value(d => d.Count).sort(null)`. Keep the CSV order Large, Medium, Small; do not sort by count. Slices start at the top and proceed clockwise in that order.
6. **Arcs:** Use `d3.arc()` with inner radius `radius * 0.6` (138) and outer radius `radius * 1` (230).
7. **SVG containers:** Append an SVG to `#donut-chart`, set `viewBox="0 0 1000 500"`, and retain the example's black border. Translate the drawing group to `(500, 250)`. Reuse the page's responsive SVG class. Add an SVG title and description for accessibility.
8. **Draw slices:** Bind the pie results, join three paths, generate each path with `arcGenerator`, and colour it using `d.data.Size`. Use white outlines with a width of 2, as shown in the screenshot.
9. **Labels:** Bind the same slices to text elements. Place each category at `arcGenerator.centroid(d)` and centre the text horizontally and vertically. The page styles enlarge donut labels on narrow screens.

Comments in `js/donutChart.js` explain these steps, including why sorting is disabled and why the original row is accessed through `d.data`.

## Supplied data and reference differences

All three supplied CSV files are preserved without edits. The donut uses:

| Size | Count | Share (rounded) |
| --- | ---: | ---: |
| Large | 1,373 | 29.06% |
| Medium | 2,510 | 53.13% |
| Small | 841 | 17.80% |
| Total | 4,724 | 100% |

The brief's table screenshot instead shows `Screensize_Category,Count` with lowercase large/medium/small and counts 1352/2386/770. This implementation adapts the example's category accessor to the supplied `Size` header and preserves the supplied labels and values. The resulting proportions therefore differ slightly from the reference image. The supplied aggregate is used directly; no KNIME workflow or raw TV dataset was supplied for recreating it. Rounded shares above may not add to exactly 100%.

The brief refers once to adding a “new line chart” in its preparation text; its heading, container ID and code examples make clear that this means the donut chart.

**Required output implemented:** a labelled three-category donut using the given dimensions, Set2 colours, 60% inner radius, white slice outlines and centred SVG group. **Optional experiments omitted:** alternate colours, changing the radii into a pie, `padAngle`, `cornerRadius`, repositioning and additional interaction.

## Verification

Checks performed by Codex on 25 October 2026:

- Read the entire assignment reference and inspected all 11 relevant images (code screenshots, data table, workflow diagram and output examples).
- Ran `node --check` on `js/barChart.js`, `js/lineChart.js` and `js/donutChart.js`; all passed.
- Compared SHA-256 hashes of all three CSV files before and after editing; all were unchanged. Confirmed the donut counts total 4,724 and calculated the shares listed above.
- Served the finished project over HTTP and loaded it in the in-app Chromium browser. The test server used port 8001 because the first sandboxed preview attempt on port 8000 was inaccessible.
- Confirmed exactly three SVG charts: three bars, 27 annual price points with one connecting line, and three donut paths with three category labels. The earlier charts' category labels, rounded energy labels and integer year ticks were checked.
- Inspected the full desktop page at a 1280 × 720 viewport and the donut section at 390 × 844. The donut remained circular with all category labels inside their slices, matching the required colours, placement and white outlines. No horizontal page overflow was detected at either tested width.
- Inspected the generated donut path attributes: outer radius 230, inner radius 138, correct Set2 fills and white strokes of width 2. No SVG path contained `NaN` or `Infinity`.
- Confirmed the SVG description contains the supplied category counts, all chart error messages remain hidden, and the browser console has no warnings or errors. The three successful CSV load messages appear in the console.

Limitations: verification covers the tested Chromium browser and viewport sizes, not every browser or physical device. The external D3 CDN requires an internet connection. The original KNIME aggregation cannot be independently reproduced without the raw dataset/workflow; the reference screenshot's differing counts are intentionally not substituted for the supplied CSV.

## AI declaration

OpenAI Codex assisted with this exercise by reading the supplied assignment reference and its images, inspecting the existing HTML/CSS/JavaScript and CSV files, completing and commenting the donut chart code, correcting the container and data-field mistakes, integrating the new section into the existing design, writing these notes, and carrying out the checks described above. The earlier bar and line chart scripts were retained. The author is responsible for reviewing, testing and have a general understanding of the code provided.
