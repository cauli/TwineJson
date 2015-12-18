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

/* @source 
   http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js
*/
window.saveAs=saveAs||"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob&&navigator.msSaveOrOpenBlob.bind(navigator)||function(e){"use strict";if("undefined"==typeof navigator||!/MSIE [1-9]\./.test(navigator.userAgent)){var t=e.document,n=function(){return e.URL||e.webkitURL||e},o=t.createElementNS("http://www.w3.org/1999/xhtml","a"),r="download"in o,i=function(n){var o=t.createEvent("MouseEvents");o.initMouseEvent("click",!0,!1,e,0,0,0,0,0,!1,!1,!1,!1,0,null),n.dispatchEvent(o)},a=e.webkitRequestFileSystem,c=e.requestFileSystem||a||e.mozRequestFileSystem,s=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},u="application/octet-stream",f=0,d=500,l=function(t){var o=function(){"string"==typeof t?n().revokeObjectURL(t):t.remove()};e.chrome?o():setTimeout(o,d)},v=function(e,t,n){t=[].concat(t);for(var o=t.length;o--;){var r=e["on"+t[o]];if("function"==typeof r)try{r.call(e,n||e)}catch(i){s(i)}}},p=function(t,s){var d,p,w,y=this,m=t.type,S=!1,h=function(){v(y,"writestart progress write writeend".split(" "))},O=function(){if((S||!d)&&(d=n().createObjectURL(t)),p)p.location.href=d;else{var o=e.open(d,"_blank");void 0==o&&"undefined"!=typeof safari&&(e.location.href=d)}y.readyState=y.DONE,h(),l(d)},b=function(e){return function(){return y.readyState!==y.DONE?e.apply(this,arguments):void 0}},g={create:!0,exclusive:!1};return y.readyState=y.INIT,s||(s="download"),r?(d=n().createObjectURL(t),o.href=d,o.download=s,i(o),y.readyState=y.DONE,h(),void l(d)):(/^\s*(?:text\/(?:plain|xml)|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)&&(t=new Blob(["﻿",t],{type:t.type})),e.chrome&&m&&m!==u&&(w=t.slice||t.webkitSlice,t=w.call(t,0,t.size,u),S=!0),a&&"download"!==s&&(s+=".download"),(m===u||a)&&(p=e),c?(f+=t.size,void c(e.TEMPORARY,f,b(function(e){e.root.getDirectory("saved",g,b(function(e){var n=function(){e.getFile(s,g,b(function(e){e.createWriter(b(function(n){n.onwriteend=function(t){p.location.href=e.toURL(),y.readyState=y.DONE,v(y,"writeend",t),l(e)},n.onerror=function(){var e=n.error;e.code!==e.ABORT_ERR&&O()},"writestart progress write abort".split(" ").forEach(function(e){n["on"+e]=y["on"+e]}),n.write(t),y.abort=function(){n.abort(),y.readyState=y.DONE},y.readyState=y.WRITING}),O)}),O)};e.getFile(s,{create:!1},b(function(e){e.remove(),n()}),b(function(e){e.code===e.NOT_FOUND_ERR?n():O()}))}),O)}),O)):void O())},w=p.prototype,y=function(e,t){return new p(e,t)};return w.abort=function(){var e=this;e.readyState=e.DONE,v(e,"abort")},w.readyState=w.INIT=0,w.WRITING=1,w.DONE=2,w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null,y}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content);"undefined"!=typeof module&&module.exports?module.exports.saveAs=saveAs:"undefined"!=typeof define&&null!==define&&null!=define.amd&&define([],function(){return saveAs});

window.onload = function () {
    if (typeof (window.TwineJson) === "undefined") {
    var idCount = 0;

    var NL = ''; // Optional New Line
    var TAB = ''; // Optional Tabs

    var ExportOptions = {
      // If true, puts every element as a child or grandchild of the Starting Point
      // WARNING: Hierarchical JSON trees shouldn't be cyclic. This will cause an infinite loop.
      'isHierarchical':true,
      // Exports what is inside of {{order}}{{/order}} to '.order' property on JSON
      'exportOrder':true,
      // Exports using {{features}}{{/features}} syntax (Should default to false)
      // * adds the property 'star' to the element
      // + adds the property 'delta' to the element
      // - adds the property 'optional' to the element
      'exportFeatures':true,
      // Export Unique ID for node
      'exportID':true,
      // Export unknows properties inside {{property}}{{/property}} tags
      'exportOtherProperties':true,
      // Export X,Y position from Twine to the Json, allowing a pretty import later on
      'exportPosition':true,
      // Exclude these properties from OtherProperties Export.
      // Expected input: ['property1','property2','...','propertyN'];
      'excludeOtherProperties':['features','order'],
      // Save as a .json file
      'saveAsFile':true,
      // If minified, TwineJson doesn't add new lines and tabs!
      'minified':true
    };

    window.TwineJson = {
      saveAsFile: function(title, text) {
        var blob = new Blob([text], {type: "text/json;charset=utf-8"});
        window.saveAs(blob, title.replace(/[^a-z0-9]/gi, '').toLowerCase()+"-"+Math.floor(Date.now() / 1000)+".json");
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


      convert: function() {
        var storyData = window.document.getElementsByTagName("tw-storydata");
        var output = window.document.getElementById("output");

        var jsonString = this.export();

        var originalJsonPlain = JSON.parse(jsonString);
        var jsonPlain = originalJsonPlain;

        /* If not minified, NL and TAB should represent a new line (\r\n) and a tab (\t) */
        if(!ExportOptions.minified)
        {
          NL = '\r\n';
          TAB = '\t';
        }
     
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

            if(ExportOptions.saveAsFile)
            {
              this.saveAsFile(storyData[0].getAttribute("name"),JSON.stringify(hierarchyJSON[0]));
            }

          }
          
        }
        else
        {
          if(ExportOptions.saveAsFile)
          {
            this.saveAsFile(storyData[0].getAttribute("name"),JSON.stringify(jsonPlain));
          }

          output.innerHTML = JSON.stringify(jsonPlain);
        }
      },

      export: function() {
        var buffer = [];

        buffer.push("["+NL); // Opens JSON

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

        buffer.push("]"+NL); // Closes JSON

        return buffer.join(''); //buffer.join('');
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
        var result = [];
        
        result.push("{"+NL);

        if(ExportOptions.exportID)
        {
          result.push(TAB+"\"id\":");
          result.push("\"",idCount++,"\"");
        }

        if(ExportOptions.exportPosition)
        {
          result.push(","+NL);
          result.push(TAB+"\"position\":");
          result.push("\"",position,"\"");
        }
        
        result.push(","+NL);
        result.push(TAB+"\"name\":");
        result.push("\"",title,"\"");

        if (tags) 
        {
          result.push(","+NL);
          result.push(TAB+"\"tags\":");
          result.push("\"[",tags,"]\"");
        }

        var scrubbedContent = this.scrub(content, " ");

        /* Push the content */
        result.push(","+NL);
        result.push(TAB+"\"content\":");
        result.push("\"", scrubbedContent,"\"");
        
        result.push(","+NL);
        result.push(TAB+"\"childrenNames\":");
        result.push("\"", this.findChildren(scrubbedContent),"\"");
        
        if(ExportOptions.exportFeatures)
        {
          result.push(","+NL);
          result.push(TAB+"\"features\" :");
          result.push("", this.findFeatures(content),"");
        }

        if(ExportOptions.exportOrder)
        {
          result.push(","+NL);
          result.push(TAB+"\"order\" :");
          result.push("", this.findOrder(content),"");
        }

        if(ExportOptions.exportOtherProperties)
        {
          result.push(this.findOtherProperties(content, ExportOptions.excludeOtherProperties));
        }

        if (!last) 
        {
          result.push("},"+NL);
        }
        else 
        {
          result.push("}"+NL);
        }

        return result.join('');
      },

      // Finds any content between {{}}{{/}} and adds returns it as a property
      findOtherProperties: function(content, excluding) {
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
                propertiesAdded += ","+NL;
                propertiesAdded += TAB+"\""+property+"\" :";
                propertiesAdded += "\""+value[0]+"\""+NL;
              }
              else
              {
                var propertiesJSON = {};

                for(var j = 0; j < value.length; j++)
                {
                   propertiesJSON[j] = value[j];
                }

                valuesArray.push(propertiesJSON);

                propertiesAdded += ","+NL;
                propertiesAdded += TAB+"\""+property+"\" :";
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
  }
  
  window.TwineJson.convert();
};
