// JavaScript Document

	$(document).ready(function() {
	 
		  setInterval( function() {
		  var seconds = 00;
		  var sdegree = seconds * 6;
		  var srotate = "rotate(" + sdegree + "deg)";
		  
		  $("#sec").css({"-moz-transform" : srotate, "-webkit-transform" : srotate, "-o-transform" : srotate});
			  
		  }, 500 );

		  
		  setInterval( function() {
		  var seconds = 59;
		  var sdegree = seconds * 6;
		  var srotate = "rotate(" + sdegree + "deg)";
		  
		  $("#sec").css({"-moz-transform" : srotate, "-webkit-transform" : srotate, "-o-transform" : srotate});
			  
		  }, 200 );
		  
	 
		  setInterval( function() {
		  var hdegree = hours * 30 + (mins / 2);
		  var hrotate = "rotate(" + hdegree + "deg)";
		  
		  $("#hour").css({"-moz-transform" : hrotate, "-webkit-transform" : hrotate, "-o-transform" : hrotate});
			  
		  }, 0 );
	
	
		  setInterval( function() {
		  var mdegree = mins * 6;
		  var mrotate = "rotate(" + mdegree + "deg)";
		  
		  $("#min").css({"-moz-transform" : mrotate, "-webkit-transform" : mrotate, "-o-transform" : mrotate});
			  
		  }, 0 );
	 
	}); 