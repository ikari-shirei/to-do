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
  let todoProjectName = $('.project-name');

  let projectsContainer = $('#projectList');
  let addProjectButton = $('#addProjectButton');
  let projectInput = $('#pName');
  let allTasksButton = $('.all-tasks');

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

  renderTasks(allTasks);

  /* 
  projects[0].tasks.push(taskFactory('Name', 'Prooro', 'hii', 'high')); */

  (function addNewTask() {
    addTaskButton.on('click', () => {
      let taskName = prompt('Task NAae');
      let taskHeaderId = taskHeader.attr('data-id');
      let targetProj;
      let projectName;
      let deadline = prompt('Deadline');
      let priority = prompt('Priority ("High", "Medium", "Low")');
      let id = Date.now().toString();

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
        console.log(targetProj);
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
        //push all tasks too
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
        console.log(targetProj[0].tasks);
      }

      if (taskHeader.attr('data-id') === '1') {
        renderTasks(allTasks);
      } else {
        renderTasks(targetProj[0].tasks);
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
            renderTasks(targetTasksArray);
            console.log(targetTasksArray);
          }
          console.log(targetTasksArray);
        }

        if (taskHeader.attr('data-id') === '1') {
          renderTasks(allTasks);
        }
      }
    });
  })();

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

  (function renderAllTasks() {
    allTasksButton.on('click', () => {
      renderTasks(allTasks);
    });
  })();
})();
