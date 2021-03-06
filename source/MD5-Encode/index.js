const crypto = require('crypto')
const pasteboard = require('pasteboard')

here.onLoad(() => {
    // Mini Window
    here.setMiniWindow({
        title: "MD5 Encode",
        detail: "Encode clipboard",
        onClick: () => {
            const text = pasteboard.getText()
            const encoded = crypto.md5(text)
            console.debug(`encoded: ${encoded}`)
            pasteboard.setText(encoded)
            here.postNotification("HUD", `String encoded: ${encoded}`)
        }
    })
})