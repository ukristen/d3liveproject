d3.csv('../data/top_albums.csv').then((data) => {
	createBubbleChart(data);
});

const createBubbleChart = (data) => {
	const metrics = [
		'total_album_consumption_millions',
		'album_sales_millions',
		'song_sales',
		'on_demand_audio_streams_millions',
		'on_demand_video_streams_millions',
	];
	const artists = [];

	data.forEach((datum) => {
		metrics.forEach((metric) => {
			datum[metric] = parseFloat(datum[metric]); // Convert strings to numbers
		});
		artists.push(datum.artist); // Populate the artists array
	});

	console.log(data);
	console.log(artists);
	console.log(metrics);

	const margin = { top: 40, right: 0, bottom: 60, left: 40 };
	const width = 1160;
	const height = 380;

	const bubbleChart = d3
		.select('#bubble-chart')
		.append('svg')
		.attr('viewbox', [0, 0, width, height])
		.attr('width', width)
		.attr('height', height);

	const maxOnDemandAudioStreams = d3.max(
		data,
		(d) => d.on_demand_audio_streams_millions
	);

	const audioStreamsScale = d3
		.scaleLinear()
		.domain([0, maxOnDemandAudioStreams])
		.range([margin.left, width - margin.left - margin.right]);

	bubbleChart
		.append('g')
		.attr('transform', `translate(0, ${height - margin.bottom - margin.top})`)
		.call(d3.axisBottom(audioStreamsScale));

	bubbleChart
		.append('text')
		.attr('text-anchor', 'end')
		.attr('x', width - margin.right - margin.left)
		.attr('y', height - margin.top - margin.bottom + 50)
		.text('On-demand Audio Streams (millions)');

	const maxOnDemandVideoStreams = d3.max(
		data,
		(d) => d.on_demand_video_streams_millions
	);

	const videoStreamsScale = d3
		.scaleLinear()
		.domain([0, maxOnDemandVideoStreams])
		.range([height - margin.top - margin.bottom, margin.top]);

	bubbleChart
		.append('g')
		.attr('transform', `translate(${margin.left}, 0)`)
		.call(d3.axisLeft(videoStreamsScale));
	bubbleChart
		.append('text')
		.attr('text-anchor', 'start')
		.attr('x', margin.left)
		.attr('y', 20)
		.text('On-demand Video Streams (millions)');

	const bubblesAreaScale = d3
		.scaleLinear()
		.domain([0, d3.max(data, (d) => d.album_sales_millions)])
		.range([0, 2000]);
	const colorScale = d3
		.scaleOrdinal()
		.domain(artists)
		.range(d3.schemeTableau10);

	bubbleChart
		.append('g')
		.attr('class', 'bubbles-group')
		.selectAll('circle')
		.data(data)
		.join('circle')
		.attr('cx', (d) => audioStreamsScale(d.on_demand_audio_streams_millions))
		.attr('cy', (d) => videoStreamsScale(d.on_demand_video_streams_millions))
		.attr('r', (d) =>
			Math.sqrt(bubblesAreaScale(d.album_sales_millions) / Math.PI)
		)
		.attr('fill', (d) => colorScale(d.artist));

	// Append color legend
	const colorLegend = d3
		.select('.legend-color')
		.append('ul')
		.selectAll('.bubble-color-legend-item')
		.data(data)
		.join('li')
		.attr('class', 'bubble-color-legend-item');
	colorLegend
		.append('span')
		.attr('class', 'legend-circle')
		.style('background-color', (d, i) => {
			return d3.schemeTableau10[i];
		});
	colorLegend
		.append('span')
		.attr('class', 'legend-label')
		.text((d) => `${d.title}, ${d.artist}`);

	// Append area legend
	const areaLegendCircles = d3
		.select('.legend-area')
		.append('svg')
		.attr('viewbox', [0, 0, 150, 100])
		.attr('width', 150)
		.attr('height', 100);

	const circlesGroup = areaLegendCircles
		.append('g')
		.attr('class', 'circles-group')
		.attr('fill', '#727a87')
		.attr('fill-opacity', 0.4);
	circlesGroup
		.append('circle')
		.attr('cx', Math.sqrt(bubblesAreaScale(1.5) / Math.PI))
		.attr('cy', Math.sqrt(bubblesAreaScale(1.5) / Math.PI) + 5)
		.attr('r', Math.sqrt(bubblesAreaScale(1.5) / Math.PI));
	circlesGroup
		.append('circle')
		.attr('cx', Math.sqrt(bubblesAreaScale(1.5) / Math.PI))
		.attr(
			'cy',
			2 * Math.sqrt(bubblesAreaScale(1.5) / Math.PI) -
				Math.sqrt(bubblesAreaScale(0.5) / Math.PI) +
				5
		)
		.attr('r', Math.sqrt(bubblesAreaScale(0.5) / Math.PI));
	circlesGroup
		.append('circle')
		.attr('cx', Math.sqrt(bubblesAreaScale(1.5) / Math.PI))
		.attr(
			'cy',
			2 * Math.sqrt(bubblesAreaScale(1.5) / Math.PI) -
				Math.sqrt(bubblesAreaScale(0.1) / Math.PI) +
				5
		)
		.attr('r', Math.sqrt(bubblesAreaScale(0.1) / Math.PI));

	const linesGroup = areaLegendCircles
		.append('g')
		.attr('class', 'lines-group')
		.attr('stroke', '#333')
		.attr('stroke-dasharray', '6 4');
	linesGroup
		.append('line')
		.attr('x1', Math.sqrt(bubblesAreaScale(1.5) / Math.PI))
		.attr('y1', 5)
		.attr('x2', Math.sqrt(bubblesAreaScale(1.5) / Math.PI) + 60)
		.attr('y2', 5);
	linesGroup
		.append('line')
		.attr('x1', Math.sqrt(bubblesAreaScale(1.5) / Math.PI))
		.attr(
			'y1',
			2 * Math.sqrt(bubblesAreaScale(1.5) / Math.PI) -
				2 * Math.sqrt(bubblesAreaScale(0.5) / Math.PI) +
				5
		)
		.attr('x2', Math.sqrt(bubblesAreaScale(1.5) / Math.PI) + 60)
		.attr(
			'y2',
			2 * Math.sqrt(bubblesAreaScale(1.5) / Math.PI) -
				2 * Math.sqrt(bubblesAreaScale(0.5) / Math.PI) +
				5
		);
	linesGroup
		.append('line')
		.attr('x1', Math.sqrt(bubblesAreaScale(1.5) / Math.PI))
		.attr(
			'y1',
			2 * Math.sqrt(bubblesAreaScale(1.5) / Math.PI) -
				2 * Math.sqrt(bubblesAreaScale(0.1) / Math.PI) +
				5
		)
		.attr('x2', Math.sqrt(bubblesAreaScale(1.5) / Math.PI) + 60)
		.attr(
			'y2',
			2 * Math.sqrt(bubblesAreaScale(1.5) / Math.PI) -
				2 * Math.sqrt(bubblesAreaScale(0.1) / Math.PI) +
				5
		);

	const labelsGroup = areaLegendCircles
		.append('g')
		.attr('class', 'labels-group')
		.attr('fill', '#333');
	labelsGroup
		.append('text')
		.attr('class', 'label')
		.attr('x', Math.sqrt(bubblesAreaScale(1.5) / Math.PI) + 70)
		.attr('y', 10)
		.text('1.5M');
	labelsGroup
		.append('text')
		.attr('class', 'label')
		.attr('x', Math.sqrt(bubblesAreaScale(1.5) / Math.PI) + 70)
		.attr(
			'y',
			2 * Math.sqrt(bubblesAreaScale(1.5) / Math.PI) -
				2 * Math.sqrt(bubblesAreaScale(0.5) / Math.PI) +
				10
		)
		.text('0.5M');
	labelsGroup
		.append('text')
		.attr('class', 'label')
		.attr('x', Math.sqrt(bubblesAreaScale(1.5) / Math.PI) + 70)
		.attr(
			'y',
			2 * Math.sqrt(bubblesAreaScale(1.5) / Math.PI) -
				2 * Math.sqrt(bubblesAreaScale(0.1) / Math.PI) +
				10
		)
		.text('0.1M');
};
