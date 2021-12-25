import { useEffect, useState } from "react";
import axios from "axios";
import Actor from "./Actor";
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
   const movies = await getMovies();
   const actors = await getActorIds();

   const { actorId: cageId } = actors.find(
      (actor) => actor.name === "Nicolas Cage"
   );
   const { actorId: reevesId } = actors.find(
      (actor) => actor.name === "Keanu Reeves"
   );

   const arrOfActors = actors.map(({ actorId, name }) => {
      const c = movies
         .filter(
            (movie) =>
               movie.actors.includes(actorId) && movie.actors.includes(cageId)
         )
         .map((movie) => movie.title);

      const r = movies
         .filter(
            (movie) =>
               movie.actors.includes(actorId) && movie.actors.includes(reevesId)
         )
         .map((movie) => movie.title);

      if (c.length !== 0 && r.length !== 0) {
         return {
            Name: name,
            KRM: r,
            NCM: c,
         };
      }
   });

   return arrOfActors.filter((actor) => actor !== undefined);
};

const App = () => {
   const [actors, setActors] = useState([]);

   const checkResults = async () => {
      const actorData = await getCombinedActors();
      const data = { data: actorData };
      // const res = await axios.post("validation", data); *Getting 400 error although I believe I have the right data*
      setActors(actorData);
   };

   useEffect(() => {
      checkResults();
   }, []);

   return (
      <div className="App">
         <ul>
            {actors &&
               actors.map((actor) => <Actor key={actor.Name} actor={actor} />)}
         </ul>
      </div>
   );
};

export default App;
