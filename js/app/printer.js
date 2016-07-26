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
* Pretty printer for JSON
*
* @return {}
*/

define(
    [],
    function () {

    return {
        syntaxHighlight : function(json, jqEl) {
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return jqEl.html(json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            }));
        }
    }
});
