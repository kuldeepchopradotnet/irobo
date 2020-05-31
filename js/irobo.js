$(document).ready(function() {
    /**
     * Page title
     */
    var pageTitle = $(".post-title.entry-title");
    var postBody = '';
    pageTitle = pageTitle.length > 0 ? pageTitle.get(0).textContent.trim() : '';

    /**
     * Pages/Post list 
     * start
     */
    var pagetbl = [{
            pageName: 'what is my ip address',
            pageNumner: 1
        },
        {
            pageName: 'covid-19 update',
            pageNumner: 2
        }
    ];

    var pageNumner = getPageNumber(pageTitle);
    postBody = pageNumner > 0 ? $(".post-body.entry-content") : '';
    switch (pageNumner) {
        case 1:
            IpComponent();
            break;
        case 2:
            var helper = helper();
            CovidComponent(helper);
            break;
        case 3:
            break

    }

    /**
     * All page function as components listed here
     */

    /**
     * find my ip component
     */
    function IpComponent() {
        var html = '<h3>Your ip address is : {ip}<h3>';
        $.getJSON(helper.constants.apis.ip, function(data) {
            html = html.replace('{ip}', (data.ip ? data.ip : ''));
            postBody.html(html);
        });
    }

    /**
     * covidUpdate component
     * helper dependancy
     */
    function CovidComponent(helper) {
        /**
         * Get CovidData
         */
        $.getJSON(helper.constants.apis.covid, function(data) {
            var covid = data;
            var getCountryViewO = getCountryView();
            var countryCovid = covid["Countries"];
            var globalCovid = covid["Global"];
            var CountryDomE = $("#CountryDD");
            var countryTable = $("#CountryTable");
            var availableCountry = getAvailableCounty(countryCovid);
            CountryDomE.append(availableCountry);
            getCountryViewO('');
            CountryDomE.change(function() {
                getCountryView($(this).val());
            });
            /**
             * Get View of CovidByCountry
             * @param {countryName} val 
             */
            function getCountryView() {
                return function(val) {
                    helper.clearTokenInput(helper.constants.selectors.covidTokenInput, helper.constants.events.clear);
                    helper.addCss(helper.constants.selectors.inputTokenResult, helper.constants.events.display, helper.constants.events.none);
                    val = val ? val.name : '';
                    var countryO = null;
                    if (!val) {
                        countryO = globalCovid;
                        countryO[""] = "Global"
                    } else {
                        var selCountry = getCovidByCountry(val);
                        countryO = selCountry ? selCountry[0] : null;
                    }
                    if (countryO) {
                        var dicObj = {
                            "{newDeath}": selCountry.NewDeaths,
                            "{NewConfirmed}": selCountry.NewConfirmed,
                            "{TotalRecovered}": selCountry.TotalRecovered,
                            "{countryName}": selCountry.Country,
                            "{countryDate}": (formatAMPM(new Date(selCountry.Date))),
                            "{totalDeath}": selCountry.TotalDeaths,
                            "{NewRecovered}": selCountry.NewRecovered,
                            "{TotalConfirmed}": selCountry.TotalConfirmed,
                        }
                        var htmlStr = helper.getHtmlView("#covid-view");
                        var newHtmStr = helper.dictinory(dicObj, htmlStr);
                        helper.setHtmlView("#covid-view", newHtmStr);
                    }
                }
            }
            /**
             * GetAvailableCounty
             * @param {CountryFieldCovid_Json} countryCovid 
             */
            function getAvailableCounty(countryCovid) {
                if (countryCovid && countryCovid.length > 0) {
                    // var countryDDHtml = "";
                    // countryCovid.forEach(function (country) {
                    //     countryDDHtml += '<option value="' + country.Country + '">' + country.Country + '</option>';
                    // });
                    // return countryDDHtml;

                    var countryList = [];
                    countryCovid.forEach(function(country) {
                        countryList.push({ id: country.Country, name: country.Country });
                    });
                    helper.plugTokenInput(helper.constants.selectors.covidTokenInput, countryList, getCountryViewO);
                } else {
                    return null;
                }
            }
            /**
             * Get CovidData by Country name
             * @param {Country name} countryName 
             */
            function getCovidByCountry(countryName) {
                return countryCovid.filter(function(e) {
                    if (e.Country === countryName) {
                        return e;
                    }
                });
            }
        }).fail(function() {
            CovidComponent(helper);
        });
    }
    /*All common function listed here*/

    /**
     * Get Page Number 
     * @param {page name or title} pageTitle 
     */
    function getPageNumber(pageTitle) {
        var pageNumber = 0;
        pagetbl.some(function(e) {
            if (e && e.pageName.toLocaleLowerCase() === pageTitle.toLocaleLowerCase()) {
                pageNumner = e.pageNumner;
                return true;
            }
        });
        return pageNumner;
    }
    /**
     * Get formatted date
     * @param {Date} date 
     */
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    /**
     * Plugin's methods and helper function
     */
    function helper() {
        return {
            /**
             * plug tokeninput jquery when data loaded
             */
            plugTokenInput: function(inputNameId, data, cbItem) {
                $(inputNameId).tokenInput(data, {
                    tokenLimit: 1,
                    theme: "facebook",
                    onAdd: function(item) {
                        cbItem(item);
                    },
                    onDelete: function(item) {

                    }
                });
            },
            /**
             * Clear input box of token input
             * @param {*} inputNameId 
             * @param {*} event 
             */
            clearTokenInput: function(inputNameId, event) {
                $(inputNameId).tokenInput(event);
            },
            /**
             * Add css to element
             * @param {*} selector 
             * @param {*} key 
             * @param {*} value 
             */
            addCss: function(selector, key, value) {
                $(selector).css(key, value)
            },
            /**
             * validate data is correct
             * @param {data} data 
             */
            validateDataObj: function(data) {
                if (typeof data === 'string') {
                    if (data != null && data != undefined && data != '') {
                        return true;
                    }
                }
                return false;
            },

            dictinory: function(dicArr, str) {

                var re = new RegExp(Object.keys(dicArr).join("|"), "ig");
                return str.replace(re, function(m) {
                    return dicArr[m];
                });
                //return str.replace(/[a-z]/gi, m => dicArr[m]);
            },

            getHtmlView: function(selector) {
                return $(selector).html();
            },
            setHtmlView: function(selector, html) {
                return $(selector).html(html);
            },
            /**
             * helper constants
             */
            constants: {
                apis: {
                    covid: 'https://api.covid19api.com/summary',
                    ip: 'https://api.ipify.org?format=json'
                },
                selectors: {
                    covidTokenInput: '#CountryDD',
                    inputTokenResult: '.token-input-dropdown-facebook'
                },
                events: {
                    clear: 'clear',
                    display: 'display',
                    none: 'none'
                }
            }
        }
    }
});