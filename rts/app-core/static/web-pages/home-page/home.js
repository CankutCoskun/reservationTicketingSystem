
console.log("home.js is fetched");

var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
    if(this.readyState == 4 && this.status == 200){
        const data = JSON.parse(this.responseText);
        console.log("INFO: ", data);

        counter = 0;
        var items = document.createElement('div');
        items.setAttribute('class', 'carousel-inner');

        data.some( (event)=>{
            var item = document.createElement('div');
            var class_name = "carousel-item";
            if(counter == 0){
                class_name = "carousel-item active";
            }
            item.setAttribute('class', class_name);
                var img = document.createElement('img');
                img.src = event.imagePath;
                img.alt = 'Slide ' + counter.toString();
                var text = document.createElement('div');
                text.id = 'carousel-text';
                    var heading = document.createElement('h5');
                    heading.innerText = event.title;
                    var par = document.createElement('p');
                    par.innerText = event.date;
                    text.appendChild(heading);
                    text.appendChild(par);
                item.appendChild(img);
                item.appendChild(text);
            items.appendChild(item);
            counter = counter + 1;

            //return first 6 element
            return counter === 6;
        });

        var carousel = document.getElementById('myCarousel');
        carousel.appendChild(items);


        let controlInnerHTML = "<a class='carousel-control-prev' href='#myCarousel' role='button' data-slide='prev'>\n" +
                                    "\t<span class='carousel-control-prev-icon' aria-hidden='true'></span>\n" +
                                    "\t<span class='sr-only'>Previous</span>\n"+
                                "</a>\n" + 
                                "<a class='carousel-control-next' href='#myCarousel' role='button' data-slide='next'>\n" +
                                    "\t<span class='carousel-control-next-icon' aria-hidden='true'></span>\n" +
                                    "\t<span class='sr-only'>Next</span>\n" +
                                "</a>\n";

        var control = document.createElement('div');
        control.innerHTML = controlInnerHTML;
        console.log(control.innerHTML);
        carousel.appendChild(control.childNodes[0]);
        carousel.appendChild(control.childNodes[1]);

        data.forEach(function(event){
            var col = document.createElement('div');
            col.setAttribute('class', 'col-md-3');
            
                var card = document.createElement('div');
                card.setAttribute('class', 'card mb-4 box-shadow');
    
                    var card_img = document.createElement('img');
                    card_img.setAttribute('class', 'card-img-top');
                    card_img.setAttribute('src',  event.imagePath);
                    card_img.setAttribute('data-holder-rendered', true );
                    card_img.style.height = "125px";
                    card_img.style.width = "100%";
                    card_img.style.display = "block";
    
                    var card_body = document.createElement('div');
                    card_body.setAttribute('class', 'card-body');
    
                        var p = document.createElement('p');
                        p.setAttribute('class', 'card-text');
                        p.innerText = event.title;
    
                    card_body.appendChild(p);
    
                card.appendChild(card_img);
                card.appendChild(card_body);
    
            col.append(card);
    
            document.getElementById("events").appendChild(col);
    
        });

        
    }
}

xhttp.open("GET", "/api/events", true);
xhttp.send();

                        