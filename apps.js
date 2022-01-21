// Add names into dropdown
function init() {
    d3.json('samples.json').then((d) => {
        
        // Analize json
        console.log(d);
        
        // Get all information from each dictionary in json
        var names = d.names;
        var data = d.metadata;
        var sample = d.samples;

        // Fill dropdown
        var sel_id = d3.select('#selDataset')
        // console.log(names);
        names.forEach((n) => {
            // console.log(n);
            sel_id
                .append('option')
                .text(n)
                .property('value', n);
            });    
    
        var nameID = 940;
        sel_id.on("change", optionChanged);
        
        function barChart() {
            var samples = sample.filter(data => data.id == nameID);
            var sample_values = samples[0].sample_values.slice(0, 10);
            var otu_ids = samples[0].otu_ids.slice(0, 10);
            var otu_labels = samples[0].otu_labels.slice(0, 10);

            var trace1 = {
                x: sample_values.reverse(),
                y: otu_ids.map(o => `OTU ${o}`).reverse(),
                text: otu_labels,
                type: "bar",
                orientation: "h",
                marker: {
                    color: [
                        '#7be3b7',
                        '#94e6a9',
                        '#aee99d',
                        '#c9ea93',
                        '#e4ea8c',
                        '#ffe989',
                        '#f8cc84',
                        '#e8b182',
                        '#d19a81',
                        '#b4867d'
                    ]
                }
              };

            var layout = {
                title: 'Values of top 10 samples',
                xaxis: {
                    title: 'Count of sample values'
              },
              autosize: true
            }  
            
            var data = [trace1];

            Plotly.newPlot("bar", data, layout);
        }

        barChart();

        function table() {
            var metadata = data.filter(data => data.id == nameID);
            var meta = metadata[0];
            console.log(meta);
            
            var metable = d3.select('#sample-metadata');
            metable.html('');

            Object.entries(meta).forEach(([key, value]) => {
                metable.append("p").text(`${key}: ${value}`);
              });
        }

        table();

        function bubble() {
            var samples = sample.filter(data => data.id == nameID);
            var sample_values = samples[0].sample_values;
            var otu_ids = samples[0].otu_ids;
            var otu_labels = samples[0].otu_labels;

            var trace1 = {
                x: otu_ids,
                y: sample_values,
                mode: 'markers',
                text: otu_labels,
                marker: {
                  size: sample_values,
                  color: otu_ids
                }
              };
              
              var data = [trace1];
              
              var layout = {
                title: 'Samples by ID and values',
                showlegend: false,
                autosize: true
              };
              
              Plotly.newPlot('bubble', data, layout);
        }

        bubble();

        function gauge() {
            var metadata = data.filter(data => data.id == nameID);
            var wfreq = metadata[0].wfreq;
            var ind = 180 - (parseFloat(wfreq) * 20);

            var r2 = 0.5;
            var rad = (ind * Math.PI) / 180;
            var x = r2 * Math.cos(rad);
            var y = r2 * Math.sin(rad);

            // Path: may have to change to create a better triangle
            var mainPath = "M -.0 -0.02 L .0 0.08 L ";
            var pathX = String(x);
            var space = " ";
            var pathY = String(y);
            var pathEnd = " Z";
            var path = mainPath.concat(pathX, space, pathY, pathEnd);

            var data1 = [{
                type: "scatter",
                x: [0],
                y: [0],
                marker: {
                    size: 30,
                    color: "black"
                },
                showlegend: false,
                name: "Frequency",
                text: wfreq,
                hoverinfo: "text+name"
                },{
                values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
                rotation: 90,
                text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
                textinfo: "text",
                textposition: "inside",
                marker: {
                    colors: [
                        '#7be3b7',
                        '#94e6a9',
                        '#aee99d',
                        '#c9ea93',
                        '#e4ea8c',
                        '#ffe989',
                        '#f8cc84',
                        '#e8b182',
                        '#d19a81',
                        "#FFFFFF"
                    ]
                },
                labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
                hoverinfo: "label",
                hole: .6,
                type: "pie",
                showlegend: false
                }
            ];

            var layout1 = {
                shapes: [
                {
                    type: "path",
                    path: path,
                    fillcolor: "black",
                    // line: {
                    // color: "black"
                    // }
                }
                ],
                title: "Scrubs per Week",
                autosize: true,
                xaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
                },
                yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
                }
            };            
            Plotly.newPlot('gauge', data1, layout1);
        }

        gauge();

        function optionChanged () {
            nameID = sel_id.property("value");
            barChart(nameID);
            table(nameID);
            bubble(nameID);
            gauge(nameID);
        };    
    })
}

init(); 