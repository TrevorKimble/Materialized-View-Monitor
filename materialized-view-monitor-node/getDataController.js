const baseurl = `<redacted>/util/mvmonitor`
const displayPageUrl = `http://${process.env.host}:7201`

exports.getStatus = function(req, res) {
    import(`node-fetch`)
        .then(module => module.default(baseurl))
        .then(response => response.json())
        .then(data => {
            const filteredData = []
            let status, timeSinceUpdated, HSinceUpdated, MSinceUpdated, SSinceUpdated
            for (let i = 0; i < data.length; i++) {
                if (data[i].missed_cycles > 2 || (data[i].cycle_time_s >= 86400 && data[i].missed_cycles > 0)) {
                    status = `red`
                } else if (data[i].missed_cycles > 0) {
                    status = `yellow`
                } else {
                    status = `green`
                }

                HSinceUpdated = 0, MSinceUpdated = 0, SSinceUpdated = 0
                timeSinceUpdated = Math.round(data[i].time_since_refresh_s)
                while (timeSinceUpdated >= 3600) {
                    HSinceUpdated += 1
                    timeSinceUpdated -= 3600
                }
                while (timeSinceUpdated >= 60) {
                    MSinceUpdated += 1
                    timeSinceUpdated -= 60
                }
                SSinceUpdated = timeSinceUpdated

                if (process.env.NODE_ENV !== `test`) {
                    if (SSinceUpdated < 10) {
                        SSinceUpdated = `0${SSinceUpdated}`
                    }
                    if (MSinceUpdated < 10) {
                        MSinceUpdated = `0${MSinceUpdated}`
                    }
                    if (HSinceUpdated < 10) {
                        HSinceUpdated = `0${HSinceUpdated}`
                    }
                }
                filteredData.push({ name: data[i].rel_name, cycleInterval: data[i].schedule_interval, cyclesMissed: data[i].missed_cycles, timeSinceLastRefresh: { hours: HSinceUpdated, minutes: MSinceUpdated, seconds: SSinceUpdated }, Status: status })
            }
            res.json(filteredData)
        })
        .catch(`Error:`, error => console.log(error))
}

exports.sendMaterializedViewAlerts = function (req, res) {
    import(`node-fetch`)
        .then(module => module.default(baseurl))
        .then(data => data.json())
        .then(data => {
            const brokenMVs = []
            for (let i = 0; i < data.length; i++) {
                if (data[i].missed_cycles > 2 || (data[i].cycle_time_s >= 86400 && data[i].missed_cycles > 0)) {
                    brokenMVs.push({ name: data[i].rel_name, schema: data[i].schema_name, MissedCycles: data[i].missed_cycles })
                }
            }

            if (brokenMVs.length > 0) {
                const body = {       
                    redacted_body: "<redacted>"
                }
                let servername
                if (baseurl.includes(`<redacted>`)) {
                    servername = `<redacted>`
                } else if (baseurl.includes(`<redacted>`)) {
                    servername = `<redacted>`
                } else {
                    servername = `other`
                }
                // message generation 
                body.message += `<html><body>The following materialized views have not been refreshed on <b> ${servername} </b> for 3 or more cycles: <br> <br> <ul>`
                for (let i = 0; i < brokenMVs.length; i++) {
                    body.message += `<li>${brokenMVs[i].schema}.${brokenMVs[i].name}</li>`
                }
                body.message += `</ul>Please review and take appropriate actions: <a href=${displayPageUrl}>Materialized View Status Page</a></body></html>`
                console.log(`email sent at `, Date(), `to`, body.recipients)

                import(`node-fetch`)
                    .then(module => {
                        const fetch = module.default
                        fetch(`<redacted>/util/newmessage`, {
                            headers: { "Content-Type": `application/json; charset=utf-8` },
                            method: `POST`,
                            body: JSON.stringify(body)
                        })
                            .then(response => response.json())
                            .then(data => res.json(data))
                            .catch(error => console.log(error))
                    })
                    .catch(error => console.log(error))
            } else {
                res.end()
            }

        })
        .catch(`Error:`, error => console.log(error))
    
}