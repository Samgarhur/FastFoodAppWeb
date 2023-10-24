//Funcion para coger todas las comandas
export async function getComandas() {
  const response = await fetch(`http://localhost:3001`);
  const peliculas = await response.json();
  return peliculas.Search;
}

//Funcion para coger todas las aceptadas
export async function getComandasAceptadas() {
  const response = await fetch(`http://localhost:3001`);
  const peliculas = await response.json();
  return peliculas.Search;
}

//Funcion para coger todas las comandas finalizadas
export async function getComandasFinalizadas() {
  const response = await fetch(`http://localhost:3001`);
  const peliculas = await response.json();
  return peliculas.Search;
}

export async function estatComandas(id,estat) {
  const response = await fetch(`http://localhost:3001/${id},${estat}`);
  const info = await response.json();
  return info;
}

export async function comandaFinalitzada(id,finalitzada) {
  const response = await fetch(`http://localhost:3001/${id},${finalitzada}`);
  const info = await response.json();
  return info;
}


export async function getProductes() {
  console.log(vueObject) 
  const response = await fetch('http://localhost:3001/');
  const preguntas = await response.json();
  vueObject.preguntes = preguntas.preguntas;
}


export async function deleteProducte(id) {
  const response = await fetch(`http://localhost:3001/${id}`,
    { method: 'DELETE' });
  console.log(response);  
  
}

export async function addProducte(dadesProducte) {
  console.log("datos recibidos: " + dadesProducte)
  const response = await fetch(`http://localhost:3001/`,
    {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(dadesProducte),
      mode: "cors"
    },);    

}

export async function updateProducte(dadesProductemodificar, id) {
  console.log("datos recibidos: "+dadesProductemodificar)
  const response = await fetch(`http://localhost:3001/${id}`,
    {
      method: 'PUT', headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadesProductemodificar),
      mode: "cors"
    },);   

}


