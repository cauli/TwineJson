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
    // If true, puts every element as a child or grandchild of the Starting Point
    // WARNING: Hierarchical JSON trees shouldn't be cyclic. This will cause an infinite loop.
    'isHierarchical':true,
    // Exports what is inside of {{order}}{{/order}} to '.order' property on JSON
    'exportOrder':false,
    // Exports using {{features}}{{/features}} syntax (Should default to false)
    // * adds the property 'star' to the element
    // + adds the property 'delta' to the element
    // - adds the property 'optional' to the element
    'exportFeatures':false,
    // Export Unique ID for node
    'exportID':true,
    // Export unknown properties inside {{property}}{{/property}} tags
    'exportCustomProperties':true,
    // Exclude these properties from CustomProperties Export.
    // Expected input: ['property1','property2','...','propertyN'];
    'customPropertiesToIgnore':['features','order'],
    // Save as a .json file
    'saveAsFile':true
  }
});
