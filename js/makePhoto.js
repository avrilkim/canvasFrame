var UI = (function(){

	var initHandle = function(){
        makeImg();
	};

	var makeImg = function(){
		var upload = document.querySelector('#fileInput'),
            goStep1 = document.querySelector('.goStep1'),
            goStep2 = document.querySelector('.goStep2'),
            resultImg = document.querySelector('.uploadImg'),
            framImg = document.getElementById('setFrame1'),
            completeBtn = document.querySelector('.successBtn'),
            cropper = '',
			uploadedImg = false,
        	frameSwiper = null;

		//uploadImage
		upload.addEventListener('change', function (e) {
			if (e.target.files.length) {
				var reader = new FileReader();
				reader.onload = function (e) {
                    if (e.target.result) {
						uploadedImg = true;
                        var img = document.createElement('img');
							img.id = 'image';
							img.src = e.target.result;

						var rsW = $('.upload1').width();
						$('.upload1').css('height', rsW);
                        resultImg.innerHTML = '';
                        resultImg.appendChild(img);

						//callCropper
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
		});

        //stepChange
        goStep1.addEventListener('click', function(){
            $('.imPopup').removeClass('step2Frame').addClass('step1Frame');
        });
        goStep2.addEventListener('click', function(){
        	if(uploadedImg){
                $('.imPopup').removeClass('step1Frame').addClass('step2Frame');

                //showSlide
                if(frameSwiper !== null){
                	frameSwiper.destroy(); //forResponsive
                }
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
			}else{
        		alert('please, upload your image.');
			}
        });

        //selectFrame
        $('.imFrame ul li').on('click', function(e){
            var frameIdx = $(this).index();
            var frame = [ 'img/frame1.png', 'img/frame2.png', 'img/frame3.png', 'img/frame4.png', 'img/frame5.png', 'img/frame6.png'];
            $('.frameArea > img').attr('src', frame[frameIdx]);

            var mkId = 'setFrame' + String(Number(frameIdx) + Number(1));
            framImg = document.getElementById(mkId);
        });

        $('.downloadBtn').on('click', function(){
            var notIE = true;
            function msieversion() {

                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  {
                    notIE = false;
                }else  {
                    notIE = true;
                }
                return false;
            }
            msieversion();

            var acanvas = document.getElementById("resultCanvas"),
                link = document.createElement('a'),
                ctx = acanvas.getContext("2d"),
                square = 500;

            var imgSrc = cropper.getCroppedCanvas({
                width: square// input value
            });

            //drawCanvas
            acanvas.width = square;
            acanvas.height = square;
            ctx.drawImage(imgSrc,0,0);
            ctx.drawImage(framImg,0,0, square, square);

            //downloadCanvas
            if(notIE){
                link.innerHTML = 'download image';
                link.href = acanvas.toDataURL();
                link.download = "myFrame.png";

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }else{
                var win = window.open();
                win.document.write("<img src='"+acanvas.toDataURL('image/png')+"'/>");
            }
            //showPopup
            $('.downSuccessPopup').fadeIn();
            $('.imPopup').removeClass('z_index_2').addClass('z_index_3');
            $('.imDimmed').removeClass('z_index_3').addClass('z_index_2');

        });

        completeBtn.addEventListener('click', function(e){
            e.preventDefault();
            $('.downSuccessPopup').hide();
            $('.imPopup').removeClass('z_index_3').addClass('z_index_2');
            $('.imDimmed').removeClass('z_index_2').addClass('z_index_3');
        });


    };

	return {
		initHandle : initHandle
	};

})();

$(function(){
	UI.initHandle();
});