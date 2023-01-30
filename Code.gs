function filterInbox() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Criteria")

  let lastrow = sheet.getLastRow()

  // Build an array with [[From, Subject], [From, Subject], ...]
  filter_array = sheet.getRange(2, 1, lastrow - 1, 2).getValues()

  let threads = GmailApp.getInboxThreads()
  console.log(`${GmailApp.getInboxUnreadCount()} unread in the inbox`)

  // get all the messages for the current batch of threads
  var messages = GmailApp.getMessagesForThreads(threads);

  messages.forEach(function (message) {
    // console.log(`${message.length} messages in this thread.`)

    let from_address = function (message) {
      if (message[0].getFrom().match(/<(.+)>/) == null) {
        return message[0].getFrom()
      } else {
        return message[0].getFrom().match(/<(.+)>/)[1]
      }
    }(message)

    let subject = message[0].getSubject()
    // let body = message[0].getBody().substring(0,100)
    // https://spreadsheet.dev/arrays-apps-script


    console.log(`from: ${from_address}`)
    console.log(`subject: ${subject}`)

    let if_statement = filter_array.filter(
      function (e) {
        return 2 == e.filter(
          function (f) {
            return from_address.toLowerCase().match(f.toLowerCase()) || subject.toLowerCase().match(f.toLowerCase())
          }
        ).length
      }
    ).length

    console.log(if_statement)

    if (if_statement > 0) {
      // Loop over all messages in this thread to delete
      message.forEach(function (msg) {
        let id = msg.getId()
        console.log(`Moved to trash: ${id}`)
        GmailApp.getMessageById(id).moveToTrash()
        GmailApp.getMessageById(id).star()
      })
    }
  })
}
