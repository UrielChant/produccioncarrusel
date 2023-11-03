url_endpoint='https://api-carousel-sandbox.nueve09.io/v1/'; 
//https://api-carousel-prod.nueve09.io  <==posible de produccion
var temporal="";
var identidad=0;
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
            console.log(primero);
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
    const token=localStorage.getItem('token');

            console.log(data1.password);
    try {
            const response = await fetch(url_endpoint+'ads', {//  /mobile   <--este faltante de liga me ayuda a entrar a un entorno de prueba
            method: 'GET',
            headers: {
           'Content-Type': 'application/json',
           'Authorization':`Bearer ${token}`
                  }
                    
         });
        const data=await response.json();
        const ads=data.data.ads;
        const total=data.data.total;
        const page_size=data.data.page_size;
        const page=data.data.page;
        console.log("esperar");
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
                    row.insertCell(7).textContent = item.start_date;
                    row.insertCell(8).textContent = item.end_date;
                    var texturl=item.image;
                    conteo+=1;
                
                const linkbutton = document.createElement("button");
                linkbutton.textContent = texturl.substring(texturl.length-15);
                linkbutton.addEventListener("click", () => src=texturl);//aqui se coloca el identificador  para realizar supresion
                row.insertCell(9).appendChild(linkbutton);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Eliminar";
                deleteButton.addEventListener("click", () => borraranuncio(item.title));//aqui se coloca el identificador  para realizar supresion
                row.insertCell(10).appendChild(deleteButton);

                const viewButton = document.createElement("button");
                viewButton.textContent = "Visualizar";
                viewButton.addEventListener("click", () => veranuncio(conteo,page_size)); //aqui se coloca el identificador  para realizar lectura
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
async function veranuncio(itemId,cantidad) {
    console.log("prueba de id:",itemId);
    document.getElementById('anuncios').style.display = 'none';
    document.getElementById('anuncioid').style.display = 'block';
    try {
        const response = await fetch(url_endpoint+`ads?page=${itemId}&page_size=${cantidad}`, {//?page=2&page_size=1
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    const data2 = await response.json();
    const ads=data2.data.ads;
    temporal=[data2.title,data2.text,data2.image.uri,data2.link,data2.start_date,data2.end_date];
    if (response.ok) {
        const tableBody = document.querySelector('#tablaDatosads tbody');
        tableBody.innerHTML = ''; 
        console.log(data2);

        var row2 = tableBody.insertRow();
        row2.insertCell(0).textContent = ads.name;
        row2.insertCell(1).textContent = ads.alias;
        row2.insertCell(2).textContent = ads.position;
        row2.insertCell(3).textContent = ads.call_to_action;
        row2.insertCell(4).textContent = ads.id;
        row2.insertCell(5).textContent = ads.status;
        row2.insertCell(6).textContent = ads.user_id;
        row2.insertCell(7).textContent = ads.start_date;
        row2.insertCell(8).textContent = ads.end_date;
        var texturl=ads.image;
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.addEventListener("click", () => borraranuncio(ads.id));//aqui se coloca el identificador  para realizar supresion
        row2.insertCell(9).appendChild(deleteButton);
        var row2 = tableBody.insertRow();
        var celdai=row2.insertCell();
        celdai.colSpan=10;
        var image=new Image();
        image.src=ads.image;
        celdai.appendChild(image);

    } else {
        console.error('Error al obtener los datos:', ads.error);
    }
}
catch (error) {
    console.error('Error de red:', error);
}
    
}
//-----------------------------------------------------------------------------------

// -------------------------subida de anuncio url+ads--------------------------------------
document.getElementById("enviar").addEventListener("click", async function() {

    const campo1 = document.getElementById("campo1").value;
    const campo2 = document.getElementById("campo2").value;
    const campo3 = document.getElementById("campo3").value;
    const campo4 = document.getElementById("campo4").value;
    const campo5 = document.getElementById("campo5").value;
    const campo6 = document.getElementById("campo6").value;


    const formData = new FormData();
    formData.append("campo1", campo1);
    formData.append("campo2", campo2);
    formData.append("campo3", campo3);
    formData.append("campo4", campo4);
    formData.append("campo5", campo5);
    formData.append("campo6", campo6);
try{
   const response= await fetch(url_endpoint+'ads', {
        method: "POST",
        body: formData
    })

    if (response.ok) {
        const { estado } = await response.json();
        console.log(estado);
        alert('Subida exitosa');
        //aqui lo regresara hacia la pagina anterior dando un refrescamiento de datos
        document.getElementById('formulariocarrusel').style.display = 'none';
        document.getElementById('anuncios').style.display = 'block';
      
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
    
    const campo11 = document.getElementById("campo11").value;
    const campo22 = document.getElementById("campo22").value;
    const campo33 = document.getElementById("campo33").value;
    const campo44 = document.getElementById("campo44").value;
    const campo55 = document.getElementById("campo55").value;
    const campo66 = document.getElementById("campo66").value;


    const formData = new FormData();
    formData.append("campo11", campo11);
    formData.append("campo22", campo22);
    formData.append("campo33", campo33);
    formData.append("campo44", campo44);
    formData.append("campo55", campo55);
    formData.append("campo66", campo66);
    const token=localStorage.getItem('token')
    try {
        const response = await fetch(url_endpoint+`ads/${campo11}`, {//aqui se debera de poner el id correspondiente
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
            body:formData
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
    //campo33.value=temporal[2];
    campo44.value=temporal[3];
    campo55.value=temporal[4];
    campo66.value=temporal[5];
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