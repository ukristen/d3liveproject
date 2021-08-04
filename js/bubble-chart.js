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
		.range([0, width - margin.left]);

	bubbleChart
		.append('g')
		.attr('transform', `translate(0, ${height - margin.bottom - margin.top})`)
		.call(d3.axisBottom(audioStreamsScale))
		.append('text', 'On-demand Video Streams (millions)');

	const maxOnDemandVideoStreams = d3.max(
		data,
		(d) => d.on_demand_video_streams_millions
	);

	const videoStreamsScale = d3
		.scaleLinear()
		.domain([0, maxOnDemandVideoStreams])
		.range([0, height - margin.bottom - margin.top]);

	bubbleChart
		.append('g')
		.attr('transform', `translate(0, ${width - margin.top - margin.bottom})`)
		.call(d3.axisLeft(videoStreamsScale))
		.append('text', 'On-demand Video Streams (millions)');
};
