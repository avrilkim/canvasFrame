var UI = (function(){
	var initHandle = function(){
		//cardList();
		onLoad();
	}

	var onLoad = function(){
		$('.campaignBtnArea').on('click', function(){
			//if ($('input#campAgree').is(':checked')) {
				var scrollT = $(document).scrollTop() + 50 ;
				var middleDownPop = scrollT + ( $('.imTitleistPopup').height() - $('.downSuccessPopup').height() ) / 2
				
				$('.imTitleistPopup').animate({
					'top':scrollT
				},100, function(){
					$('.imDimmed').fadeIn(300);
					$('.imTitleistPopup').eq(0).fadeIn(300);
					$('.downSuccessPopup').css('top', middleDownPop);
				});				
			//}else{
				//alert('응모규정에 동의 하신후 참여해주세요.');
			//}				
			return false;
		});

		$('.popClose').on('click', function(){
			$('.imDimmed').fadeOut(500);
			$('.imTitleistPopup').fadeOut(300);	
			return false;
		});
	}

	var makeImg = function(){
        var upload = document.querySelector('#fileInput'),
            goStep1 = document.querySelector('.goStep1'),
            goStep2 = document.querySelector('.goStep2'),
            result1 = document.querySelector('.upload1'),
			framImg=document.getElementById('setFrame1'),
			completeBtn = document.querySelector('.successBtn'),
            cropper = '';
			frameSwiper = null;
			var once = true;
        
        //UploadFile
        upload.addEventListener('change', function (e) {
            if (e.target.files.length) {
                var reader = new FileReader();
				reader.onload = function (e) {
                    if (e.target.result) {
						once = false;
                        var img = document.createElement('img');
						img.id = 'image';
						img.src = e.target.result;
						var rsW = $('.upload1').width();
						$('.upload1').css('height', rsW);
                        result1.innerHTML = '';
                        result1.appendChild(img);

                        cropper = new Cropper(img, {
							viewMode: 3,
							dragMode: 'move',
							autoCropArea: 1,
							restore: false,
							modal: false,
							guides: false,
							highlight: false,
							cropBoxMovable: false,
							cropBoxResizable: false,
							toggleDragModeOnDblclick: false
                        });
                    }
                };
                reader.readAsDataURL(e.target.files[0]);
			}
			$('.imBtnArea .goStep2 a').css({'border':'1px solid #cc0000', 'background-color': '#cc0000'});
			$('.imBtnArea .file_input .file_input_button').css({'border':'1px solid #555555', 'background-color': '#555555'});

        });

        //stepChange
        goStep1.addEventListener('click', function(e){
			e.preventDefault();
			console.log('go step1');
			$('.imBtnArea .uploadBtn, .imBtnArea .goStep2').show();
			$('.imBtnArea .downloadBtn, .imBtnArea .goStep1').hide();
			$('.frameControlRight, .frameControlLeft').hide();
			$('.frameArea').hide();
			$('.imFrame').hide();
			$('.imPopBox .popText .photoFrameStep2').hide();
			$('.imPopBox .popText .photoFrameStep1').show();
			$('.imPopBox .popNotice').show();
		});
        //stepChange
        goStep2.addEventListener('click', function(e){
			e.preventDefault();
			if(!once){
				$('.imBtnArea .uploadBtn, .imBtnArea .goStep2').hide();
				$('.imBtnArea .downloadBtn, .imBtnArea .goStep1').show();			
				$('.frameControlRight, .frameControlLeft').show();
				$('.frameArea').removeClass('photoFrameStep2').show();
				$('.imFrame').removeClass('photoFrameStep2').show();	
				$('.imPopBox .popText .photoFrameStep2').show();
				$('.imPopBox .popText .photoFrameStep1').hide();
				$('.imPopBox .popNotice').hide();

				//showSlide
				if(frameSwiper == null){
					frameSwiper = new Swiper('.imFrame', {
						slidesPerView:2,
						slidesPerGroup: 2,
						spaceBetween: '1.5%'
					});				
					$('.frameControlRight').off('click').on('click', function(){
						frameSwiper.slideNext();	
						return false;
					});
					$('.frameControlLeft').off('click').on('click', function(){
						frameSwiper.slidePrev();
						return false;
					});
				}else{
					//console.log('destroy framer');
					frameSwiper.destroy();
					frameSwiper = new Swiper('.imFrame', {
						slidesPerView:2,
						slidesPerGroup: 2,
						spaceBetween: '1.5%'
					});				
					$('.frameControlRight').off().on('click', function(){
						frameSwiper.slideNext();
						return false;
					});
					$('.frameControlLeft').off().on('click', function(){
						frameSwiper.slidePrev();
						return false;
					});
				}
			}
        });

        $('.imFrame ul li').on('click', function(e){
			var frameIdx = $(this).index();
			var frame = [ 'img/frame1.png',
						'img/frame2.png',
						'img/frame3.png',
						'img/frame4.png',
						'img/frame5.png',
						'img/frame6.png'];
            $('.frameArea > img').attr('src', frame[frameIdx]);	

            var mkId = 'setFrame' + String(Number(frameIdx) + Number(1));
			framImg=document.getElementById(mkId);
        });
        
        $('.downloadBtn').on('click', function(e){
			e.preventDefault();
			var notIE = true;
			function msieversion() {

				var ua = window.navigator.userAgent;
				var msie = ua.indexOf("MSIE ");
			
				if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  {
					// alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
					notIE = false;
				}else  {
					notIE = true;
				}			
				return false;
			}
			msieversion();

			var acanvas = document.getElementById("resultCanvas"),
			link = document.createElement('a')
			ctx=acanvas.getContext("2d"),
			square = 500;

			var imgSrc = cropper.getCroppedCanvas({
				width: square// input value
			})
	
			//drawCanvas
			acanvas.width = square;
			acanvas.height = square;
			ctx.drawImage(imgSrc,0,0);
			ctx.drawImage(framImg,0,0, square, square);
			//downloadCanvas
			if(notIE){
				link.innerHTML = 'download image';
				link.href = acanvas.toDataURL();
				link.download = "mytitleist.png";

				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}else{
				var win = window.open();
				win.document.write("<img src='"+acanvas.toDataURL('image/png')+"'/>");
			}					
			//showPopup
			$('.downSuccessPopup').fadeIn();
			$('.imTitleistPopup').removeClass('z_index_2').addClass('z_index_3');
			$('.imDimmed').removeClass('z_index_3').addClass('z_index_2');
		});
		
		completeBtn.addEventListener('click', function(e){
			e.preventDefault();
			$('.downSuccessPopup').hide();
			$('.imTitleistPopup').removeClass('z_index_3').addClass('z_index_2');
			$('.imDimmed').removeClass('z_index_2').addClass('z_index_3');
		});
	}

	return {
		initHandle : initHandle,
		makeImg : makeImg
	}
})();

$(function(){
	UI.initHandle();
});

$(document).ready(function(){
	UI.makeImg();
	
	//slider
	var pcSwiper = new Swiper('.list_pc',{
		pagination: {
			el: '.pcPaging',
			type: 'bullets',
		},
		paginationClickable: true
	});
	var mobileSwiper = new Swiper('.list_mobile',{
		pagination: {
			el: '.mobilePaging',
			type: 'bullets',
		},
		paginationClickable: true
	});

    $('.imList .controlRight').on('click', function(){
		pcSwiper.slideNext();
		return false;
	});
	$('.imList .controlLeft').on('click', function(){
		pcSwiper.slidePrev();
		return false;
	});
});