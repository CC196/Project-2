// Use the D3 library to read in url

var url = "http://127.0.0.1:5000/api/v1.0/top50_country_2020_May"

// Initialize the page with the first country top 50 chart
function init() {
    var dropDown = d3.select("#selDataset")
    d3.json(url).then(function(data) {
        var countries = data[0]
    
        Object.keys(countries).forEach(function(key) {
            dropDown.append("option").text(key)
            console.log(key, countries[key]);
        });
    })
    getSongData("Argentina") 

};

// Update the table any time a new sample is selected.
function optionChanged(country) {
    getSongData(country)

};

// Create a function to get song data
function getSongData(sample) {
    
    d3.json(url).then(function(data) {
    var rank = []
    var title = []
    var artist = []
    var filteredTable  = data[0][sample]
        // console.log(filteredTable)
         filteredTable.forEach(song => { 
            rank.push(song["Rank"])
            title.push(song["Title"])
            artist.push(song["Artists"])
    
    });
    console.log(rank)
    buildTable(rank, title, artist);
  })
}
  // Create a function to build table with song data
  function buildTable(rank, title, artist) {
    var table = d3.select("#summary-table");
    var tbody = table.select("tbody");
    var trow;
    tbody.html("")
    for (var i = 0; i < 50; i++) {
      trow = tbody.append("tr");
      trow.append("td").text(rank[i]);
      trow.append("td").text(title[i]);
      trow.append("td").text(artist[i]);
      
    }
  }

// Initialize
init();
