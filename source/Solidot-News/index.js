const _ = require("underscore")
const net = require("net")

function updateData() {
    var apiUrl = "https://www.solidot.org/index.rss"
    
    here.setMiniWindow({ title: "Updating…" })
    console.debug("api: " + apiUrl)
    
    here.parseRSSFeed(apiUrl)
    .then((feed) => {
        if (feed.items.length <= 0) {
            return here.setMiniWindow({ title: "No item found." })
        }
    
        const topFeed = feed.items[0]
        // Mini Window
        here.setMiniWindow({
            onClick: () => { if (topFeed.link != undefined)  { here.openURL(topFeed.link) } },
            title: topFeed.title,
            detail: "Solidot: 奇客的资讯，重要的东西",
            popOvers: _.map(feed.items, (item, index) => {
                return {
                    title: `${index + 1}. ${item.title}`,
                    onClick: () => { if (item.link != undefined)  { here.openURL(item.link) } }
                }
            })
        })
    })
    .catch((error) => {
        console.error("Error: " + JSON.stringify(error))
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