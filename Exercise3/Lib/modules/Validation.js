exports.Check = function (type, value){
  var patt;
  if(type=="login"){
    patt = /^[a-z][a-z0-9]*?([-_][a-z0-9]+){0,2}$/i;
    if(value.length>3 && patt.test(value)) return true;
  }
  if(type=="pass"){
    patt = /^[a-zA-Z0-9]+$/;
    if(value.length>3 && patt.test(value)) return true;
  }
  if(type=="name"){
    /*FIX IT*/
    return true;
    /*patt = /^[а-яА-ЯёЁa-zA-Z0-9]+$/;
     if(value.length>3 && value.length<51 && patt.test(value)) return true;*/
  }
  if(type=="role"){
    patt = /^[0-9]+$/;
    if(value.length==1) if(patt.test(value)) return true;
  }
  return false;
};

exports.WrongValueMessage = function(type){
  if(type=="login") return "Недопустимый логин. Логин должен "+
      "содержать не менее 4х символов и начинаться с буквы " +
      "латинского алфавита, заканчиваться буквой/цифрой. " +
      "Может состоять из цифр и латинские букв, " +
      "а также не более двух, не идущих подряд символов '-' и '_'.";

  if(type=="pass") return "Недопустимый пароль. Пароль должен содержать не менее " +
      "4х символов, состоять только из цифр и латинских букв.";

  if(type=="name") return "Недопустимое имя. Имя должно содержать не менее 3 и " +
      "не более 50 символов. Состоять из букв и цифр.";

  return "Недопустимое значение";
};

exports.GetRoleFromCode = function (id){
  if(id==0) return "Администратор";
  if(id==1) return "Исполнитель";
  if(id==2) return "Клиент";
};
