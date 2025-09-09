const numberArray = [];
const history = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('userInput');
const targetInput = document.getElementById('targetInput');
let target = 0;
let elementWidth = 50;
let elementHeight = 40;
let spacing = 10;
let startX = 50;
let startY = 200;
let currentLeft = -1;
let currentRight = -1;
let currentMid = -1;
let isSearching = false;

class SearchElement {
  constructor(value, index) {
    this.value = value;
    this.index = index;
    this.x = startX + index * (elementWidth + spacing);
    this.y = startY;
  }
}

function reloadPage() {
  location.reload();
}

function randomiseInput() {
  const selectedInput = document.getElementById('selectedInput');
  const n = parseInt(selectedInput.options[selectedInput.selectedIndex].text);
  let arr = [];
  
  // Generate random sorted array
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 100) + 1);
  }
  arr.sort((a, b) => a - b);
  
  let s = arr.join(',');
  console.log(s);
  input.value = s;
  
  // Random target
  const randomTarget = Math.floor(Math.random() * 120) + 1;
  targetInput.value = randomTarget;
}

function setDimensions() {
  // Calculate canvas dimensions based on array size
  const totalWidth = numberArray.length * (elementWidth + spacing) + startX * 2;
  if (totalWidth > canvas.width) {
    const scale = canvas.width / totalWidth;
    elementWidth *= scale;
    spacing *= scale;
    startX *= scale;
  }
  
  // Recalculate positions
  numberArray.forEach((element, index) => {
    element.x = startX + index * (elementWidth + spacing);
  });
}

function drawElement(element, color = 'white', textColor = 'black') {
  ctx.fillStyle = color;
  ctx.fillRect(element.x, element.y, elementWidth, elementHeight);
  
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.strokeRect(element.x, element.y, elementWidth, elementHeight);
  
  ctx.fillStyle = textColor;
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    element.value.toString(), 
    element.x + elementWidth / 2, 
    element.y + elementHeight / 2 + 5
  );
  
  // Draw index
  ctx.fillStyle = 'white';
  ctx.font = "12px Arial";
  ctx.fillText(
    element.index.toString(), 
    element.x + elementWidth / 2, 
    element.y - 10
  );
}

function drawArray() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  numberArray.forEach((element, index) => {
    let color = 'gray';
    let textColor = 'white';
    
    if (index === currentMid) {
      color = 'yellow';
      textColor = 'black';
    } else if (index === currentLeft) {
      color = 'blue';
      textColor = 'white';
    } else if (index === currentRight) {
      color = 'red';
      textColor = 'white';
    } else if (index >= currentLeft && index <= currentRight && currentLeft !== -1) {
      color = 'darkgray';
      textColor = 'white';
    }
    
    drawElement(element, color, textColor);
  });
  
  // Draw target info
  ctx.fillStyle = 'white';
  ctx.font = "18px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Target: ${target}`, 50, 100);
  
  // Draw pointers info
  if (currentLeft !== -1) {
    ctx.fillText(`Left: ${currentLeft}`, 50, 130);
  }
  if (currentRight !== -1) {
    ctx.fillText(`Right: ${currentRight}`, 150, 130);
  }
  if (currentMid !== -1) {
    ctx.fillText(`Mid: ${currentMid}`, 250, 130);
    ctx.fillText(`Mid Value: ${numberArray[currentMid].value}`, 320, 130);
  }
}

function getInput() {
  let valArr = input.value.trim().split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
  
  if (valArr.length === 0) {
    alert("Please enter valid numbers separated by commas.");
    return;
  }
  
  // Check if array is sorted
  for (let i = 1; i < valArr.length; i++) {
    if (valArr[i] < valArr[i-1]) {
      alert("Array must be sorted for binary search!");
      return;
    }
  }
  
  target = parseInt(targetInput.value.trim());
  if (isNaN(target)) {
    alert("Please enter a valid target number.");
    return;
  }
  
  numberArray.length = 0;
  valArr.forEach((num, index) => {
    numberArray.push(new SearchElement(num, index));
  });
  
  setDimensions();
  drawArray();
  binarySearch();
}

function binarySearch() {
  if (numberArray.length === 0) return;
  
  let left = 0;
  let right = numberArray.length - 1;
  let found = false;
  isSearching = true;
  
  function step() {
    if (left > right) {
      currentLeft = -1;
      currentRight = -1;
      currentMid = -1;
      drawArray();
      
      ctx.fillStyle = 'red';
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Target ${target} NOT FOUND!`, canvas.width / 2, 350);
      
      // Add a visual indication
      ctx.fillStyle = 'red';
      ctx.font = "16px Arial";
      ctx.fillText(`Search completed - target not in array`, canvas.width / 2, 380);
      
      isSearching = false;
      console.log(`Target ${target} not found in the array`); 
      return;
    }
    

    currentLeft = left;
    currentRight = right;
    currentMid = Math.floor((left + right) / 2);
    
    drawArray();
    
    // Draw comparison arrows and text
    ctx.fillStyle = 'white';
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    
    const midValue = numberArray[currentMid].value;
    
    if (midValue === target) {
      // Found the target
      setTimeout(() => {
        ctx.fillStyle = 'green';
        ctx.font = "24px Arial";
        ctx.fillText(`Target ${target} FOUND at index ${currentMid}!`, canvas.width / 2, 350);
        
        // Highlight found element
        drawElement(numberArray[currentMid], 'green', 'white');
        isSearching = false;
      }, 800);
      return;
    } else if (midValue < target) {
      ctx.fillStyle = 'orange';
      ctx.fillText(`${midValue} < ${target}, search right half`, canvas.width / 2, 320);
      setTimeout(() => {
        left = currentMid + 1;
        step();
      }, 1500);
    } else {
      ctx.fillStyle = 'orange';
      ctx.fillText(`${midValue} > ${target}, search left half`, canvas.width / 2, 320);
      setTimeout(() => {
        right = currentMid - 1;
        step();
      }, 1500);
    }
  }
  
  setTimeout(step, 500);
}

// Initialize with a sample
window.onload = function() {
  input.value = "1,3,5,7,9,11,13,15,17,19";
  targetInput.value = "11";
};
