// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, d3, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "timerangewheel",
			defaults = {
				width: 240,
				height: 240,
				margin: { top:20, left:20, bottom:20, right:20 },
				offset: 80,
				indicatorWidth: 12,
				accentColor: '#d81b60',				
				handleRadius: 14,
				handleStrokeWidth: 2,
				handleStrokeColor: "#ffffff",
				handleIconColor: "#333333",
				handleFillColorStart: "#ffffff",
				handleFillColorEnd: "#d81b60",
				rangeTotal: 24,
				tickColor: "#f9f9f9",
				indicatorBackgroundColor: "#d3d3d3"
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = element;
			//this.options = options;

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			graph: {
				svg: {},
				pie: {},
				arc: {}
			},		
			
			helper: {
				settings: {},
				graphdata: [],
				//http://momentjs.com/docs/#/durations/
				//https://stackoverflow.com/questions/17599054/is-there-a-simple-way-to-convert-a-decimal-time-e-g-1-074-minutes-into-mmss
				calculateTime: function(hours) {
					var symbol = hours < 0 ? "-" : "";
					var h = Math.floor(Math.abs(hours));
					var m = Math.floor((Math.abs(hours) * 60) % 60);
					//minutes in steps of 5
					return symbol + (h < 10 ? "0" : "") + h  + ":" + (m < 10 ? "0" : "") + (m - (m % 5));
				},

				calculateTimeFromMinutes: function(min) {
					var hours = Math.floor( min / 60);          
					var minutes = min % 60;
					
					return (hours < 10 ? "0" : "")+hours+":"+(minutes < 10 ? "0" : "")+minutes;
				},
				
				calculateDuration: function(startAngle, endAngle) {
					var duration;
					var angleToSegments = d3.scaleLinear().range([0,288]).domain([0,360]); //24 Hours have 288 5 Min. Segments
					
					duration = angleToSegments(endAngle) - angleToSegments(startAngle);
					if(duration < 0) duration = 288 + duration; //288 segmente mit 5min
					
					return this.calculateTimeFromMinutes(duration*5);
				},
				
				createTimeInfoObject: function(data) {
					var angleToSegments = d3.scaleLinear().range([0,288]).domain([0,360]); //24 Hours have 288 5 Min. Segments
					//var angleToFiveMinuteScale = d3.scale.linear().range([0,360]).domain([0,288]); //24 Hours have 288 5 Min. Segments				
					var startAngle, endAngle, startTimeInfo, endTimeInfo, duration;
					startTimeInfo = this.calculateTimeFromMinutes(angleToSegments(data.aAngle)*5);
					endTimeInfo = this.calculateTimeFromMinutes(angleToSegments(data.eAngle)*5);
					duration = this.calculateDuration(data.aAngle, data.eAngle);
									
					return {start: startTimeInfo, end: endTimeInfo, duration: duration};
				},
				
				calculateKnobInitialData: function(initialData) {		
					var start, end, time, value=0, angle=0, minuteSegments=0;
					var angleToHours = d3.scaleLinear().range([0,360]).domain([0,this.settings.rangeTotal]);
					var segmentsToAngle = d3.scaleLinear().range([0,360]).domain([0,288]); //24 Hours have 288 5 Min. Segments
								
					time = initialData.start.split(":");
					minuteSegments = time[0]*12; //hours with 5 minutes
					minuteSegments += (time[1]*1)/5;
					angle = segmentsToAngle(minuteSegments);
					value = angleToHours.invert(angle);
					
					this.graphdata.push({value: value, label:'a', angle: angle}); //Anfang
					
					time = initialData.end.split(":");
					minuteSegments = time[0]*12; //hours with 5 minutes
					minuteSegments += (time[1]*1)/5;
					angle = segmentsToAngle(minuteSegments);
					value = angleToHours.invert(angle);
			
					this.graphdata.push({value: value, label:'e', angle: angle}); //Ende
					
				},
				
				calculateKnobUpdateHandleData: function(value) {
					var start, end, time, value=0, angle=0, minuteSegments=0;
					var angleToHours = d3.scaleLinear().range([0,360]).domain([0,this.settings.rangeTotal]);
					var segmentsToAngle = d3.scaleLinear().range([0,360]).domain([0,288]); //24 Hours have 288 5 Min. Segments
								
					time = initialData.start.split(":");
					minuteSegments = time[0]*12; //hours with 5 minutes
					minuteSegments += (time[1]*1)/5;
					angle = segmentsToAngle(minuteSegments);
					value = angleToHours.invert(angle);
					
					this.graphdata.push({value: value, label:'a', angle: angle}); //Anfang
					
					time = initialData.end.split(":");
					minuteSegments = time[0]*12; //hours with 5 minutes
					minuteSegments += (time[1]*1)/5;
					angle = segmentsToAngle(minuteSegments);
					value = angleToHours.invert(angle);
			
					this.graphdata.push({value: value, label:'e', angle: angle}); //Ende
					
				},
				
				getValueOfDataSet: function(label) {
					var value = 0;
					this.graphdata.forEach(function(el,i){
						//console.log(el.label, label, el.value);
						if(el.label == label) value = el.value;
					});
					return value;
				},
				
				getAngleOfDataSet: function(label) {
					var angle = 0;
					this.graphdata.forEach(function(el,i){
						if(el.label == label) angle = el.angle;
					});
					return angle;
				},
				
				getData: function() {
					return this.graphdata;
				}
			
			},
			
			
			init: function() {

				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like the example below
				//this.yourOtherFunction( this.settings.propertyName );				
				
				var _this = this;
				var ringbgrd, holder, indicatorArc, handles, dragBehavior;
				var a, e, startAngle, endAngle;					
				var tmpVal = null; //for 5min intervall buffer
				
//https://amdevblog.wordpress.com/2016/07/20/update-d3-js-scripts-from-v3-to-v4/
				

				//converts angle to total hours (11.083333333333334 -> 11:05 - > 166.25)
				var angularScale = d3.scaleLinear().range([0,360]).domain([0,this.settings.rangeTotal]);
				//converts angle to 5 Min Segments
				var angleToFiveMinuteScale = d3.scaleLinear().range([0,360]).domain([0,288]); //24 Hours have 288 5 Min. Segments
				

				var height = this.settings.height, width = this.settings.width, margin = this.settings.margin;			
				var radius = (Math.min(width, height) - margin.top - margin.bottom)/2;
				var outerRadius =  radius + this.settings.indicatorWidth/2;
				var innerRadius = outerRadius - this.settings.indicatorWidth;
				
				


				var dragmoveHandles = function (d,i) {
					var activeHandle = d3.select(this).classed('active', true); //selektiert den aktiven handle
					var coordinates = d3.mouse(_this.graph.svg.node());
					
					var x = coordinates[0]-radius; //radius = 130 --> 150 - margin!
					var y = coordinates[1]-radius;
					
					var newVal;			
						
					
					//var newAngle = Math.atan2( y , x )* 57.2957795; // 1 radian = 57.2957795 degree
					var newAngle = (Math.atan2( y , x )* 180 / Math.PI)+90;					

						
					if(newAngle<0){
						newAngle = 360 + newAngle;
					}
					
					//segment the angle!!!!!!
					newAngle = newAngle-((newAngle * 100) % 125)/100; //make a stop every 1,25° = 5 Min.
					
					
					//if (!activeHandle.classed('false', true)) 
					d.value = angularScale.invert(newAngle);
					d.angle = newAngle.toFixed(2);
						
						
																	
					//only update handles if new value has been detected AND Situation is NOT ARMED
					if(d.angle != tmpVal) {
						tmpVal = d.angle;
						updateHandles(activeHandle);
						checkHandlesPosition(d.label);
					}
				}	
					
					
				//-----------------------------	
				//zeichne kreis neu entsprechend daten
				var updateArc = function (value, id, label, angle) {
					
					var handlerContainer = d3.selectAll('#handles .handlercontainer'); //selektiert alle handles
					var startValue = 0;
					var endValue = 0;
					var angleLength = 0;
					var newarc;			

					
					/*
					 * recalulate data for arc indicator and assign new values
					 * get new data values from handlers
					*/				
					
					handlerContainer.each(function(d, i) {						
												
						if(d.label == "a") {startValue = d.angle; }
						if(d.label == "e") {endValue = d.angle; }		
					});
						


					if(startValue*1 > endValue*1) {
						startValue = (startValue*1)-360;
					}



					//replace arc
					_this.graph.arc = d3.arc()
						.innerRadius(innerRadius)
						.outerRadius(outerRadius)
						.startAngle(function(d){ return startValue*(Math.PI/180); })
						.endAngle(function(d){ return endValue*(Math.PI/180); });


					indicatorArc.attr("d", _this.graph.arc);


				}
				//-----------------------------	



				//position the handles based on the input values
				var drawHandles = function () {
					var handlerContainer = handles.selectAll('.handlercontainer').data(_this.helper.getData());
					var circles = handlerContainer.enter()
						.append('g')
							.attr('class', 'handlercontainer')
							.attr('transform', function(d){
								return 'rotate(' + angularScale(d.value) + ') translate(0,' +radius*-1 + ')'; //initial position
							})
							.on("mouseover", function(){
								d3.select(this).classed('active',true);
							})
							.on("mouseout", function(){
								d3.select(this).classed('active',false);
							})
							.call(dragBehavior);
						
						circles.append('circle')
							.attr('r', _this.settings.handleRadius)
							.attr('class', 'handle')							
							.attr('stroke', _this.settings.handleStrokeColor)
							.attr('stroke-width', _this.settings.handleStrokeWidth)
							.attr('cursor', 'all-scroll')
							.attr('fill', function(d, i) { if(d.label == "a") return _this.settings.handleFillColorStart; else return _this.settings.handleFillColorEnd })
							.attr('id', function(d){ return d.label; })							
							.on('mouseover', function(){
								d3.select(this).classed('active',true);
							})
							.on('mouseout', function(){
								d3.select(this).classed('active',false);
							});

					
					circles.append("text")
							//.attr("dx", function(d){return -10})
							.attr("text-anchor", "middle")
							.attr('dominant-baseline', 'central')
							.attr('font-family', 'FontAwesome')
							.attr('font-size', '1em' )
							.attr('cursor', 'all-scroll')
							.attr('fill', _this.settings.handleIconColor)							
							.text(function(d) { if(d.label == "a") return '\uf054'; else return '\uf053'; }); //http://fontawesome.io/3.2.1/cheatsheet/

				}


				var updateHandles = function (handle){
					handle.attr('transform', function(d,i){
							updateArc(d.value, i, d.label, d.angle);
								
							return 'rotate(' + angularScale(d.value) + ') translate(0,' +radius*-1 + ')';
						});
				}


				var checkHandlesPosition = function (labelOfDragedHandle) {
					//var allHandles = handles.selectAll('circle').classed('handle', true);
					var allHandles = handles.selectAll('.handlercontainer');  //d3.selectAll('#handles .handlercontainer'); //selektiert alle handles //handles.selectAll('g').classed('circle', true);
					var distanz = 0;

					//a for anfang, e for ende
					var currentData = {
						"a": 0,
						"aAngle": 0,
						"e": 0,
						"eAngle": 0
					}
					
					//Ablesen der Daten für Anzeige über HANDLES!!!!!!!!!!!!!!!! nicht über arc!
					allHandles.each(function (d, i) {
						currentData[d.label] = d.value;
						currentData[d.label+"Angle"] = d.angle;
					});
					
					//update range data
					_this.writeTimeInfo(_this.helper.createTimeInfoObject(currentData));
				}		
				
				
				
				this.setSettings(this._defaults);
				
				
				$(this.element).empty();
				$(this.element).append( $('<div>').attr('class', 'knob') );
				
				
				
				this.helper.calculateKnobInitialData(this.settings.data); //set data for handlers
				a = this.helper.getValueOfDataSet("a");
				e = this.helper.getValueOfDataSet("e");
				startAngle = this.helper.getAngleOfDataSet("a");
				endAngle = this.helper.getAngleOfDataSet("e");
								
				
				//initial range data on startup
				this.writeTimeInfo(_this.helper.createTimeInfoObject({a: a, e: e, aAngle: startAngle, eAngle: endAngle}));
				
				this.graph.pie = d3.pie().value(function(d,i){
					return d.value; 
				})
				.sort(null);
				
				
				this.graph.svg = d3.select('.knob').append('svg')
					.attr('height', this.settings.height+this.settings.offset)
					.attr('width', this.settings.width+this.settings.offset)
					.append('g')					
						.attr('id','holder').attr('transform','translate('+(((this.settings.width+this.settings.offset) - this.settings.width)/2 +margin.top)+','+(((this.settings.height+this.settings.offset) - this.settings.height)/2 + margin.left)+')');
					
					
				//indicator background ring stripes
				ringbgrd = this.graph.svg
					.append('g')
					.attr('id','ringbgrd').attr('transform','translate('+radius+','+radius+')');
					
				ringbgrd.append('circle')
					.attr('r', radius)					
					.attr('class','ringbgrd')
					.attr('stroke-width', this.settings.indicatorWidth-2)
					.attr('stroke', this.settings.indicatorBackgroundColor)
					.attr('stroke-dasharray', 2)
					.attr('fill', 'none');
		
				
					
				holder = this.graph.svg.append('g').attr('id','arcindicator');
				
				if(startAngle*1 > endAngle*1) {
					startAngle = (startAngle*1)-360;
				}

				this.graph.arc = d3.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius)
					.startAngle(function(d){ return startAngle*(Math.PI/180); })
					.endAngle(function(d){ return endAngle*(Math.PI/180); })
					
					
				indicatorArc = holder.append("g")				
						.attr("class", "arcindicator")
						.attr("transform", "translate(" + ((this.settings.width / 2)-20) + "," + ((this.settings.height / 2)-20) + ")")
						.append("path")
							.attr("fill", function(d, i) { return _this.settings.accentColor; })
							.attr("d", _this.graph.arc);
							


				handles = this.graph.svg
					.append('g')
						.attr('id','handles')
						.attr('transform','translate('+radius+','+radius+')');
						
				dragBehavior = d3.drag()
					.subject(function(d) { return d; })
					.on("drag", dragmoveHandles)
					.on("end", function(){ d3.select(this).classed('active',false); });
					

				
				
				drawHandles(); //init Handles
				
				this.drawClockTicks(); //draw ui clock range info
			},
			
			drawClockTicks: function() {
				var _this = this;
				var svg = this.graph.svg;
				var ticks;
				var height = _this.settings.height, width = _this.settings.width, margin = _this.settings.margin;			
				var radius = (Math.min(width, height) - margin.top - margin.bottom)/2; //center
				var outerRadius =  radius + _this.settings.indicatorWidth/2 + 13; 
				
				
				var tickdata = function(d) {
					var segmentAngle = 360 / 288; //288 5 Min. Segments
					return d3.range(0, 288).map(function(v, i) {
						return {
							angle: v*segmentAngle,
							label: v % 12 ? null : v/12
							};
						}); //v: 1 ... 288 ----------- 60 / 5 = 12 -> 1 hour has 12 5 min segments --> label will have hours
				}
				
				
				ticks = svg.append("g")
					.attr('id','ticks')
					.attr('transform','translate('+radius+','+radius+')')			
						.selectAll("g")
							.data(tickdata)
								.enter().append("g")
								.attr("transform", function(d) {
									return "rotate(" + (d.angle - 90)+ ")" + "translate(" + outerRadius + ",0)"; //move 0 -90 degree -> 0 must be top position
								});
						
				ticks.append("line")
					.attr("x1", 1)
					.attr("y1", 0)
					.attr("x2", function(d){ if(d.label || d.angle == 0) return 10; else return 5; })
					.attr("y2", 0)
					.style("stroke", _this.settings.tickColor); //hour lines must be longer: 10

				
				ticks.append("text")
					.attr("x", 5)
					.attr("dy", ".35em")
					.attr("transform", function(d) { return d.angle > 180 ? "rotate(180)translate(-16)" : "rotate(0)translate(7)"; })
					.style("text-anchor", function(d) { return d.angle > 180 ? "end" : null; })
					.style("fill", _this.settings.tickColor)
					.style("font-size","10px")
					.text(function(d) { return d.label; });
				
				
				
			},
			
			writeTimeInfo: function (timeObject) {
				
				if (typeof this.settings.onChange === "function") {
					this.settings.onChange(timeObject);
				}
				//console.log(timeObject);
			},
			
			setSettings: function( settings ) {
				//settind ... defaults
				//console.log(this.settings);
				//console.log(settings);
				this.helper.settings = this.settings;
			
			}
		} );

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			if(!(this instanceof $)) { $.extend(defaults, options) }
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document, d3 );