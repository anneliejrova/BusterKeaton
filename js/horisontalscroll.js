const scroller = document.getElementById("movieContainer");
if (!scroller) {
  console.error("movieContainer hittades inte");
}

let isDown = false;
let startX = 0;
let startScrollLeft = 0;

scroller.addEventListener("pointerdown", (e) => {
  isDown = true;
  scroller.setPointerCapture(e.pointerId);
  startX = e.clientX;
  startScrollLeft = scroller.scrollLeft;
});

scroller.addEventListener("pointermove", (e) => {
  if (!isDown) return;
  const dx = e.clientX - startX;
  scroller.scrollLeft = startScrollLeft - dx;
});

scroller.addEventListener("pointerup", () => {
  isDown = false;
  snapToNearestCard();
});

scroller.addEventListener("pointercancel", () => {
  isDown = false;
});

function snapToNearestCard() {
  const cards = [...scroller.querySelectorAll(".card")];
  if (!cards.length) return;

  const scrollerCenter =
    scroller.scrollLeft + scroller.clientWidth / 2;

  let best = cards[0];
  let bestDist = Infinity;

  for (const card of cards) {
    const cardCenter =
      card.offsetLeft + card.offsetWidth / 2;
    const dist = Math.abs(cardCenter - scrollerCenter);

    if (dist < bestDist) {
      bestDist = dist;
      best = card;
    }
  }

  scroller.scrollTo({
    left:
      best.offsetLeft -
      (scroller.clientWidth - best.offsetWidth) / 2,
    behavior: "smooth",
  });
}
