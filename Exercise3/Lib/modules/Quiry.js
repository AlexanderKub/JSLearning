module.exports = function(url,metod,Sdata) {
  return fetch("/api/"+url, {
    method: metod,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: (metod=="POST")?JSON.stringify(Sdata):null
  }).then(function(response) {
    return response.json();
  }).catch(function(err) {
    return ("Fetch Error :-S" + err);
  });
};