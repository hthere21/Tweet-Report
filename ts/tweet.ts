class Tweet {
	private text:string;
    time:Date;
    at_time:string;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
        this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
        this.at_time = tweet_time;
	}

    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
   get source():string {
    //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
    if(this.text.includes("Live") && this.text.includes("Watch"))
    {
        return "live_event";
    }
    else if(this.text.startsWith('Achieved') || this.text.includes("set a goal"))
    {
        return "achievement";
    }
    else if(this.text.includes("completed") || this.text.includes("Just posted"))
    {
        return "completed_event";
    }
    else
    {
        return "miscellanous";
    }   
}

   //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
    if ((this.text.includes("Check it out!") && this.text.endsWith("#Runkeeper")) || this.text.includes("- TomTom MySports Watch"))
    {
        return false;
    }
        else
        {
        return true;
        }
    }

get writtenText():string {
    if(!this.written) 
    {
        return "";
    }
    //TODO: parse the written text from the tweet
    return this.text.replace(/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g,'').replace(/#\S+/g, '');
}


get activityType():string {
    if (this.source != 'completed_event') {
        return "unknown";
    }
    //TODO: parse the activity type from the text of the tweet
    else
    {
    if(this.text.includes("ski"))
    {
        return "ski";
    }
    else if(this.text.includes("run"))
    {
        return "run";
    }
    else if(this.text.includes("mtn"))
    {
        return "mtn";
    }
    else if(this.text.includes("bike"))
    {
        return "bike";
    }
    else if(this.text.includes("elliptical"))
    {
        return "elliptical";
    }
    else if(this.text.includes("activity"))
    {
        return "activity";
    }
    else if(this.text.includes("hike"))
    {
        return "hike";
    }
    else if(this.text.includes("swim"))
    {
        return "swim";
    }
    else if(this.text.includes("row"))
    {
        return "row";
    }
    else if(this.text.includes("nordic"))
    {
        return "nordic";
    }
    else if(this.text.includes("walk"))
    {
        return "walk";
    }
    else if(this.text.includes("skate"))
    {
        return "skate";
    }
    else if(this.text.includes("MySports"))
    {
        return "MySports";
    }
    else if(this.text.includes("chair"))
    {
        return "chair";
    }
    else if(this.text.includes("snowboard"))
    {
        return "snowboard";
    }
    else
    {
        return "circuit";
    }
}
}
     

  
    get distance():number {
        if(this.source != 'completed_event') 
        {
            return 0;
        }
        var distanceArr;
        var distanceString: string ="";
        if(this.text.includes( ' mi ' )) 
        {
            distanceArr = this.text.match(/(?<= a )(.*?)(?= mi )/g);
            if(distanceArr!=null) 
            {
                distanceArr.forEach(element => {
                    if(element!=null)
                    {
                        distanceString += element.toString();
                    }
                });
            }
            var miles = parseFloat(distanceString);
            var milesString: string = miles.toFixed(2);
            var milesDecimal = parseFloat(milesString);
            return milesDecimal;
        } 
        else if (this.text.includes( ' km ' )) 
        {
            distanceArr = this.text.match(/(?<=a )(.*?)(?= km )/g);
            if(distanceArr!=null) 
            {
                distanceArr.forEach(element => {
                    if(element!=null)
                    {
                        distanceString += element.toString();
                    }
                });
            }
            //convert kilometers to miles
            var kilometer = parseFloat(distanceString);
            var mile = kilometer/1.609;
            var mileString: string = mile.toFixed(2);
            var mileDecimal = parseFloat(mileString);
            return mileDecimal;
        }
        return 0;
    }

    get dayType():string {
        if (this.at_time.includes( 'Mon ') || this.at_time.includes( 'Tue ') || this.at_time.includes( 'Wed ') || this.at_time.includes( 'Thu ') || this.at_time.includes( 'Fri ') ) 
        {
                return "weekday";
        }
        else
        {
                return "weekend";
        } 
        return "";
    }

    get day():string {
        if(this.at_time.includes( 'Sat' ))
        {
            return "Sat";
        } 
        else if(this.at_time.includes( 'Sun ' )) 
        {
            return "Sun";
        } 
        else if(this.at_time.includes( 'Mon ' ))
        {
            return "Mon";
        } 
        else if(this.at_time.includes( 'Tue ' )) 
        {
            return "Tue";
        }
        else if(this.at_time.includes( 'Wed ' )) 
        {
            return "Wed";
        }
        else if(this.at_time.includes( 'Thu ' )) 
        {
            return "Thu";
        } 
        else 
        {
            return "Fri";
        }  
    }
    

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        var row = "<tr>";
		var index = "<td>"+rowNumber+"</td>"; 
		row += index;
		var activity = "<td>"+this.activityType+"</td>"; 
		row+=activity;
        var replacedText, replacePattern;
        replacePattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = this.text.replace(replacePattern, '<a href="$1" target="_blank">$1</a>');
		var tweet = "<td>"+replacedText+"</td>"; 
		row += tweet;
        row += "</tr";
        return row;
    }
}