import createTaskDOM from '/src/modules/task-create-DOM.js';
let $ = require('jquery');

(function projectsAndTasks() {
  const LOCAL_STORAGE_PROJECT_KEY = 'task.projects';

  let projects =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];

  function saveToStorage() {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects));
  }

  // Project add - remove

  function projectFactory(name, id, tasks) {
    return { name, id, tasks };
  }

  const LOCAL_STORAGE_ALL_TASKS_KEY = 'task.allTasks';

  let allTasks =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALL_TASKS_KEY)) || [];

  function saveToStorageTasks() {
    localStorage.setItem(LOCAL_STORAGE_ALL_TASKS_KEY, JSON.stringify(allTasks));
  }

  let projectsContainer = $('#projectList');
  let addProjectButton = $('#addProjectButton');
  let projectInput = $('#pName');
  let allTasksButton = $('.all-tasks');

  let addTaskButton = $('#addTask');
  let toDoSection = $('.to-do-section');
  let taskHeader = $('#taskHeader');
  let toDoForm = $('.to-do-form');
  toDoForm.hide();
  let toDoFormButton = $('#to-do-form-submit');

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
      if (projectInput.val() === 'Tasks') {
        alert(`You can't use "Tasks" as a project name.`);
        projectInput.val('');
      } else if (projectInput.val()) {
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

  function renderAndSaveTasks(project) {
    saveToStorageTasks();
    saveToStorage();
    renderTasks(project);
  }

  renderAndSaveTasks(allTasks);

  (function openTaskFormButton() {
    addTaskButton.on('click', () => {
      toDoForm.show();
      $('#TDFtName').trigger('focus');
    });
  })();

  (function closeTaskFormButton() {
    $('.tdf-close-button').on('click', () => {
      toDoForm.hide();
      toDoFormReset();
    });
  })();

  function toDoFormReset() {
    $('#TDFtName').val('');
    $('#TDFdName').val('');
    /*  $('input[name="radio-priority"]').prop('checked', false); */
    $('#low[name="radio-priority"]').prop('checked', true);
    toDoForm.hide();
  }
  toDoFormReset();

  function toDoFormBehavior() {
    toDoForm.on('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        toDoFormButton.trigger('click');
      }
    });
  }
  toDoFormBehavior();

  (function addNewTask() {
    //Form
    toDoFormButton.on('click', () => {
      let taskName = $('#TDFtName').val();
      let taskHeaderId = taskHeader.attr('data-id');
      let targetProj;
      let projectName;
      let deadline = $('#TDFdName').val();
      let priority = $('input[name="radio-priority"]:checked')
        .val()
        .toLowerCase();
      let id = Date.now().toString();

      toDoFormReset();

      if (taskHeader.attr('data-id') === '1') {
        targetProj = allTasks;
        projectName = 'Tasks';
        allTasks.push(
          taskFactory(
            `${taskName}`,
            `${projectName}`,
            `${deadline}`,
            `${priority}`,
            `${id}`
          )
        );
      } else {
        projectName = taskHeader.text();
        targetProj = projects.filter((x) => {
          return x.id === taskHeaderId;
        });
        targetProj[0].tasks.push(
          taskFactory(
            `${taskName}`,
            `${projectName}`,
            `${deadline}`,
            `${priority}`,
            `${id}`
          )
        );
        // Push them tasks section too
        allTasks.push(
          taskFactory(
            `${taskName}`,
            `${projectName}`,
            `${deadline}`,
            `${priority}`,
            `${id}`
          )
        );
        projectName = taskHeader.text();
      }

      if (taskHeader.attr('data-id') === '1') {
        renderAndSaveTasks(allTasks);
      } else {
        renderAndSaveTasks(targetProj[0].tasks);
      }
    });
  })();

  (function removeTask() {
    // When removing all tasks remove from project also
    toDoSection.on('click', (e) => {
      if ($(e.target).hasClass('task-delete-button')) {
        //remove from all tasks
        let targetId = $(e.target).parent().parent().attr('data-id');
        let targetDiv = allTasks.filter((x) => {
          return x.id === targetId;
        });
        let index = allTasks.indexOf(targetDiv[0]);
        allTasks.splice(index, 1);

        //remove from projects
        if (
          !(taskHeader.attr('data-id') === '1') ||
          !(targetDiv[0].project === 'Tasks')
        ) {
          let targetProject = projects.filter((project) => {
            for (let i = 0; i < project.tasks.length; i++) {
              if (project.tasks[i].id === targetId) return project;
            }
          });
          let targetTasksArray = targetProject[0].tasks;

          let targetTask = targetTasksArray.filter((task) => {
            if (task.id === targetId) return task;
          });
          let indexOfTask = targetTasksArray.indexOf(targetTask[0]);
          targetTasksArray.splice(indexOfTask, 1);
          if (!(taskHeader.attr('data-id') === '1')) {
            renderAndSaveTasks(targetTasksArray);
          }
        }

        if (taskHeader.attr('data-id') === '1') {
          renderAndSaveTasks(allTasks);
        }
      }
    });
  })();

  (function activeProject() {
    allTasksButton.on('click', () => {
      taskHeader.attr('data-id', '1');
      renderAndSaveTasks(allTasks);
    });
    projectsContainer.on('click', '.project-div-e1', (e) => {
      let targetDataId = $(e.target).parent().attr('data-id');
      taskHeader.attr('data-id', `${targetDataId}`);
      let targetProject = projects.filter((x) => {
        return x.id === targetDataId;
      });
      let targetTasks = targetProject[0].tasks;

      renderAndSaveTasks(targetTasks);
    });
  })();

  (function renderAllTasks() {
    allTasksButton.on('click', () => {
      renderAndSaveTasks(allTasks);
    });
  })();

  (function taskBehavior() {
    // Also need to remove task
    toDoSection.on('click', (e) => {
      if ($(e.target).hasClass('tick-button')) {
        $(e.target).toggleClass('task-completed-tick');
        $(e.target)
          .parent()
          .parent()
          .toggleClass('task-completed-line-through');
      }
    });
  })();
})();
