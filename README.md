# TwineJson
TwineJson - Twine 2 JSON Exporter Utility Story Format

Built for Páprica Comunicação
http://www.papricacomunicacao.com.br

Based on Entweedle by Michael McCollum
http://www.maximumverbosity.net/twine/Entweedle/

## Objectives

TwineJson exports Twine2 projects to JSON, adding information that goes beyond plaintext data.

You can, for instance, generate hierarchical JSONs that contains the information of ancestors of each passage.

## Features
+ Automatically saves to .json file by using the HTML5 File API
+ Builds hierarchical or non-hierarchical (plain) JSON objects
+ Detects cyclic stories to avoid a hierarchical inception 
+ Custom JSON properties by using the {{propertyKey}}Value{{/propertyKey}} syntax
+ Exports Twine position information
+ Builds clean expanded or minified JSON

## Adding custom properties

It is possible to add custom properties of each passage to the JSON by using TwineJson's {{propertyKey}}Value{{/propertyKey}} syntax

```
Title: Passage Father

{{hierarchy}}
father
{{/hierarchy}}
```

Will be built as:

```json
{
    "id": "1",
    "name": "Passage Father",
    "content": "{{hierarchy}} father {{/hierarchy}}",
    "hierarchy": "father",
}
```

## Hierarchical JSON

A Father->Child relationship will be exported as follows:

```json
{
    "id": "1",
    "name": "Passage Father",
    "content": "{{hierarchy}} father {{/hierarchy}}  [[Passage Child]]",
    "childrenNames": "[[Passage Child]]",
    "hierarchy": "father",
    "children": [
        {
            "id": "2",
            "name": "Passage Child",
            "content": "{{hierarchy}} child {{/hierarchy}}",
            "childrenNames": "",
            "hierarchy": "child",
            "children": []
        }
    ]
}
```


## Planned Features

- Smarter cyclic detection (Detect only Passage<-(nPassages)->Passage that would cause an infinite JSON)
- Automate JSON validation
- Write "How to use it"
