(function navbarModule() {
  let $ = require('jquery');
  let menu = $('.menu');
  let logo = $('#logo');
  let taskHeaderText = $('#taskHeader div h1');
  let projectList = $('#projectList');
  let allTasksButton = $('.all-tasks');

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

  function showMenu() {
    hideTaskHeader();
    hideTaskSection();
    showMenuContent();
  }

  function hideMenu() {
    hideMenuContent();
    showTaskHeader();
    showTaskSection();
  }

  let hamburgerIcon = $('#navbar img:last');

  (function menuFolding() {
    hamburgerIcon.on('click', (e) => {
      //open menu
      if ($(e.target).hasClass('hamburger-menu')) {
        $(e.target).toggleClass('hamburger-menu');
        $(e.target).attr('src', '/dist/images/close-icon-blue.svg');
        showMenu();

        //close menu
      } else {
        $(e.target).toggleClass('hamburger-menu');
        $(e.target).attr('src', '/dist/images/menu-icon.svg');
        hideMenu();
      }
    });
  })();

  (function openProject() {
    projectList.on('click', '.project-div-e1', (e) => {
      hideMenu();
      hamburgerIcon.trigger('click');
      taskHeaderText.text($(e.target).text());
      taskHeader.attr('data-id', `${$(e.target).parent().attr('data-id')}`);
    });
  })();

  (function showAllTasks() {
    allTasksButton.on('click', () => {
      taskHeaderText.text('Tasks');
      if (taskHeader.attr('data-id')) {
        taskHeader.removeAttr('data-id');
      }
      hideMenu();
      hamburgerIcon.trigger('click');
    });
  })();
})();
