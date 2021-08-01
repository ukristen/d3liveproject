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

const circleChartWidth = 600;
const circleChartHeight = 200;

const circlesChart = topSongsSection
	.append('svg')
	.attr('viewbox', [0, 0, circleChartWidth, circleChartHeight]);

circlesChart
	.append('line')
	.attr('x1', 0)
	.attr('y1', 75)
	.attr('x2', circleChartWidth)
	.attr('y2', 75)
	.attr('stroke', '#333')
	.attr('stroke-width', 2);

const circlesChartGroup = circlesChart
	.selectAll('g')
	.data(topRockSongs)
	.join('g');

const circlesScale = d3.scaleLinear().domain([0, 1882000]);

d3.max(topRockSongs, (d) => d.sales_and_streams);

circlesChartGroup
	.append('circle')
	.attr('r', (d) => Math.sqrt(circlesScale(d.sales_and_streams) / Math.PI) * 30)
	.attr('cx', (d, i) => 60 * i)
	.attr('cy', 75)
	.attr('fill', 'olive');

circlesChartGroup
	.append('text')
	.attr('class', '.song')
	.attr('text-anchor', 'middle')
	.style('font-size', '9px')
	.attr('x', (d, i) => 60 * i)
	.attr('y', 100)
	.text((d) => d.title);

circlesChartGroup
	.append('text')
	.attr('class', '.sales')
	.attr('text-anchor', 'middle')
	.style('font-size', '9px')
	.attr('x', (d, i) => 60 * i)
	.attr('y', 50)
	.text((d) => d.sales_and_streams / 1000000 + 'M');
