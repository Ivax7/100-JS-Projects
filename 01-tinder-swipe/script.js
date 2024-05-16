const DECISION_THRESHOLD = 75 //distancia a la cual se detecta que se ha tomado una decisión
let isAnimating = false;
let pullDeltaX = 0 // distancia que la card se está arrastrando

function startDrag (event) {
  if(isAnimating) return

  // get the first article element

  const actualCard = event.target.closest("article")

  // get initial position of mouse or finger
  const startX = event.pageX ?? event.touches[0].pageX; // para detectar el primer touch en caso de que se toque con varios dedos
  
  // listen the mouse and touch mevements
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);
  
  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });
  
  function onMove(event){
    // current position of mouse or finger
    const currentX = event.pageX ?? event.touches[0].pageX;
    
    // the distance between the initial and current position
    pullDeltaX = currentX - startX;

    // no hay distancia recorrida
    if(pullDeltaX == 0) return;
    // change the flag to indicate we are animating
    isAnimating = true
    // cuanto mas arrastramos la carta, más gira
    // calculate the rotation of the card using the distance
    const deg = pullDeltaX / 15
    
    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
    // change the cursor to grabbing
    actualCard.style.cursor = 'grabbing'

    // change opacity of the choice info

    const opacity = Math.abs(pullDeltaX) / 100;
    const isRight = pullDeltaX > 0;

    const choiceEl = isRight 
    ? actualCard.querySelector('.choice.like')
    : actualCard.querySelector('.choice.nope')
    
    choiceEl.style.opacity = opacity
  }

  function onEnd(event){
  // remove the mouse and touch mevements
  document.removeEventListener("mousemove", onMove);
  document.removeEventListener("mouseup", onEnd);
  
  document.removeEventListener("touchmove", onMove, { passive: true });
  document.removeEventListener("touchend", onEnd, { passive: true });
  

  // saber si el usuario tomó una decision
  // para ello tenemos que saber si la distancia que ha recorrido ha sido suficiente

  const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD;
  
  // si la distancia recorrida es mayor al umbral de decisión
  if(decisionMade){
    // check if number is positive or negative
    const goRight = pullDeltaX >= 0;
    const goLeft = !goRight;

    // add class acording to the decision
    actualCard.classList.add(goRight ? 'go-right' : 'go-left')
    actualCard.addEventListener('transitionend', () => {
      actualCard.remove();
    }) // modificador de suscripción de evento 1 vez (en este caso es opcional)
    
  } else{
    actualCard.classList.add('.reset')
    actualCard.classList.remove('go-right','go-left')

    }
  
    // reset the variables
    actualCard,addEventListener('transitionend', ()=>{
      actualCard.removeAttribute('style');
      actualCard.classList.remove('reset');

      pullDeltaX = 0;
      isAnimating = false;
    })
  }
}


document.addEventListener("mousedown", startDrag)
document.addEventListener("touchstart", startDrag, { passive: true })