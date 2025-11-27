// Sender verification for MV3 security
export const verifySender = (sender) => {
    // Verify message is from our extension
    if (!sender || !sender.id) return false
    if (sender.id !== chrome.runtime.id) return false
    // Content scripts should have tab info
    if (sender.tab && !sender.tab.url?.includes('youtube.com')) return false
    return true
}

export const isFromContentScript = (sender) => {
    return sender?.tab?.id && sender?.url?.includes('youtube.com')
}

export const isFromExtensionPage = (sender) => {
    return sender?.url?.startsWith(`chrome-extension://${chrome.runtime.id}`)
}
