import React, { useState, useEffect } from 'react'
import './App.css'

const baseurl = `http://${process.env.REACT_APP_server}:7200/data/cyclesMissed`

function App() {

    const [data, setData] = useState(null)
    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 30000)
        
        return () => {
            clearInterval(interval)
        }
    }, [])

    const fetchData = () => {
        fetch(baseurl)
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((err) => { console.log(err) })
    }

    if (process.env.NODE_ENV !== `test`) {

        return (
            <div>
                <div className='titleDiv'>Materialized View Refresh Statuses</div>
            
                {data ? (
                    <div className='container'>
                        {data.map((item, index) => (
                            <div key={index} className='box'>
                                <div style={{ backgroundColor: item.Status, height: `25px`, borderBottom: `3px solid black` }}></div>
                                <div>
                                    {item.name}<br />
                                    Interval: {item.cycleInterval}<br />
                                    Last Refreshed: {item.timeSinceLastRefresh.hours}:{item.timeSinceLastRefresh.minutes}:{item.timeSinceLastRefresh.seconds}<br />
                                    Cycles Missed: {item.cyclesMissed} <br />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>¯\_(ツ)_/¯</p>
                )} 

            </div>
        )
    } else {

        return (
            `test`
        )

    }
}

export default App