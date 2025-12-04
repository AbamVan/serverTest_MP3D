import { Server } from "socket.io";

const io = new Server(5173, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(3003);

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

  socket.emit("hello");

  io.emit("characters", characters);

  // socket.on("move", (position) => {
  //     const character = characters.find((character) => character.id === socket.id);
  //     character.position = position;
  //     io.emit("characters", characters);
  // });

  socket.on("move", (position) => {
    const character = characters.find((c) => c.id === socket.id);
    if (character) {
      character.position = position;

      io.emit("updateCharacter", {
        id: socket.id,
        position: character.position,
        // randomColor: character.randomColor,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("characters", characters);
  });
});
