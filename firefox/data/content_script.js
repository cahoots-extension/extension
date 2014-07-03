$(document).ready(function() {
	console.log("init");
	$.each(author, function(key, value) {
		$("p").highlight(key, {caseSensitive: false, className: value });
	});


	$('span[class*=CahootsID]').tooltipster({
		interactive: true,
		contentAsHTML: true,
		maxWidth: 320,
		animation: 'fade',
		content: 'Loading...',
		delay: '300',
		speed: '300',
		timer: '450',
		functionBefore: function(origin, continueTooltip) {
			continueTooltip();
			var id = $(this).attr('class').replace(' tooltipstered','');
			cahoots_generate(id, function(){
				origin.tooltipster('content', cahoots_content);
			});
		}
	});


	function cahoots_generate(id, callback) {
		$.getJSON('db.json', function(db) {
			cahoots_content = '<p class="cahoots_top">Für <strong>';
			cahoots_content += db[id].name;
			cahoots_content += '</strong> wurden die folgenden Verbindungen gefunden:</p>';
			cahoots_content += '<section class="cahoots_middle"><ul id="cahoots_list">';
			$.each(db[id].cahoots, function(i,v){
            	cahoots_content += '<li class="cahoots_item"><a target="_blank" title="Mehr Infos zu dieser Organisation" href="';
            	cahoots_content += v.more_info;
            	cahoots_content += '">';
            	cahoots_content += v.name;
            	cahoots_content += '</a><a target="_blank" class="quelle" href="';
            	cahoots_content += v.src;
            	cahoots_content += '">Quelle</a></li>';
            });
	        cahoots_content += '</ul></section>';
	        cahoots_content += '<section class="cahoots_footer">';
	        cahoots_content += '<a target="_blank" href="http://jonasbergmeier.net/cahoots/contribute.html"><button class="cahoots_button">Informationen eintragen</button></a>';
	        cahoots_content += '<a target="_blank" href="http://jonasbergmeier.net/cahoots/XYZ.html"><button class="cahoots_button">Fehler melden</button></a>';
	        cahoots_content += '</section>';

	        return callback(cahoots_content);
		});
	}

});