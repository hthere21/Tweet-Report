var allTweetArr =[]; //create constant variable so function addEventHandlerForSearch() can get data

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	//TODO: Filter to just the written tweets
	allTweetArr =[];
	for(var x=0; x < tweet_array.length; x++)
	{
		allTweetArr.push({
			indexNumber: x,
			activityType: tweet_array[x].activityType,
			tweet: tweet_array[x].text
		})
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	var textInput, filter, texrtValue; 
	textInput = $('#textFilter').val();
	$('#searchText').html(textInput);
	//Initialization 
	filter = textInput.toLowerCase();
	table = document.getElementById("myTable");

	//Filter tweet from searching
	var filterArr =[];
	if(textInput != "")
	{
		filterArr = allTweetArr.filter( element => {
			if(element.tweet.includes(textInput))
			{
				return element;
			}
		})
	}

	$('#searchCount').text(filterArr.length);


	//Update and create table
	var tweetTable = $('#tweetTable');
	tweetTable.empty();
	if(textInput === "")
	{
		tweetTable.empty();
	}
	else
	{
	tweetTable.innerHTML = '';
	for(let i=0; i< filterArr.length; i++)
	{
		tweetTable.append(tweet_array[filterArr[i].indexNumber].getHTMLTableRow(filterArr[i].indexNumber)); 
	}
	}
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});