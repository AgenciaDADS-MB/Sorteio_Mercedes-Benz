class Validator {
  constructor() {
    this.validations = [
      'data-min-length',
      'data-max-length',
      'data-only-letters',
      'data-email-validate',
      'data-required',
      'data-equal',
      'data-password-validate',
    ]
  }

  validate(form) {
    let currentValidations = document.querySelectorAll('form .error-validation');
    if(currentValidations.length) {
      this.cleanValidations(currentValidations);
    }
    let inputs = form.getElementsByTagName('input');
    let inputsArray = [...inputs];
    inputsArray.forEach(function(input, obj) {
      for(let i = 0; this.validations.length > i; i++) {
        if(input.getAttribute(this.validations[i]) != null) {
          let method = this.validations[i].replace("data-", "").replace("-", "");
          let value = input.getAttribute(this.validations[i])
          this[method](input,value);
        }
      }
    }, this);
  }

  minlength(input, minValue) {
    let inputLength = input.value.length;
    let errorMessage = `O campo precisa ter pelo menos ${minValue} caracteres`;
    if(inputLength < minValue) {
      this.printMessage(input, errorMessage);
    }
  }

  maxlength(input, maxValue) {
    let inputLength = input.value.length;
    let errorMessage = `O campo precisa ter menos que ${maxValue} caracteres`;
    if(inputLength > maxValue) {
      this.printMessage(input, errorMessage);
    }
  }

  onlyletters(input) {
    let re = /^[A-Za-z]+$/;;
    let inputValue = input.value;
    let errorMessage = `Este campo não aceita números nem caracteres especiais`;
    if(!re.test(inputValue)) {
      this.printMessage(input, errorMessage);
    }
  }

  emailvalidate(input) {
    let re = /\S+@\S+\.\S+/;
    let email = input.value;
    let errorMessage = `Insira um e-mail no padrão example@outlook.com`;
    if(!re.test(email)) {
      this.printMessage(input, errorMessage);
    }
  }

  equal(input, inputName) {
    let inputToCompare = document.getElementsByName(inputName)[0];
    let errorMessage = `Este campo precisa estar igual ao ${inputName}`;
    if(input.value != inputToCompare.value) {
      this.printMessage(input, errorMessage);
    }
  }

  required(input) {
  let inputValue = input.value;
    if(inputValue === '') {
      let errorMessage = `Este campo é obrigatório`;
      this.printMessage(input, errorMessage);
    }
  }

  passwordvalidate(input) {
    let charArr = input.value.split("");
    let uppercases = 0;
    let numbers = 0;
    for(let i = 0; charArr.length > i; i++) {
      if(charArr[i] === charArr[i].toUpperCase() && isNaN(parseInt(charArr[i]))) {
        uppercases++;
      } else if(!isNaN(parseInt(charArr[i]))) {
        numbers++;
      }
    }
    if(uppercases === 0 || numbers === 0) {
      let errorMessage = `A senha precisa um caractere maiúsculo e um número`;

      this.printMessage(input, errorMessage);
    }
  }

  printMessage(input, msg) {
      let errorsQty = input.parentNode.querySelector('.error-validation');
      if(errorsQty === null) {
        let template = document.querySelector('.error-validation').cloneNode(true);
        template.textContent = msg;
        let inputParent = input.parentNode;
        template.classList.remove('template');
        inputParent.appendChild(template);
      }
    }
      cleanValidations(validations) {
        validations.forEach(el => el.remove());
      }
    }
    let form = document.getElementById('register-form');    
form.addEventListener('submit', function(event) {
  event.preventDefault();
  setTimeout(()=> {
    document.getElementById('btn-submit').setAttribute('disabled', true)
  }, 0001)
      

  // Coletar os dados do formulário
  let formData = new FormData(form);
  let formDetail = Object.fromEntries(formData)
  let email = formDetail.email
  // Enviar os dados para o back4app usando uma solicitação HTTP POST
  var teste = fetch('https://parseapi.back4app.com/classes/Person', {
      method: 'GET',
    headers: {
      'X-Parse-Application-Id': 'YX1d8JAZy0FLhG22LfaS7gpibFwDOxTgAlpZcM2J',
      'X-Parse-REST-API-Key': 'EXeHValff9JzcDdNNqE0ToicNT11fccveKXF4bOW',
      'Content-Type': 'application/json'
    }
  })  
  .then(response => response.text())
  .then(result => {
    setTimeout(()=>{
      var resultado = JSON.parse(result)
      var resultadoArr = resultado.results
      var existe;
      resultadoArr.forEach((res) => {
        if (res.email == email){
          existe = true
        }else{
          existe = false
        }
      })
      if(existe == false || resultadoArr.length == 0){
        fetch('https://parseapi.back4app.com/classes/Person', {
          method: 'POST',
        headers: {
          'X-Parse-Application-Id': 'YX1d8JAZy0FLhG22LfaS7gpibFwDOxTgAlpZcM2J',
          'X-Parse-REST-API-Key': 'EXeHValff9JzcDdNNqE0ToicNT11fccveKXF4bOW',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
      })  
      .then(resposta => resposta.text())
      .then(fetch('https://parseapi.back4app.com/classes/Person', {
        method: 'GET',
      headers: {
        'X-Parse-Application-Id': 'YX1d8JAZy0FLhG22LfaS7gpibFwDOxTgAlpZcM2J',
        'X-Parse-REST-API-Key': 'EXeHValff9JzcDdNNqE0ToicNT11fccveKXF4bOW',
        'Content-Type': 'application/json'
      }
    })  
    .then(resposta => resposta.text())
    .then(result => {
      setTimeout(()=> {
        var number
        var resultado = JSON.parse(result)
        var resultadoArr = resultado.results
        resultadoArr.forEach((res) => {
          if (res.email == email){
            number = res.number
          }else{
            existe = false
          }
        })
        var texto = document.createTextNode(JSON.stringify(number))
        document.getElementById('numero-sorteado').classList.remove('sorteado');
      document.getElementById('numero-sorteado').appendChild(texto)
              texto.style.fontSize = '30px';

      }, 1000) 
    })
    .catch(error => console.error(error)))
    .catch(error => console.error(error))
    }
    }, 0200)
})

  // Adicione este código JavaScript ao seu arquivo JavaScript
let btnSubmit = document.getElementById('btn-submit');
btnSubmit.addEventListener('click', function() {
  btnSubmit.classList.add('scale');
  setTimeout(function() {
    btnSubmit.classList.remove('scale');
  }, 500);
  document.getElementById("btn-submit").addEventListener("click", function(event){
  event.target.disabled = true;
    Parse.Cloud.run('Person', {}).then(response => {
  const randomNumber = response.number;
  
  // Exiba o número gerado na tela para o cliente
  console.log('Número gerado:', randomNumber);
}).catch(error => {
  console.error('Erro ao chamar a função de nuvem:', error);
});
});
});
});
