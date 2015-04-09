# TwineJson
TwineJson - Twine 2 JSON Exporter Utility Story Format

Based on Entweedle by Michael McCollum
http://www.maximumverbosity.net/twine/Entweedle/

## Objectives

TwineJson exports Twine2 projects to JSON, adding information that goes beyond plaintext data.

You can, for instance, generate hierarchical JSONs that contains the information of ancestors of each passage.

## Features

+ Builds hierarchical JSON objects
+ Builds non-hierarchical (plain) JSON objects
+ Detects cyclic stories to avoid a hierarchical inception 
+ Custom JSON properties by using the {{feature}}content{{/feature}}

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

A father->child relationship will be exported as follows:

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

- Smarter cyclic detection
- Building clean, indented JSON
- Building minified JSON
- Automate JSON validation
- Write "How to use it"
