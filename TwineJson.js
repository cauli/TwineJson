window.onload = function() {
	if (typeof(window.TwineJson) == "undefined") {

		window.TwineJson = {

			convert: function() {
				var output = window.document.getElementById("output");

				output.innerHTML = this.export();
			},

			
			export: function() {
				var buffer = [];

				var storyData = window.document.getElementsByTagName("tw-storydata");
				if (storyData) {
					buffer.push(this.buildPassage("StoryTitle","",storyData[0].getAttribute("name")));
				}

				var userScript = window.document.getElementById("twine-user-script");
				if (userScript) {
					buffer.push(this.buildPassage("UserScript","script",userScript.innerHTML));
				}

				var userStylesheet = window.document.getElementById("twine-user-stylesheet");
				if (userStylesheet) {
					buffer.push(this.buildPassage("UserStylesheet","stylesheet",userStylesheet.innerHTML));
				}

				var passages = window.document.getElementsByTagName("tw-passagedata");
				for (var i = 0; i < passages.length; ++i) {
					buffer.push(this.buildPassageFromElement(passages[i]));
				}

				return buffer.join('');
			},

			
			buildPassageFromElement: function(passage) {
				var name = passage.getAttribute("name");
				if (!name) {
					name = "Untitled Passage";
				}
				var tags = passage.getAttribute("tags");
				var content = passage.textContent;
				
				return this.buildPassage(name, tags, content);
			},
	
	
			buildPassage: function(title, tags, content) {
				var result = [];
				
				result.push(":: ",title);
				if (tags) {
					result.push("[",tags,"]");
				}
				result.push("\r\n", this.scrub(content),"\r\n\r\n");
				
				return result.join('');
			},

			
			scrub: function(content) {
				if (content)
					content = content.replace(/^::/gm, " ::");
				return content;
			}

		}			
	}
	
	window.TwineJson.convert();
}	