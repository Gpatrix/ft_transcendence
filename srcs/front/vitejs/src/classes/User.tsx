
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
    // ajouter profile link ?
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


  static findUserById(users: User[], userId: number): User | undefined {
    return users.find(user => user.id === userId);
  }

  static saveUserData = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  };

  static getUserData = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };
}

export default User;
