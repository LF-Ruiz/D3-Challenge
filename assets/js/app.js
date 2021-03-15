// @TODO: YOUR CODE HERE!
// define variables and functions

// Set svg measurement
let svgWidth = 960;
let svgHeight = 500;

// set margin
let margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

// set width and height of the chart
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;
console.log(width)

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3
    .select(".scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    let label;

    if (chosenXAxis === "obesity") {
        label = "Obesity: ";
    }
    else {
        label = "Income: ";
    }

    // let toolTip = d3.tip()
    //   .attr("class", "tooltip")
    //   .offset([80, -60])
    //   .html(function(d) {
    //     return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
    //   });
    let toolTip = d3.select('body').append('div').classed('tooltip', true);

    //circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (event, d) {
        //toolTip.show(data);
        toolTip.style('display', 'block')
            .html(`${d.state}<br>${label} ${d[chosenXAxis]}`)
            .style('left', event.pageX + 'px')
            .style('top', event.pageY + 'px');

    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            //toolTip.hide(data);
            toolTip.style('display', 'none');
        });

    return circlesGroup;
}




// Retrieve the data in  the csv using d3.csv (make sure d3 is in the html)
d3.csv("./assets/data/data.csv").then(function (data, err) {
    if (err) throw err;
    console.log(data[0]) // log to console to make sure the data is being read
    console.log(data[1])// log to console to make sure the data is being read

    // parse data
    data.forEach(function (data) {
        data.income = +data.income;
        data.obesity = +data.obesity;
        
        // data.num_albums = +data.num_albums;
    });
    console.log(data.income)
    // xLinearScale function above csv import
    let xLinearScale = xScale(data, chosenXAxis);

    // Create y scale function
    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.income)])
        .range([height, 0]);
    console.log(yLinearScale)
    // Create initial axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);
    console.log(bottomAxis)
    // append x axis
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    // append y axis
    chartGroup.append("g")
        .call(leftAxis);
    // append initial circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.num_hits))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");

    // Create group for two x-axis labels
    let labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    console.log(labelsGroup)
    let obesityLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "obesity") // value to grab for event listener
        .classed("active", true)
        .text("Obesity");

    let incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Income");

    // append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Obesity rate");

    // updateToolTip function above csv import
    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            let value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(hairData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "income") {
                    albumsLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    hairLengthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

}).catch(function (error) {
    console.log(error);
});

// let dataCsv = d3.csv(assets / data / data.csv)
// console.log(data)

// d3.csv("assets/data/data.csv").then(function(Data, err) {
//     if (err) throw err,
//     console.log(Data)
// }