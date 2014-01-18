var logs = $('pre');

var lineParsed = function(){
	this.lineId = -1;
	this.lineText = '';
	this.lineParsed = ''; 
	this.words = [];

}
var parsed = [];
var actualHover = new lineParsed();
var id = 0;
var lines = actOnEachLine(logs, function(line){
	var tempLine = new lineParsed();

	tempLine.lineId = (id);
	tempLine.lineText = '<div id="' +  tempLine.lineId + '">' + line+ '</div>';


	words = actOnEachWord(line, function(word){ return word ; });
	temp ='';
	tempLine.words = words;

	for (var i = 0; i < words.length; i++) {
		temp += "<span>" + words[i] + "</span> ";
	};
    tempLine.lineParsed = '<div id="' +tempLine.lineId +'">' + temp + '</div>';
    parsed.push(tempLine);
    id++;
	return tempLine.lineText;

});

	

$('body').append(lines);
logs.remove();
$('body').prepend('<button id="showButton" onclick="showAll();">ToutMontrer</button><br/><hr/>');
	$("#showButton").hide();
 $("div").hover(function(){
 	actualHover = findFromId($(this).attr('id'));
 	$(this).replaceWith(actualHover.lineParsed);
     onClickWords(actualHover);
     onHoverLineParsed(actualHover);
    }
     , 
 	function(){
 	});

function findFromId(id){
	return parsed[id];
}
function showAll(){
	$('div').show();
	$("#showButton").hide();
}
function onClickWords(object){
	$('#'+object.lineId + ' > span').click(function(){
		search($(this).text());
		$("#showButton").show();
	});

}
function search(text){
	for (var i = 0; i < parsed.length; i++) {
		if(parsed[i].words.indexOf(text) == -1){
			$('#'+parsed[i].lineId).hide();
		}
	};
	
}
function onHoverLineParsed(object){
	$('#'+object.lineId).hover(function(){}, function(){ 
		$(this).replaceWith(object.lineText);
		onHoverLineUnparsed(object);
	});
}
function onHoverLineUnparsed(object){
	$('#'+object.lineId).hover(function(){
		$(this).replaceWith(object.lineParsed);
		onHoverLineParsed(object);
	}, function(){ 
		
	});
}
function actOnEachLine(element, func) {http://htmlacademy.ru/courses/4/run/6
    var lines = element.text().replace(/\r\n/g, "\n").split("\n");
    var newLines, newValue, i;
    // Use the map() method of Array where available 
    if (typeof lines.map != "undefined") {
        newLines = lines.map(func);
    } else {
        newLines = [];
        i = lines.length;
        while (i--) {
            newLines[i] = func(lines[i]);
        }
    }
    return newLines;
}

function actOnEachWord(element, func) {

	  var words = element.split(" ");
    var newWords, newValue, i;
    if (typeof words.map != "undefined") {
        newWords = words.map(func);
    } else {
        newWords = [];
        i = words.length;
        while (i--) {
            newWords[i] = func(words[i]);
        }
    }
    return newWords;
}