$(document).ready(function() {
  var storageCount = localStorage.length;
  var mySwiper = undefined;


  function windowSize() {
    var screenWidth = $(window).outerWidth();
    if (screenWidth <= '550') {
      if (typeof mySwiper == 'undefined') {
        mySwiper = new Swiper('.swiper-container', {
          slidesPerView: 'auto',
          spaceBetween: 30,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }
        });
      }
    } else {
      if (typeof mySwiper != 'undefined') {
        mySwiper.destroy();
        mySwiper = undefined;
        $('.swiper-wrapper').removeAttr('style');
        $('.swiper-slide').removeAttr('style');
      }
    }
  }

  $(window).on('load resize', windowSize);


  $('.filters input[type="checkbox"]').on('click', function() {
    var check = $(this).is(':checked');
    localStorage.setItem($(this).next().text(), check);
    var picked = $(this).data('filter');

    $('.products__list li').removeClass('swiper-slide_' + picked);

    filterHandler($(this));
  });

  filterHandler($('#avaibility'));
  filterHandler($('#sale'));

  function filterHandler(tag) {
      var id = $(tag).next().text();
      var is_checked = localStorage.getItem(id);
      is_checked = (is_checked == 'false') ? false : true;
      if (is_checked === true) {
          $(tag).attr('checked', 'checked');
          var picked = $(tag).data('filter');
          $('.products__list li').each(function() {
            var hiddenItem = $(this).find('.product__price_' + picked);
            if (hiddenItem.length) {
              $(this).closest('li').addClass('swiper-slide_' + picked);
            }
          });
      }
  }

  $('select.orderby').on('change', function() {
    var option = $(this).find('option:selected').val();
    localStorage.setItem('orderby', option);
    orderHandler();
  });
  orderHandler();

  function orderHandler() {
      var option = localStorage.getItem('orderby');
      $(".orderby option").each(function(){
          if ($(this).val() == option)
            $(this).attr("selected","selected");
      });

      $('.products__list li').sort(function(a, b) {
          var price_b = $(b).find('.product__price_new').text().replace('$', '').replace(' ', '');
          var price_a = $(a).find('.product__price_new').text().replace('$', '').replace(' ', '');
          var alfa_a = $(a).find('.product__title a').text();
          var alfa_b = $(b).find('.product__title a').text();

          switch (option) {
            case 'price':
                return parseInt(price_b) > parseInt(price_a) ? 1 : -1;
              break;
            case 'price-desc':
                return parseInt(price_a) > parseInt(price_b) ? 1 : -1;
              break;
            case 'alpha-desc':
                return alfa_b > alfa_a ? 1 : -1;
              break;
            default:
                return alfa_a > alfa_b ? 1 : -1;
          }

      }).prependTo('.products__list');
  }


  $('.product__btn').on('click', function(e) {
    e.preventDefault();
    $(this).toggleClass('button_active');
    btnHandler($(this), e);
  });

  $('.product__btn').each(function() {
      btnHandler($(this), null);
  });


  function btnHandler(tag, e) {
      var item = {
        name: $(tag).closest('.product').find('.product__inner-title').text(),
        style: $(tag).hasClass('button_active') ? true : false
      }

      if (e != null && e.type == 'click') {
          localStorage.setItem(item.name, item.style);
      }

      var is_btn_active = localStorage.getItem(item.name);
      is_btn_active = (is_btn_active == 'false') ? false : true;
      if (localStorage.getItem(item.name) && is_btn_active === true) {
          $(tag).val( 'Checout' );
          $(tag).addClass('button_active');
      } else {
          $(tag).val( 'Add to cart' );
          $(tag).removeClass('button_active');
      }
  }


  $('.favorites').on('click', function() {
      var parentIndex = $(this).closest('li').index();
      var active = false;
      $(this).toggleClass('favorites_active');
      if ($(this).hasClass('favorites_active')) {
          active = true;
          alert('Add to favorites');
      } else {
          alert('Remove from favorites');
      }

      localStorage.setItem('favorite' + parentIndex, active);
  });

  $('.favorites').each(function() {
      var parentIndex = $(this).closest('li').index();

      var is_btn_active = localStorage.getItem('favorite' + parentIndex);
      is_btn_active = (is_btn_active == 'false') ? false : true;
      if (localStorage.getItem('favorite' + parentIndex) && is_btn_active === true) {
          $(this).addClass('favorites_active');
      }
  });


});
