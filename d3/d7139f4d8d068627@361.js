export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([
    ["compiled_data.csv", new URL("../files/8407478d233c4e4cf8ec37514524eacb9609b14471de957a51186eb286def8b24f4d526a3cc97b34c314835a8d70f782848b9a886c7e50b25af00c13f3fdadf2",
      import.meta.url)]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function (md) {
    return (
      md `# Test
  Myanmar COVID-19 Data Series. Data: JHU CSSE COVID-19 Data`
    )
  });
  main.variable(observer("chart0")).define("chart0", ["d3", "DOM", "width", "height", "xAxis", "yAxis", "data0", "line", "bisect", "x", "y", "callout", "formatDate"], function (d3, DOM, width, height, xAxis, yAxis, data0, line, bisect, x, y, callout, formatDate) {
    const svg = d3.select(DOM.svg(width, height))
      .style("-webkit-tap-highlight-color", "transparent")
      .style("overflow", "visible");

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    svg.append("path")
      .datum(data0)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);

    const tooltip = svg.append("g");

    svg.on("touchmove mousemove", function (event) {
      const {
        date,
        value
      } = bisect(d3.pointer(event, this)[0]);

      tooltip
        .attr("transform", `translate(${x(date)},${y(value)})`)
        .call(callout, `${value} cases
                        ${formatDate(date)}`);
    });

    svg.on("touchend mouseleave", () => tooltip.call(callout, null));

    return svg.node();
  });
  main.variable(observer("callout")).define("callout", function () {
    return (
      (g, value) => {
        if (!value) return g.style("display", "none");

        g
          .style("display", null)
          .style("pointer-events", "none")
          .style("font", "10px sans-serif");

        const path = g.selectAll("path")
          .data([null])
          .join("path")
          .attr("fill", "white")
          .attr("stroke", "black");

        const text = g.selectAll("text")
          .data([null])
          .join("text")
          .call(text => text
            .selectAll("tspan")
            .data((value + "").split(/\n/))
            .join("tspan")
            .attr("x", 0)
            .attr("y", (d, i) => `${i * 1.1}em`)
            .style("font-weight", (_, i) => i ? null : "bold")
            .text(d => d));

        const {
          x,
          y,
          width: w,
          height: h
        } = text.node().getBBox();

        text.attr("transform", `translate(${-w / 2},${15 - y})`);
        path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
      }
    )
  });
  main.variable(observer("data0")).define("data0", ["d3", "FileAttachment"], async function (d3, FileAttachment) {
    return (
      Object.assign(d3.csvParse(await FileAttachment("confirmed_data@3.csv").text(), d3.autoType).map(({
        date,
        cases
      }) => ({
        date,
        value: cases
      })), {
        y: "Lab Confirmed Cases"
      })
    )
  });
  main.variable(observer("x")).define("x", ["d3", "data0", "margin", "width"], function (d3, data0, margin, width) {
    return (
      d3.scaleUtc()
      .domain(d3.extent(data0, d => d.date))
      .range([margin.left, width - margin.right])
    )
  });
  main.variable(observer("y")).define("y", ["d3", "data0", "height", "margin"], function (d3, data0, height, margin) {
    return (
      d3.scaleLinear()
      .domain([0, d3.max(data0, d => d.value)]).nice()
      .range([height - margin.bottom, margin.top])
    )
  });
  main.variable(observer("xAxis")).define("xAxis", ["height", "margin", "d3", "x", "width"], function (height, margin, d3, x, width) {
    return (
      g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    )
  });
  main.variable(observer("yAxis")).define("yAxis", ["margin", "d3", "y", "data0"], function (margin, d3, y, data0) {
    return (
      g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data0.y))
    )
  });
  main.variable(observer("line")).define("line", ["d3", "x", "y"], function (d3, x, y) {
    return (
      d3.line()
      .curve(d3.curveStep)
      .defined(d => !isNaN(d.value))
      .x(d => x(d.date))
      .y(d => y(d.value))
    )
  });
  main.variable(observer("formatValue")).define("formatValue", function () {
    return (
      function formatValue(value) {
        return value.toLocaleString("en", {
          style: "currency",
          currency: "USD"
        });
      }
    )
  });
  main.variable(observer("formatDate")).define("formatDate", function () {
    return (
      function formatDate(date) {
        return date.toLocaleString("en", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC"
        });
      }
    )
  });
  main.variable(observer("bisect")).define("bisect", ["d3", "x", "data0"], function (d3, x, data0) {
    const bisect = d3.bisector(d => d.date).left;
    return mx => {
      const date = x.invert(mx);
      const index = bisect(data0, date, 1);
      const a = data0[index - 1];
      const b = data0[index];
      return b && (date - a.date > b.date - date) ? b : a;
    };
  });
  main.variable(observer("height")).define("height", function () {
    return (
      500
    )
  });
  main.variable(observer("margin")).define("margin", function () {
    return ({
      top: 20,
      right: 30,
      bottom: 30,
      left: 40
    })
  });
  
  // End of Chart 0
  // Start of Chart1
  main.variable(observer("chart1")).define("chart1", ["d3", "DOM", "width", "height", "xAxis1", "yAxis1", "data1", "line1", "bisect1", "x1", "y1", "callout1", "formatDate"], function (d3, DOM, width, height, xAxis1, yAxis1, data1, line1, bisect1, x1, y1, callout1, formatDate) {
    const svg = d3.select(DOM.svg(width, height))
      .style("-webkit-tap-highlight-color", "transparent")
      .style("overflow", "visible");

    svg.append("g")
      .call(xAxis1);

    svg.append("g")
      .call(yAxis1);

    svg.append("path")
      .datum(data1)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line1);

    const tooltip = svg.append("g");

    svg.on("touchmove mousemove", function (event) {
      const {
        date,
        value
      } = bisect1(d3.pointer(event, this)[0]);

      tooltip
        .attr("transform", `translate(${x1(date)},${y1(value)})`)
        .call(callout1, `${value} deaths
                        ${formatDate(date)}`);
    });

    svg.on("touchend mouseleave", () => tooltip.call(callout1, null));

    return svg.node();
  });
  main.variable(observer("data1")).define("data1", ["d3", "FileAttachment"], async function (d3, FileAttachment) {
    return (
      Object.assign(d3.csvParse(await FileAttachment("compiled_data.csv").text(), d3.autoType).map(({
        date,
        deaths
      }) => ({
        date,
        value: deaths
      })), {
        y: "Deaths"
      })
    )
  });
  main.variable(observer("callout1")).define("callout1", function () {
    return (
      (g, value) => {
        if (!value) return g.style("display", "none");

        g
          .style("display", null)
          .style("pointer-events", "none")
          .style("font", "10px sans-serif");

        const path = g.selectAll("path")
          .data([null])
          .join("path")
          .attr("fill", "white")
          .attr("stroke", "black");

        const text = g.selectAll("text")
          .data([null])
          .join("text")
          .call(text => text
            .selectAll("tspan")
            .data((value + "").split(/\n/))
            .join("tspan")
            .attr("x", 0)
            .attr("y", (d, i) => `${i * 1.1}em`)
            .style("font-weight", (_, i) => i ? null : "bold")
            .text(d => d));

        const {
          x,
          y,
          width: w,
          height: h
        } = text.node().getBBox();

        text.attr("transform", `translate(${-w / 2},${15 - y})`);
        path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
      }
    )
  });
  main.variable(observer("x1")).define("x1", ["d3", "data1", "margin", "width"], function (d3, data1, margin, width) {
    return (
      d3.scaleUtc()
      .domain(d3.extent(data1, d => d.date))
      .range([margin.left, width - margin.right])
    )
  });
  main.variable(observer("y1")).define("y1", ["d3", "data1", "height", "margin"], function (d3, data1, height, margin) {
    return (
      d3.scaleLinear()
      .domain([0, d3.max(data1, d => d.value)]).nice()
      .range([height - margin.bottom, margin.top])
    )
  });
  main.variable(observer("xAxis1")).define("xAxis1", ["height", "margin", "d3", "x1", "width"], function (height, margin, d3, x1, width) {
    return (
      g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x1).ticks(width / 80).tickSizeOuter(0))
    )
  });
  main.variable(observer("yAxis1")).define("yAxis1", ["margin", "d3", "y1", "data1"], function (margin, d3, y1, data1) {
    return (
      g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y1))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data1.y))
    )
  });
  main.variable(observer("line1")).define("line1", ["d3", "x1", "y1"], function (d3, x1, y1) {
    return (
      d3.line()
      .curve(d3.curveStep)
      .defined(d => !isNaN(d.value))
      .x(d => x1(d.date))
      .y(d => y1(d.value))
    )
  });
  main.variable(observer("bisect1")).define("bisect1", ["d3", "x1", "data1"], function (d3, x1, data1) {
    const bisect1 = d3.bisector(d => d.date).left;
    return mx => {
      const date = x1.invert(mx);
      const index = bisect1(data1, date, 1);
      const a = data1[index - 1];
      const b = data1[index];
      return b && (date - a.date > b.date - date) ? b : a;
    };
  });
  // End of Chart1
  // Start of Chart2
  main.variable(observer("chart2")).define("chart2", ["d3", "DOM", "width", "height", "xAxis2", "yAxis2", "data2", "line2", "bisect2", "x2", "y2", "callout2", "formatDate"], function (d3, DOM, width, height, xAxis2, yAxis2, data2, line2, bisect2, x2, y2, callout2, formatDate) {
    const svg = d3.select(DOM.svg(width, height))
      .style("-webkit-tap-highlight-color", "transparent")
      .style("overflow", "visible");

    svg.append("g")
      .call(xAxis2);

    svg.append("g")
      .call(yAxis2);

    svg.append("path")
      .datum(data2)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line2);

    const tooltip = svg.append("g");

    svg.on("touchmove mousemove", function (event) {
      const {
        date,
        value
      } = bisect2(d3.pointer(event, this)[0]);

      tooltip
        .attr("transform", `translate(${x2(date)},${y2(value)})`)
        .call(callout2, `${value} recovered
                        ${formatDate(date)}`);
    });

    svg.on("touchend mouseleave", () => tooltip.call(callout2, null));

    return svg.node();
  });
  main.variable(observer("data2")).define("data2", ["d3", "FileAttachment"], async function (d3, FileAttachment) {
    return (
      Object.assign(d3.csvParse(await FileAttachment("compiled_data.csv").text(), d3.autoType).map(({
        date,
        recovered
      }) => ({
        date,
        value: recovered
      })), {
        y: "Recovered"
      })
    )
  });
  main.variable(observer("callout2")).define("callout2", function () {
    return (
      (g, value) => {
        if (!value) return g.style("display", "none");

        g
          .style("display", null)
          .style("pointer-events", "none")
          .style("font", "10px sans-serif");

        const path = g.selectAll("path")
          .data([null])
          .join("path")
          .attr("fill", "white")
          .attr("stroke", "black");

        const text = g.selectAll("text")
          .data([null])
          .join("text")
          .call(text => text
            .selectAll("tspan")
            .data((value + "").split(/\n/))
            .join("tspan")
            .attr("x", 0)
            .attr("y", (d, i) => `${i * 1.1}em`)
            .style("font-weight", (_, i) => i ? null : "bold")
            .text(d => d));

        const {
          x,
          y,
          width: w,
          height: h
        } = text.node().getBBox();

        text.attr("transform", `translate(${-w / 2},${15 - y})`);
        path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
      }
    )
  });
  main.variable(observer("x2")).define("x2", ["d3", "data2", "margin", "width"], function (d3, data2, margin, width) {
    return (
      d3.scaleUtc()
      .domain(d3.extent(data2, d => d.date))
      .range([margin.left, width - margin.right])
    )
  });
  main.variable(observer("y2")).define("y2", ["d3", "data2", "height", "margin"], function (d3, data2, height, margin) {
    return (
      d3.scaleLinear()
      .domain([0, d3.max(data2, d => d.value)]).nice()
      .range([height - margin.bottom, margin.top])
    )
  });
  main.variable(observer("xAxis2")).define("xAxis2", ["height", "margin", "d3", "x2", "width"], function (height, margin, d3, x2, width) {
    return (
      g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x2).ticks(width / 80).tickSizeOuter(0))
    )
  });
  main.variable(observer("yAxis2")).define("yAxis2", ["margin", "d3", "y2", "data2"], function (margin, d3, y2, data2) {
    return (
      g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y2))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data2.y))
    )
  });
  main.variable(observer("line2")).define("line2", ["d3", "x2", "y2"], function (d3, x2, y2) {
    return (
      d3.line()
      .curve(d3.curveStep)
      .defined(d => !isNaN(d.value))
      .x(d => x2(d.date))
      .y(d => y2(d.value))
    )
  });
  main.variable(observer("bisect2")).define("bisect2", ["d3", "x2", "data2"], function (d3, x2, data2) {
    const bisect2 = d3.bisector(d => d.date).left;
    return mx => {
      const date = x2.invert(mx);
      const index = bisect2(data2, date, 1);
      const a = data2[index - 1];
      const b = data2[index];
      return b && (date - a.date > b.date - date) ? b : a;
    };
  });
  // End of Chart2
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return (
      require("d3@6")
    )
  });
  return main;
}