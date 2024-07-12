window.onload = async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const database = await fetch("../data/database.json").then((responsee) =>
    responsee.json()
  );

  const photographer = database.photographers.find(
    (photographer) => "" + photographer.id === "" + id
  );

  if (!photographer) {
    console.error("Photographer not found");
    window.location.href = "/404.html";
    return;
  }
  document
    .querySelectorAll(".photographer_price")
    .forEach((price) => (price.textContent = photographer.price));

  const media = database.media.filter(
    (media) => "" + media.photographerId === "" + id
  );
  const likesArray = readLikes();

  const section = document.querySelector(".hero");
  section.querySelector("#name").textContent = photographer.name;
  section.querySelector(
    "#location"
  ).textContent = `${photographer.country}, ${photographer.city}`;
  section.querySelector("#tagline").textContent = photographer.tagline;
  section.querySelector(
    "#portrait"
  ).src = `../assets/photographers/${photographer.portrait}`;

  const cards = document.getElementById("cards");
  const templateImage = document.getElementById("card-image");
  const templateVideo = document.getElementById("card-video");
  const fullName = photographer.name;
  const firstName = fullName
    .split(" ")
    .slice(0, -1)
    .join(" ")
    .replace("-", " ");

  const modal = document.querySelector(".modal");
  const arrowLeft = modal.querySelector(".arrow_left");
  const arrowRight = modal.querySelector(".arrow_right");

  const closeModal = (ev) => {
    if (ev.target !== modal) {
      console.log("click on modal frame");
      ev.stopPropagation();
      return;
    }
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    modal.removeEventListener("click", closeModal);
  };

  const displayMedium = (medium) => {
    const image = modal.querySelector(".image");
    const video = modal.querySelector(".video");
    if (medium.image) {
      video.classList.remove("open");
      image.src = `../assets/images/${firstName}/${medium.image}`;
      image.classList.add("open");
    } else {
      image.classList.remove("open");
      video.src = `../assets/images/${firstName}/${medium.video}`;
      video.classList.add("open");
    }
  };

  const openMedium = (medium, index) => {
    console.log("click", medium);
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    modal.addEventListener("click", closeModal);
    displayMedium(medium);

    arrowLeft.onclick = () => {
      index = (index - 1 + media.length) % media.length;
      displayMedium(media[index]);
    };
    arrowRight.onclick = () => {
      index = (index + 1) % media.length;
      displayMedium(media[index]);
    };
  };

  media.map((medium, index) => {
    let content = null;
    let card = null;
    if (medium.image) {
      content = templateImage.content.cloneNode(true);
      card = content.querySelector(".card");
      card.querySelector(
        "#photo"
      ).src = `../assets/images/${firstName}/${medium.image}`;
    } else if (medium.video) {
      content = templateVideo.content.cloneNode(true);
      card = content.querySelector(".card");
      card.querySelector(
        "#video"
      ).src = `../assets/images/${firstName}/${medium.video}`;
    }
    card.setAttribute("id", medium.id);
    card.setAttribute("photographerId", medium.photographerId);
    card.setAttribute("date", medium.date);
    card.setAttribute("price", medium.price);
    card.querySelector("#onclick").onclick = () => {
      openMedium(medium, index);
    };
    card.querySelector("#title").textContent = medium.title;
    const updateLike = (countLikes) => {
      card.querySelector("#like").textContent = countLikes;
    };

    updateLike(medium.likes + mediumLiked(likesArray, medium.id));

    card.querySelector(".card_description_like_icon").onclick = () => {
      console.log("hear ", medium.id);
      const userLikes = readLikes();
      if (userLikes.find((id) => id === medium.id)) {
        // delike
        const newLikes = userLikes.filter((id) => id !== medium.id);
        writeLikes(newLikes);
        updateLike(medium.likes);
      } else {
        userLikes.push(medium.id);
        writeLikes(userLikes);
        updateLike(medium.likes + 1);
      }
      updateLikes();
    };
    cards.appendChild(card);
  });
  updateLikes();
};

const updateLikes = () => {
  const hearts = document.querySelectorAll(".card_description_like");
  let count = 0;
  for (let heart of hearts) {
    count += +heart.textContent;
  }
  document
    .querySelectorAll(".media_likecounter")
    .forEach((counter) => (counter.textContent = count));
};

const mediumLiked = (array, mediumId) => {
  return array.find((id) => id === mediumId) ? 1 : 0;
};

const readLikes = () => {
  const ls = localStorage.getItem("likes");
  if (!ls) {
    localStorage.setItem("likes", JSON.stringify([]));
    return [];
  }
  return JSON.parse(ls);
};

const writeLikes = (likeArray) => {
  localStorage.setItem("likes", JSON.stringify(likeArray || []));
};
