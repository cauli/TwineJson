window.storyFormat({
	"name":"TwineJson",
	"version":"0.0.5",
	"author":"<a href='http://www.papricacomunicacao.com.br'>Páprica Comunicação</a>",
	"description":"Free utility format to export your story into JSON format. Based on Entweedle by Michael McCollum",
	"image":"icon.svg",
	"url":"http://www.papricacomunicacao.com.br",
	"license":"<a href='http://opensource.org/licenses/MIT'>MIT License</a>",
	"proofing":false,
	"source":"<html><head><title>{{STORY_NAME}}</title></head><body><script type=text/javascript>window.saveAs=saveAs||\"undefined\"!=typeof navigator&&navigator.msSaveOrOpenBlob&&navigator.msSaveOrOpenBlob.bind(navigator)||function(e){\"use strict\";if(\"undefined\"==typeof navigator||!/MSIE [1-9]\\./.test(navigator.userAgent)){var t=e.document,r=function(){return e.URL||e.webkitURL||e},n=t.createElementNS(\"http://www.w3.org/1999/xhtml\",\"a\"),i=\"download\"in n,o=function(r){var n=t.createEvent(\"MouseEvents\");n.initMouseEvent(\"click\",!0,!1,e,0,0,0,0,0,!1,!1,!1,!1,0,null),r.dispatchEvent(n)},s=e.webkitRequestFileSystem,a=e.requestFileSystem||s||e.mozRequestFileSystem,u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},l=\"application/octet-stream\",c=0,f=500,d=function(t){var n=function(){\"string\"==typeof t?r().revokeObjectURL(t):t.remove()};e.chrome?n():setTimeout(n,f)},p=function(e,t,r){t=[].concat(t);for(var n=t.length;n--;){var i=e[\"on\"+t[n]];if(\"function\"==typeof i)try{i.call(e,r||e)}catch(o){u(o)}}},h=function(t,u){var f,h,g,v=this,m=t.type,w=!1,y=function(){p(v,\"writestart progress write writeend\".split(\" \"))},O=function(){if((w||!f)&&(f=r().createObjectURL(t)),h)h.location.href=f;else{var n=e.open(f,\"_blank\");void 0==n&&\"undefined\"!=typeof safari&&(e.location.href=f)}v.readyState=v.DONE,y(),d(f)},b=function(e){return function(){return v.readyState!==v.DONE?e.apply(this,arguments):void 0}},S={create:!0,exclusive:!1};return v.readyState=v.INIT,u||(u=\"download\"),i?(f=r().createObjectURL(t),n.href=f,n.download=u,o(n),v.readyState=v.DONE,y(),void d(f)):(/^\\s*(?:text\\/(?:plain|xml)|application\\/xml|\\S*\\/\\S*\\+xml)\\s*;.*charset\\s*=\\s*utf-8/i.test(t.type)&&(t=new Blob([\"\",t],{type:t.type})),e.chrome&&m&&m!==l&&(g=t.slice||t.webkitSlice,t=g.call(t,0,t.size,l),w=!0),s&&\"download\"!==u&&(u+=\".download\"),(m===l||s)&&(h=e),a?(c+=t.size,void a(e.TEMPORARY,c,b(function(e){e.root.getDirectory(\"saved\",S,b(function(e){var r=function(){e.getFile(u,S,b(function(e){e.createWriter(b(function(r){r.onwriteend=function(t){h.location.href=e.toURL(),v.readyState=v.DONE,p(v,\"writeend\",t),d(e)},r.onerror=function(){var e=r.error;e.code!==e.ABORT_ERR&&O()},\"writestart progress write abort\".split(\" \").forEach(function(e){r[\"on\"+e]=v[\"on\"+e]}),r.write(t),v.abort=function(){r.abort(),v.readyState=v.DONE},v.readyState=v.WRITING}),O)}),O)};e.getFile(u,{create:!1},b(function(e){e.remove(),r()}),b(function(e){e.code===e.NOT_FOUND_ERR?r():O()}))}),O)}),O)):void O())},g=h.prototype,v=function(e,t){return new h(e,t)};return g.abort=function(){var e=this;e.readyState=e.DONE,p(e,\"abort\")},g.readyState=g.INIT=0,g.WRITING=1,g.DONE=2,g.error=g.onwritestart=g.onprogress=g.onwrite=g.onabort=g.onerror=g.onwriteend=null,v}}(\"undefined\"!=typeof self&&self||\"undefined\"!=typeof window&&window||this.content),\"undefined\"!=typeof module&&module.exports?module.exports.saveAs=saveAs:\"undefined\"!=typeof define&&null!==define&&null!=define.amd&&define([],function(){return saveAs}),window.onload=function(){if(\"undefined\"==typeof window.TwineJson){var e=0,t=\"\",r=\"\",n={isHierarchical:!0,exportOrder:!0,exportFeatures:!0,exportID:!0,exportOtherProperties:!0,exportPosition:!0,excludeOtherProperties:[\"features\",\"order\"],saveAsFile:!0,minified:!0};window.TwineJson={saveAsFile:function(e,t){var r=new Blob([t],{type:\"text/json;charset=utf-8\"});saveAs(r,e.replace(/[^a-z0-9]/gi,\"\").toLowerCase()+\"-\"+Math.floor(Date.now()/1e3)+\".json\")},isCyclic:function(e){function t(e){if(e&&\"object\"==typeof e){if(-1!==r.indexOf(e))return!0;r.push(e);for(var n in e)if(e.hasOwnProperty(n)&&t(e[n]))return console.error(e,\"Found cycle at \"+n),!0}return!1}var r=[];return t(e)},convert:function(){var e=window.document.getElementsByTagName(\"tw-storydata\"),i=window.document.getElementById(\"output\"),o=this[\"export\"](),s=JSON.parse(o),a=s;if(n.minified||(t=\"\\r\\n\",r=\"\t\"),n.isHierarchical){for(var u=[],l=0;l<a.length;l++)if(a[l].children=[],\"\"!==a[l].childrenNames){for(var c=a[l].childrenNames.split(\",\"),f=0;f<c.length;f++)for(var d=0;d<a.length;d++)c[f]==\"[[\"+a[d].name+\"]]\"&&a[l].children.push(a[d]);u.push(a[l])}this.isCyclic(u[0])?i.innerHTML=\"<h2>Error: Cyclic reference found</h2><br>Cyclic references aren't allowed in hierarchical JSON structures.<br>Please set ExportOptions.isHierarchical to false to use cyclic references.\":(console.dir(u[0]),i.innerHTML=JSON.stringify(u[0]),n.saveAsFile&&this.saveAsFile(e[0].getAttribute(\"name\"),JSON.stringify(u[0])))}else n.saveAsFile&&this.saveAsFile(e[0].getAttribute(\"name\"),JSON.stringify(a)),i.innerHTML=JSON.stringify(a)},\"export\":function(){var e=[];e.push(\"[\"+t);var r=window.document.getElementsByTagName(\"tw-storydata\");r&&e.push(this.buildPassage(\"StoryTitle\",\"\",r[0].getAttribute(\"name\")));var n=window.document.getElementById(\"twine-user-script\");n&&e.push(this.buildPassage(\"UserScript\",\"script\",n.innerHTML));var i=window.document.getElementById(\"twine-user-stylesheet\");i&&e.push(this.buildPassage(\"UserStylesheet\",\"stylesheet\",i.innerHTML));for(var o=window.document.getElementsByTagName(\"tw-passagedata\"),s=0;s<o.length;++s)e.push(this.buildPassageFromElement(o[s],s,o.length));return e.push(\"]\"+t),e.join(\"\")},buildPassageFromElement:function(e,t,r){var n=!1;t+1==r&&(n=!0);var i=e.getAttribute(\"name\");i||(i=\"Untitled Passage\");var o=e.getAttribute(\"tags\"),s=e.getAttribute(\"position\"),a=e.textContent;return this.buildPassage(i,o,a,s||\"\",n)},buildPassage:function(i,o,s,a,u){var l=[];l.push(\"{\"+t),n.exportID&&(l.push(r+'\"id\":'),l.push('\"',e++,'\"')),n.exportPosition&&(l.push(\",\"+t),l.push(r+'\"position\":'),l.push('\"',a,'\"')),l.push(\",\"+t),l.push(r+'\"name\":'),l.push('\"',i,'\"'),o&&(l.push(\",\"+t),l.push(r+'\"tags\":'),l.push('\"[',o,']\"'));var c=this.scrub(s,\" \");return l.push(\",\"+t),l.push(r+'\"content\":'),l.push('\"',c,'\"'),l.push(\",\"+t),l.push(r+'\"childrenNames\":'),l.push('\"',this.findChildren(c),'\"'),n.exportFeatures&&(l.push(\",\"+t),l.push(r+'\"features\" :'),l.push(\"\",this.findFeatures(s),\"\")),n.exportOrder&&(l.push(\",\"+t),l.push(r+'\"order\" :'),l.push(\"\",this.findOrder(s),\"\")),n.exportOtherProperties&&l.push(this.findOtherProperties(s,n.excludeOtherProperties)),l.push(u?\"}\"+t:\"},\"+t),l.join(\"\")},findOtherProperties:function(e,n){for(var i,o=\"\",s=/\\{\\{((\\s|\\S)+?)\\}\\}((\\s|\\S)+?)\\{\\{\\/\\1\\}\\}/gm;null!==(i=s.exec(e));){var a=i[1];if(-1==n.indexOf(a)){for(var u=i[3].split(/(\\r\\n|\\n|\\r)/gm),l=[],c=0;c<u.length;c++)u[c].length<=1&&(u.splice(c,1),c=-1);if(1===u.length)o+=\",\"+t,o+=r+'\"'+a+'\" :',o+='\"'+u[0]+'\"'+t;else{for(var f={},d=0;d<u.length;d++)f[d]=u[d];l.push(f),o+=\",\"+t,o+=r+'\"'+a+'\" :',o+=\"\"+JSON.stringify(l)+t}}}return o},scrub:function(e,t){return e&&(e=e.replace(/\\\"/gm,\"'\"),e=e.replace(/(\\r\\n|\\n|\\r)/gm,t)),e},findChildren:function(e){for(var t,r=/\\[\\[(.+?)\\]\\]/gm,n=[];null!==(t=r.exec(e));)n.push(t[0]);return n},findOrder:function(e){for(var t,r=/\\{\\{order\\}\\}((\\s|\\S)+?)\\{\\{\\/order\\}\\}/gm,n=[];null!==(t=r.exec(e));){for(var i=t[1].split(/(\\r\\n|\\n|\\r)/gm),o=0;o<i.length;o++)i[o].length<=1&&(i.splice(o,1),o=-1);for(var s=0;s<i.length;s++)featureJSON.order=i[s],n.push(featureJSON)}return JSON.stringify(n)},findFeatures:function(e){for(var t,r=/\\{\\{features\\}\\}((\\s|\\S)+?)\\{\\{\\/features\\}\\}/gm,n=[];null!==(t=r.exec(e));){for(var i=t[1].split(/(\\r\\n|\\n|\\r)/gm),o=0;o<i.length;o++)i[o].length<=1&&(i.splice(o,1),o=-1);for(var s=0;s<i.length;s++){var a=/\\(([^)]+)\\)/,u=a.exec(i[s]),l={};null!==u&&u[1]&&(i[s]=i[s].replace(/\\(([^)]+)\\)/gi,\"\"),l.subtitle=u[1]),\":\"==i[s][0]&&(l.separator=!0,i[s]=i[s].substring(1)),\"*\"==i[s][0]&&(l.star=!0,i[s]=i[s].substring(1)),\"+\"==i[s][0]&&(l.delta=!0,i[s]=i[s].substring(1)),\"-\"==i[s][0]&&(l.optional=!0,i[s]=i[s].substring(1)),l.name=i[s],n.push(l)}}return JSON.stringify(n)}}}window.TwineJson.convert()};</script><pre id=output></pre><div id=storyData style=\"display: none;\">{{STORY_DATA}}</div></body></html>"
});