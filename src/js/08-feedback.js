;class FeedbackHandler {
  constructor ({ space, key, token, selector }) {
    this.selector = selector
    this.endpoint = `https://chat.googleapis.com/v1/spaces/${space}/messages?key=${key}&token=${token}`
    this.registerListener()
  }

  registerListener () {
    $(this.selector + ' input[type=submit]').on('click', (event) => this.submitHandler(event))
  }

  submitHandler (event) {
    event.preventDefault()

    const feedback = $(this.selector + ' textarea[name=feedback]').val()
    const opinion = $(this.selector + ' input[name=opinion]').val()

    const requestData = {
      text: `New ${opinion} feedback on page: <${window.location.href}|${window.Feedback.page}\n\n` +
        `Message below\n${feedback}`,
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
    new FeedbackHandler({
      space: window.Feedback.space,
      key: window.Feedback.key,
      token: window.Feedback.token,
      selector: 'form.feedback-form',
    })
  })
})()
