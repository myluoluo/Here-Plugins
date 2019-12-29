const _ = require("underscore")
const http = require("http")

function updateData() {
    here.setMiniWindow({ title: "Updating…" })

    http.request("https://github-trending-api.now.sh/repositories?since=weekly")
    .then(function(response) {
        let feeds = response.data
        if (feeds == undefined) {
            return here.returnErrror("Invalid data.")
        }

        if (feeds.length == 0) {
            return here.returnErrror("Empty result.")
        }

        const topFeed = feeds[0]

        let popOvers = _.map(feeds, (feed, index) => {
            return {
                title: (index + 1) + ". " + feed.author + "/" + feed.name,
                // detail: feed.description,
                accessory: {
                    title: (Number(feed.stars) / 1000).toFixed(1) + "k⭐️"
                },
                onClick: () => { here.openURL(feed.url) }
            }
        })
        popOvers.push({
            title: "View All…",
            onClick: () => { _.each(feeds, (feed) => { here.openURL(feed.url) }) }
        })

        here.setMiniWindow({
            title: topFeed.author + "/" + topFeed.name,
            detail: "Github Trending Weekly",
            accessory: {
                    title: (Number(topFeed.stars) / 1000).toFixed(1) + "k⭐️"
                },
            popOvers: popOvers,
            onClick: () => { here.openURL(topFeed.url) }
        })
    })
    .catch(function(error) {
        console.error(`Error: ${error}`)
        here.returnErrror(error)
    })
}

here.onLoad(() => {
    updateData()
    // Update every 2 hours
    setInterval(updateData, 2*3600*1000);
})