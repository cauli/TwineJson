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
   "./options",
   "./treebuilder",
   "./printer"],
   function($, saveAs, options, treebuilder, printer) {

    var stage = {
      'output': $('#output'),
      'storyData': $('tw-storydata'),
      'passageData': $("tw-passagedata"),
      'title': $("tw-storydata").attr('name')
    }

    var idCount = 0;

    var exports = {
      convert: function() {
        var storyData = stage.storyData;
        var jsonObject = this.export();

        console.log("====== 'ORIGINAL, PLAIN' JSON OBJECT ======");
        console.dir(jsonObject);
        console.log("====== END JSON OBJECT ======");
    

        if(options.isHierarchical)
        {   
          var hierarchyJSON = treebuilder.build(jsonObject);

          if(this.isCyclic(hierarchyJSON[0]))
          {
            stage.output.val("Error: Cyclic reference found</h2><br>Cyclic references aren't allowed in hierarchical JSON structures.<br>Please set options.isHierarchical to false to use cyclic references.");
          }
          else
          {
            if(options.saveAsFile)
            {
              this.saveAsFile(stage.title,JSON.stringify(hierarchyJSON, null, 4));
            }

            printer.syntaxHighlight(JSON.stringify(hierarchyJSON, null, 4)); 
            //stage.output.html(JSON.stringify(hierarchyJSON, null, 4));
          }
        }
        else
        {
          if(options.saveAsFile)
          {
            this.saveAsFile(stage.title,JSON.stringify(jsonPlain, null, 2));
          }

          printer.syntaxHighlight(JSON.stringify(jsonPlain, null, 4));
          //stage.output.html(JSON.stringify(jsonPlain, null, 4));
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

        var storyData = stage.storyData;

        console.dir(storyData);

        /*if (typeof storyData !== 'undefined')
        {
          buffer.push(this.buildPassage("StoryTitle", "", stage.title));
        }*/

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

        var passages = stage.passageData;

        for (var i = 0; i < passages.length; ++i)
        {
          buffer.push(this.buildPassageFromElement(passages[i], i, passages.length));
        }

        var result = "[" + buffer.join(',') + "]";

        return JSON.parse(result);
      },
      
      buildPassageFromElement: function(passage, index, howManyPassages) {
        var last = false;
        
        if(index+1 == howManyPassages)
        {
          last = true;
        }
        
        var name = passage.getAttribute("name");

        if (typeof name === "undefined")
        {
          name = "Untitled Passage";
        }

        var pid = passage.getAttribute("pid");
        var tags = passage.getAttribute("tags");
        var position = passage.getAttribute("position");
        var content = passage.textContent;
        
        return this.buildPassage(name, tags, content, position, last, pid);
      },

      buildPassage: function(title, tags, content, position, last, pid) {
        var result = {};

        options.exportID ? (result.pid = parseInt(pid)) : null;

        if(options.exportPosition &&
           typeof position !== 'undefined') {
          position = position.split(',');
          
          result.position = {
            x: parseInt(position[0]),
            y: parseInt(position[1])
          } 
        } 

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
