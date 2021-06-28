(function navbarModule() {
  let $ = require('jquery');
  let menu = $('.menu');

  function showMenuContent() {
    menu.show();
  }

  function hideMenuContent() {
    menu.hide();
  }

  let taskHeader = $('#taskHeader');

  function hideTaskHeader() {
    taskHeader.hide();
  }

  function showTaskHeader() {
    taskHeader.show();
  }

  let taskSection = $('.to-do-section');

  function hideTaskSection() {
    taskSection.hide();
  }

  function showTaskSection() {
    taskSection.show();
  }

  let hamburgerIcon = $('#navbar img:last');

  (function menuFolding() {
    hamburgerIcon.on('click', (e) => {
      //open menu
      if ($(e.target).hasClass('hamburger-menu')) {
        $(e.target).toggleClass('hamburger-menu');
        $(e.target).attr('src', '/dist/images/close-icon-blue.svg');
        hideTaskHeader();
        hideTaskSection();
        showMenuContent();

        //close menu
      } else {
        $(e.target).toggleClass('hamburger-menu');
        $(e.target).attr('src', '/dist/images/menu-icon.svg');
        hideMenuContent();
        showTaskHeader();
        showTaskSection();
      }
    });
  })();
})();
