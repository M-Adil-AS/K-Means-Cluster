const k = Number(prompt('Enter value of K'))
const chart = new Chart(document.querySelector('#chart'),{
    type:'scatter',
    data:chartData(),
    options:chartOptions()
})
let preventCallBack = false

document.addEventListener('keydown',async()=>{
    if(!preventCallBack){
        preventCallBack = true
        let clusterCentersLocs = ['code']
        let clusterCentersNewLocs = ['tonight']
        
        while(JSON.stringify(clusterCentersLocs)!=JSON.stringify(clusterCentersNewLocs)){
            clusterCentersLocs = []
            for(let i=0; i<k; i++){
                clusterCentersLocs.push(chart.data.datasets[0].data[i])
            }

            await labelDataPoints()
            await recenterClusterCenters()

            clusterCentersNewLocs = []
            for(let i=0; i<k; i++){
                clusterCentersNewLocs.push(chart.data.datasets[0].data[i])
            }
        }

        alert('Process Complete! Open the console to see the results.')
        consoleResults()
    }
})

function consoleResults(){
    const clusters = getClusters()
    for(let i=0; i<clusters.length; i++){
        console.log(`Category ${String.fromCharCode(i+65)} patients:`)
        console.table(clusters[i])
    }   
}

function recenterClusterCenters(){
    return new Promise(async(resolve,reject)=>{
        const clusters = getClusters()

        clusters.forEach((cluster,i)=>{
            let sumX = 0
            let sumY = 0
            cluster.forEach((dataPoint,j)=>{
                sumX = sumX + dataPoint.x
                sumY = sumY + dataPoint.y
            })
            if(cluster.length){
                chart.data.datasets[0].data[i] = {x:Number((sumX/cluster.length).toFixed(2)),y:Number((sumY/cluster.length).toFixed(2))}
            }
        })

        chart.update(3000)
        await new Promise(resolve => setTimeout(resolve, 3000))
        resolve()
    })
}

function getClusters(){
    let clusters = []
    for(let i=0; i<k; i++){
        clusters.push([])
    }

    const colors = ['red','blue','green','yellow','purple','hotpink','black','orange','brown','grey'].slice(0,k)
    for(let i=k; i<chart.data.datasets[0].data.length; i++){
        for(let j=0; j<colors.length; j++){
            if(chart.data.datasets[0].pointBackgroundColor[i]==colors[j]){
                clusters[j].push(chart.data.datasets[0].data[i])
            }
        }
    }

    return clusters
}

function labelDataPoints(){
    return new Promise(async(resolve,reject)=>{
        dataSet().forEach((dataPoint,i)=>{
            let distances = []
            for(let j=0; j<k; j++){
                const clusterCenterX = chart.data.datasets[0].data[j].x
                const clusterCenterY = chart.data.datasets[0].data[j].y
                distances.push(Math.sqrt(((clusterCenterX-dataPoint.WGB)**2)+((clusterCenterY-dataPoint.RGB)**2)))
            }
            const minValue = Math.min.apply(Math,distances)
            const index = distances.indexOf(minValue)
            chart.data.datasets[0].pointBackgroundColor[i+k] = chart.data.datasets[0].pointBackgroundColor[index]
        })
        chart.update(2000)
        await new Promise(resolve => setTimeout(resolve, 2000))
        resolve()
    })
}