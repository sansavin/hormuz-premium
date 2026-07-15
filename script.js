/* The Hormuz Premium — minimal narrative visualization (interactive slideshow).
   Uses ONLY d3. Data is embedded, so it works with no server and no fetch.

   PARAMETERS  : state.scene
   SCENES      : SCENES[] + draw()
   ANNOTATIONS : annotationsFor() + drawAnnotations() (one shared template)
   TRIGGERS    : Back / Next buttons; hover tooltip (free-form)            */

/* ---- embedded data (real FRED Brent, 2026) ---- */
const PRICE = [["2026-01-02",61.98],["2026-01-05",63.00],["2026-01-06",62.10],["2026-01-07",61.08],
["2026-01-08",63.34],["2026-01-09",65.11],["2026-01-12",65.40],["2026-01-13",67.58],["2026-01-14",68.87],
["2026-01-15",66.16],["2026-01-16",66.97],["2026-01-19",66.91],["2026-01-20",67.68],["2026-01-21",66.72],
["2026-01-22",65.46],["2026-01-23",68.16],["2026-01-26",67.70],["2026-01-27",70.28],["2026-01-28",70.90],
["2026-01-29",71.00],["2026-01-30",72.25],["2026-02-02",67.72],["2026-02-03",70.01],["2026-02-04",71.15],
["2026-02-05",69.87],["2026-02-06",70.45],["2026-02-09",71.19],["2026-02-10",71.01],["2026-02-11",71.52],
["2026-02-12",69.80],["2026-02-13",69.96],["2026-02-16",70.81],["2026-02-17",69.77],["2026-02-18",71.78],
["2026-02-19",73.17],["2026-02-20",72.75],["2026-02-23",71.90],["2026-02-24",71.21],["2026-02-25",70.69],
["2026-02-26",71.66],["2026-02-27",71.32],["2026-03-02",77.24],["2026-03-03",83.28],["2026-03-04",81.56],
["2026-03-05",88.59],["2026-03-06",95.74],["2026-03-09",94.35],["2026-03-10",89.84],["2026-03-11",90.98],
["2026-03-12",102.38],["2026-03-13",103.23],["2026-03-16",101.04],["2026-03-17",108.39],["2026-03-18",118.09],
["2026-03-19",111.05],["2026-03-20",118.42],["2026-03-23",103.79],["2026-03-24",108.42],["2026-03-25",109.14],
["2026-03-26",113.39],["2026-03-27",121.47],["2026-03-30",121.88],["2026-03-31",126.69],["2026-04-01",119.56],
["2026-04-02",127.61],["2026-04-07",138.21],["2026-04-08",122.11],["2026-04-09",119.03],["2026-04-10",119.07],
["2026-04-13",123.28],["2026-04-14",118.69],["2026-04-15",114.93],["2026-04-16",116.63],["2026-04-17",98.63],
["2026-04-20",103.40],["2026-04-21",106.14],["2026-04-22",113.44],["2026-04-23",113.25],["2026-04-24",111.86],
["2026-04-27",113.89],["2026-04-28",117.62],["2026-04-29",124.16],["2026-04-30",124.24],["2026-05-01",118.26],
["2026-05-05",114.51],["2026-05-06",103.70],["2026-05-07",101.82],["2026-05-08",103.48],["2026-05-11",106.11],
["2026-05-12",111.37],["2026-05-13",110.28],["2026-05-14",110.91],["2026-05-15",113.96],["2026-05-18",116.73],
["2026-05-19",114.64],["2026-05-20",108.93],["2026-05-21",105.84],["2026-05-22",106.90],["2026-05-26",102.75],
["2026-05-27",97.11],["2026-05-28",95.47],["2026-05-29",92.88],["2026-06-01",98.29],["2026-06-02",98.49],
["2026-06-03",101.69],["2026-06-04",98.98],["2026-06-05",97.29],["2026-06-08",97.46],["2026-06-09",94.15],
["2026-06-10",95.73],["2026-06-11",92.84],["2026-06-12",88.64],["2026-06-15",84.36],["2026-06-16",80.50],
["2026-06-17",80.33],["2026-06-18",79.35],["2026-06-19",80.46],["2026-06-22",76.49]];

const EVENTS = [
  {date:"2026-02-28", event:"US and Israel launch airstrikes against Iran"},
  {date:"2026-03-04", event:"Iran declares the strait closed; attacks on ships begin"},
  {date:"2026-03-08", event:"Brent surpasses $100 for the first time; ship attacks reported"},
  {date:"2026-03-11", event:"IEA members release 400 million barrels from reserves"},
  {date:"2026-03-27", event:"IRGC formally declares strait closed to US/allied vessels"},
  {date:"2026-04-07", event:"War-peak: Brent reaches $138.21"},
  {date:"2026-04-12", event:"Talks fail; Trump declares US naval blockade of the strait"},
  {date:"2026-05-06", event:"Trump pauses 'Project Freedom' citing progress on a deal"},
  {date:"2026-06-10", event:"Talks stall; US airstrikes; Iran re-declares closure"},
  {date:"2026-06-17", event:"Trump & Pezeshkian sign MoU to end the war"},
  {date:"2026-06-20", event:"Iran claims closure again; US denies"},
  {date:"2026-06-22", event:"Brent back to $76.49 as tankers return"}
];

/* ---- PARAMETER: the only state variable ---- */
const state = { scene: 0 };

/* ---- SCENES: same chart, different annotations ---- */
const SCENES = [
  { title:"Calm before the war",
    desc:"Brent sat near $71 a barrel. On 28 February 2026, US and Israeli airstrikes on Iran began." },
  { title:"Closure and the spike",
    desc:"Iran moved to close the Strait of Hormuz. With about a fifth of seaborne oil at risk, Brent surged to a peak of $138." },
  { title:"The deal and the collapse",
    desc:"A US–Iran memorandum signed 17 June reopened the strait, and Brent gave back almost the entire war premium." }
];

const W=880, H=460, M={top:24,right:24,bottom:30,left:50};
const IW=W-M.left-M.right, IH=H-M.top-M.bottom;
const parse=d3.timeParse("%Y-%m-%d");
const fmt=d3.timeFormat("%-d %b");

const PRICED = PRICE.map(([s,v]) => ({ d:parse(s), brent:v }));
let x, y, gAnno;
const tip = d3.select("#tip");

build();
d3.select("#next").on("click", () => go(1));   // TRIGGER
d3.select("#prev").on("click", () => go(-1));   // TRIGGER
draw();

/* nearest price on or before a date (for placing event dots) */
function priceOn(t){
  let best = PRICED[0].brent;
  for (const p of PRICED){ if (p.d <= t) best = p.brent; else break; }
  return best;
}

function build(){
  x = d3.scaleTime().domain([PRICED[0].d, parse("2026-06-26")]).range([0, IW]);
  y = d3.scaleLinear().domain([55, 145]).range([IH, 0]);

  const svg = d3.select("#chart").append("svg").attr("viewBox", `0 0 ${W} ${H}`);
  const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

  // period background bands: green pre-war, red war/spike, blue after the deal
  const bands = [
    ["2026-01-02","2026-02-28","#e3efe3"],  // pre-war calm  -> green, until the war begins
    ["2026-02-28","2026-06-17","#f6e6e1"],  // war & spike   -> red
    ["2026-06-17","2026-06-26","#e4edf6"]   // deal & after  -> blue
  ];
  g.selectAll("rect.band").data(bands).enter().append("rect").attr("class","band")
    .attr("x", d => x(parse(d[0]))).attr("y", 0)
    .attr("width", d => x(parse(d[1])) - x(parse(d[0]))).attr("height", IH)
    .attr("fill", d => d[2]);

  g.append("g").attr("class","axis").attr("transform",`translate(0,${IH})`)
    .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat("%b")));
  g.append("g").attr("class","axis")
    .call(d3.axisLeft(y).ticks(6).tickFormat(d => "$"+d));

  g.append("path").datum(PRICED).attr("class","line")
    .attr("d", d3.line().x(d=>x(d.d)).y(d=>y(d.brent)));

  // event dots — free-form: hover for details
  const ev = EVENTS.map(e => { const d = parse(e.date); return {...e, d, brent:priceOn(d)}; });
  g.selectAll("circle.pt").data(ev).enter().append("circle")
    .attr("class","pt").attr("r",4)
    .attr("cx",d=>x(d.d)).attr("cy",d=>y(d.brent))
    .on("mousemove",(e,d)=>tip.style("opacity",1)
        .style("left",(e.clientX+12)+"px").style("top",(e.clientY+12)+"px")
        .html(`<b>${fmt(d.d)} · $${d.brent.toFixed(2)}</b><br>${d.event}`))
    .on("mouseleave",()=>tip.style("opacity",0));

  gAnno = g.append("g");
}

/* ANNOTATIONS: one shared template, always visible, change per scene */
function annotationsFor(i){
  const at = ds => ({ d:parse(ds), brent:priceOn(parse(ds)) });
  const peak = PRICED.reduce((a,b)=> b.brent>a.brent ? b : a);
  const last = PRICED[PRICED.length-1];
  const drop = Math.round((peak.brent-last.brent)/peak.brent*100);

  if (i===0) return [
    {p:at("2026-02-27"), dx:18, dy:-52, title:"Pre-war calm", label:"Brent ≈ $71 before the 28 Feb strikes."}
  ];
  if (i===1) return [
    {p:at("2026-03-27"), dx:-150, dy:34, title:"Strait declared closed", label:"IRGC closes it, 27 Mar."},
    {p:peak, dx:10, dy:-18, title:`War peak $${peak.brent.toFixed(0)}`, label:`High on ${fmt(peak.d)}.`}
  ];
  return [
    {p:at("2026-06-17"), dx:-160, dy:-30, title:"Peace deal signed", label:"US–Iran MoU, 17 Jun."},
    {p:last, dx:-44, dy:46, title:`≈ ${drop}% off the peak`, label:`Back to $${last.brent.toFixed(2)} by ${fmt(last.d)}.`}
  ];
}

function drawAnnotations(list){
  gAnno.selectAll("*").remove();
  const a = gAnno.selectAll("g.anno").data(list).enter().append("g").attr("class","anno");
  a.append("line").attr("class","anno-line")
    .attr("x1",d=>x(d.p.d)).attr("y1",d=>y(d.p.brent))
    .attr("x2",d=>x(d.p.d)+d.dx).attr("y2",d=>y(d.p.brent)+d.dy);
  a.append("circle").attr("class","anno-pt").attr("r",3)
    .attr("cx",d=>x(d.p.d)).attr("cy",d=>y(d.p.brent));
  const t = a.append("text").attr("text-anchor",d=>d.dx<0?"end":"start")
    .attr("x",d=>x(d.p.d)+d.dx).attr("y",d=>y(d.p.brent)+d.dy);
  t.append("tspan").attr("class","anno-title").attr("x",d=>x(d.p.d)+d.dx).text(d=>d.title);
  t.append("tspan").attr("class","anno-label").attr("dy","1.3em").attr("x",d=>x(d.p.d)+d.dx).text(d=>d.label);
}

/* SCENES: redraw text + annotations from state.scene */
function draw(){
  d3.select("#title").text(SCENES[state.scene].title);
  d3.select("#desc").text(SCENES[state.scene].desc);
  drawAnnotations(annotationsFor(state.scene));
  d3.select("#prev").property("disabled", state.scene===0);
  d3.select("#next").property("disabled", state.scene===SCENES.length-1);
}

function go(step){
  state.scene = Math.max(0, Math.min(SCENES.length-1, state.scene+step));
  draw();
}
