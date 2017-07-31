
// $(document).ready(function(){
//  $(".action-header2")[0]&&$("#header,  .action-header2").affix( {
//     offset:  {
//     top: $(".action-header2").offset().top;
// }
// });
// });

$(window).scroll(function(){
  var sticky = $('.action-header2'),
      scroll = $(window).scrollTop();

  if (scroll >= 100) sticky.addClass('fixed');
  else sticky.removeClass('fixed');
});
$(function() {

  $(window).scroll(function() {
    var x = $(window).scrollTop();

    if (x >= 42) {
      $("#header_search").show();
      $(".action-header2").removeClass("header__main");
       $(".action-header2").removeClass("logo__text");
       $(".action-header2").addClass("logo__text2");
    } else {
      $("#header_search").hide();
      $(".action-header2").addClass("header__main");
       $(".action-header2").removeClass("logo__text2");
    }

  });

});