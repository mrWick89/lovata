$(document).ready(function() {

  var isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };
  var storageCount = localStorage.length;

  //isMobile.any()
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


  $('.favorites').click(function() {
    if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
      window.sidebar.addPanel(document.title, window.location.href, '');
    } else if (window.external && ('AddFavorite' in window.external)) { // IE Favorite
      window.external.AddFavorite(location.href, document.title);
    } else if (window.opera && window.print) { // Opera Hotlist
      this.title = document.title;
      return true;
    } else { // webkit - safari/chrome
      alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
    }
  });


  $('#avaibility').on('click', function() {
    var check = $(this).is(':checked');
    localStorage.setItem($(this).next().text(), check);

    $('li.product').each(function() {
      $(this).removeClass('not_available');
      var not_available = $(this).find('.not');
      if (not_available.length && check == true) {
        $(this).addClass('not_available');
      }
    });
  });

  function filterHandler(tag) {
      var id = $(tag).next().text();
      var is_checked = localStorage.getItem(id);
      is_checked = (is_checked == 'false') ? false : true;
      if (is_checked === true) {
          $(tag).click();
      }
  }

  $('#avaibility').each(function() {
      filterHandler($(this));
  });

  $('#sale').on('click', function() {
    var check = $(this).is(':checked');
    localStorage.setItem($(this).next().text(), check);

    $('li.product').each(function() {
      $(this).removeClass('hide_old');
      var old = $(this).find('.old');
      if (old.length && check == true) {
        $(this).addClass('hide_old');
      }
    });
  });


  $('#sale').each(function() {
      filterHandler($(this));
  });


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

      switch (option) {
        case 'price':
          $('.products__list li.product').sort(function(a, b) {
            var string_b = $(b).find('.new').text().replace('$', '').replace(' ', '');
            var string_a = $(a).find('.new').text().replace('$', '').replace(' ', '');
            return parseInt(string_b) > parseInt(string_a) ? 1 : -1;
          }).prependTo('.products__list');
          break;
        case 'price-desc':
          $('.products__list li.product').sort(function(a, b) {
            var string_b = $(b).find('.new').text().replace('$', '').replace(' ', '');
            var string_a = $(a).find('.new').text().replace('$', '').replace(' ', '');
            return parseInt(string_a) > parseInt(string_b) ? 1 : -1;
          }).prependTo('.products__list');
          break;
        case 'alpha-desc':
          $('.products__list li.product').sort(function(a, b) {
            return $(b).find('.product__title a').text() > $(a).find('.product__title a').text() ? 1 : -1;
          }).prependTo('.products__list');
          break;
        default:
          $('.products__list li.product').sort(function(a, b) {
            return $(a).find('.product__title a').text() > $(b).find('.product__title a').text() ? 1 : -1;
          }).prependTo('.products__list');
      }
  }

  $('.product__btn').on('click', function(e) {
    e.preventDefault();

    var item = {
      name: $(this).closest('.product__info').find('.product__title a').text(),
      btn_text: $(this).val()
    }
    var count = localStorage.getItem(item.name);
    count = (count == null || count == 'null') ? 0 : parseInt(count);
    count++

    localStorage.setItem(item.name, count);
    $(this).val(item.btn_text + ' ' + count);
  });

  if (storageCount > 0) {
    $('.product__btn').each(function() {
      var item = {
        name: $(this).closest('.product__info').find('.product__title a').text(),
        btn_text: $(this).val()
      }
      var count = localStorage.getItem(item.name);
      if (count != null) {
        $(this).val(item.btn_text + ' ' + count);
      }
    });
  }


});
