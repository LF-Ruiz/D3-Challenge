// @TODO: YOUR CODE HERE!
// define variables and functions

//define svg mesurements and margins
// let svgWidth = 960;
// let svgHeight = 600;
  // svg params
let svgHeight = window.innerHeight;
let svgWidth = window.innerWidth;

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

        //============================================================================
        // Bonus D3-data journalism
        let chosenXAxis = "poverty";
        let chosenYAxis = "healthcare";

        // =========
        // function to update circle group using Tooltip
        // ==============================
        function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

            if (chosenXAxis === "poverty") {
                let xLabel = "Poverty (%)";
            }
            else if (chosenXAxis === "age") {
                let xLabel = "Age (Median)";
            }
            else {
                let xLabel = "Household Income (Median)";
            }
            if (chosenYAxis === "healthcare") {
                let yLabel = "Lacks Healthcare (%)";
            }
            else if (chosenYAxis === "smokes") {
                let yLabel = "Smokes (%)";
            }
            else {
                let yLabel = "Obese (%)";
            }

            // Initialize tool tip
            // ==============================
            let toolTip = d3.tip()
                // .classed("tooltip", true)
                // .classed("d3-tip",true)
                .attr("class", "tooltip d3-tip")
                .offset([80, 80])
                .html(function (d) {
                    return (`<strong>${d.state}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
                });
            // Create Circles 
            circlesGroup.call(toolTip);
            // event listeners to display and hide the tooltip
            circlesGroup.on("mouseover", function (data) {
                toolTip.show(data, this);
            })
                // mouseout Event
                .on("mouseout", function (data) {
                    toolTip.hide(data);
                });


            // create text tooltip
            textGroup.call(toolTip);
            // event listeners to display and hide the tooltip
            textGroup.on("mouseover", function (data) {
                toolTip.show(data, this);
            })
                //mouseout event
                .on("mouseout", function (data) {
                    toolTip.hide(data);
                });

            return circlesGroup;
        }
    }).catch(function (error) {
            console.log(error);
        });


}

// make responsive to size of browser
makeResponsive();

d3.select(window).on("resize", makeResponsive);
