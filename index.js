//<-----------------------Class Declarataions------------------>
class BazaarItem {
  constructor(id, sellSum = [], buySum = [], quickStatus = [], category = "", related = [], name = "") {
    this.id = id;
    this.sellSum = sellSum;
    this.buySum = buySum;
    this.quickStatus = quickStatus;
    this.category = category;
    this.related = related;
    this.name = name ? name : id.replace(/_/g, ' ').toLowerCase();
	this.margin = this.quickStatus.buyPrice - this.quickStatus.sellPrice;
  }

  toDiv() {
    let newDiv = createNewCardElement(this);
    return newDiv;
  }
}
//<---------------------END Class Declarations----------------->
//<------------------------------------------------------------>
//<---------------Variable Declaration / Start Point----------->


const mainDiv = document.getElementById("item-wrapper");
const getReqOutput = JSON.parse(get("https://api.slothpixel.me/api/skyblock/bazaar"));
const bazaarItemList = formatJson(getReqOutput);
var filteredBazaarItemList = bazaarItemList;
var filteredBazaarItemList;

window.addEventListener('keydown', function(e){
	if(e.code == "Escape"){
		unexpand();
	}
});

window.onload = function() {
  createScreen(bazaarItemList);

}



//<------------END Variable Declaration / Start Point---------->
//<------------------------------------------------------------>
//<--------------------Main Operation Functions---------------->

function drawCard(newDiv) {
  mainDiv.appendChild(newDiv);
}

function expand(item) {
  item.classList.add("expanded-grid");
}

function unexpand() {
  clearScreen();
  createScreen(filteredBazaarItemList);
}

function filterItems(target) {
  target = target.toLowerCase();
  filteredBazaarItemList = {};

  let matchesArr = findMatchingKeys(target);

  setFilteredArray(matchesArr);

  clearScreen();
  createScreen(filteredBazaarItemList);

}

function setFilteredArray(keys) {
  for (const key of keys) {
    filteredBazaarItemList[key] = bazaarItemList[key];
  }
}

function findMatchingKeys(target) {
  let matches = [];
  const keys = Object.keys(bazaarItemList);
  for (const key of keys) {
    let compare = bazaarItemList[key].name ? bazaarItemList[key].name.toLowerCase() : key.toLowerCase;
    if (compare.startsWith(target)) {
      matches.push(key);
    }
  }
  return matches;
}

function createScreen(obj) {
  for (const item in obj) {
    drawCard(bazaarItemList[item].toDiv());
  }
}

function clearScreen() {
  while (mainDiv.firstChild) {
    mainDiv.removeChild(mainDiv.firstChild);
  }
}

function createNewCardElement(obj){
	let newDiv = document.createElement("div");
    newDiv.classList.add("item");
	
	let newHeaderDiv = createCardHeader(obj);
	let openCardButton = createOpenCardButton();
    let closeCardButton = createCloseCardButton();
	let infoDiv = createInfoDiv(obj);
	
	newDiv.appendChild(newHeaderDiv);
    newDiv.appendChild(openCardButton);
    newDiv.appendChild(closeCardButton);
	newDiv.appendChild(infoDiv);
	
	return newDiv;
}

function createCardHeader(obj){
	let newHeaderDiv = document.createElement("div");
	newHeaderDiv.classList.add("item-header");
	let newHeaderDivText = document.createElement("p")
    newHeaderDivText.innerText = (obj.name ? obj.name : obj.id);
    newHeaderDivText.classList.add("item-header-text");
    newHeaderDiv.appendChild(newHeaderDivText);
	return newHeaderDiv;
}

function createOpenCardButton(){
	let openCardButton = document.createElement("button");
    openCardButton.classList.add("open-card");
    openCardButton.innerText = "OPEN CARD";
    openCardButton.onclick = function() {
      expand(openCardButton.parentElement);
    }
	return openCardButton;
}

function createCloseCardButton(){
	let closeCardButton = document.createElement("button");
    closeCardButton.classList.add("close-card");
    closeCardButton.innerText = "X";
    closeCardButton.onclick = function() {
      unexpand();
    }
	return closeCardButton;
}

function createInfoDiv(obj){
	let infoDiv = document.createElement("div");
	infoDiv.classList.add("info-wrapper");
	
	let instantBuy = document.createElement("p");
	instantBuy.classList.add("instant-buy");
	instantBuy.innerHTML = `Instant Buy Price: $${obj.quickStatus.buyPrice.toFixed(2)}`;
	let instantSell = document.createElement("p");
	instantSell.classList.add("instant-sell");
	instantSell.innerHTML = `Instant Sell Price: $${obj.quickStatus.sellPrice.toFixed(2)}`;
	let buyOrder = document.createElement("p");
	buyOrder.classList.add("buy-order");
	buyOrder.innerHTML = `# of Buy Orders: ${obj.quickStatus.buyOrders}`;
	let sellOrder = document.createElement("p");
	sellOrder.classList.add("sell-order");
	sellOrder.innerHTML = `# of Sell Orders: ${obj.quickStatus.sellOrders}`;
	let buyVolume = document.createElement("p");
	buyVolume.classList.add("buy-volume");
	buyVolume.innerHTML = `Total Buy Volume: ${obj.quickStatus.buyVolume}`;
	let sellVolume = document.createElement("p");
	sellVolume.classList.add("sell-volume");
	sellVolume.innerHTML = `Total Sell Volume: ${obj.quickStatus.sellVolume}`;
	let margin = document.createElement("p");
	margin.classList.add("margin");
	margin.innerHTML = `Margin: $${obj.margin.toFixed(2)}`;
	
	infoDiv.appendChild(instantSell);
	infoDiv.appendChild(instantBuy);
	infoDiv.appendChild(buyOrder);
	infoDiv.appendChild(sellOrder);
	infoDiv.appendChild(buyVolume);
	infoDiv.appendChild(sellVolume);
	infoDiv.appendChild(margin);
	
	return infoDiv;
}
//<------------------END Main Operation Functions-------------->
//<------------------------------------------------------------>
//<-----------------------Helper Functions--------------------->
function get(URL) {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", URL, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}

function isElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
}

function formatJson(obj) {
  let formattedObj = {};
  for (const item in obj) {
    formattedObj[item] = new BazaarItem(obj[item].product_id, obj[item].sell_summary, obj[item].buy_summary, obj[item].quick_status, obj[item].category, obj[item].related, obj[item].name);
  }
  return formattedObj;
}
//<----------------------END Helper Functions------------------>
