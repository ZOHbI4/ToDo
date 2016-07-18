var counts = {
	sum_todo: 0,
	done: 0,
};
var html_strings = [];
var strings = [];
var i = 0;
var gr;
var gd;

function ShowCounts () {
	$('.counts').text(counts.done + ' of ' + counts.sum_todo + ' remaining ');
}

function AddNew (){
	var new_todo = $('#new_input').val();
	var string = ($('<span><li><input type="checkbox" name="checkbox" class="li">' + new_todo + '</li></span>').appendTo('#todolist'));
	html_strings.push(string);
	strings.push({
		message: new_todo,
		condition: false
		}
	);
	counts.sum_todo ++;
	ShowCounts();
	return new_todo;
}

$(document).on('ready', function(){	
	todolist.onclick = function() {
		gr = document.getElementsByName('checkbox');
		counts.done = 0;
		for(var b = 0; b<gr.length; b++) {
		    if (gr[b].checked) {
		    	counts.done ++;
		    	html_strings[b].attr('class', 'strike');
		    	strings[b].condition = true;
		    } else {		    	
		    	html_strings[b].attr('class', '')
		    	strings[b].condition = false;
		    };
		    
		    ShowCounts();
		};
		console.log(strings)
	}
});


var obj;
var loc = location.search;

function Send () {
	$.ajax({
		url: 'http://***/api/setList',
		method: 'POST',
		dataType: 'JSONP',
		data: {
			list_id: strings
		},
		success: function (data){
			location.href = location.href + '?list_id='+ data.id;
		}
	});
};

function Get () {
	var search = loc;
	var search2 = search.substr(1,search.length);
	var array = search2.split('&');
	obj = {};
	array.forEach( function(item){
		var splitted = item.split('=');
		obj[splitted[0]] = splitted[1];
	});
	
	$.ajax({
		url: 'http://***/api/getList',
		method: 'POST',
		dataType: 'JSONP',
		data: {
			list_id: obj['list_id']
		},
		success: function (data){

			location.href.substr(0, location.href.indexOf('?'))

			var length = data.list_id.length;
			
			for (var i = 0; i < length; i++) {
				if (data.list_id[i].condition == 'true') {
					$('<span><li><input type="checkbox" name="checkbox" class="li" checked="checked">' + data.list_id[i].message + '</li></span>').appendTo('#todolist')
				} else {
					$('<span><li><input type="checkbox" name="checkbox" class="li">' + data.list_id[i].message + '</li></span>').appendTo('#todolist')
				}
			};
		}
	});
};