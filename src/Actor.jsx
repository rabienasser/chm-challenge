const Actor = ({ actor }) => {
   return (
      <div>
         <h2>{actor.Name}</h2>
         <div>
            <p>Films with Reeves:</p>
            <ul>
               {actor.KRM.map((film, idx) => (
                  <li key={idx}>{film}</li>
               ))}
            </ul>
         </div>
         <div>
            <p>Films with Cage:</p>
            <ul>
               {actor.NCM.map((film, idx) => (
                  <li key={idx}>{film}</li>
               ))}
            </ul>
         </div>
      </div>
   );
};

export default Actor;
