(function() {

  'use strict';

  var login = (function() {
    return {
      init: function init() {
        this.initEvents();
      },

      initEvents: function initEvents() {
        var frm = document.getElementById("frmLogin");
        frm.addEventListener('submit', login.handleSubmit, false);
      },

      handleSubmit: function handleSubmit(event) {
        event.preventDefault();

        var user = document.getElementById("username");
        var pwd = document.getElementById("password");

        var dados = {
        	email: user.value,
        	senha: pwd.value
        }
        
        var user = JSON.stringify(dados);
        var ajax = login.createAjaxRequest('POST', login.saveCredentialAndLogIn);
        ajax.send(user);
      },
      
      createAjaxRequest: function createAjaxRequest(method, callback) { 
    	  var ajax = new XMLHttpRequest();
    	  var url = 'http://localhost:8080/login';
          ajax.open(method, url, true);
          ajax.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
          ajax.addEventListener('readystatechange', callback, false);
          return ajax;
      },
      
      saveCredentialAndLogIn: function saveCredentialAndLogIn() {
    	  if (!login.isReady.call(this)) return;
    	  var headers = this.getAllResponseHeaders();
    	  
          var head = headers.split("\n")
				            .map(x=>x.split(/: */,2))
				            .filter(x=>x[0])
				            .reduce((ac, x)=>{ac[x[0]] = x[1];return ac;}, {});

          var token = head["authorization"];
          localStorage.removeItem('token');
          localStorage.setItem('token',token);
          
          window.location.replace('./index.html');
      },
      
      isReady: function isReady() {
    	  console.log('http status: ',this.status);
          return this.readyState === 4 && this.status === 200;
      }
      
    }
  })();

  login.init();

})();
