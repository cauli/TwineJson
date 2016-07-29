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

 'use strict';

 define(
   [
   'FileSaver',
   './options',
   './treebuilder',
   './printer',
   './converter'],
   function(saveAs, options, treebuilder, printer, converter) {

    var stage = {
      'output': $('#output'),
      'outputPlain': $('#outputPlain'),
      'storyData': $('tw-storydata'),
      'passageData': $('tw-passagedata'),
      'title': $('tw-storydata').attr('name')
    }

    var idCount = 0;

    var exports = {
      convert: function() {
        var storyData = stage.storyData;

        console.log(stage.passageData);

        var jsonObject = converter.export(stage.passageData);
        var _jsonObject = JSON.parse(JSON.stringify(jsonObject))

        console.log('====== PLAIN JSON OBJECT AFTER EXPORT ======');
        console.dir(jsonObject);
        console.log('====== END JSON OBJECT ======');
  
        var hierarchyJSON = treebuilder.build(jsonObject);

        if(hierarchyJSON.length === 0)
        {
          printer.syntaxHighlight('Stories with cyclic references aren\'t allowed in hierarchical JSON structures', $('#output'));
          $('#output').addClass('invalid');
        }
        else
        {
          if(options.saveAsFile)
          {
            this.saveAsFile('hierarchical-'+stage.title,JSON.stringify(hierarchyJSON, null, 4));
          }

          printer.syntaxHighlight(JSON.stringify(hierarchyJSON, null, 4), $('#output'));
            $('#output').removeClass('invalid');
        }
     
        if(options.saveAsFile)
        {
          this.saveAsFile('plain-'+stage.title,JSON.stringify(_jsonObject, null, 2));
        }

        printer.syntaxHighlight(JSON.stringify(_jsonObject, null, 4), $('#outputPlain'));
      },
      
      saveAsFile: function(title, text) {
        var blob = new Blob([text], {type: 'text/json;charset=utf-8'});
        saveAs(blob, title.replace(/[^a-z0-9]/gi, '').toLowerCase() + '-' +Math.floor(Date.now() / 1000) + '.json');
      },

      isCyclic: function (obj) {
        var seenObjects = [];

        function detect (obj) {
          if (obj && typeof obj === 'object')
          {
            if (seenObjects.indexOf(obj) !== -1)
            {
              return true;
            }

            seenObjects.push(obj);

            for (var key in obj)
            {
              if (obj.hasOwnProperty(key) && detect(obj[key])) {
                console.error(obj, 'Found cycle at ' + key);
                return true;
              }
            }
          }
          
          return false;
        }

        return detect(obj);
      }
    };

    exports.convert();

    return exports;
  });  

