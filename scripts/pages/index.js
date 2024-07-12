window.onload = async() => {

    const database = await fetch("/data/database.json")
    .then(responsee => responsee.json())
    
    console.log(database)
    
    const cards = document.getElementById("cards")
    const template = document.getElementById("template-photographer-card")

    for (const photographer of database.photographers) {
        const { id, name, city, country, tagline, price, portrait } = photographer
        const card = template.content.cloneNode(true)
        console.log(card)
        card.querySelector("#link").href = `/photographer.html?id=${id}`
        card.querySelector("#portrait").src = `assets/photographers/${portrait}`
        card.querySelector("#name").textContent = name
        card.querySelector("#location").textContent = `${country} ${city}`
        card.querySelector("#tagline").textContent = tagline
        card.querySelector("#price").textContent = `${price}€/jour`
        cards.appendChild(card)
    }
}
