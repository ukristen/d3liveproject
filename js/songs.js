const topRockSongs = [
	{ artist: 'Fleetwod Mac', title: 'Dreams', sales_and_streams: 1882000 },
	{ artist: 'AJR', title: 'Bang!', sales_and_streams: 1627000 },
	{ artist: 'Imagine Dragons', title: 'Believer', sales_and_streams: 1571000 },
	{
		artist: 'Journey',
		title: "Don't Stop Believin'",
		sales_and_streams: 1497000,
	},
	{ artist: 'Eagles', title: 'Hotel California', sales_and_streams: 1393000 },
];

const topSongsSection = d3.select('#top-songs');

topSongsSection.append('h3').text('Top Rock Songs');

const circlesChartWidth = 600;
const circlesChartHeight = 200;
const circlesChartMargin = 20;

const circlesChart = topSongsSection
	.append('svg')
	.attr('viewbox', [0, 0, circlesChartWidth, circlesChartHeight])
	.attr('width', circlesChartWidth)
	.attr('height', circlesChartHeight);

circlesChart
	.append('line')
	.attr('x1', 0)
	.attr('y1', circlesChartHeight / 2)
	.attr('x2', circlesChartWidth)
	.attr('y2', circlesChartHeight / 2)
	.attr('stroke', '#333')
	.attr('stroke-width', 2);

const circlesChartGroup = circlesChart
	.selectAll('g')
	.data(topRockSongs)
	.join('g')
	.attr('class', 'circle-group');

const radiusMax = 40;

const circlesScale = d3
	.scaleLinear()
	.domain([0, d3.max(topRockSongs, (d) => d.sales_and_streams)])
	.range([0, Math.PI * Math.pow(radiusMax, 2)]);

circlesChartGroup
	.append('circle')
	.attr('r', (d) => Math.sqrt(circlesScale(d.sales_and_streams) / Math.PI))
	.attr(
		'cx',
		(d, i) =>
			radiusMax + circlesChartMargin + i * 2 * (radiusMax + circlesChartMargin)
	)
	.attr('cy', circlesChartHeight / 2)
	.attr('fill', 'olive');

circlesChartGroup
	.append('text')
	.attr('class', '.song')
	.attr(
		'x',
		(d, i) =>
			radiusMax + circlesChartMargin + i * 2 * (radiusMax + circlesChartMargin)
	)
	.attr('text-anchor', 'middle')
	.style('font-size', '9px')
	.attr('y', 150)
	.text((d) => d.title);

circlesChartGroup
	.append('text')
	.attr('class', '.sales')
	.attr(
		'x',
		(d, i) =>
			radiusMax + circlesChartMargin + i * 2 * (radiusMax + circlesChartMargin)
	)
	.attr('text-anchor', 'middle')
	.style('font-size', '9px')
	.attr('y', 50)
	.text((d) => d.sales_and_streams / 1000000 + 'M');
