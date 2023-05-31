 const canvas = document.querySelector("canvas"),
 toolbtns = document.querySelectorAll(".tool"),
 fillcolor= document.querySelector("#fill-color"),
 sizeslider= document.querySelector("#size-slider"),
 colorbtn= document.querySelectorAll(".colors .option"),
 colorpicker= document.querySelector("#color-picker"),
 clearcanvas= document.querySelector(".clear-canvas"),
 saveimg= document.querySelector(".save-img"),
 ctx = canvas.getContext("2d");

//  global var with default value
 let prevMouseX, prevMouseY, snapshot,
 isdrawing = false,
 selectedtool = "brush", 
 brushwidth = 5,
 selectedcolor ='#000';

 const setcanvasbackground = () =>{
    // setn whole canvas bg to white, so the downloaded img bg will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedcolor; //settn fillstyle back to the selectedcolor, it'll be the brush color
 }

 window.addEventListener("load", () => {
    // setting can w/h
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      setcanvasbackground();
 });

 const drawRect = (e) =>{
    if(!fillcolor.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }else{
        return ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
 }

 const drawCir = (e) =>{
    ctx.beginPath(); //creatn new path to draw circle
    // getting raduis of a circle according to de mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillcolor.checked ? ctx.fill() : ctx.stroke(); //if fillcolor is checked fil circle else draw border circle
 }

 const drawStro = (e) =>{
    ctx.beginPath(); //creatn new path to draw stroke
    ctx.moveTo(prevMouseX, prevMouseY); // movn stroke to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line accdn to d mouse p
    ctx.stroke();
 }

 const drawTri = (e) =>{
    ctx.beginPath(); //creatn new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY); // movn tri to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line accdn to d mouse p
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creatn bottom line of tri
    ctx.closePath(); // closing path of a triangle so the 3rd line darw auto
    ctx.stroke();
    fillcolor.checked ? ctx.fill() : ctx.stroke(); //if fillcolor is checked fil tri else draw border tri
 }

 const startDraw = (e) =>{
    isdrawing = true;
    prevMouseX = e.offsetX; //passing current mousex position as prevmouseX value
    prevMouseY = e.offsetY; //passing current mouseY position as prevmouseY value
    ctx.beginPath();  //creating new path to draw
    ctx.lineWidth = brushwidth; //passing brush size as line width
    ctx.strokeStyle = selectedcolor; //passing selectedcolor as stroke style
    ctx.fillStyle = selectedcolor; //passing selectedcolor as fill style
    // copyn canvas data & passn as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
 }

 const drawing = (e) => {
    if (!isdrawing) return;
    ctx.putImageData(snapshot, 0, 0); //addn copied canvas data on to this canvas

    if (selectedtool === "brush" || selectedtool === "eraser") {
        // if selected tool is eraser den set strokestyle to white
        // to paint white color on to the exixting canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedtool === "eraser" ? "#fff" : selectedcolor;
        ctx.lineTo(e.offsetX, e.offsetY); //creatn line accdn to d mouse pointer
        ctx.stroke();   //drawing/filing line with color  
    }else if (selectedtool === "rectangle") {
        drawRect(e);
    }
    else if (selectedtool === "circle") {
        drawCir(e);
    }
    else if (selectedtool === "stroke") {
        drawStro(e);
    }
    else{
        drawTri(e);
    }
 }

 toolbtns.forEach(btn => {
    btn.addEventListener("click", () => { //adding click event to all tool option and adding active property a selcted tool.
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedtool = btn.id;
        // console.log(selectedtool);
    });
 });

 sizeslider.addEventListener("change", () => brushwidth = sizeslider.value); // passn slider value as brushsize
 
 colorbtn.forEach(btn => {
    btn.addEventListener("click", () => { //addn click event to all color btn
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        //passn selected btn bc as selectedc value
        selectedcolor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
 });

 colorpicker.addEventListener("change", () =>{
    //passn picked color value from color picker to last color btn background
     colorpicker.parentElement.style.background = colorpicker.value;
     colorpicker.parentElement.click();
 });

 clearcanvas.addEventListener("click", () =>{
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clearing whole canvas
    setcanvasbackground();
 });

 saveimg.addEventListener("click", () =>{
    const link = document.createElement("a"); //creatn a element
    link.download = `${Date.now()}.jpg`; //passn current date as link download value
    link.href = canvas.toDataURL(); // passn canvasdata as link href value
    link.click(); //clicking link to download image
 });

 canvas.addEventListener("mousedown", startDraw);
 canvas.addEventListener("mousemove", drawing);
 canvas.addEventListener("mouseup", () => isdrawing = false);

