let svgWidth = 1200;
let svgHeight = 700;

let margin = {
  top: 20,
  right: 100,
  bottom: 80,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3
  .select("#scatter")
  .append("svg")
  .classed('chart',true)
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenYAxis = "speechiness";

function yScale(detailData, chosenYAxis) {
    // create scales
    let yLinearScale = d3.scaleLinear()
      .domain([0,d3.max(detailData, d => d[chosenYAxis]) 
      ])
      .range([height, 0]);
    return yLinearScale;
}

function renderYAxes(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

function renderYBars(barsGroup, newYScale, chosenYAxis) {

  barsGroup.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYAxis]))
    .attr("height", d => height - newYScale(d[chosenYAxis]));

  return barsGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenYAxis, barsGroup) {

  let yLabel;

  if (chosenYAxis === "speechiness") {
    yLabel = "Number of speechiness:";
  }
  else if (chosenYAxis === "popularity"){
    yLabel = "Number of Popularity:";
  }
  else {
    yLabel = "Number of Energy:";
  };

  let toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([10, -10])
    .html(function(d) {
      return (`${d.Title}<br> ${yLabel} ${d[chosenYAxis]}`);
    });

  barsGroup.call(toolTip);

  barsGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  return barsGroup;
}

// Retrieve data from the url and execute everything below
var url ="http://127.0.0.1:5000/api/v1.0/top_50_2020_May"
d3.json(url).then(function(detailData, err) {
  if (err) throw err;
  // console.log()
  // parse data
  detailData.forEach(function(data) {
    data.speechiness = +data.speechiness;
    data.popularity = +data.popularity;
    data.energy = +data.energy;
    console.log(data.speechiness);

  });
  let title = []; 
  // var speechiness=[];
  // var popularity=[];
  detailData.forEach(d =>
    title.push(d.Title)
    );

    // var speechiness
  // console.log(title)
  // xLinearScale function above csv import
  let xLinearScale = d3.scaleBand()
    .domain(title) 
    .range([0, width])
    .padding(0.2);

  // Create y scale function
  let yLinearScale =yScale(detailData, chosenYAxis);

  // Create initial axis functions
  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  let xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  let yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial bars
  let barsGroup = chartGroup.selectAll("rect")
    .data(detailData)
    .enter()
    .append("rect")  
    .attr("x", d => xLinearScale(d.Title))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("width", xLinearScale.bandwidth())
    .attr("height", d => height - yLinearScale(d[chosenYAxis]))
    .attr("fill", "#28a745");

  // Create group for x/y axis labels
  let xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  let ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");
   
  xlabelsGroup.append("text")
    .classed('xText', true)
    .attr("x", 0)
    .attr("y", 60)
    .classed("active", true)
    .text("Top 50 tracks in May_2020");

  xAxis.selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  // append y axis
  let speechinessYLabel = ylabelsGroup.append("text")
    .classed('yText', true)
    .attr("y", 0 - margin.left+40)
    .attr("x", 0 - (height / 2))
    .attr("value", "speechiness")
    .classed("active", true)
    .text("Number of Speechiness");
  
  let popuYLabel = ylabelsGroup.append("text")
    .classed('yText', true)
    .attr("y", 0 - margin.left+50)
    .attr("x", 0 - (height / 2))
    .attr("value", "popularity")
    .attr("dy", "1em")
    .classed("inactive", true)
    .text("Number of Popularity");

  let energyYLabel = ylabelsGroup.append("text")
    .classed('yText', true)
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "energy")
    .attr("dy", "1em")
    .classed("inactive", true)
    .text("Number of Energy");

  // updateToolTip function above csv import
  barsGroup = updateToolTip(chosenYAxis, barsGroup);

    ylabelsGroup.selectAll(".yText")
    .on("click", function() {
      // get value of selection
      let value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(detailData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        barsGroup = renderYBars(barsGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        barsGroup = updateToolTip(chosenYAxis, barsGroup);

        // changes classes to change bold text
        if (chosenYAxis === "speechiness") {
          speechinessYLabel
            .classed("active", true)
            .classed("inactive", false);
          popuYLabel
            .classed("active", false)
            .classed("inactive", true);
          energyYLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "popularity"){
          popuYLabel
            .classed("active", true)
            .classed("inactive", false);
          speechinessYLabel
            .classed("active", false)
            .classed("inactive", true);
          energyYLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          speechinessYLabel
            .classed("active", false)
            .classed("inactive", true);
          popuYLabel
            .classed("active", false)
            .classed("inactive", true);
          energyYLabel
            .classed("active", true)
            .classed("inactive", false);
        };
      }
    });
}).catch(function(error) {
  console.log(error);
});
