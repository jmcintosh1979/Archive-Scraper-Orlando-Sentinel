
$.getJSON("/api/articles", function(data) {
  for (let i = 0; i < data.length; i++) {
    $("#display-articles").append(
      `<ul data-id="${data[i]._id}">
          <li class="title">${data[i].title}</li>
          <li class="para">${data[i].para}</li>
          <li class="link">
            <a href="https://www.orlandosentinel.com${data[i].link}" class="btn btn-success" role="button">Read Article</a>
            <button class="btn btn-info" id="data-note">Make Note</button>
            <div id="notes"></div
          </li>
      </ul>`
    )
  }
})

$(document).on("click", "button", function() {
  $("#notes").empty();

  let thisNote = $(this).attr("data-id")

  $.ajax({
    method: "GET",
    url: "/api/articles/" + thisNote
  }).then(function(data) {
    console.log(data)
    $("#notes").append(`<input id="titleinput" name="title">`)
    $("#notes").append(`<textarea id="bodyinput" name="body"></textarea>`)
    $("#notes").append(`<button class="btn btn-info" data-id="${data._id}" id="savenote">Save Note</button>`)

    if (data.note) {
      $("#titleinput").val(data.note.title)
      $("#bodyinput").val(data.note.body)
    }
  })
})

$(document).on("click", "#savenote", function() {
  var thisNote = $(this).attr("data-id")

  $.ajax({
    method: "POST",
    url: `/api/articles/${thisNote}`,
    data: {
      title: $("#titleinput").val().trim(),
      body: $("#bodyinput").val().trim()
    }
  }).then(function(data) {
    $("#notes").empty()
  })
  $("#titleinput").val("");
  $("#bodyinput").val("")
})



// $(function() {

//   $("#scrape-articles").on("click", function(event) {
//     event.preventDefault()

//     console.log("I was clicked")
    
//     $.ajax("/scrape", {
//       type: "GET"
//     }).then(function(data) {
//       $
//     })
//   })

// })