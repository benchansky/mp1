$(document).ready(function() {

//carousel code based off of a listed resource.
;(function(factory){
  if (typeof define==='function'&&define.amd) {
      define(['jquery'], factory);
  } else if (typeof exports!== 'undefined') {
      module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }

})(function($){

  var Ben_Sol = (function(element, settings){
    
    var instanceUid = 0;
    
    function _Ben_Sol(element, settings){
      this.defaults = {
        slideDuration: '3000',
        speed: 500,
        arrowRight: '.arrow-right',
        arrowLeft: '.arrow-left'
      };
      
      this.settings=$.extend({},this,this.defaults,settings);
      
      this.initials = {
        currSlide : 0,
        $currSlide: null,
        totalSlides : false,
        csstransitions: false
      };
      $.extend(this,this.initials);
      this.$el = $(element);
        this.changeSlide = $.proxy(this.changeSlide,this);
        this.init();
      this.instanceUid = instanceUid++;
    }
    
    return _Ben_Sol;
  
  })();

   Ben_Sol.prototype.init = function(){
    this.csstransitionsTest();
    this.$el.addClass('Ben_Sol-carousel');
    this.build();
    this.events();
    this.activate();
    this.initTimer();
  };
	
	Ben_Sol.prototype.csstransitionsTest = function(){
		var elem = document.createElement('modernizr');
		var props = ["transition","WebkitTransition","MozTransition","OTransition","msTransition"];
		for ( var i in props ) {
			var prop = props[i];
			var result = elem.style[prop] !== undefined ? prop : false;
			if (result){
				this.csstransitions = result;
				break;
			} 
		} 
	};

	Ben_Sol.prototype.addCSSDuration = function(){
		var _ = this;
		this.$el.find('.slide').each(function(){
			this.style[_.csstransitions+'Duration'] = _.settings.speed+'ms';
		});
	}
	
	Ben_Sol.prototype.removeCSSDuration = function(){
		var _ = this;
		this.$el.find('.slide').each(function(){
			this.style[_.csstransitions+'Duration'] = '';
		});
	}
	
	Ben_Sol.prototype.build = function(){
		var $indicators = this.$el.append('<ul class="indicators" >').find('.indicators');
		this.totalSlides = this.$el.find('.slide').length;
		for(var i = 0; i < this.totalSlides; i++) $indicators.append('<li data-index='+i+'>');
	};
	
	Ben_Sol.prototype.activate = function(){
		this.$currSlide = this.$el.find('.slide').eq(0);
		this.$el.find('.indicators li').eq(0).addClass('active');
	};
	
	Ben_Sol.prototype.events = function(){
		$('body')
			.on('click',this.settings.arrowRight,{direction:'right'},this.changeSlide)
			.on('click',this.settings.arrowLeft,{direction:'left'},this.changeSlide)
			.on('click','.indicators li',this.changeSlide);
	};
	
	Ben_Sol.prototype.clearTimer = function(){
		if (this.timer) clearInterval(this.timer);
	};
	

	Ben_Sol.prototype.initTimer = function(){
		this.timer = setInterval(this.changeSlide, this.settings.slideDuration);
	};
	
	Ben_Sol.prototype.startTimer = function(){
		this.initTimer();
		this.throttle = false;
	};
	

	Ben_Sol.prototype.changeSlide = function(e){
		if (this.throttle) return;
		this.throttle = true;
		this.clearTimer();
		var direction = this._direction(e);
	
		var animate = this._next(e,direction);
		if (!animate) return;
		var $nextSlide = this.$el.find('.slide').eq(this.currSlide).addClass(direction + ' active');
		
    if (!this.csstransitions){
			this._jsAnimation($nextSlide,direction);
		} else {
			this._cssAnimation($nextSlide,direction);
		}
	};

	Ben_Sol.prototype._direction = function(e){
		var direction;
		if (typeof e !== 'undefined'){
			direction = (typeof e.data === 'undefined' ? 'right' : e.data.direction);
		} else {
			direction = 'right';
		}
		return direction;
	};
	
	Ben_Sol.prototype._next = function(e,direction){
		var index = (typeof e !== 'undefined' ? $(e.currentTarget).data('index') : undefined);
		switch(true){
       case( typeof index !== 'undefined'):
				if (this.currSlide == index){
					this.startTimer();
					return false;
				} 
				this.currSlide = index;
			break;
			case(direction == 'right' && this.currSlide < (this.totalSlides - 1)):
				this.currSlide++;
			break;
			case(direction == 'right'):
				this.currSlide = 0;
			break;
			case(direction == 'left' && this.currSlide === 0):
				this.currSlide = (this.totalSlides - 1);
			break;
			case(direction == 'left'):
				this.currSlide--;
			break;
		}
		return true;
	};
	
	Ben_Sol.prototype._cssAnimation = function($nextSlide,direction){
		setTimeout(function(){
			this.$el.addClass('transition');
			this.addCSSDuration();
			this.$currSlide.addClass('shift-'+direction);
		}.bind(this),100);
	
		setTimeout(function(){
			this.$el.removeClass('transition');
			this.removeCSSDuration();
			this.$currSlide.removeClass('active shift-left shift-right');
			this.$currSlide = $nextSlide.removeClass(direction);
			this._updateIndicators();
			this.startTimer();
		}.bind(this),100 + this.settings.speed);
	};
	

	Ben_Sol.prototype._jsAnimation = function($nextSlide,direction){
		var _ = this;
		if(direction == 'right') _.$currSlide.addClass('js-reset-left');
		
     var animation = {};
		animation[direction] = '0%';
		
		var animationPrev = {};
		animationPrev[direction] = '100%';
		
		this.$currSlide.animate(animationPrev,this.settings.speed);
		$nextSlide.animate(animation,this.settings.speed,'swing',function(){
			_.$currSlide.removeClass('active js-reset-left').attr('style','');
			_.$currSlide = $nextSlide.removeClass(direction).attr('style','');
			_._updateIndicators();
			_.startTimer();
		});
	};
	
	Ben_Sol.prototype._updateIndicators = function(){
		this.$el.find('.indicators li').removeClass('active').eq(this.currSlide).addClass('active');
	};

	$.fn.Ben_Sol = function(options){
    
    return this.each(function(index,el){
      
      el.Ben_Sol = new Ben_Sol(el,options);
      
    });
    
  };
  

});

var args = {
	arrowRight : '.arrow-right', 
	arrowLeft : '.arrow-left', 
	speed : 1000, 
	slideDuration : 4000 
};

$('.carousel').Ben_Sol(args);





//modal controls:
// Get the modal
var modal = document.getElementById('myModal');
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


$(".col").click(function(evn){
	evn.preventDefault();
	modal.style.display = "block";
}); 


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}






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
		scrollTop:target.offset().top-60
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


	var windowPos=$(window).scrollTop()+60;  //offset from page top
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
