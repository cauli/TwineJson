# TwineJson
TwineJson - Twine 2 JSON Exporter Utility Story Format

[![Build Status](https://travis-ci.org/cauli/TwineJson.svg?branch=master)](https://travis-ci.org/cauli/TwineJson)

## Demo

![Demo](http://cau.li/TwineJson/tutorial/sample.gif)

## How to Use

Short version:

Add this URL as your story format

>https://cau.li/TwineJson/format.js

Long version:

[Step 1 - At the main screen, click on Formats](https://cau.li/TwineJson/tutorial/1.png)

[Step 2 - Select the tab Add new Format, then paste the URL (https://cau.li/TwineJson/format.js)](https://cau.li/TwineJson/tutorial/2.png)

[Step 3 (Optional) - Back to the Story Formats tabs, favorite TwineJson to default it](https://cau.li/TwineJson/tutorial/3.png)

[Step 4 - Inside the editing menu (Blue Screen), select the name of your project at the bottom of the screen, and then Change Story Format](https://cau.li/TwineJson/tutorial/4.png)

[Step 5 - Confirm that TwineJson is selected](https://cau.li/TwineJson/tutorial/5.png)

[Step 6 - Press Play to export your Json file](https://cau.li/TwineJson/tutorial/6.png)


## How to Build It

```bash
$ npm install --global gulp-cli #install gulp if you don't have already

$ npm install #installs all dependencies specified on package.json

$ mocha #to run test cases

$ gulp
```

Your file format will be created on the `./dist/format.js` folder.

## Objectives

TwineJson exports Twine2 projects to JSON, adding information that goes beyond plaintext data.

You can, for instance, generate hierarchical JSONs that contains the information of ancestors of each passage.

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