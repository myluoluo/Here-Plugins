const _ = require("underscore")
const pref = require("pref")
const http = require("http")
const net = require("net")

function updateData() {
    const LIMIT = 10

    var data = new Date();
    var todayIso = data.toISOString().split("T")[0]
    var apiUrl = "" 
    var apiToken = ""

    const json = pref.all()
    if (json == undefined) {
        console.Debug("No prefs found.")
    }
    
    // console.debug(`prefs: ${JSON.stringify(prefs)}`)
    console.log(`json: ${JSON.stringify(json)}`)

    apiUrl = json.apiUrl

    if (json.apiToken != undefined) {
        apiToken = json.apiToken

    } else {
        here.setMiniWindow({ title: "No API token found", detail: "MS App Center"})
        return here.setMiniWindow({ title: "invalid apiToken."})
    }

    here.setMiniWindow({ title: "Updating…" })
    http.request({
        url: `${apiUrl}${todayIso}`,
        method: "GET",
        headers: {
            "accept": "application/json",
            "X-API-Token": apiToken
        }
    }).then(function(response) {
        // console.log(`data: ${response.data}`)

        const json = response.data
        console.log(`JSON: ${JSON.stringify(json)}`)
        const entryList = json.events[0]

        if (entryList == undefined) {
            here.setMiniWindow({ title: "Invalid data.", detail: "MS App Center" })
            return
        }

        if (entryList.length <= 0) {
            here.setMiniWindow({ title: "Entrylist is empty.", detail: "MS App Center" })
            return
        }

        if (entryList.length > LIMIT) {
            entryList = entryList.slice(0, LIMIT)
        }

        here.setMiniWindow({
            onClick: () => { here.openURL("https://appcenter.ms/") },
            title: "Device Count(" + todayIso + ")",
            detail: "MS App Center",
            accessory: {
                title: entryList.device_count.toString()
            },
            popOvers: _.map(entryList, (entry, key) => {
                return {
                    title: key.toString(),
                    accessory: {
                        title: entry.toString()
                    },
                }
            })
        })
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