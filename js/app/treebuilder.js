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
* Transforms plain JSON structures into hierarchical JSON
*
* @return {}
*/

define(function () {
    return {
        /*
        * Converts all possible links specified by Twine 2 to its 'realTitle'
        *
        * http://twinery.org/wiki/twine2:how_to_create_links
        *
        */
        realTitle: function(link) {
            link = link.replace('[[','');
            link = link.replace(']]','');
            
            // [[a|b]]
            if(link.indexOf('|') > -1)
            {
                var alternativeTitles = link.split('|');
                return alternativeTitles.splice(-1).toString();
            }
            // [[a->b]]
            else if(link.indexOf('->') > -1) 
            {
                var alternativeTitles = link.split('->');
                return alternativeTitles.splice(-1).toString();
            }
            // [[a<-b]]
            else if(link.indexOf('<-') > -1) 
            {
                var alternativeTitles = link.split('<-');
                return alternativeTitles[0].toString();
            }
            else
            {
                return link.toString();
            }
        },
        /*
        * Removes any passage without a 'parentId' from the root of the tree.
        *
        * This needs to be done due to the fact that we start adding 'children' properties to each object in the array
        * but in the end we don't remove the objects that have no parent.
        *
        */
        removeChildFromRoot: function(obj) {
            for(var i = obj.length; i >= 0; i--)
            {
                if(typeof obj[i] !== 'undefined')
                {
                    // If there is a key 'parentId', remove this object
                    if (('parentId' in obj[i]))
                    {
                        obj.splice(i,1);
                    }
                }
            }

            return obj;
        },
        /* 
        *
        *  for each of the elements of 'obj'
        *     for each childrenName of passage 
        *         for each element of 'obj' check if 'name' of passage == childrenName
        *               to the parent.children array
        *
        */ 
        build: function(obj) {

            console.log(JSON.stringify(obj, null, 2));

            var hierarchicalObj = [];

            for(var i = 0; i < obj.length; i ++)
            {
                obj[i].children = [];
                var childrenNames = obj[i].childrenNames;

                if(childrenNames.constructor === Array)
                {              
                    var eachChildren = obj[i].childrenNames;

                    for(var k = 0; k < eachChildren.length; k++ )
                    {
                        for(var j = 0; j < obj.length; j++ )
                        {
                            if(this.realTitle(eachChildren[k]) == obj[j].name)
                            {
                                obj[j].parentId = parseInt(obj[i].pid);
                                obj[i].children.push(obj[j]);
                            }
                        }
                    }
                }

                hierarchicalObj.push(obj[i]);
            }

            return this.removeChildFromRoot(hierarchicalObj);
        }
    }
});
