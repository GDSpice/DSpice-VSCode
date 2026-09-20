/*
#-------------------------------------------------------------------------------
# Name:        plots.js
# Purpose:     DSpice
# Author:      d.fathi
# Created:     06/11/2021
# Copyright:  (c) DSpice 2021-2026
# Licence:
#-------------------------------------------------------------------------------
 */
/*
Despite the fact that Plotly.js is open source, it is licensed under the MIT license, which means that you can use it for free in your own projects, 
even commercial ones. However, if you want to use Plotly.js in a commercial product, you may need to purchase a commercial license from Plotly.
it used in this project for plotting graphs and visualizing data. It provides a wide range of chart types and customization options, making it a popular
 choice for data visualization in web applications.

*/


function plots() {
    var npoints = 10000;
    var y = [];
    for (var i = 0, l = npoints; i < l; i++) {
        y.push(Math.random())
    };

    var x = [];
    for (var i = 0, l = npoints; i < l; i++) {
        x.push(i);
    };

    var listForPlot = document.getElementsByName('plots');
    for (var i = 0; i < listForPlot.length; i++) {
        Plotly.plot(listForPlot[i], [{
                    type: 'scatter',
                    x: x,
                    y: y
                }
            ], {
            margin: {
                l: 5,
                r: 5,
                b: 5,
                t: 5,
                pad: 4
            },
            paper_bgcolor: '#7f7f7f',
            plot_bgcolor: '#c7c7c7'
        });
        Plotly.redraw(listForPlot[i]);
    }

}
/*

var plotConfig = {
    displaylogo: false,
    modeBarButtonsToRemove: ['toImage', 'pan2d', 'toggleSpikelines', 'select2d', 'lasso2d', 'resetScale2d']
};
*/

// ============================================
// Custom button icon for opening in a new window
// ============================================
var openExternalIcon = {
    width: 1000,
    height: 1000,
    path: 'M786 296v-267q0-15-11-26t-25-10h-214v214h-143v-214h-214q-15 0-25 10t-11 26v267q0 1 0 2t0 2l321 264 321-264q1-1 1-4z m124 39l-34-41q-5-5-12-6h-2q-7 0-12 3l-386 322-386-322q-7-4-13-4-7 2-12 7l-35 41q-4 5-3 13t6 12l401 334q18 15 42 15t43-15l136-114v109q0 8 5 13t13 5h107q8 0 13-5t5-13v-227l122-102q5-5 6-12t-4-13z',
    transform: 'matrix(1 0 0 -1 0 850)'
};

// ============================================
// Plotly configuration for the plots
// ============================================
var plotConfig = {
    displaylogo: false,
    modeBarButtonsToAdd: [
        {
            name: 'openExternal',
            title : 'Open in New Window',
            icon: openExternalIcon,
            click: function(gd) {
                // Get the data and layout from the current plot
                var data = gd.data;
                var layout = gd.layout;
                
                // Check if the Electron API is available
                if (window.electron && window.electron.openGraphWindow) {
                    window.electron.openGraphWindow({
                        data: data,
                        layout: layout,
                        title: layout.title ? layout.title.text : 'Analysis Graph'
                    });
                } else {
                    // Fallback for non-Electron environments: open in a new browser window
                    var graphData = JSON.stringify({data: data, layout: layout});
                    var newWindow = window.open('', '_blank');
                    newWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Graph - Full View</title>
                            <script src="https://cdn.plot.ly/plotly-latest.min.js"><\/script>
                            <style>
                                body { margin: 0; padding: 0; overflow: hidden; background: #fff; }
                                #graph { width: 100vw; height: 100vh; }
                            </style>
                        </head>
                        <body>
                            <div id="graph"></div>
                            <script>
                                var graphData = ${graphData};
                                Plotly.newPlot('graph', graphData.data, graphData.layout, {
                                    displayModeBar: true,
                                    displaylogo: false
                                });
                            <\/script>
                        </body>
                        </html>
                    `);
                }
            }
        }
    ],
    modeBarButtonsToRemove: ['sendDataToCloud', 'resetScale2d'] // Remove the default "Send to Cloud" button
};

function addPlot(elem) {
	creatPin(elem);
	creatPin(elem);
	elem.childNodes[1].childNodes[0].style.stroke = "#0000ff";

    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
   // newElement.setAttribute("class", "draggable");
    newElement.setAttribute("x", 0);
    newElement.setAttribute("y", 0);
    newElement.setAttribute("width", 220);
    newElement.setAttribute("height", 180);
    newElement.innerHTML = "<div name='plots' style='border-style: double;' ></div>";
    elem.appendChild(newElement);
}

function newPlots(element) {
  var layout = {
      margin: {
          l: 35,
          r: 25,
          b: 35,
          t: 35
      },
  xaxis: {
          title:{text:''},
          showgrid:true,
          gridcolor:"#000000",
          autorange: true
      },
  yaxis: {
          gridcolor:"#000000",
          showgrid:true,
          autorange: true
      },
  title:' ',
  font: {
          size: 12,
          family: 'sans-serif',
          color:'#000000'
      },
  legend:{
    font:
    {family: 'sans-serif',
    size: 9,
    color: '#000000'},
    bgcolor: '#E2E2E2',
    bordercolor: '#FFFFFF',
    borderwidth: 1},
    showlegend: true,
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#ffffff',
    bordercolor: '#000000',

    grid: {
    rows: 1,
    columns: 1,
    pattern: 'independent',
    roworder: 'bottom to top'
  }
  };


    var e = element.lastChild.firstChild;
    Plotly.plot(e, [{
                type: 'scatter',
                x: [],
                y: []
            }
        ], layout, plotConfig);

}





function plotsSaveDataLayoutInDiv() {
    var listForPlot = document.querySelectorAll('[name="plots"]');
    for (var i = 0; i < listForPlot.length; i++) {
        var gd = listForPlot[i];
        layout = JSON.stringify(gd.layout);
        data = JSON.stringify(gd.data);
        //alert(data);
        listForPlot[i].setAttribute("layout", layout);
        listForPlot[i].setAttribute("data", data);
    }
}




function plotsOpenDataLayoutInDiv() {

         var listForPlot = document.querySelectorAll('[name="plots"]');
    for (var i = 0; i < listForPlot.length; i++) {

        layout = JSON.parse(listForPlot[i].getAttribute("layout"));
        data = JSON.parse(listForPlot[i].getAttribute("data"));
        Plotly.plot(listForPlot[i], data, layout, plotConfig);
    }
}

function showPlotInModel(self) {
 
}






