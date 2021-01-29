;class FeedbackHandler {
  constructor ({ space, key, token, selector }) {
    this.endpoint = `https://chat.googleapis.com/v1/spaces/${space}/messages?key=${key}&token=${token}`
    this.registerListener(selector)
  }

  registerListener (formSelector) {
    $(formSelector).submit(this.submitHandler)
  }

  submitHandler (event) {
    event.preventDefault()

    var feedback = $('.feedback-form textarea[name=feedback]').val()
    var opinion = $('input[name=opinion]').val()

    var requestData = {
      text: 'New ' + opinion + ' feedback on page: <' + window.location.href + '|' + window.Feedback.page + '>' +
        '\n\nMessage below\n ' + feedback,
    }

    this.sendFeedback(requestData, this.onSuccess)
  }

  sendFeedback (data, callback) {
    $.ajax(
      {
        type: 'POST',
        url: this.endpoint,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: callback,
      }
    )
  }

  onSuccess (data) {
    console.log(data)
  }
}

(function () {
  $(document).ready(function () {
  })
})()
