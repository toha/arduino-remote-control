$(document).ready(function() {
	$(".deviceBtnOnOff span").click(function(e) {

		var signal= $(e.target).attr("title");

		$.getJSON('/remoteCtrl', { signal: signal }, function(data) {
			console.log(data);
		});

	});
});
