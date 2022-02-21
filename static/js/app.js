//load the samples dataset and read the file with D3
var selector = d3.select("#selDataset");
d3.json("data/samples.json").then(function(data) {
    console.log(data);
    var sampleNames = data.names;
    //Load the dropdown menu
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    //Set the values for the initial sample
    let initialsample = sampleNames[0];
    barchart(initialsample);
    DemoInfo(initialsample);
    gaugechart(initialsample);
});

//Create the bar chart
function barchart(initialsample){
        d3.json("data/samples.json").then(function(data) {
        let mainsample = data.samples;
        //Filtering for correct id 
        let sampledata = mainsample.filter(sampleid => sampleid.id == initialsample);
        let sample = sampledata[0];
        let otu_ids = sample.otu_ids;
        let sample_values = sample.sample_values;
        let otu_labels = sample.otu_labels;
        //Top 10 OTUs slicing
        let top_samplevalue;
        top_samplevalue = sample_values.slice(0,10).reverse();
        let top_sample_otu_ids;
        top_sample_otu_ids = otu_ids.slice(0,10).reverse();
        top_otu_labels = otu_labels.slice(0,10).reverse();
         
         let trace={
            x:top_samplevalue,
            y:top_sample_otu_ids.map(otuID => `OTU ${otuID}`),
            text:top_otu_labels,
            type:"bar",
            orientation:'h'
            };
        let traceData = [trace];
        
        let layout = {
            title: "Bar chart"
        };
        
        Plotly.newPlot("bar", traceData, layout);    
        bubblechart(sample);      
    });
}   
//create the bubble chart
function bubblechart(sample){
    let otu_ids = sample.otu_ids;
    let sample_values = sample.sample_values;
    let otu_labels = sample.otu_labels;

    let trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size:sample_values
        }
      };
    let data = [trace1];
    let layout = {
        title: 'Bubble Chart ',
        xaxis: { title: "OTU ID" }
    };
    
     
      Plotly.newPlot("bubble", data,layout);
}
////include Demographic Information
function DemoInfo(initialsample){
    d3.json("data/samples.json").then(function(data) {
        let sampledemo= data.metadata;
        let demodata= sampledemo.filter(sampleid => sampleid.id == initialsample);
        let demoresult=demodata[0];
       // Include sample-metadata
       let panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(demoresult).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
    });

    });
}
////create dropdown menu chnanging function
function optionChanged(sample) {
    
    //console.log(`dataset:`,sample);
    barchart(sample);
    DemoInfo(sample);
    gaugechart(sample)
}

//**Bonus** Creating the Gauge chart
function gaugechart(initialsample){
    d3.json("data/samples.json").then(function(data) {
        let sampledemo = data.metadata;
        let demodata = sampledemo.filter(sampleid => sampleid.id == initialsample);
        let demoresult = demodata[0];
        wfreq_value = demoresult.wfreq;
        var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq_value,
          title:{ text: "<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week" },
          type: "indicator",
          mode: "gauge+number",
          generateGradient: true,
          gauge: {
            axis: { range: [null, 9] },
            bar: { color: "black"},
            bgcolor: "black",
            steps: [
              { range: [0,1], color: "#f8f3ec" },
              { range: [1,2], color: "#f4f1e4" },
              { range: [2,3], color: "#e9e7c9" },
              { range: [3,4], color: "#e5e8b0" },
              { range: [4,5], color: "#d5e599" },
              { range: [5,6], color: "#b7cd8f" },
              { range: [6,7], color: "#8bc086" },
              { range: [7,8], color: "#89bc8d" },
              { range: [8,9], color: "#84b589" }
            ],
            }
        }
        ];
    
        var layout = { width: 550, height: 550};
        Plotly.newPlot('gauge', data, layout);
    });
}