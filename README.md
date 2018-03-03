# timerangewheelslider
jQuery Plugin for selecting time range


## jQuery initialization and customization
This plugin requires jQuery (&gt;= 1.8.x) and D3.js (v4)<br>Font Awesome (4.4.x) is used for the handles inner icon symbols.

## Minimal html configuration
$ &lt;div class=&quot;graph-left&quot;&gt;&lt;/div&gt;
$ &lt;div id=&quot;knobcontainer&quot;&gt;&lt;/div&gt;
$ &lt;div class=&quot;graph-right&quot;&gt;&lt;/div&gt;
$ &lt;div class=&quot;graph-center&quot;&gt;&lt;/div&gt;

## jQuery initialization and customization
This plugin requires jQuery (>= 1.8.x) and D3.js (v4)
Font Awesome (4.4.x) is used for the handles inner icon symbols.

```
$("#knobcontainer").timerangewheel({
	indicatorWidth: 12,
	handleRadius: 15,
	handleStrokeWidth: 1,
	accentColor: '#fed766',
	handleIconColor: "#8a9097",
	handleStrokeColor: "#8a9097",
	handleFillColorStart: "#374149",
	handleFillColorEnd: "#374149",
	tickColor: "#8a9097",
	indicatorBackgroundColor: "#8a9097",
	data: {"start":"19:10", "end":"02:00"},
	onChange: function (timeObj) {
		$(".graph-left").html("Start: "+timeObj.start);
		$(".graph-right").html("End: "+timeObj.end);
		$(".graph-center").html("Duration: "+timeObj.duration);
	}
});
```

## Options and parameters
Parameter | Description
`indicatorWidth` |	width of the indicator circle segment in pixel
`handleRadius` |	radius of the handles in pixel
`handleStrokeWidth` |	stroke width of the handle ring in pixel
`accentColor` |	color of the indicator circle segment
`handleIconColor` |	font color of the handles icons
`handleStrokeColor` |	stroke color of the handle ring
`handleFillColorStart` |	color of the start handles inner circle
`handleFillColorEnd` |	color of the end handles inner circle
`tickColor` |	color of the clock ticks
`indicatorBackgroundColor` |	color of the indicator circle segment striped background
`data` |	the initial data object, needs start and end parameter
`onChange` |	call back function for the selected time values, returns an object with start, end and duration parameters (formated as time string in 24 hour format)
