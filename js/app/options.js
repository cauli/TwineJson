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

/**
* TwineJson options for exporting
*
* @return {}
*/

define(function () {
  return {
    // Export unknown properties inside {{property}}{{/property}} tags
    'exportCustomProperties':true,
    // Exclude these properties from CustomProperties Export.
    // Expected input: ['property1','property2','...','propertyN'];
    'customPropertiesToIgnore':['pid','name','tags','content','childrenNames','children'],
    // Save as a .json file
    'saveAsFile':true
  }
});
