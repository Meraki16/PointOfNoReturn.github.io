   // create map
   var width = (window.innerWidth * 0.96),
       height = (window.innerHeight * 1);

   var map = new Datamap({
       element: document.getElementById('map'),
       height: height,
       width: width,
       fills: {
           defaultFill: 'rgba(219, 219, 219, 1)' // Any hex, color name or rgb/rgba value
       },
       geographyConfig: {
           highlightOnHover: false,
           popupOnHover: false
       }
   });

   var svg = map.svg;
   var force = d3.layout.force()
       .gravity(.05)
       .distance(100)
       .charge(-100)
       .size([width, height]);

   var graphdata = {};

   d3.json("data/GraphData.json", function(error, graph) {
       Object.assign(graphdata, graph.nodes);
   })

   d3.json("data/GraphData.json", function(json) {
       force
           .nodes(json.nodes)
           .links(json.links)
           .start();

       // create nodes with classes according to temp
       var node = svg.selectAll(".node")
           .data(json.nodes)
           .enter().append("g")
           .attr("class", function(d) {
               if (d.tempStart == 1 && d.tempEnd == 3) {
                   return "group-1"
               } else {
                   if (d.tempStart == 3 && d.tempEnd == 5) {
                       return "group-2"
                   } else {
                       return "group-3"
                   }
               }
           })
           .call(force.drag);

       // create paths linking the nodes
       var link = svg.selectAll(".link")
           .data(json.links)
           .enter().append("path")
           .attr("class", function(d) {
               if (d.source.tempStart == 1 && d.source.tempEnd == 3 && d.target.tempStart == 1 && d.target.tempEnd == 3) {
                   return "link-group-1"
               } else {
                   if (d.source.tempStart == 3 && d.source.tempEnd == 5 && d.target.tempStart == 1 && d.target.tempEnd == 3) {
                       return "link-group-2"
                   } else {
                       return "link-group-3"
                   }
               }
           })
           .style("fill", "none")
           .attr("pointer-events", "visibleStroke")
           .style("stroke-width", 1);

       // create ellipse for each process
       node.append("ellipse")
           .attr("rx", "6")
           .attr("ry", "2.5")
           //    .attr('cx', function(d) {
           //        return json.nodes.px;
           //    })
           //    .attr('cy', function(d) {
           //        return json.nodes.py;
           //    })
           .style("fill-opacity", 0.6)

       // create text with the name of each process
       node.append("text")
           .attr("text-anchor", "middle")
           .attr("dy", ".3em")
           //    .attr("dx", json.nodes.x)
           //    .attr("dy", json.nodes.y)
           .text(function(d) {
               return d.name
           });

       node.attr("transform", function(d) {
           return "translate(" + d.x + "," + d.y + ")";
       });

       force.on("tick", function() {
           link.attr("d", function(d) {
               var dx = graphdata[d.target.id].x - graphdata[d.source.id].x,
                   dy = graphdata[d.target.id].y - graphdata[d.source.id].y,
                   dr = Math.sqrt(dx * dx + dy * dy);

               return "M" + graphdata[d.source.id].x + "," + graphdata[d.source.id].y + "A" + dr + "," + dr + " 0 0,1 " + graphdata[d.target.id].x + "," + graphdata[d.target.id].y;
           });
       });
   });




// handle scrolling and trigger stroke width and ellipse size adaptions

window.addEventListener('scroll', function () {
    if (pageYOffset < document.getElementById('timeline-1').offsetTop) {

        keepEllipseSizeAtOne('1');
        keepEllipseSizeAtOne('2');
        keepEllipseSizeAtOne('3');

    }

    else if (pageYOffset < document.getElementById('timeline-2').offsetTop && pageYOffset >= document.getElementById('timeline-1').offsetTop && ((pageYOffset - document.getElementById('timeline-1').offsetTop) / 55) >= 1) {

        adaptStrokeWidth('1', 150);

        changeEllipseSize('1', 55);
        keepEllipseSizeAtOne('2');
        keepEllipseSizeAtOne('3');

    }
    else if (pageYOffset < document.getElementById('timeline-3').offsetTop && pageYOffset >= document.getElementById('timeline-2').offsetTop && ((pageYOffset - document.getElementById('timeline-2').offsetTop) / 55) >= 1) {

        adaptStrokeWidth('2', 150);

        keepEllipseSize('1', 55);
        changeEllipseSize('2', 55);
        keepEllipseSizeAtOne('3');

    }
    else if (pageYOffset >= document.getElementById('timeline-3').offsetTop && ((pageYOffset - document.getElementById('timeline-3').offsetTop) / 15) >= 1) {

        adaptStrokeWidth('3', 55);

        keepEllipseSize('1', 55);
        keepEllipseSize('2', 55);
        changeEllipseSize('3', 15);
    }

});


var keepEllipseSizeAtOne = function (groupNumber) {
    svg.selectAll(".group-" + groupNumber).select("ellipse")
        .attr("transform", function () {
            return "scale(" + 1 + ")";
        })
}

var changeEllipseSize = function (groupNumber, factor) {
    svg.selectAll(".group-" + groupNumber).select("ellipse")
        .attr("transform", function () {
            return "scale(" + (pageYOffset - document.getElementById('timeline-' + groupNumber).offsetTop) / factor + ")";
        })
}


var keepEllipseSize = function (groupNumber, factor) {
    svg.selectAll(".group-" + groupNumber).select("ellipse")
        .attr("transform", function () {
            return "scale(" + (document.getElementById('timeline-' + (parseInt(groupNumber) + 1)).offsetTop - document.getElementById('timeline-' + groupNumber).offsetTop) / factor + ")";
        })
}


var adaptStrokeWidth = function (timelineNumber, factor) {
    if (((pageYOffset - document.getElementById('timeline-' + timelineNumber).offsetTop) / factor) >= 1) {
        svg.selectAll(".link-group-" + timelineNumber).
            style("stroke-width", function () {
                return (pageYOffset - document.getElementById('timeline-' + timelineNumber).offsetTop) / factor;
            });
    }
}