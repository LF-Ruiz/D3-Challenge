// @TODO: YOUR CODE HERE!
// define variables and functions

//define svg mesurements and margins
let svgWidth = 960;
let svgHeight = 600;

let margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

//define chart measurements
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
let svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

let chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

function makeResponsive() {



    // Import Data
    d3.csv("assets/data/data.csv").then(function (censusData) {
        console.log('promise fulfilled')
        //console.log(censusData)
        // Step 1: Parse Data/Cast as numbers
        censusData.forEach(function (data) {
            
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.income = +data.income;
            data.smokes = +data.smokes;
            data.obesity = +data.obesity;
        });
        //console.log(censusData);

        // Step 2: Create scale functions
        // ==============================
        let xPovertyScale = d3.scaleLinear()
            .domain([d3.min(censusData, d => d.poverty) - 1, d3.max(censusData, d => d.poverty) + 2])
            .range([0, width]);


        let yHealthScale = d3.scaleLinear()
            .domain([d3.min(censusData, d => d.healthcare) - .4, d3.max(censusData, d => d.healthcare) + 2])
            .range([height, 0]);



        // Step 3: Create axis functions
        // ==============================
        let bottomAxis = d3.axisBottom(xPovertyScale).ticks(10);
        let leftAxis = d3.axisLeft(yHealthScale).ticks(15);

        // Step 4: Append Axes to the chart
        // ==============================
        // Add x-axis
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis)


        // Add y1-axis to the left side of the display
        chartGroup.append("g")
            .call(leftAxis);

        // Step 5: Create Circles
        // ==============================
        let circlesGroup = chartGroup.selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .attr("cx", d => xPovertyScale(d.poverty))
            .attr("cy", d => yHealthScale(d.healthcare))
            .attr("r", "15")
            .classed("stateCircle", true)
            .attr("stroke-width", "2")
            .attr("stroke", "blue");

        // Step 5: add text
        // ==============================
        let circlesLabel =
            chartGroup.selectAll(null).data(censusData).enter().append('text');

        // console.log(circlesLabel) // check if the text has been appended
        //add text to the group using d.abbr
        circlesLabel
            .attr("x", function (d) {
                return xPovertyScale(d.poverty);
            })
            .attr("y", function (d) {
                return yHealthScale(d.healthcare);
            })
            .text(function (d) {
                return d.abbr;
            })
            .attr("font-size", "10px")
            .classed("stateText", true)


        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("In Poverty (%)");



    }).catch(function (error) {
        console.log(error);
    });


}

// make responsive to size of browser
makeResponsive();