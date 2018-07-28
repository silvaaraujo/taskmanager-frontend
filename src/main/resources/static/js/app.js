(function() {

  'use strict';

  var app = (function() {
	  
    return {
      init: function init() {
    	  if (!this.hasToken()) this.logout();
    	  this.initEvents();
    	  this.getLoadTasks();
      },

      initEvents: function initEvents() {
    	  var btnGravar = document.getElementById("btnGravar");
    	  btnGravar.addEventListener('click', app.gravar, false);
		
    	  var btnNovo = document.getElementById("btnNovaTask");
    	  btnNovo.addEventListener('click', app.newTask, false);
    	  
    	  var btnLogout = document.getElementById("btnLogout");
    	  btnLogout.addEventListener('click', app.logout, false);
		
    	  $('#taskModal').on('shown.bs.modal', function () {
    		  $('#cadTitulo').focus()
    	  });
    	  
    	  
      },
      
      getLoadTasks: function getLoadTasks() {
    	  var ajax = app.createAjaxRequest('GET', null, app.loadTasks);
    	  ajax.send();
      },

      loadTasks: function loadTasks() {
    	  if (!app.isReady.call(this)) return;
    	  var dados = JSON.parse(this.responseText);
    	  var tabela = document.getElementById("tblTasks");

    	  for (var i=0; i<dados.length; i++) {
    		  tabela.appendChild(app.createTask(dados[i]));
    	  }
      },
      
      createRemoveButton: function(task) {
    	  var removeButton = document.createElement("button");
    	  removeButton.setAttribute('class', 'btn btn-danger btn-sm');
    	  removeButton.setAttribute('style', 'margin-right: 5px; margin-bottom: 5px;');
    	  removeButton.id = 'btnDel' + task.id;
		  
    	  var icon = document.createElement("span");
	      icon.className ="glyphicon glyphicon-trash";
	      removeButton.appendChild(icon);	      
	      removeButton.addEventListener('click', app.remover, false);
    	  
	      return removeButton;
      },
      
      createEditButton: function(task) {
    	  var editButton = document.createElement("button");
    	  editButton.setAttribute('class', 'btn btn-warning btn-sm');
    	  editButton.setAttribute('style', task.status === 'PENDENTE' ? 'margin-right: 5px; margin-bottom: 5px;' : 'display:none;');
    	  editButton.setAttribute('data-toggle', 'modal');
    	  editButton.setAttribute('data-target', '#taskModal');
    	  editButton.id = 'btnEdt' + task.id;

    	  var icon = document.createElement("span");
    	  icon.className ="glyphicon glyphicon-pencil";
    	  editButton.appendChild(icon);	      
    	  editButton.addEventListener('click', app.editar, false);
    	  
    	  return editButton;
      },
      
      createConcludeButton: function(task) {
    	  var concludeButton = document.createElement("button");
    	  concludeButton.setAttribute('class', 'btn btn-success btn-sm');
    	  concludeButton.setAttribute('style', task.status === 'PENDENTE' ? 'margin-right: 5px; margin-bottom: 5px;' : 'display:none;');
    	  concludeButton.id = 'btnFin' + task.id;
    	  
    	  var icon = document.createElement("span");
    	  icon.className ="glyphicon glyphicon-check";
    	  concludeButton.appendChild(icon);	      
    	  concludeButton.addEventListener('click', app.concluir, false);
    	  
    	  return concludeButton;
      },
      
      createViewButton: function(task) {
    	  var viewButton = document.createElement("button");
    	  viewButton.setAttribute('class', 'btn btn-info btn-sm');
    	  viewButton.setAttribute('style', 'margin-right: 5px; margin-bottom: 5px;');
    	  viewButton.setAttribute('data-toggle', 'modal');
    	  viewButton.setAttribute('data-target', '#taskModal');
    	  viewButton.id = 'btnFin' + task.id;
    	  
    	  var icon = document.createElement("span");
    	  icon.className ="glyphicon glyphicon-zoom-in";
    	  viewButton.appendChild(icon);
    	  viewButton.addEventListener('click', app.visualizar, false);
    	  
    	  return viewButton;
      },

      createTask: function createTask(data) {
        var $fragment = document.createDocumentFragment();
        var $tr = document.createElement('tr');

        var $tdAcao = document.createElement('td');
        var $container = document.createElement('div');        
        $container.id = 'container';
        
        var $btnRemover = app.createRemoveButton(data);
        $container.appendChild($btnRemover);
        
        var $btnEditar = app.createEditButton(data);
        $container.appendChild($btnEditar);
        
        var $btnConcluir = app.createConcludeButton(data);
        $container.appendChild($btnConcluir);
        
        var $btnVisualizar = app.createViewButton(data);
        $container.appendChild($btnVisualizar);
        
        $tdAcao.appendChild($container);
        
        var $tdId = document.createElement('td');
        var $tdTitulo = document.createElement('td');
        var $tdDataCriacao = document.createElement('td');
        var $tdStatus = document.createElement('td');
                
        $tdId.textContent = `${data.id}`;
        $tdTitulo.textContent = `${data.titulo}`;
        $tdDataCriacao.textContent = `${data.dataCriacao}`;
        $tdStatus.textContent = `${data.status}`;

        $tr.appendChild($tdAcao);
        $tr.appendChild($tdId);
        $tr.appendChild($tdTitulo);
        $tr.appendChild($tdDataCriacao);
        $tr.appendChild($tdStatus);

        return $fragment.appendChild($tr);
      },

      isReady: function isReady() {
    	console.log('http status: ',this.status);
        return this.readyState === 4 && (this.status === 200 || this.status === 201 || this.status === 204);
      },

      createAjaxRequest: function createAjaxRequest(method, id, callback) { 
    	  var ajax = new XMLHttpRequest();
    	  var url = 'http://localhost:8080/tasks';
    	  if (id) url += '/'+id;
          ajax.open(method, url, true);
          ajax.setRequestHeader('Content-Type', 'application/json');
          ajax.setRequestHeader ("Authorization", app.getToken());
          ajax.addEventListener('readystatechange', callback, false);
          return ajax;
      },
      
      gravar: function gravar(event) {
        event.preventDefault();
        
        var hiddenId = document.getElementById('mdlTaskId');
        var txtTitulo = document.getElementById('cadTitulo');
        var txtDescricao = document.getElementById('cadDescricao');

        var task = {
        	titulo: txtTitulo.value,
        	descricao: txtDescricao.value
        }

        console.log('hiddenId: ', hiddenId.value);
        task.id = hiddenId.value;
        
        if (!app.isValidTask(task)) {
        	alert.error('O título deve possuir entre 5 e 20 caracteres.');
        	return;
        }
        
        //alert.success('Salvo com sucesso');
        app.isNullOrEmpty(task.id) ? app.gravarNovo(task) : app.alterar(task);
      },
      
      gravarNovo: function gravarNovo(task) {
        var dados = JSON.stringify(task);
        var ajax = app.createAjaxRequest('POST', null, app.reload('success','Task criada com sucesso.'));
        ajax.send(dados);
      },

      alterar: function alterar(task) {
    	  var dados = JSON.stringify(task);
          var ajax = app.createAjaxRequest('PUT', task.id, app.reload('success','Task alterada com sucesso.'));
          ajax.send(dados);
      },
      
      remover: function remover() {
    	  var taskId = this.id.substring(6);
    	  var ajax = app.createAjaxRequest('DELETE', taskId, app.reload('success','Task removida com sucesso.'));
          ajax.send();
      },
      
      concluir: function concluir() {
    	  var taskId = this.id.substring(6);
    	  var ajax = app.createAjaxRequest('PATCH', taskId, app.reload('success','Task concluída com sucesso.'));
          ajax.send();
      },
      
      newTask: function newTask() {
    	  //setando propriedades da modal
    	  $('#taskModal .modal-title').html('Cadastro de Task');
    	  $('#taskModal button[type=submit]').html('Inserir Task');
    	  $('#taskModal #btnGravar').css('display','inline');
    	  
    	//setando os dados da edicao
    	  $('#taskModal #mdlTaskId').val(null);
    	  $('#taskModal #cadTitulo').val('').prop('disabled', false);
    	  $('#taskModal #cadDescricao').val('').prop('disabled', false);
      },
      
      editar: function editar() {
    	  var taskId = this.id.substring(6);
    	  
    	  //setando propriedades da modal
    	  $('#taskModal .modal-title').html('Editar Task');
    	  $('#taskModal button[type=submit]').html('Editar Task');
    	  $('#taskModal #btnGravar').css('display','inline');
    	  
    	  //buscando a task
    	  app.getTask(taskId, app.loadTaskEdit);
      },
      
      visualizar: function visualizar() {
    	  var taskId = this.id.substring(6);
    	  
    	  //setando propriedades da modal
    	  $('#taskModal .modal-title').html('Visualizar Task');
    	  $('#taskModal #btnGravar').css('display','none');
    	  
    	  //buscando a task
    	  app.getTask(taskId, app.loadTaskVisualization);
      },

      getTask: function getTask(taskId, callback) {
    	  var ajax = app.createAjaxRequest('GET', taskId, callback);
	      ajax.send();
	  },
	  
	  loadTaskEdit: function loadTask() {
		  if (!app.isReady.call(this)) return;
	      var task = JSON.parse(this.responseText);
	      
	      //setando os dados
    	  $('#taskModal #mdlTaskId').val(task.id);
    	  $('#taskModal #cadTitulo').val(task.titulo).prop('disabled', false);
    	  $('#taskModal #cadDescricao').val(task.descricao).prop('disabled', false);
	  },
	  
	  loadTaskVisualization: function loadTask() {
		  if (!app.isReady.call(this)) return;
	      var task = JSON.parse(this.responseText);
	      	      
	      //setando os dados
    	  $('#taskModal #mdlTaskId').val(task.id);
    	  $('#taskModal #cadTitulo').val(task.titulo).prop('disabled', true);
    	  $('#taskModal #cadDescricao').val(task.descricao).prop('disabled', true);
	  },
      
      reload: function reload(alertType, msg) {
    	  setTimeout(function() { 
    		  window.location.reload(true);
    	  }, 1000);
    	  alert[alertType](msg);
      },

      isNullOrEmpty: function isNullOrEmpty(value) {
    	  return value === null || value === undefined || value.length === 0;
      },
      
      isValidTask: function isValidTask(task) {
    	  return (task.titulo.length < 5 || task.titulo.length > 20) ? false : true;
      },
      
      hasToken: function hasToken() {
    	  return !app.isNullOrEmpty(app.getToken());
      },
      
      getToken: function getToken() {
    	  return localStorage.getItem('token');
      },
      
      logout: function logout() {
    	  localStorage.removeItem('token');
    	  window.location.replace('./login.html');
      }
      
    }
  })();

  app.init();

})();
