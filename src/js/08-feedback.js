class FeedbackHandler {
  constructor ({ space, key, token, page, selector }) {
    this.page = page
    this.selector = selector
    this.endpoint = `https://chat.googleapis.com/v1/spaces/${space}/messages?key=${key}&token=${token}`
    this.registerListener()
  }

  registerListener () {
    $(this.selector + ' input[type=submit]').on('click', (event) => this.submitHandler(event))
  }

  submitHandler (event) {
    event.preventDefault()

    const message = $(this.selector + ' textarea[name=feedback]').val() || 'No message was specified'
    const opinion = $(this.selector + ' input[name=opinion]').val()

    const requestData = {
      text: `New ${opinion} feedback on page: <${window.location.href}|${this.page}>\n\n` +
        `Message below\n${message}`,
    }

    this.sendFeedback(requestData, this.onSuccess)
  }

  sendFeedback (data, onSuccess) {
    $.ajax(
      {
        type: 'POST',
        url: this.endpoint,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: onSuccess,
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
      page: window.Feedback.page,
      selector: 'form.feedback-form',
    })
  })
})()
