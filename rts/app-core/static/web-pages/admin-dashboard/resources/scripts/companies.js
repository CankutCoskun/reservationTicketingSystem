const companies=document.querySelector("#companytable > tbody");
console.log("ege");
function loadComp(){
    console.log("ege");
    const req = new XMLHttpRequest();
    req.open("GET", "api/companies", true);
    req.onload=() => {

        try{
            const json=JSON.parse(req.responseText);
            populateComp(json);

        }
        catch(e){
            console.log.apply("hata");
        }


    }
    req.send();
}


function populateComp(json){

    while (companies.firstChild){
        companies.removeChild(companies.firstChild);
    }

    json.forEach((row)=> {
        const tr=document.createElement("tr");

        row.forEach((cell)=>{
            const td=document.createElement("td");
            td.textContent=cell;
            tr.appendChild(td);
        });
        companies.appendChild(tr);
    });
    document.addEventListener("DOMContentLoaded",()=>{loadComp();});
}
