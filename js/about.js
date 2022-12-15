function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//Tweet Dates
	var options = { weekday: 'long', year: 'numeric', month: 'long',day: 'numeric'};
	var first_date = tweet_array[tweet_array.length-1].time.toLocaleDateString('en-US', options);
	var last_date = tweet_array[0].time.toLocaleDateString('en-US', options);
	
	$('#firstDate').text(first_date);
	$('#lastDate').text(last_date);

	//Tweet Categories
	var completed_event=0;
	var live_event=0;
	var achieved_event=0;
	var miscellanous_event=0;
	var user_written=0;
	for(var x=0; x < tweet_array.length; x++)
	{
		if(tweet_array[x].source == 'live_event')
		{
			live_event++;
		}
		else if(tweet_array[x].source == 'achievement')
		{
			achieved_event++;
		}
		else if(tweet_array[x].source == 'completed_event')
		{
			completed_event++;
			if (tweet_array[x].written == true)
			{
				user_written++;
			}
		}
		else
		{
			miscellanous_event++;
		}
	}

	$('.completedEvents').text(completed_event);
	$('.liveEvents').text(live_event);
	$('.achievements').text(achieved_event);
	$('.miscellaneous').text(miscellanous_event);
	$('.completedEventsPct').text(math.format(completed_event*100/tweet_array.length,{notation: 'fixed', precision: 2})+'%')
	$('.liveEventsPct').text(math.format(live_event*100/tweet_array.length,{notation: 'fixed', precision: 2})+'%')
	$('.achievementsPct').text(math.format(achieved_event*100/tweet_array.length,{notation: 'fixed', precision: 2})+'%')
	$('.miscellaneousPct').text(math.format(miscellanous_event*100/tweet_array.length,{notation: 'fixed', precision: 2})+'%')

	//Tweet Categories
	$('.written').text(user_written);
	$('.writtenPct').text(math.format(user_written*100/completed_event, {notation: 'fixed', precision: 2})+'%');
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});