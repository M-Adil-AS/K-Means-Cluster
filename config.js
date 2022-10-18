function chartData(){
  let clusterCenters = []
  for(let i=0; i<k; i++){
    clusterCenters.push({x:Number((Math.random() * 10).toFixed(2)) ,y:Number((Math.random() * 10).toFixed(2))})
  }

  const colors = ['red','blue','green','yellow','purple','hotpink','black','orange','brown','grey']

  return{
    datasets:
    [
      {
        label: 'Patient data chart',
        data: clusterCenters.concat(dataSet().map((dataPoint)=>{
          return {x:dataPoint.WGB, y:dataPoint.RGB}
        })),
        pointStyle: clusterCenters.map(clusterCenter => 'triangle').concat(dataSet().map(dataPoint => 'circle')),
        pointRadius: clusterCenters.map(clusterCenter => 10).concat(dataSet().map(dataPoint => 5.5)),
        pointBackgroundColor: colors.slice(0,k),
        showLine: false,
        backgroundColor: 'aqua'
      }
    ]
  }
}

function chartOptions(){
  return{
    maintainAspectRatio: false,
    legend: 
    {
      labels: 
      {
        fontSize:20
      }
    },
    responsive:true,
    scales:
    {
      xAxes:
      [
        {
          display:true,
          scaleLabel: 
          {
            display: true,
            labelString: 'WGB level',
            fontSize: 20
          },
          ticks: 
          {
            fontSize: 20,
            max:10,
            min:0
          }
        }
      ],
      yAxes:
      [
        {
          display:true,
          scaleLabel: 
          {
            display: true,
            labelString: 'RGB level',
            fontSize: 20
          },
          ticks: 
          {
            fontSize: 20,
            max:10,
            min:0
          }
        }
      ]
    }
  }
}