const red_shade = '#c0392b';
const black_shade = '#333';
const cream_shade = '#eee';
const topCities = ['ncr','mumbai','bangalore','hyderabad','pune','chennai','kolkata'];
const topCuisines = ['South Indian', 'North Indian', 'Mughlai', 'Momos', 'Italian', 'Fast Food', 'Desserts', 'Continental', 'Chinese', 'Cafe', 'Biryani', 'Beverages'];
const allCuisines = ['North Indian','Mughlai','Rolls','Chinese','Fast Food','Street Food','Cafe','Italian','Continental','Pizza','Desserts','Bakery','Mithai','South Indian','Rajasthani','Burger','Ice Cream','Beverages','Awadhi','Indian','American','Biryani','Tea','Momos','Asian','European','Mediterranean','Sandwich','Kebab','Finger Food','Mexican','Thai','Japanese','Korean','North Eastern','Paan','Healthy Food','Salad','Lebanese','Afghani','Gujarati','Wraps','Juices','Bengali','Arabian','Assamese','Mishti','Modern Indian','Hyderabadi','Maharashtrian','Goan','BBQ','Oriental','Seafood','Coffee','Sindhi','Kerala','Bihari','Lucknowi','Kashmiri','Indonesian','Roast Chicken','Malaysian','Burmese','Parsi','Bubble Tea','Grill','Andhra','Konkan','Greek','Cafe Food','Fusion','Charcoal Chicken','Dumplings','Drinks Only','Raw Meats','Steak','Fried Chicken','Pakistani','Middle Eastern','Vietnamese','Singaporean','Malwani','Mangalorean','Belgian','Oriya','Pan Asian','Naga','Turkish','Tex-Mex','Vegan','Tibetan','Chettinad','German','Iranian','Spanish','Sri Lankan','Floribbean','Russian','Bangladeshi','French','African','Sushi','British','Portuguese','Bar Food','Australian','Mongolian','','Nepalese','Israeli','South American','Jewish','Asian Fusion','Vegetarian','Bohri','Cantonese','Yum Cha','Mandi','Cuisine Varies','Tapas','Crepes','Coffee and Tea','International','Moroccan','Himachali','Irish','Satay','Hot Pot','Panini','Teppanyaki','Fish and Chips','Afghan','Hawaiian','Roast','Frozen Yogurt','Egyptian','Deli','Armenian','Falafel','Multi Cuisine','Chili','Cake','Peruvian','Brazilian','Swiss','Shanghai','Pub Food','Sichuan','Patisserie','Modern Australian','Korean BBQ','Ramen','Modern European','Ethiopian','Pok','Filipino','Jamaican','Pastry','Tanzanian','Hungarian','Southwestern','Cajun','Brasserie','Syrian','Soul Food','Snacks','Latin American'];
const allCategories = ['Quick Bites','Caf','Casual Dining','Dessert Parlor','Fine Dining', 'Lounge,Bakery','Food Truck,Sweet Shop','Bar','Dhaba','Confectionery', 'Bhojanalya','Kiosk','Beverage Shop','Food Court','Paan Shop','Club', 'Pub','Meat Shop','Microbrewery','Mess','Irani Cafe','Wine Bar', 'Juice Bar','Pop Up','Cocktail Bar','Shack'];

const ratings = ['4-5', '3-4', '2-3', '1-2'];



// console.log('categories',allCategories.length);
// console.log('cuisines',allCuisines.length);

function city_bar(id, classModifier, filename, xDomainValues, yDomainValues, vWidth, vHeight, pad, xCats, yCats){
    const g = d3.select('#'+id).append('g');
    d3.csv("data/"+filename).then(function(data) {
        var color = d3.scaleOrdinal(d3.schemeSet3);
        var xScale = d3.scaleLinear()
        .domain(xDomainValues) // input
        .range([pad, vWidth-pad]); // output

        var tooltipDiv = d3.select("#tooltip");

        var yScale = d3.scaleLinear()
        .domain(yDomainValues) // input
        .range([pad, vHeight-pad]); // output

        // console.log(data);
        const cities = g.selectAll('.city-bar-group-'+classModifier)
            .data(yCats)
            .enter()
            .append('g').attr('class','city-bar-group-'+classModifier);
        
        g.selectAll('.city-text-bar-'+classModifier)
            .data(yCats)
            .enter()
            .append('text')
            .attr('x',0)
            .attr('y',function(d,i){
                return yScale(i) + 20;
            })
            .attr('fill',cream_shade)
            .attr('font-size','0.7em')
            .attr('font-variant','small-caps')
            .text(function(d){
                return d;
            })
        
            g.selectAll('.city-legend-bar-'+classModifier)
            .data(xCats)
            .enter()
            .append('rect')
            .attr('x',function(d,i){
                const tempid = i%parseInt((xCats.length/2));
                // console.log(tempid);
                return xScale(xDomainValues[1]*2*tempid/xCats.length) + 15;
            })
            .attr('y',function(d,i){
                const tempid = parseInt(2*i/xCats.length) + 1;
                // console.log(tempid);
                return yScale(yDomainValues[1]) + tempid*40;
            }).attr('width',20).attr('height',20)
            .attr('fill',function(d,i){
                return color(i);
            })

                    
            g.selectAll('.city-legend-text-'+classModifier)
            .data(xCats)
            .enter()
            .append('text')
            .attr('x',function(d,i){
                const tempid = i%parseInt((xCats.length/2));
                // console.log(tempid);
                return xScale(xDomainValues[1]*2*tempid/xCats.length) + 40;
            })
            .attr('y',function(d,i){
                const tempid = parseInt(2*i/xCats.length) + 1;
                // console.log(tempid);
                return yScale(yDomainValues[1]) + tempid*40 + 15;
            })
            .attr('fill',cream_shade)
            .attr('font-size','0.8rem')
            .text(function(d){
                return d;
            })

        const citybars = cities.selectAll('.city-bars-'+classModifier)
            .data(function(d){
                const cityData = data.filter(row => row.city ==d)
                // console.log(cityData);
                return cityData;
            })
            .enter()
            .append('rect')
            .attr('class','city-bars-'+classModifier)
            .attr('x',function(d,i){
                // return xScale(d.cumsum-d.perc_counts)
                return xScale(0);
            })
            .attr('y',function(d,i){
                return yScale(topCities.indexOf(d.city));
            })
            .attr('width',function(d,i){
                // return xScale(d.perc_counts) - xScale(0) + 1;
                return 0;
            })
            .attr('height',30)
            .attr('fill',function(d,i){
                return color(i);
            })
            .on("mouseover", function(d) {	
                // console.log(d);
                d3.select(this).attr('stroke','#eee').attr('stroke-width','2px');	
                tooltipDiv.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                tooltipDiv.html("<span class='tooltip-title'>"+d.cuisines+"</span><br><span class='tooltip-body'>"+parseFloat(d.perc_counts).toFixed(2)+ "% </span>")	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
                })					
            .on("mouseout", function(d) {	
                d3.select(this).attr('stroke-width','0px');	
                tooltipDiv.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            });
    
            citybars.transition().duration(2000)
            .attr('x',function(d,i){
                return xScale(d.cumsum-d.perc_counts)
            })
            .attr('width',function(d,i){
                return xScale(d.perc_counts) - xScale(0) + 1;
            })

    })
}


function city_dots(id, classModifier, filename, xDomainValues, yDomainValues, vWidth, vHeight, pad){
    const g = d3.select('#'+id).append('g');
    const smallPad = 2;
    const bigPad = 300;
    d3.csv("data/"+filename).then(function(data) {

        const percentData = Array.apply(null, {length: 100}).map(Number.call, Number)
        const smallRangeX = (vWidth-pad-pad)/(xDomainValues.length)
        const smallRangeY = (vHeight-pad-pad)/(yDomainValues.length)
        const color = d3.scaleOrdinal(d3.schemeDark2);
        
        
        
        
        var xScale = d3.scaleBand()
        .domain(xDomainValues)
        .range([pad, vWidth-pad])
        .paddingInner(1);

        var yScale = d3.scaleBand()
        .domain(yDomainValues)
        .range([pad, vHeight-1.1*pad])
        .paddingInner(1);

        var xScale2 = d3.scaleLinear()
        .domain([0,9])
        .range([smallPad, smallRangeX-smallPad]);

        var yScale2 = d3.scaleLinear()
        .domain([0,9])
        .range([smallPad, smallRangeY-smallPad]);

        var xScale3 = d3.scaleBand()
        .domain(ratings)
        .range([bigPad, vWidth-bigPad]);


        var tooltipDiv = d3.select("#tooltip");

        // console.log(data);
        const cities = g.selectAll('.city-dot-group-'+classModifier)
            .data(yDomainValues)
            .enter()
            .append('g').attr('class','city-dot-group-'+classModifier);
        
        g.selectAll('.city-text-dot-'+classModifier)
            .data(yDomainValues)
            .enter()
            .append('text')
            .attr('x',30)
            .attr('y',function(d,i){
                return yScale(d) + 30;
            })
            .attr('fill',cream_shade)
            .attr('font-size','0.7em')
            .attr('font-variant','small-caps')
            .text(function(d){
                return d;
            })

        g.selectAll('.city-legend-circle-'+classModifier)
            .data(ratings)
            .enter()
            .append('rect')
            .attr('x',function(d,i){
                return (xScale3(d))+70;
            })
            .attr('y', yScale(yDomainValues[yDomainValues.length-1])+80)
            .attr('fill',function(d,i){
                return color(i);
            })
            .attr('width',90)
            .attr('height',35)
            .attr('rx',15)
            .attr('ry',15)
  
        g.selectAll('.city-legend-text-'+classModifier)
            .data(ratings)
            .enter()
            .append('text')
            .attr('x',function(d,i){
                return (xScale3(d))+100;
            })
            .attr('y', yScale(yDomainValues[yDomainValues.length-1])+100)
            .attr('fill',cream_shade)
            .attr('font-size','1rem')
            .text(function(d){
                return d;
            })
        g.append('text').attr('x',220).attr('y',690).attr('fill',cream_shade).attr('font-size','1rem').text('Ratings Legend : ')
  




        g.selectAll('.city-text-dot-'+classModifier)
            .data(topCuisines)
            .enter()
            .append('text')
            .attr('x',function(d,i){
                return (xScale(d) + (xScale(topCuisines[1])-xScale(topCuisines[0]))/2)-5;
            })
            .attr('y',70)
            .attr('fill',cream_shade)
            .attr('font-size','0.55em')
            .attr('text-anchor','middle')
            .text(function(d){
                return d;
            })

        const city_cus_combos = cities.selectAll('.city-dots-'+classModifier)
            .data(function(d){
                const cityData = data.filter(row => row.city ==d)
                // console.log(cityData);
                return cityData;
            })
            .enter()
            .append('g')
            .attr('class','city-dots-'+classModifier)
            
        city_cus_combos.selectAll('.city-subdots-'+classModifier)
            .data(percentData)
            .enter()
            .append('circle')
            .attr('cx',function(d,i){
                const parentData = d3.select(this.parentNode).datum();
                // console.log(parentData);
                return xScale2(d%10) + xScale(parentData.cuisines);
            })
            .attr('cy',function(d,i){
                const parentData = d3.select(this.parentNode).datum()
                return yScale2(parseInt(d/10)) + yScale(parentData.city);
            })
            .attr('r',function(d,i){
                return 0;
            })
            .attr('fill',cream_shade)
            .attr('opacity',0.2)
            .transition().duration(1000)
            .attr('r',3).transition().duration(1000).delay(function(d,i){
                return 25*i;
            }).attr('fill',function(d,i){
                const parentData = d3.select(this.parentNode).datum();
                const rate5 = Math.round(parentData.rating_5 *100/ parentData.counts_x);
                const rate4 = rate5+ Math.round(parentData.rating_4 *100/ parentData.counts_x);
                const rate3 = rate4+ Math.round(parentData.rating_3 *100/ parentData.counts_x);
                const rate2 = rate3+ Math.round(parentData.rating_2 *100/ parentData.counts_x);
                // console.log(parentData, rate5, rate4, rate3, rate2);
                if(i<rate5){return color(0);}
                else if(i<rate4){return color(1);}
                else if(i<rate3){return color(2);}
                else{return color(3);}
            }).attr('opacity',1)
            

    })
}

function city_donuts(id, classModifier, filename, xDomainValues, yDomainValues, vWidth, vHeight, pad){
    const g = d3.select('#'+id).append('g');
    const smallPad = 2;
    const bigPad = 250;
    const topMargin = 150;
    d3.csv("data/"+filename).then(function(data) {

        const color = d3.scaleOrdinal(d3.schemeDark2);
        
        
        
        var tooltipDiv = d3.select("#tooltip");
        const divisor = Math.ceil((yDomainValues.length-1)/3); 
        
        
        
        
        var xScale = d3.scaleLinear()
        .domain([0,divisor])
        .range([pad, vWidth-pad])
        
        
        // console.log(data);
        const cities = g.selectAll('.city-donut-group-'+classModifier)
            .data(yDomainValues)
            .enter()
            .append('g').attr('class','city-donut-group-'+classModifier);
        
        g.selectAll('.city-text-donut-'+classModifier)
            .data(yDomainValues)
            .enter()
            .append('text')
            .attr('x',function(d,i){
                return xScale(i%(divisor+1));
            })
            .attr('y',function(d,i){
                return bigPad* parseInt((i/(divisor+1)))+topMargin;
            })
            .attr('fill',cream_shade)
            .attr('font-size','0.7em')
            .attr('font-variant','small-caps')
            .attr('text-anchor','middle')
            .text(function(d){
                return d;
            })

        const radScale = d3.scaleLinear()
                            .domain([0,100])
                            .range([0,70])
        const innerRadius = 40;
        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(function(d,i){
                return (radScale(100))+innerRadius;
            })
            .startAngle(function(d,i){
                return 2*Math.PI*i/xDomainValues.length;
            })
            .endAngle(function(d,i){
                return 2*Math.PI*(i+1)/xDomainValues.length;
            });

        var arc2 = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(function(d,i){
                return radScale((parseFloat(d.cost_lt_500)+parseFloat(d.cost_bt_500_1000))/d.counts_x *100)+innerRadius;
            })
            .startAngle(function(d,i){
                return 2*Math.PI*i/xDomainValues.length;
            })
            .endAngle(function(d,i){
                return 2*Math.PI*(i+1)/xDomainValues.length;
            });


        var arc3 = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(function(d,i){
                return radScale((d.cost_lt_500)/d.counts_x* 100)+innerRadius;
            })
            .startAngle(function(d,i){
                return 2*Math.PI*i/xDomainValues.length;
            })
            .endAngle(function(d,i){
                return 2*Math.PI*(i+1)/xDomainValues.length;
            });
        
        
        cities.selectAll('.city-subdots-'+classModifier)
            .data(function(d){
                const cityData = data.filter(row => row.city ==d)
                // console.log(cityData);
                return cityData;
            })
            .enter()
            .append('path')
            .attr('transform',function(d,i){
                // console.log(d);
                const k = yDomainValues.indexOf(d.city);
                return 'translate('+xScale(k%(divisor+1))+' '+(bigPad* parseInt((k/(divisor+1)))+topMargin)+')';
            })
            .attr('d',arc)
            .attr('fill', function(d,i){
                return color(xDomainValues.indexOf(d.cuisines));
            }).attr('opacity',0.2)
            .on("mouseover", function(d) {	
                // console.log(d);
                d3.select(this).attr('stroke','#eee').attr('stroke-width','2px');	
                tooltipDiv.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                tooltipDiv.html("<span class='tooltip-title'>"+d.cuisines+" : Cost (Rs for 2)</span><br><span class='tooltip-body'>< 500 : 500:1000 : >1000 <br>"+(parseFloat(d.cost_lt_500)/parseFloat(d.counts_x)*100).toFixed(2)+ "%  : "+(parseFloat(d.cost_bt_500_1000)/parseFloat(d.counts_x)*100).toFixed(2)+"% : " + (parseFloat(d.cost_gt_1000)/parseFloat(d.counts_x)*100).toFixed(2)+"% </span>")	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
                })					
            .on("mouseout", function(d) {	
                d3.select(this).attr('stroke-width','0px');	
                tooltipDiv.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            });
    
        
        cities.selectAll('.city-subdots-'+classModifier)
            .data(function(d){
                const cityData = data.filter(row => row.city ==d)
                // console.log(cityData);
                return cityData;
            })
            .enter()
            .append('path')
            .attr('transform',function(d,i){
                // console.log(d);
                const k = yDomainValues.indexOf(d.city);
                return 'translate('+xScale(k%(divisor+1))+' '+(bigPad* parseInt((k/(divisor+1)))+topMargin)+')';
            })
            .attr('d',arc2)
            .attr('fill', function(d,i){
                return color(xDomainValues.indexOf(d.cuisines));
            }).attr('opacity',0.3)
            .on("mouseover", function(d) {	
                // console.log(d);
                d3.select(this).attr('stroke','#eee').attr('stroke-width','2px');	
                tooltipDiv.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                tooltipDiv.html("<span class='tooltip-title'>"+d.cuisines+" : Cost (Rs for 2)</span><br><span class='tooltip-body'>< 500 : 500:1000 : >1000 <br>"+(parseFloat(d.cost_lt_500)/parseFloat(d.counts_x)*100).toFixed(2)+ "%  : "+(parseFloat(d.cost_bt_500_1000)/parseFloat(d.counts_x)*100).toFixed(2)+"% : " + (parseFloat(d.cost_gt_1000)/parseFloat(d.counts_x)*100).toFixed(2)+"% </span>")	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
                })					
            .on("mouseout", function(d) {	
                d3.select(this).attr('stroke-width','0px');	
                tooltipDiv.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            });

        cities.selectAll('.city-subdots-'+classModifier)
            .data(function(d){
                const cityData = data.filter(row => row.city ==d)
                // console.log(cityData);
                return cityData;
            })
            .enter()
            .append('path')
            .attr('transform',function(d,i){
                // console.log(d);
                const k = yDomainValues.indexOf(d.city);
                return 'translate('+xScale(k%(divisor+1))+' '+(bigPad* parseInt((k/(divisor+1)))+topMargin)+')';
            })
            .attr('d',arc3)
            .attr('fill', function(d,i){
                return color(xDomainValues.indexOf(d.cuisines));
            }).attr('opacity',0.4)
            .on("mouseover", function(d) {	
                // console.log(d);
                d3.select(this).attr('stroke','#eee').attr('stroke-width','2px');	
                tooltipDiv.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                tooltipDiv.html("<span class='tooltip-title'>"+d.cuisines+" : Cost (Rs for 2)</span><br><span class='tooltip-body'>< 500 : 500:1000 : >1000 <br>"+(parseFloat(d.cost_lt_500)/parseFloat(d.counts_x)*100).toFixed(2)+ "%  : "+(parseFloat(d.cost_bt_500_1000)/parseFloat(d.counts_x)*100).toFixed(2)+"% : " + (parseFloat(d.cost_gt_1000)/parseFloat(d.counts_x)*100).toFixed(2)+"% </span>")	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
                })					
            .on("mouseout", function(d) {	
                d3.select(this).attr('stroke-width','0px');	
                tooltipDiv.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            }); 
        g.append("text").attr('x',550).attr('y',600).attr('fill',cream_shade).attr('font-size','1rem').text(": Each arc represents a cuisine, and is divided into 3 ")
        g.append("text").attr('x',400).attr('y',600).attr('fill',red_shade).attr('font-size','1rem').text("How to Read this plot")
        g.append("text").attr('x',400).attr('y',620).attr('fill',cream_shade).attr('font-size','1rem').text("layers. The lightest layer is proportional to the number of restaurants with")
        g.append("text").attr('x',400).attr('y',640).attr('fill',cream_shade).attr('font-size','1rem').text("Avg. Cost <500 Rs. For the middle layer, it is between 500 & 1000 Rs. The ")
        g.append("text").attr('x',400).attr('y',660).attr('fill',cream_shade).attr('font-size','1rem').text("Final layer corresponds to restaurants with Avg. Cost > 1000 Rs. This graphic")
        g.append("text").attr('x',400).attr('y',680).attr('fill',cream_shade).attr('font-size','1rem').text("provides a snapshot of expensiveness of various cuisines in various cities.")

        g.append("text").attr('x',350).attr('y',665).attr('fill',cream_shade).attr('font-size','7rem').text("{")
        g.append("text").attr('x',880).attr('y',665).attr('fill',cream_shade).attr('font-size','7rem').text("}")
    })
}



function section4Scrolly(){
    var waypoint1 = new Waypoint({
        element: document.getElementById('plot-3-svg'),
        handler: function(direction) {
            $("#plot-3-svg").html("");
            city_bar('plot-3-svg','cuisine','cuisines2.csv',[0,100],[0,6],800,500,100, topCuisines, topCities);
            waypoint1.destroy();
        },
        offset: "70%"   
    });
    var waypoint2 = new Waypoint({
        element: document.getElementById('plot-4-svg'),
        handler: function(direction) {
            $("#plot-4-svg").html("");
            city_dots('plot-4-svg','cuisine','cuisines2.csv',topCuisines,topCities,1000,700,100);
            waypoint2.destroy();
        },
        offset: "70%"   
    });

    var waypoint3 = new Waypoint({
        element: document.getElementById('plot-5-svg'),
        handler: function(direction) {
            $("#plot-5-svg").html("");
            city_donuts('plot-5-svg','cuisine','cuisines2.csv',topCuisines,topCities,1000,700,200);
            waypoint3.destroy();
        },
        offset: "70%"   
    });
}

export {section4Scrolly};