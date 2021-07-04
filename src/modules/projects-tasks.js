import createTaskDOM from '/src/modules/task-create-DOM.js';
let $ = require('jquery');

(function projectsAndTasks() {
  // Project variables
  let projectsContainer = $('#projectList');
  let addProjectButton = $('#addProjectButton');
  let projectInput = $('#pName');
  let allTasksButton = $('.all-tasks');
  let menuButton = $('.hamburger-menu');

  // Task variables
  let addTaskButton = $('#addTask');
  let toDoSection = $('.to-do-section');
  let taskHeader = $('#taskHeader');
  let toDoForm = $('.to-do-form');
  toDoForm.hide();
  let toDoFormButton = $('#to-do-form-submit');

  // Projects local storage
  const LOCAL_STORAGE_PROJECT_KEY = 'task.projects';

  let projects =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];

  function saveToStorage() {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects));
  }

  // All taskslocal storage
  const LOCAL_STORAGE_ALL_TASKS_KEY = 'task.allTasks';

  let allTasks =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALL_TASKS_KEY)) || [];

  function saveToStorageTasks() {
    localStorage.setItem(LOCAL_STORAGE_ALL_TASKS_KEY, JSON.stringify(allTasks));
  }

  // Projects
  function projectFactory(name, id, tasks) {
    return { name, id, tasks };
  }

  // Display project array
  function renderProjects() {
    clearElements(projectsContainer);
    if (projects.length > 0) {
      projects.forEach((project) => {
        projectsContainer.append(
          `<div class="project-div" data-id="${project.id}">
          <div class="project-div-e1">${project.name}</div>
          <img class="project-div-e2" src="./images/close-icon.svg" />
          </div>`
        );
      });
    }
  }

  // Clear current projects from display
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

  // Add project when enter is pressed
  (function formBehavior() {
    projectInput.on('keypress', (e) => {
      if (e.key === 'Enter') {
        addProjectButton.trigger('click');
      }
    });
  })();

  // Tasks
  function taskFactory(name, project, deadline, priority, id) {
    return { name, project, deadline, priority, id };
  }

  // Append selected tasks
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

  // Clear current tasks from display
  function clearElements(container) {
    if (container.children()) {
      container.children().remove();
    }
  }

  // Append current tasks and save to local storage
  function renderAndSaveTasks(project) {
    saveToStorageTasks();
    saveToStorage();
    renderTasks(project);
  }

  renderAndSaveTasks(allTasks);

  // Open task adding form
  (function openTaskFormButton() {
    addTaskButton.on('click', () => {
      toDoForm.show();
      $('#TDFtName').trigger('focus');
    });
  })();

  // Close task adding form
  (function closeTaskFormButton() {
    $('.tdf-close-button').on('click', () => {
      toDoForm.hide();
      toDoFormReset();
    });
    menuButton.on('click', () => {
      toDoForm.hide();
      toDoFormReset();
    });
  })();

  // Clear current values of task adding form
  function toDoFormReset() {
    $('#TDFtName').val('');
    $('#TDFdName').val('');
    /*  $('input[name="radio-priority"]').prop('checked', false); */
    $('#low[name="radio-priority"]').prop('checked', true);
    toDoForm.hide();
  }
  toDoFormReset();

  // Trigger task adding when enter is pressed
  (function toDoFormBehavior() {
    toDoForm.on('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        toDoFormButton.trigger('click');
      }
    });
  })();

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

  // Append selected project's tasks
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

  // Tick button clicked
  (function taskBehavior() {
    toDoSection.on('click', (e) => {
      if ($(e.target).hasClass('tick-button')) {
        $(e.target).toggleClass('task-completed-tick');
        $(e.target)
          .parent()
          .parent()
          .toggleClass('task-completed-line-through');
      }
    });

    //Remove Task
    toDoSection.on('click', (e) => {
      if ($(e.target).hasClass('tick-button')) {
        $(e.target)
          .parent()
          .parent()
          .delay(900)
          .fadeOut(1500, () => {
            $(e.target)
              .parent()
              .parent()
              .find('.task-delete-button')
              .trigger('click');
          });
      }
    });
  })();
})();
