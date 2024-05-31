import { User, IUserCreate, ROL } from "../domain/entities/user.entity";
import { Team, ITeamCreate } from "../domain/entities/team.entity";
import { mongoConnect } from "../domain/repositories/mongo-repository";

// Mock data for users
const usersData: Array<Omit<IUserCreate, "team"> & { team: string; }> = [
  {
    email: "carlos@gmail.com",
    password: "12345677",
    firstName: "Carlos",
    lastName: "Silva",
    team: "River Plate",
  },
  {
    email: "maria@gmail.com",
    password: "password123",
    firstName: "Maria",
    lastName: "Gomez",
    team: "Boca Juniors",
  },
  {
    email: "john@gmail.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    team: "Manchester United",
  },
  {
    email: "jane@gmail.com",
    password: "password123",
    firstName: "Jane",
    lastName: "Smith",
    team: "Liverpool",
  },
  {
    email: "lucas@gmail.com",
    password: "password123",
    firstName: "Lucas",
    lastName: "Brown",
    team: "Real Madrid",
  },
  {
    email: "ana@gmail.com",
    password: "password123",
    firstName: "Ana",
    lastName: "Lopez",
    team: "Barcelona",
  },
  {
    email: "mike@gmail.com",
    password: "password123",
    firstName: "Mike",
    lastName: "Wilson",
    team: "Bayern Munich",
  },
  {
    email: "sara@gmail.com",
    password: "password123",
    firstName: "Sara",
    lastName: "Johnson",
    team: "Juventus",
  },
  {
    email: "david@gmail.com",
    password: "password123",
    firstName: "David",
    lastName: "White",
    team: "Chelsea",
  },
  {
    email: "emma@gmail.com",
    password: "password123",
    firstName: "Emma",
    lastName: "Taylor",
    team: "Paris Saint-Germain",
  },
];

// Mock data for teams
const teamsData: ITeamCreate[] = [
  { name: "River Plate", alias: "Los Millonarios", players: [], score: 0 },
  { name: "Boca Juniors", alias: "Los Xeneizes", players: [], score: 0 },
  { name: "Manchester United", alias: "Red Devils", players: [], score: 0 },
  { name: "Liverpool", alias: "The Reds", players: [], score: 0 },
  { name: "Real Madrid", alias: "Los Blancos", players: [], score: 0 },
  { name: "Barcelona", alias: "Barça", players: [], score: 0 },
  { name: "Bayern Munich", alias: "Die Roten", players: [], score: 0 },
  { name: "Juventus", alias: "La Vecchia Signora", players: [], score: 0 },
  { name: "Chelsea", alias: "The Blues", players: [], score: 0 },
  { name: "Paris Saint-Germain", alias: "Les Parisiens", players: [], score: 0 },
];

const seedDatabase = async (): Promise<void> => {
  await mongoConnect();

  try {
    // Limpiar las colecciones
    await User.deleteMany({});
    await Team.deleteMany({});

    // Insertar equipos y guardar sus referencias
    const createdTeams = await Team.insertMany(teamsData);

    // Crear un diccionario para acceder a los equipos por nombre
    const teamsDict: Record<string, any> = createdTeams.reduce((acc: Record<string, any>, team) => {
      acc[team.name] = team._id;
      return acc;
    }, {});

    // Insertar usuarios y asignar los IDs de los equipos creados a los usuarios
    const usersWithTeamIds = usersData.map((user) => ({
      ...user,
      team: teamsDict[user.team], // Usamos user.team como string para acceder a teamsDict
      role: ROL.PLAYER,
    }));

    const createdUsers = await User.insertMany(usersWithTeamIds);

    // Actualizar equipos con usuarios creados
    for (const user of createdUsers) {
      await Team.findByIdAndUpdate(user.team, { $push: { players: user._id } });
    }

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database", error);
    process.exit(1);
  }
};

void seedDatabase();
