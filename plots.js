// Create two arrays, each of which will hold data for a different trace

    var dance1= [];
    var dance2 = [];

// read data  and fill each of the above array with data
function get_first(feat,plotnumber){
d3.json("http://127.0.0.1:5000//api/v1.0/top_50_2019").then(function(data){
//    for (var i=0; i < data.length; i++)
//    console.log(data[i][feat])
    get_musicFeat(data,feat,plotnumber)
    // nineteen = data
})}
function get_musicFeat(dancydata,feat,plotnumber){    
d3.json("http://127.0.0.1:5000//api/v1.0/top_50_2020_May").then(function(data){
    for (var i=0; i < data.length; i++){
        dance1.push(dancydata[i][feat]);
        if (feat === "loudness"){
            dance2.push(data[i][feat])
        }else{
            dance2.push(data[i][feat]*100);
        }
        
    
    // console.log(data[i][feat]*100)
    
    }
get_dancebox(dance1,dance2,feat,plotnumber)

});
} 
function get_dancebox(dance1,dance2,feat,plotnumber ){
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
     title: `${feat} comparison btwn 2019 - 2020`
  };   

// Render the plot to the `plot1` div
    Plotly.newPlot(plotnumber, danceFeat, layout);
}


get_first("danceability","plot1")
get_first("valence","plot2")
get_first("loudness","plot3")