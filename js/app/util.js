/*!
* TwineJson
*
* Based on Entweedle by Michael McCollum
* Copyright(c) 2015 Páprica Comunicação http://papricacomunicacao.com.br
* Copyright(c) 2015-2016 Cauli Tomaz https://cau.li
* MIT Licensed
*
* https://github.com/cauli/TwineJson
*/


define(
  function () {
    return {
        // Removes "" and "{carriage return}" from an array
        cleanArray: function(arr) {
            if(arr[0] == "")
            {
                arr.splice(0,1);
            }

            if(arr[arr.length-1] == "")
            {
                arr.splice(arr.length-1,1);
            }

            // <= 1 because carriage returns counts as one character
            for(var i = arr.length-1; i >= 0; i--)
            {
              if(arr[i].match(/^[\r\n ]+$/))
              {
                arr.splice(i,1);
              }
            }

            return arr;
        }
    }
});
