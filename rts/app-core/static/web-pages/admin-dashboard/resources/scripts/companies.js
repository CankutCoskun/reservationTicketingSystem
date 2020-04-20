var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {
        const data = JSON.parse(this.responseText);
        console.log("INFO LEVEL: ", data);

        data.forEach(function (company) {

            var row = document.createElement('tr');
            row.setAttribute('class', 'event-row');

            var rowcol = document.createElement('td');
            var rowimage = document.createElement('img');

            rowimage.setAttribute('class', 'card-img-top');
            rowimage.setAttribute('src', '/' + event.imagePath);
            rowimage.setAttribute('data-holder-rendered', true);
            rowimage.style.height = "225px";
            rowimage.style.width = "100%";
            rowimage.style.display = "block";




        });
    }
}

xhttp.open("GET", "api/companies", true);
xhttp.send();
