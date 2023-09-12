// IMPORT PACKAGE
const express = require('express');
const fs = require('fs');
const { get } = require('http');
let app = express();
let movies = JSON.parse(fs.readFileSync('./data/movies.json'));

// CREATE SERVER
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server live on http://localhost:${PORT}`);
}) 

app.use(express.json())

// ROUTE HANDLER FUNCTIONS
const getAllMovies = (req, res) => {
    res.status(200).json({
        status: "success",
        count: movies.length,
        data: {
            movies: movies
        }
    })
}

const getMovie = (req, res) => {
    // Convert ID to number type
    const id = req.params.id * 1; 
    // Find movie based on id parameter
    let movie = movies.find(el => el.id === id);
    if (!movie){
        return res.status(404).json({
            status: "fail",
            message: "No movie with ID " + id + " was found!"
        })
    }
    // Send movie in response
    res.status(200).json({
        status: "success",
        data: {
            movie: movie
        }
    })
}

const addMovie = (req,res) => {
    console.log(req.body);
    const newId = movies[movies.length-1].id + 1;
    const newMovie = Object.assign({id: newId}, req.body);
    movies.push(newMovie);
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                movie: newMovie
            }
        })
    })
    // res.send("Created");
}

const updateMovie = (req, res) => {
    let id = req.params.id * 1; 
    let movieToUpdate = movies.find(el => el.id === id);
    if (!movieToUpdate){
        return res.status(404).json({
            status: "fail",
            message: "No movie with ID " + id + " was found!"
        })
    }
    let index = movies.indexOf(movieToUpdate);
    Object.assign(movieToUpdate, req.body);
    movies[index] = movieToUpdate;
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(200).json({
            status: "success",
            data: {
                movie: movieToUpdate
            }
        })
    })
}

const deleteMovie = (req, res) => {
    const id = req.params.id * 1;
    const movieToDelete = movies.find(el => el.id === id);
    if (!movieToDelete){
        return res.status(404).json({
            status: "fail",
            message: "No movie with ID " + id + " was found to delete!"
        })
    }
    const index = movies.indexOf(movieToDelete);
    movies.splice(index,1);
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(204).json({
            status: "success",
            data: {
                movie: null
            }
        })
    })
}

// // GET - api/v1/movies
// app.get('/api/v1/movies', getAllMovies);
// // GET - api/v1/movies/id
// app.get('/api/v1/movies/:id', getMovie);
// // POST - api/v1/movies 
// app.post('/api/v1/movies', addMovie);
// // PATCH - api/v1/movies
// app.patch('/api/v1/movies/:id', updateMovie);
// // DELETE - api/v1/movies
// app.delete('/api/v1/movies/:id', deleteMovie);

app.route('/api/v1/movies')
    .get(getAllMovies)
    .post(addMovie)

app.route('/api/v1/movies/:id')
    .get(getMovie)
    .patch(updateMovie)
    .delete(deleteMovie)
