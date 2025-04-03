async function loadBreeds() {
    try {
        const response = await fetch('https://api.thecatapi.com/v1/breeds');
        const breeds = await response.json();
        const breedSelect = document.getElementById('breedSelect');

        breeds.forEach(breed => {
            let option = document.createElement('option');
            option.value = breed.id;
            option.textContent = breed.name;
            breedSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar as raças:', error);
    }
}

async function traduzirTexto(texto) {
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|pt`);
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error('Erro na tradução:', error);
        return texto;
    }
}

async function searchCat() {
    const breedId = document.getElementById('breedSelect').value;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (!breedId) {
        resultDiv.innerHTML = '<p>Por favor, selecione uma raça.</p>';
        return;
    }

    try {
        const breedResponse = await fetch('https://api.thecatapi.com/v1/breeds');
        const breeds = await breedResponse.json();
        const breed = breeds.find(b => b.id === breedId);
        
        const imgResponse = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`);
        const imgData = await imgResponse.json();
        const imgUrl = imgData.length > 0 ? imgData[0].url : '';
        
        const nomeTraduzido = await traduzirTexto(breed.name);
        const origemTraduzida = await traduzirTexto(breed.origin);
        const temperamentoTraduzido = await traduzirTexto(breed.temperament);
        const descricaoTraduzida = await traduzirTexto(breed.description);
        const pesoTraduzido = breed.weight.metric;
        const expectativaVida = breed.life_span;
        
        resultDiv.innerHTML = `
            <h2>${await nomeTraduzido}</h2>
            <p><strong>Origem:</strong> ${await origemTraduzida}</p>
            <p><strong>Temperamento:</strong> ${await temperamentoTraduzido}</p>
            <p><strong>Descrição:</strong> ${await descricaoTraduzida}</p>
            <p><strong>Peso:</strong> ${pesoTraduzido} kg</p>
            <p><strong>Expectativa de vida:</strong> ${expectativaVida} anos</p>
            ${imgUrl ? `<img src="${imgUrl}" alt="${await nomeTraduzido}">` : '<p>Imagem não disponível.</p>'}
        `;
    } catch (error) {
        resultDiv.innerHTML = '<p>Erro ao buscar dados. Tente novamente mais tarde.</p>';
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", loadBreeds);
