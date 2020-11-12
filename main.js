'use strict';

const baseURL = 'https://developer.nps.gov/api/v1/parks';

const api_key = 'g8GhGzHgzh8jV7i1HA3SbwrR3z1g0dfjnazuHwD5';

const stateList = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];

const options = {
    headers: new Headers({
    'X-Api-Key':api_key})
};
 
function displayResults(responseJson) {
    $('.removable').remove();
    if (responseJson.limit != 0) {
        for (let i = 0; i < responseJson.data.length; i++) {
            $('.results-list').append(`<li class="removable"><p>${responseJson.data[i].fullName}</p>
            <p></p>
            <p>${responseJson.data[i].description}</p>
            <a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a></li>`);
        }
    $('.results').removeClass('hidden');
    }
}

function paramFormat(params) {
    const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`);
    return(queryItems.join('&'));
}

function getParks(state, limit) {

    let params = {
        stateCode: state,
        limit: limit,
      };
    
    let prettyParams = paramFormat(params);
    const url = `${baseURL}?${prettyParams}`;
    fetch(url,options)
    .then(response => {
        if (response.ok) {
            
            if (!$('.error-message').hasClass('hidden')) {
                $('.error-message').addClass('hidden');            
            }
            return response.json();
        } else {
            throw new Error(response.statusText);
        }
    })
    .then(responseJson => displayResults(responseJson))
    .catch(error => {$('.error-message').text(`Something went wrong: ${error.message}`);
    $('.error-message').removeClass('hidden')});

}

function hideError() {
    if (!$('.error').hasClass('hidden')) {
        $('.error').addClass('hidden');
    }
}

function hideResults() {
    $('.results').addClass('hidden');
}

function stateCheck(state) {
    let matches = 0;
    if (state.length > 2) {
        let stateArr = state.split(',')

        for (let i = 0; i < stateArr.length; i++) {
            for (let j = 0; j < stateList.length; j++) {
                if (stateArr[i] == stateList[j]) {
                    matches++;
                }
            }
        }

        if (matches != stateArr.length) {
            //console.log('Something is wrong multistate');
            hideResults()
            $('.error').removeClass('hidden');
            return false;

        } else {
            //console.log('all good multistate');
            hideError();
            return true;
        }

    } else {
        for (let j = 0; j < stateList.length; j++) {
            if (state == stateList[j]) {
                matches++;
            }
        }

        if (matches != 1) {
            //console.log('Something is wrong one state');
            hideResults()
            $('.error').removeClass('hidden');
            return false;

        } else {
            //console.log('all good 1 state');
            hideError();
            return true;
        }
    }
}

function receiveInput() {
    $('form').on('click','button', event => {
        event.preventDefault();
        let state = $('#state').val();
        let limit ='';
        let stateOk = true;

        stateOk = stateCheck(state);
        //console.log('limit is ' + $('#limit').val());

        if (stateOk) {
            //console.log($('#limit').val() + ' ' + typeof $('#limit').val());
            if ($('#limit').val() == ''){
                limit = 10;
                getParks(state, limit);
            } else if ($('#limit').val() >= 0) {
                limit = $('#limit').val();
                getParks(state, limit);

            } 
        }
    });
}

function masterFunction() {
    receiveInput();

}

$(masterFunction);