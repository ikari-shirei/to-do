import createTaskDOM from '/src/modules/task-create-DOM.js';
let $ = require('jquery');

(function projectsAndTasks() {
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

  let allTasks = [];

  let addTaskButton = $('#addTask');
  let toDoSection = $('.to-do-section');
  let taskHeader = $('#taskHeader');

  let projectsContainer = $('#projectList');
  let addProjectButton = $('#addProjectButton');
  let projectInput = $('#pName');
  let allTasksButton = $('all-tasks');

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

  //Tasks

  function taskFactory(name, project, deadline, priority, id) {
    return { name, project, deadline, priority, id };
  }

  function renderTasks(project) {
    clearElements(toDoSection);
    project.forEach((task) => {
      createTaskDOM(
        task.name,
        task.project,
        task.deadline,
        task.priority,
        task.id
      );
    });
  }

  function clearElements(container) {
    if (container.children()) {
      container.children().remove();
    }
  }

  function addNewTask() {
    addTaskButton.on('click', () => {
      let taskName = prompt('Task NAme');
      /*  let projectName = prompt('Project Name'); */
      let deadline = prompt('Deadline');
      let priority = prompt('Priority ("High", "Medium", "Low")');
      let id = Date.now().toString();
    });
  }

  addNewTask();

  function removeTask() {
    toDoSection.on('click', (e) => {
      if ($(e.target).hasClass('task-delete-button')) {
        let target = $(e.target);
        let targetId = target.parent().parent().attr('data-id');
        let targetDiv = allTasks.filter((x) => {
          return x.id === targetId;
        });
        let index = allTasks.indexOf(targetDiv[0]);
        allTasks.splice(index, 1);

        renderTasks(allTasks);
      }
    });
  }
  removeTask();

  (function activeProject() {
    allTasksButton.on('click', () => {
      taskHeader.attr('data-id', '1');
      renderTasks(allTasks);
    });
    projectsContainer.on('click', '.project-div-e1', (e) => {
      let targetDataId = $(e.target).parent().attr('data-id');
      taskHeader.attr('data-id', `${targetDataId}`);
      let targetProject = projects.filter((x) => {
        return x.id === targetDataId;
      });
      let targetTasks = targetProject[0].tasks;

      renderTasks(targetTasks);
    });
  })();

  /* 
  projects[1]['tasks'].push(
    taskFactory('Hola', 'Amigo', 'Deadline', 'low', 93)
  );

  function getProjectTasks() {
    renderTasks(projects[1]['tasks']);
  }
  getProjectTasks(); */
})();
