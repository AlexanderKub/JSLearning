exports.LocalDateTime = function (addDay){
  var str="";
  addDay = addDay || false;
  var d=new Date();
  if(addDay)d.setDate(d.getDate() + addDay);
  str=d.getFullYear() + "-" + (d.getMonth() + 1).toString().lpad("0", 2) +
    "-" + d.getDate().toString().lpad("0", 2)+"T"+
    d.getHours().toString().lpad("0", 2)+
    ":"+d.getMinutes().toString().lpad("0", 2);
  return str;
};

exports.dateFormat1 = function (date) {
  date = new Date(date);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().replace(/\..*$/, "");
};

String.prototype.lpad = function(padString, length) {
  var str = this;
  while (str.length < length) str = padString + str;
  return str;
};