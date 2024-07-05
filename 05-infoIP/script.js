const OPTIONS = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '71e59e906dmshfdv9ed284df2469p1b599cjsn0355f0f200d5',
    'X-RapidAPI-Host': 'ip-geolocation-and-detection.p.rapidapi.com'
  }
}

const fetchIpInfo = ip => {
  return fetch(`https://freeipapi.com/api/json/${ip}`, OPTIONS)
    .then(res => res.json())
    .catch(err => console.error(err))
}

const $ = selector => document.querySelector(selector)

const $form = $('#form');
const $input = $('#input');
const $submit = $('#submit');
const $results = $('#results');

$form.addEventListener('submit', async (event) => {
  event.preventDefault() // evitamos el comportamiento por defecto para que no se refresque la página al hacer click
  const {value} = $input;
  if(!value) return

  $submit.setAttribute('disabled', '')
  $submit.setAttribute('aria-busy', 'true')
  
  const ipInfo = await fechIpInfo(value)
  
  if(ipInfo) {
    $results.innerHTML = JSON.stringify(ipInfo, null, 2)
  }
  $submit.removeAttribute('disabled')
  $submit.removeAttribute('aria-busy')
  
})