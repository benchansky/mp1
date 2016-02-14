$(document).ready(function() {


var carousel ={
	el:{
		carousel: $("#carousel"),
		allSlides: $(".slide"),
		arrows: $(".arrow")
	},
	slideWidth:1000,
	timing:800,

	init: function() {
		this.el.arrows.on("click", function(event){
			carousel.handleNavClick(event, this);
		});
	},
	

	handleNavClick: function(event, el){
		event.preventDefault();
		var position =$(el).attr("id");
		if(position=="right-arrow"){
			console.log("right");
			this.el.carousel.animate({
				scrollRight: position*this.slideWidth
			}, this.timing);
		} else{
			console.log("left");
			this.el.carousel.animate({
				scrollLeft: position*this.slideWidth
			}, this.timing);
		}
		
	}

};
carousel.init();

/** 
* this part locks and unlocks the nav bar
*/
$(window).scroll(function(){
	var window_top=$(window).scrollTop();
	var div_top = $('#nav-anchor').offset().top;
	//console.log(div_top);

	if(window_top==div_top){
		$('nav').addClass('stick');
		$('nav').stop().animate({height: "80px"},50);  
	} else {
		$('nav').removeClass('stick');
		$('nav').stop().animate({height: "60px"},50);  
	}
});


$("nav a").click(function(evn){
	evn.preventDefault();
	var target=$(this.hash);

	$('html,body').animate({
		scrollTop:target.offset().top
	}, 1000);
	return false;
}); 



$(window).scroll(function(){
	var aChildren=$("nav li").children();
	var aArray = [];
	for (var i=0; i<aChildren.length; i++){
		var aChild=aChildren[i];
		var ahref = $(aChild).attr('href');
		aArray.push(ahref);
	}


	var windowPos=$(window).scrollTop();  //offset from page top
	var windowHeight = $(window).height();
	var docHeight = $(document).height();
	for(var i=0; i<aArray.length; i++){
		var theID=aArray[i];
		var divPos=$(theID).offset().top;
		var divHeight=$(theID).height();
		if(windowPos>=divPos&&windowPos<(divPos+divHeight)){

			$("a[href='"+theID+"']").addClass("nav-active");
		} else {
			$("a[href='"+theID+"']").removeClass("nav-active");
		}
	}

	if(windowPos+windowHeight==docHeight){
		if(!$("nav li:last-child a").hasClass("nav-active")){
			var navActiveCurrent=$(".nav-active").attr("href");
			$("a[href='"+navActiveCurrent+"']").removeClass("nav-active");
			$("nav li:last-child a").addClass("nav-active");
		}
	}

});


});
