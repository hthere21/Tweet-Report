function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// 
	let dup_activities =[];
	let activities =[]
	for(var x=0; x < tweet_array.length; x++)
	{
		if (tweet_array[x].activityType != 'unknown')
		{
		dup_activities.push(
			tweet_array[x].activityType,
			);
		}
		else
		{
		continue;
		}
	}
	activities = [...new Set(dup_activities)];
	$('#numberActivities').text(activities.length);

	const count = [];

	for (const element of dup_activities) {
	if (count[element])
	{
		count[element] += 1;
	} 
	else {
		count[element] = 1;
	}
	}

	var new_count =[];
	for (var i =0; i < activities.length; i++)
	{
		new_count.push({
			activityType: activities[i],
			count: count[activities[i]]
		})
	}
	console.log(new_count);
	//Top logged
	var cnts = dup_activities.reduce( function (obj, val) 
	{
        obj[val] = (obj[val] || 0) + 1;
        return obj;
    }, {} );
    //Use the keys of the object to get all the values of the array
    //and sort those keys by their counts
    var sorted = Object.keys(cnts).sort( function(a,b) {
        return cnts[b] - cnts[a];
    });
	$('#firstMost').text(sorted[0]);
	$('#secondMost').text(sorted[1]);
	$('#thirdMost').text(sorted[2]);

	//Distance of top 3
	totalDistanceOfTop1 =0;
	totalDistanceOfTop2 =0;
	totalDistanceOfTop3 =0;
	tweet_array.forEach(element => {
		if(element.activityType===sorted[0])
		{
			totalDistanceOfTop1 += element.distance;	
		}
		else if(element.activityType===sorted[1])
		{
			totalDistanceOfTop2 += element.distance;	
		}
		else if(element.activityType===sorted[2])
		{
			totalDistanceOfTop3 += element.distance;	
		}
	});
	var topThreeLoggedWithDistance = [];
	topThreeLoggedWithDistance.push({activity: sorted[0], distance: totalDistanceOfTop1});
	topThreeLoggedWithDistance.push({activity: sorted[1], distance: totalDistanceOfTop2});
	topThreeLoggedWithDistance.push({activity: sorted[2], distance: totalDistanceOfTop3});
	
	//sortedthembyDistance
	topThreeLoggedWithDistance.sort( function(a, b){
		return (a.distance < b.distance) ? 1 : ((b.distance < a.distance) ? -1 : 0)
	})
	console.log(topThreeLoggedWithDistance);

	$('#longestActivityType').text(topThreeLoggedWithDistance[0].activity);
	$('#shortestActivityType').text(topThreeLoggedWithDistance[2].activity);

	//count to see if people work out in weekday or weekend
	var weekdayCount =0;
	var weekendCount =0;
	tweet_array.forEach(element => { 
		if(element.activityType===topThreeLoggedWithDistance[0].activity) {
			if(element.dayType==="weekday") 
			{
				weekdayCount++;
			} 
			else 
			{
				weekendCount++;
			}
		}
	}); 
	if (weekdayCount> weekendCount)
	{
		$('#weekdayOrWeekendLonger').text('weekdays');
	}
	else
	{
		$('#weekdayOrWeekendLonger').text('weekends');
	}

	//create data for second graph
	var dayOfWeekArr = [];
	tweet_array.forEach(element => {
		if((element.activityType===sorted[0]) || 
		(element.activityType===sorted[1]) ||
		(element.activityType===sorted[2]) ){
			dayOfWeekArr.push({
				activity: element.activityType,
				day: element.day,
				distance: element.distance
			});
		}
	});	



	//first graph
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v4.0.0-beta.8.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"width": 700,
		"height": 400, 
	  "data": {
			"values": new_count
		},
		"selection": {
			"pts": {"type": "single", "on": "mouseover"}
		},
		"mark": "point",
		"encoding": {
			"x": {"field": "activityType", "type": "ordinal"},
			"y": {"field": "count", "type": "quantitative"},
		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when. 

	//Second graph
	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v4.0.0-beta.8.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"width": 700,
		"height": 400, 
	  "data": {
			"values": dayOfWeekArr
		},
		"selection": {
			"paintbrush": {
				"type": "multi",
				"on": "mouseover", "empty": "all"
			}
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				"axis": {"title": "day of the week"}
			},
			"y": {
				"field": "distance",
				"type": "quantitative"
			},
			"size": {
				"condition": {
					"selection": "paintbrush", "value": 300
				},
				"value": 50
			},
			"color": {
				"field": "activity",
				"type": "nominal",
				"scale": {
					"domain": ["run","walk","bike"],
					"range": ["#FFA500", "#FF0000", "#0000ff"]
				},
				"legend": {"title": "Activity Type"}
			}
		}
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	//third graph
	distance_vis_aggregated = {
		"$schema": "https://vega.github.io/schema/vega-lite/v4.0.0-beta.8.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"width": 700,
		"height": 400, 
	  "data": {
			"values": dayOfWeekArr
		},
		"selection": {
			"paintbrush": {
				"type": "multi",
				"on": "mouseover", "empty": "all"
			}
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				"axis": {"title": "day of the week"}
			},
			"y": {
				"field": "distance",
				"aggregate": "average",
				"type": "quantitative"
			},
			"size": {
				"condition": {
					"selection": "paintbrush", "value": 300
				},
				"value": 50
			},
			"color": {
				"field": "activity",
				"type": "nominal",
				"scale": {
					"domain": ["run","walk","bike"],
					"range": ["#FFA500", "#FF0000", "#0000ff"]
				},
				"legend": {"title": "Activity Type"}
			}
		}
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated, {actions:false});


}



//Wait for the DOM to load
$(document).ready(function() {
	loadSavedRunkeeperTweets().then(parseTweets);
	$("#distanceVisAggregated").hide();
	$("#aggregate").click(function(event) {
		console.log("clicked button!");
		var elem = $(event.target);
		if (elem.text()=="Show means") {
			elem.text("Show all activities");
			$("#distanceVis").hide();
			$("#distanceVisAggregated").show();
		} else if (elem.text()=="Show all activities") {
			elem.text("Show means");
			$("#distanceVis").show();
			$("#distanceVisAggregated").hide();
		}
	});

});