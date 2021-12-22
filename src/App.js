import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const baseURL = "https://switch-yam-equator.azurewebsites.net/api/";
axios.defaults.baseURL = baseURL;
axios.defaults.headers.common["x-chmura-cors"] = process.env.REACT_APP_API_KEY;

const getActorIds = async () => {
   try {
      const { data } = await axios.get("actors");
      return data;
   } catch (err) {
      console.log(err);
   }
};

const getMovies = async () => {
   try {
      const { data } = await axios.get("movies");
      return data;
   } catch (err) {
      console.log(err);
   }
};

const getCombinedActors = async () => {
   let cageFilmActors = [];
   let reevesFilmActors = [];
   let combinedActors = [];
   let finalResult = [];

   let unique = (a) => [...new Set(a)];

   const movies = await getMovies();
   const actors = await getActorIds();

   const cage = actors.find((actor) => actor.name === "Nicolas Cage");
   const reeves = actors.find((actor) => actor.name === "Keanu Reeves");

   movies.filter((movie) => {
      const movies = Object.values(movie);
      if (movies[2].includes(cage.actorId)) {
         movies[2].map((actor) => cageFilmActors.push(actor));
      } else if (movies[2].includes(reeves.actorId)) {
         movies[2].map((actor) => reevesFilmActors.push(actor));
      }
   });

   cageFilmActors.forEach((actor) => {
      let ids = [];
      if (reevesFilmActors.includes(actor)) {
         ids.push(actor);
         actors.map((actor) => {
            ids.forEach((id) => {
               if (actor.actorId === id) {
                  combinedActors.push(actor);
               }
            });
         });
      }
   });

   combinedActors = unique(combinedActors);

   combinedActors.forEach((actor) => {
      let result = {
         Name: `${actor.name}`,
         KRMovies: [],
         NCMovies: [],
      };

      movies.forEach((movie) => {
         if (
            movie.actors.includes(actor.actorId) &&
            movie.actors.includes(cage.actorId)
         ) {
            result.NCMovies.push(movie.title);
         } else if (
            movie.actors.includes(actor.actorId) &&
            movie.actors.includes(reeves.actorId)
         ) {
            result.KRMovies.push(movie.title);
         }
      });
      finalResult.push(result);
   });

   return JSON.stringify(finalResult);
};

const App = () => {
   const [actors, setActors] = useState([]);

   const checkResults = async () => {
      const actorData = await getCombinedActors();
      console.log(actorData);
      const data = { data: actorData };
      const res = await axios.post("validation", data);
   };

   useEffect(() => {
      checkResults();
   }, []);

   return (
      <div className="App">
         <h1>hello</h1>
      </div>
   );
};

export default App;
