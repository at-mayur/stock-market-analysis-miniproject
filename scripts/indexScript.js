// Declaring variables to store data
let stocksData = {};
let stockNamesList = [];
let currSelectedStock = "";
let currSelectedDurr = "5y";

let stocksBookValProfData = {};
let stockSummData = {};

let xPos = 0;


// function to fetch data from API
async function getChartData(){
    try {
        
        const chartResp = await fetch("https://stocks3.onrender.com/api/stocks/getstocksdata");
        const chartData = await chartResp.json();
        stocksData = chartData.stocksData[0];
        stockNamesList = Object.keys(stocksData);
        currSelectedStock = stockNamesList[1];

        const stockValProfResp = await fetch("https://stocks3.onrender.com/api/stocks/getstockstatsdata");
        const stockBookVal = await stockValProfResp.json();
        stocksBookValProfData = stockBookVal.stocksStatsData[0];

        const stockSummResp = await fetch("https://stocks3.onrender.com/api/stocks/getstocksprofiledata");
        const stockSumm = await stockSummResp.json();
        stockSummData = stockSumm.stocksProfileData[0];

    } catch (error) {
        console.error(error);
    }
}

// function to enable value and date display on hover
function dateValOnHover(){

    const currDisplay = document.getElementById("curr-value-container");
    currDisplay.onmouseover = (event) => {
        event.stopPropagation();
        currDisplay.style.display = "block";
    };

    const chart = document.getElementById("chart");
    chart.addEventListener("mouseover", (event) => {
        if(currDisplay.style.display==="none"){
            currDisplay.style.display = "block";
        }  
        xPos = event.clientX - event.target.getBoundingClientRect().left;
        currDisplay.style.left = `${xPos}px`;
    });
    chart.addEventListener("mouseout", () => {
        currDisplay.style.display = "none"; 
    });

    chart.addEventListener("mousemove", handleMouseMove);

}

// handler for mouse position change
function handleMouseMove(event){
    const chartBound = document.getElementById("chart").getBoundingClientRect();
    const xUnit = (chartBound.width)/(stocksData[currSelectedStock][currSelectedDurr].timeStamp.length-1);
    xPos += event.movementX;
    let xIndex = Math.floor(xPos/xUnit) + 1;

    if(xIndex>=stocksData[currSelectedStock][currSelectedDurr].timeStamp.length || xIndex<0){
        return;
    }

    const currTime = document.getElementById("curr-time");
    const currVal = document.getElementById("curr-value");
    const currDate = new Date(stocksData[currSelectedStock][currSelectedDurr].timeStamp[xIndex]*1000).toLocaleDateString();
    currTime.textContent = currDate;
    currVal.textContent = `$${stocksData[currSelectedStock][currSelectedDurr].value[xIndex].toFixed(2)}`;

    const currDisplay = document.getElementById("curr-value-container");
    currDisplay.style.left = `${xPos}px`;
}


// function to update chart for various durations
function handleDurrChange(){
    const durr5y = document.getElementById("year5");
    const durr1y = document.getElementById("year1");
    const durr3m = document.getElementById("month3");
    const durr1m = document.getElementById("month1");

    durr5y.onclick = () => {
        currSelectedDurr = "5y";
        const chart = document.getElementById("chart");
        chart.innerHTML = `
        <div id="curr-value-container">
            <p id="curr-time" class="text-center"></p>
            <p id="curr-value" class="text-center"></p>
        </div>
        `;
        let currChart = new Chart(stocksData[currSelectedStock][currSelectedDurr].timeStamp, stocksData[currSelectedStock][currSelectedDurr].value);
        currChart.drawPoints();
        dateValOnHover();
    };

    durr1y.onclick = () => {
        currSelectedDurr = "1y";
        const chart = document.getElementById("chart");
        chart.innerHTML = `
        <div id="curr-value-container">
            <p id="curr-time" class="text-center"></p>
            <p id="curr-value" class="text-center"></p>
        </div>
        `;
        let currChart = new Chart(stocksData[currSelectedStock][currSelectedDurr].timeStamp, stocksData[currSelectedStock][currSelectedDurr].value);
        currChart.drawPoints();
        dateValOnHover();
    };

    durr3m.onclick = () => {
        currSelectedDurr = "3mo";
        const chart = document.getElementById("chart");
        chart.innerHTML = `
        <div id="curr-value-container">
            <p id="curr-time" class="text-center"></p>
            <p id="curr-value" class="text-center"></p>
        </div>
        `;
        let currChart = new Chart(stocksData[currSelectedStock][currSelectedDurr].timeStamp, stocksData[currSelectedStock][currSelectedDurr].value);
        currChart.drawPoints();
        dateValOnHover();
    };

    durr1m.onclick = () => {
        currSelectedDurr = "1mo";
        const chart = document.getElementById("chart");
        chart.innerHTML = `
        <div id="curr-value-container">
            <p id="curr-time" class="text-center"></p>
            <p id="curr-value" class="text-center"></p>
        </div>
        `;
        let currChart = new Chart(stocksData[currSelectedStock][currSelectedDurr].timeStamp, stocksData[currSelectedStock][currSelectedDurr].value);
        currChart.drawPoints();
        dateValOnHover();
    };
}

// function to handle summary
function handleSummary(){
    const stockName = document.getElementById("stock-name");
    const stockProfit = document.getElementById("profit");
    const stockValue = document.getElementById("book-value");
    const stockSummary = document.getElementById("stock-summary");

    if(stocksBookValProfData[currSelectedStock]["profit"]>0){
        if(stockProfit.classList.contains("loss")){
            stockProfit.classList.remove("loss");
        }
        stockProfit.classList.add("profit");
    }
    else{
        if(stockProfit.classList.contains("profit")){
            stockProfit.classList.remove("profit");
        }
        stockProfit.classList.add("loss");
    }

    stockName.textContent = currSelectedStock;
    stockProfit.textContent = `${stocksBookValProfData[currSelectedStock]["profit"]}%`;
    stockValue.textContent = `$${stocksBookValProfData[currSelectedStock]["bookValue"]}`;
    stockSummary.textContent = stockSummData[currSelectedStock]["summary"];
}


// function to handle stocks list
function handleStocksList(){
    const stocksList = document.getElementById("stock-list");
    stocksList.innerHTML = "";

    for(let indStock in stocksBookValProfData){
        if(indStock==="_id"){
            continue;
        }

        const newLi = document.createElement("li");

        const newDiv = document.createElement("div");
        newDiv.className = "stock";

        const newBtn = document.createElement("button");
        newBtn.setAttribute("type", "button");
        newBtn.textContent = `${indStock}`;
        newBtn.onclick = function(){
            currSelectedStock = indStock;
            currSelectedDurr = "5y";

            const chart = document.getElementById("chart");
            chart.innerHTML = `
            <div id="curr-value-container">
                <p id="curr-time" class="text-center"></p>
                <p id="curr-value" class="text-center"></p>
            </div>
            `;
            let currChart = new Chart(stocksData[currSelectedStock][currSelectedDurr].timeStamp, stocksData[currSelectedStock][currSelectedDurr].value);
            currChart.drawPoints();
            dateValOnHover();
            handleSummary();
            const chartName = document.getElementById("chart-name");
            chartName.textContent = currSelectedStock;
        };

        const newBookP = document.createElement("p");
        newBookP.textContent = `$${stocksBookValProfData[indStock]["bookValue"].toFixed(4)}`;

        const newProfitP = document.createElement("p");
        newProfitP.textContent = `${stocksBookValProfData[indStock]["profit"].toFixed(4)}%`;
        newProfitP.className = (stocksBookValProfData[indStock]["profit"]<=0) ? "loss" : "profit";

        newDiv.append(newBtn, newBookP, newProfitP);
        newLi.append(newDiv);

        stocksList.append(newLi);
    }
}


// class to draw charts
class Chart{
    timeStamps;
    stockValues;
    xUnit;
    yUnit;
    minVal;
    maxVal;

    constructor(timeStamps, stockValues){
        this.timeStamps = timeStamps;
        this.stockValues = stockValues;
        this.setXUnit();
        this.setYUnit();
    }

    // function to determine X axis scale
    setXUnit(){
        const chart = document.getElementById("chart").getBoundingClientRect();
        this.xUnit = (chart.width)/(this.timeStamps.length-1);
    }

    // function to determine Y axis scale
    setYUnit(){
        const chart = document.getElementById("chart").getBoundingClientRect();
        let maxValue = this.stockValues[0];
        let minValue = this.stockValues[0];
        for(let i=1 ; i<this.stockValues.length ; i++){
            if(this.stockValues[i]>maxValue){
                maxValue = this.stockValues[i];
            }
            if(this.stockValues[i]<minValue){
                minValue = this.stockValues[i];
            }
        }
        this.yUnit = (maxValue-minValue)/(chart.height);

        // update max min values of stock
        this.maxVal = maxValue;
        this.minVal = minValue;
    }

    // function to plot chart
    drawPoints(){
        const chart = document.getElementById("chart");
        
        for(let i=0 ; i<this.timeStamps.length ; i++){
            // create and add point
            const newData = document.createElement("div");
            const newPoint = document.createElement("div");
            newPoint.id = `point-${this.stockValues[i]}`;
            newPoint.className = "chart-point";
            newPoint.style.left = `${i * this.xUnit-1.5}px`;
            newPoint.style.bottom = `${(this.stockValues[i]-this.minVal)/this.yUnit-1.5}px`;

            // create and add line
            if(i!==this.timeStamps.length-1){
                const angle = Math.atan2(((this.stockValues[i+1]-this.stockValues[i]) / this.yUnit), this.xUnit ) * 180/Math.PI;
                const newLine = document.createElement("div");
                newLine.className = "chart-line";
                newLine.style.width = Math.hypot(((this.stockValues[i+1]-this.stockValues[i]) / this.yUnit ), this.xUnit)+"px";
                newLine.style.left = `${i * this.xUnit}px`;
                newLine.style.bottom = `${(this.stockValues[i]-this.minVal)/this.yUnit - 1.5}px`;
                newLine.style.transform = `rotate(${-1*angle}deg)`;

                newData.append(newLine);
            }

            newData.append(newPoint);
            chart.append(newData);

            // update min max values
            const minValContain = document.getElementById("chart-min-val");
            const maxValContain = document.getElementById("chart-max-val");

            minValContain.innerText = `$${this.minVal.toFixed(3)}`;
            maxValContain.innerText = `$${this.maxVal.toFixed(3)}`;

        }

    }

    
}

getChartData().then(
    () => {
        let currChart = new Chart(stocksData[currSelectedStock][currSelectedDurr].timeStamp, stocksData[currSelectedStock][currSelectedDurr].value);
        currChart.drawPoints();

        const chartName = document.getElementById("chart-name");
        chartName.textContent = currSelectedStock;

        dateValOnHover();
        handleDurrChange();
        handleSummary();
        handleStocksList();
    }
);
