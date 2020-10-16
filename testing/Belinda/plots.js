// Create two arrays, each of which will hold data for a different trace

    var dance1= [];
    var dance2 = [];

// read data  and fill each of the above array with data
d3.json("http://127.0.0.1:5000//api/v1.0/top_50_2019").then(function(data){
   for (var i=0; i < data.length; i++)
   console.log(data[i]["danceability"])
get_musicFeat(data)
    // nineteen = data
})
function get_musicFeat(dancydata){    
d3.json("http://127.0.0.1:5000//api/v1.0/top_50_2020_May").then(function(data){
    for (var i=0; i < data.length; i++){
        dance1.push(dancydata[i]["danceability"]);
        dance2.push(data[i]["danceability"]*100);
    
    console.log(data[i]["danceability"]*100)
    
    }
get_dancebox(dance1,dance2)

});
} 
function get_dancebox(dance1,dance2){
// Create a trace object with the data in `dance1`
    var trace1 = {
    y: dance1,
    boxpoints: "all",
    type: "box",
    name: "2019"
  };

// Create a trace object with the data in `dance2`
    var trace2 = {
    y: dance2,
    boxpoints: "all",
    type: "box",
    name: "2020"
  };

// Create a data array with the above two traces
    var danceFeat = [trace1, trace2];

 // Use `layout` to define a title
    var layout = {
     title: "Danceability Comparison btwn 2019 - 2020"
  };   

// Render the plot to the `plot1` div
    Plotly.newPlot("plots", danceFeat, layout);
}


