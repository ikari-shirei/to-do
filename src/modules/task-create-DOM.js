let $ = require('jquery');

function createTaskDOM(name, project, deadline, priority, id) {
  let toDoSection = $('.to-do-section');
  let container = $('<div class="to-do-container"></div>');
  container.appendTo(toDoSection);

  let toDoLeft = $('<div class="to-do-left"></div>');
  toDoLeft.appendTo(container);
  let tickButton = $('<div class="tick-button"></div>');
  tickButton.appendTo(toDoLeft);
  let toDoMain = $('<div class="to-do-main"></div>');
  toDoMain.appendTo(toDoLeft);

  let taskName = $(`<div class="task-name">${name}</div>`);
  taskName.appendTo(toDoMain);
  let proAttr = $(`<div class="project-attributes"></div>`);
  proAttr.appendTo(toDoMain);
  let proName = $(`<div class="project-name">${project}</div>`);
  proName.appendTo(proAttr);
  let proDeadline = $(`<div class="deadline">${deadline}</div>`);
  proDeadline.appendTo(proAttr);
  let proPriority = $('<div class="priority"></div>');
  proPriority.appendTo(proAttr);

  if (priority === 'high') {
    $(proPriority).css('backgroundColor', '#de350b');
  } else if (priority === 'medium') {
    $(proPriority).css('backgroundColor', '#ffc400');
  } else {
    $(proPriority).css('backgroundColor', '#006644');
  }

  let toDoButtons = $('<div class="to-do-buttons"></div>');
  toDoButtons.appendTo(container);
  /* let editIcon = $('<img src="images/edit-icon.svg" />');
  editIcon.appendTo(toDoButtons); */
  let closeIcon = $(
    '<img src="images/close-icon.svg" class="task-delete-button" />'
  );
  closeIcon.appendTo(toDoButtons);

  container.attr('data-id', `${id}`);
}

export default createTaskDOM;
