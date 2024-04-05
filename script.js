fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(response => response.json())
  .then(data => {
    const dataset = data;
    const monthlyVar = dataset.monthlyVariance;
    const temperature = 8.66
    
    const w = 1200;
    const h = 600;
    const padding = 60;
    const legendHeight = 50;
    const textHeight = 50;
    
    const totalHeight = h + legendHeight + padding + textHeight;
    
    const firstYear = d3.min(monthlyVar.map(d => d.year));
    const lastYear = d3.max(monthlyVar.map(d => d.year));
    
    const xScale = d3.scaleLinear()
      .domain([firstYear - 0.3, lastYear])
      .range([padding, w - padding]);
    
    const firstMonth = d3.min(monthlyVar.map(d => d.month));
    const lastMonth = d3.max(monthlyVar.map(d => d.month));
    
    const monthNames = d3.timeFormat("%B"); 
    
    const yScale = d3.scaleBand()
      .domain(d3.range(firstMonth, lastMonth + 1)) 
      .range([padding, h - padding])
      
    const svg = d3.select('body')
      .append("svg")
      .attr("width", w)
      .attr("height", totalHeight);
  
     let tooltip = d3.select('body')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0)
      .attr("data-year", "");
  
    const xAxis = d3.axisBottom(xScale)
  .tickFormat(d3.format(".0f")); // ".0f" formata os números como inteiros

svg.append("g")
  .attr("transform", "translate(0," + (h - padding) + ")")
  .attr("id", "x-axis")
  .call(xAxis);

  
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => monthNames(new Date(0, d - 1))); 
    
    svg.append("g")
      .attr("transform", "translate(" + padding + ",0)")
      .attr("id", "y-axis")
      .call(yAxis);
  
    svg.selectAll("rect")
      .data(monthlyVar)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.year))
      .attr("y", d => yScale(d.month))
      .attr("width", w / (lastYear - firstYear + 1))
      .attr("height", yScale.bandwidth())
      .attr("class", "cell")
      .attr("data-month", d => d.month -1)
      .attr("data-year", d => d.year)
      .attr("data-temp", d => (temperature + d.variance).toFixed(1))
      .attr("fill", d => {
        const idvTemperature = temperature + d.variance;
        if (idvTemperature < 3.9) {
          return "rgb(0, 60, 255)";
        } else if (idvTemperature >= 3.9 && idvTemperature < 5) {
          return "rgb(0, 132, 255)";
        } else if (idvTemperature >= 5 && idvTemperature < 6.1) {
          return "rgb(0, 171, 255)";
        } else if (idvTemperature >= 6.1 && idvTemperature < 7.2){
          return "rgb(115, 177, 240)";
        } else if (idvTemperature >= 7.2 && idvTemperature < 8.3) {
          return "rgb(250, 245, 180)";
        } else if (idvTemperature >= 8.3 && idvTemperature < 9.5) {
          return "rgb(212, 195, 114)";
        } else if (idvTemperature >= 9.5 && idvTemperature < 10.6) {
          return "rgb(214, 163, 69)";
        } else if (idvTemperature >= 10.6 && idvTemperature < 11.7) {
          return "rgb(252, 141, 43)";
        } else if (idvTemperature >= 11.7 && idvTemperature < 12.8) {
          return "rgb(217, 22, 22)";
        } else {
          return "white"
        }
      })
      .on("mouseover", function (event, d) {
        const rectangle = this.getBoundingClientRect();
        const xPosition = d3.select(this).attr("x");
        const yPosition = rectangle.top + 10;
        const temperature = d3.select(this).attr("data-temp");
        
        tooltip.transition()
          .style("opacity", .9)
          .attr("data-year", d.year);

        tooltip.html(`Year/Month:${d.year}/${d.month} <br> Temperature: ${temperature}°C <br> Variation: ${d.variance.toFixed(2)}°C`)
          .style("left", (xPosition) + "px")
          .style("top", (yPosition) + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition()
          .duration(1600)
          .style("opacity", 0);
      });
  
      svg.append("text")
      .attr("x", w / 2)
      .attr("y", padding / 2)
      .attr("text-anchor", "middle")
      .attr("id", "title")
      .text("Monthly Global Land-Surface Temperature")
      .attr("font-size", 20);
  
     svg.append("text")
      .attr("x", w / 2)
      .attr("y", padding - 5)
      .attr("text-anchor", "middle")
      .attr("id", "description")
      .text("1753 - 2015: Base Temperature 8.66℃")
      .attr("font-size", 15);
      
    const legendScale = d3.scaleLinear()
  .domain([2.8, 12.8]) // Ajuste o domínio para incluir 2.8°C
  .range([padding + 350, w - padding - 350]);

const legendAxis = d3.axisBottom(legendScale)
  .tickValues([2.8, 3.9, 5, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8])
  .tickFormat(d => d + "°C");

svg.append("g")
  
  .attr("transform", "translate(0," + (h + padding) + ")") // Ajuste a translação para mover a legenda para baixo
  .call(legendAxis);

const legendRects = svg.append("g")
  .attr("id", "legend-rects") // Adiciona o atributo id para o grupo dos retângulos
  .attr("transform", "translate(0," + (h + padding) + ")")
  .attr("id", "legend") // Adiciona o atributo id à legenda
// Adiciona os retângulos à legenda
legendRects.selectAll(".legendSquare")
  .data([2.8, 3.9, 5, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8])
  .enter()
  .append("rect")
  .attr("class", "legendSquare")
  .attr("x", d => legendScale(d))
  .attr("y", -20) // Ajuste a posição y para 0 para alinhar com o eixo x da legenda
  .attr("width", (w - padding * 2 - 200) / 9)
  .attr("height", legendHeight - 30)
  .attr("fill", d => {
    if (d < 3.9) {
      return "rgb(0, 60, 255)";
    } else if (d >= 3.9 && d < 5) {
      return "rgb(0, 132, 255)";
    } else if (d >= 5 && d < 6.1) {
      return "rgb(0, 171, 255)";
    } else if (d >= 6.1 && d < 7.2){
      return "rgb(115, 177, 240)";
    } else if (d >= 7.2 && d < 8.3) {
      return "rgb(250, 245, 180)";
    } else if (d >= 8.3 && d < 9.5) {
      return "rgb(212, 195, 114)";
    } else if (d >= 9.5 && d < 10.6) {
      return "rgb(214, 163, 69)";
    } else if (d >= 10.6 && d < 11.7) {
      return "rgb(252, 141, 43)";
    } else if (d >= 11.7 && d < 12.8) {
      return "rgb(217, 22, 22)";
    } else {
      return "white"
    }
  });
});
