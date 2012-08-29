function toFrenchLocaleDateString(date)
{
	var months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
	var days   = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
	var fdate = date.getDate();
	if (fdate < 10)
	{
		fdate = "0" + fdate;	
	}
	var output = days[date.getDay()] + ", "+ fdate + " " + months[date.getMonth()] + " " + date.getFullYear();
	return output;
}
