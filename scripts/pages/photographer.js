window.onload = async() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")

    const database = await fetch("../data/database.json")
    .then(responsee => responsee.json())
    
    const photopgrapher = database.photographers.find(photographer => ""+photographer.id === ""+id)
    if (!photopgrapher) {
        console.error("Photographer not found")
        window.location.href = "/404.html"
        return
    }
    const media = database.media.filter( media => ""+media.photographerId === ""+id)
    
    const section = document.querySelector(".hero")
    section.querySelector("#name").textContent = photopgrapher.name
    section.querySelector("#location").textContent = `${photopgrapher.country}, ${photopgrapher.city}`
    section.querySelector("#tagline").textContent = photopgrapher.tagline
    section.querySelector("#portrait").src = `../assets/photographers/${photopgrapher.portrait}`

    const cards = document.getElementById("cards")
    const templateImage = document.getElementById("card-image")
    const templateVideo = document.getElementById("card-video")
    const fullName = photopgrapher.name
    const firstName = fullName.split(" ").slice(0, -1).join(" ").replace("-", " ")

    const modal = document.querySelector(".modal")
    const arrowLeft = modal.querySelector(".arrow_left")
    const arrowRight = modal.querySelector(".arrow_right")

    const closeModal = (ev) => {
        if (ev.target !== modal) {
            console.log("click on modal frame")
            ev.stopPropagation()
            return
        }
        modal.style.display = "none"
        document.body.style.overflow = "auto"
        modal.removeEventListener("click", closeModal)
    }

    const displayMedium = (medium) => {
        const image = modal.querySelector(".image")
        const video = modal.querySelector(".video")
        if (medium.image) {
            video.classList.remove("open")
            image.src = `../assets/images/${firstName}/${medium.image}`
            image.classList.add("open")
        } else {
            image.classList.remove("open")
            video.src = `../assets/images/${firstName}/${medium.video}`
            video.classList.add("open")
        }
    }

    const openMedium = (medium, index) => {
        console.log("click", medium)
        modal.style.display = "flex"
        document.body.style.overflow = "hidden"
        modal.addEventListener("click", closeModal)
        displayMedium(medium)
        
        arrowLeft.onclick = () => {
            index = (index - 1 + media.length) % media.length
            displayMedium(media[index])
        }
        arrowRight.onclick = () => {
            index = (index + 1) % media.length
            displayMedium(media[index])
        }
    }
    
    media.map( (medium, index) => {
        if (medium.image) {
            const content = templateImage.content.cloneNode(true)
            const card = content.querySelector(".card")
            console.log(card)
            card.setAttribute("id", medium.id)
            card.setAttribute("photographerId", medium.photographerId)
            card.setAttribute("date", medium.date)
            card.setAttribute("price", medium.price)
            card.querySelector("#onclick").onclick = () => { openMedium(medium, index) }
            card.querySelector("#photo").src = `../assets/images/${firstName}/${medium.image}`
            card.querySelector("#title").textContent = medium.title
            card.querySelector("#like").textContent = medium.likes
            cards.appendChild(card)
        } else if (medium.video) {
            const content = templateVideo.content.cloneNode(true)
            const card = content.querySelector(".card")
            console.log(card)
            card.setAttribute("id", medium.id)
            card.setAttribute("photographerId", medium.photographerId)
            card.setAttribute("date", medium.date)
            card.setAttribute("price", medium.price)
            card.querySelector("#onclick").onclick = () => { openMedium(medium, index) }
            card.querySelector("#video").src = `../assets/images/${firstName}/${medium.video}`
            card.querySelector("#title").textContent = medium.title
            card.querySelector("#like").textContent = medium.likes
            cards.appendChild(card)
        }
    })
}