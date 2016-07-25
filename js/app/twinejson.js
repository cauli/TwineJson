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
 ["jquery",
  "FileSaver",
  "./options"],
  function($, saveAs, options) {

    var documentElements = (function($) {
      var _ = {
        'output': $('#output'),
        'storyData': $('tw-storydata'),
        'passageData': $("tw-passagedata"),
        'title': $("tw-storydata").attr('name')
      }

      return _;
    }(jQuery));

    console.log("Hi");
    
    var idCount = 0;
   
    var exports = {
      convert: function() {
        var storyData = documentElements.storyData;
        var output = $('#output');
        var jsonString = this.export();

        if(jsonString === '') {
          throw "History was empty and and could not be converted to JSON";
        }

        console.log(jsonString);

        var originalJsonPlain = JSON.parse(jsonString);
        var jsonPlain = originalJsonPlain;
     
        /* 
        *  For each of the elements of jsonPlain
        *  Check if it has one or more children
        *  For each child
        *  Loop through all elements of jsonPlain searching for the name of the child
        *  Add to the parent.children array
        */ 
        if(options.isHierarchical)
        {      
          var hierarchyJSON = [];

          for(var i = 0; i < jsonPlain.length; i ++)
          {
            jsonPlain[i].children = [];
            var childrenNames = jsonPlain[i].childrenNames;

            if(childrenNames.constructor === Array)
            {
              if(childrenNames.length > 1)
              {
                var eachChildren = jsonPlain[i].childrenNames.split(',');
              }
              else 
              {
                var eachChildren = jsonPlain[i].childrenNames;
              }

              for(var k = 0; k < eachChildren.length; k++ )
              {
                for(var j = 0; j < jsonPlain.length; j++ )
                {
                  if(eachChildren[k] == "[["+jsonPlain[j].name+"]]")
                  {
                    jsonPlain[i].children.push(jsonPlain[j]);
                  }
                }
              }
              
              hierarchyJSON.push(jsonPlain[i]);
            
            }
          }

          if(this.isCyclic(hierarchyJSON[0]))
          {
            output.val("Error: Cyclic reference found</h2><br>Cyclic references aren't allowed in hierarchical JSON structures.<br>Please set options.isHierarchical to false to use cyclic references.");
          }
          else
          {

            if(options.saveAsFile)
            {
              this.saveAsFile("Title of Story",JSON.stringify(hierarchyJSON, null, 2));
            }

            output.val(JSON.stringify(hierarchyJSON, null, 2));
          }
        
        }
        else
        {
          if(options.saveAsFile)
          {
            this.saveAsFile("Title of Story",JSON.stringify(jsonPlain, null, 2));
          }

          output.val(JSON.stringify(jsonPlain, null, 2));
        }
      },
      
      saveAsFile: function(title, text) {
        var blob = new Blob([text], {type: "text/json;charset=utf-8"});
        saveAs(blob, title.replace(/[^a-z0-9]/gi, '').toLowerCase()+"-"+Math.floor(Date.now() / 1000)+".json");
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
      },

      export: function() {
        var buffer = [];

        var storyData = documentElements.storyData;

        console.dir(storyData);

        if (typeof storyData !== 'undefined')
        {
          buffer.push(this.buildPassage("StoryTitle","",documentElements.title));
        }

        /*
        var userScript = window.document.getElementById("twine-user-script");
        if (userScript)
        {
          buffer.push(this.buildPassage("UserScript","script",userScript.innerHTML));
        }

        var userStylesheet = window.document.getElementById("twine-user-stylesheet");
        if (userStylesheet)
        {
          buffer.push(this.buildPassage("UserStylesheet","stylesheet",userStylesheet.innerHTML));
        }
        */

        var passages = documentElements.passageData;

        for (var i = 0; i < passages.length; ++i)
        {
          buffer.push(this.buildPassageFromElement(passages[i], i, passages.length));
        }

        return "[" + buffer.join(',') + "]";
      },
      
      buildPassageFromElement: function(passage, index, howManyPassages) {
        var last = false;
        
        if(index+1 == howManyPassages)
        {
          last = true;
        }
        
        var name = passage.getAttribute("name");

        if (!name)
        {
          name = "Untitled Passage";
        }

        var tags = passage.getAttribute("tags");
        var position = passage.getAttribute("position");
        var content = passage.textContent;
        
        return this.buildPassage(name, tags, content, position || "", last);
      },
  
      buildPassage: function(title, tags, content, position, last) {
        var result = {};

        options.exportID ? (result.id = idCount) : null;

        idCount++;

        options.exportPosition ? (result.position = position) : null;

        result.name = title;

        if (typeof tags !== 'undefined') { result.tags = tags.split(','); }

        var clearedContent = this.scrub(content, " ");

        result.content = clearedContent;
        result.childrenNames = this.findChildren(clearedContent);

        options.exportFeatures ? (result.features = this.findFeatures(content)) : null;
     
        options.exportOrder ? (result.order = this.findOrder(content)) : null;

        options.exportOtherProperties ? this.findOtherProperties(result, content, options.ignoreCustomProperties) : null;

        return JSON.stringify(result);
      },

      // Finds any content between {{}}{{/}} and adds returns it as a property
      findOtherProperties: function(obj, content, excluding) {
        var propertiesAdded = "";

        var ptrn = /\{\{((\s|\S)+?)\}\}((\s|\S)+?)\{\{\/\1\}\}/gm;
        var match;
        var results = [];

        while( ( match = ptrn.exec(content) ) !== null )
        {
          var property = match[1];

          if(excluding.indexOf(property) == -1)
          {
              var value = match[3].split(/(\r\n|\n|\r)/gm);
              var valuesArray = [];

              // <= 1 because carriage returns counts as one character
              for(var i = 0; i < value.length; i++)
              {
                if(value[i].length <= 1)
                {
                  value.splice(i,1);
                  i =- 1;
                }
              }

              if(value.length === 1)
              {
                obj[property] = value[0];
              }
              else
              {
                var propertiesJSON = {};

                for(var j = 0; j < value.length; j++)
                {
                   propertiesJSON[j] = value[j];
                }

                valuesArray.push(propertiesJSON);

                propertiesAdded += ','+NL;
                propertiesAdded += TAB+'\"'+property+"\" :";
                propertiesAdded += ""+JSON.stringify(valuesArray)+NL;
              }
          }
        }

        return propertiesAdded;
      },

      scrub: function(content, separator) {
        if(content)
        {
          content = content.replace(/\"/gm, "\'");

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
      },

      // Finds order inside the passage by searching for the {{order}}...{{/order}} syntax
      findOrder: function(content) {
        var ptrn = /\{\{order\}\}((\s|\S)+?)\{\{\/order\}\}/gm;
        var match;
        var results = [];
        var orderArray = [];

        while( ( match = ptrn.exec(content) ) !== null )
        {
          var order = match[1].split(/(\r\n|\n|\r)/gm);

          // Cleans up the order array by removing empty/return entries
          // TIP: <= 1 because carriage returns counts as one character
          for(var i = 0; i < order.length; i++)
          {
            if(order[i].length <= 1)
            {
              order.splice(i,1);
              i=-1;
            }
          }

          for(var j = 0; j < order.length; j++)
          {
            featureJSON.order = order[j];
            orderArray.push(featureJSON);
          }
        }

        return JSON.stringify(orderArray);
      },

      // Finds features inside the passage by searching for the {{features}}...{{/features}} syntax
      findFeatures: function(content) {
        var ptrn = /\{\{features\}\}((\s|\S)+?)\{\{\/features\}\}/gm;
        var match;
        var results = [];
        var featuresArray = [];

        while( ( match = ptrn.exec(content) ) !== null )
        {
          var features = match[1].split(/(\r\n|\n|\r)/gm);

          // Cleans up the features array by removing empty/return entries
          // TIP: <= 1 because carriage returns counts as one character
          for(var j = 0; j < features.length; j++)
          {
            if(features[j].length <= 1)
            {
              features.splice(j,1);
              j=-1;
            }
          }

          for(var i = 0; i < features.length; i++)
          {
            var regExp = /\(([^)]+)\)/;
            var matches = regExp.exec(features[i]);

            var featureJSON = {};

            if(matches !== null)
            {
              if(matches[1])
              {
                features[i] = features[i].replace(/\(([^)]+)\)/gi, "");
                featureJSON.subtitle = matches[1];
              }  
            }
            
            if(features[i][0] == ":")
            {
              featureJSON.separator = true;
              features[i] = features[i].substring(1);
            }
    
            if(features[i][0] == "*")
            {
              featureJSON.star = true;
              features[i] = features[i].substring(1);
            }

            if(features[i][0] == "+")
            {
              featureJSON.delta = true;
              features[i] = features[i].substring(1);
            }

            if(features[i][0] == "-")
            {
              featureJSON.optional = true;
              features[i] = features[i].substring(1);
            }

            featureJSON.name = features[i];
            featuresArray.push(featureJSON);
          }
        }

        return JSON.stringify(featuresArray);
      }
  };

  exports.convert();

  return exports;
});  
