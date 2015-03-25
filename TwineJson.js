/**
* TwineJson - Twine 2 Json Export Story Format
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
window.onload = function() {
	if (typeof(window.TwineJson) == "undefined") {

		window.TwineJson = {
			convert: function() {
				var output = window.document.getElementById("output");

				var jsonString = this.export();
					
				var originalJsonPlain = JSON.parse(jsonString);
				var jsonPlain = originalJsonPlain;
			
				var hierarchyJSON = [];

				// For each of the elements of jsonPlain
				// Check if it has one or more children
				// For each child
				// Loop through all elements of jsonPlain searching for the name of the child
				// Add to the parent.children array
				for(var i = 0; i < jsonPlain.length; i ++)
				{
					jsonPlain[i].children = [];

					if(jsonPlain[i].childrenNames != "")
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

				// FIXME Is this always the case, the first index?
				console.dir(hierarchyJSON[0]);

				//output.innerHTML = jsonString;
				output.innerHTML = JSON.stringify(hierarchyJSON[0]);
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

				result.push("\t\"name\" : ");
				result.push("\"",title,"\"");

				if (tags) 
				{
					result.push(",\r\n");
					result.push("\t\"tags\" : ");
					result.push("\"[",tags,"]\"");
				}

				var scrubbedContent = this.scrub(content, " ");
				var scrupped




				/* Push the content */
				result.push(",\r\n");
				result.push("\t\"content\" : ");
				result.push("\"", scrubbedContent,"\",\r\n");
				
				


				result.push("\t\"childrenNames\" : ");
				result.push("\"", this.findChildren(scrubbedContent),"\",\r\n");
				
				result.push("\t\"features\" :");
				result.push("", this.findFeatures(content),"\r\n");
				
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

				while( ( match = ptrn.exec(content) ) != null )
				{
					results.push(match[0]);
				}

				return results;
			},


			// Finds features inside the passage by searching for the {{features}}...{{/features}} syntax
			findFeatures: function(content) {
				var ptrn = /\{\{features\}\}((\s|\S)+?)\{\{\/features\}\}/gm;
				var match;
				var results = [];
				var featuresArray = [];

				while( ( match = ptrn.exec(content) ) != null )
				{
					var features = match[1].split(/(\r\n|\n|\r|\,)/gm);

					for(var i = 0; i < features.length; i++)
					{
						if(features[i].length < 3)
						{
							features.splice(i,1);
							i=-1;
						}
					}

					for(var i = 0; i < features.length; i++)
					{
						var featureJSON = {};

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

		}			
	}
	
	window.TwineJson.convert();
}