$(document).ready(function(){
var pageTitle =  $(".post-title.entry-title");
var postBody = '';
pageTitle = pageTitle.length > 0 ?  pageTitle.get(0).textContent.trim() : '';
var pagetbl = [{
        pageName : 'what is my ip address',
        pageNumner : 1
    },
	{
        pageName : 'covid-19 update',
        pageNumner : 2
    }
];

var pageNumner = getPageNumber(pageTitle);
postBody = pageNumner > 0 ? $(".post-body.entry-content") : '';
switch(pageNumner) 
{
    case 1: 
		IpComponent();
      break;
	case 2: 
		CovidComponent();
      break;
	case 3:
	break

}

/*All page function as componet listed here*/
//componet_1
function IpComponent(){
	var html = '<h3>Your ip address is : {ip}<h3>';
	$.getJSON('https://api.ipify.org?format=json', function(data){
        html = html.replace('{ip}', (data.ip ? data.ip : ''));
        postBody.html(html);
    });
}
//componet_2
function CovidComponent(){ 

$.getJSON('https://api.covid19api.com/summary', function(data){
var covid = data;
var countryCovid = covid["Countries"];
var globalCovid = covid["Global"];
var CountryDomE = $("#CountryDD");
var countryTable = $("#CountryTable");
var availableCountry = getAvailableCounty(countryCovid);
CountryDomE.append(availableCountry);
getCountryView('');   
CountryDomE.change(function(){
	getCountryView($(this).val());
});


function getCountryView(val){
	if(!val){
		if(globalCovid){
			var countryTableHtml = '<table><tr><td>Date</td><td>'+ ( formatAMPM(new Date(covid.Date)))+'</td></tr>' +
					'<tr><td>New Confirmed</td><td>'+ globalCovid.NewConfirmed.toString() +'</td></tr>' +
					'<tr><td>New Deaths</td><td>'+globalCovid.NewDeaths+'</td></tr>' +
					'<tr><td>New Recovered</td><td>'+globalCovid.NewRecovered+'</td></tr>' +
					'<tr><td>Total Confirmed</td><td>'+globalCovid.TotalConfirmed+'</td></tr>' +
					'<tr><td>Total Deaths</td><td>'+globalCovid.TotalDeaths+'</td></tr>' +
					'<tr><td>Total Recovered</td><td>'+globalCovid.TotalRecovered+'</td></tr></table>';
			countryTable.html(countryTableHtml);
		}
	}
	else {
		var selCountry = getCovidByCountry(val);
		selCountry = selCountry ? selCountry[0] : null;
		if(selCountry){
				var countryTableHtml = '<table><tr><td>Date</td><td>'+ ( formatAMPM(new Date(selCountry.Date)))+'</td></tr>' +
					'<tr><td>Country</td><td>'+ selCountry.Country +'</td></tr>' +
					'<tr><td>New Confirmed</td><td>'+ selCountry.NewConfirmed.toString() +'</td></tr>' +
					'<tr><td>New Deaths</td><td>'+selCountry.NewDeaths+'</td></tr>' +
					'<tr><td>New Recovered</td><td>'+selCountry.NewRecovered+'</td></tr>' +
					'<tr><td>Total Confirmed</td><td>'+selCountry.TotalConfirmed+'</td></tr>' +
					'<tr><td>Total Deaths</td><td>'+selCountry.TotalDeaths+'</td></tr>' +
					'<tr><td>Total Recovered</td><td>'+selCountry.TotalRecovered+'</td></tr></table>';
					countryTable.html(countryTableHtml);
		}
	}
}


function getAvailableCounty(countryCovid) {
	if(countryCovid && countryCovid.length > 0){
    var countryDDHtml = "";
  	countryCovid.forEach(function(country) {
    		countryDDHtml += '<option value="'+country.Country+'">'+country.Country+'</option>';
    });
    return countryDDHtml;
  }
  else
  {
  	return null;
  }

}

function getCovidByCountry(countryName){
		return countryCovid.filter(function(e){
    		if(e.Country === countryName){
        	return e;
        }
    
    });
}

    });

}

/*All common function listed here*/
function getPageNumber(pageTitle){
    var pageNumber = 0;
    pagetbl.filter(function(e){
        if(e && e.pageName.toLocaleLowerCase() === pageTitle.toLocaleLowerCase()){
            pageNumner = e.pageNumner;
            return;
        }
    });
    return pageNumner;
}
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = date.getDate() + '/' + (date.getMonth() +1) + '/' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;
  return strTime;
}	
	
});
