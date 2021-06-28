// This should be lists but since I used project keyword everywhere...

(function projectModule() {
  let $ = require('jquery');

  let projects = [];

  function projectFactory(name, id, tasks) {
    return { name, id, tasks };
  }

  let projectsContainer = $('#projectList');
  let addProjectButton = $('#addProjectButton');
  let projectInput = $('#pName');

  function renderProjects() {
    clearElements(projectsContainer);
    if (projects.length > 0) {
      projects.forEach((project) => {
        projectsContainer.append(
          `<div class="project-div" data-id="${project.id}">
          <div class="project-div-e1">${project.name}</div>
          <img class="project-div-e2" src="/dist/images/close-icon.svg" />
          </div>`
        );
      });
    }
  }

  function clearElements(container) {
    if (container.children()) {
      projectsContainer.children().remove();
    }
  }

  (function addNewProject() {
    addProjectButton.on('click', () => {
      if (projectInput.val()) {
        projects.push(
          projectFactory(projectInput.val(), Date.now().toString(), [])
        );
        projectInput.val('');
        projectInput.removeAttr('placeholder');
      } else {
        projectInput.attr('placeholder', 'You need to enter a value.');
      }
      renderProjects();
    });
  })();

  (function removeProject() {
    projectsContainer.on('click', '.project-div-e2', (e) => {
      let projectDeleteButton = $(e.target);
      let targetId = projectDeleteButton.parent().attr('data-id');
      let target = projects.filter((x) => {
        return x.id === targetId;
      });
      let index = projects.indexOf(target[0]);
      projects.splice(index, 1);
      renderProjects();
    });
  })();

  (function formBehavior() {
    projectInput.on('keypress', (e) => {
      // refactor required
      if (e.keyCode === 13) {
        addProjectButton.trigger('click');
      }
    });
  })();
})();
