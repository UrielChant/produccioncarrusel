url_endpoint='https://api-carousel-prod.nueve09.io/v1/';//'https://api-carousel-prod.nueve09.io/v1/'; 
var temporal="";
var identidad='';
//------------------Inicio de sesion url+login------------------------
async function iniciarSesion() {
    const email= document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = {
        email,
        password
    };
    try {
        const response = await fetch(url_endpoint+'users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const primero  = await response.json();
            token=primero.data.token;
            user=primero.data.user.email;
            console.log(token,user);
            localStorage.setItem('token',token);
            localStorage.setItem('user', user);
            document.getElementById('login').style.display = 'none';
            document.getElementById('anuncios').style.display = 'block';
            refrescar();
        } else {
            alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
//----------------------------------------------------------------------------------------

//------------------getpool de anuncios url+ads--------------------------
async function refrescar() {
            //console.log(data1.password);
    try {
        const token=localStorage.getItem('token');
            const response = await fetch(url_endpoint+'ads?page=1&page_size=18', {//  /mobile   <--este faltante de liga me ayuda a entrar a un entorno de prueba/la paginacion debe ser desde aqui para andar subiendo los archivos
            //ads?page=1&page_size=1
            method: 'GET',
            headers: {
           'Content-Type': 'application/json',
           'Authorization':`Bearer ${token}`
                  }
                    
         });
        const data=await response.json();
        const ads=data.data.ads;
        if (response.ok) {
            const tableBody = document.querySelector('#tablaDatos tbody');
            tableBody.innerHTML = '';
            var conteo=0;
            
                ads.forEach(item => {
                    const row = tableBody.insertRow();
                    row.insertCell(0).textContent = item.name;
                    row.insertCell(1).textContent = item.alias;
                    row.insertCell(2).textContent = item.position;
                    row.insertCell(3).textContent = item.call_to_action;
                    row.insertCell(4).textContent = item.id;
                    row.insertCell(5).textContent = item.status;
                    row.insertCell(6).textContent = item.user_id;
                    row.insertCell(7).textContent = item.start_date.substring(0,10);
                    row.insertCell(8).textContent = item.end_date.substring(0,10);
                    // row.insertCell().textContent = item.image;
                    // console.log(typeof item.image);
                    var texturl=item.image;
                
                // const linkbutton = document.createElement("button");
                // linkbutton.textContent = texturl.substring(texturl.length-15);
                // linkbutton.addEventListener("click", () => src=texturl);//aqui se coloca el identificador  para realizar supresion
                    row.insertCell(9).textContent=texturl.substring(texturl.length-15);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Eliminar";
                deleteButton.addEventListener("click", () => borraranuncio(item.id));//aqui se coloca el identificador  para realizar supresion
                row.insertCell(10).appendChild(deleteButton);

                const viewButton = document.createElement("button");
                viewButton.textContent = "Visualizar";
                viewButton.addEventListener("click", () => veranuncio(item.id)); //aqui se coloca el identificador  para realizar lectura
                row.insertCell(11).appendChild(viewButton);

            });

        } else {
            console.error('Error al obtener los datos:', data.error);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
};
//----------------------------------------------------------------------

//------------------------visualiza anuncio url+ads+paginacion-------------------------------------------------------
async function veranuncio(itemId) {
    document.getElementById('anuncios').style.display = 'none';
    document.getElementById('anuncioid').style.display = 'block';
    try {
        const token=localStorage.getItem('token');
        const response = await fetch(url_endpoint+`ads/${itemId}`, {//?page=2&page_size=1
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
        });
    const data = await response.json();
    const ads=data.data.ad;
    temporal=[ads.name,ads.alias,ads.position,ads.call_to_action];
    if (response.ok) {
        const tableBody = document.querySelector('#tablaDatosads tbody');
        tableBody.innerHTML = ''; 

        var row2 = tableBody.insertRow();
        row2.insertCell(0).textContent = ads.name;
        row2.insertCell(1).textContent = ads.alias;
        row2.insertCell(2).textContent = ads.position;
        row2.insertCell(3).textContent = ads.call_to_action;
        row2.insertCell(4).textContent = ads.id;
        row2.insertCell(5).textContent = ads.status;
        row2.insertCell(6).textContent = ads.user_id;
        row2.insertCell(7).textContent = ads.start_date.substring(0,10);
        row2.insertCell(8).textContent = ads.end_date.substring(0,10);
        identidad=ads.id;
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.addEventListener("click", () => borraranuncio(ads.id));//aqui se coloca el identificador  para realizar supresion
        row2.insertCell(9).appendChild(deleteButton);
        
        var row2 = tableBody.insertRow();
        var celdai=row2.insertCell();
        celdai.colSpan=10;
        
        var image=new Image();
        image.src=ads.image;
        image.style.maxWidth = "1080px"; 
        image.style.maxHeight = "600px"; 
        image.style.width = "100%";      
        image.style.height = "auto";
        celdai.appendChild(image);

    } else {
        console.error('Error al obtener los datos:');
    }
}
catch (error) {
    console.error('Error de red:', error);
}
    
}
//-----------------------------------------------------------------------------------

// -------------------------subida de anuncio url+ads--------------------------------------
document.getElementById("enviar").addEventListener("click", async function() {

    const name = document.getElementById("campo1").value;
    const alias = document.getElementById("campo2").value;
    const image = document.getElementById("campo3");
    const call_to_action = document.getElementById("campo4").value;
    const start_date = document.getElementById("campo5").value;
    const end_date = document.getElementById("campo6").value;
    const position = document.getElementById("campo7").value;
    const archivo=image.files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('alias', alias);
    formData.append('start_date', start_date);
    formData.append('end_date', end_date);
    formData.append('position', position);
    formData.append('call_to_action', call_to_action);
    formData.append('image', archivo);
    

try{
    const token=localStorage.getItem('token');
   const response= await fetch(url_endpoint+'ads', {
        method: "POST",
        headers:{
            //'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
        },
        body: formData
    })

    if (response.ok) {
        alert('Subida exitosa');
        document.getElementById('formulariocarrusel').style.display = 'none';
        document.getElementById('anuncios').style.display = 'block';
        refrescar();
      
    } else {
        alert('sucedio un problema.');
    }
}
    catch(error){
        console.error("Error:", error);
    };
});
//-----------------------------------------------------------------------

//-----------------------eliminacion de anuncio url+ads+paginacion----------------------------------------------
async function borraranuncio(itemId) {
    const token=localStorage.getItem('token')
    try {
        const response = await fetch(url_endpoint+`ads/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
        });

    if (response.ok) {
        alert("tu anuncio ha sido eliminado con exito");
        document.getElementById('anuncioid').style.display = 'none';
        document.getElementById('anuncios').style.display = 'block';
        refrescar();

    } 
    else {
        console.error('Error al obtener los datos:', data3.error);
    }
}
catch (error) {
    console.error('Error de red:', error);
}
}
//-----------------------------------------------------------------------------

//-----------------------Modificar anuncio url+ads+paginacion-----------------------------
document.getElementById("actualizar").addEventListener("click", async function(){
    
    const name = document.getElementById("campo11").value;
    const alias = document.getElementById("campo22").value;
    const call_to_action = document.getElementById("campo44").value;
    const start_date = document.getElementById("campo55").value;
    const end_date = document.getElementById("campo66").value;
    const position = document.getElementById("campo77").value;
    let boolva = true;

    // const formData = new FormData();
    // formData.append('name', name);
    // formData.append('alias', alias);
    // formData.append('start_date', start_date);
    // formData.append('end_date', end_date);
    // formData.append('position', position);
    // formData.append('call_to_action', call_to_action);


    
    try {
        const token=localStorage.getItem('token');
        const response = await fetch(url_endpoint+`ads/${identidad}`, {//aqui se debera de poner el id correspondiente
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify ({
                            name:name,
                            alias:alias,
                            start_date:start_date,
                            end_date:end_date,
                            position:position,
                            call_to_action:call_to_action,
                            status:boolva       
            })
        });

        if (response.ok) {
            //const {status2}= await response.json();
           // console.log('Datos actualizados:', status2);
            alert("tu anuncio ha sido actualizado con exito");
            document.getElementById('formulariocarrusel2').style.display = 'none';
            document.getElementById('anuncios').style.display = 'block';
            refrescar();
        } else {
            console.error('Error al actualizar los datos:');
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
});
//---------------------------------------------------------------------------------------------------

//-------------------------funciones para trasladarse------------------------------------------------
document.getElementById("subir").addEventListener("click", function() {
    document.getElementById('anuncios').style.display = 'none';
    document.getElementById('formulariocarrusel').style.display = 'block';
    })
    
document.getElementById("regresar").addEventListener("click", function() {
    document.getElementById('formulariocarrusel').style.display = 'none';
    document.getElementById('anuncios').style.display = 'block';
    })
    
document.getElementById("regresar2").addEventListener("click", function() {
    document.getElementById('anuncioid').style.display = 'none';
    document.getElementById('anuncios').style.display = 'block';
    })

document.getElementById("modificar").addEventListener("click", function() {
    //checar si se quiere dejar o no para el autocompletado
     campo11.value=temporal[0];
     campo22.value=temporal[1];
     campo77.value=temporal[2];
     campo44.value=temporal[3];

    document.getElementById('anuncioid').style.display = 'none';
    document.getElementById('formulariocarrusel2').style.display = 'block';
    })
document.getElementById("regresarf").addEventListener("click", function() {
    document.getElementById('formulariocarrusel2').style.display = 'none';
    document.getElementById('anuncios').style.display = 'block';
    })
//-----------------------------------------------------------------------------------------

//-------------------------------cierre de sesión------------------------------------------
document.getElementById("cerrar").addEventListener("click",  function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user')
    const tableBody = document.querySelector('#tablaDatos tbody');
    tableBody.innerHTML = '';
    document.getElementById('anuncios').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    })
//-----------------------------------------------------------------------------------------

//---------------------------Condicionales---------------------------------------------
document.getElementById('miFormulario').addEventListener('button', function(e) {
    e.preventDefault();
  
    const selectedDate = new Date(document.getElementById('campo5').value);
    const endDate = new Date(document.getElementById('campo6').value);
    const currentDate = new Date();
  
    if (selectedDate < currentDate) {
      alert('Selecciona una fecha posterior a la fecha actual.');
    } else {
      console.log('La fecha seleccionada es válida.');
    }

    if (endDate<currentDate){
        alert('Selecciona una fecha posterior a la fecha actual.');
    } else {
      console.log('La fecha seleccionada es válida.');
    }
  });
  document.getElementById('miFormulario2').addEventListener('button', function(e) {
    e.preventDefault();
  
    const selectedDate = new Date(document.getElementById('campo55').value);
    const endDate = new Date(document.getElementById('campo66').value);
    const currentDate = new Date();
  
    if (selectedDate < currentDate) {
      alert('Selecciona una fecha posterior a la fecha actual.');
    } else {
      console.log('La fecha seleccionada es válida.');
    }

    if (endDate<currentDate){
        alert('Selecciona una fecha posterior a la fecha actual.');
    } else {
      console.log('La fecha seleccionada es válida.');
    }
  });
document.getElementById('login').addEventListener('button', function(e) {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const email = emailInput.value;
  
    if (!email) {
      e.preventDefault();
      emailError.textContent = 'El campo de correo electrónico es obligatorio';
      emailError.style.display = 'block';
    } else if (!isValidEmail(email)) {
      e.preventDefault();
      emailError.textContent = 'Ingrese un correo electrónico válido';
      emailError.style.display = 'block';
    } else {
      emailError.textContent = '';
      emailError.style.display = 'none';
    }
  });
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
//---------------------------------------------------------------------------------------
