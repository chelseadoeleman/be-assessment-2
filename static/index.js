var deleteUserButton = (function () {
  var button = document.getElementById('remove')
  var baseUrl = 'http://localhost:1902'

  if (button) {
    var hrefAttribute = button.getAttribute('href')
    // When button is clicked execute the following function
    button.addEventListener('click', function() {
      // Method DELETE and url, which will be saved in a string
      // baseUrl and hrefAttribute (which contains user id) will be stored
      fetch(baseUrl + hrefAttribute, {method: "DELETE"})
        // When resolved then execute this function
        .then(function(data) {
          console.log(data)
        })
        // When rejected catch gives an error
        .catch(function(error) {
          console.log(error)
        })
    })
  }
})()
