# Time Range Wheel Slider (Circular Knob Slider)
jQuery Plugin for selecting time ranges<br>
build upon D3.js


## jQuery initialization and customization
This plugin requires jQuery (&gt;= 1.8.x) and D3.js (&gt;= v5.4.0)<br>Font Awesome (4.4.x) is used for the handles inner icon symbols.

## Minimal html configuration
```html
<div class="graph-left"></div>
<div id="knobcontainer"></div>
<div class="graph-right"></div>
<div class="graph-center"></div>
```

## jQuery initialization and customization
This plugin requires jQuery (>= 1.8.x) and D3.js (&gt;= v5.4.0)
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
--- | ---	
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
`data` |	the initial data object<br> needs start and end parameter
`onChange` |	call back function for the selected time values<br> returns an object with start, end and duration parameters (formated as time string in 24 hour format)

## Demo

See working demo on [developer.jpweiner.net](http://developer.jpweiner.net/timerangewheel.html).


## Credits

Built on top of [jQuery Boilerplate](http://jqueryboilerplate.com).

## License

[MIT License](http://zenorocha.mit-license.org/) © Zeno Rocha
