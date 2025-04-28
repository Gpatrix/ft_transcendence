
// A utiliser pour passer un user en props ?
// interface UserProps {
//   id: number;
//   name: string;
//   email: string;
// }

class User {
  id: number;
  name: string;
  email: string;
  imageUrl: string;

  constructor(id: number, name: string, email: string, imageUrl:string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.imageUrl = imageUrl;
  }

  updateName(newName: string) {
    this.name = newName;
  }

  updateEmail(newEmail: string) {
    this.email = newEmail;
  }

  updateimageUrl(newImageUrl: string) {
    this.imageUrl = newImageUrl;
  }

  getUserInfo() {
    return `ID: ${this.id}, Nom: ${this.name}, Email: ${this.email}, ImageUrl: ${this.imageUrl}`;
  }
}

// Composant React utilisant la classe User
// const UserComponent: React.FC = () => {
//   const [user, setUser] = useState(new User(1, 'John Doe', 'john.doe@example.com'));

//   const handleNameChange = () => {
//     user.updateName('Jane Doe');
//     setUser(new User(user.id, user.name, user.email)); // Mettre à jour l'état pour re-render
//   };

//   const handleEmailChange = () => {
//     user.updateEmail('jane.doe@example.com');
//     setUser(new User(user.id, user.name, user.email)); // Mettre à jour l'état pour re-render
//   };

//   return (
//     <div>
//       <h1>Informations de l'utilisateur</h1>
//       <p>{user.getUserInfo()}</p>
//       <button onClick={handleNameChange}>Changer le nom</button>
//       <button onClick={handleEmailChange}>Changer l'email</button>
//     </div>
//   );
// };

export default User;
