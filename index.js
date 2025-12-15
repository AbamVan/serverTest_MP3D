import { Server } from "socket.io";

// Railway asigna el puerto en la variable de entorno PORT
const PORT = process.env.PORT || 3003;

// Define el origen permitido desde variable de entorno
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(PORT, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // fuerza ambos transportes
});

const characters = [];

const generateRandomPosition = () => {
  return [Math.random() * (5 - -5) + -5, 0.5, Math.random() * (5 - -5) + -5];
};

const generateRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    randomColor: generateRandomColor(),
  });
  // Bienvenida al usuario que se conecta
  socket.emit("hello");

  // Se envian los datos del juagdor a todos los jugadores (importante por la posicion)
  io.emit("characters", characters);

  socket.on("move", (position) => {
    const character = characters.find((c) => c.id === socket.id);
    if (character) {
      character.position = position;

      // io.emit("updateCharacter", {
      //   id: socket.id,
      //   position: character.position,
      //   // randomColor: character.randomColor,
      // });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
    io.emit("disconnect")
    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("characters", characters);
  });


});
