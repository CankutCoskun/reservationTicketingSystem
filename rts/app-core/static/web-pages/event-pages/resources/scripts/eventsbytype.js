console.log("event.js is fetched");

var xhttp = new XMLHttpRequest();
  
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText);
    console.log("INFO LEVEL: ", data);

    data.forEach(function(event){

        var col = document.createElement('div');
        col.setAttribute('class', 'col-md-4');
        
            var card = document.createElement('div');
            card.setAttribute('class', 'card mb-4 box-shadow');

                var card_img = document.createElement('img');
                card_img.setAttribute('class', 'card-img-top');
                card_img.setAttribute('src', '/' + event.imagePath);
                card_img.setAttribute('data-holder-rendered', true );
                card_img.style.height = "225px";
                card_img.style.width = "100%";
                card_img.style.display = "block";

                var card_body = document.createElement('div');
                card_body.setAttribute('class', 'card-body');

                    var p = document.createElement('p');
                    p.setAttribute('class', 'card-text');
                    p.innerText = event.title;
                    var d_flex = document.createElement('div');
                    d_flex.setAttribute('class', 'd-flex justify-content-between align-items-center');
                    d_flex.innerHTML = "<div class='btn-group'>" +
                                          "<a href='/getEventDetailPage/" + event.eId + "'>" +
                                           "<button type='button' class='btn btn-sm btn-outline-secondary'>View</button> </a>" +
                                          "<button href='' type='button' class='btn btn-sm btn-outline-secondary'>Buy</button>" +
                                        "</div>";

                card_body.appendChild(p);
                card_body.appendChild(d_flex);

            card.appendChild(card_img);
            card.appendChild(card_body);

        col.append(card);

        document.getElementById("events").appendChild(col);
    });
  }
}
var variableJSON = JSON.parse($('#variableJSON').text());
$('#variableJSON').remove();
//var eventtype =   "<%= JSON.stringify(results[0].eType) %>";  
console.log(variableJSON) ;
xhttp.open("GET", "/api/events/bytype/"+ variableJSON , true)
xhttp.send()