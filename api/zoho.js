function chargerDonneesZoho() {
    const statusDiv = document.getElementById('statusMessage');
    
    // Au lieu d'appeler Zoho, ton site appelle ta fonction Vercel sécurisée
    fetch("/api/zoho")
    .then(response => {
        if (!response.ok) {
            throw new Error("Le serveur proxy n'a pas pu récupérer les données.");
        }
        return response.json();
    })
    .then(data => {
        statusDiv.style.color = "#00FF00";
        statusDiv.innerText = "Données synchronisées avec succès via le serveur sécurisé !";
        
        if(data.data) {
            donneesInitiales = data.data.map(item => {
                const nomCommercial = item.Owner ? item.Owner.name : "Inconnu";
                const estSortant = item.Call_Type === "Outbound" ? 1 : 0;
                const estEntrant = item.Call_Type === "Inbound" ? 1 : 0;
                
                return {
                    nom: nomCommercial,
                    sortants: estSortant,
                    entrants: estEntrant,
                    total: 1
                };
            });

            const listeAgregee = {};
            donneesInitiales.forEach(curr => {
                if(!listeAgregee[curr.nom]) {
                    listeAgregee[curr.nom] = { nom: curr.nom, sortants: 0, entrants: 0, total: 0 };
                }
                listeAgregee[curr.nom].sortants += curr.sortants;
                listeAgregee[curr.nom].entrants += curr.entrants;
                listeAgregee[curr.nom].total += curr.total;
            });

            donneesInitiales = Object.values(listeAgregee);
            donneesAffichees = [...donneesInitiales];
            initialiserTableau();
        } else {
            statusDiv.style.color = "#FFCC00";
            statusDiv.innerText = "Aucun appel trouvé.";
        }
    })
    .catch(error => {
        console.error(error);
        statusDiv.style.color = "#FF0000";
        statusDiv.innerText = "Erreur de connexion : " + error.message;
    });
}
