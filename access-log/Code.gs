// Run setupLog once from the Apps Script editor before deploying the web app.
function setupLog() {
  const properties = PropertiesService.getScriptProperties();
  const existingId = properties.getProperty('LOG_FILE_ID');
  const file = existingId
    ? DriveApp.getFileById(existingId)
    : DriveApp.createFile('akses-tia.txt', '', MimeType.PLAIN_TEXT);
  if (!existingId) properties.setProperty('LOG_FILE_ID', file.getId());
  Logger.log('File log: ' + file.getUrl());
}

function doPost(e) {
  const allowedEvents = {
    site_opened: 'Situs dibuka',
    answer_correct: 'Jawaban benar',
    whatsapp_clicked: 'Tombol WhatsApp ditekan'
  };
  let event;
  try {
    event = JSON.parse(e.postData.contents).event;
  } catch (_) {
    return ContentService.createTextOutput('Invalid request');
  }
  if (!Object.prototype.hasOwnProperty.call(allowedEvents, event)) {
    return ContentService.createTextOutput('Invalid event');
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const fileId = PropertiesService.getScriptProperties().getProperty('LOG_FILE_ID');
    if (!fileId) throw new Error('Run setupLog first');
    const file = DriveApp.getFileById(fileId);
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');
    const line = timestamp + ' WIB | ' + allowedEvents[event] + '\n';
    file.setContent(file.getBlob().getDataAsString('UTF-8') + line);
    return ContentService.createTextOutput('OK');
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

// Use this from the editor to verify the log file before deploying.
function testLog() {
  const result = doPost({ postData: { contents: JSON.stringify({ event: 'site_opened' }) } });
  Logger.log(result.getContent());
}
