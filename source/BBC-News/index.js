const _ = require("underscore")
const net = require("net")

function updateData() {
    const LIMIT = 10

    here.setMiniWindow({ title: "Updating…" })

    // API: https://feeds.bbci.co.uk/news/world/rss.xml
    // API Speedy: https://apispeedy.com/bbc/

    here.parseRSSFeed("https://apispeedy.com/bbc/")
    .then((feed) => {
        if (feed.items.length <= 0) {
            return here.setMiniWindow({ title: "No item found." })
        }

        if (feed.items.length > LIMIT) {
            feed.items = feed.items.slice(0, LIMIT)
        }

        const topFeed = feed.items[0]

        // Mini Window
        here.setMiniWindow({
            onClick: () => { if (topFeed.link != undefined) { here.openURL(topFeed.link) } },
            title: topFeed.title,
            detail: "BBC News",
            popOvers: _.map(feed.items, (item, index) => {
                return {
                    title: `${index + 1}. ${item.title}`,
                    onClick: () => { if (item.link != undefined) { here.openURL(item.link) } }
                }
            })
        })
    })
    .catch((error) => {
        console.error(`Error: ${JSON.stringify(error)}`)
    })
}

here.onLoad(() => {
    updateData()
    // Update every 2 hours
    setInterval(updateData, 2*3600*1000);
})

net.onChange((type) => {
    console.log("Connection type changed:", type)
    if (net.isReachable()) {
        updateData()
    }
})

net.onChange((type) => {
    console.log("Connection type changed:", type)
    if (net.isReachable()) {
        updateData()
    }
})