import express from 'express';
import fetch from 'node-fetch';
import { faker } from '@faker-js/faker';
const catFaces = (await import('cat-ascii-faces')).default;

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

// set up the home page route
app.get('/', (req, res) => {
    res.render('index');
});

// setup the gallery route, which uses the cat picture API
app.get('/gallery', async (req, res) => {
    try {
        let response = await fetch("https://api.thecatapi.com/v1/images/search");
        let data = await response.json();
        let catImageUrl = data[0].url; 
        
        res.render('gallery', { catImage: catImageUrl });
    } catch (error) {
        console.log("Error fetching Cat API:", error);
        res.render('gallery', { catImage: "https://placekitten.com/600/400" }); // Fallback
    }
});

// setup the adoption route which uses faker to grab fake data on the cats
app.get('/adopt', (req, res) => {
    let adoptableCats = [];
    
    // Generate 5 fake cats using Faker
    for(let i = 0; i < 5; i++) {
        adoptableCats.push({
            name: faker.person.firstName(),
            title: faker.person.jobTitle(),
            trait: faker.word.adjective()
        });
    }
    
    res.render('adopt', { cats: adoptableCats });
});

// setup the ascii route which uses this cat face art node package
app.get('/ascii', (req, res) => {
    // Generates a random text-based cat face
    let randomFace = catFaces(); 
    res.render('ascii', { face: randomFace });
});

// setup a totally static route for care tips
app.get('/care', (req, res) => {
    res.render('care');
});

// start the service
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The Cat Club is running on port ${PORT}`);
});