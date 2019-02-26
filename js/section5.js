const red_shade = '#c0392b';
const black_shade = '#333';
const cream_shade = '#eee';
const blue_shade = '#2980b9';
const yellow_shade = '#f39c12';
const green_shade = '#27ae60';
const purple_shade = '#8e44ad';
const torq_shade = '#16a085';
const topCities = ['ncr','mumbai','bangalore','hyderabad','pune','chennai','kolkata'];
const topCuisines = ['South Indian', 'North Indian', 'Mughlai', 'Momos', 'Italian', 'Fast Food', 'Desserts', 'Continental', 'Chinese', 'Cafe', 'Biryani', 'Beverages'];
const allCuisines = ['North Indian','Mughlai','Rolls','Chinese','Fast Food','Street Food','Cafe','Italian','Continental','Pizza','Desserts','Bakery','Mithai','South Indian','Rajasthani','Burger','Ice Cream','Beverages','Awadhi','Indian','American','Biryani','Tea','Momos','Asian','European','Mediterranean','Sandwich','Kebab','Finger Food','Mexican','Thai','Japanese','Korean','North Eastern','Paan','Healthy Food','Salad','Lebanese','Afghani','Gujarati','Wraps','Juices','Bengali','Arabian','Assamese','Mishti','Modern Indian','Hyderabadi','Maharashtrian','Goan','BBQ','Oriental','Seafood','Coffee','Sindhi','Kerala','Bihari','Lucknowi','Kashmiri','Indonesian','Roast Chicken','Malaysian','Burmese','Parsi','Bubble Tea','Grill','Andhra','Konkan','Greek','Cafe Food','Fusion','Charcoal Chicken','Dumplings','Drinks Only','Raw Meats','Steak','Fried Chicken','Pakistani','Middle Eastern','Vietnamese','Singaporean','Malwani','Mangalorean','Belgian','Oriya','Pan Asian','Naga','Turkish','Tex-Mex','Vegan','Tibetan','Chettinad','German','Iranian','Spanish','Sri Lankan','Floribbean','Russian','Bangladeshi','French','African','Sushi','British','Portuguese','Bar Food','Australian','Mongolian','','Nepalese','Israeli','South American','Jewish','Asian Fusion','Vegetarian','Bohri','Cantonese','Yum Cha','Mandi','Cuisine Varies','Tapas','Crepes','Coffee and Tea','International','Moroccan','Himachali','Irish','Satay','Hot Pot','Panini','Teppanyaki','Fish and Chips','Afghan','Hawaiian','Roast','Frozen Yogurt','Egyptian','Deli','Armenian','Falafel','Multi Cuisine','Chili','Cake','Peruvian','Brazilian','Swiss','Shanghai','Pub Food','Sichuan','Patisserie','Modern Australian','Korean BBQ','Ramen','Modern European','Ethiopian','Pok','Filipino','Jamaican','Pastry','Tanzanian','Hungarian','Southwestern','Cajun','Brasserie','Syrian','Soul Food','Snacks','Latin American'];
const allCategories = ['Quick Bites','Caf','Casual Dining','Dessert Parlor','Fine Dining', 'Lounge,Bakery','Food Truck,Sweet Shop','Bar','Dhaba','Confectionery', 'Bhojanalya','Kiosk','Beverage Shop','Food Court','Paan Shop','Club', 'Pub','Meat Shop','Microbrewery','Mess','Irani Cafe','Wine Bar', 'Juice Bar','Pop Up','Cocktail Bar','Shack'];

const ratings = ['4-5', '3-4', '2-3', '1-2'];



console.log('categories',allCategories.length);
console.log('cuisines',allCuisines.length);

function force(forceID, classModifier, filename1, filename2, width, height, pad){
    const svg = d3.select("#"+forceID);
    var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d){
        // console.log(d);
        return 2000/d.value;
    }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 3, height / 2));
    var tooltipDiv = d3.select("#tooltip");

    d3.csv("data/"+filename1).then(function(links) {

        // console.log(links);
        d3.csv("data/"+filename2).then(function(nodes) {

        // console.log(nodes);
        const radius = 6;
        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line");
        
        
        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("fill", function(d, i){
                if(topCuisines.indexOf(d.id) != -1){return yellow_shade;}
                else{return black_shade;}
            })
            .attr("r", function(d){
                // console.log(d);
                return Math.max((parseInt(d.size)/500),3);
            }).on("mouseover", function(d) {	
                // console.log(d);
                d3.select(this).attr('stroke','#eee').attr('stroke-width','2px');	
                tooltipDiv.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                tooltipDiv.html("<span class='tooltip-title'>"+d.id +"</span>")	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
                })					
            .on("mouseout", function(d) {	
                d3.select(this).attr('stroke-width','0px');	
                tooltipDiv.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            }).call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function(d) { return d.id; });

        simulation
            .nodes(nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(links);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
            node
                .attr("cx", function(d) {return Math.max(radius, Math.min(width - radius, d.x));})
                .attr("cy", function(d) {return d.y = Math.max(radius, Math.min(height - radius, d.y));});
        }
        });

        function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        }

        function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        }

        function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        }
    });
}

function forceOrig(forceID, width, height, filename){
    const svg = d3.select("#"+forceID);
    var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

    d3.json("data/"+filename).then(function(graph) {
        console.log(graph);

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 2.5)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }
    });

    function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    }

    function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
    }

    function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    }
}


function overviewMap2(){
    var projection = d3.geoMercator().scale(1100).translate([-1310,780]);
    var path = d3.geoPath()
        .projection(projection);
    
    d3.csv("data/cuisinecity.csv").then(function(cus) {
        // console.log(data);
        function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }
        const cuisines_left = cus.map(function(d){
            return d.cuisines + ' '+ d.icon;
        }).filter( onlyUnique );
       
        cuisines_left.map(function(d){
            $('#left-dd').append('<option value="'+d+'">'+d+'</option>');
            $('#right-dd').append('<option value="'+d+'">'+d+'</option>');
        });

        d3.json("data/india.json").then(function(data) {
            
            var svg = d3.select("#plot-5").append("svg")
                .attr("width", 570)
                .attr("height", 650);
    
            var tooltipDiv = d3.select("#tooltip");
    
    
            svg.append("g").selectAll("#map-2")
                .data(topojson.feature(data, data.objects.india).features)
                .enter()
                .append("path")
                .attr("class", "states-fill-2")
                .attr("id",function(d,i){
                    //console.log(d.properties);
                    return d.properties.ST_NM;
                })
                .attr("d", path)
                .style("fill", "#ffffff")
                .style("stroke", "#333")
                .style("stroke-width", "1px");
                
            processCuisineChoice(svg, cus);
            $("#left-dd").change(function(){
                // console.log($(this).val());
                processCuisineChoice(svg, cus);
            });
    
    
            $("#right-dd").change(function(){
                // console.log($(this).val());
                processCuisineChoice(svg, cus);
            });
            
            function processCuisineChoice(svg, cus){
                d3.select('.citycus').remove();
                const left = $("#left-dd").val().split(' ')[0];
                const right = $("#right-dd").val().split(' ')[0];
                // console.log(left, right, cus);
                const findata = cus.filter(function(d){
                    if ((d.cuisines==left)||(d.cuisines==right)){
                        return d;
                    }
                });

                const fincities = cus.map(function(d){
                    return d.city;
                }).filter( onlyUnique );

                const finFinData = fincities.map(function(d){
                    // console.log(findata);
                    const tempCity = findata.filter(function(k){
                        if (k.city == d){
                            return k;
                        }
                    })
                    // console.log(tempCity);
                    return [d,tempCity];
                });

                
                // console.log(finFinData);

                

                svg.append("g")
                .selectAll(".citycus")
                .data(finFinData)
                .enter()
                .append("text")
                .attr("class", "citycus")
                .attr('text-anchor','middle')
                .attr("x",function(d){
                    // console.log(d);
                    if (d[1].length>0){
                        return projection([d[1][0].lng,d[1][0].lat])[0];
                    }
                    
                    // return 300;
                })
                .attr("y",function(d){
                    if (d[1].length>0){
                        return projection([d[1][0].lng,d[1][0].lat])[1];
                    }
                    // return 300;
                })
                .html(function(d){
                    if (d[1].length==2){
                        if (d[1][0].new>d[1][1].new){
                            return d[1][0].icon;
                        }else return d[1][1].icon;
                    }

                    
                })
                .on("mouseover", function(d) {	
                    d3.select(this).attr('stroke','#eee').attr('stroke-width','2px');	
                    tooltipDiv.transition()		
                        .duration(200)		
                        .style("opacity", .9);
                    tooltipDiv.html("<span class='tooltip-title'>"+d[1][0].city +"</span><br><span class='tooltip-body'>"+d[1][0].cuisines+' : '+d[1][0].new + " restaurants<br>"+d[1][1].cuisines+' : '+d[1][1].new + " restaurants</span>")	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px");	
                    })					
                .on("mouseout", function(d) {	
                    d3.select(this).attr('stroke-width','0px');	
                    tooltipDiv.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                });

            }
            
        });

    });
        
    
}



function section5Scrolly(){
    var waypoint = new Waypoint({
        element: document.getElementById('plot-6-svg'),
        handler: function(direction) {
            $("#plot-6-svg").html("");
            force('plot-6-svg','cuisine-force','force_cuisines_links.csv','force_cuisines_nodes.csv',1000,700,200);
            // forceOrig('plot-6-svg', 700, 700, 'mis.json');
            waypoint.destroy();
        },
        offset: "50%"   
    });
}

export {section5Scrolly, overviewMap2};