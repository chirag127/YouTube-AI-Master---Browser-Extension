document.getElementById('save-btn').addEventListener('click', () => {
  const apiKey = document.getElementById('apiKey').value
  const summaryLength = document.getElementById('summaryLength').value
  const targetLanguage = document.getElementById('targetLanguage').value
  const skipSponsor = document.getElementById('skipSponsor').checked
  const skipSelfPromo = document.getElementById('skipSelfPromo').checked
  const skipInteraction = document.getElementById('skipInteraction').checked

  chrome.storage.local.set(
    {
      geminiApiKey: apiKey,
      summaryLength: summaryLength,
      targetLanguage: targetLanguage,
      autoSkip: {
        Sponsor: skipSponsor,
        'Self Promotion': skipSelfPromo,
        'Interaction Reminder': skipInteraction,
      },
    },
    () => {
      const status = document.getElementById('status')
      status.textContent = 'Options saved.'
      setTimeout(() => {
        status.textContent = ''
      }, 2000)

      // Notify content scripts if they are listening
      chrome.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
          chrome.tabs.sendMessage(tab.id, { action: 'UPDATE_SETTINGS' }).catch(() => {})
        }
      })
    }
  )
})

// Restore options
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(
    ['geminiApiKey', 'summaryLength', 'targetLanguage', 'autoSkip'],
    (items) => {
      if (items.geminiApiKey) {
        document.getElementById('apiKey').value = items.geminiApiKey
      }
      if (items.summaryLength) {
        document.getElementById('summaryLength').value = items.summaryLength
      }
      if (items.targetLanguage) {
        document.getElementById('targetLanguage').value = items.targetLanguage
      }
      if (items.autoSkip) {
        document.getElementById('skipSponsor').checked = items.autoSkip.Sponsor || false
        document.getElementById('skipSelfPromo').checked = items.autoSkip['Self Promotion'] || false
        document.getElementById('skipInteraction').checked =
          items.autoSkip['Interaction Reminder'] || false
      }
    }
  )
})
