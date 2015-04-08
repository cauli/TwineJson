/**
* TwineJson - Twine 2 JSON Exporter Utility Story Format
* By Cauli Tomaz for Páprica Comunicação
* http://cau.li/ 
* http://www.papricacomunicacao.com.br
*
* Based on Entweedle by Michael McCollum
* Copyright (c) 2015 Michael McCollum
* http://www.maximumverbosity.net/twine/Entweedle/
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
* associated documentation files (the "Software"), to deal in the Software without restriction,
* including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial
* portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
* LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
* IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



window.onload = function () {
    if (typeof (window.TwineJson) === "undefined") {
    var idCount = 0;

    var ExportOptions = {
      // If true, puts every element as a child or grandchild of the Starting Point
      // WARNING: Hierarchical JSON trees shouldn't be cyclic. This will cause an infinite loop.
      "isHierarchical" : true,
      // Exports what is inside of {{order}}{{/order}} to ".order" property on JSON
      "exportOrder" : true,
      // Exports using {{features}}{{/features}} syntax (Should default to false)
      // * adds the property "star" to the element
      // + adds the property "delta" to the element
      // - adds the property "optional" to the element
      "exportFeatures" : true,
      // Export Unique ID for node
      "exportID" : true
    };

    window.TwineJson = {
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


      convert: function() {
        var output = window.document.getElementById("output");

        var jsonString = this.export();
          
        var originalJsonPlain = JSON.parse(jsonString);
        var jsonPlain = originalJsonPlain;


        /* 
        *  For each of the elements of jsonPlain
        *  Check if it has one or more children
        *  For each child
        *  Loop through all elements of jsonPlain searching for the name of the child
        *  Add to the parent.children array
        */ 
        if(ExportOptions.isHierarchical)
        {      
          var hierarchyJSON = [];

          for(var i = 0; i < jsonPlain.length; i ++)
          {
            jsonPlain[i].children = [];

            if(jsonPlain[i].childrenNames !== "")
            {
              var eachChildren = jsonPlain[i].childrenNames.split(',');

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
            output.innerHTML = "<h2>Error: Cyclic reference found</h2><br>Cyclic references aren't allowed in hierarchical JSON structures.<br>Please set ExportOptions.isHierarchical to false to use cyclic references.";
          }
          else
          {
            // FIXME Is this always the case, the first index?
            console.dir(hierarchyJSON[0]);
            output.innerHTML = JSON.stringify(hierarchyJSON[0]);
          }
          
        }
        else
        {
          output.innerHTML = JSON.stringify(jsonPlain);
        }
      },

      export: function() {
        var buffer = [];

        buffer.push("[\r\n"); // Opens JSON

        var storyData = window.document.getElementsByTagName("tw-storydata");
        if (storyData)
        {
          buffer.push(this.buildPassage("StoryTitle","",storyData[0].getAttribute("name")));
        }

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

        var passages = window.document.getElementsByTagName("tw-passagedata");
        for (var i = 0; i < passages.length; ++i)
        {
          buffer.push(this.buildPassageFromElement(passages[i], i, passages.length));
        }

        buffer.push("]\r\n"); // Closes JSON

        return buffer.join('');
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
        var content = passage.textContent;
        
        return this.buildPassage(name, tags, content, last);
      },
  
  
      buildPassage: function(title, tags, content, last) {
        var result = [];
        
        result.push("{\r\n");

        if(ExportOptions.exportID)
        {
          result.push("\t\"id\" : ");
          result.push("\"",idCount++,"\"");
        }
        
        result.push(",\r\n");
        result.push("\t\"name\" : ");
        result.push("\"",title,"\"");

        if (tags) 
        {
          result.push(",\r\n");
          result.push("\t\"tags\" : ");
          result.push("\"[",tags,"]\"");
        }

        var scrubbedContent = this.scrub(content, " ");

        /* Push the content */
        result.push(",\r\n");
        result.push("\t\"content\" : ");
        result.push("\"", scrubbedContent,"\"");
        
        result.push(",\r\n");
        result.push("\t\"childrenNames\" : ");
        result.push("\"", this.findChildren(scrubbedContent),"\"");
        
        if(ExportOptions.exportFeatures)
        {
          result.push(",\r\n");
          result.push("\t\"features\" :");
          result.push("", this.findFeatures(content),"\r\n");
        }

        if(ExportOptions.exportOrder)
        {
          result.push(",\r\n");
          result.push("\t\"order\" :");
          result.push("", this.findOrder(content),"\r\n");
        }

        if (!last) 
        {
          result.push("},\r\n");
        }
        else 
        {
          result.push("}\r\n");
        }

        return result.join('');
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
  }
  
  window.TwineJson.convert();
};