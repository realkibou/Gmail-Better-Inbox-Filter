function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Scripts')
  .addItem('filterInbox', 'filterInbox')
  .addToUi();
  extractEmails()
}
