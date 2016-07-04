$(document).ready(function() {
var jjson = '{ "name": "jJsonViewer","author": { "name": "Shridhar Deshmukh", "email": "123@gmail.com", "contact": [{"location": "<span>office</span>", "number": 123456}, {"location": "home", "number": 987654}] } }';

$("#jjson").jJsonViewer(jjson);
});