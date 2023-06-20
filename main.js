const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1'
});

api.defaults.headers.common['X-API-KEY'] = 'live_LpjOdxs7nGuvpihAAaFFdie51sTU8WhFCUwJCa4vuvw7KZv6flSpL2Rt0zUhSQTr';
const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=4';
const API_URL_FAVORITES= 'https://api.thecatapi.com/v1/favourites?';

const API_REST = 'api_key=live_LpjOdxs7nGuvpihAAaFFdie51sTU8WhFCUwJCa4vuvw7KZv6flSpL2Rt0zUhSQTr';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
//Este endpoint es dinámico (me pide el id). No guardo un string de la url sino que guardo una función en la que recibo el id.


const API_URL_UPLOAD= 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('error');
//este se llama en CADA llamado a una API, en caso de que el rest.status sea distinto a 200.

const btbRecargar = document.querySelector("#recargar");
    


    // fetch(URL)
    // .then(res => res.json())
    // .then(data => {
    //    const img = document.querySelector('img'); 
    //    img.src = data[0].url;  
    // }); 


async function loadRandomMichis() {
        const res = await fetch(API_URL_RANDOM); //await porque es un llamado asincrono.
        const data = await res.json();   // Lo PARCEAMOS/transformamos a json.     
        console.log('Random');
        console.log(data);

        //lo agregamos al HTML con un span.error
        if (res.status !== 200) {
            spanError.innerHTML = "Hubo un error: " + res.status;
        } else  {
            const img1 = document.querySelector('#img1');
            const img2 = document.querySelector('#img2');
            const img3 = document.querySelector('#img3'); 
        
            const btn1 = document.getElementById('btn1');
            const btn2 = document.getElementById('btn2');
            const btn3 = document.getElementById('btn3');
            
            
            img1.src = data[0].url; //La url de la imagen.
            img2.src = data[1].url;
            img3.src = data[2].url;

            btn1.onclick = () => saveFavouriteMichi(data[0].id);
            btn2.onclick = () => saveFavouriteMichi(data[1].id); 
            btn3.onclick = () => saveFavouriteMichi(data[2].id);
        }
        

}
        

//función para cargar imagen favorita
async function loadFavouriteMichis(id) {
        const res = await fetch(API_URL_FAVORITES, {
            method: 'GET',
            headers: {
                'X-API-KEY': 'live_LpjOdxs7nGuvpihAAaFFdie51sTU8WhFCUwJCa4vuvw7KZv6flSpL2Rt0zUhSQTr',
            },
        });    
        const data = await res.json();  //EL IF DEBE ESTAR ANTES DEL DATA PARA QUE EL ERROR SE REFLEJE EN EL SPAN
        console.log('Favoritos');        
        console.log(data);
        
        //en cada función que utiliza una API nos fijamos si hay un error (=/= 200) o no (200)
        if (res.status !== 200) {
            spanError.innerHTML="hubo un error: " + res.status
        }  else {
            const section = document.getElementById('favoriteMichis');
            section.innerHTML = "";  //Debo limpiar nuestro HTML para que no se dupliquen los articles de los michis cada vez que llame a esta función (loadFavoriteMichis).
            const h2 = document.createElement('h2');  //Creo estos para volver a crear el titulo de "Michis Favoritos" (ya que queremos que se borren solo los articles, no el titulo)
            const h2Text = document.createTextNode('Michis Favoritos');
            h2.appendChild(h2Text);
            section.appendChild(h2); //Ya que estoy metiendo esto a "section", debo ccrear section antes.

            data.forEach(michi => {
                
                const article = document.createElement('article');
                const img = document.createElement('img');
                const btn = document.createElement('button');
                const btnText = document.createTextNode('Sacar al michi de favoritos');
                
                img.src = michi.image.url;
                img.width = 300;
                btn.appendChild(btnText);
                btn.onclick = () => deleteFavouriteMichi(michi.id);
                article.appendChild(img);
                article.appendChild(btn);
                section.appendChild(article);


            });
    }
}






//función con fetch de tipo POST.
async function saveFavouriteMichi(id) {
    
    const {data, status} = await api.post('/favourites', {
        image_id: id,

    });
    


//     const res = await fetch(API_URL_FAVORITES, {    //await porque es la parte asincrona. FETCH para agarrar esa API, y la ruta de esa API donde voy a tener esa info esta en la documentación.
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-API-KEY': 'live_LpjOdxs7nGuvpihAAaFFdie51sTU8WhFCUwJCa4vuvw7KZv6flSpL2Rt0zUhSQTr'
//         },
//         body: JSON.stringify({
//             image_id: id
//         }), 
//     }); 

//     const data = await res.json();

     console.log('Save')


     if (status !== 200) {   //Esto lo agregué sólo para que, si tengo un error (una respuesta que no sea 200) me plasme en la pagina la explicación del problema.
         spanError.innerHTML= "Hubo un error: " + status + data.message;
     } else {    // SI OCURRE, SI GUARDO UN MICHI EN FAVS, SI NO HAY ERROR
         console.log("Michi guardado en favoritos");
         loadFavouriteMichis();
     }       
 }



async function deleteFavouriteMichi(id) {
    const res = await fetch (API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': 'live_LpjOdxs7nGuvpihAAaFFdie51sTU8WhFCUwJCa4vuvw7KZv6flSpL2Rt0zUhSQTr',
        }        
    }); 
    const data = await res.json();



    if (res.status !== 200) {   //Esto lo agregué sólo para que, si tengo un error (una respuesta que no sea 200) me plasme en la pagina la explicación del problema.
        spanError.innerHTML= "Hubo un error: " + res.status + data.message;
    }  else {
        console.log("Michi eliminado de favoritos")
        loadFavouriteMichis(); //Para que al eliminar al michi DESAPAREZCA inmediatamente y no tenga que primero recargar la pagina.
    }             
    
}



async function uploadMichiPhoto() {
    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form); //le envio mi formulario y asi FormData agarra todos los valores de los inputs y los agregará a nuestra instancia FormData

    console.log(formData.get('file'))

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            'X-API-KEY': 'live_LpjOdxs7nGuvpihAAaFFdie51sTU8WhFCUwJCa4vuvw7KZv6flSpL2Rt0zUhSQTr',
        },
        body: formData, 
    })

}





    loadRandomMichis();
    loadFavouriteMichis();

btbRecargar.addEventListener('click', loadRandomMichis);


