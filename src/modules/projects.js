// This should be lists but since I used project keyword everywhere...

(function projectModule() {
  let $ = require('jquery');

  const LOCAL_STORAGE_PROJECT_KEY = 'task.projects';

  let projects =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];

  // Local storage section

  function saveToStorage() {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects));
  }

  // Project add - remove
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
      container.children().remove();
    }
  }

  // Append projects and save to local storage
  function saveAndRender() {
    saveToStorage();
    renderProjects();
  }

  saveAndRender();

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
      saveAndRender();
    });
  })();

  (function removeProject() {
    projectsContainer.on('click', '.project-div-e2', (e) => {
      if (confirm('Do you want to delete this project?')) {
        let projectDeleteButton = $(e.target);
        let targetId = projectDeleteButton.parent().attr('data-id');
        let target = projects.filter((x) => {
          return x.id === targetId;
        });
        let index = projects.indexOf(target[0]);
        projects.splice(index, 1);
        saveAndRender();
      } else {
        return;
      }
    });
  })();

  (function formBehavior() {
    projectInput.on('keypress', (e) => {
      if (e.key === 'Enter') {
        addProjectButton.trigger('click');
      }
    });
  })();
})();
