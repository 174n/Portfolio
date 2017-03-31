function generateText(input){
	var saetze = input.split('.'),
			saetzeLength = saetze.length;
	if(saetze[saetzeLength-1]===''){
		saetze.pop();
		saetzeLength--;
	}
	var beginn = saetze[0],
	end = saetze[saetzeLength-1];
	saetze.shift();
	saetze.pop();
	if(saetzeLength<3){
		 msg('Zu wenig Sätze');
	}
	else{
		$('#test').show();
		$('#output').html('<p></p>'+beginn+'. ');
		var temp=false;
		$.each(saetze.join('. ').split(' '), function(i, v){
			var first=""
			if(v.slice(0,1)=='\n'){
				v = v.slice(1);
				//first='<br>';
				first='<div class="line"></div>';
			}
			if(temp && v !== ''){
				var first="",last="";
				switch(v.slice(-1)){
					case ',':
						last = ',';
						v=v.substr(0, v.length-1);
					break;
					case ')':
						last = ')';
						v=v.substr(0, v.length-1);
					break;
					case '.':
						last = '.';
						v=v.substr(0, v.length-1);
					break;
				}
				$('#output').append(first+'<span class="nowrap">'+v.substr(0, v.length/2)+'<input type="text" class="hole" maxlength="'+Math.round(v.length/2)+'" size="'+Math.round(v.length/2)+'" data-loesung="'+v.substr(v.length/2, v.length)+'">'+last+'</span> ');
				
			}
			else{
				$('#output').append(first+v+' ');
			}
			if(v !== '') temp = !temp;
		});

		$('#output').append('. '+end+'.');
	}
}


$('#generate').on("click", function() {
	generateText($('#input').val());
	$('#tabs .tab').hide();
	$('#tabs .tabs-link').removeClass('tabs-active');
});

// $('#input').on("change", function() {
// 	generateText($('#input').val());
// 	$('#tabs .tab').hide();
// });


$('#allesLoeschen').on("click", function() {
	removeLoesungen();
	$('#test :input').val('');
});

$('#loesungenZeigen').on("click", function() {
	removeLoesungen();
	$.each($('#test :input[type="text"]'), function(i, v){
		var elem = $(v);
		elem.val(elem.attr('data-loesung'));
	});
});

$('#pruefen').on("click", function() {
	removeLoesungen();
	var richtig=0,
			allQ=$('#test :input[type="text"]').length;
	$.each($('#test :input[type="text"]'), function(i, v){
		var elem = $(v);
		if(elem.val() === elem.attr('data-loesung')){
			elem.addClass('richtig');
			richtig++;
		}
		else elem.addClass('falsch');
	});
	msg('Gelöst '+richtig+'/'+allQ+' ('+(100/allQ*richtig)+'%)');
});

function removeLoesungen(){
	$('#test :input[type="text"]').removeClass('falsch');
	$('#test :input[type="text"]').removeClass('richtig');
}





$('#exportFromFile').on("click",function(evt){
	if($('#exportURL').val()===''){
		var reader = new FileReader();
		reader.onload = function(e) {
			generateText(e.target.result);
		}
		reader.readAsText(document.getElementById("file").files[0]);
		$('#tabs .tab').hide();
	$('#tabs .tabs-link').removeClass('tabs-active');
	}
	else{
		$.ajax({
    	url : 'https://CORS-Anywhere.HerokuApp.com/'+$('#exportURL').val(),
      dataType: "text",
      success : function (data){
        generateText(data);
				$('#tabs .tab').hide();
				$('#tabs .tabs-link').removeClass('tabs-active');
				$('#exportURL').val('');
      }
    });
	}
});





$('#tabs .tabs-link').on("click", function(e) {
	var tabIsActive = $(e.currentTarget).hasClass('tabs-active'),
			tabIsOpen = $('.tab').is(':visible');
	
	$('#tabs .tab').hide();
	$('#tabs .tabs-link').removeClass('tabs-active');
	
	if(tabIsActive && !tabIsOpen || !tabIsActive){
		$(e.currentTarget).addClass('tabs-active');
		$('#'+$(e.currentTarget).attr('data-target')).show();
	}
});


$('#textEntfernen').on("click", function(e) {
	$('#test').hide();
});





$('#msgContainer').on("click", function(e){
	var target = $(e.target);
	if(target.is('#msgContainer')){
		target.removeClass('flex-container');
	}
});

$('#msgClose').on("click", function(e) {
	$(e.currentTarget).parent().parent().removeClass('flex-container');
});

function msg(text){
	$('#msgText').html(text);
	window.scrollTo(0, 0);
	$('#msgContainer').addClass('flex-container');
}