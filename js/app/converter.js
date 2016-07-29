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
* Converts Twine's XML to a plain JSON 
* Fetches properties from {{}}{{/}} tags and puts it in the json
*
* @return {}
*/

define(
  ['./options',
   './util'],
  function (options, util) {
    return {
    export: function(passages, storyData) {
        var buffer = [];

        for (var i = 0; i < passages.length; ++i)
        {
          buffer.push(this.buildPassageFromElement(passages[i], i, passages.length));
        }

        // TODO this is absurdly ugly
        var result = '[' + buffer.join(',') + ']';

        return JSON.parse(result);
    },
    buildPassageFromElement: function(passage, index, howManyPassages) {
        var last = (index+1 === howManyPassages);
        
        var name = passage.getAttribute('name');

        if (typeof name === 'undefined')
        {
          name = 'Untitled Passage';
        }

        var pid = passage.getAttribute('pid');
        var tags = passage.getAttribute('tags');
        var position = passage.getAttribute('position');
        var content = passage.textContent;
        
        return this.buildPassage(name, tags, content, position, last, pid);
    },

    buildPassage: function(title, tags, content, position, last, pid) {
        var result = {};

        result.pid = parseInt(pid);

        if(typeof position !== 'undefined') 
        {
          position = position.split(',');
          
          result.position = {
            x: parseInt(position[0]),
            y: parseInt(position[1])
          } 
        } 

        result.name = title;

        if (typeof tags !== 'undefined') { result.tags = tags.split(','); }

        var clearedContent = this.scrub(content, ' ');

        result.content = clearedContent;
        result.childrenNames = this.findChildren(clearedContent);

        options.exportCustomProperties ? this.findOtherProperties(result, content, options.customPropertiesToIgnore) : null;

        return JSON.stringify(result);
    },

    // Finds any content between {{}}{{/}} and adds returns it as a property
    findOtherProperties: function(obj, content, excluding) {
        var ptrn = /\{\{((\s|\S)+?)\}\}((\s|\S)+?)\{\{\/\1\}\}/gm;
        var match;
        var results = [];

        while( ( match = ptrn.exec(content) ) !== null )
        {
          var property = match[1];

          if(excluding.indexOf(property) == -1)
          {
            // Gets the actual value inside the '{{tag}}value{{/tag}}' tags
            var value = match[3].split(/(\r\n|\n|\r)/gm);

            value = util.cleanArray(value);

            obj[property] = value.join('\r\n');
          }
        }
      },

      scrub: function(content, separator) {
        if(content)
        {
          content = content.replace(/\"/gm, '\'');
          // Removes all line breaks
          content = content.replace(/(\r\n|\n|\r)/gm,separator);
        }

        return content;
      },

      // Finds children passages by searching for the [[Passage Name]] syntax
      findChildren: function(content) {
        var ptrn = /\[\[(.+?)\]\]/gm;
        var match;
        var results = [];

        while( ( match = ptrn.exec(content) ) !== null )
        {
          results.push(match[0]);
        }

        return results;
      }
    }
  }
);
