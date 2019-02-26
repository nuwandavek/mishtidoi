const red_shade = '#c0392b';
const black_shade = '#333';
const cream_shade = '#eee';
const blue_shade = '#2980b9';
const yellow_shade = '#f39c12';
const green_shade = '#27ae60';
const purple_shade = '#8e44ad';
const torq_shade = '#16a085';
const topCities = ['ncr','mumbai','bangalore','hyderabad','pune','chennai','kolkata'];
const allCuisines = ['North Indian','Mughlai','Rolls','Chinese','Fast Food','Street Food','Cafe','Italian','Continental','Pizza','Desserts','Bakery','Mithai','South Indian','Rajasthani','Burger','Ice Cream','Beverages','Awadhi','Indian','American','Biryani','Tea','Momos','Asian','European','Mediterranean','Sandwich','Kebab','Finger Food','Mexican','Thai','Japanese','Korean','North Eastern','Paan','Healthy Food','Salad','Lebanese','Afghani','Gujarati','Wraps','Juices','Bengali','Arabian','Assamese','Mishti','Modern Indian','Hyderabadi','Maharashtrian','Goan','BBQ','Oriental','Seafood','Coffee','Sindhi','Kerala','Bihari','Lucknowi','Kashmiri','Indonesian','Roast Chicken','Malaysian','Burmese','Parsi','Bubble Tea','Grill','Andhra','Konkan','Greek','Cafe Food','Fusion','Charcoal Chicken','Dumplings','Drinks Only','Raw Meats','Steak','Fried Chicken','Pakistani','Middle Eastern','Vietnamese','Singaporean','Malwani','Mangalorean','Belgian','Oriya','Pan Asian','Naga','Turkish','Tex-Mex','Vegan','Tibetan','Chettinad','German','Iranian','Spanish','Sri Lankan','Floribbean','Russian','Bangladeshi','French','African','Sushi','British','Portuguese','Bar Food','Australian','Mongolian','','Nepalese','Israeli','South American','Jewish','Asian Fusion','Vegetarian','Bohri','Cantonese','Yum Cha','Mandi','Cuisine Varies','Tapas','Crepes','Coffee and Tea','International','Moroccan','Himachali','Irish','Satay','Hot Pot','Panini','Teppanyaki','Fish and Chips','Afghan','Hawaiian','Roast','Frozen Yogurt','Egyptian','Deli','Armenian','Falafel','Multi Cuisine','Chili','Cake','Peruvian','Brazilian','Swiss','Shanghai','Pub Food','Sichuan','Patisserie','Modern Australian','Korean BBQ','Ramen','Modern European','Ethiopian','Pok','Filipino','Jamaican','Pastry','Tanzanian','Hungarian','Southwestern','Cajun','Brasserie','Syrian','Soul Food','Snacks','Latin American'];
const allCategories = ['Quick Bites','Caf','Casual Dining','Dessert Parlor','Fine Dining', 'Lounge,Bakery','Food Truck','Sweet Shop','Bar','Dhaba','Confectionery', 'Bhojanalya','Kiosk','Beverage Shop','Food Court','Paan Shop','Club', 'Pub','Meat Shop','Microbrewery','Mess','Irani Cafe','Wine Bar', 'Juice Bar','Pop Up','Cocktail Bar','Shack'];
const topCuisines = ['South Indian', 'North Indian', 'Mughlai', 'Momos', 'Italian', 'Fast Food', 'Desserts', 'Continental', 'Chinese', 'Cafe', 'Biryani', 'Beverages'];


function overviewMap(){
    var projection = d3.geoMercator().scale(1100).translate([-1310,780]);
    var path = d3.geoPath()
        .projection(projection);
    d3.json("data/india.json").then(function(data) {
        var svg = d3.select("#plot-1").append("svg")
            .attr("width", 570)
            .attr("height", 650);

        var tooltipDiv = d3.select("#tooltip");


        svg.append("g").selectAll("#map-1")
            .data(topojson.feature(data, data.objects.india).features)
            .enter()
            .append("path")
            .attr("class", "states-fill")
            .attr("id",function(d,i){
                //console.log(d.properties);
                return d.properties.ST_NM;
            })
            .attr("d", path)
            .style("fill", "#333")
            .style("stroke", "#fff")
            .style("stroke-width", "1px");
            
            
            d3.csv("data/city.csv").then(function(data) {
                // console.log(data);
                svg.append("g")
                    .selectAll(".city")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", "city")
                    .attr("cx",function(d){
                        // console.log(d, projection([d.lng,d.lat]));
                        return projection([d.lng,d.lat])[0];
                        // return 300;
                    })
                    .attr("cy",function(d){
                        return projection([d.lng,d.lat])[1];
                        // return 300;
                    })
                    .attr("r",function(d){
                        // return parseFloat(d.restaurants)/1000;
                        return 0;
                    })
                    .style("fill", function(d){
                        if(topCities.indexOf(d.city) != -1){return red_shade;}
                        else{return red_shade;}
                    })
                    .style("fill-opacity", 0.85)
                    .on("mouseover", function(d) {	
                        d3.select(this).attr('stroke','#eee').attr('stroke-width','2px');	
                        tooltipDiv.transition()		
                            .duration(200)		
                            .style("opacity", .9);		
                        tooltipDiv.html("<span class='tooltip-title'>"+d.city +"</span><br><span class='tooltip-body'>"+d.restaurants + " restaurants</span>")	
                            .style("left", (d3.event.pageX) + "px")		
                            .style("top", (d3.event.pageY - 28) + "px");	
                        })					
                    .on("mouseout", function(d) {	
                        d3.select(this).attr('stroke-width','0px');	
                        tooltipDiv.transition()		
                            .duration(500)		
                            .style("opacity", 0);	
                    });

                    var waypoint = new Waypoint({
                        element: document.getElementById('section-2'),
                        handler: function(direction) {
                            d3.selectAll('.city').transition().delay(500).duration(800).ease(d3.easeCubic) 
                                .attr("r",function(d){
                                    return Math.sqrt(parseFloat(d.restaurants))/8;
                                });
                            d3.selectAll('.states-fill').transition().delay(100).duration(800)
                                .ease(d3.easeCubic).style("fill", "#333")
                            ;
                            $("#plot-2-svg").html("");
                            
                        },
                        offset: '70%'   
                    })
            });
    });
}


function bubbles(){
    const vHeight = 300;
    const vWidth = 400;

    var g = d3.select('#plot-2-svg').append('g');
    d3.csv("data/city.csv").then(function(data) {
        // console.log(data);
        let modifiedData=[{
            id: 'total',
            parentId: "",
            size: 167607
        }];
        $.each( data, function( key, value ) {
            modifiedData.push({
                id:value.city,
                parentId:'total',
                size: parseInt(value.restaurants) 
            })
        });
        // console.log(modifiedData);
        
        const vData = d3.stratify()(modifiedData);
        drawViz(vData,vHeight, vWidth);
    });

    function drawViz(vData, vHeight, vWidth) {
        // Declare d3 layout
        var vLayout = d3.pack().size([vWidth, vHeight]);

        // Layout + Data
        var vRoot = d3.hierarchy(vData).sum(function (d) { return d.data.size; });
        var vNodes = vRoot.descendants();
        vLayout(vRoot);
        var vSlices = g.selectAll('circle').data(vNodes).enter().filter(function(d){ return d.parent; }).append('circle');
        var vSlicesText = g.selectAll('text').data(vNodes).enter().filter(function(d){ return d.parent; }).append('text');

        // Draw on screen
        var tooltipDiv = d3.select("#tooltip");

        
        vSlices.attr('fill',red_shade)
        .attr('cx', vWidth/2)
        .attr('cy', vHeight/2)
        .attr('r', 0)
        .attr('class','bubbles')
        .on("mouseover", function(d) {	
            // console.log(d);
            d3.select(this).attr('stroke','#eee').attr('stroke-width','2px');	
            tooltipDiv.transition()		
                .duration(200)		
                .style("opacity", .9);		
            tooltipDiv.html("<span class='tooltip-title'>"+d.data.data.id +"</span><br><span class='tooltip-body'>"+d.data.data.size + " restaurants</span>")	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {	
            d3.select(this).attr('stroke-width','0px');	
            tooltipDiv.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

        vSlices.transition().delay(function(){
            return parseInt(Math.random()*500);
        }).duration(3000).ease(d3.easeElastic)
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; })
        .attr('r', function (d) { return d.r; })
        
        vSlicesText.attr('opacity',1)
        .attr('x', function (d) { return d.x; })
        .attr('y', function (d) { return d.y; })
        .attr('class','bubbles-text')
        .attr('text-anchor','middle')
        .attr('fill',cream_shade)
        .attr('font-size',"0.5rem")
        
    }

}

function removeBubbles(){
    d3.selectAll('.bubbles').transition().duration(700).ease(d3.easeCubic)
        .attr('r',0);
}
function cityBubbles(){
    d3.selectAll('.bubbles').transition().duration(2000).ease(d3.easeCubic)
        .attr('fill',function(d){
            if(topCities.indexOf(d.data.data.id) != -1){return blue_shade;}
            else{return green_shade;}
        });
    d3.selectAll('.bubbles-text').transition().duration(2000).ease(d3.easeCubic)
        .text(function(d){
            if(topCities.indexOf(d.data.data.id) != -1){return d.data.data.id}
            else{return '';}
        })
    
    
}

function cityBubblesRed(){
    d3.selectAll('.bubbles').transition().duration(2000).ease(d3.easeCubic)
        .attr('fill',red_shade);
}
function singleCircle(){
    var g = d3.select('#plot-2-svg').append('g');
    g.append("circle").attr("cx",200).attr("cy",250).attr("r",0).attr("fill",red_shade).attr("class",'single-circle')
    .transition().delay(200).duration(2000).ease(d3.easeElastic).attr("r",150);
}

function removeSingleCircle(){
    d3.select(".single-circle").transition().duration(800).ease(d3.easeCubic).attr("r",0);
}

function percent(percentage, colour1, colour2, text){
    const vHeight = 400;
    const vWidth = 400;

    var g = d3.select('#plot-2-svg').append('g');
    const percentData = Array.apply(null, {length: 100}).map(Number.call, Number)
    // console.log(percentData);
    const perCircles = g.selectAll('.percent-1-ers').data(percentData).enter().append('circle')
                        .attr("cx",-100).attr("cy",-100).attr("r",7).attr("fill",function(d){
                            if(d>percentage){return colour2;}
                            else{return colour1;} 
                        })
                        .attr('class','percent-1-ers')
                        .transition().delay(function(d){
                            return 20*d;
                        }).duration(300).ease(d3.easeCubic) 
                        .attr('cx', function (d) {
                            return ((d%20)*20)+10;
                        })
                        .attr('cy', function (d) {
                            return (parseInt(d/20)*20)+350;
                        })
    g.append('text').attr('x',200).attr('y',460).attr('text-anchor','middle').attr('font-size','1rem').text(text);
}

function removePercent(){
    d3.selectAll('.percent-1-ers')
    .transition().duration(700).attr("r",0)
}

function genericLine(vWidth, vHeight, xDomainValues, yDomainValues, filename, columns, lineClass, dotClass, radius, colour, text, texty){
    const pad = 20;
    var xScale = d3.scaleLinear()
        .domain(xDomainValues) // input
        .range([pad, vWidth-pad]); // output

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
        .domain(yDomainValues) // input 
        .range([vHeight-pad, pad]); // output 

    // 7. d3's line generator
    
    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    d3.csv("data/"+filename).then(function(data) {
        var line = d3.line() // apply smoothing to the line
        .x(function(d, i) { return xScale(parseFloat(d[columns[0]])); }) // set the x values for the line generator
        .y(function(d) { return yScale(parseFloat(d[columns[1]])); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX)
        // 1. Add the SVG to the page and employ #2
        var svg = d3.select("#plot-2-svg").append("g")
           
        // 3. Call the x axis in a group tag
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (vHeight-pad) + ")")
            .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom


        // 9. Append the path, bind the data, and call the line generator 
        svg.append("path")
            .datum(data) // 10. Binds data to the line 
            .attr("class", lineClass) // Assign a class for styling 
            .attr("d", line)
            .attr("fill","none")
            .transition().delay(1000)
            .attr('stroke',colour)
            .attr('stroke-width',2); // 11. Calls the line generator 

        var tooltipDiv = d3.select("#tooltip");

        // 12. Appends a circle for each datapoint 
        var dots = svg.selectAll("."+dotClass)
            .data(data)
        .enter().append("circle") // Uses the enter().append() method
            .attr("class", dotClass) // Assign a class for styling
            .attr('fill',colour)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", radius)
            .on("mouseover", function(d) {	
                // console.log(d);
                d3.select(this).attr('stroke','#eee').attr('stroke-width','2px');	
                tooltipDiv.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                tooltipDiv.html("<span class='tooltip-title'>"+d[columns[0]]+"</span><br><span class='tooltip-body'>"+d[columns[1]] + " restaurants</span>")	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
                })					
            .on("mouseout", function(d) {	
                d3.select(this).attr('stroke-width','0px');	
                tooltipDiv.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            });
    
            
        dots.transition().duration(1000).delay(function(d,i){
            return 10*i;
        })
        .attr("cx", function(d, i) { return xScale(d[columns[0]]) })
        .attr("cy", function(d) { return yScale(d[columns[1]]) })

        svg.append('text').attr('x',200).attr('y',texty).attr('text-anchor','middle').attr('font-size','1rem').text(text);
        
    });
}

function genericHorizontalBar(vWidth, vHeight, filename, columns, barClass){
    const pad=20;
    var y = d3.scaleBand()
            .range([vHeight-pad, pad])
            .padding(0.1);

    var x = d3.scaleLinear()
            .range([pad, vWidth]);
            
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#plot-2-svg");
    var tooltipDiv = d3.select("#tooltip");

    
    // append the rectangles for the bar chart
    d3.csv("data/"+filename).then(function(data) {
        // console.log(data);
        // Scale the range of the data in the domains
        x.domain([0, d3.max(data, function(d){ return parseFloat(d[columns[1]]); })])
        y.domain(data.map(function(d) { return d[columns[0]]; }));
        //y.domain([0, d3.max(data, function(d) { return d.sales; })]);
        // console.log(x.domain(),x.range());
        var bars = svg.selectAll("."+barClass)
            .data(data)
            .enter().append("rect")
            .attr("class", barClass)
            //.attr("x", function(d) { return x(d.sales); })
            .attr("width", 0)
            .attr("y", function(d) { return y(d[columns[0]]); })
            .attr("height", y.bandwidth())
            .attr('fill',red_shade)
            .on("mouseover", function(d) {	
                // console.log(d);
                d3.select(this).attr('stroke','#eee').attr('stroke-width','2px');	
                tooltipDiv.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                tooltipDiv.html("<span class='tooltip-title'>"+d[columns[0]]+"</span><br><span class='tooltip-body'>"+d[columns[1]] + " restaurants</span>")	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
                })					
            .on("mouseout", function(d) {	
                d3.select(this).attr('stroke-width','0px');	
                tooltipDiv.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            });
        bars.transition().duration(1000).attr("width", function(d) {
            // console.log(x(parseFloat(d[columns[1]])));
            return x(parseFloat(d[columns[1]])); } )
        
        
        svg.selectAll(".text-"+barClass)
            .data(data)
            .enter().append("text")
            .attr("class", "text-"+barClass)
            .attr("x", 5)
            .attr("y", function(d) { return y(d[columns[0]])+(3*y.bandwidth()/4); })
            .attr('fill',cream_shade)
            .attr('font-size', '0.7rem')
            .text(function(d){
                return d[columns[0]];
            });
        

    });
}

function genericHorizontalBarCollapse(barClass){
    d3.selectAll('.'+barClass).transition().duration(700).attr('width',0)
}

function genericWordCloud(cloudName, words, width, height, hShift, font){
    // console.log(words);
    var layout = d3.layout.cloud()
    .size([width, height])
    .words(words.map(function(d) {
      return {text: d, size: 10 + Math.random() * 90, test: "haha"};
    }))
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .font("Impact")
    .fontSize(function(){
        const fontArr=[10,12,14];
        // return fontArr[Math.floor(Math.random()*fontArr.length)];
        return font;
    })
    .on("end", draw);

    layout.start();

    function draw(words) {
    const svg = d3.select("#plot-2-svg");
    svg.append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + ","+(hShift+height/2)+")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d){
            return d.size + "px";
        })
        .style("font-family", "Impact")
        .attr('class',cloudName)
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
    }

}

function donut(vWidth, vHeight, filename, columns, arcClass){
    var svg = d3.select("#plot-2-svg");
    const smallPad = 2;
    const bigPad = 250;
    const topMargin = 150;
    d3.csv("data/"+filename).then(function(data) {

        const color = d3.scaleOrdinal(d3.schemeDark2);
        var tooltipDiv = d3.select("#tooltip");
        const innerRadius = 40;
        
        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(innerRadius+1)
            .startAngle(function(d,i){
                return 2*Math.PI*i/data.length;
            })
            .endAngle(function(d,i){
                return 2*Math.PI*(i+1)/data.length;
            });
        
        var arc2 = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(function(d,i){
                return (d[columns[1]]/80)+innerRadius;
            })
            .startAngle(function(d,i){
                return 2*Math.PI*i/data.length;
            })
            .endAngle(function(d,i){
                return 2*Math.PI*(i+1)/data.length;
            });


        svg.append('g').selectAll('.'+arcClass)
            .data(data)
            .enter()
            .append('path')
            .attr('transform',function(d,i){
                return 'translate('+(vWidth/4)+' '+(3*vHeight/4)+')';
            })
            .attr('d',arc)
            .attr('fill',cream_shade).transition().duration(1500)
            .attr('fill',red_shade)
            .attr('d',arc2)
            

    })
}

function section3Scrolly(){
    var waypoint = new Waypoint({
        element: document.getElementById('section-3'),
        handler: function(direction) {
            // $("#plot-2-svg").show();
            d3.select("#plot-2-svg").style("position","sticky").style("top","10%");
        },
        offset: 0 
    });

    $('.scrolly-elements').each(function(i,element){
        new Waypoint({
            element: this,
            handler: function(direction) {
                // console.log(direction);
                // console.log("Yo",i, element);
                if(direction=='down'){
                    $(".scrolly-elements").removeClass("active-scroll");
                    $(element).addClass("active-scroll");
                        if(i==0){                   
                            $("#plot-2-svg").html("");
                        singleCircle();
                    }
                    else if(i==1){
                        
                        new Promise(function(resolve, reject) {
                            removeSingleCircle();
                            resolve();
                        }).then(function(value) {
                            setTimeout(function(){
                                setTimeout(function(){
                                    cityBubbles();
                                },2000);
                                $("#plot-2-svg").html("");
                                bubbles();
                                percent(62, blue_shade, green_shade, "Percentage of T7 City Restaurants");
                            },700);
                        });
                    }
                    else if(i==2){
                        new Promise(function(resolve, reject) {
                            removeBubbles();
                            removePercent();
                            resolve();
                        }).then(function(value) {
                            setTimeout(function(){
                                $("#plot-2-svg").html("");
                                // votesLine();
                                genericLine(400,300, [0,5000],[0,120000],"votes1.csv",["votes_dist",'counts'], 'votes-line','votes-dot', 3, yellow_shade,"Distribution of Restaurants vs Votes", 320);
                                percent(69,blue_shade, green_shade,"Percentage of restaurants with <50 votes");
                            },700);
                        });
                    }
                    else if(i==3){
                        new Promise(function(resolve, reject) {
                            removePercent();
                            resolve();
                        }).then(function(value) {
                            setTimeout(function(){
                                $("#plot-2-svg").html("");
                                // ratingsLine();
                                genericLine(400,400, [0,5],[0,7000],"ratings1.csv",["rating",'counts'],'rating-line','rating-dot', 5,purple_shade,"Distribution of Restaurants vs Ratings", 420);
                            },700);
                        });
                    }
                    else if(i==4){
                        $("#plot-2-svg").html("");
                        genericLine(400,400, [0,5000],[0,16000],"cost1.csv",["cf2_flag",'counts'],'cost-line','cost-dot', 5, torq_shade,"Distribution of Restaurants vs Cost For Two", 420);
                    }
                    else if(i==5){
                        $("#plot-2-svg").html("");
                        genericHorizontalBar(400, 300, "cuisines1.csv", ['cuisines','count'], 'cuisine-bar');
                        genericWordCloud('cloudy-cuisine',allCuisines, 400, 400, 300,10);
                    }
                    else if(i==6){
                        new Promise(function(resolve, reject) {
                            genericHorizontalBarCollapse('cuisine-bar')
                            resolve();
                        }).then(function(value) {
                            setTimeout(function(){
                                $("#plot-2-svg").html("");
                                genericHorizontalBar(400, 300, "categories1.csv", ['categories','count'], 'category-bar');
                                // donut(400, 400, "categories1.csv", ['categories','count'], 'category-bar');
                                genericWordCloud('cloudy-category',allCategories, 300, 300, 300, 20);
                            },700);
                        });
                    }
                    
                }
            },
            offset: '20%'
        })
        
        new Waypoint({
            element: this,
            handler: function(direction) {
                // console.log(direction);
                // console.log("Yo",i, element);
                if(direction=='up'){
                    $(".scrolly-elements").removeClass("active-scroll");
                    $(element).addClass("active-scroll");
                        if(i==0){                      
                        $("#plot-2-svg").html("");
                        singleCircle();
                    }
                    else if(i==1){
                        
                        new Promise(function(resolve, reject) {
                            removeSingleCircle();
                            resolve();
                        }).then(function(value) {
                            setTimeout(function(){
                                setTimeout(function(){
                                    cityBubbles();
                                },2000);
                                $("#plot-2-svg").html("");
                                bubbles();
                                percent(62, blue_shade, green_shade,"Percentage of T7 City Restaurants");
                            },700);
                        });
                    }
                    else if(i==2){
                        new Promise(function(resolve, reject) {
                            removeBubbles();
                            removePercent();
                            resolve();
                        }).then(function(value) {
                            setTimeout(function(){
                                $("#plot-2-svg").html("");
                                // votesLine();
                                genericLine(400,300, [0,5000],[0,120000],"votes1.csv",["votes_dist",'counts'], 'votes-line','votes-dot', 3, yellow_shade,"Distribution of Restaurants vs Votes", 320);
                                percent(69,blue_shade, green_shade,"Percentage of restaurants with <50 votes");
                            },700);
                        });
                    }
                    else if(i==3){
                        new Promise(function(resolve, reject) {
                            removePercent();
                            resolve();
                        }).then(function(value) {
                            setTimeout(function(){
                                $("#plot-2-svg").html("");
                                // ratingsLine();
                                genericLine(400,400, [0,5],[0,7000],"ratings1.csv",["rating",'counts'],'rating-line','rating-dot', 5,purple_shade,"Distribution of Restaurants vs Ratings", 420);
                            },700);
                        });
                    }
                    else if(i==4){
                        $("#plot-2-svg").html("");
                        genericLine(400,400, [0,5000],[0,16000],"cost1.csv",["cf2_flag",'counts'],'cost-line','cost-dot', 5, torq_shade,"Distribution of Restaurants vs Cost For Two", 420);
                    }
                    else if(i==5){
                        $("#plot-2-svg").html("");
                        genericHorizontalBar(400, 300, "cuisines1.csv", ['cuisines','count'], 'cuisine-bar');
                        genericWordCloud('cloudy-cuisine',allCuisines, 400, 400, 300,10);
                    }
                    else if(i==6){
                        new Promise(function(resolve, reject) {
                            genericHorizontalBarCollapse('cuisine-bar')
                            resolve();
                        }).then(function(value) {
                            setTimeout(function(){
                                $("#plot-2-svg").html("");
                                genericHorizontalBar(400, 300, "categories1.csv", ['categories','count'], 'category-bar');
                                // donut(400, 400, "categories1.csv", ['categories','count'], 'category-bar');
                                genericWordCloud('cloudy-category',allCategories, 300, 300, 300, 20);
                            },700);
                        });
                    }
                    
                }
            },
            offset: '0%'
        })
        
    });
    
    // bubbles();
    // percent();
    
}

export {overviewMap,section3Scrolly};