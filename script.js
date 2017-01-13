var margin = { top: 30, right: 30, bottom: 40, left:50 } //object for margins
var height = 400 - margin.top - margin.bottom, //now take away those margin values so height is inside margin
    width = 600 - margin.left - margin.right,
    barWidth = 50,
    barOffset = 5;

var bardata = [];    

d3.json('mydata.json', function(data) {  //file contents stored in data
        
    for (key in data) { //if you have multi objects access like a object property: bardata.push(data[key.month].value)
        bardata.push(data[key]['Phos'])
    }
    
    var yScale = d3.scale.linear() //create a quantitative, linear scale, preserve proportional differences.
            .domain([0, d3.max(bardata)]) //this many numbers in domain
            .range([0, height]); //up to this number
    
    var xScale = d3.scale.ordinal()
            .domain(d3.range(0, bardata.length))    
            .rangeBands([0, width])    
    
    var canvas = d3.select('#chart').append('svg')         
            .style('background', '#E7E0CB') // distinguish chart area from margin
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')') //move it over by x and down from top
    
    canvas.selectAll('rect').data(bardata) //our transformed data array form above. Next step, move the bars down.            
            .enter().append('rect')                                                     
                .attr('width', barWidth - barOffset)                                                
                .attr('height', function(d,i) {
                    //return height + d.Phos;
                    return yScale(d);            
                })  
                .attr('y', function(d) {                     
                    //return height - d.Phos;
                    return height - yScale(d);
                })                
                .attr('x', function(d,i) {
                    return i * 50
                })
                .attr('fill','blue')
    
    canvas.selectAll('text')
            .data(data) //again our handle for the json content
            .enter()
                .append('text')
                .attr('fill', 'red')
                .attr('y', function(d,i) {
                    return i * 50 + 24;
                })
                .text(function(d) {
                    return d.label;
                })
                
    var vGuideScale = d3.scale.linear()
            .domain([0, d3.max(bardata)])
            .range([height, 0]) //go from height to 0 (backwards)
                
    var vAxis = d3.svg.axis()
        .scale(vGuideScale)
        .orient('left')
        .ticks(10)

    var vGuide = d3.select('svg').append('g')
        vAxis(vGuide)
        vGuide.attr('transform','translate(' + margin.left + ', ' + margin.top + ')') // moves the
        vGuide.selectAll('path') 
                .style({fill: 'none', stroke: "#000"})
        vGuide.selectAll('line') 
                .style({stroke: "#000"})
    
   //this adds the axis but it doesn't show it anywhere.
    var hAxis = d3.svg.axis()
        .scale(xScale) //remember the var xScale above is the numbers for our values in the horizontal axis
        .orient('bottom')
        .tickValues(xScale.domain().filter(function(d, i) {
            //return !(i % (bardata.length/5)); //get a number every fifth time for the amt of data i have.
            return bardata.length; //get a number every fifth time for the amt of data i have.
    
        }))
        

    var hGuide = d3.select('svg').append('g')
        hAxis(hGuide)
        hGuide.attr('transform','translate(' + margin.left + ', ' + (height + margin.top) + ')') // moves the
        hGuide.selectAll('path')
                .style({ fill: 'none', stroke: "#000"})
        hGuide.selectAll('line')
                .style({ stroke: "#000"})
    })

