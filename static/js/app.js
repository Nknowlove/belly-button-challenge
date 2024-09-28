// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the metadata field
    const metadata = data.metadata;
    console.log(metadata)

    // Filter the metadata for the object with the desired sample number
    const sampleMetadata = metadata.filter(obj => obj.id === +sample)[0];
    console.log(sampleMetadata)

    // Check if sampleMetadata is defined
    if (sampleMetadata) {
    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");
    console.log(panel)

  
    // Use `.html("")` to clear any existing metadata
    panel.html("");
  
        // Inside a loop, you will need to use d3 to append new tags for each key-value in the filtered metadata
    Object.entries(sampleMetadata).forEach(([key, value]) => {
          panel.append("h6").text(`${key}: ${value}`);
        });
      } else {
        console.error("Sample metadata not found for sample:", sample);
      }
    });
  }
  

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;
    console.log(samples)

    // Filter the samples for the object with the desired sample number
    const sampleData = samples.filter(obj => obj.id === sample)[0];
    console.log(sampleData)

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = sampleData.otu_ids;
    const sample_values = sampleData.sample_values;
    const otu_labels = sampleData.otu_labels;
    console.log(otu_ids)
    console.log(sample_values)
    console.log(otu_labels)

    // Build a Bubble Chart
    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,    
        colorscale: 'Earth'  
      }
    };

    const bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
      hovermode: 'closest',
      height: 600,
      width: 1200
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
    console.log(yticks)

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const barTrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks.reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    const barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {
        title: 'Number of Bacteria',
        range: [20, 170]
      },
      yaxis: { title: 'OTU IDs' },
      margin: { t: 30, l: 150 }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [barTrace], barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;
    console.log(names)

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");
    console.log(dropdown)

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(name => {
      dropdown.append("option")
        .text(name)  // Set the text for the dropdown option
        .property("value", name);  // Set the value for the option
    });

    // Get the first sample from the list
    const firstSample = names[0];
    console.log(firstSample)

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();