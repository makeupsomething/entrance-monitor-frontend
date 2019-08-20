import React, {useState, useEffect} from 'react';
import * as firebase from 'firebase/app'
import 'firebase/database'
import { useList } from 'react-firebase-hooks/database';
import { Line } from 'react-chartjs-2'
import dayjs from 'dayjs'

var config = {
  apiKey: `${process.env.REACT_APP_API_KEY}`,
  authDomain: `${process.env.REACT_APP_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.REACT_APP_PROJECT_ID}.firebaseio.com`,
  storageBucket: `${process.env.REACT_APP_PROJECT_ID}.appspot.com`
};

firebase.initializeApp(config)

const List = () => {
  const [snapshots, loading, error] = useList(firebase.database().ref('data'));
  const [labels, setLabels] = useState([])
  const [lightData, setLightData] = useState([])
  const [proxData, setProxData] = useState([])

  useEffect(() => {
    if(snapshots.length > 0) {
      setLabels([])
      setLightData([])
      setProxData([])
      snapshots.forEach(v => {
        setLabels((l) => [...l, dayjs(v.val().createdAt).format('YYYY/MM/DD hh:mm:ss')])
        setLightData((l) => [...l, v.val().light])
        setProxData((l) => [...l, v.val().proximity])
      })
      
    }
  }, [snapshots])

  const data = {
    labels,
    datasets: [
      {
        label: 'Light',
        fill: true,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: lightData
      },
      {
        label: 'Proximity',
        fill: true,
        lineTension: 0.1,
        backgroundColor: 'rgba(192, 75,192,0.4)',
        borderColor: 'rgba(192,75,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(192,75,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(192,75,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: proxData
      }
    ]
  };

  return (
      <>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>List: Loading...</span>}
        {!loading && snapshots.length > 0 && (
          <Line data={data} />
        )}
      </>
  )
}

const App = () => {
  return (
    <>
      <h1>Light and Proximity Monitor</h1>
      <List />
    </>
  );
}

export default App;
